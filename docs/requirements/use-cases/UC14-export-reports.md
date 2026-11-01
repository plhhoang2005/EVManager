# UC-14: Xuất báo cáo thống kê định dạng Excel và PDF

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-14 |
| **Tên Use Case** | Xuất báo cáo thống kê định dạng Excel và PDF |
| **Actor chính** | Ban Giám đốc |
| **Actor phụ** | Kế toán trưởng |
| **Hệ thống** | EVManager |
| **Mục tiêu** | Cho phép người có quyền tạo và xuất các báo cáo thống kê theo thời gian dưới dạng Excel hoặc PDF |
| **Mức độ ưu tiên** | Should Have |
| **Tần suất sử dụng** | Hàng ngày / hàng tuần / hàng tháng / hàng quý |

---

## 2. Phạm vi chức năng

UC-14 cho phép Ban Giám đốc và Kế toán trưởng:
- Chọn loại báo cáo cần xuất.
- Lọc dữ liệu theo thời gian.
- Xuất báo cáo doanh thu theo tháng.
- Xuất báo cáo tổng hợp danh sách sự kiện.
- Xuất thông tin khách hàng đi kèm sự kiện.
- Xuất tình trạng công nợ của từng sự kiện/hợp đồng.
- Xuất dữ liệu dưới định dạng Excel (`.xlsx`).
- Xuất báo cáo dưới định dạng PDF (`.pdf`).
- Tạo báo cáo có logo của trung tâm.
- Hiển thị thông tin người đại diện và khu vực ký xác nhận.
- Hỗ trợ đóng dấu pháp lý trên báo cáo PDF khi mẫu báo cáo yêu cầu.

---

## 3. Phân loại báo cáo

Hệ thống cung cấp tối thiểu 2 loại báo cáo:

### 3.1. Báo cáo doanh thu theo tháng
Dùng để thống kê tình hình doanh thu theo từng tháng trong khoảng thời gian được chọn. Các thông tin gồm: Tháng, Tổng doanh thu, Số lượng tiệc, Giá trị trung bình/tiệc, Tổng tiền cọc, Tổng tiền đã thanh toán, Tổng công nợ còn lại.

### 3.2. Báo cáo tổng hợp sự kiện và công nợ
Dùng để theo dõi danh sách các sự kiện và tình trạng thanh toán. Các thông tin gồm: Mã sự kiện, Mã hợp đồng, Tên khách hàng, Số điện thoại, Ngày tổ chức, Sảnh, Số bàn, Tổng giá trị hợp đồng, Tiền cọc, Số tiền đã thanh toán, Công nợ còn lại, Tình trạng công nợ, Trạng thái sự kiện.

---

## 4. Bộ lọc thời gian

Trước khi xuất báo cáo, người dùng lựa chọn khoảng thời gian cần thống kê.

| Bộ lọc | Mô tả |
| :--- | :--- |
| **Theo tuần** | Từ đầu tuần đến cuối tuần được chọn |
| **Theo tháng** | Toàn bộ dữ liệu trong tháng được chọn |
| **Theo quý** | Quý I, II, III hoặc IV của năm được chọn |
| **Khoảng ngày tùy chọn** | Người dùng nhập ngày bắt đầu và ngày kết thúc |

**Quy tắc:**
- Ngày bắt đầu không được lớn hơn ngày kết thúc.
- Hệ thống chỉ lấy dữ liệu nằm trong khoảng thời gian được chọn.
- Khi thay đổi bộ lọc, dữ liệu xem trước phải được cập nhật.
- Khoảng thời gian được lưu trong thông tin báo cáo để xác định phạm vi dữ liệu.

---

## 5. Mẫu báo cáo doanh thu Excel

### 5.1. Phần tiêu đề
File Excel được tạo với cấu trúc:
```text
Tên trung tâm tiệc cưới
BÁO CÁO DOANH THU THEO THÁNG
Thời gian: [Từ ngày] – [Đến ngày]
```

### 5.2. Bảng dữ liệu

| STT | Tháng | Số tiệc | Doanh thu | Tiền cọc | Đã thanh toán | Công nợ |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- |
| 1 | Tháng 1 | 12 | ... | ... | ... | ... |
| 2 | Tháng 2 | 15 | ... | ... | ... | ... |
| 3 | Tháng 3 | 18 | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... |
| **Tổng** | | **...** | **...** | **...** | **...** | **...** |
| **Trung bình** | | **...** | **...** | | | |

### 5.3. Công thức Excel
Hệ thống phải tạo các công thức Excel thay vì chỉ ghi giá trị tĩnh đối với các trường tổng hợp:
- **Tổng doanh thu**: `=SUM(D5:D16)`
- **Tổng tiền cọc**: `=SUM(E5:E16)`
- **Tổng tiền đã thanh toán**: `=SUM(F5:F16)`
- **Tổng công nợ**: `=SUM(G5:G16)`
- **Doanh thu trung bình/tháng**: `=AVERAGE(D5:D16)`
- **Số tiệc trung bình/tháng**: `=AVERAGE(C5:C16)`

