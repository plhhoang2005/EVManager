package com.evmanager.payments.controller;

import com.evmanager.payments.dto.PaymentCreateRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER')")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayments(pageable));
    }

    @GetMapping("/contract/{contractId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(paymentService.getPaymentsByContract(contractId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentCreateRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
