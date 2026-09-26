# Role-Based Access Control (RBAC) Documentation

## 1. Tổng quan
Hệ thống EVManager sử dụng cơ chế **Role-Based Access Control (RBAC)** thông qua thư viện `Spring Security` để kiểm soát quyền truy cập của người dùng vào các API bảo mật. 
Quyền truy cập được quản lý dựa trên các **Vai trò (Roles)** mà người dùng sở hữu.

---

## 2. Danh sách Roles
Hệ thống hiện tại hỗ trợ các roles sau trong database (bảng `roles`):

| Role ID | Tên Role | Mô tả |
|---------|----------|-------|
| 1 | `ADMIN` | Quản trị viên hệ thống. Có toàn quyền quản lý. |
| 2 | `USER` | Người dùng mặc định của hệ thống. |

*(Spring Security sẽ tự động thêm prefix `ROLE_` khi xử lý, ví dụ: `ROLE_ADMIN`, `ROLE_USER`)*

---

## 3. Cách hoạt động với JWT
1. Khi user **đăng nhập** thành công, hệ thống mã hóa định danh user vào JWT Token.
2. Khi user gửi Request (có chứa header `Authorization: Bearer <token>`), hệ thống sẽ:
   - Validate token hợp lệ.
   - Trích xuất username từ JWT.
   - Load thông tin User từ Database (qua `CustomUserDetailsService`).
   - Gắn Role của User thành các `SimpleGrantedAuthority` (VD: `ROLE_ADMIN`) vào `SecurityContext`.

---

## 4. Cách bảo vệ API bằng Role
Phía Backend sử dụng Annotation `@PreAuthorize` để phân quyền trực tiếp tại Controller.

### a. Chỉ định 1 Role cụ thể
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<String> createVenue() { ... }
```
Chỉ user có role `ADMIN` mới được gọi API này.

### b. Chỉ định nhiều Roles
```java
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@GetMapping
public ResponseEntity<List<String>> getVenues() { ... }
```
Bất kỳ user nào có role `ADMIN` hoặc `USER` đều được gọi.

---

## 5. Xử lý lỗi (Error Handling)

Khi Frontend hoặc Client gọi API nhưng không cung cấp JWT hoặc không đủ quyền, Backend sẽ trả về Response chuẩn như sau:

### a. 401 Unauthorized (Chưa xác thực, Token sai/hết hạn)
```json
{
  "timestamp": "2026-09-26T06:01:22.000",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/v1/venues",
  "fieldErrors": null
}
```
**Hướng xử lý cho Frontend:** Xóa token hiện tại và điều hướng user về trang Đăng nhập.

### b. 403 Forbidden (Đã xác thực nhưng không đủ quyền)
```json
{
  "timestamp": "2026-09-26T06:01:52.606",
  "status": 403,
  "error": "Forbidden",
  "message": "You do not have permission to access this resource",
  "path": "/api/v1/venues",
  "fieldErrors": null
}
```
**Hướng xử lý cho Frontend:** Hiển thị thông báo "Bạn không có quyền thao tác" hoặc điều hướng về trang 403 / Trang chủ.

---

## 6. Hướng dẫn Test bằng Postman
1. **Bước 1:** Gọi API `/api/v1/auth/login` với body:
   ```json
   {
       "usernameOrEmail": "admin",
       "password": "Password1!"
   }
   ```
2. **Bước 2:** Copy giá trị `accessToken` trong Response.
3. **Bước 3:** Gọi API bảo vệ (VD: `POST /api/v1/venues`) và cấu hình:
   - Tab **Authorization** -> Chọn Type là **Bearer Token**.
   - Dán token vừa copy vào ô **Token**.
4. Gửi Request và kiểm tra kết quả (200 OK hoặc 403 Forbidden).
