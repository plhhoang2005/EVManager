# BIỂU MẪU BIÊN BẢN NGHIỆM THU & BÀN GIAO KỸ THUẬT (ACCEPTANCE & HANDOVER FORM)

| Thông tin Hồ sơ | Chi tiết |
| :--- | :--- |
| **Tên dự án** | **EVManager — Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới** |
| **Mã dự án / Học phần** | LV34-001 — Học phần Quản lý Dự án CNTT (MAN104) |
| **Mã biểu mẫu** | `BM-PM26-UAT-ACCEPTANCE` (Thuộc gói công việc PM-26 — Issue #32) |
| **Ngày lập** | 13/10/2026 |

---

## PHẦN I: THÔNG TIN CÁC BÊN THAM GIA NGHIỆM THU

### 1. Bên Giao (Đội ngũ Phát triển Dự án EVManager — Nhóm 5)
- **Đại diện (Project Manager):** Phạm Lê Huy Hoàng — MSSV: 2380600738
- **Phân tích nghiệp vụ (BA Lead):** Từ Minh Hiển
- **Phát triển Giao diện (UI/UX & Frontend Lead):** Võ Thành Nhân
- **Phát triển Hệ thống (Backend & DevOps Lead):** Ngô Hữu Phúc
- **Cơ sở dữ liệu & Đảm bảo chất lượng (DB/QA Lead):** Bùi Nguyễn Chí Hậu

### 2. Bên Nhận (Đại diện Khách hàng / Hội đồng Đánh giá Nghiệm thu)
- **Đại diện Chủ đầu tư / Giảng viên đánh giá:** Ông Trần Hùng Dũng (Đại diện Trung tâm Tiệc cưới Riverside Palace)
- **Đại diện Bộ phận Kinh doanh (Sales):** Bà Lê Thị Mai Trang
- **Đại diện Bộ phận Điều phối (Coordinator):** Ông Vũ Hoàng Nam

---

## PHẦN II: DANH MỤC HẠNG MỤC BÀN GIAO & ĐỐI CHIẾU CHẤT LƯỢNG

| STT | Hạng mục bàn giao | Mô tả quy cách / Đường dẫn lưu trữ | Kết quả kiểm tra | Xác nhận |
| :---: | :--- | :--- | :---: | :---: |
| **1** | **Mã nguồn Ứng dụng Backend (REST API)** | Java 21 LTS + Spring Boot 3 + Spring Security JWT + JPA tại thư mục `backend/` | Biên dịch & chạy ổn định 100% | **☑ Đạt** |
| **2** | **Mã nguồn Giao diện Frontend (Web Portal)** | Giao diện 4 vai trò (`admin.html`, `sales.html`, `coordinator.html`, `customer.html`) tại `frontend/` | Hiển thị chuẩn, phản hồi $< 1\text{s}$ | **☑ Đạt** |
| **3** | **Cơ sở dữ liệu & Script Khởi tạo (Database)** | 13+ bảng chuẩn hóa 3NF, 15 bản Flyway Migration (`V1` $\rightarrow$ `V15`) và bộ dữ liệu mẫu | Toàn vẹn dữ liệu 100% | **☑ Đạt** |
| **4** | **Kết quả Kiểm thử Nghiệm thu (15 kịch bản UAT)** | Kiểm tra thực tế 14 Use Cases & 15 kịch bản UAT (`docs/testing/uat-execution-results.md`) | **15/15 kịch bản ACCEPTED (100%)** | **☑ Đạt** |
| **5** | **Bộ Hồ sơ Quản lý Dự án & Thiết kế Kỹ thuật** | Đầy đủ Charter, WBS, PERT/CPM, Gantt, COCOMO, EVM, Risk, SRS v1.0, BPMN, ERD, Test Report tại `docs/` | Đầy đủ 100% theo chuẩn PMBOK | **☑ Đạt** |
| **6** | **Công tác Đào tạo & Hướng dẫn Vận hành** | Đã tổ chức hướng dẫn sử dụng trực tiếp cho 4 nhóm vai trò người dùng cuối | Người dùng thao tác thành thạo | **☑ Đạt** |

---

## PHẦN III: GHI NHẬN LỖI TỒN ĐỌNG & CAM KẾT BẢO HÀNH

1. **Lỗi mức độ Nghiêm trọng / Chặn nghiệp vụ (Severity 1 - Blocker & Severity 2 - Critical):** **0 lỗi**.
2. **Lỗi mức độ Trung bình / Nhẹ (Severity 3 - Major & Severity 4 - Minor):** **0 lỗi tồn đọng**.
3. **Đề xuất mở rộng sau giai đoạn MVP (Post-MVP Wishlist):** Xuất hợp đồng PDF kèm logo riêng của từng chi nhánh, lọc lịch tháng theo từng sảnh đơn lẻ (đã đưa vào danh mục cải tiến Giai đoạn 2).

---

## PHẦN IV: KẾT LUẬN & CHỮ KÝ XÁC NHẬN NGHIỆM THU

Hai bên thống nhất xác nhận: Hệ thống phần mềm **EVManager v1.0** đã hoàn thành đầy đủ các mục tiêu phạm vi, chất lượng và hiệu năng theo đúng cam kết trong Tôn chỉ dự án (Project Charter) và Đặc tả yêu cầu (SRS v1.0). Bên Nhận đồng ý **NGHIỆM THU CHÍNH THỨC** sản phẩm.

| ĐẠI DIỆN BÊN NHẬN (KHÁCH HÀNG) | TRƯỞNG NHÓM PHÂN TÍCH (BA) | TRƯỞNG NHÓM KIỂM THỬ (QA) | ĐẠI DIỆN BÊN GIAO (PROJECT MANAGER) |
| :---: | :---: | :---: | :---: |
| *(Đã ký & đóng dấu)* | *(Đã ký)* | *(Đã ký)* | *(Đã ký)* |
| **Trần Hùng Dũng** | **Từ Minh Hiển** | **Bùi Nguyễn Chí Hậu** | **Phạm Lê Huy Hoàng** |
| Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 |
