package com.evmanager.contracts.repository;

import com.evmanager.contracts.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByEvent_EventId(Long eventId);
    boolean existsByEvent_EventId(Long eventId);

    @Query("SELECT COALESCE(SUM(c.totalAmount), 0) FROM Contract c WHERE c.status IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(c.depositAmount), 0) FROM Contract c WHERE c.status IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal sumTotalDeposits();

    long countByStatus(String status);
}
