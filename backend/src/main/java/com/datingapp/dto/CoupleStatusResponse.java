package com.datingapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoupleStatusResponse {
    private boolean isPaired;
    private Long coupleId;
    private Long partnerId;
    private String partnerDisplayName;
    private LocalDateTime pairedAt;
}

