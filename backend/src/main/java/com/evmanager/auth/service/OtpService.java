package com.evmanager.auth.service;

import com.evmanager.auth.model.OtpToken;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.users.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 5;

    public OtpService(OtpTokenRepository otpTokenRepository, EmailService emailService) {
        this.otpTokenRepository = otpTokenRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void generateAndSendOtp(User user, String purpose) {
        // Prevent spam: Check if there's an active token
        Optional<OtpToken> existingValidToken = otpTokenRepository.findFirstByUserAndPurposeAndIsUsedFalseAndExpiryDateAfterOrderByCreatedAtDesc(
                user, purpose, OffsetDateTime.now()
        );
        
        if (existingValidToken.isPresent()) {
            throw new RuntimeException("Một mã OTP đã được gửi gần đây. Vui lòng kiểm tra email của bạn hoặc đợi mã cũ hết hạn.");
        }

        // Generate 6 digit OTP
        String otpCode = String.format("%06d", RANDOM.nextInt(999999));

        OtpToken otpToken = new OtpToken();
        otpToken.setUser(user);
        otpToken.setOtpCode(otpCode);
        otpToken.setPurpose(purpose);
        otpToken.setExpiryDate(OffsetDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpTokenRepository.save(otpToken);

        // Send Email
        emailService.sendOtpEmail(user.getEmail(), otpCode, purpose);
    }

    @Transactional
    public boolean verifyOtp(User user, String otpCode, String purpose) {
        Optional<OtpToken> otpTokenOpt = otpTokenRepository.findByOtpCodeAndUserAndPurposeAndIsUsedFalse(otpCode, user, purpose);
        
        if (otpTokenOpt.isEmpty()) {
            return false;
        }

        OtpToken otpToken = otpTokenOpt.get();
        if (otpToken.getExpiryDate().isBefore(OffsetDateTime.now())) {
            return false; // Expired
        }

        otpToken.setIsUsed(true);
        otpTokenRepository.save(otpToken);
        return true;
    }
}
