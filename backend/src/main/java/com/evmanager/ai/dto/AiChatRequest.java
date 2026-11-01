package com.evmanager.ai.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

public class AiChatRequest {

    @NotBlank(message = "Tin nhắn không được để trống")
    private String message;

    private List<ChatMessageDto> history;

    public AiChatRequest() {
        this.history = new ArrayList<>();
    }

    public AiChatRequest(String message, List<ChatMessageDto> history) {
        this.message = message;
        this.history = history != null ? history : new ArrayList<>();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDto> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessageDto> history) {
        this.history = history;
    }
}
