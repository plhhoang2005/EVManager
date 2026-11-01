# Đề Cương Thuyết Trình Báo Cáo Tiến Độ Giữa Kỳ (50% Milestone)
## Dự án: EVManager - Event & Wedding Convention Center Management System

---

## 1. Thông Tin Chung

- **Tên báo cáo:** Báo Cáo Tiến Độ Dự Án Giữa Kỳ & Trình Diễn Hệ Thống (Midterm Project Progress & 50% Demo)
- **Thời lượng:** 15 – 20 phút (Báo cáo: 10 phút, Demo: 7 phút, Hỏi đáp: 3 phút)
- **Người trình bày chính:** Phạm Lê Huy Hoàng (PM) cùng toàn bộ nhóm phát triển EVManager.
- **Tập tin trình chiếu:** `docs/meetings/Midterm_Presentation_EVManager.pptx`

---

## 2. Cấu Trúc Các Slide & Nội Dung Thuyết Minh Chi Tiết

### Slide 1: Trang Bìa (Title Slide)
- **Tiêu đề chính:** HỆ THỐNG QUẢN LÝ TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI - EVMANAGER
- **Phụ đề:** Báo Cáo Tiến Độ Giữa Kỳ & Nghiệm Thu Mốc 50% (Tuần 1 – Tuần 3)
- **Thông tin nhóm:** Nhóm phát triển EVManager (5 thành viên: Hoàng, Thọ, Nhân, Hậu, Đạt)
- **Giảng viên hướng dẫn / Bộ môn:** Quản Lý Dự Án Phần Mềm (IT Project Management)
- **Thời gian:** Tháng 09/2026

---

### Slide 2: Mục Tiêu Dự Án & Bài Toán Nghiệp Vụ (Project Objectives & Problem Statement)
- **Bối cảnh thực tế:** Các trung tâm hội nghị tiệc cưới quy mô vừa và lớn thường gặp vấn đề:
  - Trùng lịch đặt sảnh do ghi chép sổ sách hoặc file Excel phân mảnh.
  - Thất thoát doanh thu từ phụ thu dịch vụ tiệc và thanh toán cọc nhiều đợt.
  - Thiếu công cụ báo giá tự động theo từng khung giờ và quy mô bàn tiệc.
- **Mục tiêu hệ thống EVManager:**
  - Chuẩn hóa quy trình đặt sảnh tiệc, ký hợp đồng điện tử và phân rã đợt thanh toán.
  - Tự động hóa tính giá sảnh, thực đơn và dịch vụ đi kèm theo thời gian thực.
  - Cung cấp Dashboard quản trị trực quan cho ban giám đốc và nhân viên điều hành.

---

### Slide 3: Cơ Cấu Phân Rã Công Việc (Work Breakdown Structure - WBS)
- **Cấu trúc 7 gói công việc chính ($BAC = 130,000,000\text{ VNĐ}$):**
  - **1.1 Khởi động dự án:** 7.0M VNĐ (100% Hoàn thành)
  - **1.2 Phân tích yêu cầu:** 13.0M VNĐ (100% Hoàn thành - SRS & 25 Usecases)
  - **1.3 Thiết kế hệ thống:** 16.5M VNĐ (100% Hoàn thành - ERD 13 bảng 3NF, Figma UI)
  - **1.4 Phát triển Backend (Sprint 1):** 30.0M VNĐ (Hoàn thành mốc Sprint 1: Auth, Flyway V1-V8)
  - **1.5 Phát triển Frontend (Sprint 1):** 28.5M VNĐ (Hoàn thành SPA React, Dashboard, Customer & Venue View)
  - **1.6 Kiểm thử & QA:** 18.0M VNĐ (Chuẩn bị triển khai Tuần 4 - Tuần 7)
  - **1.7 Triển khai & Đóng dự án:** 17.0M VNĐ (Chuẩn bị triển khai Tuần 7 - Tuần 8)

---

### Slide 4: Tiến Độ CPM & Đường Găng Dự Án (Critical Path Method - CPM)
- **Đường găng (Critical Path):** 1.1 $\rightarrow$ 1.2 $\rightarrow$ 1.3 $\rightarrow$ 1.4 $\rightarrow$ 1.5 $\rightarrow$ 1.6 $\rightarrow$ 1.7.
- **Tổng thời gian dự kiến:** 56 ngày làm việc (8 tuần).
- **Phát hiện nút thắt tại Tuần 2:**
  - Nhận diện 9 công việc có nguy cơ trễ 24 person-hours do đường cong học công nghệ Spring Boot 3 và mở rộng cơ sở dữ liệu lên 13 bảng.
- **Kế hoạch Fast-tracking đã thực hiện trong Tuần 3:**
  - Tiến hành song song hóa phát triển Frontend trên Mock API contract thay vì chờ Backend hoàn thành 100%.
  - Bổ sung 48 giờ làm thêm (OT) của nhóm để đưa tiến độ đường găng trở về quỹ đạo kiểm soát.

---

### Slide 5: Phân Tích Quản Trị Giá Trị Thu Được (EVM Analysis at Day 20)
- **Ngày kiểm soát:** Day 20 (Cuối tuần 3 - 27/09/2026).
- **Bảng chỉ số đo lường chính xác:**
  - **Planned Value ($PV$):** $58,500,000\text{ VNĐ}$ (45.0% kế hoạch)
  - **Earned Value ($EV$):** $55,250,000\text{ VNĐ}$ (42.5% giá trị thu được)
  - **Actual Cost ($AC$):** $63,300,000\text{ VNĐ}$ (48.7% chi phí thực tế)
  - **Schedule Variance ($SV$):** $-3,250,000\text{ VNĐ}$ | **$SPI = 0.944$** (Chậm nhẹ 1.5 ngày)
  - **Cost Variance ($CV$):** $-8,050,000\text{ VNĐ}$ | **$CPI = 0.873$** (Vượt nhẹ do đầu tư OT & nghiên cứu ban đầu)
