package com.datingapp.repository;

import com.datingapp.entity.SlideshowImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlideshowImageRepository extends JpaRepository<SlideshowImage, Long> {
    List<SlideshowImage> findByCoupleIdOrderByOrderIndexAsc(Long coupleId);
    
    @Query("SELECT MAX(s.orderIndex) FROM SlideshowImage s WHERE s.coupleId = :coupleId")
    Integer findMaxOrderIndexByCoupleId(@Param("coupleId") Long coupleId);
    
    void deleteByCoupleId(Long coupleId);
}

