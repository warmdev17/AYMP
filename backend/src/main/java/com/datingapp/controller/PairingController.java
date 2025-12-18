package com.datingapp.controller;

import com.datingapp.dto.ConfirmPairingRequest;
import com.datingapp.dto.PairingCodeResponse;
import com.datingapp.security.JwtUtil;
import com.datingapp.service.PairingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pair")
public class PairingController {
    
    @Autowired
    private PairingService pairingService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
    
    @PostMapping("/code")
    public ResponseEntity<PairingCodeResponse> generateCode(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        PairingCodeResponse response = pairingService.generatePairingCode(userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmPairing(
            @Valid @RequestBody ConfirmPairingRequest confirmRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        pairingService.confirmPairing(confirmRequest.getCode(), userId);
        return ResponseEntity.ok().build();
    }
}

