# Danh sách Test Cases Chi tiết — EVManager (35 Test Cases)

Tài liệu bao gồm **35 Test Cases** bao phủ 5 phân hệ cốt lõi của dự án EVManager theo tiêu chuẩn kiểm thử phần mềm. Mỗi Test Case bao gồm đầy đủ: **Test Case ID, Description, Pre-condition, Test Steps, Test Data, Expected Result**.

---

## 1. Phân hệ Xác thực & Phân quyền (6 Test Cases)

### TC_AUTH_01: Đăng nhập thành công với tài khoản hợp lệ
- **Test Case ID**: `TC_AUTH_01`
- **Description**: Kiểm tra chức năng đăng nhập khi người dùng nhập đúng Username và Password.
- **Pre-condition**: Tài khoản người dùng đã tồn tại trong CSDL với trạng thái `status = 'ACTIVE'`.
- **Test Steps**:
  1. Truy cập vào màn hình Đăng nhập (`/login`).
  2. Nhập Username hợp lệ vào ô "Tên đăng nhập".
  3. Nhập Mật khẩu tương ứng vào ô "Mật khẩu".
  4. Bấm nút "Đăng nhập".
- **Test Data**: Username: `admin_user`, Password: `Password@123`.
- **Expected Result**: Đăng nhập thành công, nhận JWT Token, lưu thông tin phiên làm việc và chuyển hướng người dùng vào màn hình Dashboard chính.

---

### TC_AUTH_02: Đăng nhập thất bại khi nhập sai thông tin
- **Test Case ID**: `TC_AUTH_02`
- **Description**: Kiểm tra hệ thống từ chối đăng nhập khi người dùng nhập sai tên đăng nhập hoặc mật khẩu.
- **Pre-condition**: Người dùng đang ở màn hình Đăng nhập.
- **Test Steps**:
  1. Nhập Username hợp lệ nhưng nhập Password sai.
  2. Bấm nút "Đăng nhập".
- **Test Data**: Username: `admin_user`, Password: `WrongPassword999`.
- **Expected Result**: Đăng nhập thất bại, hệ thống hiển thị thông báo lỗi: *"Tên đăng nhập hoặc mật khẩu không chính xác"*, không trả về JWT Token và không chuyển trang.

---

### TC_AUTH_03: Đăng nhập thất bại với tài khoản đang bị khóa
- **Test Case ID**: `TC_AUTH_03`
- **Description**: Kiểm tra hệ thống chặn đăng nhập với tài khoản có trạng thái `LOCKED`.
- **Pre-condition**: Tài khoản `staff_locked` tồn tại trong CSDL với `status = 'LOCKED'`.
- **Test Steps**:
  1. Nhập Username `staff_locked` và Password đúng.
  2. Bấm nút "Đăng nhập".
- **Test Data**: Username: `staff_locked`, Password: `Password@123`.
- **Expected Result**: Đăng nhập thất bại, hệ thống hiển thị thông báo: *"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên"*.

---

### TC_AUTH_04: Yêu cầu Quên mật khẩu với Email hợp lệ
- **Test Case ID**: `TC_AUTH_04`
- **Description**: Kiểm tra gửi link/mã khôi phục mật khẩu khi người dùng yêu cầu Quên mật khẩu.
- **Pre-condition**: Email `user_sales@evmanager.com` đã đăng ký trong hệ thống.
- **Test Steps**:
  1. Truy cập màn hình "Quên mật khẩu" (`/forgot-password`).
  2. Nhập Email vào ô yêu cầu.
  3. Bấm nút "Gửi yêu cầu khôi phục".
- **Test Data**: Email: `user_sales@evmanager.com`.
- **Expected Result**: Hệ thống tạo mã xác thực/reset token, gửi email khôi phục và hiển thị thông báo thành công: *"Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn"*.

---

