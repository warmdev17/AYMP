package com.datingapp.controller;

import com.datingapp.dto.CoupleStatusResponse;
import com.datingapp.dto.TimerResponse;
import com.datingapp.security.JwtUtil;
import com.datingapp.service.CoupleService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/couple")
public class CoupleController {
    
    @Autowired
    private CoupleService coupleService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
    
    @GetMapping("/status")
    public ResponseEntity<CoupleStatusResponse> getStatus(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        CoupleStatusResponse response = coupleService.getCoupleStatus(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/timer")
    public ResponseEntity<TimerResponse> getTimer(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        TimerResponse response = coupleService.getTimer(userId);
        return ResponseEntity.ok(response);
    }
}

