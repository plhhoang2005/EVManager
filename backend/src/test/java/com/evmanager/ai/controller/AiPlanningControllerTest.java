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

    @BeforeEach
    void setUp() {
        aiPlanningService = Mockito.mock(AiPlanningService.class);
        objectMapper = new ObjectMapper();
        AiPlanningController controller = new AiPlanningController(aiPlanningService);
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
}
