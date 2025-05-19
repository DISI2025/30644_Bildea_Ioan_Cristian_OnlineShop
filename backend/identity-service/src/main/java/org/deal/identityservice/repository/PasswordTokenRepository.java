package org.deal.identityservice.repository;

import jakarta.transaction.Transactional;
import org.deal.identityservice.entity.PasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface PasswordTokenRepository extends JpaRepository<PasswordToken, UUID> {

    Optional<PasswordToken> findByToken(final String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordToken t WHERE t.userId = :userId")
    void deleteByUserId(final UUID userId);
}
