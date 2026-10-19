# Bảng Tổng Kết Quản Lý Lỗi Hoàn Chỉnh (Final Defect Log)

**Dự án**: EVManager — Hệ thống quản lý dịch vụ sự kiện  
**Mã công việc / Issue**: Task QA-24 / Issue #155  
**Người lập**: Bùi Nguyễn Chí Hậu (Database Specialist & QA/Test Lead)  
**Người phê duyệt**: Phan Lê Huy Hoàng (Project Manager), Ngô Hồng Phúc (Backend Lead), Võ Thành Nhân (Frontend Lead)  
**Ngày hoàn thành**: 13/10/2026  
**Hạn chót (Deadline)**: 25/10/2026  

---

## 1. Mục tiêu và Tiêu chuẩn chất lượng (Quality Exit Criteria)

Tài liệu này là **Báo cáo Tổng kết Defect Log chính thức** nhằm rà soát, đối soát và đóng toàn bộ các lỗi (Defects/Bugs) phát sinh trong suốt vòng đời phát triển hệ thống EVManager từ Đợt 1 đến Đợt 3.

### Tiêu chuẩn đóng Defect (Exit Criteria):
1. **100% Lỗi đã được khắc phục**: Có mã commit và pull request tương ứng trên Git.
2. **100% Lỗi đã được Re-test thành công**: Có bằng chứng kiểm thử tự động (Automation Test) hoặc kịch bản kiểm thử thủ công vượt qua trên môi trường Staging.
3. **Zero Critical/High Open Bugs**: Tuyệt đối không còn bất kỳ lỗi nào ở mức độ nghiêm trọng `Critical` hoặc `High` ở trạng thái mở (`Open`).
4. **Đồng bộ trạng thái trên GitHub Issues**: Toàn bộ các ticket lỗi chuyển sang trạng thái **`Closed`** kèm comment kết luận chuẩn hóa.

---

## 2. Thống kê tổng hợp Defect (Defect Summary Metrics)

### 2.1. Bảng phân bố tình trạng lỗi

| Chỉ số theo dõi (Metric) | Số lượng | Tỷ lệ (%) | Đánh giá |
|---|:---:|:---:|---|
| **Tổng số lỗi phát hiện trong dự án** | **10** | **100.0%** | Đã ghi nhận đầy đủ vào hệ thống Issue Tracker |
| **Số lỗi đã sửa và tạo PR (Resolved)** | **10** | **100.0%** | 10/10 lỗi đã có mã sửa lỗi hoàn tất |
| **Số lỗi Re-test thành công (Verified Pass)** | **10** | **100.0%** | 10/10 lỗi vượt qua bài kiểm tra hồi quy |
| **Số lỗi đã đóng chính thức (Closed)** | **10** | **100.0%** | **100% ĐÃ ĐÓNG (ĐẠT CHỈ TIÊU)** |
| **Số lỗi Critical / Blocker còn tồn đọng** | **0** | **0.0%** | **ĐẠT (Zero Critical Bugs)** |
| **Số lỗi High còn tồn đọng** | **0** | **0.0%** | **ĐẠT (Zero High Bugs)** |
| **Số lỗi Medium / Low còn tồn đọng** | **0** | **0.0%** | **ĐẠT (Hệ thống sạch lỗi)** |

### 2.2. Phân loại theo mức độ nghiêm trọng (Severity Breakdown)
- 🔴 **High / Critical**: 7 lỗi (70%) — Đã giải quyết triệt để 7/7 lỗi.
- 🟡 **Medium**: 2 lỗi (20%) — Đã giải quyết triệt để 2/2 lỗi.
- 🟢 **Low / Minor**: 1 lỗi (10%) — Đã giải quyết triệt để 1/1 lỗi.

---

## 3. Ma trận Chi tiết Quản lý và Đóng lỗi (Final Defect Matrix)

