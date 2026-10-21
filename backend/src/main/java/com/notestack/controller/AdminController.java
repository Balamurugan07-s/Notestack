package com.notestack.controller;

import com.notestack.dto.ApiResponse;
import com.notestack.dto.NoteResponseDto;
import com.notestack.dto.UserSummaryDto;
import com.notestack.entity.NoteStatus;
import com.notestack.entity.Report;
import com.notestack.security.UserPrincipal;
import com.notestack.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/pending-notes")
    public ResponseEntity<List<NoteResponseDto>> getPendingNotes() {
        return ResponseEntity.ok(adminService.getPendingNotes());
    }

    @PutMapping("/notes/{id}/status")
    public ResponseEntity<ApiResponse> updateNoteStatus(
            @PathVariable Long id,
            @RequestParam NoteStatus status) {
        adminService.updateNoteStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Note status updated to " + status));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse> resolveReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "RESOLVED") String status,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        adminService.resolveReport(id, status, adminPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Report status updated"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }
}
