# Kế hoạch kiểm thử (Test Plan) — EVManager

## 1. Thông tin tổng quan

| Thuộc tính | Nội dung |
|---|---|
| Dự án | LV34-001 — Hệ thống quản lý tổng thể cho dịch vụ sự kiện (EVManager) |
| Người lập | Hậu — Database + QA/Tester |
| Phụ trách chung | Hoàng (Project Manager), Phúc (Backend Lead), Nhân (Frontend Lead) |
| Phạm vi áp dụng | Kiểm thử toàn bộ các thành phần Backend, Frontend, Database và tích hợp |
| Tài liệu đối chiếu | SRS v1, Use Cases (UC01–UC12), Architecture Spec, ERD & Data Dictionary |

---

## 2. Mục tiêu chất lượng (Quality Goals)

Để đảm bảo hệ thống EVManager vận hành ổn định, chính xác và sẵn sàng cho các đợt Demo cũng như Nghiệm thu dự án, kế hoạch kiểm thử đề ra các mục tiêu chất lượng định lượng như sau:

1. **100% Chức năng Must-have Pass**: Toàn bộ các Use Case / Chức năng thuộc nhóm ưu tiên cao nhất (Must-have) như Đăng nhập/Phân quyền (UC01, UC02), Quản lý Lịch sự kiện & Kiểm tra xung đột sảnh (UC06, UC07), Tạo Hợp đồng & Thanh toán Đặt cọc (UC08, UC09) phải đạt kết quả **PASS 100%**.
2. **Tỷ lệ Pass tổng thể ≥ 90%**: Tất cả các kịch bản kiểm thử (Test Cases) trên toàn bộ hệ thống phải đạt tỷ lệ Pass chung tối thiểu từ **90% trở lên** trước khi nghiệm thu.
3. **Không còn lỗi nghiêm trọng (Zero Critical/Blocker Bugs)**: Khi kết thúc đợt kiểm thử cuối cùng, hệ thống phải **tuyệt đối không còn tồn tại bất kỳ lỗi nghiêm trọng nào** (Mức độ Severity: Blocker hoặc Critical như mất dữ liệu, sai sót tính toán tiền bạc, crash server, lọt lỗ hổng bảo mật).

---

## 3. Phạm vi kiểm thử (Testing Scope)

Kế hoạch kiểm thử bao phủ 4 cấp độ và phương pháp kiểm thử cốt lõi:

### 3.1. Kiểm thử đơn vị (Unit Test)
- **Mục tiêu**: Kiểm tra tính đúng đắn của từng hàm, phương thức độc lập trong tầng Business Service và Utility.
- **Công cụ**: JUnit 5, Mockito, AssertJ (Java 21 / Spring Boot).
- **Trọng tâm**: 
  - Validate tính hợp lệ của dữ liệu đầu vào (Jakarta Bean Validation).
  - Kiểm tra thuật toán tính toán giá trị hợp đồng, tính chiết khấu/đơn giá dịch vụ.
  - Kiểm tra logic kiểm tra xung đột thời gian tổ chức sự kiện (Overlap checking).

### 3.2. Kiểm thử chức năng (Functional Test)
- **Mục tiêu**: Đảm bảo từng tính năng xử lý đúng theo Acceptance Criteria và quy trình nghiệp vụ đã mô tả trong SRS.
- **Phương pháp**: Black-box Testing dựa trên Use Case và Test Cases.
- **Trọng tâm**:
  - Luồng Quản lý người dùng, Đăng nhập JWT, Phân quyền RBAC (ADMIN, MANAGER, SALES, ACCOUNTANT).
  - Luồng CRUD danh mục: Customers, Venues, Menus, Dishes, Services.
  - Luồng xử lý nghiệp vụ: Đặt lịch sự kiện, Lập hợp đồng, Ghi nhận thanh toán.

### 3.3. Kiểm thử tích hợp (Integration Test)
- **Mục tiêu**: Kiểm tra sự tương tác và đồng bộ dữ liệu giữa các tầng trong ứng dụng (Controller ↔ Service ↔ Repository ↔ PostgreSQL Database).
- **Công cụ**: `@SpringBootTest`, `Testcontainers` (PostgreSQL), MockMvc, RestAssured.
- **Trọng tâm**:
  - Kiểm tra tính nguyên tử (Atomicity) của giao dịch `@Transactional` (ví dụ: Tạo Hợp đồng đồng thời chốt dịch vụ `ContractServices`).
  - Kiểm tra ràng buộc toàn vẹn tham chiếu (FK, Constraints, Check) trên CSDL thực tế.
  - Kiểm tra việc ghi nhận vết thao tác tự động vào `AuditLogs`.

### 3.4. Kiểm thử giao diện & Trải nghiệm người dùng (UI / E2E Test)
- **Mục tiêu**: Đảm bảo giao diện người dùng hiển thị đúng thiết kế, phản hồi mượt mà, chính xác và thân thiện trên các trình duyệt chính.
- **Công cụ**: Playwright / Selenium / Browser Automation & Kiểm thử UAT thủ công.
- **Trọng tâm**:
  - Kiểm thử biểu mẫu (Form validation, thông báo lỗi tiếng Việt).
  - Kiểm thử điều hướng, menu, phân quyền hiển thị theo Role trên giao diện.
  - Kiểm thử Responsive layout, hiển thị danh sách dạng bảng, phân trang (Pagination).

---

## 4. Môi trường kiểm thử, Dữ liệu Test & Quản lý lỗi

### 4.1. Môi trường kiểm thử (Test Environment)
- **Môi trường Dev Local**:
  - Backend: Java 21 LTS, Spring Boot 3.x (Chạy cổng `8080`).
  - Database: PostgreSQL 16 local Docker / Native (Database: `evmanager_test`).
  - Frontend: Vite / Next.js (Chạy cổng `3000`).
