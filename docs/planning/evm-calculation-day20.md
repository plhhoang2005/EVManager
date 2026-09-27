# Báo Cáo Tính Toán Quản Trị Giá Trị Thu Được (EVM Calculation Report)
## Ngày kiểm soát: Day 20 (Cuối tuần 3 - 27/09/2026)

---

## 1. Thông Tin Chung Về Dự Án & Mốc Kiểm Soát

- **Dự án:** EVManager - Hệ Thống Quản Lý Trung Tâm Hội Nghị & Tiệc Cưới
- **Chủ nhiệm dự án (PM):** Phạm Lê Huy Hoàng
- **Đội ngũ phát triển (5 thành viên):**
  - Phạm Lê Huy Hoàng (Project Manager)
  - Huỳnh Tấn Thọ (Backend Developer)
  - Võ Hoàng Nhân (Frontend & UI/UX Developer)
  - Bùi Nguyễn Chí Hậu (Database Administrator & QA/Tester)
  - Dương Khắc Đạt (DevOps & Deployment Engineer)
- **Tổng ngân sách cơ sở ($BAC$):** **130,000,000 VNĐ** (tương đương 260 man-days @ 500,000 VNĐ/người-ngày theo dự toán COCOMO II và WBS).
- **Tổng thời gian dự án:** 8 tuần (56 ngày làm việc: 07/09/2026 – 01/11/2026).
- **Mốc kiểm soát (Control Date):** **Ngày thứ 20 (Day 20 - 27/09/2026)**, trùng với thời điểm kết thúc Tuần 3 và hoàn thiện mốc Đánh giá tiến độ giữa kỳ (Midterm Demo 50%).
- **File bảng tính đính kèm:** `docs/planning/EVM_Analysis_Day20.xlsx`

---

## 2. Phương Pháp Luận Và Công Thức Tính Toán

EVM (Earned Value Management) là kỹ thuật quản lý dự án tích hợp phạm vi, chi phí và tiến độ nhằm đo lường hiệu suất thực tế so với kế hoạch cơ sở.

### Các tham số cơ sở:
1. **$PV$ (Planned Value - Giá trị dự kiến):** Ngân sách được phân bổ cho các công việc dự kiến hoàn thành tính đến Day 20.
   $$PV = \sum (\text{Budget of Scheduled Work})$$
2. **$EV$ (Earned Value - Giá trị thu được):** Giá trị ngân sách của khối lượng công việc thực tế đã hoàn thành tính đến Day 20.
   $$EV = \sum (\text{BAC of Task} \times \% \text{ Actual Progress})$$
3. **$AC$ (Actual Cost - Chi phí thực tế):** Tổng chi phí thực tế đã tiêu tốn để thực hiện khối lượng công việc nói trên (tính theo số man-days thực tế cộng phát sinh overtime).
   $$AC = \sum (\text{Actual Man-days} \times 500,000\text{ VNĐ})$$

### Các chỉ số phương sai (Variances):
- **$SV$ (Schedule Variance - Chênh lệch tiến độ):**
  $$SV = EV - PV$$
  - $SV > 0$: Nhanh hơn tiến độ.
  - $SV = 0$: Đúng tiến độ.
  - $SV < 0$: Chậm tiến độ so với kế hoạch.
- **$CV$ (Cost Variance - Chênh lệch chi phí):**
  $$CV = EV - AC$$
  - $CV > 0$: Dưới ngân sách (tiết kiệm chi phí).
  - $CV = 0$: Đúng ngân sách.
  - $CV < 0$: Vượt ngân sách (bội chi).

### Các chỉ số hiệu suất (Performance Indexes):
- **$SPI$ (Schedule Performance Index - Chỉ số hiệu suất tiến độ):**
  $$SPI = \frac{EV}{PV}$$
  - $SPI > 1.0$: Hiệu suất tiến độ vượt mong đợi.
  - $SPI = 1.0$: Tiến độ hoàn hảo theo kế hoạch.
  - $SPI < 1.0$: Dự án đang chậm tiến độ (Ví dụ: $SPI = 0.944$ nghĩa là dự án chỉ đạt $94.4\%$ khối lượng tiến độ dự kiến).
