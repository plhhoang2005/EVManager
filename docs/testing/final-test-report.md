# BÁO CÁO KIỂM THỬ TỔNG KẾT CUỐI KỲ (FINAL TEST REPORT)
## VÀ CHỨNG CHỈ ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM (SOFTWARE QUALITY ASSURANCE SIGN-OFF)

---

| Thông tin Hồ sơ | Chi tiết |
| :--- | :--- |
| **Dự án** | **EVManager — Hệ thống Quản lý Dịch vụ Sự kiện & Tiệc cưới** |
| **Mã dự án / Học phần** | LV34-001 — Học phần Quản lý Dự án CNTT (MAN104) |
| **Mã công việc** | Task QA-25 (Issue #156 — Biên soạn Báo cáo kiểm thử tổng kết cuối kỳ và Biên bản nghiệm thu chất lượng) |
| **Cột mốc dự án** | Tuần 8 — Bảo vệ Đồ án & Đóng dự án (Project Closure Milestone) |
| **Người thực hiện (QA Lead)** | **Bùi Nguyễn Chí Hậu** (Database Specialist & QA/Test Lead) |
| **Người phê duyệt (PM)** | **Phan Lê Huy Hoàng** (Project Manager) |
| **Thời gian thực hiện** | 07/09/2026 – 01/11/2026 (Tổng hợp 8 tuần) |
| **Tệp báo cáo PDF giao nộp** | [`docs/testing/Final_Test_Report_EVManager.pdf`](Final_Test_Report_EVManager.pdf) |
| **Trạng thái phê duyệt** | **APPROVED & QUALITY SIGN-OFF (NGHIỆM THU ĐẠT 100%)** |

---

## 1. MỤC TIÊU VÀ CĂN CỨ PHÁP LÝ / HỌC THUẬT

### 1.1. Mục tiêu kiểm thử cuối kỳ
1. **Tổng kết toàn diện hoạt động kiểm thử**: Đánh giá toàn bộ kết quả kiểm thử phần mềm qua 8 tuần phát triển Agile/Scrum của dự án EVManager, từ giai đoạn lập kế hoạch, kiểm thử đơn vị (Unit Test), kiểm thử tích hợp (Integration Test), kiểm thử chức năng (System Test), kiểm thử hiệu năng (Performance Test) đến kiểm thử chấp nhận người dùng (UAT).
2. **Xác nhận độ bao phủ yêu cầu (Traceability Coverage)**: Đối soát ma trận RTM để chứng minh 100% các Use Case (từ UC-01 đến UC-14) đều có ít nhất 2 Test Cases kiểm chứng độc lập.
3. **Đánh giá mức độ sẵn sàng triển khai (Production Readiness)**: Rà soát toàn diện các chỉ số chất lượng, độ tin cậy, thời gian phản hồi, khả năng chịu tải đồng thời và độ an toàn dữ liệu trước khi bàn giao cho Hội đồng chấm đồ án.
4. **Cấp Biên bản nghiệm thu chất lượng**: Ký biên bản bàn giao và nghiệm thu chính thức giữa QA Lead và Project Manager.

### 1.2. Căn cứ và Tài liệu đối chiếu
- **Project Charter & Scope Statement**: [`docs/charter/project_charter.md`](../charter/project_charter.md), [`docs/charter/scope_statement.md`](../charter/scope_statement.md).
- **Đặc tả yêu cầu phần mềm (SRS v1.0) & 14 Use Cases**: [`docs/requirements/SRS_EVManager_v1.0.md`](../requirements/SRS_EVManager_v1.0.md).
- **Ma trận truy vết yêu cầu (RTM v1.0)**: [`docs/requirements/Requirement_Traceability_Matrix.md`](../requirements/Requirement_Traceability_Matrix.md).
- **Kế hoạch kiểm thử (Test Plan)**: [`docs/testing/test-plan.md`](test-plan.md).
- **Bộ 35 Test Cases chi tiết**: [`docs/testing/test-cases.md`](test-cases.md).
- **Báo cáo kiểm thử hiệu năng (Task QA-22)**: [`docs/testing/performance-test-report.md`](performance-test-report.md).
- **Biên bản kiểm thử UAT 15 kịch bản (Task QA-23)**: [`docs/testing/uat-execution-results.md`](uat-execution-results.md).
- **Bảng tổng kết đóng lỗi Defect Log (Task QA-24)**: [`docs/testing/defect-log-final.md`](defect-log-final.md).

---

## 2. TỔNG HỢP KẾT QUẢ KIỂM THỬ TỪ TUẦN 1 ĐẾN TUẦN 8

### 2.1. Thống kê Khối lượng Kiểm thử Toàn diện (Testing Volume & Execution)

Trong suốt 8 tuần triển khai, đội ngũ QA đã tiến hành kiểm thử liên tục qua 4 đợt chính tương ứng với các cột mốc dự án:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   BẢNG CHỈ SỐ KIỂM THỬ TỔNG HỢP CUỐI KỲ (QA DASHBOARD)                 │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│ TỔNG SỐ KỊCH BẢN KIỂM THỬ     │ TỔNG SỐ LƯỢT CHẠY KIỂM THỬ   │ TỶ LỆ PASS CUỐI CÙNG   │
│        132 KỊCH BẢN           │         296 LƯỢT TEST         │        100.0% PASS     │
├───────────────────────────────┼───────────────────────────────┼────────────────────────┤
│ TỔNG SỐ DEFECTS PHÁT HIỆN     │ SỐ LỖI ĐÃ KHẮC PHỤC TRIỆT ĐỂ  │ DEFECT TỒN ĐỌNG (OPEN) │
│       10 LỖI (100% LOGGED)    │       10 / 10 LỖI (100%)      │      0 LỖI (ZERO BUG)  │
├───────────────────────────────┼───────────────────────────────┼────────────────────────┤
│ HIỆU NĂNG TẢI (50 VUs)        │ THỜI GIAN PHẢN HỒI P95        │ KẾT QUẢ NGHIỆM THU UAT │
│        100% STABLE            │        245 ms (< 500ms SLA)   │    15 / 15 ACCEPTED    │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
```

### 2.2. Chi tiết phân loại theo Cấp độ Kiểm thử (Testing Levels Breakdown)

| Cấp độ kiểm thử (Level) | Công cụ thực hiện | Số lượng kịch bản | Số lượt chạy (Runs) | Đạt (Pass) | Lỗi (Fail) | Tỷ lệ Pass (%) | Trạng thái cuối kỳ |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Unit Test (Tầng Service & Model)** | JUnit 5, Mockito, AssertJ | **50** | 124 | 50 | 0 | 100.0% | **PASSED** |
| **2. Integration & Concurrency Test** | `@SpringBootTest`, H2/PostgreSQL | **32** | 61 | 32 | 0 | 100.0% | **PASSED** |
| **3. Functional System Test (Blackbox)** | Manual Testing, Postman Runner | **35** | 70 | 35 | 0 | 100.0% | **PASSED** |
| **4. UAT (Kiểm thử Chấp nhận Người dùng)** | End-User Session (3 Khách hàng) | **15** | 15 | 15 | 0 | 100.0% | **ACCEPTED** |
| **5. Performance & Stress Test** | k6, Python Multi-threading (50 VUs) | **NFR Test** | 26 | SLA Met | 0 | 100.0% | **PASSED** |
| **TỔNG CỘNG** | **Hệ sinh thái QA EVManager** | **132** | **296** | **132** | **0** | **100.0%** | **PRODUCTION READY** |

> *Ghi chú xác minh thực tế*: Toàn bộ **82 automated tests** của Backend (50 Unit Tests + 32 Integration/Regression Tests) đã được thực thi tự động qua lệnh Maven `.\mvnw.cmd test` với kết quả: `Tests run: 82, Failures: 0, Errors: 0, Skipped: 0` trong **17.827 giây**.

---

## 3. MA TRẬN BAO PHỦ YÊU CẦU KIỂM THỬ (TRACEABILITY MATRIX - 100% COVERAGE)

Tiêu chí nghiệm thu của Task QA-25 yêu cầu: **100% các Use Case (UC-01 đến UC-14) đều phải có ít nhất 2 Test Cases kiểm chứng độc lập**.

Dưới đây là ma trận đối chiếu chi tiết:

| Mã UC | Tên Use Case nghiệp vụ | Phân hệ | Danh sách Test Cases kiểm chứng (Tối thiểu 2 TCs) | Số TC | Mức độ bao phủ | Kết quả kiểm thử |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: |
| **UC-01** | Đăng nhập hệ thống & Khởi tạo phiên | Auth | `TC_AUTH_01` (Đăng nhập đúng), `TC_AUTH_02` (Sai mật khẩu), `TC_AUTH_03` (Tài khoản khóa), `LoginNormalizationRegressionTest` (8 tests), `UAT-01` | 12 | 600% | **PASS 100%** |
| **UC-02** | Phân quyền vai trò RBAC & Đổi mật khẩu | Auth/User | `TC_AUTH_05` (Chặn quyền trái phép), `TC_AUTH_06` (Quyền kế toán), `TC_AUTH_04` (Quên MK), `UserServiceTest` (4 tests), `UAT-02` | 8 | 400% | **PASS 100%** |
| **UC-03** | Quản lý hồ sơ khách hàng | Customer | `TC_CUST_01` (Thêm hợp lệ), `TC_CUST_02` (Thiếu thông tin), `TC_CUST_03` (Trùng Email), `UAT-03`, `UAT-04` | 5 | 250% | **PASS 100%** |
| **UC-04** | Tra cứu sảnh theo ngày, ca và số bàn | Venue | `TC_VENUE_01` (Tra cứu hợp lệ), `TC_VENUE_02` (Vượt sức chứa), `VenueServiceTest` (9 tests), `UAT-05`, `UAT-06` | 13 | 650% | **PASS 100%** |
| **UC-05** | Quản lý thông tin sảnh & Giữ chỗ tạm | Venue | `TC_VENUE_03` (Thêm sảnh), `TC_VENUE_04` (Cập nhật giá sảnh), `TC_VENUE_05` (Khóa bảo trì), `TC_VENUE_06` | 4 | 200% | **PASS 100%** |
| **UC-06** | Chọn Set Menu & Tùy chỉnh món ăn | Menu/Dish | `TC_MENU_01` (Tạo Menu), `TC_MENU_02` (Gán món vào menu), `TC_MENU_03` (Tạo món mới), `TC_MENU_04` (Giá âm), `MenuServiceTest` (3 tests), `UAT-07` | 8 | 400% | **PASS 100%** |
| **UC-07** | Chọn dịch vụ đi kèm & Ưu đãi số bàn | Service | `TC_MENU_05` (Thêm dịch vụ), `TC_MENU_06` (Cập nhật dịch vụ), `TC_MENU_07` (Ngừng phục vụ), `TC_MENU_08`, `UAT-08` | 5 | 250% | **PASS 100%** |
| **UC-08** | Tính toán tổng chi phí, Chiết khấu & VAT | Pricing | `TC_EVENT_04` (Tính tổng chi phí), `TC_EVENT_05` (Chiết khấu voucher), `TC_EVENT_06` (Tính VAT), `ContractPricingExhaustiveRegressionTest` (10 tests), `UAT-09` | 14 | 700% | **PASS 100%** |
| **UC-09** | Lập lịch sự kiện & Theo dõi tiến độ | Event | `TC_EVENT_01` (Tạo lịch sự kiện), `TC_EVENT_02` (Thời gian kết thúc trước bắt đầu), `TimezoneSynchronizationRegressionTest` (9 tests), `UAT-10`, `UAT-11` | 13 | 650% | **PASS 100%** |
| **UC-10** | Kiểm tra và cảnh báo xung đột lịch sảnh | Conflict | `TC_EVENT_03` (Xung đột sảnh đệm 60p), `EventConcurrencyIntegrationTest` (Chống Race Condition), `ConflictCheckerEdgeCasesTest` (6 tests), `UAT-12` | 9 | 450% | **PASS 100%** |
| **UC-11** | Quản lý hợp đồng & Phê duyệt trạng thái | Contract | `TC_EVENT_07` (Tạo hợp đồng), `TC_EVENT_08` (Admin duyệt hợp đồng), `ContractServiceTest` (6 tests), `UAT-13` | 9 | 450% | **PASS 100%** |
| **UC-12** | Quản lý thanh toán đặt cọc & Đợt thanh toán | Payment | `TC_EVENT_09` (Đặt cọc 30%), `TC_AUTH_06` (Kế toán ghi nhận thanh toán), `UAT-13` | 3 | 150% | **PASS 100%** |
| **UC-13** | Điều phối nhân sự sảnh & Chuẩn bị tiệc | Coordinator | `UAT-08` (Điều phối âm thanh ánh sáng), `UAT-11` (Bàn giao checklist ca tiệc), `TC_EVENT_01` | 3 | 150% | **PASS 100%** |
| **UC-14** | Dashboard quản trị & Báo cáo doanh thu | Dashboard | `UAT-14` (Xem biểu đồ doanh thu), `UAT-15` (Báo cáo tháng), `TC_AUTH_01` (Dashboard admin) | 3 | 150% | **PASS 100%** |

> **Kết luận bao phủ**: **14 / 14 Use Cases (100%)** đạt chuẩn nghiệm thu; tất cả Use Cases đều có từ **3 đến 14 kịch bản kiểm thử** đối soát chéo (vượt xa tiêu chuẩn tối thiểu là 2 TCs).

---

## 4. BÁO CÁO QUẢN LÝ LỖI & ĐÓNG HỒ SƠ DEFECTS (DEFECT SUMMARY & SIGN-OFF)

Theo kết quả bàn giao tại [`docs/testing/defect-log-final.md`](defect-log-final.md), toàn bộ 10 lỗi phát sinh trong suốt dự án đã được khắc phục và đóng hồ sơ thành công:

| Mã Bug | Tóm tắt lỗi | Mức độ | Phân hệ | Bộ test hồi quy kiểm chứng (Re-test Evidence) | Trạng thái Issue |
| :---: | :---| :---: | :---: | :---| :---: |
| **BUG-01** (`#150`) | Chuẩn hóa username/email về chữ thường (lowercase) trước khi đối chiếu | High | Auth | `LoginNormalizationRegressionTest` (8/8 tests PASS) | **CLOSED** |
| **BUG-02** | Đồng bộ múi giờ UTC+7 cho các trường DateTime tránh lệch ngày đặt tiệc | High | Event/UI | `TimezoneSynchronizationRegressionTest` (9/9 tests PASS) | **CLOSED** |
| **BUG-03** | Sửa công thức tính chiết khấu kép (áp dụng % chiết khấu trước, trừ voucher sau) | High | Pricing | `ContractPricingExhaustiveRegressionTest` (10/10 tests PASS) | **CLOSED** |
| **BUG-04** | Race condition khi nhiều người dùng cùng đặt một sảnh cùng lúc | High | Event/Venue | `ConflictCheckerEdgeCasesTest` & `EventConcurrencyIntegrationTest` (PASS) | **CLOSED** |
| **BUG-05** (`EV-157`) | Ô tìm kiếm khách hàng và sự kiện không hiển thị dữ liệu | High | Customer | Re-test tìm kiếm Debounce 300ms hiển thị ngay từ CSDL | **CLOSED** |
| **BUG-06** (`EV-158`) | Thiếu API Dashboard tổng hợp khiến Frontend bị 404 | High | Dashboard | `DashboardController` trả đủ 4 chỉ số KPI | **CLOSED** |
| **BUG-07** (`EV-159`) | Thiếu ràng buộc Validate SĐT Việt Nam và Email RFC | Medium | Validation | Re-test nhập SĐT 10 số kiểm tra regex chặt chẽ | **CLOSED** |
| **BUG-08** (`EV-160`) | CSDL thiếu phân quyền 4 vai trò chuẩn theo BA | High | Auth/RBAC | Flyway V10-V11 nạp đủ 4 role (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`) | **CLOSED** |
| **BUG-104** | Email đăng nhập phân biệt chữ hoa/thường | Medium | Auth | Re-test đăng nhập `ADMIN@EVMANAGER.VN` thành công | **CLOSED** |
| **BUG-105** | Nút "Thêm khách hàng" bị che ở độ phân giải 1024x768 | Low | Responsive | Re-test giao diện 1024x768 hiển thị bảng chuẩn với `overflow-x: auto` | **CLOSED** |

- **Số lỗi Critical / Blocker còn tồn đọng**: **0 lỗi (Zero Blocker)**.
- **Số lỗi High còn tồn đọng**: **0 lỗi (Zero High Bug)**.
- **Tỷ lệ đóng lỗi**: **10 / 10 lỗi (100%)**.

---

## 5. ĐÁNH GIÁ MỨC ĐỘ SẴN SÀNG TRIỂN KHAI THỰC TẾ (PRODUCTION READINESS)

Đội ngũ QA đánh giá mức độ sẵn sàng triển khai thực tế của EVManager dựa trên 5 trụ cột chất lượng phần mềm tiêu chuẩn công nghiệp:

### 5.1. Độ hoàn thiện Chức năng (Functional Completeness) — ĐÁNH GIÁ: SẴN SÀNG (100%)
- Hệ thống số hóa trọn vẹn quy trình 3 bước cốt lõi:
  1. *Tư vấn & Tiếp nhận*: Tra cứu sảnh trống theo ngày/ca, chọn thực đơn bàn tiệc từ `contract_menus`, chọn dịch vụ đi kèm `contract_services`.
  2. *Báo giá & Hợp đồng*: Tính chi phí tự động (trừ chiết khấu %, trừ voucher tiền mặt, tính VAT 8%), sinh mã hợp đồng duy nhất, đặt cọc 30%.
  3. *Điều phối & Bàn giao*: Lịch sự kiện FullCalendar trực quan với múi giờ chuẩn UTC+7, kiểm tra xung đột tự động với đệm 60 phút dọn dẹp sảnh.

### 5.2. Hiệu năng & Khả năng chịu tải (Performance & Scalability) — ĐÁNH GIÁ: XUẤT SẮC
- Theo kết quả đo tải k6 và Python đa luồng (Task QA-22):
  - **Khả năng chịu tải đồng thời**: Chịu tải ổn định với **50 Virtual Users (VUs)** gửi liên tục 1.000 requests.
  - **Thời gian phản hồi API tra cứu sảnh**: Thời gian trung bình **186ms**, p95 đạt **245ms** (Vượt xa cam kết SLA < 500ms).
  - **Tỷ lệ lỗi (Error Rate)**: **0.00%** (Không có bất kỳ HTTP 5xx hay timeout nào).
  - **Tốc độ tải trang Frontend**: Dashboard tải trong **1.82s**, Lịch sự kiện tải trong **2.15s** (Đạt SLA < 3s).
  - **Độ ổn định bộ nhớ**: Không xảy ra hiện tượng rò rỉ bộ nhớ (Zero Memory Leak) qua biểu đồ Sawtooth chuẩn của JVM Garbage Collector.

### 5.3. Độ tin cậy & Tính toàn vẹn Dữ liệu (Reliability & Data Integrity) — ĐÁNH GIÁ: TUYỆT ĐỐI
- **Kiểm soát đồng thời (Concurrency Control)**: Sử dụng Khóa ghi bi quan (`PESSIMISTIC_WRITE`) trên Repository kết hợp `@Transactional`, ngăn chặn triệt để tình trạng 2 nhân viên cùng đặt 1 sảnh trong cùng một khung giờ (Race condition).
- **Chuẩn hóa CSDL 3NF**: 15 bảng dữ liệu trong `database/schema.sql` có đầy đủ khóa chính (PK IDENTITY), khóa ngoại (FK RESTRICT/CASCADE) và ràng buộc logic (CHECK constraints: số khách > 0, đơn giá $\ge$ 0, thời gian kết thúc > thời gian bắt đầu, chiết khấu 0-100%).
- **Nhật ký kiểm toán (Audit Trail)**: Mọi thao tác trọng yếu được tự động lưu vết vào bảng `audit_logs` (thời gian, người thực hiện, thao tác, địa chỉ IP).

### 5.4. An toàn thông tin & Bảo mật (Security & Access Control) — ĐÁNH GIÁ: ĐẠT TIÊU CHUẨN
- Mật khẩu người dùng được băm an toàn bằng thuật toán **BCrypt** (Cost factor = 10).
- Cơ chế xác thực phân tán **JWT (JSON Web Token)** với chữ ký HMAC-SHA384, mã hóa Stateless và kiểm tra quyền RBAC đa tầng (`@PreAuthorize` trên từng Endpoint).
- Cơ chế chống tấn công Brute-force: Tự động khóa tài khoản (`status = 'LOCKED'`) sau 5 lần đăng nhập thất bại liên tiếp.
- Cơ chế xác thực 2 bước (OTP 6 số qua email lưu tại bảng `otp_tokens`, thời hạn 5 phút) khi đăng ký và khôi phục mật khẩu.

### 5.5. Khả năng Vận hành & Phục hồi (DevOps & Disaster Recovery) — ĐÁNH GIÁ: HOÀN THIỆN
- **Cơ chế Migration tự động**: Toàn bộ thay đổi CSDL được kiểm soát phiên bản qua **Flyway (16 bản script từ V1 đến V16)**, đảm bảo môi trường phát triển, Staging và Production hoàn toàn đồng nhất.
- **Hạ tầng Container hóa**: Sẵn sàng triển khai nhanh qua `docker-compose.yml` gồm PostgreSQL 16 và Spring Boot API.

---

## 6. KẾT LUẬN & BIÊN BẢN NGHIỆM THU CHẤT LƯỢNG (QUALITY ACCEPTANCE SIGN-OFF)

### 6.1. Kết luận của Ban Kiểm thử
Căn cứ vào toàn bộ kết quả kiểm thử thực tế từ Tuần 1 đến Tuần 8, Ban QA trân trọng báo cáo:
1. Hệ thống EVManager đã đạt **100% mục tiêu chất lượng** và tiêu chí nghiệm thu đề ra trong Kế hoạch kiểm thử `test-plan.md`.
2. Hệ thống đạt trạng thái **Zero Critical/Blocker Bugs**, tỷ lệ Pass kiểm thử đạt **100%** trên toàn bộ 82 bài test tự động và các kịch bản kiểm thử tích hợp.
3. Hệ thống hoàn toàn sẵn sàng bàn giao cho Project Manager để tiến hành đóng dự án và bảo vệ trước Hội đồng chấm đồ án học phần MAN104.

---

### 6.2. BIÊN BẢN NGHIỆM THU CHẤT LƯỢNG PHẦN MỀM (FINAL QUALITY SIGN-OFF)

Hôm nay, ngày **18 tháng 10 năm 2026**, tại Văn phòng Dự án EVManager:
Chúng tôi đại diện các bên gồm:
- **Đại diện Ban Đảm bảo Chất lượng (QA Team)**: Ông **Bùi Nguyễn Chí Hậu** — Database Specialist & QA/Test Lead.
- **Đại diện Ban Quản lý Dự án (PM Team)**: Ông **Phan Lê Huy Hoàng** — Project Manager.

Cùng thống nhất ký biên bản xác nhận: **CHẤP THUẬN NGHIỆM THU CHẤT LƯỢNG PHẦN MỀM (FINAL SQA ACCEPTANCE)** cho hệ thống EVManager phiên bản Release `v1.0.0`.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               CHỨNG CHỈ ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM — EVMANAGER RELEASE V1.0.0          │
│                                                                                        │
│  Xác nhận Hệ thống Quản lý Dịch vụ Sự kiện EVManager đã vượt qua toàn bộ 132 kịch bản │
│  kiểm thử (Unit, Integration, Functional System, Performance, UAT), khắc phục triệt để │
│  10/10 lỗi phần mềm, đạt tiêu chuẩn Zero Critical Defect và hoàn toàn sẵn sàng đưa vào │
│  vận hành chính thức.                                                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| ĐẠI DIỆN BAN KIỂM THỬ (QA LEAD) | ĐẠI DIỆN BAN QUẢN LÝ DỰ ÁN (PROJECT MANAGER) |
| :---: | :---: |
| *(Đã ký và đóng dấu nghiệm thu)* | *(Đã phê duyệt nghiệm thu & đóng dự án)* |
| <br><br>**Bùi Nguyễn Chí Hậu** | <br><br>**Phan Lê Huy Hoàng** |
| Ngày ký: 18/10/2026 | Ngày ký: 18/10/2026 |
