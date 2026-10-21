package com.notestack.controller;

import com.notestack.dto.*;
import com.notestack.entity.Visibility;
import com.notestack.security.UserPrincipal;
import com.notestack.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<Page<NoteResponseDto>> getNotes(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<NoteResponseDto> notes = noteService.searchNotes(
                categoryId, subjectId, department, semester, query, sortBy, page, size, currentUserId
        );
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponseDto> getNoteById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(noteService.getNoteById(id, currentUserId));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoteResponseDto> uploadNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("subjectId") Long subjectId,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "visibility", defaultValue = "PUBLIC") Visibility visibility,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        NoteResponseDto uploaded = noteService.uploadNote(
                file, title, description, subjectId, categoryId, tags, visibility, userPrincipal.getId()
        );
        return ResponseEntity.ok(uploaded);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        noteService.deleteNote(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadNote(@PathVariable Long id) {
        Resource fileResource = noteService.downloadNote(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                .body(fileResource);
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<NoteResponseDto> rateNote(
            @PathVariable Long id,
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        NoteResponseDto updated = noteService.rateNote(id, request.getRating(), userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CommentResponseDto comment = noteService.addComment(id, request.getContent(), userPrincipal.getId());
        return ResponseEntity.ok(comment);
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse> toggleBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean bookmarked = noteService.toggleBookmark(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(
                bookmarked ? "Note bookmarked" : "Bookmark removed",
                bookmarked
        ));
    }

    @GetMapping("/my-notes")
    public ResponseEntity<List<NoteResponseDto>> getMyNotes(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(noteService.getMyNotes(userPrincipal.getId()));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<NoteResponseDto>> getMyBookmarks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(noteService.getMyBookmarks(userPrincipal.getId()));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<NoteResponseDto>> getTrendingNotes() {
        return ResponseEntity.ok(noteService.getTrendingNotes());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<NoteResponseDto>> getRecentNotes() {
        return ResponseEntity.ok(noteService.getRecentNotes());
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<ApiResponse> reportNote(
            @PathVariable Long id,
            @Valid @RequestBody ReportRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        noteService.reportNote(id, request.getReason(), request.getDetails(), userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Note reported to administrators for review. Thank you."));
    }
}
