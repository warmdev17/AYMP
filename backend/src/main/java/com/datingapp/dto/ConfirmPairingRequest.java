package com.datingapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ConfirmPairingRequest {
    @NotBlank(message = "Pairing code is required")
    @Pattern(regexp = "^\\d{6}$", message = "Pairing code must be 6 digits")
    private String code;
}

