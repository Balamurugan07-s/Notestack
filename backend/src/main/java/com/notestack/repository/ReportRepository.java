package com.notestack.repository;

import com.notestack.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Report rp WHERE rp.note.id = :noteId")
    void deleteByNoteId(@org.springframework.data.repository.query.Param("noteId") Long noteId);
}
