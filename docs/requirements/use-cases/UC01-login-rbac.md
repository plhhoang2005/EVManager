# UC-01: Đăng nhập hệ thống và phân quyền truy cập (RBAC)

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thuộc tính | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-01 |
| **Tên Use Case** | Đăng nhập hệ thống và phân quyền truy cập (RBAC) |
| **Mục tiêu** | Cho phép người dùng xác thực tài khoản và truy cập các chức năng theo đúng vai trò được phân quyền |
| **Actor chính** | Admin, Nhân viên Sales, Điều phối sự kiện (Coordinator) |
| **Actor phụ** | Hệ thống EVManager, Email Service |
| **Trigger** | Người dùng truy cập màn hình đăng nhập và thực hiện đăng nhập |
| **Tiền điều kiện** | Người dùng đã có tài khoản hợp lệ và tài khoản đang ở trạng thái hoạt động |
| **Hậu điều kiện thành công** | Người dùng được xác thực và chuyển đến Dashboard tương ứng với vai trò |
| **Hậu điều kiện thất bại** | Không tạo phiên đăng nhập; hệ thống hiển thị thông báo lỗi phù hợp |

---

## 2. Phân quyền RBAC

| Vai trò | Quyền truy cập chính |
| :--- | :--- |
| **Admin** | Quản lý người dùng, phân quyền, dữ liệu hệ thống, Dashboard và báo cáo |
| **Sales** | Quản lý khách hàng, tư vấn Menu/dịch vụ, báo giá, hợp đồng và theo dõi thanh toán |
| **Coordinator** | Quản lý lịch sự kiện, điều phối nhân sự, kiểm tra xung đột và cập nhật tiến độ sự kiện |

Hệ thống phải kiểm tra quyền dựa trên Role của tài khoản sau khi xác thực. Người dùng không được truy cập trực tiếp vào chức năng ngoài quyền được cấp.

---

## 3. Luồng chính – Basic Flow

- **Bước 1:** Người dùng truy cập màn hình Đăng nhập.
- **Bước 2:** Hệ thống hiển thị form gồm:
  * Username/Email
  * Mật khẩu
  * Nút Đăng nhập
  * Liên kết Quên mật khẩu.
- **Bước 3:** Người dùng nhập Username/Email và mật khẩu.
- **Bước 4:** Người dùng nhấn Đăng nhập.
- **Bước 5:** Hệ thống kiểm tra dữ liệu đầu vào.
- **Bước 6:** Hệ thống xác thực Username/Email và mật khẩu.
- **Bước 7:** Hệ thống kiểm tra trạng thái tài khoản.
- **Bước 8:** Hệ thống lấy thông tin Role của người dùng.
- **Bước 9:** Hệ thống tạo phiên đăng nhập và áp dụng quyền RBAC.
- **Bước 10:** Hệ thống điều hướng người dùng đến Dashboard tương ứng:
  * Admin $\rightarrow$ Admin Dashboard.
  * Sales $\rightarrow$ Sales Dashboard.
  * Coordinator $\rightarrow$ Coordinator Dashboard.
- **Bước 11:** Hệ thống ghi nhận thời điểm đăng nhập.
- **Kết thúc Use Case.**

---

## 4. Luồng phụ – Alternative Flow

