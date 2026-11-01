# Bảng Kiểm Tra Chất Lượng Phần Mềm (Quality Checklist)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Mã công việc** | PM-24 (Issue #30) & QA Verification |
| **Người lập** | Phạm Lê Huy Hoàng (PM) & Bùi Nguyễn Chí Hậu (QA Lead) |
| **Ngày kiểm tra** | 13/10/2026 |
| **Kết luận chung** | **ĐẠT TIÊU CHUẨN CHẤP NHẬN (PASSED — 100% HẠNG MỤC CỐT LÕI)** |

---

## 1. Bảng Kiểm tra 9 Tiêu chuẩn Chất lượng Hệ thống (System Quality Checklist)

| STT | Hạng mục kiểm tra | Tiêu chuẩn chấp nhận (Acceptance Standard) | Kết quả đo thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Tốc độ tải trang & Phản hồi API** | Trang tải $< 3\text{s}$; API phản hồi trung bình $< 500\text{ms}$ ở 50 CCU | Trang tải $< 1\text{s}$; API Avg `33.24ms`, p95 `142.50ms` (`QA-22 #153`) | **☑ ĐẠT** |
| **2** | **Hiển thị Font chữ & Giao diện tiếng Việt** | Không lỗi bảng mã UTF-8, font chữ rõ ràng, bố cục đồng nhất trên Desktop/Tablet | 100% màn hình hiển thị chuẩn tiếng Việt, đơn vị tiền tệ VNĐ rõ ràng | **☑ ĐẠT** |
| **3** | **Độ ổn định (Zero Crash / Exception Handling)** | Không treo/sập ứng dụng khi nhập dữ liệu sai hoặc gọi API lỗi | Có `GlobalExceptionHandler` trả mã lỗi chuẩn 400/401/403/404/409 | **☑ ĐẠT** |
| **4** | **Bảo mật Xác thực & Phân quyền RBAC (4 Roles)** | Phân quyền đúng 4 vai trò: `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER` | Chặn truy cập trái phép chính xác ở cả Server (`@PreAuthorize`) và Client | **☑ ĐẠT** |
| **5** | **Thuật toán Kiểm tra Trùng lịch Sảnh (Conflict Checker)** | Chặn 100% trường hợp đặt trùng sảnh cùng ngày & cùng ca tiệc (kể cả bấm cùng giây) | Đã áp dụng khóa `PESSIMISTIC_WRITE` (`BUG-04 #150`), vượt qua Concurrency Test | **☑ ĐẠT** |
| **6** | **Độ chính xác Công thức Tính giá & Đặt cọc** | Tính đúng Tổng thực đơn + Dịch vụ, Chiết khấu %, Voucher, Phí 5%, VAT 8%, Cọc $\ge 30\%$ | Khớp 100% giữa Frontend và Backend (`BUG-03 #204` đã đóng) | **☑ ĐẠT** |
| **7** | **Toàn vẹn Giao dịch & Cơ sở dữ liệu (3NF + Flyway)** | Tạo Hợp đồng & Đặt cọc đảm bảo tính nguyên tử (`@Transactional`); 15 bản migration chạy sạch | Flyway `V1` $\rightarrow$ `V15` khởi chạy tự động không lỗi; lưu Price Snapshot chuẩn | **☑ ĐẠT** |
| **8** | **Kiểm tra Đầu vào (Input Validation)** | Validate SĐT Việt Nam 10 số, Email chuẩn RFC, sức chứa bàn không vượt tối đa của sảnh | Đã kiểm tra Jakarta Bean Validation (BE) và Regex Validation (FE — `BUG-07 #207`) | **☑ ĐẠT** |
| **9** | **An toàn Bảo mật Mã nguồn & Vận hành** | Không lộ mật khẩu/token trong repo; có kịch bản Seed Data và hướng dẫn chạy đầy đủ | Đã rà soát toàn bộ diff, cấu hình biến môi trường và tài liệu `README.md` | **☑ ĐẠT** |

---

## 2. Bảng Kiểm tra Định nghĩa Hoàn thành (Definition of Done — DoD) cho 14 Use Cases

| Mã UC | Tên Use Case | Đặc tả BA | UI/UX | API Backend | DB Migration | Test Pass | Trạng thái DoD |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **UC-01** | Đăng nhập hệ thống & Phân quyền (RBAC) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-02** | Quản lý tài khoản người dùng (Users) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-03** | Quản lý hồ sơ khách hàng (Customers) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-04** | Tra cứu sảnh tiệc & Kiểm tra trùng lịch | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-05** | Đặt giữ chỗ sảnh & Khung giờ sự kiện | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-06** | Chọn danh mục món ăn & Thực đơn (Menus) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-07** | Chọn gói dịch vụ sự kiện đi kèm (Services) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-08** | Tự động tính toán chi phí & Báo giá | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-09** | Khởi tạo & Quản lý vòng đời Hợp đồng | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-10** | Ghi nhận thanh toán tiền đặt cọc đợt 1 (30%) | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-11** | Điều phối sự kiện & Chuẩn bị sảnh tiệc | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-12** | Nghiệm thu sự kiện & Quyết toán đợt 2 | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-13** | Xem Dashboard thống kê KPI & Doanh thu | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |
| **UC-14** | Xuất báo cáo thống kê sự kiện & Hợp đồng | ☑ | ☑ | ☑ | ☑ | ☑ | **HOÀN TẤT** |

---

## 3. Xác nhận của Quản lý Dự án & Trưởng nhóm Kiểm thử

- **Project Manager (PM):** Phạm Lê Huy Hoàng — *Đã kiểm tra và xác nhận đạt chuẩn (13/10/2026)*
- **QA / Test Lead:** Bùi Nguyễn Chí Hậu — *Đã thực thi kiểm thử và xác nhận đạt chuẩn (13/10/2026)*