### TC_AUTH_05: Phân quyền RBAC — Từ chối quyền truy cập chức năng Quản trị
- **Test Case ID**: `TC_AUTH_05`
- **Description**: Kiểm tra người dùng có vai trò `SALES` không thể truy cập hoặc thao tác trên chức năng Cấu hình hệ thống (Admin).
- **Pre-condition**: Người dùng đã đăng nhập thành công với tài khoản có `role_id` tương ứng vai trò `SALES`.
- **Test Steps**:
  1. Đăng nhập tài khoản `sales_member`.
  2. Cố tình truy cập trực tiếp vào URL đường dẫn `/admin/roles` hoặc gửi API `GET /api/v1/admin/roles`.
- **Test Data**: User: `sales_member` (Role: SALES).
- **Expected Result**: Hệ thống chặn truy cập, trả về HTTP Status `403 Forbidden` và hiển thị thông báo: *"Bạn không có quyền thực hiện thao tác này"*.

---

### TC_AUTH_06: Phân quyền RBAC — Phê duyệt quyền cho Vai trò Kế toán (ACCOUNTANT)
- **Test Case ID**: `TC_AUTH_06`
- **Description**: Kiểm tra người dùng vai trò `ACCOUNTANT` truy cập và thao tác thành công trên phân hệ Thanh toán & Doanh thu.
- **Pre-condition**: Người dùng đăng nhập tài khoản vai trò `ACCOUNTANT`.
- **Test Steps**:
  1. Đăng nhập tài khoản `accountant_user`.
  2. Truy cập phân hệ "Quản lý Thanh toán" (`/payments`) và gửi API `POST /api/v1/payments`.
- **Test Data**: User: `accountant_user` (Role: ACCOUNTANT).
- **Expected Result**: Hệ thống cho phép truy cập (HTTP 200 OK), hiển thị giao diện danh sách thanh toán và nút tạo phiếu thu.

---

## 2. Phân hệ Quản lý Khách hàng (6 Test Cases)

### TC_CUST_01: Thêm mới khách hàng thành công
- **Test Case ID**: `TC_CUST_01`
- **Description**: Kiểm tra thêm mới hồ sơ khách hàng thành công khi nhập đầy đủ thông tin hợp lệ.
- **Pre-condition**: Người dùng (Role SALES/MANAGER) đã đăng nhập hệ thống.
- **Test Steps**:
  1. Truy cập màn hình "Danh sách Khách hàng" ➔ Chọn "Thêm mới".
  2. Nhập Họ tên, Số điện thoại, Email, Địa chỉ.
  3. Bấm "Lưu".
- **Test Data**: Họ tên: `Nguyen Van A`, SĐT: `0912345678`, Email: `nguyenvana@gmail.com`, Địa chỉ: `123 Nguyen Hue, Q1, TP.HCM`.
- **Expected Result**: Khách hàng mới được lưu vào CSDL, hiển thị thông báo *"Thêm khách hàng thành công"* và xuất hiện trong danh sách.

---

### TC_CUST_02: Thêm mới khách hàng thất bại khi thiếu thông tin liên hệ
- **Test Case ID**: `TC_CUST_02`
- **Description**: Kiểm tra hệ thống từ chối thêm khách hàng nếu để trống cả Số điện thoại và Email (vi phạm ràng buộc `chk_customers_contact`).
- **Pre-condition**: Màn hình Thêm mới Khách hàng đang mở.
- **Test Steps**:
  1. Nhập Họ tên: `Tran Van B`.
  2. Để trống ô Số điện thoại và Email.
  3. Bấm "Lưu".
- **Test Data**: Họ tên: `Tran Van B`, SĐT: `""`, Email: `""`.
- **Expected Result**: Báo lỗi validation: *"Bắt buộc phải nhập ít nhất Số điện thoại hoặc Email để liên hệ"*, không lưu bản ghi vào CSDL.

---

