# Kế Hoạch Đảm Bảo Chất Lượng Dự Án (Quality Assurance Plan)
## Tiêu chuẩn Chấp nhận & Nghiệm thu theo 7 Cột mốc Milestone

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-24 (Issue #30 — Chương 5 Quản lý chất lượng dự án theo PMBOK) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) phối hợp cùng Bùi Nguyễn Chí Hậu (QA Lead) |
| **Ngày lập** | 03/10/2026 (Cập nhật nghiệm thu: 13/10/2026 — Tuần 6) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Mục tiêu Quản lý Chất lượng (Quality Objectives)

Kế hoạch Đảm bảo Chất lượng (QA Plan) của dự án **EVManager** được thiết lập theo chuẩn PMBOK (Chương 5 — Project Quality Management) nhằm đảm bảo cả **Chất lượng sản phẩm phần mềm (Product Quality)** lẫn **Chất lượng quy trình quản trị dự án (Process Quality)** đạt mức **Khá – Giỏi** của học phần MAN104:
1. **Độ phủ yêu cầu nghiệp vụ:** 100% chức năng nhóm **Must-have** (23/23 User Stories trong Product Backlog và 14 Use Cases trong SRS v1.0) được hiện thực hóa, kiểm thử và nghiệm thu.
2. **Độ tin cậy & Chính xác dữ liệu:** Tuyệt đối không xảy ra lỗi đặt trùng sảnh cùng ca tiệc (Conflict Detection = 100% chính xác) và không sai lệch số tiền hợp đồng/đặt cọc.
3. **Chất lượng kiểm thử:** Tối thiểu $\ge 35$ Test Cases hệ thống (thực tế đạt >50 kịch bản tính cả Unit Test, Integration Test, Concurrency Test và 15 kịch bản UAT), tỷ lệ Pass đạt $100\%$ đối với luồng Critical và không còn lỗi mức Critical/High (Sev1/Sev2) khi phát hành.

---

## 2. Chín (09) Tiêu chuẩn Chất lượng Chung của Hệ thống (General Quality Standards)

Mọi phân hệ của EVManager trước khi được hợp nhất (merge) vào nhánh `develop` và `main` bắt buộc phải thỏa mãn 9 tiêu chuẩn chất lượng cốt lõi sau:

| Mã TC | Tên tiêu chuẩn | Chỉ số đo lường mục tiêu (Target Metric) | Phương pháp kiểm chứng | Kết quả thực tế (Tuần 6) |
| :---: | :--- | :--- | :--- | :---: |
| **QS-01** | **Hiệu năng phản hồi (Response Time)** | Thời gian tải trang $< 3\text{s}$; API đọc p95 $< 500\text{ms}$ ở mức tải 50 người dùng ảo đồng thời. | Kiểm thử tải bằng kịch bản k6 (`docs/testing/performance-test-report.md`). | **ĐẠT** *(Avg 33ms, p95 142ms, 0% lỗi)* |
| **QS-02** | **Tính nhất quán Giao diện & Typography** | Sử dụng bộ font tiếng Việt chuẩn (Inter / Playfair Display), độ tương phản đạt chuẩn, không lỗi font/vỡ khung ở màn hình Desktop & Tablet. | Review UI theo Design System và kiểm thử UAT. | **ĐẠT** |
| **QS-03** | **Độ ổn định vận hành (Zero Crash)** | Không phát sinh lỗi sập ứng dụng (Unhandled Exception / 500 Crash); mọi lỗi nghiệp vụ đều trả về JSON chuẩn qua `GlobalExceptionHandler`. | Unit Test + Integration Test + E2E Test. | **ĐẠT** |
| **QS-04** | **Bảo mật Xác thực & Phân quyền RBAC** | Mật khẩu băm BCrypt; xác thực JWT Stateless; kiểm soát chặt 4 vai trò (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`) tại cả Backend (`@PreAuthorize`) và Frontend (`authGuard.js`). | Kiểm thử bảo mật âm tính (`test-run-auth.md`, UAT-02). | **ĐẠT** |
| **QS-05** | **Toàn vẹn Giao dịch & Chống trùng lịch** | Áp dụng `@Transactional` và khóa bi quan (`PESSIMISTIC_WRITE`) ngăn chặn 100% xung đột giữ sảnh đồng thời (Race Condition) và sai lệch tiền cọc. | `EventConcurrencyIntegrationTest` & `ContractServiceTest`. | **ĐẠT** |
| **QS-06** | **Toàn vẹn Cơ sở dữ liệu (Database Integrity)** | Thiết kế chuẩn hóa 3NF; quản lý 100% thay đổi schema qua Flyway (`V1` $\rightarrow$ `V15`); có ràng buộc khóa ngoại và `CHECK` constraints. | Tự động kiểm tra khi khởi động Spring Boot + Flyway. | **ĐẠT** |
| **QS-07** | **Chất lượng Mã nguồn & Build (CI/CD)** | Biên dịch Java 21 LTS và Maven test thành công 100%; tuân thủ Conventional Commits trên GitHub Actions. | GitHub Actions Workflow (`CI` & `PR Lint`). | **ĐẠT** |
| **QS-08** | **An toàn Thông tin & Bí mật (Secret Safety)** | 0% mật khẩu thật, JWT secret hoặc thông tin cá nhân nhạy cảm bị hard-code hoặc commit lên Git. | Rà soát theo [`docs/agentflow/REVIEW_CHECKLIST.md`](../agentflow/REVIEW_CHECKLIST.md). | **ĐẠT** |
| **QS-09** | **Khả năng Sẵn sàng & Phục hồi (Availability)** | Hệ thống hoạt động 24/7 trên môi trường Staging hoặc khởi chạy tức thì qua Docker Compose kèm dữ liệu mẫu đầy đủ trong $< 3$ phút. | Diễn tập khởi tạo DB và chạy kịch bản Demo. | **ĐẠT** |

---

## 3. Tiêu chuẩn Đánh giá & Nghiệm thu cho 7 Cột mốc (Milestone Quality Gates)

| Cột mốc (Milestone) | Tuần | Hạn định | Tiêu chí đầu ra bắt buộc (Exit Criteria / Quality Gate) | Người duyệt | Trạng thái |
| :--- | :---: | :---: | :--- | :---: | :---: |
| **Gate 1: Khởi động & Chốt Phạm vi (Scope Approval)** | Tuần 1 | 13/09/2026 | Hoàn thành Project Charter (6 mục tiêu SMART), Scope Statement (In/Out-of-scope), RACI Matrix, Stakeholder Register, SOW và thiết lập GitHub Repo. | GVHD & PM | **ĐẠT (100%)** |
| **Gate 2: Kế hoạch Khả thi & Thiết kế (Plan & Design)** | Tuần 2 | 20/09/2026 | Chốt WBS cấp 4, sơ đồ PERT/CPM, Gantt Baseline, dự toán COCOMO, SRS v1.0, 3 sơ đồ BPMN, ERD chuẩn 3NF, Data Dictionary, Wireframe/Prototype và Master Test Plan. | PM, BA, QA | **ĐẠT (100%)** |
| **Gate 3: Xây dựng Lõi & Increment 1 (Core Build)** | Tuần 3 | 27/09/2026 | Hoàn thành Risk Register, Fast-tracking Plan, RTM Matrix, Flyway Migrations nền tảng, Backend Auth/JWT/RBAC/Users/Customers, Layout Frontend và $\ge 35$ Test Cases. | PM & QA | **ĐẠT (100%)** |
| **Gate 4: Demo Giữa kỳ 50% (Midterm Milestone)** | Tuần 4 | 04/10/2026 | Báo cáo chỉ số EVM Day 20, chạy mượt luồng Đăng nhập $\rightarrow$ Khách hàng $\rightarrow$ Tra cứu sảnh $\rightarrow$ Chống trùng lịch, có báo cáo kiểm thử sơ kết đợt 1 và tiếp nhận CR-01. | GVHD & Hội đồng | **ĐẠT (100%)** |
| **Gate 5: Nghiệp vụ Mở rộng & Mua sắm (70% Increment)** | Tuần 5 | 11/10/2026 | Hoàn thành phân hệ Món ăn, Thực đơn, Gói dịch vụ, Hợp đồng Wizard 3 bước, Đặt cọc 30%, Dashboard KPI và Kế hoạch mua sắm/Chọn nhà cung cấp Cloud. | PM, BE, FE | **ĐẠT (95%+)** |
| **Gate 6: Hoàn thiện Tính năng & Chất lượng (Feature Complete)** | Tuần 6 | 18/10/2026 | Đạt 100% tính năng Must-have, hoàn tất Regression Testing, Performance Testing ($<3\text{s}$), phân tích lỗi bằng biểu đồ Pareto 80/20 và đóng toàn bộ lỗi Critical/High. | PM & QA | **ĐANG CHỐT** |
| **Gate 7: Nghiệm thu UAT & Đóng Dự án (Ready for Defense)** | Tuần 7–8 | 25/10 – 01/11/2026 | Hoàn tất 15/15 kịch bản UAT với chữ ký khách hàng, hoàn chỉnh Báo cáo tổng kết 10 chương PMBOK, Lessons Learned, gắn tag Release `v1.0.0` và bàn giao toàn bộ hồ sơ. | GVHD & Cả nhóm | **SẴN SÀNG** |

---

## 4. Quy trình Kiểm soát Chất lượng trước khi Gộp Mã nguồn (Pre-Merge QA Workflow)

1. **Bước 1 — Tự kiểm tra bởi Developer (Self-Check):** Thành viên tạo nhánh `feature/<issue>-<name>` hoặc `fix/<issue>-<name>`, tự chạy build (`mvn test` cho Backend, kiểm tra Console không báo lỗi cho Frontend) và đối chiếu [`docs/agentflow/REVIEW_CHECKLIST.md`](../agentflow/REVIEW_CHECKLIST.md).
2. **Bước 2 — Kiểm tra Tự động qua CI (Automated Gate):** Khi mở Pull Request vào nhánh `develop`, GitHub Actions tự động kiểm tra tiêu đề Conventional Commits và chạy CI workflow.
3. **Bước 3 — Kiểm thử Độc lập bởi QA & Review Chéo (Independent QA & Peer Review):** QA chạy bộ Test Suite tương ứng (Postman / JUnit / Integration / E2E); nếu phát hiện lỗi sẽ tạo phiếu `BUG-XX` trên GitHub Issues và gắn nhãn `type: bug`.
4. **Bước 4 — Phê duyệt & Hợp nhất bởi PM (PM Sign-off & Merge):** PM (Hoàng) kiểm tra minh chứng test pass, thực hiện `Approve` trên Pull Request và merge vào `develop` (giữ nguyên nhánh làm minh chứng truy vết).
