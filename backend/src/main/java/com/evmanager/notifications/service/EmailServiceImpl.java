package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.customers.model.Customer;
import com.evmanager.notifications.dto.EmailSendResponse;
import com.evmanager.reports.service.PdfExportService;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final PdfExportService pdfExportService;
    private final EmailTemplateService templateService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from:no-reply@evmanager.vn}")
    private String mailFrom;

    @Value("${app.mail.from-name:EVManager - Trung Tâm Hội Nghị & Tiệc Cưới}")
    private String mailFromName;

    @Override
    public void sendContractApprovedEmail(Contract contract) {
        String recipient = extractAndValidateRecipient(contract, false);
        if (recipient == null) {
            return;
        }

        String subject = templateService.buildContractApprovedSubject(contract);
        String htmlContent = templateService.buildContractApprovedHtml(contract);
        String textContent = templateService.buildContractApprovedText(contract);

        sendMimeEmail(recipient, subject, htmlContent, textContent, null, null);
        log.info("Contract approved notification email sent successfully to '{}' for contract ID {}", recipient, contract.getContractId());
    }

    @Override
    public void sendDepositConfirmedEmail(Contract contract, BigDecimal paidDeposit, String paymentMethod, String transactionCode) {
        String recipient = extractAndValidateRecipient(contract, false);
        if (recipient == null) {
            return;
        }

        String subject = templateService.buildDepositConfirmedSubject(contract);
        String htmlContent = templateService.buildDepositConfirmedHtml(contract, paidDeposit, paymentMethod, transactionCode);
        String textContent = templateService.buildDepositConfirmedText(contract, paidDeposit, paymentMethod, transactionCode);

        sendMimeEmail(recipient, subject, htmlContent, textContent, null, null);
        log.info("Deposit confirmation email sent successfully to '{}' for contract ID {}", recipient, contract.getContractId());
    }

    @Override
    public EmailSendResponse sendContractWithPdfAttachment(Contract contract) {
        String recipient = extractAndValidateRecipient(contract, true);

        // Generate contract PDF bytes in-memory
        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(contract);
        if (pdfBytes == null || pdfBytes.length == 0) {
            throw new IllegalStateException("Generated contract PDF is empty or invalid for contract ID: " + contract.getContractId());
        }

        String rawCode = contract.getContractCode() != null ? contract.getContractCode() : String.valueOf(contract.getContractId());
        String safeCode = rawCode.replaceAll("[^a-zA-Z0-9_-]", "_");
        String filename = "HopDong_" + safeCode + ".pdf";

        String subject = templateService.buildContractCopySubject(contract);
        String htmlContent = templateService.buildContractCopyHtml(contract);
        String textContent = templateService.buildContractCopyText(contract);

        sendMimeEmail(recipient, subject, htmlContent, textContent, filename, pdfBytes);
        log.info("Contract copy with PDF attachment sent successfully to '{}' for contract ID {}", recipient, contract.getContractId());

        return EmailSendResponse.builder()
                .success(true)
                .recipient(recipient)
                .subject(subject)
                .message("Đã gửi bản sao hợp đồng kèm tệp PDF thành công tới " + recipient)
                .sentAt(OffsetDateTime.now())
                .build();
    }

    private void sendMimeEmail(String to, String subject, String htmlBody, String textBody, String attachmentName, byte[] attachmentBytes) {
        if (!mailEnabled) {
            log.info("Mail sending is disabled (app.mail.enabled=false). Skipping email to {}", to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(new InternetAddress(mailFrom, mailFromName, StandardCharsets.UTF_8.name()));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textBody, htmlBody);

            if (attachmentName != null && attachmentBytes != null) {
                helper.addAttachment(attachmentName, new ByteArrayResource(attachmentBytes), "application/pdf");
            }

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to recipient '{}' with subject '{}': {}", to, subject, e.getMessage());
            throw new RuntimeException("Could not send email to " + to + ": " + e.getMessage(), e);
        }
    }

    private String extractAndValidateRecipient(Contract contract, boolean throwIfInvalid) {
        Customer customer = contract.getCustomer();
        if (customer == null || customer.getEmail() == null || customer.getEmail().isBlank()) {
            if (throwIfInvalid) {
                throw new IllegalArgumentException("Khách hàng không có địa chỉ email hợp lệ để nhận thông báo");
            }
            log.warn("Contract ID {} has no valid customer email. Skipping email dispatch.", contract.getContractId());
            return null;
        }

        String email = customer.getEmail().trim();
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            if (throwIfInvalid) {
                throw new IllegalArgumentException("Định dạng email khách hàng không hợp lệ: " + email);
            }
            log.warn("Contract ID {} customer email '{}' has invalid format. Skipping email dispatch.", contract.getContractId(), email);
            return null;
        }

        return email;
    }
}
