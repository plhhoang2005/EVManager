package com.evmanager.ai.dto;

public class AiConfigDto {

    private String model;
    private String apiKeyMasked;
    private String apiKey;
    private boolean active;
    private boolean enabled = true;
    private long totalLeadsCount;
    private String statusMessage;

    public AiConfigDto() {
    }

    public AiConfigDto(String model, String apiKeyMasked, String apiKey, boolean active, boolean enabled, long totalLeadsCount, String statusMessage) {
        this.model = model;
        this.apiKeyMasked = apiKeyMasked;
        this.apiKey = apiKey;
        this.active = active;
        this.enabled = enabled;
        this.totalLeadsCount = totalLeadsCount;
        this.statusMessage = statusMessage;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getApiKeyMasked() {
        return apiKeyMasked;
    }

    public void setApiKeyMasked(String apiKeyMasked) {
        this.apiKeyMasked = apiKeyMasked;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public long getTotalLeadsCount() {
        return totalLeadsCount;
    }

    public void setTotalLeadsCount(long totalLeadsCount) {
        this.totalLeadsCount = totalLeadsCount;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}
