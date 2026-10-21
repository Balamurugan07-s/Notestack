package com.notestack.service;

import com.notestack.dto.CommentResponseDto;
import com.notestack.dto.NoteResponseDto;
import com.notestack.entity.*;
import com.notestack.exception.ResourceNotFoundException;
import com.notestack.repository.*;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final RatingRepository ratingRepository;
    private final BookmarkRepository bookmarkRepository;
    private final ReportRepository reportRepository;
    private final StorageService storageService;

    public NoteService(NoteRepository noteRepository,
                       UserRepository userRepository,
                       SubjectRepository subjectRepository,
                       CategoryRepository categoryRepository,
                       TagRepository tagRepository,
                       CommentRepository commentRepository,
                       RatingRepository ratingRepository,
                       BookmarkRepository bookmarkRepository,
                       ReportRepository reportRepository,
                       StorageService storageService) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
        this.ratingRepository = ratingRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.reportRepository = reportRepository;
        this.storageService = storageService;
    }

    public Page<NoteResponseDto> searchNotes(Long categoryId, Long subjectId, String department,
                                             Integer semester, String query, String sortBy,
                                             int page, int size, Long currentUserId) {
        Sort sort;
        if ("top-rated".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "averageRating");
        } else if ("most-downloaded".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "downloadCount");
        } else if ("most-viewed".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "viewCount");
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Note> notes = noteRepository.searchNotes(
                categoryId, subjectId,
                (department != null && !department.isBlank()) ? department : null,
                semester,
                (query != null && !query.isBlank()) ? query.trim() : null,
                pageable
        );

        return notes.map(note -> mapToDto(note, currentUserId));
    }

    @Transactional
    public NoteResponseDto getNoteById(Long id, Long currentUserId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));

        // Increment view count
        note.setViewCount(note.getViewCount() + 1);
        noteRepository.save(note);

        return mapToDto(note, currentUserId);
    }

    public NoteResponseDto getNoteByShareToken(String token) {
        Note note = noteRepository.findByShareToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("No note found matching share token"));
        return mapToDto(note, null);
    }

    @Transactional
    public NoteResponseDto uploadNote(MultipartFile file, String title, String description,
                                      Long subjectId, Long categoryId, String tagsStr,
                                      Visibility visibility, Long uploaderId) {
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new ResourceNotFoundException("Uploader not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String storedFilename = storageService.store(file);
        String fileUrl = "/uploads/" + storedFilename;

        Note note = new Note();
        note.setTitle(title.trim());
        note.setDescription(description != null ? description.trim() : "");
        note.setUploader(uploader);
        note.setSubject(subject);
        note.setCategory(category);
        note.setFileUrl(fileUrl);
        note.setFileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : storedFilename);
        note.setFileType(file.getContentType() != null ? file.getContentType() : "application/pdf");
        note.setFileSize(file.getSize());
        note.setVisibility(visibility != null ? visibility : Visibility.PUBLIC);
        note.setShareToken(UUID.randomUUID().toString().replace("-", ""));
        note.setStatus(NoteStatus.APPROVED);

        // Tags parsing
        if (tagsStr != null && !tagsStr.isBlank()) {
            Set<Tag> tags = parseAndSaveTags(tagsStr);
            note.setTags(tags);
        }

        Note savedNote = noteRepository.save(note);
        return mapToDto(savedNote, uploaderId);
    }

    @Transactional
    public void deleteNote(Long id, Long currentUserId, boolean isAdmin) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));

        if (!isAdmin && !note.getUploader().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorized to delete this note");
        }

        // Delete all dependent child records first to satisfy foreign key constraints
        bookmarkRepository.deleteByNoteId(id);
        ratingRepository.deleteByNoteId(id);
        commentRepository.deleteByNoteId(id);
        reportRepository.deleteByNoteId(id);

        // Clear tags association
        if (note.getTags() != null) {
            note.getTags().clear();
            noteRepository.save(note);
        }

        // Delete physical file
        if (note.getFileUrl() != null && note.getFileUrl().startsWith("/uploads/")) {
            String filename = note.getFileUrl().substring("/uploads/".length());
            try {
                storageService.delete(filename);
            } catch (Exception ignored) {}
        }

        noteRepository.delete(note);
    }

    @Transactional
    public Resource downloadNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));

        note.setDownloadCount(note.getDownloadCount() + 1);
        noteRepository.save(note);

        String filename = note.getFileUrl().substring("/uploads/".length());
        return storageService.loadAsResource(filename);
    }

    @Transactional
    public NoteResponseDto rateNote(Long noteId, Integer ratingValue, Long currentUserId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<Rating> existingRating = ratingRepository.findByNoteIdAndUserId(noteId, currentUserId);
        if (existingRating.isPresent()) {
            Rating rating = existingRating.get();
            rating.setRatingValue(ratingValue);
            ratingRepository.save(rating);
        } else {
            Rating rating = new Rating(note, user, ratingValue);
            ratingRepository.save(rating);
        }

        // Recalculate average
        Double avg = ratingRepository.calculateAverageRating(noteId);
        long count = ratingRepository.countByNoteId(noteId);

        note.setAverageRating(avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        note.setTotalRatings((int) count);
        Note updated = noteRepository.save(note);

        return mapToDto(updated, currentUserId);
    }

    @Transactional
    public CommentResponseDto addComment(Long noteId, String content, Long currentUserId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment(note, user, content.trim());
        Comment saved = commentRepository.save(comment);

        return new CommentResponseDto(saved);
    }

    public List<CommentResponseDto> getComments(Long noteId) {
        return commentRepository.findByNoteIdOrderByCreatedAtDesc(noteId)
                .stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleBookmark(Long noteId, Long currentUserId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<Bookmark> bookmark = bookmarkRepository.findByNoteIdAndUserId(noteId, currentUserId);
        if (bookmark.isPresent()) {
            bookmarkRepository.delete(bookmark.get());
            return false;
        } else {
            bookmarkRepository.save(new Bookmark(note, user));
            return true;
        }
    }

    public List<NoteResponseDto> getMyBookmarks(Long currentUserId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(b -> mapToDto(b.getNote(), currentUserId))
                .collect(Collectors.toList());
    }

    public List<NoteResponseDto> getMyNotes(Long currentUserId) {
        return noteRepository.findByUploaderIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(n -> mapToDto(n, currentUserId))
                .collect(Collectors.toList());
    }

    public List<NoteResponseDto> getTrendingNotes() {
        return noteRepository.findTop6ByStatusAndVisibilityOrderByViewCountDesc(NoteStatus.APPROVED, Visibility.PUBLIC)
                .stream()
                .map(n -> mapToDto(n, null))
                .collect(Collectors.toList());
    }

    public List<NoteResponseDto> getRecentNotes() {
        return noteRepository.findTop6ByStatusAndVisibilityOrderByCreatedAtDesc(NoteStatus.APPROVED, Visibility.PUBLIC)
                .stream()
                .map(n -> mapToDto(n, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void reportNote(Long noteId, String reason, String details, Long currentUserId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + noteId));

        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter user not found"));

        Report report = new Report(note, reporter, reason, details);
        reportRepository.save(report);
    }

    private Set<Tag> parseAndSaveTags(String tagsStr) {
        Set<Tag> tags = new HashSet<>();
        String[] parts = tagsStr.split("[,#\\s]+");
        for (String part : parts) {
            String clean = part.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
            if (!clean.isEmpty()) {
                Tag tag = tagRepository.findByName(clean)
                        .orElseGet(() -> tagRepository.save(new Tag(clean)));
                tags.add(tag);
            }
        }
        return tags;
    }

    private NoteResponseDto mapToDto(Note note, Long currentUserId) {
        NoteResponseDto dto = new NoteResponseDto(note);
        if (currentUserId != null) {
            dto.setBookmarkedByCurrentUser(bookmarkRepository.existsByNoteIdAndUserId(note.getId(), currentUserId));
            ratingRepository.findByNoteIdAndUserId(note.getId(), currentUserId)
                    .ifPresent(r -> dto.setUserRating(r.getRatingValue()));
        }
        return dto;
    }
}