### TC_CUST_03: Validate định dạng Số điện thoại khách hàng
- **Test Case ID**: `TC_CUST_03`
- **Description**: Kiểm tra báo lỗi khi nhập số điện thoại không đúng định dạng (chứa chữ cái hoặc ít hơn/nhiều hơn 10 chữ số).
- **Pre-condition**: Màn hình Thêm mới/Sửa Khách hàng đang mở.
- **Test Steps**:
  1. Nhập Họ tên hợp lệ.
  2. Nhập SĐT chứa ký tự chữ: `0912ABC345`.
  3. Bấm "Lưu".
- **Test Data**: SĐT: `0912ABC345`.
- **Expected Result**: Hệ thống báo lỗi: *"Số điện thoại không hợp lệ. Vui lòng nhập chuỗi 10 chữ số"*.

---

### TC_CUST_04: Chỉnh sửa thông tin khách hàng thành công
- **Test Case ID**: `TC_CUST_04`
- **Description**: Kiểm tra cập nhật thông tin địa chỉ và email của khách hàng đã tồn tại.
- **Pre-condition**: Khách hàng `customer_id = 10` đã có trong hệ thống.
- **Test Steps**:
  1. Chọn khách hàng `customer_id = 10` ➔ Bấm "Chỉnh sửa".
  2. Cập nhật Địa chỉ mới.
  3. Bấm "Cập nhật".
- **Test Data**: Địa chỉ mới: `456 Le Loi, Q1, TP.HCM`.
- **Expected Result**: Hệ thống cập nhật thành công, lưu `updated_at` mới và hiển thị thông tin đã chỉnh sửa.

---

### TC_CUST_05: Tìm kiếm khách hàng theo Tên hoặc Số điện thoại
- **Test Case ID**: `TC_CUST_05`
- **Description**: Kiểm tra chức năng tìm kiếm trả về đúng danh sách khách hàng khớp với từ khóa.
- **Pre-condition**: Hệ thống đã có danh sách 50 khách hàng.
- **Test Steps**:
  1. Nhập từ khóa `0912345678` vào ô Tìm kiếm.
  2. Bấm nút Tìm kiếm / Enter.
- **Test Data**: Keyword: `0912345678`.
- **Expected Result**: Kết quả trả về danh sách khách hàng có số điện thoại chứa chuỗi `0912345678`.

---

### TC_CUST_06: Kiểm tra ràng buộc khi xóa khách hàng đã có hợp đồng
- **Test Case ID**: `TC_CUST_06`
- **Description**: Kiểm tra từ chối xóa vật lý khách hàng khi khách hàng đó đã phát sinh hợp đồng (`RESTRICT`).
- **Pre-condition**: Khách hàng `customer_id = 5` đã có 1 hợp đồng trong bảng `Contracts`.
- **Test Steps**:
  1. Chọn khách hàng `customer_id = 5`.
  2. Bấm nút "Xóa khách hàng".
  3. Xác nhận xóa trên popup.
- **Test Data**: `customer_id = 5`.
- **Expected Result**: Hệ thống chặn thao tác xóa (vi phạm FK Restrict), hiển thị thông báo: *"Không thể xóa khách hàng đã có lịch sử hợp đồng. Bạn chỉ có thể chuyển trạng thái ngừng hoạt động"*.

---

## 3. Thuật toán Kiểm tra Trùng lịch Sảnh tiệc (8 Test Cases)

### TC_SCHED_01: Đặt sảnh thành công khi không trùng khoảng thời gian
- **Test Case ID**: `TC_SCHED_01`
- **Description**: Đặt sự kiện thành công khi khung giờ hoàn toàn tách biệt với các sự kiện khác trên cùng sảnh.
- **Pre-condition**: Sảnh A đã có Event 1 (10:00 – 14:00 ngày 15/10/2026).
- **Test Steps**:
  1. Đặt Event 2 tại Sảnh A từ 17:00 – 21:00 ngày 15/10/2026.
  2. Bấm "Kiểm tra lịch & Đặt sảnh".
