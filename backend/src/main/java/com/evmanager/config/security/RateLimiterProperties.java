package com.evmanager.config.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.security.rate-limit")
public class RateLimiterProperties {

    private boolean enabled = true;
    private int defaultLimitPerMinute = 100;
    private int loginLimitPerMinute = 5;
    private boolean trustForwardedHeaders = false;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getDefaultLimitPerMinute() {
        return defaultLimitPerMinute;
    }

    public void setDefaultLimitPerMinute(int defaultLimitPerMinute) {
        this.defaultLimitPerMinute = defaultLimitPerMinute;
    }

    public void setDefaultRequestsPerMinute(int defaultRequestsPerMinute) {
        this.defaultLimitPerMinute = defaultRequestsPerMinute;
    }

    public int getLoginLimitPerMinute() {
        return loginLimitPerMinute;
    }

    public void setLoginLimitPerMinute(int loginLimitPerMinute) {
        this.loginLimitPerMinute = loginLimitPerMinute;
    }

    public void setLoginRequestsPerMinute(int loginRequestsPerMinute) {
        this.loginLimitPerMinute = loginRequestsPerMinute;
    }

    public boolean isTrustForwardedHeaders() {
        return trustForwardedHeaders;
    }

    public void setTrustForwardedHeaders(boolean trustForwardedHeaders) {
        this.trustForwardedHeaders = trustForwardedHeaders;
    }
}
