package com.evmanager.notifications.controller;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.notifications.dto.DepositPaymentRequest;
import com.evmanager.notifications.dto.DepositPaymentResponse;
import com.evmanager.notifications.dto.EmailSendResponse;
import com.evmanager.notifications.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contract Notifications", description = "Endpoints for contract email notifications and deposit payments")
public class ContractNotificationController {

    private final EmailService emailService;
    private final ContractLifecycleService contractLifecycleService;
    private final ContractRepository contractRepository;

    @PostMapping({
            "/api/v1/contracts/{id}/actions/send-email",
            "/api/contracts/{id}/actions/send-email",
            "/api/v1/contracts/{id}/send-email",
            "/api/contracts/{id}/send-email"
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    @Operation(summary = "Send contract copy with PDF attachment to customer via email")
    public ResponseEntity<EmailSendResponse> sendContractCopyEmail(@PathVariable("id") Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));

        EmailSendResponse response = emailService.sendContractWithPdfAttachment(contract);
        return ResponseEntity.ok(response);
    }

    @PostMapping({
            "/api/v1/contracts/{id}/actions/deposit",
            "/api/contracts/{id}/actions/deposit",
            "/api/v1/contracts/{id}/deposit",
            "/api/contracts/{id}/deposit"
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    @Operation(summary = "Record deposit payment and trigger confirmation email")
    public ResponseEntity<DepositPaymentResponse> recordDepositPayment(
            @PathVariable("id") Long id,
            @Valid @RequestBody DepositPaymentRequest request) {
        DepositPaymentResponse response = contractLifecycleService.recordDepositPayment(id, request);
        return ResponseEntity.ok(response);
    }
}
