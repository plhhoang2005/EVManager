# UC-09: Lập hợp đồng tiệc cưới và quản lý điều khoản pháp lý

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-09 |
| **Tên Use Case** | Lập hợp đồng tiệc cưới và quản lý điều khoản pháp lý |
| **Actor chính** | Nhân viên tư vấn (Sales) |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Admin/Quản lý, Hệ thống EVManager |
| **Mục tiêu** | Tạo, kiểm tra, ký duyệt, lưu trữ và in hợp đồng tiệc cưới theo thông tin báo giá đã được khách hàng xác nhận. |
| **Trigger** | Sales hoặc khách hàng yêu cầu chuyển từ báo giá đã được xác nhận sang lập hợp đồng tiệc cưới. |
| **Tiền điều kiện** | Báo giá đã ở trạng thái được khách hàng xác nhận; thông tin khách hàng, sảnh, thực đơn và dịch vụ đã đầy đủ. |
| **Hậu điều kiện thành công** | Hợp đồng được tạo với mã duy nhất `HD-YYYYMMDD-XXX`, lưu vào hệ thống, có trạng thái rõ ràng, hỗ trợ ký điện tử và xuất/in bản hợp đồng khổ A4. |
| **Hậu điều kiện thất bại** | Hợp đồng không được tạo/phát hành, hệ thống thông báo lỗi thiếu thông tin hoặc trùng lặp dữ liệu. |

---

## 2. Phạm vi chức năng

Use Case cho phép nhân viên Sales:
1. Tạo hợp đồng từ báo giá đã được khách hàng xác nhận.
2. Tự động lấy thông tin khách hàng và thông tin tiệc.
3. Xác định thông tin Bên A (Nhà hàng) và Bên B (Khách hàng).
4. Ghi nhận thời gian, sảnh, số bàn và thực đơn.
5. Ghi nhận các dịch vụ đi kèm.
6. Quản lý các điều khoản pháp lý của hợp đồng.
7. Quy định trách nhiệm khi làm hư hại tài sản của sảnh tiệc.
8. Quy định điều khoản hoàn/hủy tiền cọc.
9. Sinh mã hợp đồng duy nhất theo định dạng `HD-YYYYMMDD-XXX`.
10. Gửi hợp đồng cho khách hàng ký điện tử.
11. Theo dõi trạng thái ký duyệt.
12. Lưu hợp đồng sau khi hoàn tất.
13. In hợp đồng trên khổ giấy A4 theo mẫu chuẩn.

---

## 3. Cấu trúc hợp đồng

Hợp đồng được hệ thống tạo theo mẫu thống nhất gồm các nhóm thông tin sau:

### 3.1. Thông tin trung tâm – Bên A
Bao gồm:
- Tên trung tâm/nhà hàng.
- Địa chỉ.
- Số điện thoại.
- Email.
- Mã số thuế (nếu có).
- Người đại diện.
- Chức vụ người đại diện.
- Thông tin liên hệ.

### 3.2. Thông tin khách hàng – Bên B
Bao gồm:
- Họ và tên khách hàng.
- Số điện thoại.
- Địa chỉ.
- Email.
- Số CCCD/Thông tin định danh (nếu chính sách hợp đồng yêu cầu).
- Thông tin liên hệ khác.

### 3.3. Thông tin sự kiện
Bao gồm:
- Ngày tổ chức.
- Thời gian bắt đầu.
- Thời gian kết thúc dự kiến.
- Tên/loại sự kiện.
- Số lượng bàn tiệc.
- Sảnh tổ chức.
- Ghi chú đặc biệt.

### 3.4. Thông tin thực đơn
Hợp đồng lấy dữ liệu từ báo giá đã được xác nhận:

| Nội dung | Thông tin |
| :--- | :--- |
| **Set Menu** | Tên Set Menu |
| **Số lượng** | Số bàn sử dụng |
| **Đơn giá** | Giá/Set Menu/bàn |
| **Thành tiền** | Số bàn × Đơn giá |
| **Món tùy chỉnh** | Các món thay đổi nếu có |
| **Ghi chú** | Yêu cầu đặc biệt |

*Trường hợp sử dụng nhiều Set Menu, hệ thống phải thể hiện riêng từng Set Menu và số lượng tương ứng.*