---

## 6. Mẫu báo cáo tổng hợp sự kiện và công nợ

Báo cáo Excel/PDF phải có bảng tổng hợp:

| STT | Mã HĐ | Khách hàng | SĐT | Ngày tổ chức | Sảnh | Số bàn | Tổng HĐ | Tiền cọc | Đã trả | Còn nợ | Tình trạng nợ | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | HD-... | Nguyễn Văn A | 09... | 03/10/2026 | Kim Cương | 30 | ... | ... | ... | ... | Còn nợ | Đã cọc |
| 2 | HD-... | Trần Văn B | 09... | 04/10/2026 | Vàng | 20 | ... | ... | ... | ... | Đã thanh toán | Đã hoàn tất |

**Công thức công nợ:**
$$\text{Công nợ còn lại} = \text{Tổng giá trị hợp đồng} - \text{Tổng số tiền đã thanh toán}$$
- **Đã thanh toán**: Công nợ = 0.
- **Còn nợ**: Công nợ > 0.
- **Quá hạn**: Công nợ > 0 và đã vượt thời hạn thanh toán theo hợp đồng.

---

## 7. Xuất báo cáo Excel

**Luồng thực hiện:**
1. Người dùng mở chức năng Báo cáo.
2. Chọn loại báo cáo và bộ lọc thời gian.
3. Hệ thống kiểm tra điều kiện lọc và truy xuất dữ liệu.
4. Hiển thị dữ liệu xem trước.
5. Người dùng chọn **Xuất Excel**.
6. Hệ thống tạo file `.xlsx`, đưa dữ liệu và công thức vào file.
7. Người dùng lưu file về máy.

**Yêu cầu file Excel:** Đúng phạm vi thời gian, có tiêu đề, thời gian lập, bảng dữ liệu, dòng tổng cộng, công thức `SUM`, `AVERAGE`, định dạng tiền tệ và cho phép chỉnh sửa phân tích thêm.

---

## 8. Mẫu báo cáo PDF

Báo cáo PDF được thiết kế theo mẫu báo cáo chính thức của trung tâm:
- **Phần đầu trang**: Logo trung tâm, Tên trung tâm, Địa chỉ, Số điện thoại/Email, Tên báo cáo, Khoảng thời gian thống kê.
- **Phần nội dung**: Các thông tin thống kê chính, Bảng dữ liệu, Tổng doanh thu, Số tiệc, Giá trị trung bình, Đã thanh toán, Công nợ, Ghi chú.
- **Phần cuối trang**: Ngày lập báo cáo, Người lập báo cáo, Đại diện trung tâm, Khu vực chữ ký và đóng dấu.

```text
Ngày ..... tháng ..... năm .....

        NGƯỜI LẬP BÁO CÁO              ĐẠI DIỆN TRUNG TÂM
             (Ký, ghi rõ họ tên)          (Ký, ghi rõ họ tên)

                                      [ ĐÓNG DẤU ]
```

---

## 9. Yêu cầu logo, chữ ký và đóng dấu

- **Logo**: Lấy từ thông tin cấu hình trung tâm, hiển thị đầu báo cáo PDF, bảo đảm không làm biến dạng tỷ lệ.
- **Chữ ký**: Khu vực xác nhận gồm Họ tên, Chức vụ, Ngày ký, Chữ ký điện tử/Hình ảnh chữ ký (nếu cấu hình).
- **Đóng dấu**: Hỗ trợ vị trí hiển thị con dấu của trung tâm theo mẫu báo cáo.

---

## 10. Luồng chính

| Bước | Actor | Hệ thống |
| :---: | :--- | :--- |
| **1** | Ban Giám đốc / Kế toán trưởng | Mở chức năng Báo cáo |
| **2** | Người dùng | Chọn loại báo cáo |
| **3** | Người dùng | Chọn bộ lọc thời gian |
| **4** | | Kiểm tra điều kiện thời gian |
| **5** | | Truy xuất dữ liệu |
| **6** | | Tổng hợp và tính toán số liệu |
| **7** | | Hiển thị báo cáo xem trước |
| **8** | Người dùng | Chọn định dạng Excel hoặc PDF |
| **9** | | Tạo file tương ứng |
| **10** | | Áp dụng mẫu báo cáo |
| **11** | | Thêm logo/chữ ký/con dấu đối với PDF nếu được cấu hình |
| **12** | | Hoàn tất quá trình xuất báo cáo |

---

## 11. Luồng thay thế

