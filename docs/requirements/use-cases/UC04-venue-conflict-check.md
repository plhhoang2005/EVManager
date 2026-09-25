# UC-04: Tra cứu sảnh tiệc và kiểm tra xung đột trùng lịch

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-04 |
| **Tên Use Case** | Tra cứu sảnh tiệc và kiểm tra xung đột trùng lịch |
| **Actor chính** | Nhân viên Tư vấn (Sales) |
| **Actor liên quan**| Điều phối sự kiện (Coordinator) |
| **Mục tiêu** | Cho phép người dùng tra cứu sảnh phù hợp theo ngày, ca tiệc và số bàn; đồng thời kiểm tra và ngăn chặn việc đặt trùng lịch. |
| **Trigger** | Sales/Coordinator cần kiểm tra sảnh để tư vấn hoặc lập lịch tổ chức sự kiện. |
| **Tiền điều kiện** | Người dùng đã đăng nhập và có quyền tra cứu sảnh/lịch sự kiện. |
| **Hậu điều kiện thành công** | Hệ thống trả về danh sách sảnh phù hợp và trạng thái khả dụng của từng sảnh. |
| **Hậu điều kiện thất bại** | Hệ thống không cho phép đặt lịch nếu phát hiện xung đột. |

---

## 2. Phạm vi chức năng & Quy định ca tiệc

### 2.1. Phạm vi chức năng
UC-04 bao gồm:
1. Nhập ngày tổ chức.
2. Chọn ca tiệc.
3. Nhập số bàn dự kiến.
4. Kiểm tra sức chứa sảnh.
5. Kiểm tra lịch sử dụng sảnh.
6. Tính thời gian đệm dọn sảnh (60 phút).
7. Xác định sảnh còn trống.
8. Cảnh báo sảnh bị trùng lịch.
9. Gợi ý sảnh thay thế có sức chứa tương đương.
10. Ngăn chặn việc cố tình đặt đè lịch.

### 2.2. Quy định ca tiệc & Thời gian đệm
- **Ca Trưa:** `10:00 – 14:00` (+60 phút đệm $\rightarrow$ bận đến `15:00`).
- **Ca Tối:** `17:00 – 21:00` (+60 phút đệm $\rightarrow$ bận đến `22:00`).
- **Thời gian đệm 60 phút** nhằm dọn dẹp sảnh, sắp xếp lại bàn ghế và kiểm tra trang thiết bị. Mỗi sảnh chỉ phục vụ tối đa 1 tiệc trong một ca.

---

## 3. Luồng chính – Basic Flow

- **B1:** Sales/Coordinator truy cập chức năng Tra cứu sảnh tiệc.
- **B2:** Người dùng nhập: Ngày tổ chức, Ca tiệc (`Trưa` / `Tối`), Số bàn dự kiến.
- **B3:** Người dùng chọn Tìm kiếm.
- **B4 (Kiểm tra khả dụng):**
  * Hệ thống lọc danh sách sảnh active.
  * Hệ thống kiểm tra sức chứa sảnh (loại bỏ sảnh có $\text{Sức chứa} < \text{Số bàn dự kiến}$).
  * Hệ thống kiểm tra lịch sử dụng sảnh kèm thời gian đệm 60 phút.
  * Hệ thống xác định trạng thái từng sảnh: `Còn trống`, `Đã được đặt`, `Không đủ sức chứa`.
  * Hệ thống hiển thị kết quả tìm kiếm rõ ràng.

---

## 4. Thuật toán kiểm tra xung đột

- **Bước 1 (Sức chứa):** Nếu $\text{Số bàn dự kiến} > \text{Sức chứa sảnh} \rightarrow$ loại sảnh.
- **Bước 2 (Khoảng thời gian bận):**
  * Ca Trưa: `10:00 – 15:00` (Gồm 4h tiệc + 1h đệm).
  * Ca Tối: `17:00 – 22:00` (Gồm 4h tiệc + 1h đệm).
- **Bước 3 (Giao thoa lịch):**
  $$\text{Thời gian mới bắt đầu} < \text{Thời gian cũ kết thúc} \quad \text{và} \quad \text{Thời gian mới kết thúc} > \text{Thời gian cũ bắt đầu}$$
  Nếu thỏa mãn điều kiện trên $\rightarrow$ **Xác định XUNG ĐỘT TRÙNG LỊCH**.

---

## 5. Luồng phụ – Alternative Flow

