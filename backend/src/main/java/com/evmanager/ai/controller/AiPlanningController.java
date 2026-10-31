package com.evmanager.ai.controller;

import com.evmanager.ai.dto.AiChatRequest;
import com.evmanager.ai.dto.AiChatResponse;
import com.evmanager.ai.dto.AiPlanningRequest;
import com.evmanager.ai.dto.AiPlanningResponse;
import com.evmanager.ai.service.AiPlanningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "AI Planning", description = "Endpoints hỗ trợ lập kế hoạch sự kiện và tư vấn khách hàng tự động")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiPlanningController {

    private final AiPlanningService aiPlanningService;

    public AiPlanningController(AiPlanningService aiPlanningService) {
        this.aiPlanningService = aiPlanningService;
    }

    @PostMapping("/plan-event")
    @Operation(summary = "Lập kế hoạch phân bổ ngân sách & kịch bản sự kiện bằng AI",
               description = "Nhận loại sự kiện, tổng ngân sách và số lượng khách, trả về bảng phân bổ chi phí chi tiết, checklist mốc chuẩn bị và kịch bản timeline")
    public ResponseEntity<AiPlanningResponse> planEvent(@Valid @RequestBody AiPlanningRequest request) {
        AiPlanningResponse response = aiPlanningService.generatePlan(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    @Operation(summary = "AI Chat Concierge - Trợ lý ảo tư vấn sự kiện 24/7",
               description = "Tư vấn tương tác đa vòng qua Google Gemini về tiệc cưới, hội nghị doanh nghiệp, chi phí, thực đơn và lịch trình")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiPlanningService.chatWithConcierge(request);
        return ResponseEntity.ok(response);
    }
}