### 3.5. Thông tin dịch vụ
Bao gồm:
- Trang trí hoa tươi.
- Âm thanh – ánh sáng.
- Ban nhạc.
- MC.
- Tháp rượu/bánh cưới.
- Các dịch vụ bổ sung khác.
- Dịch vụ được tặng kèm.
- Dịch vụ phát sinh (nếu có).

*Thông tin dịch vụ phải được lấy từ báo giá đã xác nhận để đảm bảo tính thống nhất giữa Báo giá $\rightarrow$ Hợp đồng.*

---

## 4. Điều khoản pháp lý

### 4.1. Điều khoản trách nhiệm bảo quản tài sản
Hợp đồng phải có điều khoản quy định trách nhiệm của khách hàng và các bên liên quan đối với tài sản, trang thiết bị và cơ sở vật chất của trung tâm.
- Khách hàng có trách nhiệm bảo quản tài sản được bàn giao trong thời gian tổ chức sự kiện.
- Không tự ý di chuyển, tháo lắp hoặc sử dụng sai mục đích các thiết bị của trung tâm.
- Trường hợp tài sản bị mất, hư hỏng do lỗi của khách hàng hoặc người do khách hàng quản lý, trách nhiệm bồi thường được thực hiện theo mức thiệt hại thực tế và chính sách hợp đồng.
- Chi phí bồi thường có thể được ghi nhận thành khoản phát sinh khi quyết toán.

*Lưu ý: Mức bồi thường cụ thể phải được cấu hình theo chính sách của trung tâm hoặc thỏa thuận trong hợp đồng; Use Case không tự quy định một tỷ lệ cố định.*

### 4.2. Điều khoản hoàn/hủy tiền cọc
Hợp đồng phải quy định rõ:
- Số tiền đặt cọc.
- Ngày thanh toán cọc.
- Điều kiện được hoàn cọc.
- Điều kiện hủy tiệc.
- Thời điểm khách hàng yêu cầu hủy.
- Khoản tiền được hoàn hoặc khoản khấu trừ nếu có.
- Trường hợp trung tâm hủy hoặc không thể cung cấp dịch vụ.
- Cách xử lý khoản tiền cọc khi hai bên thay đổi thỏa thuận.

*Các mức hoàn/hủy cọc được cấu hình theo chính sách của trung tâm hoặc thỏa thuận trong hợp đồng.*

---

## 5. Sinh mã hợp đồng

Khi tạo hợp đồng, hệ thống tự động sinh mã hợp đồng duy nhất theo format:
$$\text{HD-YYYYMMDD-XXX}$$

Trong đó:
- **HD:** Tiền tố nhận diện hợp đồng.
- **YYYY:** Năm tạo hợp đồng.
- **MM:** Tháng tạo hợp đồng.
- **DD:** Ngày tạo hợp đồng.
- **XXX:** Số thứ tự hợp đồng trong ngày (3 chữ số, ví dụ `001`, `002`).

**Ví dụ:**
- Hợp đồng đầu tiên ngày 26/09/2026: `HD-20260926-001`
- Hợp đồng tiếp theo: `HD-20260926-002`

**Quy tắc:**
- Mã hợp đồng được hệ thống tự động sinh.
- Không cho phép trùng mã hợp đồng.
- Người dùng không được tự ý sửa mã sau khi hợp đồng được phát hành.
- Nếu tạo bản hợp đồng mới do điều chỉnh nội dung, hệ thống phải lưu lịch sử phiên bản.

---

## 6. Luồng chính – Lập hợp đồng