- **Test Data**: Sảnh: Sảnh A, Start: `2026-10-15 17:00`, End: `2026-10-15 21:00`.
- **Expected Result**: Hệ thống báo sảnh còn trống, tạo sự kiện thành công với trạng thái `SCHEDULED`.

---

### TC_SCHED_02: Kiểm tra từ chối khi trùng lịch hoàn toàn (Exact Match)
- **Test Case ID**: `TC_SCHED_02`
- **Description**: Từ chối đặt sự kiện mới có khung giờ trùng khít 100% với sự kiện đã tồn tại trên cùng sảnh.
- **Pre-condition**: Sảnh A đã có Event 1 (18:00 – 21:30 ngày 20/10/2026).
- **Test Steps**:
  1. Đặt Event B tại Sảnh A khung giờ 18:00 – 21:30 ngày 20/10/2026.
  2. Bấm "Lưu sự kiện".
- **Test Data**: Sảnh: Sảnh A, Start: `2026-10-20 18:00`, End: `2026-10-20 21:30`.
- **Expected Result**: Thuật toán phát hiện xung đột lịch, từ chối tạo sự kiện và báo lỗi: *"Sảnh A đã được đặt trong khoảng thời gian này"*.

---

### TC_SCHED_03: Trùng lịch giao thoa phần đầu (Overlap Start)
- **Test Case ID**: `TC_SCHED_03`
- **Description**: Từ chối sự kiện mới bắt đầu trước và kết thúc trùng vào khoảng thời gian của sự kiện đã có.
- **Pre-condition**: Event A tại Sảnh B (11:00 – 14:00).
- **Test Steps**:
  1. Đặt Event B tại Sảnh B thời gian 10:00 – 12:00 (giao thoa từ 11:00 – 12:00).
  2. Bấm "Lưu".
- **Test Data**: Sảnh B, Start: `10:00`, End: `12:00` (Event A: `11:00 - 14:00`).
- **Expected Result**: Báo lỗi xung đột lịch sảnh tiệc.

---

### TC_SCHED_04: Trùng lịch giao thoa phần đuôi (Overlap End)
- **Test Case ID**: `TC_SCHED_04`
- **Description**: Từ chối sự kiện mới bắt đầu trong khoảng thời gian của sự kiện đã có và kéo dài sau đó.
- **Pre-condition**: Event A tại Sảnh B (11:00 – 14:00).
- **Test Steps**:
  1. Đặt Event B tại Sảnh B thời gian 13:00 – 16:00 (giao thoa từ 13:00 – 14:00).
  2. Bấm "Lưu".
- **Test Data**: Sảnh B, Start: `13:00`, End: `16:00`.
- **Expected Result**: Báo lỗi xung đột lịch sảnh tiệc.

---

### TC_SCHED_05: Trùng lịch trường hợp bao trùm thời gian (Enclosing Overlap)
- **Test Case ID**: `TC_SCHED_05`
- **Description**: Từ chối sự kiện mới có thời gian bắt đầu trước và kết thúc sau sự kiện đã có.
- **Pre-condition**: Event A tại Sảnh C (12:00 – 14:00).
- **Test Steps**:
  1. Đặt Event B tại Sảnh C thời gian 10:00 – 16:00 (Bao trùm toàn bộ Event A).
  2. Bấm "Lưu".
- **Test Data**: Sảnh C, Start: `10:00`, End: `16:00`.
- **Expected Result**: Thuật toán bắt được xung đột và báo lỗi sảnh đã bị trùng.

---

### TC_SCHED_06: Trùng lịch trường hợp nằm gọn bên trong (Inside Overlap)
- **Test Case ID**: `TC_SCHED_06`
- **Description**: Từ chối sự kiện mới nằm hoàn toàn bên trong khoảng thời gian của sự kiện đã có.
- **Pre-condition**: Event A tại Sảnh C (08:00 – 17:00).
- **Test Steps**:
  1. Đặt Event B tại Sảnh C thời gian 11:00 – 13:00.
  2. Bấm "Lưu".
