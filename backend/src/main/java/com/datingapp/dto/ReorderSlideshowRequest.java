package com.datingapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ReorderSlideshowRequest {
    @NotEmpty(message = "Image IDs are required")
    private List<Long> imageIds;
}

