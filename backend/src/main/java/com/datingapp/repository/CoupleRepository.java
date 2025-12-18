package com.datingapp.repository;

import com.datingapp.entity.Couple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoupleRepository extends JpaRepository<Couple, Long> {
    @Query("SELECT c FROM Couple c WHERE (c.user1Id = :userId OR c.user2Id = :userId)")
    Optional<Couple> findByUserId(@Param("userId") Long userId);
    
    boolean existsByUser1IdOrUser2Id(Long user1Id, Long user2Id);
}

