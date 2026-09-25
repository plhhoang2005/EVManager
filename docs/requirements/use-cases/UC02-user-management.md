# UC-02: Quản lý thông tin tài khoản nhân viên

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-02 |
| **Tên Use Case** | Quản lý tài khoản người dùng và phân quyền |
| **Actor chính** | Quản trị viên (Admin) |
| **Mục tiêu** | Cho phép Admin quản lý tài khoản nhân viên, phân quyền vai trò và kiểm soát trạng thái hoạt động của tài khoản. |
| **Trigger** | Admin truy cập chức năng Quản lý tài khoản. |
| **Tiền điều kiện** | Admin đã đăng nhập và có quyền quản lý tài khoản. |
| **Hậu điều kiện thành công** | Thông tin tài khoản, vai trò hoặc trạng thái tài khoản được cập nhật thành công. |
| **Hậu điều kiện thất bại** | Dữ liệu không được thay đổi và hệ thống hiển thị thông báo lỗi tương ứng. |

---

## 2. Phạm vi chức năng

Admin có thể thực hiện các thao tác:
1. Xem danh sách nhân viên.
2. Thêm mới tài khoản nhân viên.
3. Phân quyền vai trò (Role).
4. Đổi mật khẩu tài khoản.
5. Khóa tài khoản.
6. Kích hoạt tài khoản.
7. Hủy kích hoạt tài khoản.

---

## 3. Luồng chính – Basic Flow

### B1. Xem danh sách tài khoản
- **B1.1:** Admin đăng nhập vào hệ thống.
- **B1.2:** Admin chọn chức năng Quản lý tài khoản.
- **B1.3:** Hệ thống kiểm tra quyền truy cập của Admin.
- **B1.4:** Hệ thống hiển thị danh sách tài khoản nhân viên (gồm: Mã NV, Họ tên, Email công ty, Vai trò, Trạng thái, Ngày tạo).
- **B1.5:** Admin có thể tìm kiếm hoặc lọc tài khoản theo thông tin phù hợp.

### B2. Thêm mới tài khoản
- **B2.1:** Admin chọn Thêm tài khoản.
- **B2.2:** Hệ thống hiển thị form nhập thông tin tài khoản.
- **B2.3:** Admin nhập: Họ tên, Mã NV, Email công ty, Mật khẩu, Xác nhận mật khẩu, Vai trò.
- **B2.4:** Admin chọn Lưu.
- **B2.5:** Hệ thống kiểm tra tính hợp lệ của dữ liệu.
- **B2.6:** Hệ thống kiểm tra Email công ty đã tồn tại hay chưa.
- **B2.7:** Nếu dữ liệu hợp lệ và Email chưa tồn tại, hệ thống tạo tài khoản.
- **B2.8:** Hệ thống thông báo *"Tạo tài khoản thành công"*.
- **B2.9:** Tài khoản mới được hiển thị trong danh sách tài khoản.

### B3. Phân quyền vai trò
- **B3.1:** Admin chọn một tài khoản nhân viên.
- **B3.2:** Admin chọn chức năng Phân quyền.
- **B3.3:** Hệ thống hiển thị danh sách Role được phép gán (Sales, Coordinator...).
- **B3.4:** Admin chọn Role cho tài khoản.
- **B3.5:** Admin xác nhận phân quyền.
- **B3.6:** Hệ thống cập nhật Role cho tài khoản.
- **B3.7:** Hệ thống thông báo *"Phân quyền thành công"*.

### B4. Đổi mật khẩu
- **B4.1:** Admin chọn tài khoản cần đổi mật khẩu.
- **B4.2:** Admin chọn Đổi mật khẩu.
- **B4.3:** Hệ thống hiển thị form nhập mật khẩu mới và xác nhận mật khẩu.
- **B4.4:** Admin nhập mật khẩu mới.
- **B4.5:** Hệ thống kiểm tra điều kiện mật khẩu.
- **B4.6:** Nếu mật khẩu hợp lệ, hệ thống cập nhật mật khẩu.
- **B4.7:** Hệ thống thông báo *"Đổi mật khẩu thành công"*.

### B5. Khóa tài khoản
- **B5.1:** Admin chọn tài khoản cần khóa.
- **B5.2:** Admin chọn Khóa tài khoản.
- **B5.3:** Hệ thống hiển thị thông báo xác nhận.
- **B5.4:** Admin xác nhận khóa tài khoản.
- **B5.5:** Hệ thống chuyển trạng thái tài khoản sang *"Đã khóa"*.
- **B5.6:** Tài khoản bị khóa không thể đăng nhập vào hệ thống.
- **B5.7:** Hệ thống thông báo *"Khóa tài khoản thành công"*.

