package com.evmanager.contracts.repository;

import com.evmanager.contracts.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByEvent_EventId(Long eventId);
    boolean existsByEvent_EventId(Long eventId);

    @Query("SELECT COALESCE(SUM(c.totalAmount), 0) FROM Contract c " +
           "WHERE c.status IN ('CONFIRMED', 'COMPLETED') " +
           "AND c.contractDate >= :startDate AND c.contractDate <= :endDate")
    BigDecimal sumRevenueBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT MONTH(c.contractDate) AS month, COALESCE(SUM(c.totalAmount), 0) AS revenue " +
           "FROM Contract c " +
           "WHERE c.status IN ('CONFIRMED', 'COMPLETED') " +
           "AND c.contractDate >= :startDate AND c.contractDate <= :endDate " +
           "GROUP BY MONTH(c.contractDate)")
    List<Object[]> aggregateMonthlyRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(c) FROM Contract c " +
           "WHERE c.status = 'CONFIRMED' " +
           "AND (c.event IS NULL OR c.event.status = 'SCHEDULED')")
    long countDaCoc();

    @Query("SELECT COUNT(c) FROM Contract c " +
           "WHERE c.status = 'CONFIRMED' " +
           "AND c.event IS NOT NULL AND c.event.status IN ('PREPARING', 'IN_PROGRESS')")
    long countDangTiec();

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = 'COMPLETED'")
    long countDaThanhLy();

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = 'CANCELLED' OR (c.event IS NOT NULL AND c.event.status = 'CANCELLED')")
    long countDaHuy();

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = 'DRAFT'")
    long countPendingContracts();
}
