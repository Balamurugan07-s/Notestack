package com.notestack.dto;

import com.notestack.entity.Note;
import com.notestack.entity.Tag;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class NoteResponseDto {
    private Long id;
    private String title;
    private String description;
    private UserSummaryDto uploader;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private String department;
    private Integer semester;
    private Long categoryId;
    private String categoryName;
    private String categoryCode;
    private List<String> tags;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Integer pageCount;
    private String visibility;
    private String shareToken;
    private Integer viewCount;
    private Integer downloadCount;
    private String status;
    private BigDecimal averageRating;
    private Integer totalRatings;
    private LocalDateTime createdAt;
    private boolean bookmarkedByCurrentUser;
    private Integer userRating;

    public NoteResponseDto() {}

    public NoteResponseDto(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.description = note.getDescription();
        if (note.getUploader() != null) {
            this.uploader = new UserSummaryDto(note.getUploader());
        }
        if (note.getSubject() != null) {
            this.subjectId = note.getSubject().getId();
            this.subjectCode = note.getSubject().getCode();
            this.subjectName = note.getSubject().getName();
            this.department = note.getSubject().getDepartment();
            this.semester = note.getSubject().getSemester();
        }
        if (note.getCategory() != null) {
            this.categoryId = note.getCategory().getId();
            this.categoryName = note.getCategory().getName();
            this.categoryCode = note.getCategory().getCode();
        }
        if (note.getTags() != null) {
            this.tags = note.getTags().stream().map(Tag::getName).collect(Collectors.toList());
        }
        this.fileUrl = note.getFileUrl();
        this.fileName = note.getFileName();
        this.fileType = note.getFileType();
        this.fileSize = note.getFileSize();
        this.pageCount = note.getPageCount();
        this.visibility = note.getVisibility().name();
        this.shareToken = note.getShareToken();
        this.viewCount = note.getViewCount();
        this.downloadCount = note.getDownloadCount();
        this.status = note.getStatus().name();
        this.averageRating = note.getAverageRating();
        this.totalRatings = note.getTotalRatings();
        this.createdAt = note.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UserSummaryDto getUploader() { return uploader; }
    public void setUploader(UserSummaryDto uploader) { this.uploader = uploader; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public Integer getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isBookmarkedByCurrentUser() { return bookmarkedByCurrentUser; }
    public void setBookmarkedByCurrentUser(boolean bookmarkedByCurrentUser) { this.bookmarkedByCurrentUser = bookmarkedByCurrentUser; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }
}
