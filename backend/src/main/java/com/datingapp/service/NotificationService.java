package com.datingapp.service;

import com.datingapp.dto.NotificationRequest;
import com.datingapp.entity.Couple;
import com.datingapp.entity.User;
import com.datingapp.repository.CoupleRepository;
import com.datingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    @Autowired
    private CoupleRepository coupleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void sendQuickNotification(Long userId, NotificationRequest request) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        Long partnerId = couple.getUser1Id().equals(userId) 
                ? couple.getUser2Id() 
                : couple.getUser1Id();
        
        // In a real implementation, this would send a push notification
        // For now, we'll just log it. The mobile app will poll or use WebSockets
        System.out.println("Notification to user " + partnerId + ": " + request.getMessage());
        
        // TODO: Integrate with FCM (Firebase Cloud Messaging) or similar push notification service
    }
}

