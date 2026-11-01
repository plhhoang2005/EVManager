package com.evmanager.ai.controller;

import com.evmanager.ai.dto.AiChatRequest;
import com.evmanager.ai.dto.AiChatResponse;
import com.evmanager.ai.dto.AiPlanningRequest;
import com.evmanager.ai.dto.AiPlanningResponse;
import com.evmanager.ai.service.AiPlanningService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AiPlanningControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private AiPlanningService aiPlanningService;
    private com.evmanager.ai.config.GeminiConfig geminiConfig;

    @BeforeEach
    void setUp() {
        aiPlanningService = Mockito.mock(AiPlanningService.class);
        geminiConfig = Mockito.mock(com.evmanager.ai.config.GeminiConfig.class);
        Mockito.when(geminiConfig.getModel()).thenReturn("gemini-2.5-flash");
        Mockito.when(geminiConfig.getMaskedApiKey()).thenReturn("AIzaSy...TEST");
        Mockito.when(geminiConfig.getApiKey()).thenReturn("AIzaSyFakeKey12345");

        objectMapper = new ObjectMapper();
        AiPlanningController controller = new AiPlanningController(aiPlanningService, geminiConfig);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testPlanEventEndpointReturnsSuccess() throws Exception {
        AiPlanningResponse mockResponse = new AiPlanningResponse(
                "Kế hoạch thử nghiệm",
                Map.of("Sảnh", 20000000.0),
                List.of("Dịch vụ 1"),
                List.of("Mốc 1"),
                List.of("Khung giờ 1")
        );

        Mockito.when(aiPlanningService.generatePlan(any(AiPlanningRequest.class)))
                .thenReturn(mockResponse);

        AiPlanningRequest req = new AiPlanningRequest("wedding", 50000000.0, 100, "Notes");

        mockMvc.perform(post("/api/v1/ai/plan-event")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary").value("Kế hoạch thử nghiệm"))
                .andExpect(jsonPath("$.budgetBreakdown.Sảnh").value(20000000.0));
    }

    @Test
    void testPlanEventEndpointValidationFailsOnBlankType() throws Exception {
        AiPlanningRequest req = new AiPlanningRequest("", 50000000.0, 100, "");

        mockMvc.perform(post("/api/v1/ai/plan-event")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testChatEndpointReturnsSuccess() throws Exception {
        AiChatResponse mockResponse = new AiChatResponse(
                "Xin chào quý khách, tôi có thể hỗ trợ gì ạ?",
                List.of("Gói tiệc cưới", "Sảnh hội nghị")
        );

        Mockito.when(aiPlanningService.chatWithConcierge(any(AiChatRequest.class)))
                .thenReturn(mockResponse);

        AiChatRequest req = new AiChatRequest("Tư vấn tiệc cưới trọn gói", List.of());

        mockMvc.perform(post("/api/v1/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Xin chào quý khách, tôi có thể hỗ trợ gì ạ?"))
                .andExpect(jsonPath("$.quickSuggestions[0]").value("Gói tiệc cưới"));
    }

    @Test
    void testChatEndpointValidationFailsOnBlankMessage() throws Exception {
        AiChatRequest req = new AiChatRequest("", List.of());

        mockMvc.perform(post("/api/v1/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSubmitInquiryEndpointReturnsCreated() throws Exception {
        com.evmanager.ai.dto.AiInquiryResponse mockResponse = new com.evmanager.ai.dto.AiInquiryResponse(
                "INQ-123456",
                "Nguyễn Văn An",
                "RECEIVED",
                "Tiếp nhận thành công",
                "2026-10-31T14:00:00Z"
        );

        Mockito.when(aiPlanningService.submitInquiry(any(com.evmanager.ai.dto.AiInquiryRequest.class)))
                .thenReturn(mockResponse);

        com.evmanager.ai.dto.AiInquiryRequest req = new com.evmanager.ai.dto.AiInquiryRequest(
                "Nguyễn Văn An", "0901234567", "an@example.com", "wedding", 200, 100000000.0, "Ghi chú", "Tóm tắt"
        );

        mockMvc.perform(post("/api/v1/ai/inquiry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.inquiryCode").value("INQ-123456"))
                .andExpect(jsonPath("$.customerName").value("Nguyễn Văn An"))
                .andExpect(jsonPath("$.status").value("RECEIVED"));
    }

    @Test
    void testGetAdminAiConfigEndpointReturnsConfig() throws Exception {
        Mockito.when(geminiConfig.isEnabled()).thenReturn(true);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/ai/admin/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("gemini-2.5-flash"))
                .andExpect(jsonPath("$.apiKeyMasked").value("AIzaSy...TEST"))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.enabled").value(true));
    }

    @Test
    void testUpdateAdminAiConfigEndpointCallsUpdate() throws Exception {
        com.evmanager.ai.dto.AiConfigDto updateReq = new com.evmanager.ai.dto.AiConfigDto("gemini-2.5-flash", "", "AIzaSyNewKey", true, true, 0, "");

        mockMvc.perform(post("/api/v1/ai/admin/config")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("gemini-2.5-flash"));

        Mockito.verify(geminiConfig).updateConfig("AIzaSyNewKey", "gemini-2.5-flash", true);
    }
}