- **Môi trường CI/CD Staging**:
  - GitHub Actions tự động chạy `mvn test` trên mỗi Pull Request vào nhánh `develop` và `main`.

### 4.2. Dữ liệu kiểm thử (Test Data)
- **Cơ chế khởi tạo**: Sử dụng Flyway test migration (`V999__seed_test_data.sql`) để nạp dữ liệu mẫu trước mỗi lượt test.
- **Tập dữ liệu chuẩn hóa bao gồm**:
  - 5 vai trò hệ thống (`Roles`: ADMIN, MANAGER, SALES, COORDINATOR, ACCOUNTANT).
  - 10 tài khoản người dùng mẫu (`Users`) với mật khẩu băm chuẩn Test.
  - Danh mục mẫu: 5 sảnh (`Venues`), 20 món ăn (`Dishes`), 5 thực đơn (`Menus`), 10 dịch vụ (`Services`).
  - Dữ liệu giao dịch mẫu: Khách hàng mẫu, Sự kiện mẫu có và không xung đột lịch, Hợp đồng mẫu và Lịch sử thanh toán.

### 4.3. Quy trình & Công cụ quản lý lỗi (Defect Management via GitHub Issues)
- **Công cụ quản lý**: GitHub Issues thuộc Repository `plhhoang2005/EVManager`.
- **Phân loại mức độ nghiêm trọng (Severity)**:
  - 🔴 `severity:blocker` / `critical`: Lỗi làm sập hệ thống, mất dữ liệu, tính sai tiền, không thể tiếp tục test. (Phải fix ngay trong 24h).
  - 🟠 `severity:major`: Lỗi chức năng chính không hoạt động đúng yêu cầu nhưng có cách tạm thời để bypass.
  - 🟡 `severity:minor`: Lỗi giao diện nhỏ, câu chữ thông báo chưa chuẩn, không ảnh hưởng logic.
- **Quy trình xử lý lỗi**: 
  `New Issue (Reported)` ➔ `Assigned (Developer)` ➔ `In Progress / Fix Committed` ➔ `Re-test (QA)` ➔ `Closed`.

---

## 5. Lịch trình kiểm thử theo cột mốc dự án (Test Schedule)

Lịch trình kiểm thử được chia thành **3 Đợt chính** gắn liền với các cột mốc dự án (Milestones):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      LỊCH TRÌNH KIỂM THỬ 3 ĐỢT                          │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ ĐỢT 1: Tuần 3     │ ĐỢT 2: Tuần 5     │ ĐỢT 3: Tuần 6-7                 │
│ (Demo Increment 1)│ (Demo Giữa kỳ 50%)│ (Feature Complete & UAT)        │
│ Auth & Master CRUD│ Events & Payments │ Full System & Regression        │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

| Đợt kiểm thử | Thời gian / Cột mốc | Phạm vi kiểm thử chi tiết | Tiêu chí hoàn thành (Exit Criteria) |
|---|---|---|---|
| **Đợt 1** | **Tuần 3**<br>*(Demo Increment 1)* | - Unit Test & Integration Test cho Auth (JWT, Login/Logout).<br>- Functional Test các chức năng Master CRUD: Roles, Users, Customers, Venues, Menus, Dishes, Services.<br>- Test validation đầu vào các API danh mục. | - 100% Unit Test phần Auth & Master CRUD PASS.<br>- 0 lỗi Blocker/Critical.<br>- Đạt tiêu chí Demo Increment 1. |
| **Đợt 2** | **Tuần 5**<br>*(Demo Giữa kỳ 50%)* | - Integration Test nghiệp vụ Đặt lịch sự kiện & Thuật toán kiểm tra xung đột sảnh (`Events`).<br>- Functional Test quy trình Lập Hợp đồng (`Contracts`) & Đặt cọc (`Payments`).<br>- Test ràng buộc giá thỏa thuận (Price Snapshot) & tính toán công nợ. | - Pass 100% test case xung đột lịch & tính tiền hợp đồng.<br>- Pass ≥ 85% tổng số test case Đợt 2.<br>- Đạt điều kiện Demo Giữa kỳ 50%. |
| **Đợt 3** | **Tuần 6–7**<br>*(Feature Complete & UAT)* | - Kiểm thử toàn bộ hệ thống (End-to-End System Testing).<br>- Kiểm thử giao diện UI / Responsive trên nhiều trình duyệt.<br>- Kiểm thử Hồi quy (Regression Testing) sau khi fix bug.<br>- Phối hợp với BA (Hiển) tổ chức Kiểm thử chấp nhận người dùng (UAT). | - **100% Must-have Pass**.<br>- **Pass tổng thể ≥ 90%**.<br>- **0 lỗi Blocker / Critical**.<br>- Xuất Báo cáo nghiệm thu chất lượng (Final Test Report). |

---

## 6. Tiêu chí Nghiệm thu Kiểm thử (Test Acceptance Criteria)

Kế hoạch kiểm thử được đánh giá là hoàn thành xuất sắc khi đáp ứng đủ các tiêu chí sau:

1. Tất cả 3 Đợt kiểm thử được thực hiện đúng lịch trình.
2. Mọi lỗi phát sinh đều được ghi nhận, phân loại và theo dõi minh bạch trên **GitHub Issues**.
3. Tổng kết đợt 3 đạt **100% Must-have Pass**, **≥ 90% Pass overall**, và **0 lỗi Blocker/Critical**.
4. Báo cáo tổng kết kiểm thử (Final Test Report) được phê duyệt bởi Project Manager và Giảng viên hướng dẫn.
