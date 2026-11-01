# Kế Hoạch Triển Khai: Nâng Cấp Toàn Diện Hệ Thống AI & Nghiệp Vụ EVManager

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện 3 tính năng nâng cấp giá trị cao: (1) RAG Grounding dữ liệu Sảnh tiệc & Dịch vụ thật từ PostgreSQL vào Gemini AI, (2) 1-Click chuyển kế hoạch AI thành Yêu cầu tư vấn/Lead cho Sales tiếp nhận, (3) Xuất bản in/PDF chuyên nghiệp cho Kế hoạch sự kiện trên Calculator.

**Architecture:** 
- Backend: Mở rộng `AiPlanningService` tiêm `VenueRepository` và `ServiceRepository` để nhúng dữ liệu thực tế vào System Instruction của Gemini 2.5 Flash; thêm API `POST /api/v1/ai/inquiry` nhận thông tin khách hàng và kế hoạch lưu vào `customers`/`contracts` draft.
- Frontend: Cập nhật `calculator.html` và `calculator.js` với modal "Đăng ký tư vấn theo kế hoạch này", nút "Xuất / In Kế hoạch (PDF)" chuẩn print CSS `@media print`, và nâng cấp giao diện `ai-chat.js` gợi ý sảnh tiệc thực tế.

**Tech Stack:** Java 21 LTS, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL, Jakarta Validation, Google Gemini 2.5 Flash, HTML5/CSS3/Vanilla JS.

**Spec:** [Tài liệu BA & Hệ thống EVManager](docs/)

## Global Constraints

- Tuân thủ nghiêm ngặt `AGENTS.md`: không hard-code secrets, không sửa migration cũ, giữ nguyên 54 unit tests hiện tại.
- Tất cả API mới phải được bảo vệ hoặc mở quyền phù hợp trong `SecurityConfig` và kiểm thử tự động.
- Không phụ thuộc vào thư viện ngoài nặng nề cho việc xuất PDF; sử dụng chuẩn in ấn trình duyệt (`window.print()` với styled printable report layout).

## Review Focus

- Xử lý khi cơ sở dữ liệu chưa có Sảnh/Dịch vụ hoặc danh sách rỗng (graceful fallback).
- Khách hàng nhập số điện thoại đã tồn tại trong DB -> Cập nhật thông tin khách hàng thay vì tạo trùng lặp (duplication conflict).
- Kiểm tra mã hóa ký tự tiếng Việt có dấu trong nội dung in ấn và phản hồi AI.

---

### Task 1: RAG Data-Grounding cho Gemini AI (Sảnh tiệc & Dịch vụ thật từ PostgreSQL)

**Files:**
- Modify: `backend/src/main/java/com/evmanager/ai/service/AiPlanningService.java`
- Modify: `backend/src/test/java/com/evmanager/ai/service/AiPlanningServiceTest.java`

**Interfaces:**
- Consumes: `VenueRepository.findAll()`, `ServiceRepository.findAll()`
- Produces: System context chứa danh sách Sảnh tiệc và Gói dịch vụ thực tế nhúng vào lời nhắc của Gemini API.

- [ ] **Step 1: Viết test kiểm tra grounding dữ liệu trong `AiPlanningServiceTest.java`**
- [ ] **Step 2: Chạy test để xác nhận test chạy**
- [ ] **Step 3: Cập nhật `AiPlanningService.java` tiêm `VenueRepository` và `ServiceRepository`, tạo ngữ cảnh dữ liệu thực tế**
- [ ] **Step 4: Chạy test xác nhận pass 100%**
- [ ] **Step 5: Commit với Conventional Commits**

---

### Task 2: Backend API Tiếp nhận Inquiry từ Kế hoạch AI (`POST /api/v1/ai/inquiry`)

**Files:**
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiInquiryRequest.java`
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiInquiryResponse.java`
- Modify: `backend/src/main/java/com/evmanager/ai/service/AiPlanningService.java`
- Modify: `backend/src/main/java/com/evmanager/ai/controller/AiPlanningController.java`
- Modify: `backend/src/main/java/com/evmanager/config/SecurityConfig.java`
- Create: `backend/src/test/java/com/evmanager/ai/controller/AiInquiryControllerTest.java`

**Interfaces:**
- Input: `AiInquiryRequest` (`fullName`, `phone`, `email`, `eventType`, `guestCount`, `budget`, `specialNotes`, `planSummary`)
- Output: `AiInquiryResponse` (`inquiryId`, `customerName`, `status`, `message`, `createdAt`)

- [ ] **Step 1: Tạo DTOs `AiInquiryRequest.java` và `AiInquiryResponse.java` với validation**
- [ ] **Step 2: Viết test cho `AiInquiryControllerTest.java`**
- [ ] **Step 3: Triển khai phương thức `submitInquiry` trong `AiPlanningService.java` lưu thông tin vào `Customer`**
- [ ] **Step 4: Thêm endpoint `POST /api/v1/ai/inquiry` trong `AiPlanningController.java` và cấp quyền trong `SecurityConfig.java`**
- [ ] **Step 5: Chạy test xác nhận pass 100%**
- [ ] **Step 6: Commit với Conventional Commits**

---

### Task 3: Frontend - Nút Xuất/In Kế hoạch PDF & Modal Gửi Yêu Cầu Tư Vấn cho Sales

**Files:**
- Modify: `frontend/calculator.html`
- Modify: `frontend/js/calculator.js`
- Modify: `frontend/css/styles.css` (hoặc inline print styles)

**Interfaces:**
- Nút "Xuất / In Kế hoạch (PDF)" gọi `window.print()` với mẫu in được tối ưu hóa hiển thị thương hiệu LV34 Events, bảng phân bổ ngân sách, timeline đếm ngược.
- Nút "Đăng ký tư vấn theo kế hoạch này" mở popup/modal thu thập Tên, SĐT, Email và gọi `POST http://localhost:8080/api/v1/ai/inquiry`, sau đó hiển thị thông báo thành công mã tra cứu.

- [ ] **Step 1: Thêm modal popup "Gửi yêu cầu tư vấn" và giao diện nút bấm trên `calculator.html`**
- [ ] **Step 2: Thêm CSS `@media print` chuyên biệt để khi in hoặc Lưu PDF chỉ in bản kế hoạch đẹp mắt**
- [ ] **Step 3: Viết logic xử lý sự kiện trong `frontend/js/calculator.js`**
- [ ] **Step 4: Kiểm thử thủ công trên trình duyệt và gọi API**
- [ ] **Step 5: Commit với Conventional Commits**

---

### Task 4: Kiểm thử tích hợp toàn diện & Báo cáo kết quả

- [ ] **Step 1: Chạy toàn bộ test suite Maven `mvn test` đảm bảo 100% tests pass**
- [ ] **Step 2: Thử nghiệm thực tế luồng: Tính toán ngân sách -> Đăng ký tư vấn -> Kiểm tra dữ liệu được lưu -> In PDF**
- [ ] **Step 3: Kiểm tra trạng thái Git và tổng kết nghiệm thu**
