package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.notifications.dto.DepositPaymentRequest;
import com.evmanager.notifications.dto.DepositPaymentResponse;
import com.evmanager.notifications.event.ContractApprovedEvent;
import com.evmanager.notifications.event.DepositRecordedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractLifecycleNotificationTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ContractLifecycleService contractLifecycleService;

    private NotificationEventListener listener;

    private Contract sampleContract;

    @BeforeEach
    void setUp() {
        listener = new NotificationEventListener(emailService, contractRepository);

        sampleContract = new Contract();
        sampleContract.setContractId(201L);
        sampleContract.setContractCode("HD-20261016-002");
        sampleContract.setStatus("DRAFT");
        sampleContract.setTotalAmount(new BigDecimal("200000000.00"));
        sampleContract.setDepositAmount(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("C01: Approving contract transitions status to CONFIRMED and publishes ContractApprovedEvent")
    void shouldApproveContract_andPublishEvent() {
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));
        when(contractRepository.save(any(Contract.class))).thenReturn(sampleContract);

        contractLifecycleService.approveContract(201L);

        assertEquals("CONFIRMED", sampleContract.getStatus());
        verify(contractRepository, times(1)).save(sampleContract);

        ArgumentCaptor<ContractApprovedEvent> eventCaptor = ArgumentCaptor.forClass(ContractApprovedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        assertEquals(201L, eventCaptor.getValue().getContractId());
    }

    @Test
    @DisplayName("C02 & C06: Approving non-DRAFT contract throws IllegalStateException")
    void shouldRejectApprove_whenStatusNotDraft() {
        sampleContract.setStatus("CANCELLED");
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));

        assertThrows(IllegalStateException.class, () ->
                contractLifecycleService.approveContract(201L));

        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    @DisplayName("D01 & D09: Record deposit payment successfully, accumulate deposit, and publish DepositRecordedEvent")
    void shouldRecordDepositPayment_andPublishEvent() {
        sampleContract.setStatus("CONFIRMED");
        sampleContract.setDepositAmount(new BigDecimal("20000000.00")); // already had 20M
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));
        when(contractRepository.save(any(Contract.class))).thenReturn(sampleContract);

        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("40000000.00")) // pay 40M more
                .paymentMethod("Chuyển khoản")
                .transactionCode("TXN-999")
                .note("Đợt 1")
                .build();

        DepositPaymentResponse response = contractLifecycleService.recordDepositPayment(201L, request);

        assertNotNull(response);
        assertEquals(new BigDecimal("60000000.00"), response.getDepositAmount()); // 20M + 40M = 60M
        assertEquals(new BigDecimal("140000000.00"), response.getRemainingAmount()); // 200M - 60M = 140M

        ArgumentCaptor<DepositRecordedEvent> eventCaptor = ArgumentCaptor.forClass(DepositRecordedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        assertEquals(201L, eventCaptor.getValue().getContractId());
        assertEquals(new BigDecimal("40000000.00"), eventCaptor.getValue().getDepositAmount());
        assertEquals("Chuyển khoản", eventCaptor.getValue().getPaymentMethod());
        assertEquals("TXN-999", eventCaptor.getValue().getTransactionCode());
    }

    @Test
    @DisplayName("D03 & D05: Reject deposit payment on cancelled contract")
    void shouldRejectDeposit_onCancelledContract() {
        sampleContract.setStatus("CANCELLED");
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));

        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(new BigDecimal("30000000.00"))
                .paymentMethod("Tiền mặt")
                .build();

        assertThrows(IllegalStateException.class, () ->
                contractLifecycleService.recordDepositPayment(201L, request));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    @DisplayName("D02: Reject deposit payment with non-positive amount")
    void shouldRejectDeposit_withZeroOrNegativeAmount() {
        sampleContract.setStatus("CONFIRMED");
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));

        DepositPaymentRequest request = DepositPaymentRequest.builder()
                .amount(BigDecimal.ZERO)
                .paymentMethod("Tiền mặt")
                .build();

        assertThrows(IllegalArgumentException.class, () ->
                contractLifecycleService.recordDepositPayment(201L, request));
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    @DisplayName("C01: NotificationEventListener triggers EmailService on ContractApprovedEvent")
    void shouldHandleContractApprovedEvent_inListener() {
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));

        listener.handleContractApprovedEvent(new ContractApprovedEvent(this, 201L));

        verify(emailService, times(1)).sendContractApprovedEmail(sampleContract);
    }

    @Test
    @DisplayName("D01: NotificationEventListener triggers EmailService on DepositRecordedEvent")
    void shouldHandleDepositRecordedEvent_inListener() {
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));

        listener.handleDepositRecordedEvent(new DepositRecordedEvent(
                this, 201L, new BigDecimal("50000000.00"), "Chuyển khoản", "TXN-01"
        ));

        verify(emailService, times(1)).sendDepositConfirmedEmail(
                sampleContract, new BigDecimal("50000000.00"), "Chuyển khoản", "TXN-01"
        );
    }

    @Test
    @DisplayName("G10: NotificationEventListener catches email exception safely without throwing")
    void shouldCatchEmailException_inListenerSafely() {
        when(contractRepository.findById(201L)).thenReturn(Optional.of(sampleContract));
        doThrow(new RuntimeException("SMTP down")).when(emailService).sendContractApprovedEmail(any());

        assertDoesNotThrow(() ->
                listener.handleContractApprovedEvent(new ContractApprovedEvent(this, 201L)));
    }
}
