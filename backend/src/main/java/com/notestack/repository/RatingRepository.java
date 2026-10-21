package com.notestack.repository;

import com.notestack.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByNoteIdAndUserId(Long noteId, Long userId);

    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.note.id = :noteId")
    Double calculateAverageRating(@Param("noteId") Long noteId);

    long countByNoteId(Long noteId);

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Rating r WHERE r.note.id = :noteId")
    void deleteByNoteId(@Param("noteId") Long noteId);
}
