package com.datingapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlideshowImageResponse {
    private Long id;
    private String imageUrl;
    private Integer orderIndex;
    private Long uploadedByUserId;
    private LocalDateTime createdAt;
}

