package com.evmanager.contracts.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContractLifecycleService {

    private final ContractRepository contractRepository;

    @Transactional
    public void approveContract(Long contractId) {
        Contract contract = getContract(contractId);
        if (!"DRAFT".equals(contract.getStatus())) {
            throw new IllegalStateException("Only DRAFT contracts can be approved");
        }
        contract.setStatus("CONFIRMED");
        contractRepository.save(contract);
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
