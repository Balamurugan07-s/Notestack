package com.notestack.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportRequest {

    @NotBlank(message = "Reason is required")
    private String reason;

    private String details;

    public ReportRequest() {}

    public ReportRequest(String reason, String details) {
        this.reason = reason;
        this.details = details;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
