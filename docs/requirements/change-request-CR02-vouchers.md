# PHIẾU YÊU CẦU THAY ĐỔI – CR-02: Chính sách ưu đãi mùa cưới – Voucher Code

Dự án: **EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới**

---

## 1. Thông tin yêu cầu thay đổi

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã yêu cầu** | CR-02 |
| **Tên yêu cầu** | Chính sách ưu đãi mùa cưới – Voucher Code |
| **Ngày yêu cầu** | 28/09/2026 |
| **Người đề xuất** | Bộ phận Kinh doanh / Sales |
| **Dự án** | EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới |
| **PM phụ trách** | Hoàng |
| **Loại thay đổi** | Thay đổi phạm vi chức năng |
| **Mức độ ưu tiên** | Should Have |
| **Trạng thái** | Chờ PM xem xét/phê duyệt |

---

## 2. Mô tả yêu cầu thay đổi

### 2.1. Hiện trạng
Hiện tại hệ thống EVManager đã hỗ trợ tính chiết khấu trong quá trình lập báo giá tiệc cưới theo chính sách mùa vụ hoặc khách hàng thân thiết. Tuy nhiên, hệ thống chưa có chức năng để người dùng nhập mã giảm giá (Voucher Code) trực tiếp vào hóa đơn/báo giá đặt tiệc.

### 2.2. Nội dung thay đổi
Bổ sung chức năng **Nhập và áp dụng mã Voucher Code** vào báo giá/hóa đơn đặt tiệc. Người dùng có quyền sẽ nhập mã ưu đãi. Hệ thống tự động kiểm tra điều kiện của mã trước khi áp dụng giảm giá.

---

## 3. Mục tiêu của CR-02

- Cho phép trung tâm triển khai chương trình ưu đãi mùa cưới.
- Cho phép Sales nhập Voucher Code cho khách hàng.
- Tự động kiểm tra tính hợp lệ của mã.
- Tự động tính giá trị giảm và hiển thị số tiền được giảm trên báo giá.
- Lưu lại mã voucher đã sử dụng.
- Ngăn mã hết hạn hoặc vượt quá số lần sử dụng được áp dụng.
- Hạn chế việc nhân viên tự nhập mức giảm không đúng chính sách.

---

## 4. Đặc tả chức năng Voucher Code

Mỗi Voucher Code cần quản lý tối thiểu:

| Thuộc tính | Mô tả |
| :--- | :--- |
| **Voucher ID** | Mã định danh voucher |
| **Voucher Code** | Mã voucher khách nhập |
| **Tên chương trình** | Tên chương trình ưu đãi |
| **Loại giảm** | Giảm cố định / Giảm theo % |
| **Giá trị giảm** | Số tiền hoặc tỷ lệ % |
| **Ngày bắt đầu** | Thời điểm voucher bắt đầu có hiệu lực |
| **Ngày kết thúc** | Thời điểm voucher hết hiệu lực |
| **Số lượng tối đa** | Tổng số lần voucher được sử dụng |
| **Số lượng đã sử dụng** | Số lần đã áp dụng |
| **Trạng thái** | Hoạt động / Ngừng hoạt động |
| **Điều kiện áp dụng** | Điều kiện nghiệp vụ nếu có |

---

## 5. Logic kiểm tra Voucher Code

Khi Sales nhập mã voucher, hệ thống thực hiện lần lượt 6 bước:

