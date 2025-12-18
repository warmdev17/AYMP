package com.datingapp.controller;

import com.datingapp.dto.ReorderSlideshowRequest;
import com.datingapp.dto.SlideshowImageResponse;
import com.datingapp.security.JwtUtil;
import com.datingapp.service.SlideshowService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/slideshow")
public class SlideshowController {
    
    @Autowired
    private SlideshowService slideshowService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
    
    @PostMapping("/upload")
    public ResponseEntity<SlideshowImageResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        Long userId = getUserIdFromRequest(request);
        SlideshowImageResponse response = slideshowService.uploadImage(userId, file);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<SlideshowImageResponse>> getSlideshow(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        List<SlideshowImageResponse> response = slideshowService.getSlideshow(userId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderImages(
            @Valid @RequestBody ReorderSlideshowRequest reorderRequest,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        slideshowService.reorderImages(userId, reorderRequest);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        slideshowService.deleteImage(userId, id);
        return ResponseEntity.ok().build();
    }
}

