package com.evmanager.auth.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    
    // We can extract this from application properties, but passing directly for MVP
    private final String senderEmail = "no-reply@evmanager.com"; 

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            
            if ("VERIFY_ACCOUNT".equals(purpose)) {
                message.setSubject("EVManager - Xác thực tài khoản mới");
                message.setText("Chào bạn,\n\nMã OTP để kích hoạt tài khoản của bạn là: " + otpCode 
                    + "\nMã này sẽ hết hạn trong vòng 5 phút.\n\nTrân trọng,\nĐội ngũ EVManager.");
            } else if ("RESET_PASSWORD".equals(purpose)) {
                message.setSubject("EVManager - Khôi phục mật khẩu");
                message.setText("Chào bạn,\n\nMã OTP để khôi phục mật khẩu của bạn là: " + otpCode 
                    + "\nMã này sẽ hết hạn trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nĐội ngũ EVManager.");
            } else {
                message.setSubject("EVManager - Mã OTP của bạn");
                message.setText("Mã OTP của bạn là: " + otpCode);
            }
            
            mailSender.send(message);
            log.info("Đã gửi email OTP thành công đến {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email OTP đến {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Không thể gửi email lúc này. Vui lòng thử lại sau.");
        }
    }
}
