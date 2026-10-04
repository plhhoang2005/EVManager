package com.evmanager.auth.repository;

import com.evmanager.auth.model.OtpToken;
import com.evmanager.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findByOtpCodeAndUserAndPurposeAndIsUsedFalse(String otpCode, User user, String purpose);
    
    // Check if there is an unexpired unused token for this user and purpose
    Optional<OtpToken> findFirstByUserAndPurposeAndIsUsedFalseAndExpiryDateAfterOrderByCreatedAtDesc(User user, String purpose, OffsetDateTime now);
}
