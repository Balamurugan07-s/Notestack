package com.notestack.service;

import com.notestack.dto.NoteResponseDto;
import com.notestack.dto.UserSummaryDto;
import com.notestack.entity.Note;
import com.notestack.entity.NoteStatus;
import com.notestack.entity.Report;
import com.notestack.entity.User;
import com.notestack.exception.ResourceNotFoundException;
import com.notestack.repository.NoteRepository;
import com.notestack.repository.ReportRepository;
import com.notestack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final NoteRepository noteRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public AdminService(NoteRepository noteRepository,
                        ReportRepository reportRepository,
                        UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public List<NoteResponseDto> getPendingNotes() {
        return noteRepository.findByStatusOrderByCreatedAtDesc(NoteStatus.PENDING)
                .stream()
                .map(NoteResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateNoteStatus(Long noteId, NoteStatus status) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        note.setStatus(status);
        noteRepository.save(note);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional
    public void resolveReport(Long reportId, String status, Long adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(status);
        report.setResolvedAt(LocalDateTime.now());
        if (adminId != null) {
            userRepository.findById(adminId).ifPresent(report::setResolvedBy);
        }
        reportRepository.save(report);
    }

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserSummaryDto::new)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalNotes", noteRepository.count());
        stats.put("pendingNotes", noteRepository.countByStatus(NoteStatus.PENDING));
        stats.put("totalReports", reportRepository.count());
        return stats;
    }
}
