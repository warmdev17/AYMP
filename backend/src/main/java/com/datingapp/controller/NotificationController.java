package com.datingapp.controller;

import com.datingapp.dto.NotificationRequest;
import com.datingapp.security.JwtUtil;
import com.datingapp.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
    
    @PostMapping("/quick")
    public ResponseEntity<Void> sendQuickNotification(
            @Valid @RequestBody NotificationRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        notificationService.sendQuickNotification(userId, request);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/custom")
    public ResponseEntity<Void> sendCustomNotification(
            @Valid @RequestBody NotificationRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        notificationService.sendQuickNotification(userId, request);
        return ResponseEntity.ok().build();
    }
}

