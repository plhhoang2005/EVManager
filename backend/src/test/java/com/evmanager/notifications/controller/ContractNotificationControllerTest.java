package com.evmanager.notifications.controller;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.customers.model.Customer;
import com.evmanager.notifications.dto.DepositPaymentRequest;
import com.evmanager.notifications.dto.DepositPaymentResponse;
import com.evmanager.notifications.dto.EmailSendResponse;
import com.evmanager.notifications.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContractNotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    @MockBean
    private ContractLifecycleService contractLifecycleService;

    @MockBean
    private ContractRepository contractRepository;

    @MockBean
    private com.evmanager.users.repository.UserRepository userRepository;

    @MockBean
    private com.evmanager.users.repository.RoleRepository roleRepository;

    @MockBean
    private com.evmanager.customers.repository.CustomerRepository customerRepository;

    @MockBean
    private com.evmanager.venues.repository.VenueRepository venueRepository;

    @MockBean
    private com.evmanager.events.repository.EventRepository eventRepository;

    @MockBean
    private com.evmanager.services.repository.ServiceRepository serviceRepository;

    @MockBean
    private com.evmanager.menus.repository.MenuRepository menuRepository;

    @MockBean
    private com.evmanager.dishes.repository.DishRepository dishRepository;

    @MockBean
    private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;

    @MockBean
    private com.evmanager.auth.repository.OtpTokenRepository otpTokenRepository;

    private Contract sampleContract;

    @BeforeEach
    void setUp() {
        Customer customer = new Customer();
        customer.setCustomerId(1L);
        customer.setFullName("Nguyễn Văn Hoàng");
        customer.setEmail("hoang.nguyen@example.com");

        sampleContract = new Contract();
        sampleContract.setContractId(101L);
        sampleContract.setContractCode("HD-20261016-001");
        sampleContract.setStatus("CONFIRMED");
        sampleContract.setCustomer(customer);
        sampleContract.setTotalAmount(new BigDecimal("150000000.00"));
        sampleContract.setDepositAmount(new BigDecimal("45000000.00"));
    }

    // ==========================================
    // Luồng C: Gửi hợp đồng kèm PDF qua email
    // ==========================================

    @Test
    @DisplayName("F03 & E01: POST /api/v1/contracts/{id}/actions/send-email as ADMIN returns 200")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void sendEmail_asAdmin_shouldReturn200() throws Exception {
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));
        EmailSendResponse response = EmailSendResponse.builder()
                .success(true)
                .recipient("hoang.nguyen@example.com")
                .subject("[EVManager] Bản sao hợp đồng dịch vụ tiệc cưới - Mã HĐ: HD-20261016-001")
                .message("Đã gửi thành công")
                .sentAt(OffsetDateTime.now())
                .build();
        when(emailService.sendContractWithPdfAttachment(sampleContract)).thenReturn(response);

        mockMvc.perform(post("/api/v1/contracts/101/actions/send-email"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.recipient").value("hoang.nguyen@example.com"));
    }

    @Test
    @DisplayName("F03 & E01 (legacy route): POST /api/contracts/{id}/send-email as SALES returns 200")
    @WithMockUser(username = "sales_user", roles = {"SALES"})
    void sendEmail_asSales_legacyRoute_shouldReturn200() throws Exception {
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));
        EmailSendResponse response = EmailSendResponse.builder()
                .success(true)
                .recipient("hoang.nguyen@example.com")
                .message("Đã gửi thành công")
                .build();
        when(emailService.sendContractWithPdfAttachment(sampleContract)).thenReturn(response);

        mockMvc.perform(post("/api/contracts/101/send-email"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("F01: POST send-email unauthenticated returns 401")
    void sendEmail_unauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(post("/api/v1/contracts/101/actions/send-email"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("F02: POST send-email as CUSTOMER returns 403 Forbidden")
    @WithMockUser(username = "customer_user", roles = {"CUSTOMER"})
    void sendEmail_asCustomer_shouldReturn403() throws Exception {
        mockMvc.perform(post("/api/v1/contracts/101/actions/send-email"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("I02: POST send-email non-existing contract returns 404 Not Found")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void sendEmail_contractNotFound_shouldReturn404() throws Exception {
        when(contractRepository.findById(9999L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/v1/contracts/9999/actions/send-email"))
                .andExpect(status().isNotFound());
    }

    // ==========================================
    // Luồng B: Ghi nhận đặt cọc và gửi email
    // ==========================================

    @Test
    @DisplayName("D01 & F05: POST /api/v1/contracts/{id}/actions/deposit as ADMIN returns 200")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void recordDeposit_asAdmin_shouldReturn200() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("45000000.00"))
                .paymentMethod("Chuyển khoản")
                .transactionCode("TXN-001")
                .note("Cọc đợt 1")
                .build();

        DepositPaymentResponse response = DepositPaymentResponse.builder()
                .contractId(101L)
                .contractCode("HD-20261016-001")
                .depositAmount(new BigDecimal("45000000.00"))
                .totalAmount(new BigDecimal("150000000.00"))
                .remainingAmount(new BigDecimal("105000000.00"))
                .status("CONFIRMED")
                .message("Đã ghi nhận thanh toán đặt cọc thành công")
                .recordedAt(OffsetDateTime.now())
                .build();

        when(contractLifecycleService.recordDepositPayment(eq(101L), any(DepositPaymentRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/contracts/101/actions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contractId").value(101))
                .andExpect(jsonPath("$.depositAmount").value(45000000.00))
                .andExpect(jsonPath("$.remainingAmount").value(105000000.00));
    }

    @Test
    @DisplayName("D01 (legacy route): POST /api/contracts/{id}/deposit as SALES returns 200")
    @WithMockUser(username = "sales_user", roles = {"SALES"})
    void recordDeposit_asSales_legacyRoute_shouldReturn200() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("45000000.00"))
                .paymentMethod("Tiền mặt")
                .build();

        DepositPaymentResponse response = DepositPaymentResponse.builder()
                .contractId(101L)
                .contractCode("HD-20261016-001")
                .depositAmount(new BigDecimal("45000000.00"))
                .status("CONFIRMED")
                .build();

        when(contractLifecycleService.recordDepositPayment(eq(101L), any(DepositPaymentRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/contracts/101/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contractId").value(101));
    }

    @Test
    @DisplayName("F01: POST deposit unauthenticated returns 401")
    void recordDeposit_unauthenticated_shouldReturn401() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("10000000.00"))
                .paymentMethod("Tiền mặt")
                .build();

        mockMvc.perform(post("/api/v1/contracts/101/actions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("F02: POST deposit as CUSTOMER returns 403 Forbidden")
    @WithMockUser(username = "customer_user", roles = {"CUSTOMER"})
    void recordDeposit_asCustomer_shouldReturn403() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("10000000.00"))
                .paymentMethod("Tiền mặt")
                .build();

        mockMvc.perform(post("/api/v1/contracts/101/actions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("D02 & I04: POST deposit with invalid payload (missing amount or method) returns 400 Bad Request")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void recordDeposit_invalidPayload_shouldReturn400() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("-1000.00")) // negative
                .paymentMethod("") // empty
                .build();

        mockMvc.perform(post("/api/v1/contracts/101/actions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("I01: POST deposit with non-numeric ID returns 400 Bad Request")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void recordDeposit_invalidIdFormat_shouldReturn400() throws Exception {
        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("1000000.00"))
                .paymentMethod("Tiền mặt")
                .build();

        mockMvc.perform(post("/api/v1/contracts/not-a-number/actions/deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
