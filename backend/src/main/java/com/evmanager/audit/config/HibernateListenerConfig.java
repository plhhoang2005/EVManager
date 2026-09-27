package com.evmanager.audit.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.hibernate.event.service.spi.EventListenerRegistry;
import org.hibernate.event.spi.EventType;
import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Configuration;
import jakarta.persistence.EntityManagerFactory;

@Configuration
@RequiredArgsConstructor
public class HibernateListenerConfig {

    private final org.springframework.beans.factory.ObjectProvider<EntityManagerFactory> entityManagerFactoryProvider;
    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    @PostConstruct
    protected void init() {
        EntityManagerFactory entityManagerFactory = entityManagerFactoryProvider.getIfAvailable();
        if (entityManagerFactory == null) {
            return;
        }
        SessionFactoryImpl sessionFactory = entityManagerFactory.unwrap(SessionFactoryImpl.class);
        EventListenerRegistry registry = sessionFactory.getServiceRegistry().getService(EventListenerRegistry.class);

        HibernateAuditListener listener = new HibernateAuditListener(eventPublisher, objectMapper);

        registry.getEventListenerGroup(EventType.POST_INSERT).appendListener(listener);
        registry.getEventListenerGroup(EventType.POST_UPDATE).appendListener(listener);
        registry.getEventListenerGroup(EventType.POST_DELETE).appendListener(listener);
    }
}
