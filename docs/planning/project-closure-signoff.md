# Biên Bản Bàn Giao Sản Phẩm, Đóng Dự Án và Lưu Trữ Hồ Sơ (Project Closure & Sign-off)

| Thông tin Hồ sơ | Chi tiết |
| :--- | :--- |
| **Tên dự án** | **EVManager — Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới** |
| **Mã dự án / Học phần** | LV34-001 — Học phần Quản lý Dự án CNTT (MAN104) |
| **Mã công việc** | PM-30 (Issue #36 — Biên bản bàn giao sản phẩm, đóng dự án và lưu trữ hồ sơ) |
| **Phiên bản phát hành** | **Release `v1.0.0`** (`https://github.com/plhhoang2005/EVManager/releases/tag/v1.0.0`) |
| **Người lập** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày đóng dự án** | 13/10/2026 (Hoàn tất hồ sơ đóng dự án Tuần 8) |

---

## 1. Xác nhận Hoàn thành Toàn bộ Phạm vi & Cột mốc Dự án (Deliverables Verification)

Ban Quản lý dự án đã tiến hành rà soát toàn diện kho lưu trữ mã nguồn và hồ sơ dự án trên GitHub (`https://github.com/plhhoang2005/EVManager`), xác nhận **100% gói công việc trong WBS** đã hoàn tất:

| Nhóm hồ sơ / Sản phẩm | Đường dẫn lưu trữ trong Repository | Tình trạng kiểm tra |
| :--- | :--- | :---: |
| **1. Hồ sơ Khởi tạo & Tôn chỉ Dự án (Initiation & Charter)** | [`docs/charter/project_charter.md`](../charter/project_charter.md), [`docs/charter/scope_statement.md`](../charter/scope_statement.md), `Project_Charter_EVManager.docx` | **☑ Hoàn tất (100%)** |
| **2. Hồ sơ Lập kế hoạch & Kiểm soát (Planning & EVM/Risk/Procurement)** | [`docs/planning/`](./) (`raci.md`, `gantt-overview.md`, `wbs-dictionary.md`, `critical-path-analysis.md`, `cocomo-estimation.md`, `risk-register.md`, `risk-response-plan.md`, `fast-tracking-plan.md`, `evm-calculation-day20.md`, `evm-variance-report.md`, `change-request-CR01.md`, `procurement-plan.md`, `vendor-evaluation.md`, `quality-assurance-plan.md`, `pareto-quality-analysis.md`, `uat-plan.md`, `lessons-learned.md`) | **☑ Hoàn tất (100%)** |
| **3. Hồ sơ Phân tích Nghiệp vụ (BA & SRS v1.0)** | [`docs/requirements/`](../requirements/) (`SRS_EVManager_v1.0.md`, `business-requirements.md`, `stakeholder-register.md`, `statement-of-work.md`, `actors-personas.md`, 3 sơ đồ BPMN, `product-backlog.md`, `Requirement_Traceability_Matrix.md`, `change-request-CR02-vouchers.md`, `uat-scenarios-master.md`, 14 Use Cases `UC01`–`UC14`) | **☑ Hoàn tất (100%)** |
| **4. Hồ sơ Thiết kế Hệ thống & Cơ sở dữ liệu (Design & 3NF ERD)** | [`docs/design/`](../design/) (`tech-stack.md`, `backend-architecture.md`, `initial-data-analysis.md`, `data-normalization.md`, `data-dictionary.md`, `erd-conceptual.png`, `erd-logical-3nf.png`, `erd-logical.dbml`) | **☑ Hoàn tất (100%)** |
| **5. Mã nguồn Backend & Database Migrations** | [`backend/`](../../backend/) (Java 21 LTS, Spring Boot 3, 15 bản Flyway Migrations `V1` $\rightarrow$ `V15`, đầy đủ Unit & Integration Tests) | **☑ Hoàn tất (100%)** |
| **6. Mã nguồn Frontend Đa vai trò** | [`frontend/`](../../frontend/) (`admin.html`, `sales.html`, `coordinator.html`, `customer.html`, `login.html`, `register.html`, `contracts.js`, `dashboard.js`, `calculator.js`) | **☑ Hoàn tất (100%)** |
| **7. Hồ sơ Kiểm thử, Hiệu năng & Nghiệm thu UAT** | [`docs/testing/`](../testing/) (`test-plan.md`, `test-cases.md`, `quality-checklist.md`, `regression-test-report.md`, `performance-test-report.md`, `pareto-defects-analysis.md`, `uat-execution-results.md`) | **☑ Hoàn tất (100%)** |
| **8. Biên bản Họp & Báo cáo Tổng hợp Nộp Giảng viên** | [`docs/meetings/`](../meetings/) & [`docs/submission/`](../submission/) (`QLDA_Nhom_Lab_BaoCaoTongHop.docx`, `QLDA_Nhom_LichDuAn.xlsx`, `QLDA_Nhom_Pareto.xlsx`, `BaoCao_TongKet_DoAn_MAN104_EVManager.pdf`) | **☑ Hoàn tất (100%)** |

---

## 2. Tổng kết Các Chỉ số Quản trị Dự án Cuối kỳ (Final Project Metrics)

- **Tổng thời gian dự án:** 8 tuần (07/09/2026 – 01/11/2026).
- **Tổng số GitHub Issues được quản lý:** **161 Issues** trên 8 Milestones (Tỷ lệ hoàn thành: **100%**).
- **Tổng số Pull Requests tích hợp:** **56 Pull Requests** (Giữ nguyên toàn bộ nhánh thành viên làm minh chứng đóng góp cá nhân).
- **Tổng số Lỗi phần mềm (Defects):** Phát hiện và khắc phục triệt để **8/8 phiếu Defect (`BUG-01` $\rightarrow$ `BUG-08`)**; **0 lỗi tồn đọng** sau UAT.
- **Kết quả Nghiệm thu UAT:** **15/15 kịch bản đạt `ACCEPTED` (100%)**.

---

## 3. Thủ tục Giải phóng Tài nguyên & Lưu trữ Hồ sơ (Archive & Release)

1. **Đóng băng và Phát hành Mã nguồn:** Nhánh `develop` và `main` đã được đồng bộ và gắn thẻ phiên bản chính thức **Release `v1.0.0`**.
2. **Bảo toàn Minh chứng Học thuật:** Toàn bộ lịch sử Commit, Nhánh (Branches), Pull Requests, Comments, Issues và Milestones trên GitHub cùng dữ liệu đồng bộ Jira (`docs/JIRA_Import_156_Issues.csv`) được khóa ở chế độ lưu trữ lâu dài (Read-only Archive) phục vụ công tác chấm điểm của Giảng viên và Hội đồng.
3. **Giải phóng Nhóm dự án:** Xác nhận hoàn tất mọi nghĩa vụ công việc của 5 thành viên theo ma trận RACI sau buổi Bảo vệ đồ án cuối kỳ.

---

## 4. Chữ ký Phê duyệt Đóng Dự án (Final Project Closure Sign-off)

| Vai trò | Họ và tên | Xác nhận | Ngày ký |
| :--- | :--- | :---: | :---: |
| **Project Manager (PM)** | **Phạm Lê Huy Hoàng** | **☑ Xác nhận đóng dự án & bàn giao** | 13/10/2026 |
| **Business Analyst Lead (BA)** | **Từ Minh Hiển** | **☑ Xác nhận hoàn tất hồ sơ BA/UAT** | 13/10/2026 |
| **UI/UX & Frontend Lead** | **Võ Thành Nhân** | **☑ Xác nhận bàn giao mã nguồn FE** | 13/10/2026 |
| **Backend & DevOps Lead** | **Ngô Hữu Phúc** | **☑ Xác nhận bàn giao mã nguồn BE & Cloud** | 13/10/2026 |
| **Database & QA Lead** | **Bùi Nguyễn Chí Hậu** | **☑ Xác nhận bàn giao DB & Hồ sơ QA** | 13/10/2026 |
| **Giảng viên Hướng dẫn** | ________________________ | **☐ Phê duyệt nghiệm thu đồ án** | ___/___/2026 |
