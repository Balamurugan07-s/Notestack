package com.notestack.repository;

import com.notestack.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByNoteIdOrderByCreatedAtDesc(Long noteId);
    long countByNoteId(Long noteId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Comment c WHERE c.note.id = :noteId")
    void deleteByNoteId(@org.springframework.data.repository.query.Param("noteId") Long noteId);
}
