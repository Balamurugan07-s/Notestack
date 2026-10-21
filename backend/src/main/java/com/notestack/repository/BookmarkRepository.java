package com.notestack.repository;

import com.notestack.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByNoteIdAndUserId(Long noteId, Long userId);
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByNoteIdAndUserId(Long noteId, Long userId);
    void deleteByNoteIdAndUserId(Long noteId, Long userId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Bookmark b WHERE b.note.id = :noteId")
    void deleteByNoteId(@org.springframework.data.repository.query.Param("noteId") Long noteId);
}
