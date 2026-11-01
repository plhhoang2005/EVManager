# UC-03: Tiếp nhận và quản lý hồ sơ khách hàng

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-03 |
| **Tên Use Case** | Tiếp nhận và quản lý thông tin khách hàng tiềm năng |
| **Actor chính** | Nhân viên Tư vấn (Sales) |
| **Mục tiêu** | Cho phép Sales tiếp nhận, tạo mới, tra cứu và quản lý thông tin khách hàng tiềm năng, đồng thời theo dõi lịch sử giao dịch và các sự kiện đã tổ chức. |
| **Trigger** | Sales tiếp nhận yêu cầu hoặc thông tin từ một khách hàng tiềm năng. |
| **Tiền điều kiện** | Sales đã đăng nhập và có quyền quản lý thông tin khách hàng. |
| **Hậu điều kiện thành công** | Hồ sơ khách hàng được tạo mới hoặc cập nhật thành công; thông tin lịch sử giao dịch được lưu trữ và tra cứu được. |
| **Hậu điều kiện thất bại** | Dữ liệu không được lưu hoặc thay đổi khi thông tin không hợp lệ hoặc xảy ra lỗi. |

---

## 2. Phạm vi chức năng

Sales có thể thực hiện các chức năng:
1. Tạo hồ sơ khách hàng mới.
2. Tra cứu khách hàng theo số điện thoại.
3. Kiểm tra và tránh tạo hồ sơ khách hàng trùng.
4. Cập nhật thông tin khách hàng.
5. Xem chi tiết hồ sơ khách hàng.
6. Xem lịch sử giao dịch.
7. Xem các sự kiện khách hàng đã tổ chức.

---

## 3. Thông tin hồ sơ khách hàng

| Trường thông tin | Mô tả | Bắt buộc |
| :--- | :--- | :---: |
| **Họ tên cô dâu/chú rể** | Họ tên của cô dâu, chú rể hoặc người đại diện liên hệ | **Có** |
| **Số điện thoại** | Số điện thoại dùng để liên hệ với khách hàng | **Có** |
| **Địa chỉ** | Địa chỉ liên hệ của khách hàng | Không |
| **Nguồn khách** | Nguồn mà khách hàng biết đến nhà hàng/dịch vụ (`Facebook`, `Người quen`, `Vãng lai`) | **Có** |
| **Ghi chú** | Thông tin bổ sung về nhu cầu hoặc yêu cầu của khách hàng | Không |

---

## 4. Luồng chính – Basic Flow

- **B1.1:** Sales đăng nhập vào hệ thống.
- **B1.2:** Sales chọn chức năng Quản lý khách hàng $\rightarrow$ Thêm khách hàng.
- **B1.3:** Hệ thống hiển thị form nhập thông tin khách hàng.
- **B1.4:** Sales nhập Số điện thoại của khách hàng.
- **B1.5:** Hệ thống tự động tra cứu số điện thoại trong cơ sở dữ liệu.
- **B1.6:** Nếu số điện thoại chưa tồn tại, hệ thống cho phép Sales tiếp tục nhập hồ sơ khách hàng mới.
- **B1.7:** Sales nhập: Họ tên cô dâu/chú rể, Số điện thoại, Địa chỉ, Nguồn khách, Ghi chú.
- **B1.8:** Sales chọn Lưu.
- **B1.9:** Hệ thống kiểm tra tính hợp lệ của dữ liệu.
- **B1.10:** Hệ thống tạo hồ sơ khách hàng mới và hiển thị thông báo *"Tạo hồ sơ khách hàng thành công"*.

---

## 5. Luồng phụ – Alternative Flow

