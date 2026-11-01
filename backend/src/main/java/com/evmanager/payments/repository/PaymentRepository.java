package com.evmanager.payments.repository;

import com.evmanager.payments.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @EntityGraph(attributePaths = {"contract", "contract.customer"})
    List<Payment> findByContract_ContractIdOrderByPaymentDateDesc(Long contractId);

    @EntityGraph(attributePaths = {"contract", "contract.customer"})
    Page<Payment> findAllByOrderByPaymentDateDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal sumTotalSuccessfulPayments();

    Optional<Payment> findByExternalReference(String externalReference);

    boolean existsByExternalReference(String externalReference);
}
