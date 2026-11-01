# Kế Hoạch Chuyển Giao và Nghiệm Thu Người Dùng (UAT Plan)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-26 (Issue #32 — Kế hoạch chuyển giao và Nghiệm thu người dùng UAT) |
| **Người lập** | Phạm Lê Huy Hoàng (Project Manager) phối hợp cùng Từ Minh Hiển (BA) & Bùi Nguyễn Chí Hậu (QA) |
| **Ngày ban hành** | 12/10/2026 (Tuần 7) |
| **Trạng thái** | Hoàn thành & Đã thực thi nghiệm thu |

---

## 1. Mục đích và Phạm vi Nghiệm thu (UAT Purpose & Scope)

### 1.1. Mục đích
Kế hoạch Nghiệm thu Người dùng (User Acceptance Testing Plan — UAT Plan) xác lập quy trình, môi trường, nhân sự, danh mục kịch bản nghiệp vụ và tiêu chí ký duyệt nhằm xác nhận hệ thống **EVManager** đáp ứng đầy đủ các yêu cầu trong **Tài liệu đặc tả yêu cầu phần mềm ([`docs/requirements/SRS_EVManager_v1.0.md`](../requirements/SRS_EVManager_v1.0.md))** và sẵn sàng bàn giao đưa vào vận hành thực tế.

