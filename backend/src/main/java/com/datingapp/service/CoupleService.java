package com.datingapp.service;

import com.datingapp.dto.CoupleStatusResponse;
import com.datingapp.dto.TimerResponse;
import com.datingapp.entity.Couple;
import com.datingapp.entity.User;
import com.datingapp.repository.CoupleRepository;
import com.datingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class CoupleService {
    
    @Autowired
    private CoupleRepository coupleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public CoupleStatusResponse getCoupleStatus(Long userId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElse(null);
        
        if (couple == null) {
            return new CoupleStatusResponse(false, null, null, null, null);
        }
        
        Long partnerId = couple.getUser1Id().equals(userId) 
                ? couple.getUser2Id() 
                : couple.getUser1Id();
        
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        
        return new CoupleStatusResponse(
                true,
                couple.getId(),
                partnerId,
                partner.getDisplayName(),
                couple.getPairedAt()
        );
    }
    
    public TimerResponse getTimer(Long userId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        LocalDateTime pairedAt = couple.getPairedAt();
        Duration duration = Duration.between(pairedAt, LocalDateTime.now());
        long totalSeconds = duration.getSeconds();
        
        return new TimerResponse(pairedAt, totalSeconds);
    }
}

