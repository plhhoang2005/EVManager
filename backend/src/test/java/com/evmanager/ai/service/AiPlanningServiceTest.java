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

    @Test
    void testBuildDatabaseContextWithVenuesAndServices() {
        com.evmanager.venues.repository.VenueRepository mockVenueRepo = Mockito.mock(com.evmanager.venues.repository.VenueRepository.class);
        com.evmanager.services.repository.ServiceRepository mockServiceRepo = Mockito.mock(com.evmanager.services.repository.ServiceRepository.class);
        com.evmanager.customers.repository.CustomerRepository mockCustomerRepo = Mockito.mock(com.evmanager.customers.repository.CustomerRepository.class);

        com.evmanager.venues.model.Venue v = new com.evmanager.venues.model.Venue();
        v.setVenueName("Sảnh Kim Cương");
        v.setMinCapacity(200);
        v.setMaxCapacity(500);
        v.setRentalPrice(java.math.BigDecimal.valueOf(15000000));
        v.setStatus("AVAILABLE");

        when(mockVenueRepo.findAll()).thenReturn(List.of(v));

        AiPlanningService service = new AiPlanningService(geminiConfig, objectMapper, mockVenueRepo, mockServiceRepo, mockCustomerRepo);
        String context = service.buildDatabaseContext();

        assertNotNull(context);
        assertTrue(context.contains("Sảnh Kim Cương"));
        assertTrue(context.contains("15,000,000"));
    }

    @Test
    void testSubmitInquirySavesCustomerAndReturnsCode() {
        com.evmanager.customers.repository.CustomerRepository mockCustomerRepo = Mockito.mock(com.evmanager.customers.repository.CustomerRepository.class);
        when(mockCustomerRepo.findByPhone("0912345678")).thenReturn(java.util.Optional.empty());
        when(mockCustomerRepo.save(Mockito.any(com.evmanager.customers.model.Customer.class))).thenAnswer(i -> i.getArgument(0));

        AiPlanningService service = new AiPlanningService(geminiConfig, objectMapper, null, null, mockCustomerRepo);

        com.evmanager.ai.dto.AiInquiryRequest req = new com.evmanager.ai.dto.AiInquiryRequest(
                "Trần Thị Hoa", "0912345678", "hoa@example.com", "wedding", 150, 80000000.0, "Ghi chú", "Tóm tắt"
        );

        com.evmanager.ai.dto.AiInquiryResponse res = service.submitInquiry(req);
        assertNotNull(res);
        assertNotNull(res.getInquiryCode());
        assertTrue(res.getInquiryCode().startsWith("INQ-"));
        assertEquals("Trần Thị Hoa", res.getCustomerName());
        assertEquals("RECEIVED", res.getStatus());
    }
}