### A1. Quên mật khẩu
- **A1.1:** Người dùng chọn Quên mật khẩu.
- **A1.2:** Hệ thống hiển thị form nhập Email.
- **A1.3:** Người dùng nhập Email đã đăng ký.
- **A1.4:** Hệ thống kiểm tra Email có tồn tại trong hệ thống hay không.
- **A1.5:** Nếu Email hợp lệ, hệ thống tạo mã OTP xác thực và thiết lập thời gian hiệu lực cho mã OTP.
- **A1.6:** Hệ thống gửi mã OTP đến Email đã đăng ký của người dùng.
- **A1.7:** Người dùng kiểm tra Email và nhập mã OTP vào hệ thống.
- **A1.8:** Hệ thống kiểm tra tính hợp lệ và thời hạn của mã OTP.
- **A1.9:** Nếu OTP hợp lệ, hệ thống cho phép người dùng tiếp tục đặt lại mật khẩu.
- **A1.10:** Hệ thống hiển thị form Nhập mật khẩu mới và Xác nhận mật khẩu mới.
- **A1.11:** Người dùng nhập mật khẩu mới và xác nhận mật khẩu.
- **A1.12:** Hệ thống kiểm tra điều kiện của mật khẩu mới và đảm bảo hai mật khẩu trùng khớp.
- **A1.13:** Nếu thông tin hợp lệ, hệ thống cập nhật mật khẩu mới cho tài khoản.
- **A1.14:** Hệ thống thông báo *"Đặt lại mật khẩu thành công"*.
- **A1.15:** Nếu Email không tồn tại trong hệ thống, hệ thống thông báo *"Email chưa được đăng ký"* và yêu cầu người dùng nhập lại Email.
- **A1.16:** Nếu mã OTP không chính xác, hệ thống thông báo *"Mã OTP không chính xác"* và cho phép người dùng nhập lại mã OTP.
- **A1.17:** Nếu mã OTP hết hạn, hệ thống thông báo *"Mã OTP đã hết hạn"* và cho phép người dùng yêu cầu gửi lại mã OTP.
- **A1.18:** Nếu mật khẩu mới không hợp lệ hoặc không trùng với mật khẩu xác nhận, hệ thống thông báo lỗi và yêu cầu người dùng nhập lại.
- **Kết thúc luồng A1.**

---

## 5. Luồng ngoại lệ – Exception Flow

### E1. Sai mật khẩu
- **E1.1:** Người dùng nhập sai mật khẩu.
- **E1.2:** Hệ thống thông báo thông tin đăng nhập không hợp lệ.
- **E1.3:** Hệ thống tăng số lần đăng nhập thất bại.
- **E1.4:** Nếu số lần sai $\le 5$ lần, người dùng được tiếp tục thử đăng nhập.
- **E1.5:** Nếu sai mật khẩu quá 5 lần, hệ thống khóa tài khoản tạm thời trong 15 phút.
- **E1.6:** Hệ thống thông báo: *"Tài khoản đã bị khóa tạm thời do đăng nhập sai quá số lần cho phép. Vui lòng thử lại sau 15 phút."*
- **E1.7:** Trong thời gian khóa, hệ thống từ chối các yêu cầu đăng nhập bằng tài khoản đó.
- **E1.8:** Sau 15 phút, tài khoản được mở khóa và người dùng có thể đăng nhập lại.

### E2. Tài khoản bị khóa
Nếu người dùng cố đăng nhập khi tài khoản đang trong thời gian khóa:
- **E2.1:** Hệ thống kiểm tra trạng thái tài khoản.
- **E2.2:** Phát hiện tài khoản đang bị khóa.
- **E2.3:** Hệ thống từ chối đăng nhập.
- **E2.4:** Hiển thị thời gian dự kiến tài khoản được mở khóa.

### E3. Tài khoản không tồn tại
- **E3.1:** Hệ thống không tìm thấy Username/Email.
- **E3.2:** Hệ thống từ chối đăng nhập.
- **E3.3:** Hiển thị thông báo: *"Thông tin đăng nhập không hợp lệ."*

### E4. Không có quyền truy cập
Trường hợp tài khoản xác thực thành công nhưng Role không hợp lệ hoặc không được cấu hình:
- **E4.1:** Hệ thống xác thực thành công.
- **E4.2:** Hệ thống không xác định được quyền truy cập hợp lệ.
- **E4.3:** Hệ thống không cho phép truy cập Dashboard.
- **E4.4:** Ghi nhận lỗi và thông báo người dùng liên hệ Admin.

---