- **A1. Sảnh còn trống:** Không có xung đột $\rightarrow$ hiển thị *"Còn trống"* màu xanh $\rightarrow$ cho phép tiếp tục giữ chỗ/đặt sảnh.
- **A2. Sảnh bị trùng lịch:** Có xung đột $\rightarrow$ hiển thị *"Trùng lịch"* cảnh báo màu đỏ kèm thông tin sự kiện trùng $\rightarrow$ Hệ thống tự động hiển thị khu vực *"Gợi ý sảnh thay thế"* có cùng sức chứa & khung giờ khả dụng.
- **A3. Cố tình đặt đè lịch:** Người dùng cố nhấn xác nhận sảnh bị trùng $\rightarrow$ Hệ thống hiển thị cảnh báo đỏ: *"Đặt sảnh thất bại: Phát hiện xung đột lịch. Hệ thống không cho phép đặt trùng sảnh trong cùng khoảng thời gian."* và từ chối lưu hoàn toàn.

---

## 6. Luồng ngoại lệ – Exception Flow

- **E1. Chưa nhập ngày tổ chức:** Báo *"Vui lòng nhập ngày tổ chức."*
- **E2. Chưa chọn ca tiệc:** Báo *"Vui lòng chọn ca tiệc."*
- **E3. Số bàn không hợp lệ:** Số bàn $\le 0 \rightarrow$ Báo *"Số bàn phải lớn hơn 0."*
- **E4. Không tìm thấy sảnh phù hợp:** Không có sảnh đáp ứng $\rightarrow$ Báo *"Không có sảnh phù hợp với số bàn và thời gian đã chọn."* và gợi ý đổi ngày/ca tiệc.

---

## 7. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :---: | :--- |
| **BR-01** | Ca Trưa được quy định từ 10:00 đến 14:00. |
| **BR-02** | Ca Tối được quy định từ 17:00 đến 21:00. |
| **BR-03** | Một sảnh chỉ được phục vụ tối đa 1 tiệc trong một ca. |
| **BR-04** | Sau mỗi tiệc bắt buộc phải có thời gian đệm tối thiểu 60 phút để dọn và chuẩn bị sảnh. |
| **BR-05** | Sảnh chỉ phù hợp khi sức chứa đáp ứng số bàn dự kiến. |
| **BR-06** | Hệ thống phải kiểm tra lịch trước khi cho phép giữ chỗ/đặt sảnh. |
| **BR-07** | Khi phát hiện xung đột, hệ thống phải cảnh báo rõ ràng cho người dùng. |
| **BR-08** | Hệ thống không cho phép xác nhận đặt sảnh đang có xung đột lịch. |
| **BR-09** | Khi sảnh bị trùng, hệ thống phải gợi ý các sảnh còn trống có sức chứa tương đương. |
| **BR-10** | Thời gian đệm 60 phút phải được tính vào quá trình kiểm tra xung đột. |

---

## 8. Tiêu chí nghiệm thu – Acceptance Criteria

- **AC-01 – Tra cứu sảnh:** Given nhập ngày, ca tiệc và số bàn hợp lệ when tra cứu then hiển thị danh sách sảnh phù hợp.
- **AC-02 – Kiểm tra sức chứa:** Given số bàn lớn hơn sức chứa when tra cứu then không đề xuất sảnh đó.
- **AC-03 – Kiểm tra trùng lịch:** Given sảnh đã có tiệc cùng ca when tra cứu then xác định trùng lịch và hiển thị cảnh báo đỏ.
- **AC-04 – Kiểm tra thời gian đệm:** Given tiệc kết thúc 14:00 when kiểm tra lịch sảnh từ 14:00-15:00 then hệ thống xác định đang thời gian đệm và từ chối đặt lịch mới.
- **AC-05 – Gợi ý sảnh thay thế:** Given sảnh bị trùng lịch when kiểm tra xung đột then hệ thống tự gợi ý các sảnh trống có sức chứa tương đương.
- **AC-06 – Ngăn đặt đè lịch:** Given sảnh có lịch trùng when cố tình xác nhận đặt then hệ thống từ chối và báo *"Đặt sảnh thất bại: Phát hiện xung đột lịch."*
- **AC-07 – Không có sảnh phù hợp:** Given không sảnh nào đáp ứng when tra cứu then báo *"Không có sảnh phù hợp với số bàn và thời gian đã chọn."*
- **AC-08 – Dữ liệu tra cứu bắt buộc:** Given thiếu ngày, ca hoặc số bàn when chọn tìm kiếm then yêu cầu bổ sung thông tin.