- **Đánh giá tình trạng:** Nằm hoàn toàn trong ngưỡng an toàn ($SPI \ge 0.90, CPI \ge 0.85$). Đảm bảo mốc nghiệm thu giữa kỳ.

---

### Slide 6: Dự Báo Hoàn Thành Dự Án (EVM Forecasting Scenarios)
- **Kịch bản 1 (Typical):** $EAC_1 = BAC / CPI = 148,911,000\text{ VNĐ}$ ($VAC = -18,911,000\text{ VNĐ}$).
- **Kịch bản 2 (Atypical / Kế hoạch định mức):** $EAC_2 = AC + (BAC - EV) = 138,050,000\text{ VNĐ}$ ($VAC = -8,050,000\text{ VNĐ}$).
- **Kịch bản 4 (Kỳ vọng can thiệp quản trị - Target):**
  - Tái sử dụng thư viện UI và 13 bảng DB giúp năng suất Sprint 2 tăng vọt $\rightarrow$ $CPI_{\text{còn lại}} \ge 1.08$.
  - Dự toán về đích $EAC \approx 132,500,000\text{ VNĐ}$ ($VAC = -2,500,000\text{ VNĐ}$, nằm trọn trong Quỹ dự phòng $13,000,000\text{ VNĐ}$).
- **Chỉ số hiệu suất cần đạt ($TCPI$):**
  - $TCPI_{BAC} = 1.121$ | $TCPI_{\text{có dự phòng}} = 0.938$ (Rất khả thi).

---

### Slide 7: Kiến Trúc Kỹ Thuật & Cơ Sở Dữ Liệu 13 Bảng (Technical Architecture & 3NF ERD)
- **Frontend:** Single Page Application với React 18, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Java 21 LTS, Spring Boot 3.x, Spring Security 6 (Stateless JWT Filter), Spring Data JPA.
- **Database:** PostgreSQL 16 chuẩn hóa 3NF gồm 13 bảng:
  - `users`, `roles`, `permissions`, `venues`, `halls`, `hall_pricing`, `menus`, `menu_items`, `services`, `customers`, `events`, `event_services`, `payments`.
- **Database Migration:** Quản lý tập trung bằng Flyway (`V1` $\rightarrow$ `V8`), tự động áp dụng khi khởi chạy.

---

### Slide 8: Trình Diễn Sản Phẩm Trực Tiếp (Live Product Demo - 50%)
- **Nội dung demo thực tế:**
  1. **Đăng nhập & Quản lý phiên:** Xác thực JWT bảo mật, phân quyền Quản trị (Admin) và Nhân viên (Staff).
  2. **Dashboard Quản trị:** 4 thẻ KPI động, biểu đồ doanh thu và danh sách sự kiện gần nhất.
  3. **Quản lý Danh mục Sảnh & Khách hàng:** Lọc theo quy mô bàn tiệc, tìm kiếm khách hàng, xem chi tiết lịch sử.
  4. **Công cụ Tính Giá Tiệc Tự Động (Pricing Calculator):** Tính toán chi phí sảnh theo ca sáng/tối, đơn giá thực đơn, phụ thu dịch vụ và tỷ lệ đặt cọc 30%.

---

### Slide 9: Bài Học Kinh Nghiệm & Quản Lý Rủi Ro (Lessons Learned & Risk Management)
- **Bài học kinh nghiệm:**
  - Đầu tư chuẩn hóa cơ sở dữ liệu 3NF ngay từ đầu giúp backend và frontend phát triển nhất quán, tránh đập đi xây lại.
  - Cơ chế Fast-tracking tách biệt Frontend Mock API giúp nhóm không bị block tiến độ khi backend gặp vướng mắc kỹ thuật.
- **Kiểm soát rủi ro cho giai đoạn 2:**
  - Ngăn ngừa hiện tượng phình phạm vi (Scope Creep) bằng quy trình Change Request nghiêm ngặt.
  - Tự động hóa kiểm thử hồi quy (Regression Testing) trước mỗi lần tích hợp mã nguồn.

---

### Slide 10: Kế Hoạch Nửa Sau Dự Án & Q&A (Sprint 2 Roadmap & Q&A)
- **Kế hoạch Tuần 4 – Tuần 8:**
  - **Tuần 4 – 5 (Sprint 2):** Hoàn thiện phân rã hợp đồng đặt tiệc, sơ đồ bố trí bàn tiệc trực quan, tích hợp API hoàn chỉnh.
  - **Tuần 6 – 7 (QA & Hardening):** Kiểm thử tải, bảo mật, tối ưu hiệu năng cơ sở dữ liệu.
  - **Tuần 8 (Final Release):** Đóng gói Docker container, tài liệu nghiệm thu và bàn giao hệ thống.
- **Phần Hỏi & Đáp (Q&A):** Nhóm sẵn sàng lắng nghe ý kiến đóng góp của Hội đồng đánh giá!

---
*Đề cương được phê duyệt bởi PM Phạm Lê Huy Hoàng.*