| Mã Bug | Tiêu đề lỗi | Mức độ | Phân hệ | Người xử lý | Nguyên nhân gốc rễ (Root Cause) | Giải pháp khắc phục (Resolution) | Bằng chứng Re-test | Trạng thái |
|:---:|---|:---:|:---:|:---:|---|---|---|:---:|
| **BUG-01** / `#150` | Race condition khi nhiều người dùng cùng đặt một sảnh tại một thời điểm | **High** | Event / Venue | Phúc (Backend) | Thiếu cơ chế khóa đồng thời (Locking) ở tầng CSDL dẫn đến việc 2 giao dịch cùng đọc trạng thái khả dụng. | Áp dụng Pessimistic Write Lock (`PESSIMISTIC_WRITE`) trên Repository và xử lý `@Transactional`. | `EventConcurrencyIntegrationTest` (PASS 100% với 5 luồng đồng thời) | **CLOSED** |
| **BUG-02** | Sai lệch 1 giờ trong lịch đặt tiệc do chênh lệch múi giờ UTC+7 | **High** | Event / UI | Nhân (Frontend), Phúc (Backend) | Frontend FullCalendar chưa cấu hình timezone; Jackson Serializer chưa định hình múi giờ `Asia/Ho_Chi_Minh`. | Thêm `timeZone: 'Asia/Ho_Chi_Minh'` trong `calendar.js` và cấu hình Jackson trong `application.yml`. | Kiểm thử hiển thị lịch tiệc 17:30 trên Chrome/Firefox hiển thị đúng 17:30 | **CLOSED** |
| **BUG-03** | Tính sai tổng tiền khi áp dụng đồng thời chiết khấu % và voucher tiền mặt | **High** | Contract / Billing | Phúc (Backend), Nhân (Frontend) | Thứ tự phép tính bị đảo ngược: trừ voucher trước rồi mới nhân % chiết khấu làm thất thoát tiền. | Chuẩn hóa thứ tự công thức: Trừ chiết khấu % trước, sau đó mới trừ voucher tiền mặt trực tiếp. | `PricingCalculatorTest` & kiểm thử form `calculator.js` (Ra đúng 93.000.000đ) | **CLOSED** |
| **BUG-04** | Lệch ngày giờ và logic tính toán chiết khấu / hợp đồng | **High** | Event / Contract | Hậu (QA), Phúc (Backend) | Quy đổi múi giờ không đồng bộ giữa `OffsetDateTime` và giờ cục bộ khi lập hợp đồng. | Chuẩn hóa định dạng ISO-8601 UTC lưu DB và quy đổi về múi giờ Việt Nam khi hiển thị. | `ConflictCheckerServiceTest` (PASS 100% trên các kịch bản múi giờ) | **CLOSED** |
| **BUG-05** / `EV-157` | Ô tìm kiếm khách hàng và sự kiện không hiển thị dữ liệu trên giao diện | **High** | Customer / Event | Nhân (Frontend) | Hàm `setupFiltersAndSearch()` chỉ lọc mảng tĩnh JavaScript rỗng; chưa gọi API Backend kèm keyword. | Bổ sung debounce 300ms, gửi request `GET /api/v1/customers?keyword=...` và render từ CSDL. | Kiểm thử gõ tìm "Nguyễn Văn An" hiển thị ngay kết quả sau 300ms | **CLOSED** |
| **BUG-06** / `EV-158` | Thiếu API Dashboard tổng hợp khiến Frontend bị 404 và văng phiên đăng nhập | **High** | Dashboard / Auth | Phúc (Backend), Nhân (Frontend) | Không có endpoint `/api/v1/dashboard/summary`; `api.js` gặp 404 tự động xóa token và văng về `login.html`. | Tạo mới `DashboardController.java` trả về 4 chỉ số KPI; sửa `api.js` không xóa token khi gặp 404. | Đăng nhập Admin vào `admin.html` ổn định, 4 thẻ KPI tải đầy đủ số liệu | **CLOSED** |
| **BUG-07** / `EV-159` | Thiếu ràng buộc Validate dữ liệu đầu vào (SĐT, Email, Sức chứa sảnh) | **Medium** | Form Validation | Nhân (Frontend) | Form modal cho phép submit dữ liệu tự do mà không kiểm tra regex hoặc giới hạn max capacity. | Bổ sung Regex SĐT Việt Nam (10 số), validate RFC Email, tự động gán `max` theo sức chứa sảnh. | Nhập SĐT "090123" hệ thống báo đỏ: *"Số điện thoại phải gồm 10 chữ số hợp lệ"* | **CLOSED** |
| **BUG-08** / `EV-160` | Phân quyền RBAC trên develop chưa hỗ trợ đủ 4 vai trò chuẩn theo BA | **High** | Auth / RBAC | Phúc (Backend), Hậu (DB) | CSDL chỉ có `ADMIN`, `USER`; các Controller gắn `@PreAuthorize` cứng gây lỗi 403 Forbidden. | Bổ sung Flyway migration nạp đủ 4 vai trò: `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`. | Đăng nhập bằng tài khoản Sales và Coordinator thao tác đúng phân quyền | **CLOSED** |
| **BUG-104** | Email đăng nhập phân biệt chữ hoa/thường (Case-sensitive) | **Medium** | Auth / User | Phúc (Backend) | Truy vấn `findByEmail` trong CSDL phân biệt hoa thường dẫn đến việc gõ `Admin@evmanager.vn` bị lỗi. | Cập nhật truy vấn dùng `findByEmailIgnoreCase` và `LOWER(email)` chuẩn hóa trước khi xác thực. | Đăng nhập bằng `ADMIN@EVMANAGER.VN` thành công mượt mà | **CLOSED** |
| **BUG-105** | Nút "Thêm khách hàng" bị che ở độ phân giải màn hình 1024x768 | **Low** | UI / Responsive | Nhân (Frontend) | CSS cố định chiều rộng bảng khiến nút thao tác bị tràn khung nhìn trên màn hình nhỏ. | Tinh chỉnh CSS Flexbox và gán thanh cuộn ngang `overflow-x: auto` cho bảng dữ liệu. | Kiểm thử trên màn hình 1024x768 hiển thị nút bấm đầy đủ, không bị che | **CLOSED** |

