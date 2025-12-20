package com.datingapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "couples", indexes = {
    @Index(name = "idx_user1", columnList = "user1Id"),
    @Index(name = "idx_user2", columnList = "user2Id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Couple {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user1_id", nullable = false)
  private Long user1Id;

  @Column(name = "user2_id", nullable = false)
  private Long user2Id;

  @Column(name = "paired_at", nullable = false, updatable = false)
  private LocalDateTime pairedAt;

  @PrePersist
  protected void onCreate() {
    pairedAt = LocalDateTime.now();
  }
}
