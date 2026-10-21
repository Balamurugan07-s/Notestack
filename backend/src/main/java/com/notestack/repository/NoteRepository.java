package com.notestack.repository;

import com.notestack.entity.Note;
import com.notestack.entity.NoteStatus;
import com.notestack.entity.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    Optional<Note> findByShareToken(String shareToken);

    List<Note> findByUploaderIdOrderByCreatedAtDesc(Long uploaderId);

    Page<Note> findByStatusAndVisibility(NoteStatus status, Visibility visibility, Pageable pageable);

    @Query("SELECT n FROM Note n WHERE n.status = 'APPROVED' AND n.visibility = 'PUBLIC' " +
           "AND (:categoryId IS NULL OR n.category.id = :categoryId) " +
           "AND (:subjectId IS NULL OR n.subject.id = :subjectId) " +
           "AND (:department IS NULL OR LOWER(n.subject.department) = LOWER(:department)) " +
           "AND (:semester IS NULL OR n.subject.semester = :semester) " +
           "AND (:query IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "     OR LOWER(n.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "     OR LOWER(n.subject.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Note> searchNotes(@Param("categoryId") Long categoryId,
                           @Param("subjectId") Long subjectId,
                           @Param("department") String department,
                           @Param("semester") Integer semester,
                           @Param("query") String query,
                           Pageable pageable);

    List<Note> findTop6ByStatusAndVisibilityOrderByViewCountDesc(NoteStatus status, Visibility visibility);

    List<Note> findTop6ByStatusAndVisibilityOrderByCreatedAtDesc(NoteStatus status, Visibility visibility);

    List<Note> findByStatusOrderByCreatedAtDesc(NoteStatus status);

    long countByStatus(NoteStatus status);
}