1. **Bước 1 – Kiểm tra mã tồn tại**: Nếu mã không tồn tại $\rightarrow$ Báo lỗi *"Mã voucher không tồn tại."* và không cho áp dụng.
2. **Bước 2 – Kiểm tra trạng thái**: Nếu voucher ngừng hoạt động $\rightarrow$ Báo lỗi *"Mã voucher hiện không khả dụng."*
3. **Bước 3 – Kiểm tra thời hạn**: Kiểm tra $\text{Ngày bắt đầu} \le \text{Ngày áp dụng} \le \text{Ngày kết thúc}$. Nếu hết hạn $\rightarrow$ *"Mã voucher đã hết hạn."*; Nếu chưa đến ngày $\rightarrow$ *"Mã voucher chưa có hiệu lực."*
4. **Bước 4 – Kiểm tra số lượng sử dụng**: Kiểm tra $\text{Số lượng đã sử dụng} < \text{Số lượng tối đa}$. Nếu đạt giới hạn $\rightarrow$ *"Mã voucher đã hết lượt sử dụng."*
5. **Bước 5 – Kiểm tra điều kiện áp dụng**: Kiểm tra giá trị hóa đơn tối thiểu, số bàn tối thiểu, khoảng thời gian, loại khách hàng, Set Menu/dịch vụ áp dụng. Nếu không thỏa $\rightarrow$ *"Đơn đặt tiệc không đáp ứng điều kiện của mã voucher."*
6. **Bước 6 – Tính mức giảm**:
   - **Giảm theo phần trăm**: $\text{Tiền giảm} = \text{Tạm tính} \times \text{Tỷ lệ giảm (\%)}$ *(Ví dụ: $200.000.000 \times 5\% = 10.000.000 \text{ VNĐ}$)*
   - **Giảm số tiền cố định**: $\text{Tiền giảm} = \text{Giá trị giảm cố định}$ *(Ví dụ: Giảm $5.000.000 \text{ VNĐ}$)*

---

## 6. Nguyên tắc áp dụng Voucher

Sau khi voucher hợp lệ:
1. Hệ thống hiển thị mã voucher, loại giảm, số tiền được giảm.
2. Cập nhật lại tổng tiền báo giá:
   $$\text{Tổng sau Voucher} = \text{Tổng trước Voucher} - \text{Giá trị Voucher}$$
3. Lưu mã voucher vào đơn đặt tiệc/hóa đơn và ghi nhận lượt sử dụng.

*Lưu ý: CR-02 hiện chưa cung cấp quy định về việc Voucher có được cộng dồn với chiết khấu mùa vụ/khách hàng thân thiết hay không. Nội dung này cần PM/đại diện nghiệp vụ xác nhận trước khi phát triển.*

---

## 7. Quy trình sử dụng & Hủy Voucher

### Luồng chính (Sử dụng)
Sales mở báo giá/hóa đơn $\rightarrow$ Nhập Voucher Code $\rightarrow$ Nhấn **Áp dụng** $\rightarrow$ Hệ thống kiểm tra điều kiện & tính tiền giảm $\rightarrow$ Hiển thị tổng tiền mới.

### Cho phép hủy Voucher
1. Chọn **Xóa Voucher**.
2. Hệ thống xác nhận $\rightarrow$ Xóa mã khỏi báo giá $\rightarrow$ Tính lại tổng tiền gốc $\rightarrow$ Không ghi nhận lượt sử dụng.

---

## 8. Ảnh hưởng đến Cơ sở dữ liệu

### 8.1. Bổ sung bảng VOUCHERS

```sql
CREATE TABLE VOUCHERS (
    VoucherID INT PRIMARY KEY IDENTITY(1,1),
    VoucherCode VARCHAR(50) UNIQUE NOT NULL,
    VoucherName NVARCHAR(255) NOT NULL,
    DiscountType VARCHAR(20) CHECK (DiscountType IN ('PERCENT', 'FIXED')),
    DiscountValue DECIMAL(18,2) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    MaxUsage INT NOT NULL,
    UsedCount INT DEFAULT 0,
    MinOrderValue DECIMAL(18,2) DEFAULT 0,
    Status BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
```

### 8.2. Liên kết Voucher với Báo giá / Hợp đồng
Tạo bảng liên kết `QUOTATION_VOUCHER` (gồm `QuotationVoucherID`, `QuotationID`, `VoucherID`, `DiscountAmount`, `AppliedAt`) để lưu lịch sử và giá trị giảm thực tế tại thời điểm áp dụng.

---

## 9. Ảnh hưởng đến Giao diện

- **Màn hình lập báo giá (UC-08)**: Bổ sung ô nhập Voucher Code, nút `[Áp dụng]`, nhãn hiển thị mức giảm và nút `[Xóa Voucher]`.
- **Màn hình quản lý Voucher**: Thêm giao diện CRUD voucher dành cho Admin/Kinh doanh.
- **Báo cáo (UC-13/14)**: Bổ sung cột phân biệt doanh thu trước Voucher, giá trị Voucher giảm và doanh thu thực tế sau Voucher.

