package com.notestack.dto;

import com.notestack.entity.User;

public class UserSummaryDto {
    private Long id;
    private String name;
    private String email;
    private String college;
    private String department;
    private Integer year;
    private String role;
    private String avatarUrl;

    public UserSummaryDto() {}

    public UserSummaryDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.college = user.getCollege();
        this.department = user.getDepartment();
        this.year = user.getYear();
        this.role = user.getRole().name();
        this.avatarUrl = user.getAvatarUrl();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
