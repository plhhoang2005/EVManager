package com.evmanager.ai.service;

import com.evmanager.ai.config.GeminiConfig;
import com.evmanager.ai.dto.*;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import com.evmanager.services.repository.ServiceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
public class AiPlanningService {

    private static final Logger log = LoggerFactory.getLogger(AiPlanningService.class);

    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;
    private final VenueRepository venueRepository;
    private final ServiceRepository serviceRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public AiPlanningService(GeminiConfig geminiConfig,
                             ObjectMapper objectMapper,
                             VenueRepository venueRepository,
                             ServiceRepository serviceRepository,
                             CustomerRepository customerRepository) {
        this.geminiConfig = geminiConfig;
        this.objectMapper = objectMapper;
        this.venueRepository = venueRepository;
        this.serviceRepository = serviceRepository;
        this.customerRepository = customerRepository;
    }

    public AiPlanningService(GeminiConfig geminiConfig, ObjectMapper objectMapper) {
        this(geminiConfig, objectMapper, null, null, null);
    }

    public AiPlanningResponse generatePlan(AiPlanningRequest request) {
        String apiKey = geminiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_") || apiKey.contains("here")) {
            log.warn("Gemini API key is not configured. Returning deterministic fallback plan.");
            return generateFallbackPlan(request);
        }

