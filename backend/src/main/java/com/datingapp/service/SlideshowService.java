package com.datingapp.service;

import com.datingapp.dto.ReorderSlideshowRequest;
import com.datingapp.dto.SlideshowImageResponse;
import com.datingapp.entity.Couple;
import com.datingapp.entity.SlideshowImage;
import com.datingapp.repository.CoupleRepository;
import com.datingapp.repository.SlideshowImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SlideshowService {
    
    @Autowired
    private SlideshowImageRepository slideshowImageRepository;
    
    @Autowired
    private CoupleRepository coupleRepository;
    
    @Value("${app.slideshow.upload-dir}")
    private String uploadDir;
    
    @Value("${app.slideshow.max-images}")
    private int maxImages;
    
    @Transactional
    public SlideshowImageResponse uploadImage(Long userId, MultipartFile file) throws IOException {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        // Check max images limit
        long imageCount = slideshowImageRepository.findByCoupleIdOrderByOrderIndexAsc(couple.getId()).size();
        if (imageCount >= maxImages) {
            throw new RuntimeException("Maximum number of images reached");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Get next order index
        Integer maxOrder = slideshowImageRepository.findMaxOrderIndexByCoupleId(couple.getId());
        int nextOrder = (maxOrder != null ? maxOrder + 1 : 0);
        
        // Save to database
        SlideshowImage image = new SlideshowImage();
        image.setCoupleId(couple.getId());
        image.setImageUrl("/uploads/" + filename);
        image.setOrderIndex(nextOrder);
        image.setUploadedByUserId(userId);
        
        image = slideshowImageRepository.save(image);
        
        return new SlideshowImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getOrderIndex(),
                image.getUploadedByUserId(),
                image.getCreatedAt()
        );
    }
    
    public List<SlideshowImageResponse> getSlideshow(Long userId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        return slideshowImageRepository.findByCoupleIdOrderByOrderIndexAsc(couple.getId())
                .stream()
                .map(image -> new SlideshowImageResponse(
                        image.getId(),
                        image.getImageUrl(),
                        image.getOrderIndex(),
                        image.getUploadedByUserId(),
                        image.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void reorderImages(Long userId, ReorderSlideshowRequest request) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        List<SlideshowImage> images = slideshowImageRepository.findByCoupleIdOrderByOrderIndexAsc(couple.getId());
        
        // Verify all image IDs belong to this couple
        List<Long> imageIds = images.stream().map(SlideshowImage::getId).collect(Collectors.toList());
        if (!imageIds.containsAll(request.getImageIds()) || 
            request.getImageIds().size() != imageIds.size()) {
            throw new RuntimeException("Invalid image IDs");
        }
        
        // Update order indices
        for (int i = 0; i < request.getImageIds().size(); i++) {
            Long imageId = request.getImageIds().get(i);
            SlideshowImage image = images.stream()
                    .filter(img -> img.getId().equals(imageId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            image.setOrderIndex(i);
            slideshowImageRepository.save(image);
        }
    }
    
    @Transactional
    public void deleteImage(Long userId, Long imageId) {
        Couple couple = coupleRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User is not paired"));
        
        SlideshowImage image = slideshowImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        
        if (!image.getCoupleId().equals(couple.getId())) {
            throw new RuntimeException("Image does not belong to this couple");
        }
        
        // Delete file
        try {
            String imageUrl = image.getImageUrl();
            if (imageUrl.startsWith("/uploads/")) {
                String filename = imageUrl.substring("/uploads/".length());
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Failed to delete image file: " + e.getMessage());
        }
        
        // Delete from database
        slideshowImageRepository.delete(image);
        
        // Reorder remaining images
        List<SlideshowImage> remainingImages = slideshowImageRepository
                .findByCoupleIdOrderByOrderIndexAsc(couple.getId());
        for (int i = 0; i < remainingImages.size(); i++) {
            SlideshowImage remainingImage = remainingImages.get(i);
            remainingImage.setOrderIndex(i);
            slideshowImageRepository.save(remainingImage);
        }
    }
}

