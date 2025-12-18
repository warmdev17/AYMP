package com.datingapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "quick_messages", indexes = {
    @Index(name = "idx_couple", columnList = "coupleId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuickMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long coupleId;
    
    @Column(nullable = false, length = 50)
    private String content;
    
    @Column(nullable = false)
    private Long createdByUserId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