        try {
            String prompt = buildPrompt(request);
            String url = String.format("%s/models/%s:generateContent?key=%s",
                    geminiConfig.getApiUrl(),
                    geminiConfig.getModel(),
                    apiKey.trim());

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.4,
                            "responseMimeType", "application/json"
                    )
            );

            String responseJson = geminiConfig.getRestClient().post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            if (responseJson == null || responseJson.isBlank()) {
                log.warn("Empty response from Gemini API. Using fallback plan.");
                return generateFallbackPlan(request);
            }

            return parseGeminiResponse(responseJson, request);

        } catch (Exception ex) {
            log.error("Failed to query Gemini API: {}. Returning fallback plan.", ex.getMessage());
            return generateFallbackPlan(request);
        }
    }

    private String buildPrompt(AiPlanningRequest request) {
        String eventTypeLabel = switch (request.getEventType().toLowerCase()) {
            case "wedding" -> "Tiệc cưới sang trọng";
            case "corporate" -> "Hội nghị / Sự kiện doanh nghiệp / Gala";
            case "birthday" -> "Tiệc sinh nhật / Kỷ niệm";
            case "concert" -> "Concert / Lễ hội âm nhạc";
            default -> request.getEventType();
        };

        String basePrompt = String.format("""
                Bạn là Giám đốc tư vấn và Lập kế hoạch sự kiện chuyên nghiệp của hệ thống EVManager.
                Hãy tạo kế hoạch phân bổ ngân sách chi tiết, gợi ý các gói dịch vụ, mốc thời gian chuẩn bị và kịch bản timeline cho sự kiện sau:
                
                - Loại hình sự kiện: %s
                - Tổng ngân sách: %.0f VNĐ
                - Quy mô khách mời: %d khách
                - Yêu cầu đặc biệt từ khách hàng: %s
                
                YÊU CẦU ĐẦU RA BẮT BUỘC:
                Chỉ trả về DUY NHẤT một chuỗi JSON hợp lệ (không chứa markdown fencing thừa ngoài JSON), tuân theo cấu trúc:
                {
                  "summary": "Tóm tắt định hướng và chủ đề sự kiện (khoảng 2-3 câu)",
                  "budgetBreakdown": {
                    "Sảnh tiệc & Thực đơn ẩm thực": số_tiền,
                    "Âm thanh & Ánh sáng sân khấu": số_tiền,
                    "Trang trí, Concept & Backdrop": số_tiền,
                    "Nhân sự điều phối & MC": số_tiền,
                    "Quay phim, Chụp ảnh & Truyền thông": số_tiền,
                    "Dự phòng phát sinh": số_tiền
                  },
                  "recommendedServices": [
                    "Tên gói dịch vụ gợi ý 1",
                    "Tên gói dịch vụ gợi ý 2",
                    "Tên gói dịch vụ gợi ý 3"
                  ],
                  "preparationMilestones": [
                    "T-30 ngày: Công việc chuẩn bị mốc 30 ngày trước sự kiện",
                    "T-15 ngày: Công việc chuẩn bị mốc 15 ngày",
                    "T-7 ngày: Công việc chuẩn bị mốc 7 ngày",
                    "T-3 ngày: Tổng duyệt và kiểm tra kỹ thuật",
                    "T-0 ngày: Bàn giao sảnh và vận hành"
                  ],
                  "dayOfTimeline": [
                    "Khung giờ 1 (VD: 17:00 - 18:00): Nội dung",
                    "Khung giờ 2: Nội dung",
                    "Khung giờ 3: Nội dung",
                    "Khung giờ 4: Nội dung"
                  ]
                }
                
                Lưu ý quan trọng: Tổng các khoản tiền trong budgetBreakdown phải xấp xỉ bằng tổng ngân sách %.0f VNĐ.
                """,
                eventTypeLabel,
                request.getTotalBudget(),
                request.getGuestCount() != null ? request.getGuestCount() : 100,
                request.getSpecialNotes() != null && !request.getSpecialNotes().isBlank() ? request.getSpecialNotes() : "Tiêu chuẩn",
                request.getTotalBudget()
        );

        String dbContext = buildDatabaseContext();
        if (!dbContext.isBlank()) {
            return basePrompt + "\nTHÔNG TIN ĐỊA ĐIỂM & DỊCH VỤ THỰC TẾ ĐỂ THAM KHẢO VÀ GỢI Ý:\n" + dbContext;
        }
        return basePrompt;
    }

    private AiPlanningResponse parseGeminiResponse(String responseJson, AiPlanningRequest request) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String rawText = parts.get(0).path("text").asText();
                    String cleanJson = rawText.replaceAll("(?i)^```json", "")
                            .replaceAll("```$", "")
                            .trim();

                    AiPlanningResponse parsed = objectMapper.readValue(cleanJson, AiPlanningResponse.class);
                    if (parsed.getBudgetBreakdown() != null && !parsed.getBudgetBreakdown().isEmpty()) {
                        return parsed;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse Gemini JSON payload: {}. Using fallback plan.", e.getMessage());
        }
        return generateFallbackPlan(request);
    }

    public AiPlanningResponse generateFallbackPlan(AiPlanningRequest request) {
        double budget = request.getTotalBudget() != null && request.getTotalBudget() > 0 ? request.getTotalBudget() : 50000000.0;
        int guests = request.getGuestCount() != null && request.getGuestCount() > 0 ? request.getGuestCount() : 100;
        String type = request.getEventType() != null ? request.getEventType().toLowerCase() : "wedding";

        String typeLabel = switch (type) {
            case "wedding" -> "tiệc cưới ấm cúng và sang trọng";
            case "corporate" -> "hội nghị / gala chuyên nghiệp";
            case "birthday" -> "tiệc sinh nhật kỷ niệm ấn tượng";
            case "concert" -> "liveshow / đại nhạc hội";
            default -> "sự kiện " + type;
        };

        String summary = String.format("Phương án tối ưu hóa ngân sách cho %s với quy mô %d khách. " +
                "Ngân sách được phân bổ hài hòa giữa ẩm thực, âm thanh ánh sáng và trang trí không gian.",
                typeLabel, guests);

        Map<String, Double> breakdown = new LinkedHashMap<>();
        breakdown.put("Sảnh tiệc & Thực đơn ẩm thực", (double) Math.round(budget * 0.45));
        breakdown.put("Âm thanh & Ánh sáng sân khấu", (double) Math.round(budget * 0.20));
        breakdown.put("Trang trí, Concept & Backdrop", (double) Math.round(budget * 0.15));
        breakdown.put("Nhân sự điều phối & MC", (double) Math.round(budget * 0.10));
        breakdown.put("Dự phòng & Chi phí khác", (double) Math.round(budget * 0.10));

        List<String> services = List.of(
                "Gói dịch vụ âm thanh & ánh sáng tiêu chuẩn",
                "Gói trang trí hoa tươi & Backdrop chụp ảnh",
                "Đội ngũ nhân sự điều phối sự kiện và MC chuyên nghiệp",
                "Quay phim 4K highlight & Chụp ảnh lưu niệm"
        );

        List<String> milestones = List.of(
                "T-30 ngày: Khảo sát địa điểm sảnh tiệc, ký hợp đồng và thanh toán cọc đợt 1",
                "T-15 ngày: Chốt danh sách thực đơn, layout bàn ghế và phương án trang trí",
                "T-7 ngày: Xác nhận danh sách khách mời chính thức và kịch bản chi tiết với MC",
                "T-3 ngày: Kiểm tra thiết bị âm thanh ánh sáng, duyệt slide và video trình chiếu",
                "T-0 ngày: Setup toàn diện trước 4 tiếng, tổng duyệt và chính thức vận hành sự kiện"
        );

        List<String> timeline = List.of(
                "17:00 - 18:00: Đón tiếp khách mời, check-in, chụp ảnh photobooth và tiệc trà nhẹ",
                "18:00 - 18:30: Khai mạc chương trình, phát biểu chào mừng và nghi thức khai tiệc",
                "18:30 - 20:00: Phục vụ thực đơn ẩm thực, biểu diễn văn nghệ và giao lưu sân khấu",
                "20:00 - 20:45: Hoạt động điểm nhấn (Lucky Draw / Minigame / Trao giải / Cắt bánh)",
                "20:45 - 21:15: Chụp ảnh lưu niệm tổng kết, cảm ơn khách mời và kết thúc sự kiện"
        );

        return new AiPlanningResponse(summary, breakdown, services, milestones, timeline);
    }

    public AiChatResponse chatWithConcierge(AiChatRequest request) {
        String apiKey = geminiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_") || apiKey.contains("here")) {
            log.warn("Gemini API key is not configured. Returning fallback concierge response.");
            return generateFallbackChatResponse(request);
        }

        try {
            String systemPrompt = """
                    Bạn là Genie - Trợ lý AI thông minh, linh hoạt và duyên dáng của nền tảng quản lý sự kiện EVManager.

                    NGUYÊN TẮC GIAO TIẾP TỰ NHIÊN:
                    1. Trò chuyện tự nhiên, linh hoạt như một chuyên viên tư vấn con người thực thụ: ngắn gọn, đúng trọng tâm câu hỏi của khách, tuyệt đối KHÔNG trả lời theo khuôn mẫu hay văn mẫu rập khuôn lặp đi lặp lại.
                    2. Đối với câu hỏi chào hỏi, đố vui, toán học hoặc ngoài lề (như "3+3=?", "chơi game không", tin tức...):
                       - Trả lời nhanh gọn, dí dỏm, thân thiện trong 1-2 câu.
                       - KHÔNG cố gắng gượng ép chèn thông điệp quảng cáo hay liệt kê âm thanh, ẩm thực, trang trí nếu khách không hỏi về sự kiện.
                    3. Đối với câu hỏi về sự kiện (tiệc cưới, hội nghị, sinh nhật, gala, giá cả, lịch trống):
                       - Đi thẳng vào trọng tâm câu hỏi của khách (VD: khách hỏi lịch cưới trống -> hỏi ngày/tháng mong muốn để tra cứu; khách hỏi giá -> đưa ra con số ước tính cụ thể; khách hỏi menu -> tư vấn món ăn thực tế).
                       - Giọng điệu ấm áp, hiếu khách, phong phú và đa dạng từ ngữ.
                    4. Luôn trả về 2-4 gợi ý câu hỏi tiếp theo (quickSuggestions) phù hợp ngữ cảnh để khách tiện bấm hỏi tiếp.

                    YÊU CẦU ĐẦU RA BẮT BUỘC:
                    Chỉ trả về DUY NHẤT một chuỗi JSON hợp lệ với cấu trúc:
                    {
                      "reply": "Nội dung phản hồi tự nhiên, duyên dáng và súc tích bằng tiếng Việt",
                      "quickSuggestions": [
                        "Câu hỏi gợi ý 1",
                        "Câu hỏi gợi ý 2",
                        "Câu hỏi gợi ý 3"
                      ]
                    }
                    """;

            String dbContext = buildDatabaseContext();
            if (!dbContext.isBlank()) {
                systemPrompt += "\n\nDỮ LIỆU ĐỊA ĐIỂM & DỊCH VỤ THỰC TẾ TRONG HỆ THỐNG EVMANAGER:\n" +
                        "(Hãy sử dụng dữ liệu này để báo giá và tư vấn chính xác khi khách hỏi về sảnh tiệc, sức chứa, giá cả):\n" + dbContext;
            }

            List<Map<String, Object>> contents = new ArrayList<>();

            List<ChatMessageDto> history = request.getHistory();
            if (history != null && !history.isEmpty()) {
                int startIndex = Math.max(0, history.size() - 10);
                for (int i = startIndex; i < history.size(); i++) {
                    ChatMessageDto msg = history.get(i);
                    if (msg.getContent() != null && !msg.getContent().isBlank()) {
                        String role = "user".equalsIgnoreCase(msg.getRole()) ? "user" : "model";
                        contents.add(Map.of(
                                "role", role,
                                "parts", List.of(Map.of("text", msg.getContent()))
                        ));
                    }
                }
            }

            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", request.getMessage()))
            ));

            String url = String.format("%s/models/%s:generateContent?key=%s",
                    geminiConfig.getApiUrl(),
                    geminiConfig.getModel(),
                    apiKey.trim());

            Map<String, Object> requestBody = Map.of(
                    "systemInstruction", Map.of(
                            "parts", List.of(Map.of("text", systemPrompt))
                    ),
                    "contents", contents,
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "responseMimeType", "application/json"
                    )
            );

            String responseJson = geminiConfig.getRestClient().post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            if (responseJson == null || responseJson.isBlank()) {
                return generateFallbackChatResponse(request);
            }

            return parseGeminiChatResponse(responseJson, request);

        } catch (Exception ex) {
            log.error("Failed to query Gemini chat API: {}. Returning fallback chat response.", ex.getMessage());
            return generateFallbackChatResponse(request);
        }
    }

    private AiChatResponse parseGeminiChatResponse(String responseJson, AiChatRequest request) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String rawText = parts.get(0).path("text").asText();
                    String cleanJson = rawText.replaceAll("(?i)^```json", "")
                            .replaceAll("```$", "")
                            .trim();

                    try {
                        AiChatResponse parsed = objectMapper.readValue(cleanJson, AiChatResponse.class);
                        if (parsed.getReply() != null && !parsed.getReply().isBlank()) {
                            return parsed;
                        }
                    } catch (Exception e) {
                        log.info("Gemini replied with natural text. Using raw text response.");
                        return new AiChatResponse(rawText, List.of(
                                "Tư vấn gói tiệc cưới trọn gói",
                                "Báo giá hội nghị doanh nghiệp",
                                "Dự toán chi phí sự kiện"
                        ));
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse Gemini chat response JSON: {}. Using fallback reply.", e.getMessage());
        }
        return generateFallbackChatResponse(request);
    }

    public AiChatResponse generateFallbackChatResponse(AiChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().toLowerCase() : "";

        String reply;
        List<String> suggestions;

        if (msg.contains("cưới") || msg.contains("wedding")) {
            reply = "Dạ chào bạn! EVManager rất hân hạnh được đồng hành cùng ngày trọng đại của hai bạn.\n\n" +
                    "Hiện chúng tôi có các gói tiệc cưới trọn gói bao gồm:\n" +
                    "• Gói Silver (35 - 60 triệu): Sảnh tiệc hiện đại, thực đơn 6 món chuẩn vị, âm thanh ánh sáng cơ bản.\n" +
                    "• Gói Gold (60 - 120 triệu): Trang trí hoa tươi cao cấp, màn hình LED P3, MC và vũ đoàn khai tiệc.\n" +
                    "• Gói Diamond VIP (> 120 triệu): Thiết kế concept riêng biệt, chụp hình đón khách & video highlight 4K.\n\n" +
                    "Bạn dự kiến tổ chức tiệc cho bao nhiêu khách mời và vào thời gian nào ạ?";
            suggestions = List.of(
                    "Xem thực đơn tiệc cưới mẫu",
                    "Chi phí trang trí hoa tươi sảnh",
                    "Dự toán ngân sách tiệc 150 khách"
            );
        } else if (msg.contains("hội nghị") || msg.contains("doanh nghiệp") || msg.contains("corporate") || msg.contains("gala")) {
            reply = "Chào Quý khách! EVManager cung cấp giải pháp tổ chức hội nghị và sự kiện doanh nghiệp chuẩn chuyên nghiệp:\n\n" +
                    "• Hội thảo & Hội nghị khách hàng: Hệ thống màn hình LED, âm thanh micro không dây, cabin dịch thuật.\n" +
                    "• Tiệc tất niên / Year-End Party & Gala: Kịch bản sân khấu sôi động, teambuilding, minigame công nghệ.\n" +
                    "• Lễ ra mắt sản phẩm: Setup backdrop chụp hình 3D, hiệu ứng ánh sáng laser hiện đại.\n\n" +
                    "Quý công ty có thể cho chúng tôi biết quy mô nhân sự và ngày dự kiến không ạ?";
            suggestions = List.of(
                    "Báo giá teabreak hội nghị",
                    "Chi phí thuê âm thanh ánh sáng hội trường",
                    "Kế hoạch tổ chức Year End Party"
            );
        } else if (msg.contains("sinh nhật") || msg.contains("birthday") || msg.contains("thôi nôi")) {
            reply = "Chào bạn! EVManager có các gói tổ chức tiệc sinh nhật & thôi nôi vô cùng ấm cúng và lung linh:\n\n" +
                    "• Trang trí backdrop bong bóng nghệ thuật theo chủ đề.\n" +
                    "• Chú hề tạo hình bong bóng, MC hoạt náo và biểu diễn ảo thuật vui nhộn.\n" +
                    "• Thực đơn tiệc đa dạng phù hợp cho cả người lớn và trẻ em.\n\n" +
                    "Bạn muốn tổ chức sinh nhật cho bé hay tiệc kỷ niệm người lớn ạ?";
            suggestions = List.of(
                    "Gói trang trí sinh nhật cho bé",
                    "Menu tiệc sinh nhật gia đình",
                    "Đặt lịch giữ chỗ cuối tuần"
            );
        } else {
            reply = "Xin chào! Tôi là Genie - Trợ lý tư vấn sự kiện ảo của EVManager.\n\n" +
                    "Tôi có thể hỗ trợ bạn:\n" +
                    "1. Tư vấn chi phí và lập dự toán ngân sách sự kiện theo yêu cầu.\n" +
                    "2. Gợi ý chọn sảnh tiệc, thực đơn ẩm thực và phong cách trang trí.\n" +
                    "3. Lập mốc thời gian chuẩn bị và kịch bản chi tiết ngày tổ chức.\n\n" +
                    "Bạn đang quan tâm đến loại hình sự kiện nào (tiệc cưới, hội nghị, sinh nhật, khai trương)?";
            suggestions = List.of(
                    "Tư vấn gói tiệc cưới trọn gói",
                    "Tổ chức hội nghị doanh nghiệp",
                    "Dự toán ngân sách tự động",
                    "Liên hệ hotline hỗ trợ trực tiếp"
            );
        }

        return new AiChatResponse(reply, suggestions);
    }

    public String buildDatabaseContext() {
        StringBuilder sb = new StringBuilder();
        try {
            if (venueRepository != null) {
                List<Venue> venues = venueRepository.findAll();
                if (!venues.isEmpty()) {
                    sb.append("\n[DỮ LIỆU SẢNH TIỆC THỰC TẾ CỦA EVMANAGER]:\n");
                    for (Venue v : venues) {
                        sb.append(String.format("- %s (Sức chứa: %d-%d khách, Giá thuê niêm yết: %,.0f VNĐ, Vị trí: %s, Trạng thái: %s)\n",
                                v.getVenueName(),
                                v.getMinCapacity() != null ? v.getMinCapacity() : 0,
                                v.getMaxCapacity() != null ? v.getMaxCapacity() : 0,
                                v.getRentalPrice() != null ? v.getRentalPrice().doubleValue() : 0,
                                v.getAddress() != null ? v.getAddress() : "Khuôn viên trung tâm",
                                v.getStatus()));
                    }
                }
            }
            if (serviceRepository != null) {
                List<com.evmanager.services.model.Service> services = serviceRepository.findAll();
                if (!services.isEmpty()) {
                    sb.append("\n[DỮ LIỆU DỊCH VỤ SỰ KIỆN THỰC TẾ]:\n");
                    for (var s : services) {
                        sb.append(String.format("- %s (Đơn giá: %,.0f VNĐ, Mô tả: %s)\n",
                                s.getServiceName(),
                                s.getUnitPrice() != null ? s.getUnitPrice().doubleValue() : 0,
                                s.getDescription() != null ? s.getDescription() : ""));
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not load database context: {}", e.getMessage());
        }
        return sb.toString();
    }

    @Transactional
    public AiInquiryResponse submitInquiry(AiInquiryRequest request) {
        if (customerRepository == null) {
            throw new IllegalStateException("CustomerRepository is not configured");
        }

        Customer customer = null;
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            customer = customerRepository.findByPhone(request.getPhone().trim()).orElse(null);
        }
        if (customer == null && request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            customer = customerRepository.findByEmailIgnoreCase(request.getEmail().trim()).orElse(null);
        }
        if (customer == null) {
            customer = new Customer();
            customer.setPhone(request.getPhone().trim());
        }

        customer.setFullName(request.getFullName().trim());
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            customer.setEmail(request.getEmail().trim());
        }
        if (customer.getAddress() == null || customer.getAddress().isBlank()) {
            customer.setAddress("Khách hàng gửi yêu cầu tư vấn qua AI Calculator");
        }
        customer = customerRepository.save(customer);

        String inquiryCode = "INQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("Saved inquiry {} for customer '{}' ({}) for event '{}'",
                inquiryCode, customer.getFullName(), customer.getPhone(), request.getEventType());

        return new AiInquiryResponse(
                inquiryCode,
                customer.getFullName(),
                "RECEIVED",
                "Yêu cầu tư vấn của quý khách đã được tiếp nhận thành công. Chuyên viên sự kiện sẽ liên hệ tư vấn trong thời gian sớm nhất!",
                OffsetDateTime.now().toString()
        );
    }
}
