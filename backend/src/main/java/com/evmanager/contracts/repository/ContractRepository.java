package com.evmanager.contracts.repository;

import com.evmanager.contracts.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByEvent_EventId(Long eventId);
    boolean existsByEvent_EventId(Long eventId);
}
