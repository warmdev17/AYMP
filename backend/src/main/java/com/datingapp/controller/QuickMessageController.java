package com.datingapp.controller;

import com.datingapp.dto.NotificationRequest;
import com.datingapp.dto.QuickMessageRequest;
import com.datingapp.dto.QuickMessageResponse;
import com.datingapp.security.JwtUtil;
import com.datingapp.service.NotificationService;
import com.datingapp.service.QuickMessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quick-messages")
public class QuickMessageController {
    
    @Autowired
    private QuickMessageService quickMessageService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
    
    @PostMapping
    public ResponseEntity<QuickMessageResponse> createMessage(
            @Valid @RequestBody QuickMessageRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        QuickMessageResponse response = quickMessageService.createMessage(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<QuickMessageResponse>> getMessages(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<QuickMessageResponse> response = quickMessageService.getMessages(userId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        quickMessageService.deleteMessage(userId, id);
        return ResponseEntity.ok().build();
    }
}

