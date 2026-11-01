# Kế Hoạch Triển Khai Khắc Phục Toàn Diện Cho Demo Giữa Kỳ (Master Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khắc phục toàn bộ các lỗi core (Tìm kiếm không chạy, Dữ liệu không hiện, Thiếu ràng buộc, Lệch pha BE-FE) và hoàn thiện 100% kịch bản Demo Giữa kỳ 50% theo đúng tài liệu BA và phân công 5 tài khoản GitHub.

**Architecture:** Áp dụng mô hình Contract-First Alignment: Chuẩn hóa RESTful API DTO giữa Spring Boot 3 và giao diện Vanilla JS Frontend; Bổ sung endpoint Dashboard tổng hợp; Nạp dữ liệu Seed Flyway V10 chuẩn hóa 4 Roles (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`) và thông tin khách hàng mẫu "Nguyễn Văn An"; Tách biệt trách nhiệm commit theo đúng vai trò thành viên GitHub.

**Tech Stack:** Java 21 LTS, Spring Boot 3, Spring Security, JWT, PostgreSQL 16, Flyway Migration, FullCalendar, Chart.js, HTML5/CSS3/Vanilla JS.

**Spec:** [`docs/superpowers/specs/2026-10-04-demo-rescue-master-spec.md`](file:///d:/EVManager/docs/superpowers/specs/2026-10-04-demo-rescue-master-spec.md)

---

## Global Constraints

- Không dùng lệnh Git có tính phá hủy (`--force`, `reset --hard`) trên nhánh `develop`.
- Không tự ý sửa Backend khi đang làm nhiệm vụ Frontend và ngược lại (tuân thủ `AGENTS.md`).
- Validate toàn bộ dữ liệu đầu vào bằng Jakarta Bean Validation (Backend) và Regex (Frontend).
- Mọi commit phải tuân theo Conventional Commits và gắn đúng Issue Key (`closes #205`, `closes #206`,...).
- Mỗi task phải được kiểm thử độc lập và xác nhận bằng lệnh thực tế trước khi chuyển sang task kế tiếp.

## Review Focus

1. **Token Invalidation on 404/403:** Người dùng bị logout đột ngột khi API phụ trả về lỗi $\rightarrow$ Kiểm tra `api.js` không xóa token khi gặp mã lỗi khác 401.
2. **Spring Data Page Parsing:** Frontend nhận object Page `{ content: [...] }` nhưng cố lặp như mảng $\rightarrow$ Kiểm tra `dashboard.js` luôn bóc tách `.content`.
3. **Vietnamese Phone Regex:** Số điện thoại nhập linh tinh vẫn được lưu $\rightarrow$ Kiểm tra regex `^(0[3|5|7|8|9])[0-9]{8}$`.
4. **Timezone Offset in FullCalendar:** Sự kiện bị lệch 1 tiếng $\rightarrow$ Kiểm tra `timeZone: 'Asia/Ho_Chi_Minh'` ở cả frontend và backend.
5. **Pricing Calculation Order (BUG-03):** Trừ voucher trước làm sai chiết khấu % $\rightarrow$ Kiểm tra công thức: Tính chiết khấu % trước, trừ voucher sau.

---

### Task 1: [DBA Hậu - Bug #208 / EV-197] Chuẩn hóa Flyway Seed Data & Phân quyền 4 Roles (V10)

**Assignee:** `2005buinguyenchihau-alt` (`2005buinguyenchihau@gmail.com`)  
**Branch:** `fix/208-seed-demo-roles`

**Files:**
- Create: `backend/src/main/resources/db/migration/V10__add_system_roles_and_demo_seed.sql`
- Test: PostgreSQL Query verification

**Interfaces:**
- Consumes: Bảng `roles`, `venues`, `customers` từ V1..V9
- Produces: 4 roles (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`), khách hàng `KH01` (Nguyễn Văn An, `0901234567`), 5 sảnh tiệc chuẩn

- [ ] **Step 1: Viết script migration `V10__add_system_roles_and_demo_seed.sql`**
  ```sql
  -- 1. Bổ sung đầy đủ 4 Role chuẩn theo BA
  INSERT INTO roles (role_name, description, status) VALUES
  ('ADMIN', 'Quản trị viên toàn quyền hệ thống', 'ACTIVE'),
  ('SALES', 'Nhân viên tư vấn & bán hàng', 'ACTIVE'),
  ('COORDINATOR', 'Điều phối viên sự kiện & sảnh tiệc', 'ACTIVE'),
  ('CUSTOMER', 'Khách hàng đặt tiệc cá nhân/doanh nghiệp', 'ACTIVE')
  ON CONFLICT (role_name) DO NOTHING;

  -- 2. Đảm bảo có khách hàng Nguyễn Văn An (KH01) phục vụ kịch bản demo Bước 2
  INSERT INTO customers (full_name, phone, email, address, customer_type) VALUES
  ('Nguyễn Văn An', '0901234567', 'nguyenvana@example.com', 'Quận 1, TP.HCM', 'INDIVIDUAL')
  ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name;

  -- 3. Đảm bảo có đủ 5 sảnh tiệc chuẩn theo kịch bản demo
  INSERT INTO venues (venue_name, min_capacity, max_capacity, rental_price, address, status) VALUES
  ('Sảnh Kim Cương (Diamond Hall)', 200, 500, 25000000.00, 'Tầng 1, Trung tâm EVManager', 'AVAILABLE'),
  ('Sảnh Hoàng Gia (Imperial Hall)', 100, 300, 10000000.00, 'Tầng 2, Trung tâm EVManager', 'AVAILABLE'),
  ('Sảnh Ngọc Bích (Emerald Hall)', 50, 150, 6000000.00, 'Tầng 3, Trung tâm EVManager', 'AVAILABLE'),
  ('Sảnh Ruby (Ruby Hall)', 80, 200, 8000000.00, 'Tầng 4, Trung tâm EVManager', 'AVAILABLE'),
  ('Sảnh Bạch Kim (Platinum Hall)', 150, 400, 12000000.00, 'Tầng 5, Trung tâm EVManager', 'AVAILABLE')
  ON CONFLICT (venue_name, address) DO NOTHING;
  ```

- [ ] **Step 2: Kiểm tra cú pháp SQL và tính toàn vẹn**
  Chạy migration và kiểm tra dữ liệu bằng lệnh kiểm thử hoặc psql.

- [ ] **Step 3: Commit với tài khoản Hậu**
  ```bash
  git checkout -b fix/208-seed-demo-roles
  git add backend/src/main/resources/db/migration/V10__add_system_roles_and_demo_seed.sql
  git commit --author="Bui Nguyen Chi Hau <2005buinguyenchihau@gmail.com>" -m "feat(database): add Flyway V10 for BA roles and demo seed data (closes #208)"
  ```

---

### Task 2: [Backend Phúc - Bug #206 / EV-195] Phục hồi Mã Nguồn & Xây dựng API Dashboard Summary

**Assignee:** `phucngo1707` (`phucngo1707@gmail.com`)  
**Branch:** `fix/206-dashboard-summary-api`

**Files:**
- Modify: `backend/src/main/java/com/evmanager/events/controller/EventController.java`
- Modify: `backend/src/main/java/com/evmanager/events/service/EventService.java`
- Modify: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/java/com/evmanager/dashboard/dto/DashboardSummaryResponse.java`
- Create: `backend/src/main/java/com/evmanager/dashboard/service/DashboardService.java`
- Create: `backend/src/main/java/com/evmanager/dashboard/controller/DashboardController.java`
- Modify: `backend/src/main/java/com/evmanager/config/SecurityConfig.java`

**Interfaces:**
- Consumes: `CustomerRepository`, `VenueRepository`, `EventRepository`
- Produces: `GET /api/v1/dashboard/summary` trả về JSON `DashboardSummaryResponse`

- [ ] **Step 1: Khôi phục 3 file bị lỗi nhị phân về UTF-8 chuẩn**
  Lấy bản chuẩn từ `origin/develop` cho `EventController.java`, `EventService.java`, `application.yml`.
  Xác nhận bằng `mvn test-compile` không báo lỗi ký tự lạ.

- [ ] **Step 2: Tạo DTO `DashboardSummaryResponse.java`**
  ```java
  package com.evmanager.dashboard.dto;
  import lombok.*;
  import java.math.BigDecimal;
  import java.util.List;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class DashboardSummaryResponse {
      private BigDecimal totalRevenue;
      private long totalEvents;
      private long totalCustomers;
      private long pendingContracts;
      private double occupancyRate;
      private List<BigDecimal> monthlyRevenue;
      private List<RecentEventDTO> recentEvents;

      @Data
      @Builder
      @NoArgsConstructor
      @AllArgsConstructor
      public static class RecentEventDTO {
          private Long id;
          private String title;
          private String client;
          private String location;
          private String date;
          private BigDecimal budget;
          private String status;
      }
  }
  ```

- [ ] **Step 3: Tạo `DashboardService.java` & `DashboardController.java`**
  Controller ánh xạ đường dẫn `GET /api/v1/dashboard/summary`.
  Service truy vấn số lượng từ DB: `customerRepository.count()`, `venueRepository.count()`, tính doanh thu và danh sách sự kiện gần nhất.

- [ ] **Step 4: Cập nhật `SecurityConfig.java`**
  Cho phép endpoint `/api/v1/dashboard/**` yêu cầu xác thực (`.authenticated()`), không bị chặn 403.

- [ ] **Step 5: Kiểm tra biên dịch**
  Chạy: `mvn test-compile` trong thư mục `backend/`
  Kỳ vọng: `BUILD SUCCESS`

- [ ] **Step 6: Commit với tài khoản Phúc**
  ```bash
  git checkout -b fix/206-dashboard-summary-api
  git add backend/src/main/java/com/evmanager/dashboard/ backend/src/main/java/com/evmanager/config/SecurityConfig.java backend/src/main/java/com/evmanager/events/ backend/src/main/resources/application.yml
  git commit --author="Thanh Phuc <phucngo1707@gmail.com>" -m "feat(backend): implement Dashboard Summary API and restore clean sources (closes #206)"
  ```

---

### Task 3: [Backend Phúc - Bug #208 / EV-197] Cập nhật Phân quyền Controller & API Sự kiện

**Assignee:** `phucngo1707` (`phucngo1707@gmail.com`)  
**Branch:** `fix/208-controller-rbac-alignment`

**Files:**
- Modify: `backend/src/main/java/com/evmanager/customers/controller/CustomerController.java`
- Modify: `backend/src/main/java/com/evmanager/venues/controller/VenueController.java`
- Modify: `backend/src/main/java/com/evmanager/events/controller/EventController.java`

**Interfaces:**
- Consumes: Spring Security `Authentication`
- Produces: `@PreAuthorize` hỗ trợ `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`; endpoint `GET /api/v1/events`

- [ ] **Step 1: Cập nhật `@PreAuthorize` trong `CustomerController.java`**
  Thay thế `hasAnyRole('ADMIN', 'MANAGER', 'STAFF')` bằng:
  `hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'MANAGER', 'STAFF')`

- [ ] **Step 2: Cập nhật `@PreAuthorize` trong `VenueController.java`**
  Cấp quyền xem sảnh cho cả `CUSTOMER`:
  `hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER', 'MANAGER', 'STAFF')`

- [ ] **Step 3: Thêm endpoint `GET /api/v1/events` vào `EventController.java`**
  Hỗ trợ lấy danh sách sự kiện chung cho cả Dashboard lẫn FullCalendar.

- [ ] **Step 4: Kiểm tra biên dịch**
  Chạy: `mvn test-compile` $\rightarrow$ `BUILD SUCCESS`

- [ ] **Step 5: Commit với tài khoản Phúc**
  ```bash
  git checkout -b fix/208-controller-rbac-alignment
  git add backend/src/main/java/com/evmanager/customers/controller/CustomerController.java backend/src/main/java/com/evmanager/venues/controller/VenueController.java backend/src/main/java/com/evmanager/events/controller/EventController.java
  git commit --author="Thanh Phuc <phucngo1707@gmail.com>" -m "fix(auth): align controller RBAC annotations with BA 4-role specifications (closes #208)"
  ```

---

### Task 4: [Frontend Nhân - Bug #206 & Conflict #197] Chuẩn hóa `api.js` & Dọn dẹp PR 197

**Assignee:** `nhanvo134679` (`nhanvo134679@gmail.com`)  
**Branch:** `fix/206-api-resilience`

**Files:**
- Modify: `frontend/js/api.js`
- Test: Kiểm thử gọi thử endpoint 404 không bị redirect

**Interfaces:**
- Consumes: `fetch` API, `sessionStorage`
- Produces: `fetchAPI(endpoint, options)` ổn định, bảo toàn session

- [ ] **Step 1: Cập nhật xử lý lỗi trong `frontend/js/api.js`**
  Xóa bỏ việc tự ý logout khi gặp HTTP 403 hoặc 404 của endpoint dữ liệu:
  ```javascript
  // Chỉ tự động logout khi gặp đúng HTTP 401 Unauthorized tại các trang nội bộ
  if (response.status === 401) {
      const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
      if (!isAuthEndpoint && !window.location.pathname.includes('login.html')) {
          console.warn('Phiên đăng nhập hết hạn (HTTP 401). Điều hướng về trang đăng nhập.');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('currentUser');
          window.location.href = 'login.html';
      }
  }
  ```

- [ ] **Step 2: Commit với tài khoản Nhân**
  ```bash
  git checkout -b fix/206-api-resilience
  git add frontend/js/api.js
  git commit --author="nhanvo134679 <nhanvo134679@gmail.com>" -m "fix(frontend): prevent premature session logout on non-auth 404/403 errors (closes #206)"
  ```

---

### Task 5: [Frontend Nhân - Bug #205 / EV-194] Sửa Data Binding & Tìm kiếm Khách hàng (Debounce Search)

**Assignee:** `nhanvo134679` (`nhanvo134679@gmail.com`)  
**Branch:** `fix/205-customer-search-binding`

**Files:**
- Modify: `frontend/js/dashboard.js`
- Test: Nhập "Nguyễn Văn An" vào ô tìm kiếm hiển thị đúng kết quả từ PostgreSQL

**Interfaces:**
- Consumes: `GET /api/v1/dashboard/summary`, `GET /api/v1/customers?keyword=...`
- Produces: Dữ liệu KPI thật trên Dashboard; Bảng khách hàng tìm kiếm mượt mà

- [ ] **Step 1: Cập nhật hàm `loadAdminData()` trong `dashboard.js`**
  Gọi đúng `/api/v1/dashboard/summary`, bóc tách dữ liệu vào `adminEvents`, cập nhật biểu đồ và 4 thẻ KPI.
  Gọi `GET /api/v1/customers` và bóc tách `data.content || data` để lưu vào `adminCustomers`.

- [ ] **Step 2: Cập nhật tìm kiếm khách hàng với Debounce 300ms**
  Khi người dùng gõ vào `customerSearchInput`:
  Gửi `GET /api/v1/customers?keyword=` + encodeURIComponent(keyword).
  Nhận dữ liệu từ CSDL và gọi `renderCustomersTable()`.

- [ ] **Step 3: Khắc phục hiển thị danh mục Sảnh tiệc**
  Lấy dữ liệu sảnh từ `GET /api/v1/venues` hiển thị lên giao diện.

- [ ] **Step 4: Commit với tài khoản Nhân**
  ```bash
  git checkout -b fix/205-customer-search-binding
  git add frontend/js/dashboard.js
  git commit --author="nhanvo134679 <nhanvo134679@gmail.com>" -m "feat(frontend): integrate live PostgreSQL search and dashboard summary (closes #205)"
  ```

---

### Task 6: [Frontend Nhân - Bug #207 / EV-196] Ràng buộc Validate Dữ liệu Đầu vào (SĐT, Email, Sức chứa)

**Assignee:** `nhanvo134679` (`nhanvo134679@gmail.com`)  
**Branch:** `fix/207-frontend-validation`

**Files:**
- Modify: `frontend/js/dashboard.js`
- Modify: `frontend/admin.html`

**Interfaces:**
- Consumes: Regex `^(0[3|5|7|8|9])[0-9]{8}$`, `POST /api/v1/customers`
- Produces: Form validate chặn thao tác sai; lưu khách hàng trực tiếp vào CSDL

- [ ] **Step 1: Thêm validation vào sự kiện submit của `customerForm`**
  Kiểm tra số điện thoại:
  ```javascript
  const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09).");
      return;
  }
  ```
  Khi hợp lệ: gọi `fetchAPI('/api/v1/customers', { method: 'POST', body: JSON.stringify(...) })`.
  Sau đó reload danh sách khách hàng từ CSDL.

- [ ] **Step 2: Ràng buộc số lượng khách theo Sức chứa tối đa của Sảnh**
  Khi tạo sự kiện mới, kiểm tra số lượng bàn/khách không được vượt quá `maxCapacity` của sảnh đã chọn.

- [ ] **Step 3: Commit với tài khoản Nhân**
  ```bash
  git checkout -b fix/207-frontend-validation
  git add frontend/js/dashboard.js frontend/admin.html
  git commit --author="nhanvo134679 <nhanvo134679@gmail.com>" -m "fix(ui): enforce phone number regex, capacity limits and live POST customer (closes #207)"
  ```

---

### Task 7: [Frontend Nhân - Bug #204 / BUG-03] Chuẩn hóa Công cụ Tính Giá Tiệc Tự Động

**Assignee:** `nhanvo134679` (`nhanvo134679@gmail.com`)  
**Branch:** `fix/204-pricing-calculator-rules`

**Files:**
- Modify: `frontend/js/calculator.js`
- Modify: `frontend/calculator.html`
- Modify: `frontend/js/calendar.js` (đồng bộ múi giờ UTC+7 cho BUG-02)

**Interfaces:**
- Consumes: Bảng giá sảnh, menu, dịch vụ, công thức BA UC-08
- Produces: Tính toán realtime tổng tiền, VAT 8%, Phí phục vụ 5%, Tiền cọc 30%

- [ ] **Step 1: Viết lại logic tính giá chuẩn BA trong `calculator.js`**
  ```javascript
  // 1. Tiền sảnh theo ca
  const venuePrice = selectedVenuePrice; // 25,000,000 đ cho Diamond ca tối
  // 2. Tiền bàn tiệc
  const menuPricePerTable = selectedMenuPrice; // 4,500,000 đ
  const tableTotal = tablesCount * menuPricePerTable;
  // 3. Tiền sau chiết khấu % (áp dụng trước theo BUG-03)
  const discountAmount = tableTotal * (discountPercent / 100);
  const tableAfterDiscount = tableTotal - discountAmount;
  // 4. Trừ voucher tiền mặt (trừ sau theo BUG-03)
  const netTablePrice = Math.max(0, tableAfterDiscount - voucherAmount);
  // 5. Tổng dịch vụ
  const subtotal = venuePrice + netTablePrice + serviceTotal;
  // 6. Phí phục vụ (5%) và Thuế VAT (8%)
  const serviceCharge = subtotal * 0.05;
  const vat = (subtotal + serviceCharge) * 0.08;
  const grandTotal = subtotal + serviceCharge + vat;
  // 7. Tiền cọc tối thiểu đợt 1 (30%)
  const depositMin = grandTotal * 0.30;
  ```

- [ ] **Step 2: Cập nhật múi giờ FullCalendar trong `calendar.js` (BUG-02)**
  Khôi phục `timeZone: 'Asia/Ho_Chi_Minh'` để lịch không bị lệch 1 tiếng.

- [ ] **Step 3: Commit với tài khoản Nhân**
  ```bash
  git checkout -b fix/204-pricing-calculator-rules
  git add frontend/js/calculator.js frontend/calculator.html frontend/js/calendar.js
  git commit --author="nhanvo134679 <nhanvo134679@gmail.com>" -m "fix(calculator): align pricing formula with VAT, service fee, deposit and Asia/Ho_Chi_Minh timezone (closes #204)"
  ```

---

### Task 8: [QA Hậu & PM Hoàng] Kiểm thử Hồi Quy Toàn Diện & Diễn Tập Kịch Bản Demo (Dry-Run)

**Assignee:** `2005buinguyenchihau-alt` & `plhhoang2005`  
**Branch:** `develop`

**Files:**
- Modify: `docs/testing/test-summary-midterm.md`
- Modify: `docs/planning/change-log.md`

- [ ] **Step 1: Merge tuần tự các nhánh fix vào `develop`**
  PM Hoàng thực hiện merge các PR: `fix/208-seed-demo-roles`, `fix/206-dashboard-summary-api`, `fix/208-controller-rbac-alignment`, `fix/206-api-resilience`, `fix/205-customer-search-binding`, `fix/207-frontend-validation`, `fix/204-pricing-calculator-rules`.

- [ ] **Step 2: Chạy kiểm thử tự động toàn bộ Backend**
  Lệnh: `mvn clean test`
  Kỳ vọng: 100% test cases PASS, không có regression.

- [ ] **Step 3: Diễn tập kịch bản Demo 10 phút (Dry-Run 3 lần liên tục)**
  1. Đăng nhập `admin@evmanager.vn` / `admin123` $\rightarrow$ Dashboard tải số liệu KPI thật.
  2. Vào Quản lý khách hàng $\rightarrow$ Tìm kiếm "Nguyễn Văn An" $\rightarrow$ Hiển thị tức thì.
  3. Thêm mới khách hàng với validate SĐT $\rightarrow$ Lưu thành công vào PostgreSQL.
  4. Mở Danh mục sảnh tiệc $\rightarrow$ Lọc sảnh theo sức chứa.
  5. Mở Tool tính giá tiệc $\rightarrow$ Tính toán tự động đầy đủ VAT, Phí phục vụ, Cọc 30%.
  6. Mở Swagger UI (`/swagger-ui/index.html`) và DBeaver CSDL 13 bảng.
  Kỳ vọng: Toàn bộ quá trình mượt mà, **Zero Crash 100%**.

- [ ] **Step 4: Cập nhật Báo cáo nghiệm thu & Change Log**
  Đánh dấu đóng các issue #205, #206, #207, #208 trên GitHub và cập nhật file `change-log.md`.