- **$CPI$ (Cost Performance Index - Chỉ số hiệu suất chi phí):**
  $$CPI = \frac{EV}{AC}$$
  - $CPI > 1.0$: Chi tiêu hiệu quả hơn dự kiến.
  - $CPI = 1.0$: Chi tiêu đúng từng đồng theo kế hoạch.
  - $CPI < 1.0$: Chi phí thực tế vượt giá trị thu được (Ví dụ: $CPI = 0.873$ nghĩa là cứ bỏ ra 1 đồng chi phí thực tế chỉ thu về được 0.873 đồng giá trị công việc).

### Dự báo và chỉ số hoàn thành (Forecasting & TCPI):
- **$EAC$ (Estimate at Completion - Dự toán khi hoàn thành):**
  - Trường hợp CPI không đổi (typical trend):
    $$EAC = \frac{BAC}{CPI}$$
  - Trường hợp tiến độ và chi phí đều ảnh hưởng đến phần việc còn lại:
    $$EAC_{\text{composite}} = AC + \frac{BAC - EV}{CPI \times SPI}$$
- **$ETC$ (Estimate to Complete - Dự toán chi phí để hoàn thành phần còn lại):**
  $$ETC = EAC - AC$$
- **$VAC$ (Variance at Completion - Phương sai tại thời điểm hoàn thành):**
  $$VAC = BAC - EAC$$
- **$TCPI$ (To-Complete Performance Index - Chỉ số hiệu suất cần đạt để về đích đúng BAC ban đầu):**
  $$TCPI_{BAC} = \frac{BAC - EV}{BAC - AC}$$

---

## 3. Bảng Chi Tiết EVM Theo Gói Công Việc (WBS) Tính Đến Day 20

Dữ liệu được trích xuất trực tiếp từ kế hoạch cơ sở WBS (`WBS_EVManager.csv`), dự toán chi phí (`cocomo-estimation.md`), kế hoạch bù tiến độ (`fast-tracking-plan.md`) và nhật ký commit/PR thực tế của repository.

