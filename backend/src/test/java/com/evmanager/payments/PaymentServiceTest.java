package com.evmanager.payments;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.payments.dto.PaymentCreateRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.model.Payment;
import com.evmanager.payments.repository.PaymentRepository;
import com.evmanager.payments.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Contract mockContract;
    private Customer mockCustomer;
    private Payment mockPayment;

    @BeforeEach
    void setUp() {
        mockCustomer = new Customer();
        mockCustomer.setCustomerId(1L);
        mockCustomer.setFullName("Lê Minh Sơn");

        mockContract = new Contract();
        mockContract.setContractId(10L);
        mockContract.setContractCode("HD-TEST-001");
        mockContract.setCustomer(mockCustomer);
        mockContract.setStatus("DRAFT");
        mockContract.setDepositAmount(BigDecimal.ZERO);
        mockContract.setTotalAmount(new BigDecimal("100000000.00"));

        mockPayment = Payment.builder()
                .paymentId(100L)
                .contract(mockContract)
                .externalReference("VQR-TEST-001")
                .paymentType("DEPOSIT")
                .amount(new BigDecimal("30000000.00"))
                .paymentMethod("VIETQR")
                .paymentDate(OffsetDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Test
    @DisplayName("Should create deposit payment and transition contract to CONFIRMED")
    void testCreatePayment_Deposit_Success() {
        when(contractRepository.findById(10L)).thenReturn(Optional.of(mockContract));
        when(paymentRepository.existsByExternalReference("VQR-CUSTOM-123")).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setPaymentId(101L);
            return p;
        });

        PaymentCreateRequest request = PaymentCreateRequest.builder()
                .contractId(10L)
                .amount(new BigDecimal("30000000.00"))
                .paymentType("DEPOSIT")
                .paymentMethod("VIETQR")
                .externalReference("VQR-CUSTOM-123")
                .build();

        PaymentResponse response = paymentService.createPayment(request);

        assertNotNull(response);
        assertEquals(101L, response.getPaymentId());
        assertEquals("HD-TEST-001", response.getContractCode());
        assertEquals("Lê Minh Sơn", response.getCustomerName());
        assertEquals("CONFIRMED", mockContract.getStatus());
        assertEquals(new BigDecimal("30000000.00"), mockContract.getDepositAmount());
        verify(contractRepository).save(mockContract);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when contract does not exist")
    void testCreatePayment_ContractNotFound() {
        when(contractRepository.findById(999L)).thenReturn(Optional.empty());

        PaymentCreateRequest request = PaymentCreateRequest.builder()
                .contractId(999L)
                .amount(new BigDecimal("10000000.00"))
                .paymentType("DEPOSIT")
                .paymentMethod("VIETQR")
                .build();

        assertThrows(ResourceNotFoundException.class, () -> paymentService.createPayment(request));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw ResourceConflictException when externalReference already exists")
    void testCreatePayment_DuplicateReference() {
        when(contractRepository.findById(10L)).thenReturn(Optional.of(mockContract));
        when(paymentRepository.existsByExternalReference("DUPLICATE-REF")).thenReturn(true);

        PaymentCreateRequest request = PaymentCreateRequest.builder()
                .contractId(10L)
                .amount(new BigDecimal("10000000.00"))
                .paymentType("DEPOSIT")
                .paymentMethod("VIETQR")
                .externalReference("DUPLICATE-REF")
                .build();

        assertThrows(ResourceConflictException.class, () -> paymentService.createPayment(request));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should return paginated list of payments")
    void testGetAllPayments() {
        PageRequest pageable = PageRequest.of(0, 10);
        when(paymentRepository.findAllByOrderByPaymentDateDesc(pageable))
                .thenReturn(new PageImpl<>(Collections.singletonList(mockPayment)));

        Page<PaymentResponse> page = paymentService.getAllPayments(pageable);

        assertNotNull(page);
        assertEquals(1, page.getContent().size());
        assertEquals(100L, page.getContent().get(0).getPaymentId());
        assertEquals("HD-TEST-001", page.getContent().get(0).getContractCode());
    }

    @Test
    @DisplayName("Should return payments list by contract ID")
    void testGetPaymentsByContract() {
        when(paymentRepository.findByContract_ContractIdOrderByPaymentDateDesc(10L))
                .thenReturn(Collections.singletonList(mockPayment));

        List<PaymentResponse> list = paymentService.getPaymentsByContract(10L);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals(100L, list.get(0).getPaymentId());
    }
}
