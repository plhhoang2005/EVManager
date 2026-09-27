package com.evmanager.audit.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class AuditLogResponse {
    private Long auditLogId;
    private Long userId;
    private String username;
    private String action;
    private String entityType;
    private String entityId;
    private String oldValues;
    private String newValues;
    private String ipAddress;
    private OffsetDateTime occurredAt;
}
