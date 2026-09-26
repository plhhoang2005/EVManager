# Báo cáo kết quả kiểm thử phân hệ Quản lý Khách hàng (Customer Test Run)

## 1. Thông tin đợt thực thi (Test Run Summary)

| Thuộc tính | Nội dung |
|---|---|
| Dự án | LV34-001 — EVManager |
| Phân hệ kiểm thử | Customer Management (Quản lý hồ sơ khách hàng) |
| Người thực hiện | Hậu — QA / Tester |
| Người nhận bàn giao | Nhân — Frontend Lead |
| Ngày thực thi | 26/09/2026 |
| Môi trường | Dev / Staging (PostgreSQL 16 + Customer REST Service) |
| Tổng số Test Cases | 4 |
| Đạt (PASS) | **4 (100%)** |
| Thất bại (FAIL) | **0 (0%)** |
| Trạng thái đợt test | **PASSED — Đạt yêu cầu chất lượng** |

---

## 2. Bảng ghi nhận kết quả thực thi chi tiết (Test Execution Log)

| Test Case ID | Tên Kịch Bản / Mô Tả | Điểm Kiểm Tra (Checkpoints) | Kết Quả Kỳ Vọng | Kết Quả Thực Tế | Trạng Thái |
|---|---|---|---|---|:---:|
| **TC-CUST-01** | Thêm khách hàng mới với đầy đủ thông tin hợp lệ | - Name: `Nguyễn Văn An`<br>- SĐT: `0988123456`<br>- Email: `an.nguyen@gmail.com` | HTTP 201 Created,<br>Trả về `customer_id` mới tạo,<br>Lưu CSDL thành công. | HTTP 201 Created,<br>`customer_id: 101`,<br>Tạo bản ghi khách hàng chuẩn. | **PASS** |
| **TC-CUST-02** | Thêm khách hàng với số điện thoại đã tồn tại | - SĐT đã có: `0988123456`<br>- Nhập trùng SĐT cho khách khác | HTTP 409 Conflict,<br>Báo lỗi số điện thoại đã tồn tại trong hệ thống. | HTTP 409 Conflict,<br>Message: *"Phone number '0988123456' is already registered"*. | **PASS** |
| **TC-CUST-03** | Nhập số điện thoại sai định dạng (chữ cái, < 10 số) | - SĐT sai: `0912ABC34` (chứa chữ & thiếu số) | HTTP 400 Bad Request,<br>Báo lỗi validation định dạng SĐT. | HTTP 400 Bad Request,<br>Message: *"Phone number must contain exactly 10 digits"*. | **PASS** |
| **TC-CUST-04** | Tìm kiếm khách hàng theo 4 số cuối SĐT | - Keyword: `3456`<br>- API: `GET /api/v1/customers?phone=3456` | HTTP 200 OK,<br>Trả về danh sách chứa khách hàng có SĐT kết thúc bằng `3456`. | HTTP 200 OK,<br>Trả về đúng bản ghi `Nguyễn Văn An` (`0988123456`). | **PASS** |

---

## 3. Nhật ký Log Yêu cầu & Phản hồi (API Request / Response Logs)

### 3.1. TC-CUST-01: Thêm khách hàng mới thành công (HTTP 201)
- **Request**:
  ```http
  POST /api/v1/customers HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

  {
    "fullName": "Nguyễn Văn An",
    "phone": "0988123456",
    "email": "an.nguyen@gmail.com",
    "address": "123 Nguyễn Huệ, Q1, TP.HCM"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 201 Created
  Content-Type: application/json

  {
    "success": true,
    "statusCode": 201,
    "message": "Customer created successfully",
    "data": {
      "customerId": 101,
      "fullName": "Nguyễn Văn An",
      "phone": "0988123456",
      "email": "an.nguyen@gmail.com",
      "address": "123 Nguyễn Huệ, Q1, TP.HCM",
      "createdAt": "2026-09-26T21:10:00Z"
    }
  }
  ```

---

### 3.2. TC-CUST-02: Thêm khách hàng trùng số điện thoại (HTTP 409)
- **Request**:
  ```http
  POST /api/v1/customers HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

  {
    "fullName": "Trần Văn Bình",
    "phone": "0988123456",
    "email": "binh.tran@gmail.com"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 409 Conflict
  Content-Type: application/json

  {
    "success": false,
    "statusCode": 409,
    "errorCode": "CUSTOMER_PHONE_DUPLICATE",
    "message": "Phone number '0988123456' is already registered in the system",
    "timestamp": "2026-09-26T21:10:05Z"
  }
  ```

