package com.notestack.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RatingRequest {

    @NotNull(message = "Rating value is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    public RatingRequest() {}

    public RatingRequest(Integer rating) {
        this.rating = rating;
    }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
}
