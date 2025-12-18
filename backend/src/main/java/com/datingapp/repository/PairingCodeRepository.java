package com.datingapp.repository;

import com.datingapp.entity.PairingCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PairingCodeRepository extends JpaRepository<PairingCode, Long> {
    Optional<PairingCode> findByCodeAndUsedFalseAndExpiresAtAfter(String code, LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM PairingCode p WHERE p.expiresAt < :now OR p.used = true")
    void deleteExpiredOrUsed(@Param("now") LocalDateTime now);
}

