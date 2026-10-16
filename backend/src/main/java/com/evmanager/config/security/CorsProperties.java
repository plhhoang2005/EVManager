package com.evmanager.config.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private List<String> allowedOrigins = new ArrayList<>(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
    ));

    private List<String> allowedMethods = new ArrayList<>(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    ));

    private List<String> allowedHeaders = new ArrayList<>(Arrays.asList(
            "Authorization", "Content-Type", "Accept", "X-Requested-With"
    ));

    private boolean allowCredentials = true;
    private long maxAge = 3600L;

    public boolean isOriginAllowed(String origin) {
        if (origin == null || origin.isBlank()) {
            return false;
        }
        String trimmed = origin.trim();
        for (String allowed : allowedOrigins) {
            if (trimmed.equalsIgnoreCase(allowed.trim())) {
                return true;
            }
        }
        return false;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        if (allowedOrigins != null) {
            this.allowedOrigins = allowedOrigins;
        }
    }

    public List<String> getAllowedMethods() {
        return allowedMethods;
    }

    public void setAllowedMethods(List<String> allowedMethods) {
        if (allowedMethods != null) {
            this.allowedMethods = allowedMethods;
        }
    }

    public List<String> getAllowedHeaders() {
        return allowedHeaders;
    }

    public void setAllowedHeaders(List<String> allowedHeaders) {
        if (allowedHeaders != null) {
            this.allowedHeaders = allowedHeaders;
        }
    }

    public boolean isAllowCredentials() {
        return allowCredentials;
    }

    public void setAllowCredentials(boolean allowCredentials) {
        this.allowCredentials = allowCredentials;
    }

    public long getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(long maxAge) {
        this.maxAge = maxAge;
    }
}
