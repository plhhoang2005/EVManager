# Báo cáo đánh giá lệch tiến độ và Kế hoạch bù tiến độ (Fast-Tracking Plan)

| Thông tin | Chi tiết |
|---|---|
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghi & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-16 (WBS Level 3 — Chương 6 & 7 Quản lý tiến độ dự án) |
| **Người thực hiện** | Hoàng (Project Manager) |
| **Ngày lập** | 22/09/2026 (Tuần 3) |
| **Mốc kiểm soát** | Hậu kỳ Tuần 2 (Sprint 1) & Kế hoạch phục hồi Tuần 3 (Sprint 2) |
| **Trạng thái** | Đã ban hành và phổ biến cho toàn đội |

---

## 1. Bối cảnh và Đánh giá thực trạng cuối Tuần 2

Tại mốc kết thúc Tuần 2 (Chủ Nhật, ngày 20/09/2026), Ban Quản lý dự án đã tiến hành rà soát toàn bộ 150 task trên GitHub Projects. Mặc dù các công việc khởi tạo khung quản lý (PM) và một số tài liệu phân tích tổng quan đã hoàn tất, dự án ghi nhận **09 nhiệm vụ trọng yếu đang bị trễ hạn** (mang nhãn `status: delayed`), thuộc 4 phân hệ kỹ thuật:

### 1.1. Danh mục 9 task bị trễ hạn cuối Tuần 2