### 1.2. Phạm vi Kiểm thử Nghiệm thu (In-Scope)
Kiểm tra toàn diện **14 Use Cases nghiệp vụ** thông qua **15 kịch bản UAT thực tế ([`docs/requirements/uat-scenarios-master.md`](../requirements/uat-scenarios-master.md))** trải dài trên 4 vai trò người dùng:
1. **Phân hệ Quản trị & Phân quyền (`UC-01`, `UC-02`):** Đăng nhập theo vai trò, kiểm tra chặn quyền RBAC (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`), đăng xuất an toàn.
2. **Phân hệ Khách hàng & Sảnh tiệc (`UC-03`, `UC-04`, `UC-05`):** Thêm mới khách hàng (validate SĐT 10 số, Email), tìm kiếm khách hàng, tra cứu danh mục 5 sảnh tiệc, kiểm tra sảnh trống theo ngày/ca và tự động chặn đặt trùng lịch sảnh.
3. **Phân hệ Thực đơn, Dịch vụ, Báo giá & Hợp đồng (`UC-06` $\rightarrow$ `UC-10`):** Trình tạo hợp đồng Wizard 3 bước, chọn thực đơn & dịch vụ đi kèm, tự động tính tổng tiền + VAT + đặt cọc 30%, phê duyệt hợp đồng và ghi nhận thanh toán tiền cọc.
4. **Phân hệ Điều phối, Quyết toán & Báo cáo Dashboard (`UC-11` $\rightarrow$ `UC-14`):** Xem lịch sự kiện tổng thể, điều phối chuẩn bị tiệc, quyết toán hợp đồng và xem Dashboard 4 chỉ số KPI doanh thu.

---

## 2. Tiêu chí Đầu vào và Đầu ra của Đợt UAT (Entry & Exit Criteria)

### 2.1. Tiêu chí Bắt đầu UAT (Entry Criteria)
- [x] 100% tính năng **Must-have** đã phát triển hoàn tất và hợp nhất vào nhánh `develop`.
- [x] Đợt kiểm thử tích hợp (`QA-18 #149`), kiểm thử hồi quy (`QA-20 #151`) và kiểm thử hiệu năng (`QA-22 #153` — thời gian tải $< 3\text{s}$) đã hoàn thành và đạt chuẩn.
- [x] Không còn bất kỳ lỗi mở nào ở mức Critical (Sev1) hoặc High (Sev2).
- [x] Môi trường Staging/UAT đã được nạp đầy đủ dữ liệu mẫu chuẩn xác (5 sảnh tiệc, 20 món ăn, 5 Set Menu, 10 gói dịch vụ, 4 tài khoản đại diện vai trò).

### 2.2. Tiêu chí Hoàn thành & Chấp nhận Nghiệm thu (Exit & Acceptance Criteria)
- [x] **100% kịch bản UAT (15/15 kịch bản)** được thực thi và đánh giá đạt yêu cầu (`ACCEPTED`).
- [x] **0 lỗi mức độ Nghiêm trọng (Sev1 - Blocker / Sev2 - Critical)** phát sinh trong phiên chạy thử.
- [x] Các ý kiến đóng góp cải tiến nhỏ (Cosmetic / Post-MVP Enhancements) được ghi nhận đầy đủ vào biên bản.
- [x] Biên bản nghiệm thu UAT và biểu mẫu bàn giao được ký xác nhận bởi Đại diện Khách hàng, PM, BA và QA Lead.

---

## 3. Thành phần Hội đồng Nghiệm thu (UAT Governance & Roles)

| Họ và tên | Đơn vị / Vai trò | Trách nhiệm trong đợt UAT |
| :--- | :--- | :--- |
| **Ông Trần Hùng Dũng** | Đại diện Chủ Trung tâm Tiệc cưới (Sponsor / Client) | Kiểm tra Dashboard KPI, quy trình duyệt hợp đồng và ký quyết định nghiệm thu tổng thể. |
| **Bà Lê Thị Mai Trang** | Đại diện Trưởng bộ phận Tư vấn (Sales Lead User) | Trực tiếp thao tác luồng Quản lý khách hàng, Tra cứu sảnh trống, Wizard Hợp đồng 3 bước và Đặt cọc. |
| **Ông Vũ Hoàng Nam** | Đại diện Chuyên viên Điều phối (Coordinator User) | Trực tiếp thao tác luồng Lịch sự kiện, Kiểm tra chống trùng lịch sảnh và Điều phối dịch vụ tiệc. |
| **Phạm Lê Huy Hoàng** | Project Manager (PM — Trưởng ban tổ chức UAT) | Điều hành chung phiên UAT, giám sát tiến độ và ký biên bản bàn giao dự án. |
| **Từ Minh Hiển** | Business Analyst Lead (BA) | Hướng dẫn người dùng thực hiện theo đúng 15 kịch bản nghiệp vụ và giải đáp quy tắc tính giá. |
| **Bùi Nguyễn Chí Hậu** | QA & Database Lead | Chuẩn bị dữ liệu môi trường UAT, ghi nhận kết quả từng bước và tổng hợp biên bản UAT. |
| **Ngô Hữu Phúc & Võ Thành Nhân** | Backend & Frontend Leads | Trực kỹ thuật trong suốt phiên UAT để theo dõi log hệ thống và hỗ trợ giao diện tức thì. |

---

## 4. Lịch trình Tổ chức Chuyển giao & Nghiệm thu (UAT & Handover Schedule)

| Giai đoạn | Thời gian | Nội dung công việc | Đầu ra (Deliverables) |
| :--- | :---: | :--- | :--- |
| **Bước 1: Chuẩn bị & Kiểm tra môi trường** | 12/10/2026 | Nạp dữ liệu mẫu UAT, kiểm tra tài khoản 4 vai trò và phát hành Sổ tay hướng dẫn sử dụng. | Môi trường UAT sẵn sàng + Bộ kịch bản [`docs/requirements/uat-scenarios-master.md`](../requirements/uat-scenarios-master.md). |
| **Bước 2: Đào tạo người dùng ngắn (Briefing)** | 13/10/2026 (08:30 – 09:30) | BA & Frontend hướng dẫn nhanh luồng thao tác trên 4 cổng giao diện (`admin`, `sales`, `coordinator`, `customer`). | Biên bản đào tạo người dùng. |
| **Bước 3: Thực thi 15 kịch bản UAT** | 13/10/2026 (09:30 – 11:30) | Đại diện khách hàng trực tiếp chạy thử 15 tình huống nghiệp vụ dưới sự giám sát của PM, BA và QA. | Bảng kết quả UAT [`docs/testing/uat-execution-results.md`](../testing/uat-execution-results.md). |
| **Bước 4: Tổng kết & Ký Biên bản Nghiệm thu** | 13/10/2026 (11:30 – 12:00) | Họp đánh giá kết quả, ghi nhận đề xuất mở rộng và ký Biên bản xác nhận UAT. | Biên bản phiên họp UAT [`docs/meetings/uat-session-report.md`](../meetings/uat-session-report.md) & Biểu mẫu nghiệm thu [`docs/planning/acceptance-form-template.md`](acceptance-form-template.md). |