- **Test Data**: Sảnh C, Start: `11:00`, End: `13:00`.
- **Expected Result**: Báo lỗi xung đột lịch sảnh tiệc.

---

### TC_SCHED_07: Đặt trùng khoảng thời gian nhưng ở HAI SẢNH KHÁC NHAU
- **Test Case ID**: `TC_SCHED_07`
- **Description**: Đảm bảo thuật toán cho phép đặt 2 sự kiện trùng hệt khung giờ nhưng ở 2 sảnh tiệc khác nhau.
- **Pre-condition**: Sảnh A đã có Event 1 (18:00 – 21:00 ngày 25/10/2026).
- **Test Steps**:
  1. Đặt Event 2 tại Sảnh B từ 18:00 – 21:00 ngày 25/10/2026.
  2. Bấm "Lưu".
- **Test Data**: Sảnh: Sảnh B, Start: `18:00`, End: `21:00`.
- **Expected Result**: Đặt thành công vì khác `venue_id`.

---

### TC_SCHED_08: Kiểm tra quy tắc thời gian đệm vệ sinh/dọn dẹp (Buffer Time Constraint)
- **Test Case ID**: `TC_SCHED_08`
- **Description**: Từ chối sự kiện mới nếu khoảng cách giữa 2 sự kiện cùng sảnh nhỏ hơn khoảng thời gian đệm quy định (Buffer time 60 phút).
- **Pre-condition**: Event 1 kết thúc lúc 14:00 tại Sảnh A. Quy định buffer time = 60 phút.
- **Test Steps**:
  1. Đặt Event 2 tại Sảnh A bắt đầu lúc 14:30 (chỉ cách 30 phút).
  2. Bấm "Lưu".
- **Test Data**: Event 1 End: `14:00`, Event 2 Start: `14:30` (Buffer: 30m < 60m).
- **Expected Result**: Hệ thống báo lỗi: *"Cần tối thiểu 60 phút đệm giữa 2 sự kiện trên cùng sảnh để dọn dẹp và chuẩn bị"*.

---

## 4. Phân hệ Hợp đồng & Tính tiền (8 Test Cases)

### TC_CONT_01: Tạo hợp đồng và tính tổng tiền tự động thành công
- **Test Case ID**: `TC_CONT_01`
- **Description**: Kiểm tra tổng giá trị hợp đồng được tính đúng theo công thức: `Tiền sảnh + (Giá menu x Số bàn) + Tiền dịch vụ`.
- **Pre-condition**: Giá sảnh = 10.000.000, Giá menu = 3.000.000/bàn (20 bàn = 60.000.000), Dịch vụ = 5.000.000.
- **Test Steps**:
  1. Chọn Sự kiện, Sảnh, Thực đơn (20 bàn) và Dịch vụ đi kèm.
  2. Bấm "Tính tổng tiền hợp đồng".
- **Test Data**: Rental: `10.000.000`, Menu: `20 x 3.000.000`, Services: `5.000.000`.
- **Expected Result**: `total_amount` được tính chính xác = `75.000.000 VNĐ`.

---

### TC_CONT_02: Tính tiền hợp đồng khi áp dụng Chiết khấu %
- **Test Case ID**: `TC_CONT_02`
- **Description**: Kiểm tra tính toán chính xác giá trị hợp đồng khi giảm giá/chiết khấu 10%.
- **Pre-condition**: Tổng tiền trước chiết khấu = 100.000.000 VNĐ.
- **Test Steps**:
  1. Nhập tỷ lệ Chiết khấu = 10%.
  2. Bấm nút "Cập nhật giá trị hợp đồng".
