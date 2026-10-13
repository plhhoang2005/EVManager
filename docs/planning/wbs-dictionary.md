# Từ Điển Phân Rã Công Việc (WBS Dictionary)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-08 (Issue #14 — Lập Từ điển công việc WBS Dictionary mô tả chi tiết từng gói công việc) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày lập** | 18/09/2026 (Tuần 2) |
| **Tài liệu liên kết** | [`docs/planning/WBS_EVManager_Format_v2.xlsx`](WBS_EVManager_Format_v2.xlsx), [`docs/submission/QLDA_Nhom_LichDuAn.xlsx`](../submission/QLDA_Nhom_LichDuAn.xlsx) |

---

## 1. Tổng quan Cấu trúc WBS Dự án EVManager

Cấu trúc phân rã công việc (WBS) của dự án **EVManager** được thiết kế tuân thủ **Quy tắc 100% (100% Rule)** và **Quy tắc 8/80 giờ (8/80 Hour Rule)** theo chuẩn PMBOK, chia thành **5 giai đoạn chính (Level 2)** và **22 gói công việc trọng tâm (Work Packages — Level 3/4)** tương ứng với **161 GitHub Issues**:

1. **1.0 — Khởi động & Quản trị Dự án (Project Initiation & Management)**
2. **2.0 — Phân tích Nghiệp vụ & Thiết kế Hệ thống (Analysis & System Design)**
3. **3.0 — Phát triển Phần mềm Lõi & Mở rộng (Software Development — Backend, Frontend, Database)**
4. **4.0 — Kiểm thử, Đảm bảo Chất lượng & Triển khai (QA, Testing & Deployment)**
5. **5.0 — Nghiệm thu UAT, Bàn giao & Đóng Dự án (UAT & Project Closure)**

---

## 2. Bảng Từ Điển WBS Tổng Hợp (Master WBS Dictionary Table)