| Phân hệ | Mã Task | Issue ID | Tên công việc | Người phụ trách | Hạn kế hoạch (Baseline) | Giờ công trễ ước tính | Mức độ ảnh hưởng |
|---|:---:|:---:|---|:---:|:---:|:---:|:---:|
| **BA** | BA-12 | [#48](https://github.com/plhhoang2005/EVManager/issues/48) | Đặc tả UC-04: Tra cứu sảnh tiệc & kiểm tra xung đột trùng lịch | Hiển (BA) | 20/09/2026 | 3.0h | Cao (Chặn logic BE) |
| **BA** | BA-13 | [#49](https://github.com/plhhoang2005/EVManager/issues/49) | Đặc tả UC-05: Đặt giữ chỗ sảnh và thiết lập khung giờ sự kiện | Hiển (BA) | 20/09/2026 | 2.5h | Cao (Chặn DTO Backend) |
| **UI/UX** | UI-06 | [#71](https://github.com/plhhoang2005/EVManager/issues/71) | Thiết kế Prototype Figma: Bộ lịch hiển thị đặt tiệc tuần/tháng | Nhân (UI) | 20/09/2026 | 3.5h | Trung bình (Chặn layout FE) |
| **UI/UX** | UI-07 | [#72](https://github.com/plhhoang2005/EVManager/issues/72) | Thiết kế Prototype Figma: Form thông tin khách hàng & lịch sử | Nhân (UI) | 20/09/2026 | 2.0h | Trung bình |
| **Backend** | BE-04 | [#101](https://github.com/plhhoang2005/EVManager/issues/101) | Khởi tạo dự án NestJS Skeleton và tích hợp Prisma ORM | Phúc (BE) | 20/09/2026 | 3.5h | Rất cao (Đường găng CPM) |
| **Backend** | BE-05 | [#102](https://github.com/plhhoang2005/EVManager/issues/102) | Xây dựng Global Exception Filter xử lý lỗi tập trung | Phúc (BE) | 20/09/2026 | 2.0h | Cao |
| **Backend** | BE-06 | [#103](https://github.com/plhhoang2005/EVManager/issues/103) | Cấu hình ValidationPipe tự động kiểm tra tính hợp lệ DTOs | Phúc (BE) | 20/09/2026 | 2.0h | Cao |
| **DB/QA** | QA-06 | [#137](https://github.com/plhhoang2005/EVManager/issues/137) | Soạn thảo danh mục 35+ Test Cases kiểm thử chức năng lõi | Hậu (QA) | 20/09/2026 | 3.0h | Trung bình |
| **DB/QA** | QA-07 | [#138](https://github.com/plhhoang2005/EVManager/issues/138) | Viết Script Prisma Migration khởi tạo các bảng PostgreSQL | Hậu (QA) | 20/09/2026 | 2.5h | Rất cao (Chặn Database) |
| **TỔNG** | | | **Tổng cộng 9 task then chốt bị trễ hạn** | | | **24.0 giờ công** | |

### 1.2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
1. **Rào cản kỹ thuật bước đầu (Technical Ramp-up):** Backend và Database mất nhiều thời gian hơn dự kiến để chuẩn hóa kết nối Prisma ORM với PostgreSQL trên môi trường Windows và Docker cục bộ.
2. **Tranh luận về nghiệp vụ chống trùng sảnh:** BA và QA dành thêm thời gian thảo luận về việc quy định thời gian đệm (Buffer 60 phút giữa 2 ca tiệc cưới để dọn dẹp vệ sinh) dẫn đến chậm trễ bàn giao Use Case UC-04 và danh mục Test Case.
3. **Ảnh hưởng lịch học và thi giữa kỳ:** Một số thành viên có lịch kiểm tra các môn chuyên ngành khác vào các ngày thứ Năm và thứ Sáu trong Tuần 2.

### 1.3. Đánh giá rủi ro đối với Mốc Demo giữa kỳ 50% (Tuần 4)
- Tổng lượng thời gian trễ là **24 giờ công** (tương đương khoảng **1.5 đến 2 ngày làm việc** của cả nhóm).
- Hai công việc `BE-04` và `QA-07` nằm trực tiếp trên **Đường găng (Critical Path - CPM)** của dự án. Nếu tiếp tục phát triển theo trình tự truyền thống (Waterfall: Chờ BA viết xong $\rightarrow$ BE mới code $\rightarrow$ FE mới ráp giao diện $\rightarrow$ QA mới test), tiến độ dự án sẽ tiếp tục bị dồn toa, chắc chắn làm vỡ kế hoạch Demo mốc 50% ở Tuần 4.

---

## 2. Kế hoạch Fast-Tracking và Nén tiến độ

Để triệt tiêu lượng thời gian trễ 24 giờ công mà không làm phát sinh thêm kinh phí thuê ngoài, PM quyết định áp dụng kỹ thuật **Fast-tracking (Thực hiện song song các công việc vốn dĩ làm tuần tự)** kết hợp với **Điều chuyển nhân lực chéo (Cross-functional Resource Reallocation)**:

```
[TRÌNH TỰ TRUYỀN THỐNG (BỊ CHẬM)]:
BA chốt UC-04, 05 ──> BE code API sảnh/khách ──> FE gọi API ráp giao diện ──> QA viết Test & Seed Data
                                                                              (Dự kiến vỡ hạn Tuần 4)

[ÁP DỤNG FAST-TRACKING (CHẠY SONG SONG TRONG TUẦN 3)]:
┌─ BA + BE chốt hợp đồng API DTO (2h) ──┬─> BE code API thật (Module Auth, Halls, Customers) ──┐
│                                       ├─> FE dùng Mock API code UI Dashboard & Forms (Song song) ──┼─> Tích hợp 
│                                       └─> BA sang hỗ trợ QA nhập Seed Data 30 món/5 sảnh ────┘    nhanh thứ Sáu
└─ PM hỗ trợ gộp PR, cấu hình CI/CD và review mã nguồn ────────────────────────────────────────┘
```

### 2.1. Biện pháp 1: Chốt hợp đồng API DTO và Mocking để Frontend làm việc độc lập
- **Giải pháp:** Thay vì Frontend (Nhân) phải chờ Backend (Phúc) hoàn tất code và dựng xong API thật trên Server, PM chủ trì một buổi thảo luận nhanh 2 giờ vào sáng thứ Hai để chốt cấu trúc dữ liệu JSON Request/Response (DTO) cho các màn hình:
  - API Đăng nhập (`/api/auth/login`)
  - API Lấy danh sách sảnh tiệc (`/api/halls`)
  - API Tra cứu thông tin khách hàng (`/api/customers`)
- **Hành động của Frontend:** Nhân sử dụng thư viện Mock Data giả lập API nội bộ trong Next.js để dựng toàn bộ giao diện tương tác và bộ lịch đặt tiệc song song. Khi Backend hoàn thành, chỉ cần thay đổi đường dẫn `API_BASE_URL` là tích hợp hoàn tất ngay trong 2 giờ.

### 2.2. Biện pháp 2: Điều chuyển nhân sự chéo (Resource Reallocation)
- **Hỗ trợ cho QA:** Hiển (BA) sau khi hoàn thiện nhanh bản đặc tả UC-04 và UC-05 trong ngày thứ Hai sẽ dành 50% thời lượng của Tuần 3 để **trực tiếp hỗ trợ Hậu (QA)**:
  - Soạn thảo danh sách 30 món ăn thực đơn và bảng giá dịch vụ tiệc cưới.
  - Cùng Hậu tạo script Seed Data mẫu (task QA-08) cho 5 sảnh tiệc chính (`Kim Cương`, `Bạch Kim`, `Hoàng Gia`, `Pha Lê`, `Ngọc Trai`).
- **Hỗ trợ cho Backend:** Hoàng (PM) hỗ trợ Phúc giải quyết các lỗi cấu hình Docker, thiết lập GitHub Actions CI để Phúc tập trung 100% thời gian cho việc viết logic nghiệp vụ.

### 2.3. Biện pháp 3: Cam kết làm thêm giờ (Overtime / Sprint Push)
- Toàn bộ 5 thành viên cam kết dành thêm **1.5 – 2 giờ/ngày** vào các buổi tối từ thứ Hai đến thứ Năm để giải quyết dứt điểm các công việc tồn đọng.

---

## 3. Lịch trình phục hồi chi tiết từng ngày trong Tuần 3 (Daily Catch-up Schedule)

| Ngày | Mục tiêu phục hồi cụ thể | Phân công nhân sự | Tiêu chí nghiệm thu (Acceptance Criteria) |
|:---:|---|---|---|
| **Thứ Hai (21/09)** | • Họp nhanh 30p thống nhất DTO API sảnh và khách hàng.<br>• Hoàn thiện bản đặc tả UC-04 và UC-05.<br>• Hoàn tất script Prisma Migration (`QA-07`). | • PM: Chủ trì chốt DTO.<br>• BA (Hiển): Đóng task #48, #49.<br>• QA (Hậu): Đóng task #138. | Migration chạy thành công trên PostgreSQL cục bộ; cấu trúc bảng sảnh tiệc và người dùng sẵn sàng. |
| **Thứ Ba (22/09)** | • Khởi tạo thành công NestJS Skeleton, Filter, Pipe (`BE-04, 05, 06`).<br>• Dựng xong Figma Calendar và Form khách hàng (`UI-06, 07`). | • BE (Phúc): Đóng task #101, #102, #103.<br>• UI (Nhân): Đóng task #71, #72. | Repository backend build pass trên GitHub; link Figma prototype đầy đủ luồng đặt tiệc. |
| **Thứ Tư (23/09)** | • Hoàn thành 35 Test Cases chức năng lõi (`QA-06`).<br>• Bắt đầu code module Auth (BE) và Layout Next.js (FE). | • QA (Hậu) + BA (Hiển).<br>• BE (Phúc) & UI (Nhân). | Đóng task #137; toàn bộ 9 task trễ của Tuần 2 được giải quyết 100%. |
| **Thứ Năm (24/09)** | • Triển khai API Quản lý khách hàng (`BE-10`) và Users (`BE-09`).<br>• Frontend ghép form đăng nhập và kết nối JWT (`UI-12`). | • BE (Phúc).<br>• UI (Nhân). | Đăng nhập lấy được JWT Token; lưu vào LocalStorage/Cookie thành công. |
| **Thứ Sáu (25/09)** | • Xây dựng bộ Seed Data 5 sảnh, 30 món ăn (`QA-08`).<br>• Frontend hoàn thành trang Dashboard tổng quan (`UI-13`). | • QA (Hậu) + BA (Hiển).<br>• UI (Nhân). | Database có sẵn dữ liệu chuẩn để FE gọi API hiển thị dữ liệu thật. |
| **Thứ Bảy (26/09)** | • Kiểm thử tích hợp nội bộ giữa Frontend và Backend.<br>• Rà soát các lỗi giao diện và API. | • Toàn bộ thành viên (PM điều phối). | Bản build chạy trơn tru trên môi trường Staging/Localhost, không có lỗi chặn (Blocker). |
| **Chủ Nhật (27/09)** | • Tổ chức phiên họp Tuần 3 (Task PM-17).<br>• Tổng duyệt lại tiến độ và sẵn sàng cho Sprint Tuần 4. | • PM (Hoàng) chủ trì. | Đạt mốc tiến độ đề ra, sẵn sàng cho công tác chuẩn bị Demo 50%. |

---

## 4. Mục tiêu định lượng và Chỉ số giám sát (KPIs & Metrics)

Việc thực hiện kế hoạch Fast-tracking này hướng tới mục tiêu kiểm soát cụ thể sau:

1. **Khắc phục triệt để tồn đọng:** Đến hết ngày **23/09/2026 (Thứ Tư)**, toàn bộ 9 task trễ hạn của Tuần 2 phải được gỡ bỏ nhãn `status: delayed` và đóng hoàn toàn trên GitHub.
2. **Kéo lại chỉ số tiến độ:** Đảm bảo chỉ số hiệu năng tiến độ dự kiến tại mốc Ngày 20 (Tuần 4) giữ vững ở mức **$SPI \ge 0.85$** (nằm trong vùng kiểm soát an toàn trước khi vào vòng nước rút).
3. **Bảo vệ mốc Demo Giữa kỳ:** Đảm bảo có đầy đủ 5 phân hệ hoạt động (Auth, Users, Customers, Sảnh tiệc, Lịch tiệc cơ bản) để thực hiện buổi Demo 50% thuyết phục trước Giảng viên.
