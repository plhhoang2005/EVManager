package com.evmanager.audit.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class AuditLogEvent extends ApplicationEvent {
    private final String action;
    private final Object entity;
    private final String entityType;
    private final String entityId;
    private final String oldValues;
    private final String newValues;

    public AuditLogEvent(Object source, String action, Object entity, String entityType, String entityId, String oldValues, String newValues) {
        super(source);
        this.action = action;
        this.entity = entity;
        this.entityType = entityType;
        this.entityId = entityId;
        this.oldValues = oldValues;
        this.newValues = newValues;
    }
}
