package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.notifications.event.ContractApprovedEvent;
import com.evmanager.notifications.event.DepositRecordedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final EmailService emailService;
    private final ContractRepository contractRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleContractApprovedEvent(ContractApprovedEvent event) {
        log.info("Handling ContractApprovedEvent for contract ID {} after transaction commit", event.getContractId());
        try {
            Contract contract = contractRepository.findById(event.getContractId()).orElse(null);
            if (contract == null) {
                log.warn("Contract not found for ID {} during ContractApprovedEvent processing", event.getContractId());
                return;
            }
            emailService.sendContractApprovedEmail(contract);
        } catch (Exception e) {
            log.error("Failed to send contract approved email for contract ID {}: {}", event.getContractId(), e.getMessage(), e);
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleDepositRecordedEvent(DepositRecordedEvent event) {
        log.info("Handling DepositRecordedEvent for contract ID {} after transaction commit", event.getContractId());
        try {
            Contract contract = contractRepository.findById(event.getContractId()).orElse(null);
            if (contract == null) {
                log.warn("Contract not found for ID {} during DepositRecordedEvent processing", event.getContractId());
                return;
            }
            emailService.sendDepositConfirmedEmail(contract, event.getDepositAmount(), event.getPaymentMethod(), event.getTransactionCode());
        } catch (Exception e) {
            log.error("Failed to send deposit confirmation email for contract ID {}: {}", event.getContractId(), e.getMessage(), e);
        }
    }
}
