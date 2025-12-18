package com.datingapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class QuickMessageRequest {
    @NotBlank(message = "Message content is required")
    @Size(max = 50, message = "Message must not exceed 50 characters")
    private String content;
}

