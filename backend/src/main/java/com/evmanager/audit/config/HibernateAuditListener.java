package com.evmanager.audit.config;

import com.evmanager.audit.event.AuditLogEvent;
import com.evmanager.audit.model.AuditLog;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.event.spi.*;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class HibernateAuditListener implements PostInsertEventListener, PostUpdateEventListener, PostDeleteEventListener {

    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    public HibernateAuditListener(ApplicationEventPublisher eventPublisher, ObjectMapper objectMapper) {
        this.eventPublisher = eventPublisher;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onPostInsert(PostInsertEvent event) {
        if (event.getEntity() instanceof AuditLog) return;
        
        String entityType = event.getEntity().getClass().getSimpleName();
        String entityId = event.getId().toString();
        String newValues = buildJsonState(event.getPersister(), event.getState());

        eventPublisher.publishEvent(new AuditLogEvent(this, "CREATE", event.getEntity(), entityType, entityId, null, newValues));
    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        if (event.getEntity() instanceof AuditLog) return;

        String entityType = event.getEntity().getClass().getSimpleName();
        String entityId = event.getId().toString();
        
        String oldValues = buildJsonState(event.getPersister(), event.getOldState());
        String newValues = buildJsonState(event.getPersister(), event.getState());

        // Optimize: if oldValues == newValues, maybe don't log. But for now, we log all updates.
        eventPublisher.publishEvent(new AuditLogEvent(this, "UPDATE", event.getEntity(), entityType, entityId, oldValues, newValues));
    }

    @Override
    public void onPostDelete(PostDeleteEvent event) {
        if (event.getEntity() instanceof AuditLog) return;

        String entityType = event.getEntity().getClass().getSimpleName();
        String entityId = event.getId().toString();
        String oldValues = buildJsonState(event.getPersister(), event.getDeletedState());

        eventPublisher.publishEvent(new AuditLogEvent(this, "DELETE", event.getEntity(), entityType, entityId, oldValues, null));
    }

    @Override
    public boolean requiresPostCommitHandling(EntityPersister persister) {
        return false;
    }

    private String buildJsonState(EntityPersister persister, Object[] state) {
        if (state == null) return null;
        
        String[] propertyNames = persister.getPropertyNames();
        Map<String, Object> stateMap = new HashMap<>();
        
        for (int i = 0; i < propertyNames.length; i++) {
            Object value = state[i];
            // Avoid lazy loading / proxy issues by not serializing complex objects fully
            // Or just serialize simple types
            if (value != null && !value.getClass().getName().startsWith("com.evmanager")) {
                stateMap.put(propertyNames[i], value);
            }
        }
        
        try {
            return objectMapper.writeValueAsString(stateMap);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize entity state to JSON", e);
            return null;
        }
    }
}
