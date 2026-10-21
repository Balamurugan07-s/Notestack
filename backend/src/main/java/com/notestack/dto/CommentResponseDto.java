package com.notestack.dto;

import com.notestack.entity.Comment;
import java.time.LocalDateTime;

public class CommentResponseDto {
    private Long id;
    private Long noteId;
    private UserSummaryDto user;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponseDto() {}

    public CommentResponseDto(Comment comment) {
        this.id = comment.getId();
        if (comment.getNote() != null) {
            this.noteId = comment.getNote().getId();
        }
        if (comment.getUser() != null) {
            this.user = new UserSummaryDto(comment.getUser());
        }
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNoteId() { return noteId; }
    public void setNoteId(Long noteId) { this.noteId = noteId; }

    public UserSummaryDto getUser() { return user; }
    public void setUser(UserSummaryDto user) { this.user = user; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
