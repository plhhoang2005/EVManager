# Báo cáo kết quả kiểm thử phân hệ Xác thực & Phân quyền (Auth & RBAC Test Run)

## 1. Thông tin đợt thực thi (Test Run Summary)

| Thuộc tính | Nội dung |
|---|---|
| Dự án | LV34-001 — EVManager |
| Phân hệ kiểm thử | Auth & RBAC (Xác thực & Phân quyền người dùng) |
| Người thực hiện | Hậu — QA / Tester |
| Ngày thực thi | 26/09/2026 |
| Môi trường | Local / Staging (PostgreSQL 16 + Spring Boot Auth Service) |
| Tổng số Test Cases | 4 |
| Đạt (PASS) | **4 (100%)** |
| Thất bại (FAIL) | **0 (0%)** |
| Trạng thái đợt test | **PASSED — Đạt yêu cầu chất lượng** |

---

## 2. Bảng ghi nhận kết quả thực thi chi tiết (Test Execution Log)

| Test Case ID | Tên Kịch Bản / Mô Tả | Điểm Kiểm Tra (Checkpoints) | Kết Quả Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
|---|---|---|---|---|:---:|
| **TC-AUTH-01** | Đăng nhập thành công với tài khoản hợp lệ | - Username: `admin`<br>- Password: `Password@123`<br>- Status: `ACTIVE` | HTTP 200 OK,<br>Trả về JWT Token,<br>Payload chứa claims & roles. | HTTP 200 OK,<br>Trả về JWT Token hợp lệ,<br>Access Token sẵn sàng sử dụng. | **PASS** |
| **TC-AUTH-02** | Đăng nhập thất bại khi sai mật khẩu | - Username: `admin`<br>- Password: `WrongPass999` | HTTP 401 Unauthorized,<br>Báo lỗi credentials không hợp lệ. | HTTP 401 Unauthorized,<br>Message: *"Invalid username or password"*, Không cấp Token. | **PASS** |
| **TC-AUTH-03** | Đăng nhập bằng tài khoản bị khóa | - Username: `staff_locked`<br>- Password: `Password@123`<br>- Status: `LOCKED` | HTTP 403 Forbidden,<br>Báo lỗi tài khoản bị khóa. | HTTP 403 Forbidden,<br>Message: *"Account is locked. Please contact administrator"*. | **PASS** |
| **TC-RBAC-01** | Tài khoản Sales cố tình gọi API xóa sảnh tiệc (Admin only) | - User: `sales` (Role: `SALES`)<br>- Target API: `DELETE /api/v1/venues/1` | HTTP 403 Forbidden,<br>Chặn truy cập trái quyền hạn. | HTTP 403 Forbidden,<br>Message: *"Access Denied: Required role [ADMIN]"*. | **PASS** |

---

## 3. Nhật ký Log Yêu cầu & Phản hồi (API Request / Response Logs)

### 3.1. TC-AUTH-01: Đăng nhập thành công với tài khoản hợp lệ
- **Request**:
  ```http
  POST /api/v1/auth/login HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json

  {
    "username": "admin",
    "password": "Password@123"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "success": true,
    "statusCode": 200,
    "message": "Authentication successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTcyNzM5MjAwMH0...",
      "tokenType": "Bearer",
      "user": {
        "userId": 1,
        "username": "admin",
        "fullName": "Nguyễn Quản Trị",
        "role": "ADMIN"
      }
    }
  }
  ```

---

### 3.2. TC-AUTH-02: Đăng nhập thất bại khi sai mật khẩu
- **Request**:
  ```http
  POST /api/v1/auth/login HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json

  {
    "username": "admin",
    "password": "WrongPass999"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 401 Unauthorized
  Content-Type: application/json

  {
    "success": false,
    "statusCode": 401,
    "errorCode": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "timestamp": "2026-09-26T21:03:00Z"
  }
  ```

---

### 3.3. TC-AUTH-03: Đăng nhập bằng tài khoản bị khóa
- **Request**:
  ```http
  POST /api/v1/auth/login HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json

  {
    "username": "staff_locked",
    "password": "Password@123"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 403 Forbidden
  Content-Type: application/json

  {
    "success": false,
    "statusCode": 403,
    "errorCode": "AUTH_ACCOUNT_LOCKED",
    "message": "Account is locked. Please contact administrator",
    "timestamp": "2026-09-26T21:03:05Z"
  }
  ```

---

### 3.4. TC-RBAC-01: Tài khoản Sales gọi API xóa sảnh tiệc (Admin only)
- **Request**:
  ```http
  DELETE /api/v1/venues/1 HTTP/1.1
  Host: localhost:8080
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9... (Token của Sales User)
  ```
- **Response**:
  ```http
  HTTP/1.1 403 Forbidden
  Content-Type: application/json

  {
    "success": false,
    "statusCode": 403,
    "errorCode": "ACCESS_DENIED",
    "message": "Access Denied: Required role [ADMIN]",
    "timestamp": "2026-09-26T21:03:10Z"
  }
  ```

---

## 4. Ghi nhận Lỗi & An toàn Bảo mật (Defect & Vulnerability Log)

- **Số lỗi phát hiện (Defects Found)**: **0**
- **Đánh giá An toàn Bảo mật (Security Audit)**:
  - Phân hệ Auth xử lý chính xác các trường hợp đăng nhập sai và tài khoản bị khóa.
  - Cơ chế Spring Security & RBAC chặn đứng hoàn toàn các truy cập vượt quyền (Unauthorized Privilege Escalation).
  - Không phát hiện hiện tượng lọt Token hay lộ mật khẩu thô trong phản hồi API.