---

## 10. Ảnh hưởng đến các Use Case hiện tại

| Use Case | Mức ảnh hưởng | Nội dung |
| :--- | :---: | :--- |
| **UC-06 – Chọn Set Menu** | Thấp | Không thay đổi trực tiếp |
| **UC-07 – Chọn dịch vụ** | Thấp | Không thay đổi trực tiếp |
| **UC-08 – Lập báo giá** | **Cao** | Thêm nhập và áp dụng Voucher |
| **UC-09 – Hợp đồng** | Trung bình | Lưu thông tin ưu đãi/mã voucher |
| **UC-10 – Đặt cọc** | Trung bình | Tiền cọc 30% tính trên tổng tiền sau ưu đãi (nếu quy định) |
| **UC-12 – Quyết toán** | Trung bình | Giữ nguyên giá trị Voucher đã áp dụng khi quyết toán |
| **UC-13 – Dashboard** | Trung bình | Bổ sung KPI tổng giá trị giảm bằng Voucher |
| **UC-14 – Báo cáo** | Trung bình | Bổ sung cột mã Voucher và giá trị giảm |

---

## 11. Các vấn đề cần PM / Business xác nhận

1. Voucher có được cộng dồn với chiết khấu mùa vụ hay không?
2. Voucher có được cộng dồn với ưu đãi khách hàng thân thiết hay không?
3. Voucher được tính giảm trước hay sau chiết khấu khác?
4. Voucher có giới hạn giá trị giảm tối đa hay không?
5. Khi khách hủy hợp đồng, lượt sử dụng Voucher có được hoàn lại hay không?
6. Khi sửa báo giá, Voucher có được tự động kiểm tra lại hay không?
7. Tiền cọc 30% được tính trên giá trước hay sau Voucher?
8. Ai có quyền tạo, sửa và vô hiệu hóa Voucher?

---

## 12. Tiêu chí nghiệm thu CR-02

| Mã | Tiêu chí |
| :--- | :--- |
| **CR-AC-01** | Sales có thể nhập Voucher Code. |
| **CR-AC-02** | Hệ thống kiểm tra mã tồn tại. |
| **CR-AC-03** | Hệ thống kiểm tra thời hạn. |
| **CR-AC-04** | Hệ thống kiểm tra số lượt sử dụng. |
| **CR-AC-05** | Hệ thống kiểm tra trạng thái Voucher. |
| **CR-AC-06** | Hệ thống hỗ trợ giảm theo %. |
| **CR-AC-07** | Hệ thống hỗ trợ giảm số tiền cố định. |
| **CR-AC-08** | Giá trị giảm được tính chính xác. |
| **CR-AC-09** | Tổng báo giá được cập nhật sau khi áp dụng. |
| **CR-AC-10** | Có thể xóa Voucher và tính lại giá. |
| **CR-AC-11** | Lưu lịch sử Voucher đã áp dụng. |
| **CR-AC-12** | Voucher không hợp lệ không được áp dụng. |
| **CR-AC-13** | Không vượt quá số lượng Voucher tối đa. |
| **CR-AC-14** | Dữ liệu Voucher được lưu chính xác trong CSDL. |

---

## 13. Khu vực phê duyệt CR-02

| Người | Vai trò | Quyết định | Ngày | Ký xác nhận |
| :--- | :--- | :---: | :---: | :---: |
| **Hoàng** | Project Manager | ☐ Phê duyệt &nbsp; ☐ Từ chối &nbsp; ☐ Yêu cầu bổ sung | //2026 | __________ |
| | Business Representative | ☐ Đồng ý &nbsp; ☐ Không đồng ý | //2026 | __________ |
| | Business Analyst | ☐ Đã phân tích tác động | //2026 | __________ |

*Trạng thái CR-02: ☐ Chờ phê duyệt &nbsp;&nbsp;&nbsp;&nbsp; ☐ Đã phê duyệt &nbsp;&nbsp;&nbsp;&nbsp; ☐ Từ chối &nbsp;&nbsp;&nbsp;&nbsp; ☐ Yêu cầu chỉnh sửa*
