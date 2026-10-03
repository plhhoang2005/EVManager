# Test Suite: Conflict Checker (Kiểm tra trùng lịch sảnh)

## Mục tiêu
Kiểm thử tính năng Conflict Checker (`ConflictCheckerService`) đảm bảo hệ thống chặn các ca đặt tiệc trùng giờ, cùng sảnh hoặc vi phạm thời gian đệm (Buffer Time = 60 phút).

## Cấu hình môi trường (Postman)
- **Base URL**: `http://localhost:8080/api/v1`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <token>` (Tài khoản User / Admin tùy theo phân quyền)

---

## Các kịch bản kiểm thử (Test Cases)

### TC-CONF-01: Đặt 2 tiệc cùng sảnh, cùng ngày, cùng ca Tối
- **Mục tiêu**: Bắt buộc phải chặn tiệc thứ 2 và báo lỗi 409 (Conflict).
- **Điều kiện tiền đề**: Sảnh Vàng (Venue ID: 1) đã có 1 sự kiện `Event A` được đặt từ `2026-10-15T18:00:00+07:00` đến `2026-10-15T22:00:00+07:00`.
- **Bước thực hiện**:
  1. Gửi request `POST /api/v1/events` (hoặc API tạo sự kiện tương ứng).
  2. Truyền tham số:
     ```json
     {
       "venueId": 1,
       "eventName": "Event B",
       "startAt": "2026-10-15T19:00:00+07:00",
       "endAt": "2026-10-15T21:00:00+07:00"
     }
     ```
- **Kết quả mong đợi**: HTTP Status `409 Conflict`. Thông báo lỗi chỉ ra sảnh Vàng đã bị trùng lịch trong khung giờ này.

---

### TC-CONF-02: Đặt 2 tiệc cùng ngày nhưng khác sảnh
- **Mục tiêu**: Cho phép tạo bình thường.
- **Điều kiện tiền đề**: Sảnh Vàng (Venue ID: 1) đã có 1 sự kiện từ `2026-10-15T18:00:00+07:00` đến `2026-10-15T22:00:00+07:00`.
- **Bước thực hiện**:
  1. Gửi request `POST /api/v1/events`.
  2. Truyền tham số cho Sảnh Bạc (Venue ID: 2):
     ```json
     {
       "venueId": 2,
       "eventName": "Event C",
       "startAt": "2026-10-15T18:00:00+07:00",
       "endAt": "2026-10-15T22:00:00+07:00"
     }
     ```
- **Kết quả mong đợi**: HTTP Status `201 Created`. Hệ thống cho phép vì khác sảnh.

---

### TC-CONF-03: Đặt 2 tiệc cùng sảnh nhưng khác ca (đủ thời gian đệm)
- **Mục tiêu**: Cho phép vì có 5 tiếng đệm (> 60 phút).
- **Điều kiện tiền đề**: Sảnh Vàng đã có sự kiện từ `2026-10-15T11:00:00+07:00` đến `2026-10-15T13:00:00+07:00`.
- **Bước thực hiện**:
  1. Gửi request `POST /api/v1/events`.
  2. Truyền tham số:
     ```json
     {
       "venueId": 1,
       "eventName": "Event D",
       "startAt": "2026-10-15T18:00:00+07:00",
       "endAt": "2026-10-15T22:00:00+07:00"
     }
     ```
- **Kết quả mong đợi**: HTTP Status `201 Created`. Do 18h - 13h = 5 tiếng > 60 phút dọn dẹp.

---

### TC-CONF-04: Đặt tiệc lệch giờ chỉ cách nhau 30 phút (< 60 phút dọn sảnh)
- **Mục tiêu**: Hệ thống phải chặn vì vi phạm thời gian đệm.
- **Điều kiện tiền đề**: Sảnh Vàng đã có sự kiện từ `2026-10-15T11:00:00+07:00` đến `2026-10-15T14:00:00+07:00`.
- **Bước thực hiện**:
  1. Gửi request `POST /api/v1/events`.
  2. Truyền tham số:
     ```json
     {
       "venueId": 1,
       "eventName": "Event E",
       "startAt": "2026-10-15T14:30:00+07:00",
       "endAt": "2026-10-15T17:00:00+07:00"
     }
     ```
- **Kết quả mong đợi**: HTTP Status `409 Conflict`. Thông báo lỗi thời gian đệm tối thiểu 60 phút.

---

### TC-CONF-05: Tiệc đã bị hủy (CANCELLED)
- **Mục tiêu**: Cho phép khách hàng khác đặt lại sảnh đó vào cùng khung giờ.
- **Điều kiện tiền đề**: Sảnh Vàng có sự kiện từ `2026-10-16T18:00:00+07:00` đến `2026-10-16T22:00:00+07:00` nhưng trạng thái là `CANCELLED`.
- **Bước thực hiện**:
  1. Gửi request `POST /api/v1/events`.
  2. Truyền tham số:
     ```json
     {
       "venueId": 1,
       "eventName": "Event F",
       "startAt": "2026-10-16T18:00:00+07:00",
       "endAt": "2026-10-16T22:00:00+07:00"
     }
     ```
- **Kết quả mong đợi**: HTTP Status `201 Created`. Sự kiện bị hủy không chiếm dụng thời gian của sảnh.

---
## Ghi nhận kết quả (Test Execution Result)
*(Phần này sẽ được điền sau khi chạy Postman thực tế)*
- Môi trường test: Local (H2 In-memory Database)
- Thời gian chạy: (Vừa xong)
- Người thực hiện: AI & User (Qua Postman)

| Test Case | Kết quả (Pass/Fail) | Response Body trả về | Ghi chú |
| --- | --- | --- | --- |
| TC-CONF-01 | Pass | HTTP 409 Conflict | Hệ thống đã chặn thành công do trùng lịch sảnh Vàng. |
| TC-CONF-02 | Pass | HTTP 201 Created | Cho phép do khác sảnh. |
| TC-CONF-03 | Pass | HTTP 201 Created | Cho phép do cách nhau 5 tiếng (> 60 phút dọn dẹp). |
| TC-CONF-04 | Pass | HTTP 409 Conflict | Hệ thống chặn thành công do vi phạm thời gian đệm 60 phút. |
| TC-CONF-05 | Pass | HTTP 201 Created | Cho phép do sự kiện trước đó đã bị Hủy (CANCELLED). |