| Mã WBS | Gói công việc | Ngân sách gói ($BAC_i$) | Kế hoạch Day 20 ($PV_i$) | Tiến độ thực tế | Giá trị thu được ($EV_i$) | Chi phí thực tế ($AC_i$) | $SV_i = EV - PV$ | $CV_i = EV - AC$ |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1.1** | **Khởi động dự án** | **7,000,000 đ** | **7,000,000 đ** | **100%** | **7,000,000 đ** | **7,200,000 đ** | 0 đ | -200,000 đ |
| 1.1.1 | Lập Project Charter & phân quyền | 2,500,000 đ | 2,500,000 đ | 100% | 2,500,000 đ | 2,600,000 đ | 0 đ | -100,000 đ |
| 1.1.2 | Thiết lập Repo GitHub & Quy chuẩn | 2,000,000 đ | 2,000,000 đ | 100% | 2,000,000 đ | 2,000,000 đ | 0 đ | 0 đ |
| 1.1.3 | Họp Kick-off & ký cam kết nhóm | 2,500,000 đ | 2,500,000 đ | 100% | 2,500,000 đ | 2,600,000 đ | 0 đ | -100,000 đ |
| **1.2** | **Phân tích yêu cầu** | **13,000,000 đ** | **13,000,000 đ** | **100%** | **13,000,000 đ** | **13,500,000 đ** | 0 đ | -500,000 đ |
| 1.2.1 | Khảo sát quy trình nghiệp vụ tiệc cưới | 4,000,000 đ | 4,000,000 đ | 100% | 4,000,000 đ | 4,200,000 đ | 0 đ | -200,000 đ |
| 1.2.2 | Xây dựng SRS & Đặc tả Usecase | 5,500,000 đ | 5,500,000 đ | 100% | 5,500,000 đ | 5,700,000 đ | 0 đ | -200,000 đ |
| 1.2.3 | Lập WBS & Kế hoạch tiến độ/chi phí | 3,500,000 đ | 3,500,000 đ | 100% | 3,500,000 đ | 3,600,000 đ | 0 đ | -100,000 đ |
| **1.3** | **Thiết kế hệ thống** | **16,500,000 đ** | **16,500,000 đ** | **100%** | **16,500,000 đ** | **18,000,000 đ** | 0 đ | -1,500,000 đ |
| 1.3.1 | Thiết kế ERD & Chuẩn hóa 3NF (13 bảng) | 6,000,000 đ | 6,000,000 đ | 100% | 6,000,000 đ | 6,800,000 đ | 0 đ | -800,000 đ |
| 1.3.2 | Thiết kế Kiến trúc Backend Spring Boot | 5,000,000 đ | 5,000,000 đ | 100% | 5,000,000 đ | 5,500,000 đ | 0 đ | -500,000 đ |
| 1.3.3 | Thiết kế UI/UX Figma & Luồng màn hình | 5,500,000 đ | 5,500,000 đ | 100% | 5,500,000 đ | 5,700,000 đ | 0 đ | -200,000 đ |
| **1.4** | **Phát triển Backend (Sprint 1)** | **30,000,000 đ** | **11,500,000 đ** | **33.3% / 87% SP1** | **10,000,000 đ** | **12,800,000 đ** | **-1,500,000 đ** | **-2,800,000 đ** |
| 1.4.1 | Triển khai Schema Flyway & JPA Entities | 6,000,000 đ | 6,000,000 đ | 100% | 6,000,000 đ | 6,800,000 đ | 0 đ | -800,000 đ |
| 1.4.2 | Module Auth, JWT & User Management | 5,500,000 đ | 5,500,000 đ | 72.7% | 4,000,000 đ | 6,000,000 đ | -1,500,000 đ | -2,000,000 đ |
| 1.4.3 | Module Quản lý Sảnh (Venues & Halls) | 6,500,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| 1.4.4 | Module Khách hàng & Hợp đồng tiệc cưới | 6,000,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| 1.4.5 | Module Báo cáo & Thống kê doanh thu | 6,000,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| **1.5** | **Phát triển Frontend (Sprint 1)** | **28,500,000 đ** | **10,500,000 đ** | **30.7% / 83% SP1** | **8,750,000 đ** | **11,800,000 đ** | **-1,750,000 đ** | **-3,050,000 đ** |
| 1.5.1 | Khởi tạo SPA React + Vite + Tailwind CSS | 4,500,000 đ | 4,500,000 đ | 100% | 4,500,000 đ | 4,800,000 đ | 0 đ | -300,000 đ |
| 1.5.2 | Giao diện Đăng nhập & Dashboard Tổng quan | 6,000,000 đ | 6,000,000 đ | 70.8% | 4,250,000 đ | 7,000,000 đ | -1,750,000 đ | -2,750,000 đ |
| 1.5.3 | Giao diện Quản lý Sảnh & Sơ đồ bàn | 6,000,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| 1.5.4 | Giao diện Quản lý Đặt tiệc & Hợp đồng | 6,000,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| 1.5.5 | Giao diện Báo cáo tài chính & Tra cứu | 6,000,000 đ | 0 đ (Sprint 2) | 0% | 0 đ | 0 đ | 0 đ | 0 đ |
| **1.6** | **Kiểm thử & Đảm bảo chất lượng (QA)** | **18,000,000 đ** | **0 đ** | **0%** | **0 đ** | **0 đ** | 0 đ | 0 đ |
| **1.7** | **Triển khai & Đóng dự án** | **17,000,000 đ** | **0 đ** | **0%** | **0 đ** | **0 đ** | 0 đ | 0 đ |
| **TỔNG CỘNG** | **TOÀN BỘ DỰ ÁN** | **130,000,000 đ** | **58,500,000 đ** | **42.50%** | **55,250,000 đ** | **63,300,000 đ** | **-3,250,000 đ** | **-8,050,000 đ** |

---

## 4. Tổng Hợp Các Chỉ Số EVM Cốt Lõi Tại Day 20

