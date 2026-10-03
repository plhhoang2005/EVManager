package com.evmanager.payments.controller;

import com.evmanager.payments.dto.PaymentRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ACCOUNTANT', 'ADMIN')")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/contracts/{contractId}/payments")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SALES', 'ACCOUNTANT', 'ADMIN')")
    public ResponseEntity<com.evmanager.payments.dto.ContractPaymentSummaryResponse> getPaymentsByContract(@PathVariable Long contractId) {
        com.evmanager.payments.dto.ContractPaymentSummaryResponse response = paymentService.getPaymentsByContract(contractId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payments/{id}/actions/confirm")
    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    public ResponseEntity<PaymentResponse> confirmPayment(@PathVariable Long id) {
        PaymentResponse response = paymentService.confirmPayment(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payments/{id}/actions/reject")
    @PreAuthorize("hasAnyRole('ACCOUNTANT', 'ADMIN')")
    public ResponseEntity<PaymentResponse> rejectPayment(@PathVariable Long id) {
        PaymentResponse response = paymentService.rejectPayment(id);
        return ResponseEntity.ok(response);
    }
}
