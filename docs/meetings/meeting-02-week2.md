# Biên Bản Họp Tuần 2: Đánh Giá Phân Rã Công Việc WBS & Chốt Thiết Kế (Meeting Minutes #02)

| Thông tin Cuộc họp | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Mã công việc** | PM-13 (Issue #19 — Biên bản họp tuần 2: Đánh giá phân rã công việc và chốt WBS) |
| **Thời gian** | 20:00 – 21:30, Chủ Nhật ngày 20/09/2026 (Cuối Tuần 2) |
| **Hình thức** | Họp trực tuyến qua Google Meet (Kết hợp phiên làm việc offline Thứ Ba 15/09/2026) |
| **Chủ trì** | Phạm Lê Huy Hoàng (Project Manager) |
| **Thành phần tham dự** | Đầy đủ 5/5 thành viên: Hoàng (PM), Hiển (BA), Nhân (UI/UX), Phúc (Backend), Hậu (DB/QA) |

---

## 1. Nội dung Rà soát Tiến độ Tuần 2 (Gate 2 — Kế hoạch & Thiết kế)

PM Phạm Lê Huy Hoàng điểm danh và rà soát kết quả bàn giao của 5 vị trí trong Tuần 2 (14/09 – 20/09/2026):

1. **Quản lý dự án (Hoàng — PM):**
   - Đã hoàn thành phân rã WBS cấp 4 (`WBS_EVManager_Format_v2.xlsx`), Từ điển WBS (`wbs-dictionary.md`), sơ đồ mạng PERT & đường găng CPM (`critical-path-analysis.md`), lịch trình Gantt Baseline (`gantt-overview.md`) và ước lượng chi phí COCOMO (`cocomo-estimation.md`).
2. **Phân tích nghiệp vụ (Hiển — BA):**
   - Đã hoàn thành 3 sơ đồ quy trình nghiệp vụ BPMN (`bpmn-process-1..3`), Product Backlog 29 User Stories theo MoSCoW (`product-backlog.md`) và bộ đặc tả Use Case `UC-01` $\rightarrow$ `UC-05`.
3. **Cơ sở dữ liệu & QA (Hậu — DB/QA):**
   - Đã hoàn thành thiết kế ERD chuẩn hóa 3NF mở rộng từ 8 bảng lên **13 bảng chi tiết** (`erd-logical-3nf.png`), Từ điển dữ liệu (`data-dictionary.md`), Kế hoạch kiểm thử (`test-plan.md`) và danh mục 35+ Test Cases (`test-cases.md`).
4. **Thiết kế UI/UX (Nhân — Frontend):**
   - Đã hoàn thành Wireframe đăng nhập/quên mật khẩu và Prototype Figma cho các màn hình Dashboard, Danh mục sảnh, Lịch đặt tiệc và Quản lý khách hàng (`UI-03` $\rightarrow$ `UI-07`).
5. **Kiến trúc Backend (Phúc — Backend):**
   - Đã hoàn thành cấu hình Docker Compose PostgreSQL, khởi tạo khung dự án Spring Boot 3 (Java 21 LTS), Global Exception Handling và DTO Validation (`BE-03` $\rightarrow$ `BE-06`).

---

## 2. Vấn đề Phát sinh & Quyết định Điều chỉnh của PM

- **Vấn đề ghi nhận:** Do nhóm quyết định nâng cấp thiết kế cơ sở dữ liệu lên 13 bảng chuẩn 3NF để đáp ứng đầy đủ nghiệp vụ tính giá theo ca sảnh và đặt cọc nhiều đợt, khối lượng viết script migration và ghép nối API của Tuần 3 sẽ tăng khoảng 20% so với dự kiến ban đầu.
- **Quyết định của PM:**
  1. Chính thức **chốt Baseline WBS và Gantt Chart v1.0** để làm cơ sở đo lường chỉ số EVM tại Ngày thứ 20.
  2. Kích hoạt phương án **Fast-tracking (Làm song song)** trong Tuần 3: Yêu cầu Phúc (BE) và Nhân (FE) thống nhất ngay cấu trúc JSON DTO trong ngày Thứ Hai (21/09) để Nhân dựng giao diện song song khi Phúc viết API.
  3. Phân công Hiển (BA) phối hợp cùng Hậu (QA) chuẩn bị bộ dữ liệu mẫu (`mock-data-demo.json`) phục vụ kiểm thử và Demo giữa kỳ.

---

## 3. Kế hoạch Trọng tâm Tuần 3 (21/09 – 27/09/2026)

| Thành viên | Nhiệm vụ cam kết hoàn thành trong Tuần 3 | Hạn chót |
| :--- | :--- | :---: |
| **Hoàng (PM)** | Lập Bảng đăng ký rủi ro (`PM-14`), Kế hoạch ứng phó 4T (`PM-15`), Kế hoạch bù tiến độ Fast-tracking (`PM-16`). | 27/09/2026 |
| **Hiển (BA)** | Hoàn thiện `UC-06`, `UC-07`, `UC-08`, chốt tài liệu `SRS_EVManager_v1.0.md` và ma trận truy vết `RTM`. | 26/09/2026 |
| **Nhân (UI/UX)** | Thiết kế Prototype chọn thực đơn/hợp đồng (`UI-08`, `UI-09`), dựng khung giao diện Web & màn hình Đăng nhập/Dashboard. | 27/09/2026 |
| **Phúc (Backend)** | Phát triển module Auth JWT (`BE-07`), RBAC (`BE-08`), Users (`BE-09`), Customers (`BE-10`), Audit Log (`BE-11`). | 27/09/2026 |
| **Hậu (DB/QA)** | Viết Flyway Migrations + Seed Data (`QA-08`), chạy kiểm thử đợt 1 cho Auth & Customers (`QA-09`, `QA-10`). | 27/09/2026 |

---

## 4. Xác nhận Biên bản Họp

Biên bản được thông qua lúc 21:30 ngày 20/09/2026 với sự đồng thuận của 5/5 thành viên: **Phạm Lê Huy Hoàng (PM), Từ Minh Hiển (BA), Võ Thành Nhân (UI/UX), Ngô Hữu Phúc (BE), Bùi Nguyễn Chí Hậu (DB/QA)**.
