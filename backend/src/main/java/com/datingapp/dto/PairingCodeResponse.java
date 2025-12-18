package com.datingapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PairingCodeResponse {
    private String code;
    private Long expiresInSeconds;
}

