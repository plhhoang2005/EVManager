package com.evmanager.payments.repository;

import com.evmanager.payments.entity.Payment;
import com.evmanager.payments.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByContract_ContractId(Long contractId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.contract.contractId = :contractId AND p.status = :status")
    BigDecimal sumAmountByContractIdAndStatus(@Param("contractId") Long contractId, @Param("status") PaymentStatus status);
}
