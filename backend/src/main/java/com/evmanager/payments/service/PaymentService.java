package com.evmanager.payments.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.payments.dto.PaymentRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.entity.Payment;
import com.evmanager.payments.entity.PaymentStatus;
import com.evmanager.payments.entity.PaymentType;
import com.evmanager.payments.repository.PaymentRepository;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;
    private final ContractLifecycleService contractLifecycleService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Contract contract = contractRepository.findByIdWithLock(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        checkCustomerOwnership(contract);

        if (request.getPaymentType() == PaymentType.DEPOSIT && contract.getStatus() != ContractStatus.PENDING_DEPOSIT) {
            throw new IllegalStateException("Deposit can only be made when contract is PENDING_DEPOSIT");
        }
        if (request.getPaymentType() == PaymentType.FINAL && contract.getStatus() != ContractStatus.COMPLETED) {
            throw new IllegalStateException("Final payment can only be made when contract is COMPLETED");
        }
        if (contract.getStatus() == ContractStatus.DRAFT || contract.getStatus() == ContractStatus.PENDING_APPROVAL || contract.getStatus() == ContractStatus.CANCELLED) {
            throw new IllegalStateException("Cannot make payment for contract in status " + contract.getStatus());
        }

        BigDecimal totalSuccessfulPaid = paymentRepository.sumAmountByContractIdAndStatus(contract.getContractId(), PaymentStatus.SUCCESS);
        if (totalSuccessfulPaid.add(request.getAmount()).compareTo(contract.getTotalAmount()) > 0) {
            throw new IllegalStateException("Overpayment is not allowed. Total amount: " + contract.getTotalAmount() + ", already paid: " + totalSuccessfulPaid);
        }

        Payment payment = Payment.builder()
                .contract(contract)
                .amount(request.getAmount())
                .paymentType(request.getPaymentType())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .paymentDate(OffsetDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public com.evmanager.payments.dto.ContractPaymentSummaryResponse getPaymentsByContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        checkCustomerOwnership(contract);

        List<PaymentResponse> payments = paymentRepository.findByContract_ContractId(contractId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        BigDecimal paidAmount = paymentRepository.sumAmountByContractIdAndStatus(contractId, PaymentStatus.SUCCESS);
        BigDecimal remainingAmount = contract.getTotalAmount().subtract(paidAmount);

        return com.evmanager.payments.dto.ContractPaymentSummaryResponse.builder()
                .contractId(contractId)
                .totalAmount(contract.getTotalAmount())
                .paidAmount(paidAmount)
                .remainingAmount(remainingAmount)
                .payments(payments)
                .build();
    }

    @Transactional
    public PaymentResponse confirmPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Only PENDING payments can be confirmed");
        }
        
        Contract contract = contractRepository.findByIdWithLock(payment.getContract().getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        BigDecimal totalSuccessfulPaid = paymentRepository.sumAmountByContractIdAndStatus(contract.getContractId(), PaymentStatus.SUCCESS);
        if (totalSuccessfulPaid.add(payment.getAmount()).compareTo(contract.getTotalAmount()) > 0) {
            throw new IllegalStateException("Confirmation failed: Overpayment is not allowed. Total amount: " + contract.getTotalAmount() + ", already paid: " + totalSuccessfulPaid);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        if (payment.getPaymentType() == PaymentType.DEPOSIT) {
            totalSuccessfulPaid = totalSuccessfulPaid.add(payment.getAmount());
            
            // depositAmount is usually 30% of totalAmount
            BigDecimal depositAmount = contract.getTotalAmount().multiply(new BigDecimal("0.30"));
            
            if (totalSuccessfulPaid.compareTo(depositAmount) >= 0 && contract.getStatus() == ContractStatus.PENDING_DEPOSIT) {
                contractLifecycleService.transitionToConfirmed(contract.getContractId());
            }
        }

        return mapToResponse(savedPayment);
    }

    @Transactional
    public PaymentResponse rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Only PENDING payments can be rejected");
        }

        payment.setStatus(PaymentStatus.FAILED);
        return mapToResponse(paymentRepository.save(payment));
    }

    private void checkCustomerOwnership(Contract contract) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return;
        }

        boolean isCustomer = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_CUSTOMER"));

        if (isCustomer) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
            Customer customer = customerRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

            if (!contract.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied: You do not own this contract");
            }
        }
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .contractId(payment.getContract().getContractId())
                .paymentType(payment.getPaymentType())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
