# Biên Bản Giám Sát Phiên Chạy Thử Nghiệm UAT & Xác Nhận Lỗi Tồn Đọng

| Thông tin Cuộc họp | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Mã công việc** | PM-27 (Issue #33 — Giám sát đợt chạy thử nghiệm UAT và ký biên bản xác nhận lỗi tồn đọng) |
| **Thời gian** | 08:30 – 12:00, Ngày 13/10/2026 (Tuần 7) |
| **Địa điểm** | Phòng Hội thảo Dự án & Google Meet trực tuyến |
| **Chủ trì điều phối** | Phạm Lê Huy Hoàng (Project Manager) |
| **Thư ký ghi biên bản** | Từ Minh Hiển (BA Lead) & Bùi Nguyễn Chí Hậu (QA Lead) |

---

## 1. Thành phần Tham dự

- **Đại diện Khách hàng & Người dùng cuối (End-Users):**
  1. Ông Trần Hùng Dũng — Đại diện Chủ Trung tâm Tiệc cưới & Sự kiện Riverside Palace.
  2. Bà Lê Thị Mai Trang — Trưởng phòng Kinh doanh & Tư vấn tiệc (Sales Representative).
  3. Ông Vũ Hoàng Nam — Chuyên viên Điều phối sự kiện (Coordinator Representative).
- **Đội ngũ Dự án EVManager ( đủ 5/5 thành viên):**
  1. Phạm Lê Huy Hoàng — Project Manager (Chủ trì giám sát).
  2. Từ Minh Hiển — Business Analyst Lead (Dẫn dắt kịch bản nghiệp vụ).
  3. Võ Thành Nhân — UI/UX & Frontend Lead (Hỗ trợ giao diện trực tiếp).
  4. Ngô Hữu Phúc — Backend & DevOps Lead (Giám sát API & Database log).
  5. Bùi Nguyễn Chí Hậu — Database & QA Lead (Đối chiếu kết quả kiểm thử).

---

## 2. Nội dung Diễn biến Phiên Chạy Thử Nghiệm UAT (15 Tình huống Nghiệp vụ)

PM Phạm Lê Huy Hoàng tuyên bố khai mạc phiên nghiệm thu UAT theo đúng **Kế hoạch UAT ([`docs/planning/uat-plan.md`](../planning/uat-plan.md))** và **Bộ kịch bản UAT gốc ([`docs/requirements/uat-scenarios-master.md`](../requirements/uat-scenarios-master.md))**.

Tóm tắt kết quả giám sát thực tế trên 15 kịch bản (chi tiết từng bước được lưu tại [`docs/testing/uat-execution-results.md`](../testing/uat-execution-results.md)):

| Nhóm quy trình | Các mã kịch bản UAT | Người dùng thực thi | Thời gian phản hồi TB | Kết quả nghiệm thu |
| :--- | :---: | :--- | :---: | :---: |
| **1. Xác thực, Bảo mật & Phân quyền RBAC 4 vai trò** | `UAT-01`, `UAT-02`, `UAT-15` | Ông Dũng, Bà Trang, Ông Nam | $< 0.5\text{s}$ | **3/3 ACCEPTED (100%)** |
| **2. Quản lý Khách hàng, Tra cứu Sảnh & Chống trùng lịch** | `UAT-03`, `UAT-04`, `UAT-05`, `UAT-06`, `UAT-07`, `UAT-08` | Bà Mai Trang (Sales), Ông Hoàng Nam (Coord) | $< 0.8\text{s}$ | **6/6 ACCEPTED (100%)** |
| **3. Hợp đồng Wizard 3 bước, Tính giá, Duyệt HĐ & Đặt cọc 30%** | `UAT-09`, `UAT-10`, `UAT-11`, `UAT-12`, `UAT-13` | Bà Mai Trang (Sales), Ông Hùng Dũng (Admin) | $< 0.6\text{s}$ | **5/5 ACCEPTED (100%)** |
| **4. Dashboard Thống kê KPI Doanh thu & Sự kiện** | `UAT-14` | Ông Trần Hùng Dũng (Chủ nhà hàng) | $< 0.8\text{s}$ | **1/1 ACCEPTED (100%)** |
| **TỔNG CỘNG TOÀN PHIÊN** | **15 kịch bản** | **3 đại diện người dùng** | **Đạt chuẩn $< 3\text{s}$** | **15/15 ACCEPTED (100%)** |

---

## 3. Bảng Phân loại Lỗi Phát sinh & Xác nhận Lỗi Tồn đọng (Defect & Observation Log)

Trong suốt quá trình chạy thử 15 tình huống nghiệp vụ, PM và QA Lead đã ghi nhận và phân loại các phản hồi theo thang mức độ nghiêm trọng (Severity 1 $\rightarrow$ 4):

| Mức độ nghiêm trọng (Severity) | Định nghĩa tiêu chuẩn | Số lượng phát sinh trong UAT | Số lượng tồn đọng sau UAT | Ghi chú & Cam kết xử lý của PM |
| :--- | :--- | :---: | :---: | :--- |
| **Severity 1 — Critical / Blocker** | Sập hệ thống, mất dữ liệu, đặt trùng sảnh, tính sai tiền hợp đồng. | **0** | **0** | Đã được triệt tiêu hoàn toàn từ đợt fix bug Pareto Tuần 6 (`BUG-01` $\rightarrow$ `BUG-08`). |
| **Severity 2 — High / Major** | Chức năng chính không chạy được hoặc sai luồng phân quyền RBAC. | **0** | **0** | Hệ thống hoạt động đúng 100% theo đặc tả SRS v1.0. |
| **Severity 3 — Medium / Minor** | Sai sót nhỏ về hiển thị nhưng có cách thao tác thay thế. | **0** | **0** | Không phát sinh. |
| **Severity 4 — Low / Cosmetic & Wishlist** | Đề xuất cải tiến giao diện hoặc tính năng mở rộng cho tương lai. | **3 góp ý cải tiến** | **0 lỗi (Đưa vào Backlog v2.0)** | Xem chi tiết 3 đề xuất cải tiến bên dưới. |

### Danh sách 3 Đề xuất Cải tiến Mở rộng (Enhancement Requests — Không phải lỗi):
1. **OBS-01 (Bộ phận Sales đề xuất):** Bổ sung mẫu in PDF có sẵn khung chữ ký và con dấu điện tử riêng của từng cơ sở nhà hàng.
2. **OBS-02 (Bộ phận Điều phối đề xuất):** Thêm bộ lọc nhanh theo từng sảnh tiệc trên giao diện Lịch tháng.
3. **OBS-03 (Chủ đầu tư đề xuất):** Bổ sung tính năng so sánh doanh thu cùng kỳ năm trước trên Dashboard khi hệ thống vận hành đủ 12 tháng dữ liệu.

---

## 4. Kết luận của Chủ trì & Chữ ký Xác nhận Các bên

1. **Xác nhận chất lượng:** Phiên chạy thử nghiệm UAT đạt tỷ lệ chấp thuận tuyệt đối **15/15 kịch bản (100%)**, **không có bất kỳ lỗi Critical/High/Medium nào tồn đọng** cần sửa lại trước ngày 28/10/2026.
2. **Quyết định chuyển giao:** Đại diện Khách hàng đồng ý ký biên bản nghiệm thu chính thức (`BM-PM26-UAT-ACCEPTANCE`), cho phép đội ngũ dự án đóng băng mã nguồn (Code Freeze) và chuẩn bị phát hành bản **Release `v1.0.0`** để bảo vệ đồ án vào Tuần 8.

| ĐẠI DIỆN KHÁCH HÀNG | PROJECT MANAGER (CHỦ TRÌ) | BUSINESS ANALYST LEAD | QA & TEST LEAD |
| :---: | :---: | :---: | :---: |
| *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã ký xác nhận)* |
| **Trần Hùng Dũng** | **Phạm Lê Huy Hoàng** | **Từ Minh Hiển** | **Bùi Nguyễn Chí Hậu** |
| Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 |
