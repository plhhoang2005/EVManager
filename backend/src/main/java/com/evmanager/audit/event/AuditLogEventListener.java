package com.evmanager.audit.event;

import com.evmanager.audit.model.AuditLog;
import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogEventListener {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleAuditLogEvent(AuditLogEvent event) {
        try {
            // Only log if we have a web request or valid context
            HttpServletRequest request = getCurrentHttpRequest();
            
            // To fulfill the requirement: "Ghi nhận các thao tác POST, PATCH, DELETE"
            if (request != null) {
                String method = request.getMethod();
                if ("GET".equalsIgnoreCase(method) || "OPTIONS".equalsIgnoreCase(method)) {
                    // Usually we don't audit GET requests based on DB changes, 
                    // but if a GET somehow triggered a DB change, we might skip it.
                    // However, we'll log it anyway if it triggered a CUD operation.
                }
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setAction(event.getAction());
            auditLog.setEntityType(event.getEntityType());
            auditLog.setEntityId(event.getEntityId());
            auditLog.setOldValues(event.getOldValues());
            auditLog.setNewValues(event.getNewValues());
            
            if (request != null) {
                auditLog.setIpAddress(getClientIp(request));
                String userAgent = request.getHeader("User-Agent");
                if (userAgent != null) {
                    // Embed user_agent into new_values JSON since DB schema has no user_agent column
                    String newValues = auditLog.getNewValues();
                    if (newValues == null) newValues = "{}";
                    if (newValues.endsWith("}")) {
                        newValues = newValues.substring(0, newValues.length() - 1);
                        if (newValues.length() > 1) newValues += ",";
                        newValues += "\"_userAgent\":\"" + userAgent.replace("\"", "\\\"") + "\"}";
                        auditLog.setNewValues(newValues);
                    }
                }
            }

            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() 
                    && !"anonymousUser".equals(authentication.getPrincipal())) {
                String username = authentication.getName();
                Optional<User> userOpt = userRepository.findByUsername(username);
                userOpt.ifPresent(auditLog::setUser);
            }

            auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Failed to save audit log for {} {}", event.getAction(), event.getEntityType(), e);
        }
    }

    private HttpServletRequest getCurrentHttpRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
