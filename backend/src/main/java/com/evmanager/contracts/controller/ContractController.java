package com.evmanager.contracts.controller;

import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
import com.evmanager.contracts.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;
    private final com.evmanager.contracts.service.ContractLifecycleService contractLifecycleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ContractResponse> createContract(@Valid @RequestBody ContractRequest request) {
        ContractResponse response = contractService.createContract(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'COORDINATOR')")
    public ResponseEntity<Page<ContractResponse>> getAllContracts(Pageable pageable) {
        return ResponseEntity.ok(contractService.getAllContracts(pageable));
    }


    @PostMapping("/{id}/actions/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveContract(@PathVariable Long id) {
        contractLifecycleService.approveContract(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/actions/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<Void> cancelContract(@PathVariable Long id) {
        contractLifecycleService.cancelContract(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/actions/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> completeContract(@PathVariable Long id) {
        contractLifecycleService.completeContract(id);
        return ResponseEntity.ok().build();
    }
}
