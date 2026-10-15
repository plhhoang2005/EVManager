package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.customers.model.Customer;
import com.evmanager.notifications.dto.EmailSendResponse;
import com.evmanager.reports.service.PdfExportService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private PdfExportService pdfExportService;

    @Spy
    private EmailTemplateService templateService = new EmailTemplateService();

    @InjectMocks
    private EmailServiceImpl emailService;

    private Contract contract;
    private Customer customer;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);
        ReflectionTestUtils.setField(emailService, "mailFrom", "no-reply@evmanager.vn");
        ReflectionTestUtils.setField(emailService, "mailFromName", "EVManager Test");

        customer = new Customer();
        customer.setCustomerId(1L);
        customer.setFullName("Lê Minh Tú");
        customer.setEmail("minhtu.le@example.com");

        contract = new Contract();
        contract.setContractId(101L);
        contract.setContractCode("HD-20261016-001");
        contract.setTotalAmount(new BigDecimal("100000000.00"));
        contract.setDepositAmount(new BigDecimal("30000000.00"));
        contract.setCustomer(customer);
    }

    private MimeMessage createDummyMimeMessage() {
        return new MimeMessage(Session.getInstance(new Properties()));
    }

    @Test
    @DisplayName("C01: Send contract approved email successfully")
    void shouldSendContractApprovedEmailSuccessfully() {
        when(mailSender.createMimeMessage()).thenReturn(createDummyMimeMessage());

        assertDoesNotThrow(() -> emailService.sendContractApprovedEmail(contract));

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("D01: Send deposit confirmed email successfully")
    void shouldSendDepositConfirmedEmailSuccessfully() {
        when(mailSender.createMimeMessage()).thenReturn(createDummyMimeMessage());

        assertDoesNotThrow(() -> emailService.sendDepositConfirmedEmail(
                contract,
                new BigDecimal("30000000.00"),
                "Chuyển khoản",
                "TXN-12345"
        ));

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("E01 & E03: Send contract copy with PDF attachment")
    void shouldSendContractWithPdfAttachmentSuccessfully() {
        when(mailSender.createMimeMessage()).thenReturn(createDummyMimeMessage());
        byte[] mockPdf = "%PDF-1.4 Mock PDF content".getBytes();
        when(pdfExportService.generateContractPdfBytes(contract)).thenReturn(mockPdf);

        EmailSendResponse response = emailService.sendContractWithPdfAttachment(contract);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("minhtu.le@example.com", response.getRecipient());
        assertTrue(response.getSubject().contains("HD-20261016-001"));
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("C08: Skip email silently when customer has null or empty email in background trigger")
    void shouldSkipEmailSilently_whenCustomerEmailMissing_inBackgroundTrigger() {
        customer.setEmail(null);

        emailService.sendContractApprovedEmail(contract);

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("F10: Throw IllegalArgumentException when customer email is missing in direct send")
    void shouldThrowException_whenCustomerEmailMissing_inDirectSend() {
        customer.setEmail("   ");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                emailService.sendContractWithPdfAttachment(contract));
        assertTrue(ex.getMessage().contains("không có địa chỉ email hợp lệ"));
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("F10: Throw IllegalArgumentException when customer email format is invalid in direct send")
    void shouldThrowException_whenCustomerEmailInvalid_inDirectSend() {
        customer.setEmail("not-an-email");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                emailService.sendContractWithPdfAttachment(contract));
        assertTrue(ex.getMessage().contains("không hợp lệ"));
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("E06: Throw IllegalStateException when generated PDF is empty")
    void shouldThrowException_whenGeneratedPdfIsEmpty() {
        when(pdfExportService.generateContractPdfBytes(contract)).thenReturn(new byte[0]);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                emailService.sendContractWithPdfAttachment(contract));
        assertTrue(ex.getMessage().contains("empty or invalid"));
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("G01: Skip sending when mail is disabled via config")
    void shouldSkipSending_whenMailIsDisabled() {
        ReflectionTestUtils.setField(emailService, "mailEnabled", false);

        emailService.sendContractApprovedEmail(contract);

        verify(mailSender, never()).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("G03 & G10: Wrap and propagate mail sender failure cleanly")
    void shouldPropagateException_whenMailSenderFails() {
        when(mailSender.createMimeMessage()).thenReturn(createDummyMimeMessage());
        doThrow(new MailSendException("SMTP connection refused")).when(mailSender).send(any(MimeMessage.class));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                emailService.sendContractApprovedEmail(contract));
        assertTrue(ex.getMessage().contains("Could not send email"));
    }
}