- **Bước 1. Mở chức năng lập hợp đồng:** Sales chọn chức năng Lập hợp đồng từ báo giá đã được khách hàng xác nhận.
- **Bước 2. Hệ thống kiểm tra dữ liệu:** Báo giá tồn tại, chưa bị hủy, còn hiệu lực/đã xác nhận; thông tin khách hàng, sảnh, thời gian, thực đơn và dịch vụ đầy đủ.
- **Bước 3. Tạo mã hợp đồng:** Hệ thống tự động sinh mã theo format `HD-YYYYMMDD-XXX`.
- **Bước 4. Tạo nội dung hợp đồng:** Hệ thống tự động lấy dữ liệu từ báo giá và điền vào Bên A, Bên B, Thông tin sự kiện, Sảnh, Thực đơn, Dịch vụ, Giá trị hợp đồng, Tiền cọc, Điều khoản.
- **Bước 5. Sales kiểm tra:** Sales kiểm tra và bổ sung các thông tin còn thiếu.
- **Bước 6. Kiểm tra điều khoản:** Hệ thống kiểm tra các điều khoản bắt buộc (Bảo quản tài sản, Bồi thường thiệt hại, Hoàn/hủy cọc, Thanh toán, Thay đổi dịch vụ).
- **Bước 7. Phát hành hợp đồng:** Sales chọn Phát hành hợp đồng. Trạng thái chuyển: **Nháp $\rightarrow$ Chờ ký**.
- **Bước 8. Gửi hợp đồng cho khách hàng:** Hệ thống gửi hợp đồng điện tử cho khách hàng. Khách hàng mở và kiểm tra nội dung.
- **Bước 9. Khách hàng ký:** Khách hàng thực hiện ký/xác nhận hợp đồng điện tử. Ghi nhận người ký, thời điểm ký, trạng thái ký, phiên bản.
- **Bước 10. Hoàn tất ký duyệt:** Sau khi hoàn tất ký duyệt, trạng thái chuyển: **Chờ ký $\rightarrow$ Đã ký**. Hợp đồng được lưu vào lịch sử giao dịch.

---

## 7. Luồng thay thế

- **ALT-01: Khách hàng yêu cầu chỉnh sửa:** Khách chưa đồng ý nội dung $\rightarrow$ Yêu cầu chỉnh sửa $\rightarrow$ Trạng thái chuyển "Yêu cầu điều chỉnh" $\rightarrow$ Sales chỉnh sửa $\rightarrow$ Phát hành lại hợp đồng. Hệ thống lưu phiên bản trước đó để truy vết.
- **ALT-02: Khách hàng từ chối ký:** Hệ thống chuyển trạng thái: **Chờ ký $\rightarrow$ Từ chối ký**. Sales có thể liên hệ điều chỉnh nội dung hoặc hủy giao dịch.
- **ALT-03: Thông tin không đầy đủ:** Nếu thiếu thông tin bắt buộc $\rightarrow$ Hệ thống không cho phép phát hành, hiển thị danh sách trường thiếu. Sales bổ sung thông tin trước khi phát hành.
- **ALT-04: Điều chỉnh sau khi đã phát hành:** Nếu cần thay đổi sau khi phát hành $\rightarrow$ Không sửa trực tiếp bản đã phát hành. Tạo phiên bản hợp đồng mới, lưu lịch sử phiên bản, hủy hiệu lực bản cũ nếu chính sách cho phép.

---

## 8. In hợp đồng khổ A4

Hệ thống cung cấp chức năng In hợp đồng với yêu cầu định dạng:
- **Khổ giấy:** A4.
- **Hướng giấy:** Dọc (trừ trường hợp mẫu quy định khác).
- **Trình bày:** Căn chỉnh theo mẫu hợp đồng hành chính. Có tiêu đề hợp đồng, thông tin Bên A và Bên B, nội dung điều khoản, phần xác nhận/ký tên của các bên, số hợp đồng, ngày ký. Phân trang tự động, không làm mất nội dung khi chuyển trang.
- **Thao tác:** Sales chọn `Hợp đồng` $\rightarrow$ `In hợp đồng` $\rightarrow$ `Chọn máy in / Xuất PDF`. Hệ thống tạo bản hợp đồng A4 dựa trên phiên bản hợp đồng hiện hành.

---

## 9. Trạng thái hợp đồng

| Trạng thái | Ý nghĩa |
| :--- | :--- |
| **Nháp** | Hợp đồng đang được Sales soạn thảo |
| **Chờ ký** | Đã phát hành và đang chờ khách hàng ký |
| **Yêu cầu điều chỉnh** | Khách hàng yêu cầu thay đổi nội dung |
| **Đã ký** | Các bên đã hoàn tất ký hợp đồng |
| **Từ chối ký** | Khách hàng từ chối ký hợp đồng |
| **Đã hủy** | Hợp đồng bị hủy |
| **Hoàn tất** | Hợp đồng đã thực hiện xong nghĩa vụ dịch vụ |

---

