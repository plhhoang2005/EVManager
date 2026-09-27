package com.evmanager.audit.repository;

import com.evmanager.audit.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a " +
           "LEFT JOIN FETCH a.user " +
           "WHERE (:action IS NULL OR a.action = :action) " +
           "AND (:entityType IS NULL OR a.entityType = :entityType) " +
           "AND (cast(:fromDate as timestamp) IS NULL OR a.occurredAt >= :fromDate) " +
           "AND (cast(:toDate as timestamp) IS NULL OR a.occurredAt <= :toDate)")
    Page<AuditLog> searchAuditLogs(
            @Param("action") String action,
            @Param("entityType") String entityType,
            @Param("fromDate") OffsetDateTime fromDate,
            @Param("toDate") OffsetDateTime toDate,
            Pageable pageable);
}
