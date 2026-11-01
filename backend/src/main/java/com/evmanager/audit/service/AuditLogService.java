package com.evmanager.audit.service;

import com.evmanager.audit.dto.AuditLogResponse;
import com.evmanager.audit.model.AuditLog;
import com.evmanager.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> searchAuditLogs(String action, String entityType, OffsetDateTime fromDate, OffsetDateTime toDate, Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.searchAuditLogs(action, entityType, fromDate, toDate, pageable);
        return page.map(this::mapToResponse);
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        AuditLogResponse response = new AuditLogResponse();
        response.setAuditLogId(log.getAuditLogId());
        
        if (log.getUser() != null) {
            response.setUserId(log.getUser().getUserId());
            response.setUsername(log.getUser().getUsername());
        }
        
        response.setAction(log.getAction());
        response.setEntityType(log.getEntityType());
        response.setEntityId(log.getEntityId());
        response.setOldValues(log.getOldValues());
        response.setNewValues(log.getNewValues());
        response.setIpAddress(log.getIpAddress());
        response.setOccurredAt(log.getOccurredAt());
        return response;
    }
}