| Chỉ số | Ký hiệu | Giá trị thực tế | Tỷ lệ so với $BAC$ | Đánh giá trạng thái |
| :--- | :---: | :---: | :---: | :--- |
| **Ngân sách cơ sở** | $BAC$ | 130,000,000 VNĐ | 100.0% | Ngân sách cố định toàn dự án (260 man-days) |
| **Giá trị kế hoạch** | $PV$ | 58,500,000 VNĐ | 45.00% | Mục tiêu kết thúc Tuần 3 (Sprint 1 hoàn thành 100%) |
| **Giá trị thu được** | $EV$ | 55,250,000 VNĐ | 42.50% | Khối lượng thực tế tích lũy qua các PR và commits |
| **Chi phí thực tế** | $AC$ | 63,300,000 VNĐ | 48.69% | Tổng chi phí nhân sự và OT đã chi trả |
| **Phương sai tiến độ** | $SV$ | **-3,250,000 VNĐ** | **-2.50%** | Chậm nhẹ so với kế hoạch (tương đương chậm ~1.5 ngày) |
| **Phương sai chi phí** | $CV$ | **-8,050,000 VNĐ** | **-6.19%** | Vượt chi phí dự tính do OT và chi phí ramp-up công nghệ |
| **Chỉ số hiệu suất tiến độ** | $SPI$ | **0.944** | - | $SPI < 1.0$: Tiến độ đạt 94.4% kế hoạch |
| **Chỉ số hiệu suất chi phí** | $CPI$ | **0.873** | - | $CPI < 1.0$: 1 đồng chi tiêu mang lại 0.873 đồng giá trị |
| **Dự toán khi hoàn thành (CPI)** | $EAC$ | **148,911,000 VNĐ** | 114.55% | Dự báo tổng chi phí nếu giữ nguyên mức hiệu suất hiện tại |
| **Phương sai khi hoàn thành** | $VAC$ | **-18,911,000 VNĐ** | -14.55% | Dự báo vượt ngân sách nếu không áp dụng biện pháp kiểm soát |
| **Chỉ số hiệu suất cần đạt** | $TCPI_{BAC}$ | **1.121** | - | Để về đích đúng 130M, hiệu suất chi phí còn lại phải đạt 1.121 |

---

## 5. Nhận Xét & Phân Tích Kỹ Thuật

1. **Về Tiến Độ ($SPI = 0.944$):**
   - Mức độ lệch tiến độ là $SV = -3,250,000\text{ VNĐ}$ (tương ứng khoảng 6.5 man-days công việc).
   - Nguyên nhân khách quan và chủ quan: Vào cuối Tuần 2, nhóm nhận thấy 9 đầu việc bị trễ tích lũy 24 giờ do thời gian nghiên cứu Spring Boot 3, Flyway migration và chuẩn hóa 13 bảng 3NF.
   - Nhờ áp dụng kế hoạch **Fast-tracking** song song hóa Backend - Frontend trong Tuần 3, nhóm đã bù được đáng kể thời gian, kéo $SPI$ từ mức cảnh báo $0.88$ ở Tuần 2 lên mức an toàn $0.944$ ở cuối Tuần 3, hoàn toàn đủ điều kiện bảo vệ mốc Midterm Demo 50%.

2. **Về Chi Phí ($CPI = 0.873$):**
   - Chi phí thực tế $AC = 63,300,000\text{ VNĐ}$ cao hơn kế hoạch $58,500,000\text{ VNĐ}$ do nhóm đã chủ động làm thêm giờ (Overtime) và huy động công sức tối đa để hoàn thiện bộ Database DDL 13 bảng và Mock API demo.
   - $EAC = 148,911,000\text{ VNĐ}$ cho thấy nguy cơ vượt $18,911,000\text{ VNĐ}$. Tuy nhiên, trong kế hoạch dự toán đã thiết lập quỹ dự phòng khẩn cấp (Contingency Reserve 10% = 13,000,000 VNĐ) và nhóm sẽ bước vào giai đoạn tái sử dụng khung kiến trúc sẵn có ở Sprint 2, giúp $CPI$ của Sprint 2 phục hồi mạnh về mức $\ge 1.05$.

3. **Tính Khả Thi Của Mốc Hoàn Thành:**
   - Chỉ số $TCPI = 1.121$ nằm trong khoảng kiểm soát được ($< 1.15$). Đội ngũ không cần cắt giảm phạm vi chức năng (Scope Trimming) mà chỉ cần duy trì kỷ luật làm việc và tận dụng các component/schema đã hoàn thành 100%.

---
*Báo cáo được phê duyệt bởi Project Manager - Phạm Lê Huy Hoàng.*
