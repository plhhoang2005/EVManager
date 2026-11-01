package com.evmanager.payments.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.payments.dto.PaymentCreateRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.model.Payment;
import com.evmanager.payments.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;

    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAllByOrderByPaymentDateDesc(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByContract(Long contractId) {
        return paymentRepository.findByContract_ContractIdOrderByPaymentDateDesc(contractId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + request.getContractId()));

        String ref = request.getExternalReference();
        if (ref == null || ref.trim().isEmpty()) {
            ref = "PAY-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } else {
            ref = ref.trim();
            if (paymentRepository.existsByExternalReference(ref)) {
                throw new ResourceConflictException("Payment reference already exists: " + ref);
            }
        }

        Payment payment = Payment.builder()
                .contract(contract)
                .amount(request.getAmount())
                .paymentType(request.getPaymentType())
                .paymentMethod(request.getPaymentMethod())
                .externalReference(ref)
                .paymentDate(OffsetDateTime.now())
                .status("SUCCESS")
                .build();

        // Update contract deposit & status if deposit/installment
        if ("DEPOSIT".equalsIgnoreCase(request.getPaymentType()) || "INSTALLMENT".equalsIgnoreCase(request.getPaymentType())) {
            BigDecimal currentDeposit = contract.getDepositAmount() != null ? contract.getDepositAmount() : BigDecimal.ZERO;
            contract.setDepositAmount(currentDeposit.add(request.getAmount()));

            if ("DRAFT".equals(contract.getStatus()) || "PENDING_CONFIRMATION".equals(contract.getStatus())) {
                contract.setStatus("CONFIRMED");
            }
            contractRepository.save(contract);
        }

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    public PaymentResponse mapToResponse(Payment p) {
        Contract c = p.getContract();
        String customerName = "N/A";
        String contractCode = "N/A";
        Long contractId = null;

        if (c != null) {
            contractId = c.getContractId();
            contractCode = c.getContractCode();
            if (c.getCustomer() != null) {
                customerName = c.getCustomer().getFullName();
            }
        }

        return PaymentResponse.builder()
                .paymentId(p.getPaymentId())
                .contractId(contractId)
                .contractCode(contractCode)
                .customerName(customerName)
                .externalReference(p.getExternalReference())
                .paymentType(p.getPaymentType())
                .amount(p.getAmount())
                .paymentDate(p.getPaymentDate())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