---

### 3.3. TC-CUST-03: Nhập số điện thoại sai định dạng (HTTP 400)
- **Request**:
  ```http
  POST /api/v1/customers HTTP/1.1
  Host: localhost:8080
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

  {
    "fullName": "Phạm Minh Cường",
    "phone": "0912ABC34",
    "email": "cuong.pham@gmail.com"
  }
  ```
- **Response**:
  ```http
  HTTP/1.1 400 Bad Request
  Content-Type: application/json

  {
    "success": false,
    "statusCode": 400,
    "errorCode": "VALIDATION_FAILED",
    "message": "Validation failed for field 'phone'",
    "errors": [
      {
        "field": "phone",
        "rejectedValue": "0912ABC34",
        "message": "Phone number must contain exactly 10 digits"
      }
    ]
  }
  ```

---

### 3.4. TC-CUST-04: Tìm kiếm khách hàng theo 4 số cuối SĐT (HTTP 200)
- **Request**:
  ```http
  GET /api/v1/customers?phone=3456 HTTP/1.1
  Host: localhost:8080
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
  ```
- **Response**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "success": true,
    "statusCode": 200,
    "data": {
      "content": [
        {
          "customerId": 101,
          "fullName": "Nguyễn Văn An",
          "phone": "0988123456",
          "email": "an.nguyen@gmail.com",
          "address": "123 Nguyễn Huệ, Q1, TP.HCM"
        }
      ],
      "totalElements": 1,
      "totalPages": 1
    }
  }
  ```

---

## 4. Đánh giá tính tiện dụng của giao diện Form Khách hàng (UX/Usability Review)

Qua quá trình thực thi kiểm thử giao diện Form Khách hàng, Tester ghi nhận các ưu điểm và điểm hạn chế về trải nghiệm người dùng (UX):

- **Ưu điểm**:
  - Giao diện thiết kế gọn gàng, chia khu vực rõ ràng giữa Thông tin cá nhân và Thông tin liên hệ.
  - Tốc độ tải và mở Modal/Form nhanh.
- **Điểm hạn chế**:
  - Ô nhập Số điện thoại chưa tự động lọc khoảng trắng hoặc dấu gạch ngang (`-`) khi người dùng copy/paste.
  - Thông báo lỗi khi nhập trùng SĐT hiện tại chỉ xuất hiện sau khi bấm nút "Lưu" (chưa có cảnh báo real-time khi gõ xong SĐT).
  - Chưa tự động `focus` vào ô Họ và tên khi vừa mở Modal Thêm mới.

---

## 5. Danh sách Góp ý Cải tiến Form bàn giao cho Frontend (Nhân)

Kính gửi bạn **Nhân (Frontend Lead)**, để nâng cao trải nghiệm người dùng cho nhân viên Sales khi thao tác nhập liệu khách hàng, đội QA đề xuất các góp ý cải tiến sau:

1. **Auto-formatting & Masking SĐT**:
   - Thêm Input Mask cho ô Số điện thoại (tự động định dạng kiểu `0988 123 456` khi gõ).
   - Tự động xóa khoảng trắng, dấu vết và chuẩn hóa mã quốc gia `+84` thành `0` khi user dán (paste) SĐT vào form.
2. **Real-time Inline Validation**:
   - Bổ sung kiểm tra định dạng SĐT (10 chữ số) ngay khi user gõ xong và rời khỏi ô (`onBlur`), hiển thị dòng chữ đỏ nhỏ ngay dưới ô input thay vì chờ submit form.
3. **Cảnh báo Trùng SĐT sớm (Debounce Search)**:
   - Khi user gõ đủ 10 số điện thoại, trigger nhẹ một API check trùng (`GET /api/v1/customers/check-phone?phone=...`). Nếu SĐT đã có trong hệ thống, hiển thị Banner gợi ý: *"Khách hàng Nguyễn Văn An (0988123456) đã tồn tại. Bấm vào đây để xem hồ sơ."* nhằm tránh tạo trùng hồ sơ.
4. **Auto-focus**:
   - Thêm thuộc tính `autoFocus` cho trường `fullName` để khi mở Modal/Drawer Thêm mới khách hàng, con trỏ chuột tự động nằm sẵn ở ô Họ tên.
