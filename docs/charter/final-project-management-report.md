# BÁO CÁO TỔNG KẾT QUẢN LÝ DỰ ÁN CNTT (FINAL PROJECT MANAGEMENT REPORT)
## Đề tài LV34-001: EVManager — Hệ Thống Quản Lý Trung Tâm Hội Nghị & Tiệc Cưới

| Thông tin chung | Chi tiết |
| :--- | :--- |
| **Mã đề tài / Dự án** | LV34-001 — EVManager |
| **Học phần** | Quản lý Dự án Công nghệ Thông tin (MAN104) |
| **Mã công việc WBS** | PM-28 (Issue #34 — Lập Báo cáo tổng kết dự án hoàn chỉnh 10 chương chuẩn PMBOK) |
| **Giảng viên hướng dẫn** | Giảng viên bộ môn Quản lý Dự án CNTT |
| **Trưởng nhóm (Project Manager)** | **Phạm Lê Huy Hoàng** (MSSV: `2380600738` — GitHub: `plhhoang2005`) |
| **Thành viên thực hiện** | 1. **Phạm Lê Huy Hoàng** — Project Manager (PM / Scrum Master / Integration)<br>2. **Từ Minh Hiển** — Business Analyst (BA / Product Owner)<br>3. **Võ Thành Nhân** — UI/UX Designer & Frontend Developer<br>4. **Ngô Hữu Phúc** — Backend Developer & DevOps Lead<br>5. **Bùi Nguyễn Chí Hậu** — Database Architect & QA/Test Lead |
| **Thời gian thực hiện** | 08 tuần (07/09/2026 – 01/11/2026) |
| **Phiên bản bàn giao** | `v1.0.0` (13/10/2026) |

---

## CHƯƠNG 1: TỔNG QUAN & QUẢN LÝ TÍCH HỢP DỰ ÁN (PROJECT INTEGRATION MANAGEMENT)

### 1.1. Bối cảnh & Bài toán Nghiệp vụ (Problem Statement)
Các trung tâm hội nghị và tiệc cưới hiện nay thường gặp 4 vấn đề lớn khi quản lý bằng bảng tính Excel rời rạc: (1) Đặt trùng lịch sảnh tiệc vào mùa cao điểm dẫn đến đền cọc; (2) Tính toán sai lệch báo giá khi áp dụng đồng thời nhiều Set Menu, gói dịch vụ, chiết khấu %, mã ưu đãi Voucher, phí phục vụ 5% và thuế VAT 8%; (3) Khó kiểm soát trạng thái hợp đồng và các đợt thu tiền đặt cọc (30%) / quyết toán (70%); (4) Thiếu bảng điều khiển (Dashboard KPI) theo dõi doanh thu và công suất lấp đầy sảnh theo thời gian thực.

### 1.2. Mục tiêu SMART của Dự án
Dự án **EVManager** được khởi tạo theo Tôn chỉ dự án ([`docs/charter/project_charter.md`](project_charter.md)) với 5 mục tiêu SMART cốt lõi hoàn thành trong 8 tuần:
1. Hiện thực hóa đầy đủ **14 Use Cases** và **29 User Stories** thuộc 3 quy trình nghiệp vụ lõi (Tư vấn & Giữ sảnh; Báo giá & Hợp đồng; Điều phối & Quyết toán).
2. Triển khai cơ chế xác thực JWT và phân quyền chặt chẽ cho **4 vai trò (RBAC)**: `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`.
3. Thiết kế cơ sở dữ liệu PostgreSQL đạt chuẩn **3NF (13+ bảng)**, quản lý phiên bản tự động qua **15 bản Flyway Migrations (`V1` $\rightarrow$ `V15`)**.
4. Đảm bảo chất lượng qua **35+ System Test Cases**, kiểm thử đồng thời (Concurrency Test), kiểm thử hiệu năng ($< 3\text{s}$) và đạt **100% (15/15) kịch bản UAT**.
5. Hoàn thiện trọn bộ hồ sơ Quản lý dự án theo 10 lĩnh vực kiến thức chuẩn **PMBOK**.

### 1.3. Quy trình Kiểm soát Thay đổi Tích hợp (Integrated Change Control)
Trong vòng đời dự án, Ban Kiểm soát Thay đổi (CCB) do PM đứng đầu đã tiếp nhận, phân tích tác động và phê duyệt 2 yêu cầu thay đổi chính thức:
- **CR-01 ([`docs/planning/change-request-CR01.md`](../planning/change-request-CR01.md)):** Chuẩn hóa 4 role RBAC theo BA, nâng cấp trình tạo Hợp đồng Wizard 3 bước có lưu cứng đơn giá (`Price Snapshot`) và ràng buộc cọc tối thiểu 30%.
- **CR-02 ([`docs/requirements/change-request-CR02-vouchers.md`](../requirements/change-request-CR02-vouchers.md)):** Bổ sung chính sách ưu đãi mùa cưới (Voucher Code) và chuẩn hóa thứ tự tính chiết khấu.

---

## CHƯƠNG 2: QUẢN LÝ PHẠM VI DỰ ÁN (PROJECT SCOPE MANAGEMENT)

### 2.1. Phát biểu Phạm vi (Scope Statement)
Phạm vi trong dự án (In-scope) và ngoài dự án (Out-of-scope) được định nghĩa chặt chẽ tại [`docs/charter/scope_statement.md`](scope_statement.md) và [`docs/requirements/SRS_EVManager_v1.0.md`](../requirements/SRS_EVManager_v1.0.md).

### 2.2. Cấu trúc Phân rã Công việc (WBS) & Từ điển WBS
Dự án được phân rã thành **5 giai đoạn chính**, **16 gói công việc WBS Level 3** ([`docs/planning/wbs-dictionary.md`](../planning/wbs-dictionary.md)) và **161 gói tác vụ chi tiết trên GitHub Issues**:
- **1.0 Quản lý dự án (PM):** 33 issues (`#1`, `#2`, `#7`–`#36`, `#215`).
- **2.0 Phân tích nghiệp vụ (BA):** 30 issues (`#3`, `#37`–`#65`).
- **3.0 Thiết kế UI/UX & Frontend (FE):** 34 issues (`#4`, `#66`–`#97`, `#205`, `#207`).
- **4.0 Phát triển Backend & DevOps (BE):** 37 issues (`#5`, `#98`–`#131`, `#206`, `#208`).
- **5.0 Cơ sở dữ liệu & Kiểm thử (DB/QA):** 27 issues (`#6`, `#132`–`#156`).

---

## CHƯƠNG 3: QUẢN LÝ THỜI GIAN & TIẾN ĐỘ DỰ ÁN (PROJECT SCHEDULE MANAGEMENT)

### 3.1. Sơ đồ Mạng PERT & Đường găng CPM (Critical Path Method)
Theo phân tích tại [`docs/planning/critical-path-analysis.md`](../planning/critical-path-analysis.md) và bảng tính [`docs/submission/QLDA_Nhom_LichDuAn.xlsx`](../submission/QLDA_Nhom_LichDuAn.xlsx):
- **Chuỗi công việc đường găng:** $\mathbf{A \ (7d) \rightarrow B \ (7d) \rightarrow D \ (6d) \rightarrow F \ (14d) \rightarrow G \ (10d) \rightarrow I \ (12d)}$.
- **Tổng thời gian đường găng:** **56 ngày lịch (8 tuần)**, dự trữ toàn phần trên đường găng $TF = 0$.

### 3.2. Giải pháp Điều chỉnh Tiến độ (Fast-Tracking)
Khi phát hiện độ trễ 1.5 ngày ở cuối Tuần 2 do mở rộng thiết kế CSDL lên 13 bảng 3NF, PM đã ban hành Kế hoạch bù tiến độ ([`docs/planning/fast-tracking-plan.md`](../planning/fast-tracking-plan.md)), cho phép Frontend và Backend lập trình song song dựa trên hợp đồng DTO cố định, giúp dự án cán đích đúng hạn tại cả mốc Giữa kỳ (Tuần 4) và Cuối kỳ (Tuần 8).

---

## CHƯƠNG 4: QUẢN LÝ CHI PHÍ & GIÁ TRỊ THU ĐƯỢC (PROJECT COST & EVM MANAGEMENT)

### 4.1. Ước tính Ngân sách theo Mô hình COCOMO Cơ bản
Theo [`docs/planning/cocomo-estimation.md`](../planning/cocomo-estimation.md):
- Quy mô mã nguồn ước tính: **6.9 KLOC** (Chế độ Organic: $a = 2.4, b = 1.05, c = 2.5, d = 0.38$).
- Tổng nỗ lực ước tính: $E = 2.4 \times (6.9)^{1.05} \approx \mathbf{18.23 \text{ người-tháng}}$.
- Ngân sách cơ sở được phê duyệt cho kế hoạch 8 tuần (**Baseline Budget — BAC**): **130,000,000 VNĐ** (tương đương 260 man-days $\times$ 500,000 VNĐ/ngày công, kèm quỹ dự phòng rủi ro 10% là 13,000,000 VNĐ).

### 4.2. Phân tích Giá trị Thu được tại Ngày thứ 20 (EVM Analysis at Day 20)
Theo [`docs/planning/evm-calculation-day20.md`](../planning/evm-calculation-day20.md) và [`docs/planning/evm-variance-report.md`](../planning/evm-variance-report.md):
- **Giá trị kế hoạch ($PV / BCWS$):** $58,500,000\text{ VNĐ}$ ($45.0\%$ BAC).
- **Giá trị thu được ($EV / BCWP$):** $55,250,000\text{ VNĐ}$ ($42.5\%$ BAC).
- **Chi phí thực tế ($AC / ACWP$):** $63,300,000\text{ VNĐ}$ ($48.7\%$ BAC).
- **Chênh lệch tiến độ ($SV = EV - PV$):** $-3,250,000\text{ VNĐ}$ $\Rightarrow \mathbf{SPI = 0.944}$.
- **Chênh lệch chi phí ($CV = EV - AC$):** $-8,050,000\text{ VNĐ}$ $\Rightarrow \mathbf{CPI = 0.873}$.
- **Kết quả kiểm soát nửa sau dự án:** Nhờ tái sử dụng kiến trúc DB 3NF và bộ UI Components, chỉ số hiệu suất hoàn thành ($TCPI$) của Tuần 4–8 vượt mục tiêu, đưa tổng chi phí khi hoàn thành ($EAC$) về mức **132,500,000 VNĐ** (nằm trọn trong phạm vi Quỹ dự phòng 10%).

---

## CHƯƠNG 5: QUẢN LÝ CHẤT LƯỢNG DỰ ÁN (PROJECT QUALITY MANAGEMENT)

### 5.1. Kế hoạch Đảm bảo Chất lượng & Bảng Kiểm tra Chất lượng
Được quy định chi tiết tại [`docs/planning/quality-assurance-plan.md`](../planning/quality-assurance-plan.md) và [`docs/testing/quality-checklist.md`](../testing/quality-checklist.md), bao gồm 9 tiêu chuẩn chất lượng hệ thống và 7 cổng kiểm soát cột mốc (Quality Gates).

### 5.2. Phân tích Khuyết tật bằng Biểu đồ Pareto 80/20
Theo [`docs/planning/pareto-quality-analysis.md`](../planning/pareto-quality-analysis.md):
- **80% tổng số lỗi phần mềm** tập trung ở 2 nhóm: **Xử lý ngày giờ/Trùng lịch sảnh (50%)** và **Tính toán chi phí/Chiết khấu hợp đồng (30%)**.
- Đội ngũ đã xử lý triệt để bằng khóa bi quan (`PESSIMISTIC_WRITE`) và chuẩn hóa công thức tính giá `BigDecimal`, đóng thành công **8/8 phiếu Defect (`BUG-01` $\rightarrow$ `BUG-08`)** và đạt **100% Pass** trong đợt kiểm thử hồi quy (`regression-test-report.md`).

### 5.3. Kết quả Kiểm thử Hiệu năng & Nghiệm thu UAT
- **Kiểm thử hiệu năng (`performance-test-report.md`):** Thời gian phản hồi trung bình đạt `33.24ms`, phân vị p95 đạt `142.50ms` ở mức tải 50 người dùng đồng thời (nhanh gấp 20 lần ngưỡng yêu cầu $< 3,000\text{ms}$), tỷ lệ lỗi `0.00%`.
- **Kiểm thử chấp nhận người dùng (`uat-execution-results.md` & `uat-session-report.md`):** Đạt **15/15 kịch bản ACCEPTED (100%)** với sự ký duyệt của đại diện khách hàng.

---

## CHƯƠNG 6: QUẢN LÝ NGUỒN NHÂN LỰC DỰ ÁN (PROJECT RESOURCE MANAGEMENT)

Ma trận phân công trách nhiệm **RACI** ([`docs/planning/raci.md`](../planning/raci.md)) đảm bảo mỗi gói công việc chỉ có duy nhất một người chịu trách nhiệm giải trình cuối cùng (**A — Accountable**):
- **Phạm Lê Huy Hoàng (PM):** Chịu trách nhiệm chính (A/R) về Quản lý dự án, Tích hợp GitFlow và Release.
- **Từ Minh Hiển (BA):** Chịu trách nhiệm chính (A/R) về Khảo sát yêu cầu, SRS v1.0, Use Cases, Backlog và UAT.
- **Võ Thành Nhân (UI/UX & FE):** Chịu trách nhiệm chính (A/R) về Prototype Figma và 4 cổng giao diện người dùng.
- **Ngô Hữu Phúc (BE & DevOps):** Chịu trách nhiệm chính (A/R) về Kiến trúc Spring Boot, REST API, Bảo mật JWT/RBAC và Triển khai Cloud.
- **Bùi Nguyễn Chí Hậu (DB & QA):** Chịu trách nhiệm chính (A/R) về Thiết kế CSDL 3NF, Flyway Migrations và Toàn bộ hoạt động Kiểm thử.

---

## CHƯƠNG 7: QUẢN LÝ TRUYỀN THÔNG DỰ ÁN (PROJECT COMMUNICATIONS MANAGEMENT)

Được thực thi theo [`docs/planning/communication-plan.md`](../planning/communication-plan.md), kết hợp đồng bộ giữa **GitHub Issues/PRs** (lưu vết kỹ thuật), **Jira Board** (theo dõi Sprint), **Google Meet / Họp trực tiếp** (lập biên bản định kỳ tại [`docs/meetings/`](../meetings/)) và **Zalo** (thông báo khẩn với SLA $< 60$ phút).

---

## CHƯƠNG 8: QUẢN LÝ RỦI RO DỰ ÁN (PROJECT RISK MANAGEMENT)

Được thiết lập tại [`docs/planning/risk-register.md`](../planning/risk-register.md) và [`docs/planning/risk-response-plan.md`](../planning/risk-response-plan.md):
- Nhận diện và chấm điểm $P \times I$ cho **10 rủi ro cốt lõi** (`RSK-01` $\rightarrow$ `RSK-10`).
- Áp dụng chiến lược **4T (Avoid, Mitigate, Transfer, Accept)** để kiểm soát toàn bộ 5 rủi ro vùng đỏ (`RSK-01` đến `RSK-05`), đảm bảo không có rủi ro nào làm gián đoạn mục tiêu bàn giao dự án.

---

## CHƯƠNG 9: QUẢN LÝ MUA SẮM DỰ ÁN (PROJECT PROCUREMENT MANAGEMENT)

Theo [`docs/planning/procurement-plan.md`](../planning/procurement-plan.md) và [`docs/planning/vendor-evaluation.md`](../planning/vendor-evaluation.md):
- Quyết định **Tự phát triển (Make)** toàn bộ phần mềm lõi EVManager và **Thuê ngoài (Buy/PaaS)** hạ tầng đám mây.
- Lựa chọn bộ nhà cung cấp đạt điểm trọng số cao nhất: **Vercel** (Frontend CDN — 9.70/10), **Render.com** (Backend Docker Cloud — 9.40/10), **Supabase PostgreSQL** (Managed DB — 9.63/10) và **Google SMTP / Resend** (Email — 9.85/10), giúp tiết kiệm **14,500,000 VNĐ (96.7%)** chi phí hạ tầng so với tự vận hành máy chủ vật lý.

---

## CHƯƠNG 10: QUẢN LÝ CÁC BÊN LIÊN QUAN & ĐÓNG DỰ ÁN (STAKEHOLDER MANAGEMENT & PROJECT CLOSURE)

- **Quản lý các bên liên quan ([`docs/requirements/stakeholder-register.md`](../requirements/stakeholder-register.md)):** Duy trì sự tham gia chặt chẽ của Giảng viên hướng dẫn, Chủ trung tâm tiệc cưới và 4 nhóm người dùng cuối qua các kỳ Demo Tuần 3, Tuần 4, Tuần 5 và phiên UAT Tuần 7.
- **Đúc kết bài học kinh nghiệm & Đóng dự án:** Toàn bộ bài học kinh nghiệm (Post-Mortem), bảng đánh giá chéo 5 thành viên (Peer Review đạt 100% đồng thuận) và thủ tục bàn giao đóng dự án được ký xác nhận chính thức tại [`docs/planning/lessons-learned.md`](../planning/lessons-learned.md) và [`docs/planning/project-closure-signoff.md`](../planning/project-closure-signoff.md).