- **A1. Khách hàng đã tồn tại:** Nhập SĐT đã có $\rightarrow$ hệ thống báo *"Khách hàng đã tồn tại trong hệ thống"* và hiển thị thông tin sẵn có để Sales xem/cập nhật.
- **A2. Cập nhật thông tin khách hàng:** Tìm kiếm khách hàng $\rightarrow$ Chỉnh sửa $\rightarrow$ Lưu $\rightarrow$ Hệ thống báo *"Cập nhật thông tin khách hàng thành công"*.
- **A3. Tra cứu khách hàng:** Nhập SĐT $\rightarrow$ Hệ thống trả về thông tin chi tiết.
- **A4. Xem lịch sử giao dịch:** Mở hồ sơ $\rightarrow$ chọn Lịch sử giao dịch $\rightarrow$ hiển thị danh sách giao dịch (Mã GD, Ngày GD, Nội dung, Giá trị, Trạng thái).
- **A5. Xem các sự kiện đã tổ chức:** Mở hồ sơ $\rightarrow$ chọn Lịch sử sự kiện $\rightarrow$ hiển thị thông tin sự kiện (Tên sự kiện, Ngày tổ chức, Sảnh, Số bàn, Set Menu, Dịch vụ, Tổng tiền, Trạng thái).

---

## 6. Luồng ngoại lệ – Exception Flow

- **E1. Số điện thoại không hợp lệ:** Nhập sai định dạng $\rightarrow$ hệ thống thông báo *"Số điện thoại không hợp lệ."*
- **E2. Thiếu thông tin bắt buộc:** Bỏ trống Họ tên hoặc SĐT $\rightarrow$ hệ thống không cho lưu và đánh dấu đỏ trường thiếu.
- **E3. Lỗi hệ thống:** Gián đoạn DB $\rightarrow$ thông báo *"Không thể thực hiện thao tác. Vui lòng thử lại sau."*

---

## 7. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :---: | :--- |
| **BR-01** | Chỉ Sales hoặc người dùng được cấp quyền mới được tạo và quản lý hồ sơ khách hàng. |
| **BR-02** | Số điện thoại là thông tin dùng để nhận diện và tra cứu khách hàng. |
| **BR-03** | Số điện thoại của mỗi khách hàng phải là duy nhất trong hệ thống. |
| **BR-04** | Hệ thống phải kiểm tra số điện thoại trước khi tạo hồ sơ khách hàng mới để tránh trùng dữ liệu. |
| **BR-05** | Họ tên cô dâu/chú rể và số điện thoại là thông tin bắt buộc. |
| **BR-06** | Nguồn khách phải được lựa chọn từ danh sách được hệ thống cung cấp (`Facebook`, `Người quen`, `Vãng lai`). |
| **BR-07** | Thông tin lịch sử giao dịch và sự kiện phải được liên kết với đúng hồ sơ khách hàng. |

---

## 8. Tiêu chí nghiệm thu – Acceptance Criteria

- **AC-01 – Tạo khách hàng mới:** Given nhập đủ thông tin hợp lệ & SĐT chưa có when lưu then hiển thị *"Tạo hồ sơ khách hàng thành công"*.
- **AC-02 – Kiểm tra khách hàng trùng:** Given SĐT đã tồn tại when nhập SĐT đó then thông báo *"Khách hàng đã tồn tại trong hệ thống"*.
- **AC-03 – Tra cứu khách hàng:** Given khách hàng đã có when tìm kiếm bằng SĐT then hiển thị đúng hồ sơ khách hàng.
- **AC-04 – Cập nhật thông tin:** Given mở hồ sơ when thay đổi thông tin hợp lệ & chọn Lưu then cập nhật thành công.
- **AC-05 – Kiểm tra nguồn khách:** Given tạo/sửa hồ sơ when chọn Nguồn khách then hiển thị các tùy chọn `Facebook`, `Người quen`, `Vãng lai`.
- **AC-06 – Xem lịch sử giao dịch:** Given khách hàng có giao dịch when chọn Lịch sử giao dịch then hiển thị danh sách giao dịch liên quan.
- **AC-07 – Xem lịch sử sự kiện:** Given khách hàng từng tổ chức sự kiện when chọn Lịch sử sự kiện then hiển thị các sự kiện đã tổ chức.
- **AC-08 – Khách hàng chưa có lịch sử:** Given chưa có giao dịch/sự kiện when xem history then hiển thị *"Chưa có dữ liệu lịch sử"*.
- **AC-09 – Kiểm tra thông tin bắt buộc:** Given bỏ trống Họ tên hoặc SĐT when bấm Lưu then từ chối và yêu cầu bổ sung.
