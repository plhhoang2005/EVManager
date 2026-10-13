# Phát Biểu Phạm Vi Dự Án (Project Scope Statement)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-03 (Issue #9 — Xác lập phạm vi phát biểu In-scope & Out-of-scope) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày lập** | 11/09/2026 (Tuần 1) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Mô tả Phạm vi Sản phẩm (Product Scope Description)

**EVManager** là nền tảng phần mềm quản lý tổng thể hoạt động kinh doanh và điều phối sự kiện dành cho các Trung tâm Hội nghị & Tiệc cưới, được phát triển theo kiến trúc Web hiện đại (**Backend Java 21 LTS + Spring Boot 3 + PostgreSQL 15** và **Frontend đa vai trò**). Hệ thống số hóa khép kín 3 quy trình nghiệp vụ cốt lõi:
1. **Quy trình 1 — Tiếp nhận yêu cầu, Tư vấn sảnh & Đặt giữ chỗ (Booking & Conflict Prevention):** Quản lý hồ sơ khách hàng, tra cứu sảnh trống theo ngày/ca và tự động ngăn chặn 100% xung đột đặt trùng sảnh tiệc.
2. **Quy trình 2 — Chọn Thực đơn, Dịch vụ, Lập báo giá & Ký Hợp đồng (Quotation & Contract Management):** Hỗ trợ chọn nhiều Set Menu và gói dịch vụ đi kèm, tự động tính tổng chi phí + chiết khấu + thuế VAT 8% + phí phục vụ 5%, khởi tạo hợp đồng qua Wizard 3 bước và ghi nhận tiền đặt cọc đợt 1 (tối thiểu 30%).
3. **Quy trình 3 — Điều phối Sự kiện, Nghiệm thu & Quyết toán (Event Coordination & Final Settlement):** Hỗ trợ điều phối chuẩn bị tiệc, ghi nhận phát sinh, thanh toán quyết toán đợt 2 và tổng hợp báo cáo doanh thu trên Dashboard KPI.

---

## 2. Danh mục Trong Phạm vi (In-Scope Deliverables)

| Mã phân hệ | Hạng mục chức năng trong phạm vi (In-Scope) | Vai trò sử dụng | Use Case liên kết |
| :---: | :--- | :---: | :---: |
| **MOD-01** | **Xác thực JWT & Phân quyền theo 4 vai trò (RBAC):** Đăng nhập, đăng ký, quản lý tài khoản và bảo vệ route cho `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`. | Tất cả 4 vai trò | `UC-01`, `UC-02` |
| **MOD-02** | **Quản lý Hồ sơ Khách hàng (CRM):** Thêm mới, cập nhật, tìm kiếm theo từ khóa có Debounce, kiểm tra hợp lệ SĐT 10 số Việt Nam và Email. | Admin, Sales | `UC-03` |
| **MOD-03** | **Quản lý Sảnh tiệc & Thuật toán Chống trùng lịch:** Quản lý 5+ sảnh tiệc, tra cứu sảnh trống theo Ngày + Ca (Sáng/Trưa/Tối/Cả ngày), khóa bi quan chống đặt trùng sảnh đồng thời. | Admin, Sales, Coord, Customer | `UC-04`, `UC-05` |
| **MOD-04** | **Quản lý Món ăn, Set Thực đơn & Gói Dịch vụ:** Quản lý danh mục món ăn, cấu hình các Set Menu tiệc cưới và dịch vụ đi kèm (Âm thanh, Ánh sáng, MC, LED, Hoa tươi). | Admin, Sales, Customer | `UC-06`, `UC-07` |
| **MOD-05** | **Công cụ Tính giá Tự động & Hợp đồng Wizard 3 bước:** Tự động tính giá tiệc, áp dụng chiết khấu % & Voucher, lưu cứng đơn giá (Price Snapshot) và quản lý vòng đời hợp đồng (`DRAFT`, `CONFIRMED`, `COMPLETED`, `CANCELLED`). | Admin, Sales | `UC-08`, `UC-09` |
| **MOD-06** | **Quản lý Đặt cọc (30%) & Quyết toán Hợp đồng:** Ghi nhận thanh toán đợt 1 (tối thiểu 30%), theo dõi công nợ và quyết toán đợt 2 sau sự kiện. | Admin, Sales, Coord | `UC-10`, `UC-12` |
| **MOD-07** | **Lịch biểu Sự kiện & Điều phối Tiệc:** Lịch tháng/tuần trực quan, phân công chuẩn bị sảnh và theo dõi trạng thái sự kiện (`SCHEDULED`, `PREPARING`, `COMPLETED`). | Coordinator, Admin | `UC-11` |
| **MOD-08** | **Dashboard Thống kê KPI & Xuất Báo cáo:** Hiển thị 4 thẻ KPI thời gian thực, biểu đồ doanh thu theo tháng và xuất dữ liệu báo cáo/hợp đồng. | Admin | `UC-13`, `UC-14` |

---

## 3. Danh mục Ngoài Phạm vi (Out-of-Scope Exclusions)

Để đảm bảo hoàn thành đúng tiến độ 8 tuần với chất lượng cao nhất, các hạng mục sau được xác định nằm **ngoài phạm vi (Out-of-Scope)** của phiên bản v1.0:
1. **Ứng dụng Di động Native (iOS / Android App):** Hệ thống tập trung vào giao diện Web Responsive trên Desktop và Tablet.
2. **Kết nối Cổng Thanh toán Ngân hàng Thật (Live Payment Gateway):** Việc thu tiền cọc và quyết toán được ghi nhận và mô phỏng nghiệp vụ kế toán trên hệ thống, không trừ tiền thẻ ngân hàng thật.
3. **Quản lý Kho nguyên vật liệu Bếp chi tiết (Inventory & Kitchen ERP):** Chỉ quản lý đến cấp độ Món ăn (`Dishes`) và Thực đơn (`Menus`), không quản lý định lượng từng nguyên liệu tươi sống.
4. **Hệ thống Chat / Video Call trực tuyến nội bộ:** Thông báo được thực hiện qua trạng thái hệ thống và Email.

---

## 4. Giả định và Ràng buộc Dự án (Assumptions & Constraints)

### 4.1. Các Giả định (Assumptions)
- Trung tâm tiệc cưới chia thời gian thuê sảnh theo các ca cố định trong ngày (Ca Trưa, Ca Tối hoặc Cả ngày).
- Mỗi sự kiện tiệc cưới gắn với một hợp đồng chính thức và yêu cầu mức đặt cọc tối thiểu $30\%$ tổng giá trị hợp đồng để xác nhận giữ sảnh chính thức.

### 4.2. Các Ràng buộc (Constraints)
- **Thời gian:** Cố định 8 tuần học kỳ (07/09/2026 – 01/11/2026).
- **Nhân sự:** 5 sinh viên đảm nhận 5 vai trò chuyên biệt (PM, BA, UI/UX, Backend, DB/QA).
- **Công nghệ bắt buộc:** Backend sử dụng Java 21 LTS + Spring Boot + Flyway + PostgreSQL theo đúng quy ước tại [`AGENTS.md`](../../AGENTS.md) và [`docs/agentflow/DECISION_LOG.md`](../agentflow/DECISION_LOG.md).
