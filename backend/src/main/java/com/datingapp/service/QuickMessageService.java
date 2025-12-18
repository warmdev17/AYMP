package com.datingapp.service;

import com.datingapp.dto.QuickMessageRequest;
import com.datingapp.dto.QuickMessageResponse;
import com.datingapp.entity.Couple;
import com.datingapp.entity.QuickMessage;
import com.datingapp.repository.CoupleRepository;
import com.datingapp.repository.QuickMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuickMessageService {
    
    @Autowired
    private QuickMessageRepository quickMessageRepository;
    
    @Autowired
    private CoupleRepository coupleRepository;
    
    @Value("${app.quick-message.max-messages}")
    private int maxMessages;
    
    @Transactional
    public QuickMessageResponse createMessage(Long userId, QuickMessageRequest request) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        // Check message limit
        long messageCount = quickMessageRepository.countByCoupleId(couple.getId());
        if (messageCount >= maxMessages) {
            throw new RuntimeException("Maximum number of messages reached");
        }
        
        QuickMessage message = new QuickMessage();
        message.setCoupleId(couple.getId());
        message.setContent(request.getContent());
        message.setCreatedByUserId(userId);
        
        message = quickMessageRepository.save(message);
        
        return new QuickMessageResponse(
                message.getId(),
                message.getContent(),
                message.getCreatedByUserId(),
                message.getCreatedAt()
        );
    }
    
    public List<QuickMessageResponse> getMessages(Long userId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        return quickMessageRepository.findByCoupleIdOrderByCreatedAtAsc(couple.getId())
                .stream()
                .map(message -> new QuickMessageResponse(
                        message.getId(),
                        message.getContent(),
                        message.getCreatedByUserId(),
                        message.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteMessage(Long userId, Long messageId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        QuickMessage message = quickMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getCoupleId().equals(couple.getId())) {
            throw new RuntimeException("Message does not belong to this couple");
        }
        
        quickMessageRepository.delete(message);
    }
}