- **Test Data**: Total original: `100.000.000`, Discount: `10%`.
- **Expected Result**: Giá trị tiền giảm = 10.000.000 VNĐ; `total_amount` sau chiết khấu = `90.000.000 VNĐ`.

---

### TC_CONT_03: Tính tổng tiền thanh toán sau thuế VAT (10%)
- **Test Case ID**: `TC_CONT_03`
- **Description**: Kiểm tra cộng thêm thuế VAT 10% vào tổng giá trị thanh toán của hợp đồng.
- **Pre-condition**: Tổng tiền trước thuế = 100.000.000 VNĐ.
- **Test Steps**:
  1. Tích chọn "Áp dụng VAT 10%".
  2. Bấm "Tính toán".
- **Test Data**: Base amount: `100.000.000`, VAT: `10%`.
- **Expected Result**: Tiền thuế VAT = 10.000.000 VNĐ; Tổng thanh toán sau thuế = `110.000.000 VNĐ`.

---

### TC_CONT_04: Validate tiền đặt cọc tối thiểu (Từ chối nếu < 30%)
- **Test Case ID**: `TC_CONT_04`
- **Description**: Từ chối xác nhận hợp đồng nếu số tiền đặt cọc nhỏ hơn 30% tổng giá trị hợp đồng.
- **Pre-condition**: `total_amount` = 100.000.000 VNĐ. Quy định cọc tối thiểu 30% (30.000.000 VNĐ).
- **Test Steps**:
  1. Nhập `deposit_amount` = 20.000.000 VNĐ (chỉ đạt 20%).
  2. Bấm "Xác nhận hợp đồng".
- **Test Data**: Total: `100.000.000`, Deposit: `20.000.000`.
- **Expected Result**: Báo lỗi: *"Tiền đặt cọc tối thiểu phải đạt 30% giá trị hợp đồng (tương đương 30.000.000 VNĐ)"*.

---

### TC_CONT_05: Xác nhận hợp đồng thành công khi cọc đủ ≥ 30%
- **Test Case ID**: `TC_CONT_05`
- **Description**: Chuyển trạng thái hợp đồng thành `CONFIRMED` khi nhập tiền cọc hợp lệ.
- **Pre-condition**: Hợp đồng ở trạng thái `DRAFT`, `total_amount` = 100.000.000 VNĐ.
- **Test Steps**:
  1. Nhập `deposit_amount` = 30.000.000 VNĐ.
  2. Bấm "Xác nhận hợp đồng".
- **Test Data**: Deposit: `30.000.000`.
- **Expected Result**: Hợp đồng cập nhật `status = 'CONFIRMED'`, lưu thời điểm xác nhận.

---

### TC_CONT_06: Kiểm tra tính năng Snapshot đơn giá dịch vụ (Price Snapshot)
- **Test Case ID**: `TC_CONT_06`
- **Description**: Đảm bảo đơn giá dịch vụ đã chốt trong `ContractServices` không bị thay đổi khi danh mục `Services` tăng giá.
- **Pre-condition**: Hợp đồng HD01 đã chốt Dịch vụ âm thanh với `agreed_unit_price = 5.000.000 VNĐ`.
- **Test Steps**:
  1. Admin truy cập danh mục `Services`, cập nhật giá Dịch vụ âm thanh lên `7.000.000 VNĐ`.
  2. Mở lại hợp đồng HD01 kiểm tra đơn giá dịch vụ.
- **Test Data**: Old agreed price: `5.000.000`, New catalogue price: `7.000.000`.
- **Expected Result**: `agreed_unit_price` trong HD01 vẫn giữ nguyên `= 5.000.000 VNĐ`, giá trị hợp đồng HD01 không bị thay đổi.

---

