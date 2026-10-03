package com.evmanager.contracts.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContractLifecycleService {

    private final ContractRepository contractRepository;
    private final EventRepository eventRepository;

    public ContractLifecycleService(ContractRepository contractRepository, EventRepository eventRepository) {
        this.contractRepository = contractRepository;
        this.eventRepository = eventRepository;
    }

    public Contract approveContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (contract.getStatus() != ContractStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only contracts in PENDING_APPROVAL can be approved.");
        }
        contract.setStatus(ContractStatus.PENDING_DEPOSIT);
        return contractRepository.save(contract);
    }

    public Contract rejectContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (contract.getStatus() != ContractStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only contracts in PENDING_APPROVAL can be rejected.");
        }
        contract.setStatus(ContractStatus.DRAFT);
        return contractRepository.save(contract);
    }

    public Contract cancelContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (List.of(ContractStatus.IN_PROGRESS, ContractStatus.COMPLETED, ContractStatus.CANCELLED)
                .contains(contract.getStatus())) {
            throw new IllegalStateException("Cannot cancel an IN_PROGRESS, COMPLETED, or already CANCELLED contract.");
        }
        
        contract.setStatus(ContractStatus.CANCELLED);
        contract = contractRepository.save(contract);

        // Cancel the associated event to release the venue
        Event event = contract.getEvent();
        if (event != null && !"CANCELLED".equals(event.getStatus())) {
            event.setStatus("CANCELLED");
            eventRepository.save(event);
        }

        return contract;
    }

    public Contract startContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (contract.getStatus() != ContractStatus.CONFIRMED) {
            throw new IllegalStateException("Only contracts in CONFIRMED state can be started.");
        }
        contract.setStatus(ContractStatus.IN_PROGRESS);
        return contractRepository.save(contract);
    }

    public Contract completeContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (contract.getStatus() != ContractStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only contracts in IN_PROGRESS state can be completed.");
        }
        contract.setStatus(ContractStatus.COMPLETED);
        return contractRepository.save(contract);
    }

    // Internal method for BE-20 (Payment Module) to call after successful payment
    public Contract transitionToConfirmed(Long contractId) {
        Contract contract = getContract(contractId);
        if (contract.getStatus() != ContractStatus.PENDING_DEPOSIT) {
            throw new IllegalStateException("Only contracts in PENDING_DEPOSIT can be confirmed.");
        }
        // Note: BE-20 is responsible for verifying that actualPaidAmount >= depositAmount
        // before calling this method.
        contract.setStatus(ContractStatus.CONFIRMED);
        return contractRepository.save(contract);
    }

    private Contract getContract(Long contractId) {
        return contractRepository.findByIdWithLock(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found with id: " + contractId));
    }
}