| Mã WBS | Tên gói công việc (Work Package) | Mô tả phạm vi công việc | Sản phẩm bàn giao (Deliverables) | Tiền đề (Predecessor) | Ước lượng (Ngày công) | Chủ trì (R) | Nghiệm thu (A) |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **1.1** | Khởi tạo Tôn chỉ & Phạm vi dự án | Soạn Project Charter, mục tiêu SMART, Scope Statement, RACI Matrix, họp Kick-off. | `project_charter.md`, `scope_statement.md`, `raci.md`, `meeting-01-kickoff.md` | — | 5 | Hoàng (PM) | Hoàng (PM) |
| **1.2** | Lập Kế hoạch Tiến độ, Chi phí & Rủi ro | Phân rã WBS, vẽ sơ đồ PERT/CPM, Gantt Baseline, tính COCOMO và lập Risk Register 10 rủi ro. | `WBS_EVManager_Format_v2.xlsx`, `gantt-overview.md`, `cocomo-estimation.md`, `risk-register.md` | 1.1 | 6 | Hoàng (PM) | Hoàng (PM) |
| **1.3** | Kiểm soát Tiến độ EVM, Thay đổi & Mua sắm | Tính EVM Day 20, lập Fast-tracking Plan, xử lý CR-01, lập kế hoạch Mua sắm & Đánh giá Vendor. | `EVM_Analysis_Day20.xlsx`, `evm-variance-report.md`, `change-request-CR01.md`, `procurement-plan.md` | 1.2 | 6 | Hoàng (PM) | Hoàng (PM) |
| **2.1** | Khảo sát Nghiệp vụ & Đặc tả SRS v1.0 | Khảo sát nhà hàng tiệc cưới, lập Stakeholder Register, SOW, 3 sơ đồ BPMN và tài liệu SRS v1.0. | `business-survey-report.md`, `stakeholder-register.md`, 3 file BPMN, `SRS_EVManager_v1.0.md` | 1.1 | 8 | Hiển (BA) | Hiển (BA) |
| **2.2** | Đặc tả 14 Use Cases, Backlog & RTM | Viết chi tiết `UC-01` $\rightarrow$ `UC-14`, phân loại Product Backlog MoSCoW (29 US) và ma trận RTM. | `docs/requirements/use-cases/UC01..14.md`, `product-backlog.md`, `Requirement_Traceability_Matrix.md` | 2.1 | 8 | Hiển (BA) | Hiển (BA) |
| **2.3** | Thiết kế CSDL 3NF & Từ điển dữ liệu | Phân tích thực thể, chuẩn hóa 1NF $\rightarrow$ 3NF (13+ bảng), vẽ Conceptual/Logical ERD và Data Dictionary. | `erd-logical-3nf.png`, `erd-logical.dbml`, `data-normalization.md`, `data-dictionary.md` | 2.1 | 6 | Hậu (DB/QA) | Hậu (DB/QA) |
| **2.4** | Thiết kế UI/UX Wireframe & Prototype | Xây dựng User Flow cho 4 vai trò, thiết kế Moodboard, Design System và Prototype Figma các màn hình. | `docs/design/img/`, bộ thiết kế giao diện Figma | 2.1 | 7 | Nhân (UI/UX) | Nhân (UI/UX) |
| **3.1** | Khởi tạo Kiến trúc Backend & Database | Dựng khung Spring Boot 3 (Java 21), Docker PostgreSQL, Flyway Migrations `V1`–`V15`, Global Exception & Validation. | `backend/`, `V1`..`V15__*.sql`, `GlobalExceptionHandler.java` | 2.3 | 7 | Phúc (BE) & Hậu (DB) | Phúc (BE) |
| **3.2** | Phân hệ Xác thực JWT, RBAC & Khách hàng | Phát triển API Login/Register, bộ lọc JWT, phân quyền 4 roles (`ADMIN, SALES, COORDINATOR, CUSTOMER`), CRUD Users & Customers. | `auth/`, `users/`, `customers/`, `login.html`, `register.html`, `authGuard.js` | 3.1, 2.4 | 8 | Phúc (BE) & Nhân (FE) | Phúc (BE) |
| **3.3** | Phân hệ Sảnh tiệc, Sự kiện & Chống trùng lịch | Phát triển CRUD Sảnh tiệc, tra cứu sảnh trống theo ngày/ca, thuật toán Conflict Checker + khóa `PESSIMISTIC_WRITE`. | `venues/`, `events/`, `schedule.html`, `EventConcurrencyIntegrationTest.java` | 3.1, 2.2 | 9 | Phúc (BE), Nhân (FE), Hậu (QA) | Phúc (BE) |
| **3.4** | Phân hệ Thực đơn, Dịch vụ & Tính giá tự động | Phát triển API Dishes, Menus, Services và công cụ tính tổng tiền + chiết khấu % + Voucher + phí 5% + VAT 8%. | `dishes/`, `menus/`, `services/`, `calculator.js` | 3.2 | 8 | Phúc (BE) & Nhân (FE) | Phúc (BE) |
| **3.5** | Phân hệ Hợp đồng Wizard 3 bước & Đặt cọc | Phát triển Contract State Machine, lưu Price Snapshot, Wizard tạo hợp đồng 3 bước và ghi nhận đặt cọc $\ge 30\%$. | `contracts/`, `contracts.js`, `admin.html`, `sales.html`, `coordinator.html`, `customer.html` | 3.3, 3.4 | 10 | Phúc (BE), Nhân (FE), Hoàng (PM) | Hoàng (PM) |
| **3.6** | Phân hệ Dashboard KPI & Báo cáo | Phát triển API `/api/v1/dashboard/summary`, hiển thị 4 thẻ KPI, doanh thu theo tháng và danh sách sự kiện gần nhất. | `dashboard/`, `dashboard.js` | 3.5 | 5 | Phúc (BE) & Nhân (FE) | Nhân (FE) |
| **4.1** | Lập Kế hoạch Kiểm thử & Bộ 35+ Test Cases | Soạn Master Test Plan, thiết kế $>35$ kịch bản kiểm thử hệ thống, bộ Postman Collection và kịch bản tính giá/trùng lịch. | `test-plan.md`, `test-cases.md`, `test-suite-conflict-checker.md`, `test-suite-pricing-calc.md` | 2.2 | 6 | Hậu (QA) | Hậu (QA) |
| **4.2** | Thực thi Kiểm thử, Fix Bug & Phân tích Pareto | Chạy Unit/Integration/Regression/Performance Test k6, ghi nhận & đóng `BUG-01`..`BUG-08`, lập biểu đồ Pareto 80/20. | `regression-test-report.md`, `performance-test-report.md`, `pareto-quality-analysis.md`, `pareto-chart.png` | 3.5, 4.1 | 8 | Hậu (QA) & Hoàng (PM) | Hậu (QA) |
| **5.1** | Kiểm thử Chấp nhận Người dùng (UAT) | Xây dựng 15 kịch bản UAT, tổ chức phiên chạy thử với đại diện khách hàng và ký biên bản nghiệm thu UAT (15/15 Pass). | `uat-plan.md`, `uat-scenarios-master.md`, `uat-execution-results.md`, `uat-session-report.md` | 4.2 | 5 | Hiển (BA), Hậu (QA), Hoàng (PM) | Hoàng (PM) |
| **5.2** | Báo cáo Tổng kết, Lessons Learned & Đóng dự án | Biên soạn báo cáo tổng kết 10 chương PMBOK, họp Post-Mortem, đánh giá Peer Review và phát hành Release `v1.0.0`. | `BaoCao_TongKet_DoAn_MAN104_EVManager.pdf`, `lessons-learned.md`, `project-closure-signoff.md` | 5.1 | 5 | Hoàng (PM) & Cả nhóm | Hoàng (PM) |