* **ALT-01: Không có dữ liệu**: Hệ thống thông báo *"Không có dữ liệu trong khoảng thời gian đã chọn."* Không tạo báo cáo rỗng nếu người dùng chưa xác nhận.
* **ALT-02: Người dùng thay đổi bộ lọc**: Hệ thống cập nhật báo cáo xem trước tương ứng.
* **ALT-03: Chỉ xuất Excel**: Tạo file `.xlsx`.
* **ALT-04: Chỉ xuất PDF**: Tạo file `.pdf` theo mẫu báo cáo.

---

## 12. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :--- | :--- | :--- |
| **EX-14-01** | Ngày bắt đầu > ngày kết thúc | Yêu cầu nhập lại |
| **EX-14-02** | Không có dữ liệu | Thông báo không có dữ liệu |
| **EX-14-03** | Lỗi truy xuất dữ liệu | Không tạo file và thông báo lỗi |
| **EX-14-04** | Lỗi tạo Excel | Thông báo và cho phép xuất lại |
| **EX-14-05** | Lỗi tạo PDF | Thông báo và cho phép xuất lại |
| **EX-14-06** | Logo/chữ ký/con dấu chưa cấu hình | Sử dụng mẫu không có thành phần đó |
| **EX-14-07** | Người dùng không có quyền | Từ chối chức năng xuất báo cáo |

---

## 13. Business Rules

| Mã | Quy tắc |
| :--- | :--- |
| **BR-14-01** | Chỉ Ban Giám đốc và Kế toán trưởng được phép xuất các báo cáo thuộc UC-14. |
| **BR-14-02** | Báo cáo phải tuân thủ bộ lọc thời gian được người dùng lựa chọn. |
| **BR-14-03** | Hệ thống hỗ trợ lọc theo tuần, tháng, quý và khoảng ngày tùy chọn. |
| **BR-14-04** | Ngày bắt đầu không được lớn hơn ngày kết thúc. |
| **BR-14-05** | Báo cáo doanh thu phải có tổng cộng và giá trị trung bình. |
| **BR-14-06** | File Excel phải sử dụng công thức SUM và AVERAGE cho các trường tổng hợp phù hợp. |
| **BR-14-07** | Báo cáo công nợ phải thể hiện tổng giá trị hợp đồng, tiền đã thanh toán và số tiền còn lại. |
| **BR-14-08** | Công nợ được tính theo số tiền phải thanh toán còn lại của hợp đồng. |
| **BR-14-09** | Báo cáo PDF phải sử dụng mẫu trình bày thống nhất của trung tâm. |
| **BR-14-10** | Logo, chữ ký và con dấu chỉ được hiển thị khi đã được cấu hình và người dùng có quyền sử dụng. |
| **BR-14-11** | Dữ liệu xuất ra phải tương ứng với dữ liệu đã được hệ thống tổng hợp tại thời điểm tạo báo cáo. |
| **BR-14-12** | File báo cáo phải ghi nhận thời gian tạo báo cáo và người thực hiện xuất báo cáo. |

---

## 14. Acceptance Criteria

| Mã | Tiêu chí nghiệm thu |
| :--- | :--- |
| **AC-14-01** | Người có quyền có thể chọn loại báo cáo. |
| **AC-14-02** | Có thể lọc dữ liệu theo tuần. |
| **AC-14-03** | Có thể lọc dữ liệu theo tháng. |
| **AC-14-04** | Có thể lọc dữ liệu theo quý. |
| **AC-14-05** | Có thể nhập khoảng ngày tùy chọn. |
| **AC-14-06** | Excel chứa bảng doanh thu theo tháng. |
| **AC-14-07** | Excel có công thức SUM. |
| **AC-14-08** | Excel có công thức AVERAGE. |
| **AC-14-09** | Báo cáo sự kiện chứa thông tin khách hàng. |
| **AC-14-10** | Báo cáo thể hiện tình trạng công nợ. |
| **AC-14-11** | Có thể xuất báo cáo PDF. |
| **AC-14-12** | PDF có logo theo cấu hình. |
| **AC-14-13** | PDF có khu vực chữ ký đại diện. |
| **AC-14-14** | PDF hỗ trợ khu vực đóng dấu theo mẫu. |
| **AC-14-15** | Dữ liệu xuất đúng với bộ lọc thời gian. |
| **AC-14-16** | Người không có quyền không thể xuất báo cáo. |

---

## 15. Hậu điều kiện

Sau khi UC-14 hoàn tất:
- File Excel hoặc PDF được tạo thành công.
- Báo cáo phản ánh đúng khoảng thời gian được chọn.
- Báo cáo doanh thu có tổng và giá trị trung bình.
- Báo cáo sự kiện có thông tin khách hàng và công nợ.
- PDF sử dụng đúng mẫu trình bày của trung tâm.
- Báo cáo có thể được lưu trữ, in ấn hoặc sử dụng cho công tác quản lý.
- Hệ thống không làm thay đổi dữ liệu nghiệp vụ gốc trong quá trình xuất báo cáo.