### TC_CONT_07: Validate số lượng khách vượt sức chứa tối đa của sảnh
- **Test Case ID**: `TC_CONT_07`
- **Description**: Báo lỗi khi tạo hợp đồng với số lượng khách vượt quá `max_capacity` của sảnh đã chọn.
- **Pre-condition**: Sảnh A có `max_capacity = 300` khách.
- **Test Steps**:
  1. Chọn Sảnh A cho hợp đồng.
  2. Nhập số lượng khách `guest_count = 500`.
  3. Bấm "Lưu hợp đồng".
- **Test Data**: Max capacity: `300`, Guest count: `500`.
- **Expected Result**: Hệ thống chặn tạo hợp đồng và thông báo: *"Số lượng khách (500) vượt quá sức chứa tối đa của Sảnh A (300 khách)"*.

---

### TC_CONT_08: Hủy hợp đồng ở trạng thái DRAFT
- **Test Case ID**: `TC_CONT_08`
- **Description**: Kiểm tra chuyển trạng thái hợp đồng nháp sang `CANCELLED`.
- **Pre-condition**: Hợp đồng HD02 đang ở trạng thái `DRAFT`.
- **Test Steps**:
  1. Chọn HD02 ➔ Bấm nút "Hủy hợp đồng".
  2. Nhập lý do hủy và xác nhận.
- **Test Data**: Reason: `Khách hàng đổi kế hoạch`.
- **Expected Result**: Hợp đồng chuyển `status = 'CANCELLED'`, giải phóng lịch sảnh tiệc tương ứng.

---

## 5. Phân hệ Thanh toán & Báo cáo doanh thu (7 Test Cases)

### TC_PAY_01: Ghi nhận giao dịch Thanh toán đặt cọc (`DEPOSIT`) thành công
- **Test Case ID**: `TC_PAY_01`
- **Description**: Ghi nhận phiếu thu đặt cọc thành công và cập nhật công nợ hợp đồng.
- **Pre-condition**: Hợp đồng HD01 có `total_amount = 100.000.000 VNĐ`.
- **Test Steps**:
  1. Chọn Hợp đồng HD01 ➔ Chọn "Tạo thanh toán".
  2. Chọn `payment_type = 'DEPOSIT'`, nhập Số tiền = 30.000.000 VNĐ, Phương thức = Chuyển khoản.
  3. Bấm "Xác nhận thanh toán".
- **Test Data**: Amount: `30.000.000`, Type: `DEPOSIT`, Method: `BANK_TRANSFER`.
- **Expected Result**: Tạo bản ghi `Payments` với `status = 'SUCCESS'`, ghi nhận đã thanh toán 30.000.000 VNĐ, công nợ còn lại = 70.000.000 VNĐ.

---

### TC_PAY_02: Ghi nhận Tất toán hợp đồng (`FINAL`)
- **Test Case ID**: `TC_PAY_02`
- **Description**: Thanh toán số tiền còn lại để đưa công nợ hợp đồng về 0.
- **Pre-condition**: Hợp đồng HD01 còn nợ 70.000.000 VNĐ.
- **Test Steps**:
  1. Tạo thanh toán cho HD01 với `payment_type = 'FINAL'`.
  2. Nhập số tiền = 70.000.000 VNĐ.
  3. Bấm "Xác nhận".
- **Test Data**: Amount: `70.000.000`.
- **Expected Result**: Thanh toán thành công, số tiền còn nợ = 0 VNĐ, hợp đồng đủ điều kiện chuyển trạng thái `COMPLETED`.

---

### TC_PAY_03: Từ chối thanh toán với số tiền âm hoặc bằng 0
- **Test Case ID**: `TC_PAY_03`
- **Description**: Báo lỗi khi người dùng cố tình nhập số tiền thanh toán `<= 0` (vi phạm `chk_payments_amount`).
- **Pre-condition**: Màn hình Tạo thanh toán đang mở.
- **Test Steps**:
  1. Nhập Số tiền = `-5.000.000` (hoặc `0`).
  2. Bấm "Thanh toán".