---

## 3. Phiếu Đặc tả Chi tiết 3 Gói Công việc Lõi (Core Work Package Specifications)

### 3.1. Gói công việc 3.3: Phân hệ Kiểm tra Trùng lịch & Giữ chỗ Sảnh tiệc
- **Mã WBS:** `3.3` (Liên kết `UC-04`, `UC-05`, Issues `#48, #49, #109, #110, #111, #145, #150`).
- **Đầu vào (Inputs):** Danh sách sảnh tiệc (`venues`), khung ngày và ca tổ chức sự kiện (`event_date`, `shift_type`).
- **Quy tắc xử lý kỹ thuật:**
  - Kiểm tra không cho phép hai sự kiện có trạng thái hiệu lực (`HOLD`, `SCHEDULED`, `PREPARING`) đặt cùng `venue_id` trong cùng ngày và ca tiệc (hoặc giao nhau với ca `ALL_DAY`).
  - Sử dụng `@Lock(LockModeType.PESSIMISTIC_WRITE)` trên bản ghi sảnh tiệc trong quá trình kiểm tra và tạo sự kiện nhằm chống tuyệt đối lỗi Race Condition.
- **Tiêu chí chấp nhận (Acceptance Criteria):** Chặn 100% yêu cầu đặt trùng lịch với mã lỗi `409 Conflict`; vượt qua bài test đồng thời 10 luồng (`EventConcurrencyIntegrationTest`).

### 3.2. Gói công việc 3.5: Phân hệ Hợp đồng Wizard 3 bước & Snapshot Giá
- **Mã WBS:** `3.5` (Liên kết `UC-08`, `UC-09`, `UC-10`, Issues `#52, #55, #86, #87, #115, #116, #215`).
- **Đầu vào (Inputs):** Hồ sơ khách hàng (`customer_id`), sự kiện (`event_id`), danh sách thực đơn (`menus`) và gói dịch vụ (`services`).
- **Quy tắc xử lý kỹ thuật:**
  - Tính tổng tiền theo công thức chuẩn: $\text{Tổng tiền} = [(\sum \text{Đơn giá Menu} \times \text{Số bàn}) + \sum \text{Dịch vụ} - \text{Chiết khấu}] + \text{Phí phục vụ } 5\% + \text{VAT } 8\%$.
  - Lưu cứng đơn giá tại thời điểm tạo hợp đồng vào bảng `contract_menus` và `contract_services`.
  - Ràng buộc tiền đặt cọc tối thiểu $\ge 30\%$ tổng giá trị hợp đồng.
- **Tiêu chí chấp nhận (Acceptance Criteria):** Tạo hợp đồng thành công qua Wizard 3 bước trên giao diện Quản trị/Sales; chuyển đổi trạng thái hợp đồng đúng State Machine (`DRAFT` $\rightarrow$ `CONFIRMED` $\rightarrow$ `COMPLETED`).
