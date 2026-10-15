package com.evmanager.contracts.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.notifications.dto.DepositPaymentRequest;
import com.evmanager.notifications.dto.DepositPaymentResponse;
import com.evmanager.notifications.event.ContractApprovedEvent;
import com.evmanager.notifications.event.DepositRecordedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ContractLifecycleService {

    private final ContractRepository contractRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void approveContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (!"DRAFT".equals(contract.getStatus())) {
            throw new IllegalStateException("Only DRAFT contracts can be approved");
        }
        contract.setStatus("CONFIRMED");
        contractRepository.save(contract);
        eventPublisher.publishEvent(new ContractApprovedEvent(this, contractId));
    }

    @Transactional
    public DepositPaymentResponse recordDepositPayment(Long contractId, DepositPaymentRequest request) {
        Contract contract = getContract(contractId);
        if ("CANCELLED".equals(contract.getStatus())) {
            throw new IllegalStateException("Cannot record deposit payment for a cancelled contract");
        }

        BigDecimal depositAmount = request.getAmount();
        if (depositAmount == null || depositAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }

        BigDecimal currentDeposit = contract.getDepositAmount() != null ? contract.getDepositAmount() : BigDecimal.ZERO;
        BigDecimal newTotalDeposit = currentDeposit.add(depositAmount);
        contract.setDepositAmount(newTotalDeposit);

        Contract saved = contractRepository.save(contract);

        eventPublisher.publishEvent(new DepositRecordedEvent(
                this,
                contractId,
                depositAmount,
                request.getPaymentMethod(),
                request.getTransactionCode()
        ));

        BigDecimal total = saved.getTotalAmount() != null ? saved.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal remaining = total.subtract(newTotalDeposit).max(BigDecimal.ZERO);

        return DepositPaymentResponse.builder()
                .contractId(saved.getContractId())
                .contractCode(saved.getContractCode())
                .depositAmount(newTotalDeposit)
                .totalAmount(total)
                .remainingAmount(remaining)
                .status(saved.getStatus())
                .message("Đã ghi nhận thanh toán đặt cọc thành công")
                .recordedAt(OffsetDateTime.now())
                .build();
    }

    @Transactional
    public void cancelContract(Long contractId) {
        Contract contract = getContract(contractId);
        if ("COMPLETED".equals(contract.getStatus()) || "CANCELLED".equals(contract.getStatus())) {
            throw new IllegalStateException("Cannot cancel a completed or already cancelled contract");
        }
        contract.setStatus("CANCELLED");
        contractRepository.save(contract);
    }

    @Transactional
    public void completeContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (!"CONFIRMED".equals(contract.getStatus())) {
            throw new IllegalStateException("Only CONFIRMED contracts can be completed");
        }
        contract.setStatus("COMPLETED");
        contractRepository.save(contract);
    }

    private Contract getContract(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
    }
}
