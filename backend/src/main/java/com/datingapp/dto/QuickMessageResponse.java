package com.datingapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuickMessageResponse {
    private Long id;
    private String content;
    private Long createdByUserId;
    private LocalDateTime createdAt;
}

