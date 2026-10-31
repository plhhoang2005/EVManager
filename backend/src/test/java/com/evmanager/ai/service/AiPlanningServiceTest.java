package com.evmanager.ai.service;

import com.evmanager.ai.config.GeminiConfig;
import com.evmanager.ai.dto.AiChatRequest;
import com.evmanager.ai.dto.AiChatResponse;
import com.evmanager.ai.dto.AiPlanningRequest;
import com.evmanager.ai.dto.AiPlanningResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class AiPlanningServiceTest {

    private GeminiConfig geminiConfig;
    private ObjectMapper objectMapper;
    private AiPlanningService aiPlanningService;

    @BeforeEach
    void setUp() {
        geminiConfig = Mockito.mock(GeminiConfig.class);
        objectMapper = new ObjectMapper();
        when(geminiConfig.getRestClient()).thenReturn(RestClient.builder().build());
        aiPlanningService = new AiPlanningService(geminiConfig, objectMapper);
    }

    @Test
    void testFallbackPlanWhenApiKeyEmpty() {
        when(geminiConfig.getApiKey()).thenReturn("");

        AiPlanningRequest req = new AiPlanningRequest("wedding", 100000000.0, 150, "Cần tone trắng");
        AiPlanningResponse response = aiPlanningService.generatePlan(req);

        assertNotNull(response);
        assertNotNull(response.getSummary());
        assertTrue(response.getSummary().contains("tiệc cưới") || response.getSummary().contains("wedding"));
        assertEquals(5, response.getBudgetBreakdown().size());
        assertEquals(45000000.0, response.getBudgetBreakdown().get("Sảnh tiệc & Thực đơn ẩm thực"));
        assertFalse(response.getPreparationMilestones().isEmpty());
        assertFalse(response.getDayOfTimeline().isEmpty());
    }

    @Test
    void testFallbackPlanForCorporateEvent() {
        when(geminiConfig.getApiKey()).thenReturn(null);

        AiPlanningRequest req = new AiPlanningRequest("corporate", 50000000.0, 80, "");
        AiPlanningResponse response = aiPlanningService.generatePlan(req);

        assertNotNull(response);
        assertEquals(22500000.0, response.getBudgetBreakdown().get("Sảnh tiệc & Thực đơn ẩm thực"));
        assertEquals(50000000.0, response.getBudgetBreakdown().values().stream().mapToDouble(Double::doubleValue).sum());
    }

    @Test
    void testFallbackChatWhenApiKeyEmpty() {
        when(geminiConfig.getApiKey()).thenReturn("");

        AiChatRequest req = new AiChatRequest("Có gói tiệc cưới nào dưới 50 triệu không?", List.of());
        AiChatResponse response = aiPlanningService.chatWithConcierge(req);

        assertNotNull(response);
        assertNotNull(response.getReply());
        assertFalse(response.getReply().isBlank());
        assertFalse(response.getQuickSuggestions().isEmpty());
    }
}