- **Test Data**: Amount: `-5.000.000`.
- **Expected Result**: Báo lỗi validation: *"Số tiền thanh toán phải lớn hơn 0"*.

---

### TC_PAY_04: Ngăn chặn thanh toán vượt quá công nợ còn lại
- **Test Case ID**: `TC_PAY_04`
- **Description**: Từ chối giao dịch nếu số tiền nhập vào lớn hơn số tiền khách hàng còn nợ.
- **Pre-condition**: Hợp đồng HD01 chỉ còn nợ 20.000.000 VNĐ.
- **Test Steps**:
  1. Nhập số tiền thanh toán = 50.000.000 VNĐ.
  2. Bấm "Thanh toán".
- **Test Data**: Remaining debt: `20.000.000`, Pay amount: `50.000.000`.
- **Expected Result**: Báo lỗi: *"Số tiền thanh toán (50.000.000 VNĐ) vượt quá dư nợ còn lại của hợp đồng (20.000.000 VNĐ)"*.

---

### TC_PAY_05: Ghi nhận xử lý Hoàn tiền (`REFUND`) khi hủy hợp đồng
- **Test Case ID**: `TC_PAY_05`
- **Description**: Ghi nhận phiếu chi hoàn tiền cọc cho khách hàng khi hợp đồng bị hủy theo điều khoản.
- **Pre-condition**: Hợp đồng bị hủy, khách đã cọc 30.000.000 VNĐ, chính sách hoàn lại 50% (15.000.000 VNĐ).
- **Test Steps**:
  1. Tạo giao dịch với `payment_type = 'REFUND'`.
  2. Nhập số tiền = 15.000.000 VNĐ, ghi chú "Hoàn 50% cọc".
  3. Bấm "Xác nhận hoàn tiền".
- **Test Data**: Amount: `15.000.000`, Type: `REFUND`.
- **Expected Result**: Tạo bản ghi hoàn tiền thành công với `status = 'SUCCESS'`, ghi nhận giảm doanh thu tương ứng.

---

### TC_PAY_06: Trích xuất Báo cáo doanh thu theo khoảng thời gian
- **Test Case ID**: `TC_PAY_06`
- **Description**: Kiểm tra báo cáo doanh thu tính chính xác tổng tiền của các giao dịch `SUCCESS` trong tháng.
- **Pre-condition**: Trong tháng 10/2026 có 3 giao dịch `SUCCESS` (30M, 50M, 20M = 100M) và 1 giao dịch `FAILED` (10M).
- **Test Steps**:
  1. Truy cập phân hệ "Báo cáo Doanh thu".
  2. Chọn khoảng thời gian: Từ `01/10/2026` đến `31/10/2026`.
  3. Bấm "Xem báo cáo".
- **Test Data**: Date range: `2026-10-01` to `2026-10-31`.
- **Expected Result**: Báo cáo hiển thị Tổng doanh thu = `100.000.000 VNĐ` (loại trừ hoàn toàn giao dịch FAILED).

---

### TC_PAY_07: Báo cáo phân rã doanh thu theo Thực đơn và Dịch vụ
- **Test Case ID**: `TC_PAY_07`
- **Description**: Kiểm tra biểu đồ/bảng phân tích tỷ trọng doanh thu đến từ bán Thực đơn vs Dịch vụ đi kèm.
- **Pre-condition**: Hệ thống đã có dữ liệu thanh toán hoàn tất cho 10 hợp đồng.
- **Test Steps**:
  1. Mở "Báo cáo phân tích cơ cấu doanh thu".
  2. Chọn lọc theo Tháng hiện tại.
  3. Kiểm tra số liệu tổng hợp.
- **Test Data**: Month: Current Month.
- **Expected Result**: Báo cáo hiển thị chính xác tổng số tiền thu từ Thực đơn (Menu) và tổng số tiền thu từ Dịch vụ (Services) khớp với chi tiết hợp đồng đã hoàn tất.