## 6. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :---: | :--- |
| **BR-01** | Người dùng phải đăng nhập thành công trước khi truy cập các chức năng yêu cầu xác thực. |
| **BR-02** | Mỗi tài khoản phải được gán ít nhất một Role hợp lệ. |
| **BR-03** | Quyền truy cập được xác định dựa trên Role theo mô hình RBAC. |
| **BR-04** | Người dùng chỉ được truy cập các chức năng thuộc quyền của Role. |
| **BR-05** | Sai mật khẩu quá 5 lần thì tài khoản bị khóa tạm thời 15 phút. |
| **BR-06** | Khi tài khoản đang bị khóa, hệ thống không cho phép đăng nhập. |
| **BR-07** | Liên kết reset mật khẩu phải được gửi đến Email đã đăng ký của tài khoản. |
| **BR-08** | Sau khi đăng nhập thành công, hệ thống điều hướng người dùng đến Dashboard tương ứng với Role. |

---

## 7. Acceptance Criteria

- **AC-01 – Đăng nhập thành công:**
  * **Given** người dùng có tài khoản đang hoạt động và nhập đúng Username/Email cùng mật khẩu
  * **When** người dùng nhấn Đăng nhập
  * **Then** hệ thống xác thực thành công và điều hướng đến Dashboard tương ứng với Role.

- **AC-02 – Sai mật khẩu:**
  * **Given** người dùng nhập sai mật khẩu nhưng chưa vượt quá số lần cho phép
  * **When** người dùng nhấn Đăng nhập
  * **Then** hệ thống từ chối đăng nhập và thông báo thông tin đăng nhập không hợp lệ.

- **AC-03 – Khóa tài khoản:**
  * **Given** tài khoản đã có hơn 5 lần đăng nhập sai liên tiếp
  * **When** người dùng tiếp tục thực hiện đăng nhập
  * **Then** hệ thống khóa tài khoản tạm thời trong 15 phút và từ chối đăng nhập.

- **AC-04 – Tài khoản đang bị khóa:**
  * **Given** tài khoản đang trong thời gian khóa 15 phút
  * **When** người dùng cố gắng đăng nhập
  * **Then** hệ thống từ chối yêu cầu và thông báo tài khoản đang bị khóa.

- **AC-05 – Mở khóa:**
  * **Given** tài khoản đã hết thời gian khóa 15 phút
  * **When** người dùng nhập đúng thông tin đăng nhập
  * **Then** hệ thống cho phép đăng nhập và điều hướng đến Dashboard tương ứng.

- **AC-06 – Quên mật khẩu bằng OTP:**
  * **Given** người dùng có tài khoản và Email đã được đăng ký trong hệ thống
  * **When** người dùng chọn Quên mật khẩu và nhập Email hợp lệ
  * **Then** hệ thống tạo và gửi mã OTP đến Email đã đăng ký.
  * **AC-06.1 – Xác thực OTP:** Given người dùng đã nhận mã OTP, when nhập OTP còn hiệu lực then xác thực thành công.
  * **AC-06.2 – OTP không hợp lệ:** Given người dùng nhận mã OTP, when nhập sai OTP then thông báo *"Mã OTP không chính xác"*.
  * **AC-06.3 – OTP hết hạn:** Given mã OTP đã gửi, when nhập OTP hết hạn then thông báo *"Mã OTP đã hết hạn"*.
  * **AC-06.4 – Đặt lại mật khẩu:** Given xác thực OTP thành công, when nhập mật khẩu mới hợp lệ then hiển thị *"Đặt lại mật khẩu thành công"*.

- **AC-07 – Reset mật khẩu thành công:**
  * **Given** người dùng có liên kết reset mật khẩu còn hiệu lực
  * **When** người dùng nhập và xác nhận mật khẩu mới hợp lệ
  * **Then** hệ thống cập nhật mật khẩu và thông báo đặt lại mật khẩu thành công.

- **AC-08 – Phân quyền RBAC:**
  * **Given** người dùng đăng nhập thành công với một Role cụ thể
  * **When** người dùng truy cập hệ thống
  * **Then** hệ thống chỉ hiển thị và cho phép thực hiện các chức năng mà Role đó được cấp quyền.

- **AC-09 – Truy cập trái phép:**
  * **Given** người dùng đã đăng nhập nhưng không có quyền đối với một chức năng
  * **When** người dùng cố truy cập chức năng đó
  * **Then** hệ thống từ chối truy cập và hiển thị thông báo không đủ quyền.