---

## 4. Hướng dẫn Comment Đóng Issue trên GitHub (GitHub Closing Guidelines)

Theo đúng yêu cầu của Task QA-24, dưới đây là mẫu comment chuẩn hóa để ghi nhận bằng chứng kiểm thử trước khi đóng từng Issue trên GitHub:

### 4.1. Mẫu comment chuẩn hóa (Standard Closing Comment):
```markdown
Đã re-test thành công trên môi trường Staging, lỗi không còn tái hiện.
- Bằng chứng kiểm thử: Vượt qua toàn bộ bài kiểm thử hồi quy tự động (Regression Tests) và kiểm thử chấp nhận người dùng UAT.
- Trạng thái kiểm tra: PASS 100%.
Xác nhận đổi nhãn và đóng issue theo tiêu chuẩn nghiệm thu Task QA-24.
```

### 4.2. Danh mục Issue GitHub đối ứng cần đóng:
1. **Issue #150** (Race Condition khi đặt sảnh): Đóng kèm link PR #219 (`EventConcurrencyIntegrationTest` PASS).
2. **Issue #152** (Biểu đồ Pareto khuyết tật): Đóng kèm link PR #219 (Tài liệu phân tích & ảnh biểu đồ 300 DPI).
3. **Issue #153** (Kiểm thử hiệu năng): Đóng kèm link PR #220 (Báo cáo tải 50 VUs, API < 500ms, Page Load < 3s).
4. **Issue #154** (Kiểm thử UAT 15 kịch bản): Đóng kèm link PR #221 (Biên bản nghiệm thu 15/15 kịch bản ACCEPTED).
5. **Issue #155** (Quản lý Defect Log): Đóng sau khi hoàn tất nghiệm thu tài liệu này.

---

## 5. Kết luận & Biên bản Nghiệm thu Đóng Defect Log

### 5.1. Kết luận
- Toàn bộ **10 / 10 lỗi** phát hiện trong suốt quá trình phát triển hệ thống EVManager đã được đội ngũ phát triển khắc phục triệt để.
- Quá trình kiểm thử hồi quy độc lập xác nhận **không phát sinh bất kỳ lỗi mới (Zero Regression Bug)**.
- Hệ thống đạt trạng thái **Zero Critical/High Open Defects**, hoàn toàn đáp ứng mục tiêu chất lượng (Quality Goals) đã đề ra trong Kế hoạch kiểm thử `docs/testing/test-plan.md`.

### 5.2. Quyết định đóng hồ sơ lỗi
Hội đồng QA và Quản lý Dự án chính thức phê duyệt **ĐÓNG TOÀN BỘ DEFECT LOG (DEFECT LOG SIGN-OFF)**. Hệ thống EVManager chính thức đạt chứng nhận chất lượng cho đợt nghiệm thu cuối kỳ.

---

### Chữ ký xác nhận đóng Defect Log (Sign-off)

| QA & Test Lead | Backend Lead | Frontend Lead | Project Manager (PM) |
|:---:|:---:|:---:|:---:|
| *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã ký xác nhận)* | *(Đã phê duyệt nghiệm thu)* |
| **Bùi Nguyễn Chí Hậu** | **Ngô Hồng Phúc** | **Võ Thành Nhân** | **Phan Lê Huy Hoàng** |
| Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 | Ngày: 13/10/2026 |
