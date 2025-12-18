package com.datingapp.repository;

import com.datingapp.entity.QuickMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuickMessageRepository extends JpaRepository<QuickMessage, Long> {
    List<QuickMessage> findByCoupleIdOrderByCreatedAtAsc(Long coupleId);
    long countByCoupleId(Long coupleId);
}