### B6. Kích hoạt tài khoản
- **B6.1:** Admin chọn tài khoản đang ở trạng thái *"Đã khóa"* hoặc *"Không hoạt động"*.
- **B6.2:** Admin chọn Kích hoạt tài khoản.
- **B6.3:** Hệ thống hiển thị thông báo xác nhận.
- **B6.4:** Admin xác nhận kích hoạt.
- **B6.5:** Hệ thống chuyển trạng thái tài khoản sang *"Hoạt động"*.
- **B6.6:** Người dùng có thể đăng nhập và sử dụng các chức năng theo Role được cấp.
- **B6.7:** Hệ thống thông báo *"Kích hoạt tài khoản thành công"*.

### B7. Hủy kích hoạt tài khoản
- **B7.1:** Admin chọn tài khoản đang hoạt động.
- **B7.2:** Admin chọn Hủy kích hoạt.
- **B7.3:** Hệ thống yêu cầu Admin xác nhận.
- **B7.4:** Admin xác nhận hủy kích hoạt.
- **B7.5:** Hệ thống chuyển trạng thái tài khoản sang *"Không hoạt động"*.
- **B7.6:** Người dùng không thể đăng nhập vào hệ thống.
- **B7.7:** Hệ thống thông báo *"Hủy kích hoạt tài khoản thành công"*.

---

## 4. Luồng phụ – Alternative Flow

- **A1. Email công ty đã tồn tại:** Hệ thống phát hiện Email trùng $\rightarrow$ thông báo *"Email công ty đã được sử dụng"*.
- **A2. Mật khẩu không hợp lệ:** Không đủ 8 ký tự, thiếu chữ hoa hoặc chữ số $\rightarrow$ thông báo *"Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa và 1 chữ số."*
- **A3. Mật khẩu xác nhận không khớp:** Nhập 2 lần khác nhau $\rightarrow$ thông báo *"Mật khẩu xác nhận không khớp"*.
- **A4. Hủy thao tác:** Admin chọn Hủy $\rightarrow$ hệ thống không lưu thay đổi và quay lại danh sách.

---

## 5. Luồng ngoại lệ – Exception Flow

- **E1. Không có quyền truy cập:** Người dùng không phải Admin cố truy cập $\rightarrow$ hệ thống báo *"Bạn không có quyền thực hiện chức năng này."*
- **E2. Dữ liệu bắt buộc bị thiếu:** Bỏ trống trường $\rightarrow$ hệ thống báo đỏ trường bị thiếu.
- **E3. Lỗi hệ thống:** Gián đoạn DB $\rightarrow$ thông báo *"Không thể thực hiện thao tác. Vui lòng thử lại sau."*

---

## 6. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :---: | :--- |
| **BR-01** | Chỉ Admin mới được phép quản lý tài khoản và phân quyền. |
| **BR-02** | Email công ty của mỗi tài khoản phải là duy nhất trong hệ thống. |
| **BR-03** | Mật khẩu phải có tối thiểu 8 ký tự. |
| **BR-04** | Mật khẩu phải bao gồm ít nhất 1 chữ hoa và 1 chữ số. |
| **BR-05** | Tài khoản chỉ được sử dụng khi ở trạng thái Hoạt động. |
| **BR-06** | Tài khoản ở trạng thái Không hoạt động/Đã khóa không được phép đăng nhập. |
| **BR-07** | Mỗi tài khoản phải được gán Role phù hợp để xác định quyền truy cập. |
| **BR-08** | Khi thay đổi Role, quyền truy cập của tài khoản phải được cập nhật theo Role mới. |
| **BR-09** | Hệ thống phải yêu cầu Admin xác nhận trước khi khóa hoặc hủy kích hoạt tài khoản. |
| **BR-10** | Việc kích hoạt tài khoản phải chuyển trạng thái tài khoản sang Hoạt động. |

---

## 7. Tiêu chí nghiệm thu – Acceptance Criteria

- **AC-01 – Xem danh sách nhân viên:** Given Admin đã đăng nhập when mở chức năng then hiển thị danh sách nhân viên & trạng thái.
- **AC-02 – Thêm tài khoản thành công:** Given thông tin hợp lệ & email chưa tồn tại when lưu then hiển thị *"Tạo tài khoản thành công"*.
- **AC-03 – Email công ty bị trùng:** Given Email đã có in system when dùng lại then từ chối & báo *"Email công ty đã được sử dụng"*.
- **AC-04 – Kiểm tra mật khẩu:** Given mật khẩu yếu when lưu then từ chối & hiển thị quy định định dạng mật khẩu.
- **AC-05 – Phân quyền Role:** Given gán Role hợp lệ when lưu then cập nhật quyền theo Role mới.
- **AC-06 – Khóa tài khoản:** Given tài khoản Hoạt động when chọn Khóa then chuyển Đã khóa & chặn đăng nhập.
- **AC-07 – Kích hoạt tài khoản:** Given tài khoản Đã khóa when chọn Kích hoạt then chuyển Hoạt động & mở lại quyền đăng nhập.
- **AC-08 – Hủy kích hoạt tài khoản:** Given tài khoản Hoạt động when chọn Hủy kích hoạt then chuyển Không hoạt động.
- **AC-09 – Không có quyền truy cập:** Given user không có Role Admin when truy cập then báo *"Bạn không có quyền thực hiện chức năng này."*