## 10. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :---: | :--- | :--- |
| **EX-01** | Không tìm thấy báo giá | Không cho tạo hợp đồng |
| **EX-02** | Thiếu thông tin khách hàng | Yêu cầu bổ sung thông tin trước khi tạo |
| **EX-03** | Thiếu thông tin sảnh/thời gian | Không cho phát hành hợp đồng |
| **EX-04** | Mã hợp đồng bị trùng | Tự động sinh mã khác |
| **EX-05** | Khách hàng chưa ký | Giữ trạng thái Chờ ký |
| **EX-06** | Lỗi gửi hợp đồng | Thông báo lỗi và cho phép gửi lại |
| **EX-07** | Hợp đồng đã ký nhưng yêu cầu thay đổi | Tạo phiên bản hợp đồng mới |
| **EX-08** | Lỗi in / Xuất PDF | Thông báo lỗi và cho phép thực hiện lại |

---

## 11. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| :---: | :--- |
| **BR-09-01** | Hợp đồng phải được tạo từ báo giá/giao dịch hợp lệ. |
| **BR-09-02** | Hợp đồng phải có đầy đủ thông tin Bên A và Bên B trước khi phát hành. |
| **BR-09-03** | Hợp đồng phải xác định ngày, thời gian và sảnh tổ chức. |
| **BR-09-04** | Hợp đồng phải thể hiện thực đơn và số lượng bàn. |
| **BR-09-05** | Hợp đồng phải thể hiện các dịch vụ đã đăng ký. |
| **BR-09-06** | Hợp đồng phải có điều khoản trách nhiệm đối với tài sản của sảnh tiệc. |
| **BR-09-07** | Hợp đồng phải có điều khoản hoàn/hủy tiền cọc. |
| **BR-09-08** | Mã hợp đồng phải duy nhất và theo format `HD-YYYYMMDD-XXX`. |
| **BR-09-09** | Không được phát hành hợp đồng khi thiếu thông tin bắt buộc. |
| **BR-09-10** | Hợp đồng đã phát hành phải được quản lý theo phiên bản. |
| **BR-09-11** | Hợp đồng đã ký không được chỉnh sửa trực tiếp. |
| **BR-09-12** | Mọi thay đổi sau khi ký phải tạo phiên bản hợp đồng mới theo chính sách. |
| **BR-09-13** | Hợp đồng phải lưu lịch sử trạng thái và thời điểm thay đổi. |
| **BR-09-14** | Bản in phải sử dụng khổ giấy A4 theo mẫu hợp đồng của trung tâm. |

---

## 12. Tiêu chí nghiệm thu

| Mã | Tiêu chí |
| :---: | :--- |
| **AC-09-01** | Sales có thể tạo hợp đồng từ báo giá hợp lệ. |
| **AC-09-02** | Hệ thống tự động lấy đúng thông tin khách hàng. |
| **AC-09-03** | Hệ thống lấy đúng sảnh, thời gian và số bàn. |
| **AC-09-04** | Hệ thống lấy đúng Set Menu và dịch vụ đã xác nhận. |
| **AC-09-05** | Hợp đồng có đầy đủ điều khoản pháp lý bắt buộc. |
| **AC-09-06** | Hệ thống tự động sinh mã `HD-YYYYMMDD-XXX`. |
| **AC-09-07** | Không tồn tại hai hợp đồng có cùng mã. |
| **AC-09-08** | Khách hàng có thể xem và ký hợp đồng điện tử. |
| **AC-09-09** | Hệ thống ghi nhận trạng thái và thời gian ký. |
| **AC-09-10** | Hệ thống lưu lịch sử phiên bản hợp đồng. |
| **AC-09-11** | Hệ thống cho phép xuất/in hợp đồng khổ A4. |
| **AC-09-12** | Nội dung bản in phải khớp với phiên bản hợp đồng hiện hành. |

---

## 13. Hậu điều kiện

Sau khi Use Case hoàn tất:
- Hợp đồng được lưu trong hệ thống với mã số duy nhất.
- Thông tin khách hàng và tiệc được liên kết với hợp đồng.
- Các điều khoản pháp lý được lưu cùng hợp đồng.
- Hợp đồng có trạng thái rõ ràng và lịch sử ký duyệt được ghi nhận.
- Hỗ trợ xuất PDF và in khổ A4.
- Hợp đồng đã ký sẵn sàng chuyển sang bước thanh toán/đặt cọc và thực hiện tiệc.
