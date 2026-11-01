package com.evmanager.ai.controller;

import com.evmanager.ai.dto.AiChatRequest;
import com.evmanager.ai.dto.AiChatResponse;
import com.evmanager.ai.dto.AiPlanningRequest;
import com.evmanager.ai.dto.AiPlanningResponse;
import com.evmanager.ai.service.AiPlanningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "AI Planning", description = "Endpoints hỗ trợ lập kế hoạch sự kiện và tư vấn khách hàng tự động")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiPlanningController {

    private final AiPlanningService aiPlanningService;
    private final com.evmanager.ai.config.GeminiConfig geminiConfig;
    private final com.evmanager.customers.repository.CustomerRepository customerRepository;

    @Autowired
    public AiPlanningController(AiPlanningService aiPlanningService, 
                                com.evmanager.ai.config.GeminiConfig geminiConfig,
                                com.evmanager.customers.repository.CustomerRepository customerRepository) {
        this.aiPlanningService = aiPlanningService;
        this.geminiConfig = geminiConfig;
        this.customerRepository = customerRepository;
    }

    public AiPlanningController(AiPlanningService aiPlanningService, com.evmanager.ai.config.GeminiConfig geminiConfig) {
        this(aiPlanningService, geminiConfig, null);
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

    @PostMapping("/inquiry")
    @Operation(summary = "Tiếp nhận yêu cầu tư vấn / Đặt tiệc từ Kế hoạch AI",
               description = "Nhận thông tin khách hàng và kế hoạch sự kiện để chuyển đến đội ngũ Sales xử lý")
    public ResponseEntity<com.evmanager.ai.dto.AiInquiryResponse> submitInquiry(@Valid @RequestBody com.evmanager.ai.dto.AiInquiryRequest request) {
        com.evmanager.ai.dto.AiInquiryResponse response = aiPlanningService.submitInquiry(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(response);
    }

    @GetMapping("/status")
    @Operation(summary = "Kiểm tra trạng thái bật/tắt của AI Concierge",
               description = "Frontend kiểm tra xem tính năng AI có đang được Admin kích hoạt hay không")
    public ResponseEntity<Map<String, Object>> getAiStatus() {
        return ResponseEntity.ok(Map.of(
                "enabled", geminiConfig.isEnabled(),
                "model", geminiConfig.getModel()
        ));
    }

    @GetMapping("/admin/config")
    @Operation(summary = "Lấy cấu hình AI hiện tại (Dành cho Quản trị viên)",
               description = "Xem trạng thái model, API key che mờ, cờ bật tắt và tổng số Leads")
    public ResponseEntity<com.evmanager.ai.dto.AiConfigDto> getAdminAiConfig() {
        boolean hasKey = geminiConfig.getApiKey() != null && !geminiConfig.getApiKey().trim().isEmpty();
        String statusMsg = hasKey ? "Kết nối Google Gemini AI sẵn sàng" : "Chế độ Dự phòng (Fallback Rule-based)";
        
        long totalLeads = 0;
        if (customerRepository != null) {
            try {
                totalLeads = customerRepository.findAll().stream()
                        .filter(c -> c.getAddress() != null && c.getAddress().contains("[AI_LEAD]"))
                        .count();
            } catch (Exception ignored) {}
        }

        com.evmanager.ai.dto.AiConfigDto dto = new com.evmanager.ai.dto.AiConfigDto(
                geminiConfig.getModel(),
                geminiConfig.getMaskedApiKey(),
                "",
                hasKey,
                geminiConfig.isEnabled(),
                totalLeads,
                statusMsg
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/admin/config")
    @Operation(summary = "Cập nhật cấu hình Gemini AI (Dành cho Quản trị viên)",
               description = "Thay đổi API Key, Model và công tắc Bật/Tắt trong runtime")
    public ResponseEntity<com.evmanager.ai.dto.AiConfigDto> updateAdminAiConfig(@RequestBody com.evmanager.ai.dto.AiConfigDto request) {
        geminiConfig.updateConfig(request.getApiKey(), request.getModel(), request.isEnabled());
        boolean hasKey = geminiConfig.getApiKey() != null && !geminiConfig.getApiKey().trim().isEmpty();
        String statusMsg = hasKey ? "Đã cập nhật Gemini AI thành công" : "Đã chuyển về chế độ Dự phòng";
        
        long totalLeads = 0;
        if (customerRepository != null) {
            try {
                totalLeads = customerRepository.findAll().stream()
                        .filter(c -> c.getAddress() != null && c.getAddress().contains("[AI_LEAD]"))
                        .count();
            } catch (Exception ignored) {}
        }

        com.evmanager.ai.dto.AiConfigDto dto = new com.evmanager.ai.dto.AiConfigDto(
                geminiConfig.getModel(),
                geminiConfig.getMaskedApiKey(),
                "",
                hasKey,
                geminiConfig.isEnabled(),
                totalLeads,
                statusMsg
        );
        return ResponseEntity.ok(dto);
    }
}
