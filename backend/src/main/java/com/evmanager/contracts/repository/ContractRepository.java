package com.evmanager.contracts.repository;

import com.evmanager.contracts.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    @Query(value = "SELECT nextval('contract_code_seq')", nativeQuery = true)
    Long getNextContractCodeSequence();

    Optional<Contract> findByContractCode(String contractCode);

    @Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Contract c WHERE c.contractId = :id")
    Optional<Contract> findByIdWithLock(Long id);
}
