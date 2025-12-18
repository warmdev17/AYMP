package com.datingapp.service;

import com.datingapp.dto.ConfirmPairingRequest;
import com.datingapp.dto.PairingCodeResponse;
import com.datingapp.entity.Couple;
import com.datingapp.entity.PairingCode;
import com.datingapp.entity.User;
import com.datingapp.repository.CoupleRepository;
import com.datingapp.repository.PairingCodeRepository;
import com.datingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PairingService {
    
    @Autowired
    private PairingCodeRepository pairingCodeRepository;
    
    @Autowired
    private CoupleRepository coupleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${app.pairing.code-expiration-minutes}")
    private int codeExpirationMinutes;
    
    private final Random random = new Random();
    
    @Transactional
    public PairingCodeResponse generatePairingCode(Long userId) {
        // Check if user is already paired
        if (coupleRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User is already paired");
        }
        
        // Invalidate any existing codes for this user
        pairingCodeRepository.findAll().stream()
                .filter(code -> code.getOwnerUserId().equals(userId) && !code.getUsed())
                .forEach(code -> {
                    code.setUsed(true);
                    pairingCodeRepository.save(code);
                });
        
        // Generate new 6-digit code
        String code = String.format("%06d", random.nextInt(1000000));
        
        // Ensure uniqueness
        while (pairingCodeRepository.findByCodeAndUsedFalseAndExpiresAtAfter(
                code, LocalDateTime.now()).isPresent()) {
            code = String.format("%06d", random.nextInt(1000000));
        }
        
        PairingCode pairingCode = new PairingCode();
        pairingCode.setCode(code);
        pairingCode.setOwnerUserId(userId);
        pairingCode.setExpiresAt(LocalDateTime.now().plusMinutes(codeExpirationMinutes));
        pairingCode.setUsed(false);
        
        pairingCode = pairingCodeRepository.save(pairingCode);
        
        return new PairingCodeResponse(code, (long) (codeExpirationMinutes * 60));
    }
    
    @Transactional
    public void confirmPairing(String code, Long userId) {
        // Check if user is already paired
        if (coupleRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User is already paired");
        }
        
        // Find valid pairing code
        PairingCode pairingCode = pairingCodeRepository
                .findByCodeAndUsedFalseAndExpiresAtAfter(code, LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("Invalid or expired pairing code"));
        
        // Cannot pair with yourself
        if (pairingCode.getOwnerUserId().equals(userId)) {
            throw new RuntimeException("Cannot pair with yourself");
        }
        
        // Check if owner is already paired
        if (coupleRepository.findByUserId(pairingCode.getOwnerUserId()).isPresent()) {
            throw new RuntimeException("Code owner is already paired");
        }
        
        // Mark code as used
        pairingCode.setUsed(true);
        pairingCodeRepository.save(pairingCode);
        
        // Create couple
        Couple couple = new Couple();
        couple.setUser1Id(pairingCode.getOwnerUserId());
        couple.setUser2Id(userId);
        coupleRepository.save(couple);
    }
}

