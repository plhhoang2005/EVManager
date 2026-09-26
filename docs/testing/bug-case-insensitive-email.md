# Báo cáo Lỗi (Bug Report) & Kịch bản Re-test: Email Đăng nhập phân biệt chữ hoa chữ thường

## 1. Thông tin GitHub Issue Ticket

| Thuộc tính | Nội dung |
|---|---|
| **Issue Title** | `[BUG] Email đăng nhập bị phân biệt chữ hoa chữ thường (Case-sensitive Login Failure)` |
| **Issue ID** | `#BUG-104` |
| **Labels** | `type: bug`, `severity: medium`, `component: auth`, `backend` |
| **Assignee** | **Phúc (Backend Lead)** |
| **Reporter** | **Hậu (QA / Tester)** |
| **Mức độ nghiêm trọng** | **Medium** *(Gây bất tiện lớn cho người dùng thiết bị di động do tính năng tự động viết hoa chữ cái đầu của bàn phím)* |
| **Trạng thái Issue** | **RE_TESTED_PASS & CLOSED** |

---

## 2. Mô tả chi tiết & Các bước tái hiện lỗi (Steps to Reproduce)

### 2.1. Mô tả sự cố
Khi người dùng đăng nhập bằng Email, nếu nhập ký tự hoa (ví dụ: `Admin@gmail.com` hoặc `ADMIN@GMAIL.COM`) thay vì viết thường hoàn toàn (`admin@gmail.com`), hệ thống từ chối đăng nhập và trả về lỗi `HTTP 401 Unauthorized` với thông báo *"Invalid username or password"*.

### 2.2. Các bước tái hiện lỗi (Steps to Reproduce)
1. Mở màn hình Đăng nhập (`/login`).
2. Nhập Email vào ô tài khoản: `Admin@gmail.com` *(chữ A viết hoa)*.
3. Nhập đúng mật khẩu: `Password@123`.
4. Bấm nút **Đăng nhập**.

### 2.3. Kết quả thực tế (Actual Behavior)
- Hệ thống từ chối đăng nhập.
- Phản hồi API: `HTTP 401 Unauthorized`.
- Thông báo lỗi: *"Tên đăng nhập hoặc mật khẩu không chính xác"*.

### 2.4. Kết quả kỳ vọng (Expected Behavior)
- Hệ thống không phân biệt chữ hoa/thường đối với Email đăng nhập.
- Đăng nhập thành công và cấp JWT Access Token như khi nhập `admin@gmail.com`.

---

## 3. Phân tích Nguyên nhân Gốc (Root Cause Analysis)

- **Nguyên nhân**: Tầng Backend Service khi đối chiếu Email đăng nhập đang sử dụng phép so sánh chuỗi chính xác (Case-sensitive exact match) giữa dữ liệu gửi lên từ Request DTO và trường `email` trong CSDL PostgreSQL.
- **Hệ quả**: Bàn phím trên các thiết bị di động (iOS/Android) thường tự động bật viết hoa chữ cái đầu tiên (ví dụ `Admin@...`), dẫn đến tỷ lệ người dùng đăng nhập thất bại cao mặc dù nhập đúng mật khẩu.

---

## 4. Hướng dẫn sửa lỗi cho Backend (Fix Instructions for Phúc)

Gửi bạn **Phúc (Backend Lead)**, giải pháp khắc phục đề xuất ở 2 tầng:

1. **Chuẩn hóa tại DTO / Service Layer (Recommended)**:
   - Trước khi truy vấn CSDL, thực hiện chuẩn hóa chuỗi Email đầu vào:
     ```java
     String normalizedEmail = loginRequest.getEmail().trim().toLowerCase();
     ```
2. **Chuẩn hóa tại Database Query Layer**:
   - Sử dụng hàm `LOWER()` trong Spring Data JPA Query hoặc PostgreSQL:
     ```java
     @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
     Optional<User> findByEmailIgnoreCase(@Param("email") String email);
     ```

---

## 5. Kịch bản Kiểm thử lại & Đóng Issue (Re-test Plan & Closure)

Sau khi **Phúc (Backend)** triển khai bản fix và deploy lên môi trường Dev/Staging, **Hậu (QA)** thực hiện re-test theo 4 kịch bản sau:

| Test Case | Dữ Liệu Test | Kết Quả Kỳ Vọng | Kết Quả Re-test | Trạng Thái |
|---|---|---|---|:---:|
| **TC-RE-01** | Email: `Admin@gmail.com` | HTTP 200 OK, Đăng nhập thành công | HTTP 200 OK | **PASS** |
| **TC-RE-02** | Email: `ADMIN@GMAIL.COM` | HTTP 200 OK, Đăng nhập thành công | HTTP 200 OK | **PASS** |
| **TC-RE-03** | Email: `aDmIn@GmAiL.cOm` | HTTP 200 OK, Đăng nhập thành công | HTTP 200 OK | **PASS** |
| **TC-RE-04** | Email: `admin@gmail.com ` *(có space cuối)* | HTTP 200 OK (tự trim space) | HTTP 200 OK | **PASS** |

---

## 6. Nhật ký Vòng đời Issue (Issue Lifecycle Status Log)

```text
[26/09/2026 21:20] OPEN         - Hậu (QA) phát hiện lỗi & tạo Issue #BUG-104 trên GitHub.
[26/09/2026 21:22] IN_PROGRESS  - Gán Issue cho Phúc (Backend). Phúc áp dụng toLowerCase() & LOWER query.
[26/09/2026 21:24] RE_TESTING   - Hậu (QA) thực thi 4 kịch bản Re-test trên Staging. Tất cả PASS.
[26/09/2026 21:25] CLOSED       - Hậu (QA) xác nhận lỗi đã được khắc phục hoàn toàn & ĐÓNG ISSUE #BUG-104.
```
