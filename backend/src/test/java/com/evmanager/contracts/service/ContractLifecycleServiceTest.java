package com.evmanager.contracts.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContractLifecycleServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private ContractLifecycleService contractLifecycleService;

    private Contract contract;
    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setEventId(1L);
        event.setStatus("SCHEDULED");

        contract = new Contract();
        contract.setContractId(1L);
        contract.setEvent(event);
        contract.setStatus(ContractStatus.DRAFT);
    }

    @Test
    void approveContract_success() {
        contract.setStatus(ContractStatus.PENDING_APPROVAL);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.approveContract(1L);

        assertEquals(ContractStatus.PENDING_DEPOSIT, updated.getStatus());
        verify(contractRepository).save(contract);
    }

    @Test
    void approveContract_invalidState() {
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> contractLifecycleService.approveContract(1L));
        assertTrue(ex.getMessage().contains("Only contracts in PENDING_APPROVAL can be approved"));
    }

    @Test
    void rejectContract_success() {
        contract.setStatus(ContractStatus.PENDING_APPROVAL);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.rejectContract(1L);

        assertEquals(ContractStatus.DRAFT, updated.getStatus());
        verify(contractRepository).save(contract);
    }

    @Test
    void cancelContract_success() {
        contract.setStatus(ContractStatus.PENDING_DEPOSIT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.cancelContract(1L);

        assertEquals(ContractStatus.CANCELLED, updated.getStatus());
        assertEquals("CANCELLED", event.getStatus());
        verify(contractRepository).save(contract);
        verify(eventRepository).save(event);
    }

    @Test
    void cancelContract_invalidState() {
        contract.setStatus(ContractStatus.COMPLETED);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> contractLifecycleService.cancelContract(1L));
        assertTrue(ex.getMessage().contains("Cannot cancel an IN_PROGRESS, COMPLETED, or already CANCELLED"));
    }

    @Test
    void startContract_success() {
        contract.setStatus(ContractStatus.CONFIRMED);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.startContract(1L);

        assertEquals(ContractStatus.IN_PROGRESS, updated.getStatus());
        verify(contractRepository).save(contract);
    }

    @Test
    void completeContract_success() {
        contract.setStatus(ContractStatus.IN_PROGRESS);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.completeContract(1L);

        assertEquals(ContractStatus.COMPLETED, updated.getStatus());
        verify(contractRepository).save(contract);
    }

    @Test
    void transitionToConfirmed_success() {
        contract.setStatus(ContractStatus.PENDING_DEPOSIT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        when(contractRepository.save(any(Contract.class))).thenReturn(contract);

        Contract updated = contractLifecycleService.transitionToConfirmed(1L);

        assertEquals(ContractStatus.CONFIRMED, updated.getStatus());
        verify(contractRepository).save(contract);
    }

    @Test
    void rejectContract_invalidState() {
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        assertThrows(IllegalStateException.class, () -> contractLifecycleService.rejectContract(1L));
    }

    @Test
    void startContract_invalidState() {
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        assertThrows(IllegalStateException.class, () -> contractLifecycleService.startContract(1L));
    }

    @Test
    void completeContract_invalidState() {
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        assertThrows(IllegalStateException.class, () -> contractLifecycleService.completeContract(1L));
    }

    @Test
    void transitionToConfirmed_invalidState() {
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findById(1L)).thenReturn(Optional.of(contract));
        assertThrows(IllegalStateException.class, () -> contractLifecycleService.transitionToConfirmed(1L));
    }
}
