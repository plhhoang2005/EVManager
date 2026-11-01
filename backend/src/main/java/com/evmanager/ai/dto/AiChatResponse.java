package com.evmanager.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class AiChatResponse {

    private String reply;
    private List<String> quickSuggestions;

    public AiChatResponse() {
        this.quickSuggestions = new ArrayList<>();
    }

    public AiChatResponse(String reply, List<String> quickSuggestions) {
        this.reply = reply;
        this.quickSuggestions = quickSuggestions != null ? quickSuggestions : new ArrayList<>();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<String> getQuickSuggestions() {
        return quickSuggestions;
    }

    public void setQuickSuggestions(List<String> quickSuggestions) {
        this.quickSuggestions = quickSuggestions;
    }
}
