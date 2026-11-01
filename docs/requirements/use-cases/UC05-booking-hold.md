# UC-05: Đặt giữ chỗ sảnh và thiết lập khung giờ sự kiện

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-05 |
| **Tên Use Case** | Đặt giữ chỗ sảnh và thiết lập khung giờ sự kiện |
| **Actor chính** | Nhân viên Sales |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Hệ thống EVManager |
| **Mục tiêu** | Cho phép Sales tạm giữ sảnh cho khách hàng trong thời gian khách chưa quyết định thực đơn hoặc chưa hoàn tất đặt cọc, đồng thời quản lý thời gian hiệu lực của việc giữ chỗ. |
| **Trigger** | Khách hàng có nhu cầu giữ sảnh nhưng chưa hoàn tất quyết định đặt tiệc. |
| **Tiền điều kiện** | Sales đã đăng nhập; thông tin khách hàng đã tồn tại; sảnh và thời gian sự kiện đã được xác định; sảnh chưa có lịch xung đột. |
| **Hậu điều kiện thành công** | Sảnh được chuyển sang trạng thái Đang giữ (HOLD) và có thời hạn hiệu lực cụ thể. |
| **Hậu điều kiện thất bại** | Sảnh không được giữ hoặc được tự động giải phóng nếu hết thời hạn mà khách hàng không xác nhận. |

---

## 2. Trạng thái sảnh & Thời hạn Hold

### 2.1. Quản lý trạng thái sảnh

| Trạng thái | Ý nghĩa |
| :--- | :--- |
| **TRỐNG** | Sảnh chưa có lịch giữ hoặc đặt. |
| **HOLD** | Sảnh đang được tạm giữ cho một khách hàng trong thời gian quy định (tối đa 48h). |
| **ĐÃ ĐẶT** | Sảnh đã được xác nhận đặt chính thức (sau khi cọc đợt 1). |
| **ĐÃ HỦY** | Lịch đặt/giữ đã bị hủy. |

### 2.2. Quy định thời hạn giữ sảnh (48h)
- **Thời gian giữ sảnh mặc định:** **48 giờ** kể từ thời điểm hệ thống tạo HOLD thành công.
  * *Ví dụ:* Tạo HOLD lúc 10:00 ngày 25/09/2026 $\rightarrow$ Hết hạn lúc 10:00 ngày 27/09/2026.
- **Khi hết 48 giờ** mà chưa cọc: Trạng thái tự động đổi `HOLD` $\rightarrow$ `TRỐNG` để phục vụ các yêu cầu khác.

---

## 3. Luồng chính – Basic Flow

- **B1:** Sales tiếp nhận nhu cầu từ Khách hàng và tra cứu sảnh trống (UC-04).
- **B2:** Khách hàng chọn sảnh cần giữ nhưng chưa chốt Menu/Dịch vụ.
- **B3:** Sales chọn chức năng **Giữ sảnh (HOLD)** trên EVManager.
- **B4:** Hệ thống hiển thị form yêu cầu HOLD (Khách hàng, Sảnh, Ngày tổ chức, Ca tiệc, Số bàn dự kiến, Thời điểm bắt đầu & Hết hạn HOLD 48h).
- **B5:** Sales xác nhận giữ sảnh.
- **B6:** Hệ thống re-check xung đột lịch. Nếu OK $\rightarrow$ tạo bản ghi HOLD.
- **B7:** Trạng thái sảnh chuyển `TRỐNG` $\rightarrow$ `HOLD`. Hệ thống báo: *"Giữ sảnh thành công. Thời hạn giữ sảnh là 48 giờ."*
- **B8:** Hệ thống tự động gửi Email/SMS thông báo giữ sảnh & hạn 48h cho Khách hàng.

---

## 4. Luồng phụ – Alternative Flow

- **A1. Khách hàng xác nhận trước khi hết hạn:** Khách đồng ý đặt tiệc & cọc $\rightarrow$ Sales thực hiện lập báo giá & hợp đồng (Quy trình 2) $\rightarrow$ Hệ thống chuyển `HOLD` $\rightarrow$ `ĐÃ ĐẶT` $\rightarrow$ Dừng đếm ngược nhả sảnh.
- **A2. Khách hàng chưa quyết định thực đơn:** Khách chưa chốt Menu $\rightarrow$ Sales vẫn tạo HOLD bình thường $\rightarrow$ Khách có 48h để tiếp tục lựa chọn Menu.
- **A3. Nhắc nhở trước khi hết hạn:** Hệ thống định kỳ quét các HOLD $\rightarrow$ Gửi thông báo nhắc Khách hàng và Sales phụ trách trước khi hết hạn 48h.
- **A4. Tự động nhả sảnh khi quá 48h:** Quá 48h chưa cọc $\rightarrow$ Hệ thống tự động chuyển `HOLD` $\rightarrow$ `TRỐNG` $\rightarrow$ Gửi thông báo hết hạn cho Khách & Sales $\rightarrow$ Giải phóng sảnh cho hệ thống.

---

## 5. Luồng ngoại lệ – Exception Flow

- **E1. Sảnh đã bị người khác giữ/đặt:** Check lại phát hiện không còn TRỐNG $\rightarrow$ Báo *"Không thể giữ sảnh. Sảnh đã được giữ hoặc đặt bởi một yêu cầu khác."*
- **E2. Phát hiện xung đột lịch:** Báo *"Không thể giữ sảnh do phát hiện xung đột lịch. Vui lòng chọn sảnh hoặc thời gian khác."*
- **E3. Lỗi gửi Email/SMS:** Hệ thống vẫn duy trì HOLD nhưng ghi nhận log lỗi gửi thông báo và cho phép gửi lại.

---

## 6. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :---: | :--- |
| **BR-01** | Chỉ Sales hoặc người dùng được cấp quyền mới được tạo HOLD. |
| **BR-02** | Chỉ sảnh đang ở trạng thái TRỐNG mới được phép tạo HOLD. |
| **BR-03** | Hệ thống phải kiểm tra xung đột lịch trước khi tạo HOLD. |
| **BR-04** | Thời hạn HOLD mặc định là 48 giờ kể từ thời điểm tạo HOLD thành công. |
| **BR-05** | HOLD không đồng nghĩa với đặt sảnh chính thức. |
| **BR-06** | Trong thời gian HOLD, sảnh không được cấp cho yêu cầu đặt khác có xung đột. |
| **BR-07** | Khách hàng chưa cần quyết định thực đơn ngay khi tạo HOLD nhưng phải hoàn tất các bước tiếp theo trước khi HOLD hết hạn. |
| **BR-08** | Hệ thống phải gửi thông báo khi HOLD được tạo thành công. |
| **BR-09** | Hệ thống phải gửi thông báo nhắc trước khi HOLD hết hạn. |
| **BR-10** | Khi HOLD hết 48 giờ mà chưa được xác nhận đặt chính thức, hệ thống tự động chuyển sảnh về TRỐNG. |
| **BR-11** | Khi HOLD được chuyển thành đặt chính thức, hệ thống phải dừng cơ chế tự động nhả HOLD. |
| **BR-12** | Thời điểm bắt đầu và hết hạn HOLD phải được lưu trong hệ thống để phục vụ kiểm tra và theo dõi. |

---

## 7. Tiêu chí nghiệm thu – Acceptance Criteria

- **AC-01 – Tạo HOLD thành công:** Given sảnh TRỐNG & không xung đột when Sales xác nhận giữ then chuyển sảnh từ `TRỐNG` $\rightarrow$ `HOLD`.
- **AC-02 – Thời hạn HOLD 48 giờ:** Given HOLD tạo lúc T when xác định thời hạn then hết hạn lúc $T + 48\text{ giờ}$.
- **AC-03 – Khách chưa chọn thực đơn:** Given khách chưa chốt Set Menu when các điều kiện HOLD hợp lệ then vẫn tạo HOLD bình thường.
- **AC-04 – Gửi thông báo HOLD:** Given HOLD thành công when hệ thống tạo bản ghi then tự động gửi Email/SMS cho khách hàng.
- **AC-05 – Nhắc trước khi hết hạn:** Given HOLD sắp hết hạn when đến giờ nhắc then tự gửi thông báo cho Khách và Sales phụ trách.
- **AC-06 – Tự động nhả sảnh:** Given HOLD quá 48h chưa cọc when hệ thống quét batch then chuyển `HOLD` $\rightarrow$ `TRỐNG`.
- **AC-07 – Không cho đặt trùng trong thời gian HOLD:** Given sảnh đang HOLD when yêu cầu khác đặt cùng khung giờ then từ chối và báo sảnh đang được giữ.
- **AC-08 – Chuyển HOLD thành đặt chính thức:** Given HOLD còn hiệu lực when khách cọc đợt 1 then chuyển `HOLD` $\rightarrow$ `ĐÃ ĐẶT` và dừng timer nhả sảnh.
- **AC-09 – HOLD hết hạn:** Given HOLD đã hết hạn when chưa cọc then sảnh trả về `TRỐNG` và từ chối dùng lại bản ghi HOLD cũ.
