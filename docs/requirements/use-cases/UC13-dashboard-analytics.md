# UC-13: Xem Dashboard báo cáo doanh thu và tỷ lệ lấp đầy sảnh

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-13 |
| **Tên Use Case** | Xem Dashboard báo cáo doanh thu và tỷ lệ lấp đầy sảnh |
| **Actor chính** | Ban Giám đốc |
| **Actor phụ** | Kế toán trưởng |
| **Hệ thống** | EVManager |
| **Mục tiêu** | Cung cấp Dashboard tổng quan về doanh thu, số lượng tiệc cưới, giá trị trung bình mỗi tiệc và tỷ lệ lấp đầy của từng sảnh |
| **Mức độ ưu tiên** | Should Have |
| **Tần suất sử dụng** | Hàng ngày / hàng tuần / hàng tháng |

---

## 2. Phạm vi chức năng

UC-13 cho phép Ban Giám đốc và Kế toán trưởng truy cập Dashboard để theo dõi tình hình kinh doanh của trung tâm tiệc cưới.
Dashboard cung cấp:
- Doanh thu theo tháng.
- Số lượng tiệc cưới đã phục vụ.
- Giá trị trung bình trên mỗi tiệc.
- Biểu đồ doanh thu theo từng tháng trong năm.
- Tỷ lệ lấp đầy của từng sảnh tiệc.
- So sánh mức độ khai thác công suất giữa các sảnh.
- Lọc dữ liệu theo khoảng thời gian nếu hệ thống hỗ trợ.
- Chỉ người dùng có quyền phù hợp mới được xem dữ liệu Dashboard.

---

## 3. Các chỉ số KPI chính

### 3.1. Doanh thu tháng
Thể hiện tổng doanh thu ghi nhận trong tháng được chọn.
$$\text{Doanh thu tháng} = \sum \text{Giá trị các giao dịch/doanh thu ghi nhận trong tháng}$$
*Dashboard hiển thị dưới dạng số tiền, ví dụ: `2.450.000.000 VNĐ`*

### 3.2. Số lượng tiệc cưới đã phục vụ
Thể hiện số lượng sự kiện/tiệc cưới đã hoàn tất trong khoảng thời gian được chọn.
$$\text{Số tiệc đã phục vụ} = \text{COUNT}(\text{Sự kiện có trạng thái "Đã hoàn tất"})$$
*Chỉ các sự kiện đã hoàn tất mới được tính vào KPI này.*

### 3.3. Giá trị trung bình / tiệc
Thể hiện mức doanh thu trung bình tạo ra từ mỗi tiệc cưới đã phục vụ.
$$\text{Giá trị trung bình/tiệc} = \frac{\text{Tổng doanh thu}}{\text{Số tiệc đã phục vụ}}$$
*Nếu không có tiệc đã hoàn tất trong khoảng thời gian được chọn thì hệ thống hiển thị 0 VNĐ thay vì thực hiện phép chia cho 0.*

---

## 4. Biểu đồ cột – Doanh thu theo tháng

### 4.1. Mục đích
Biểu đồ cột giúp Ban Giám đốc và Kế toán trưởng theo dõi sự thay đổi doanh thu giữa các tháng trong năm.

### 4.2. Thành phần biểu đồ
- **Trục X**: Các tháng trong năm (Tháng 1 $\rightarrow$ Tháng 12).
- **Trục Y**: Doanh thu (Đơn vị: VNĐ).
- **Mỗi cột**: Đại diện cho tổng doanh thu của một tháng.
- **Tooltip (Rê chuột vào cột)**: Hiển thị Tháng, Tổng doanh thu, Số tiệc đã hoàn tất.

### 4.3. Xử lý dữ liệu
- Tháng có doanh thu được hiển thị giá trị tương ứng.
- Tháng không phát sinh doanh thu vẫn được hiển thị với giá trị 0.
- Dữ liệu được cập nhật khi có thay đổi hoặc khi người dùng tải lại Dashboard.
- Nếu người dùng chọn năm khác, biểu đồ được cập nhật theo năm được chọn.

---

## 5. Biểu đồ tròn – Tỷ lệ lấp đầy từng sảnh

### 5.1. Mục đích
Biểu đồ tròn thể hiện tỷ lệ sử dụng của từng sảnh trong khoảng thời gian được chọn, giúp theo dõi mức độ khai thác công suất của các sảnh.

### 5.2. Thành phần biểu đồ
Biểu đồ gồm các phần tương ứng với từng sảnh (ví dụ: Sảnh Kim Cương, Sảnh Vàng, Sảnh Bạch Kim, Sảnh Ngọc Trai, Sảnh Ruby).
Công thức tỷ lệ sử dụng của sảnh:
$$\text{Tỷ lệ lấp đầy sảnh} = \frac{\text{Số lượt sảnh được sử dụng}}{\text{Tổng số lượt sử dụng của tất cả sảnh}} \times 100\%$$
*Khi rê chuột vào một phần biểu đồ, hệ thống hiển thị: Tên sảnh, Số lượt đã sử dụng, Tỷ lệ phần trăm.*

### 5.3. Ý nghĩa
Dashboard giúp người quản lý nhận biết mức độ khai thác của từng sảnh, từ đó có cơ sở theo dõi công suất sử dụng và lập kế hoạch vận hành.

---

## 6. Phân quyền truy cập Dashboard

Dữ liệu Dashboard chứa thông tin doanh thu và hiệu quả kinh doanh nên hệ thống giới hạn quyền truy cập:

| Vai trò | Xem Dashboard | Xem doanh thu | Xem tỷ lệ lấp đầy |
| :--- | :---: | :---: | :---: |
| **Ban Giám đốc** | ✓ | ✓ | ✓ |
| **Kế toán trưởng** | ✓ | ✓ | ✓ |
| **Admin** | ✗ | ✗ | ✗ |
| **Nhân viên Sales** | ✗ | ✗ | ✗ |
| **Quản lý sảnh/Coordinator** | ✗ | ✗ | ✗ |
| **Khách hàng** | ✗ | ✗ | ✗ |

*Quyền truy cập Dashboard được kiểm tra dựa trên vai trò của tài khoản sau khi đăng nhập.*

---

## 7. Điều kiện tiên quyết

- Người dùng đã đăng nhập hệ thống.
- Tài khoản thuộc vai trò Ban Giám đốc hoặc Kế toán trưởng.
- Hệ thống có dữ liệu sự kiện/doanh thu để tổng hợp.
- Dữ liệu sự kiện và trạng thái thanh toán đã được cập nhật.

---

## 8. Luồng chính

| Bước | Actor | Hệ thống |
| :---: | :--- | :--- |
| **1** | Ban Giám đốc / Kế toán trưởng | Đăng nhập hệ thống |
| **2** | Người dùng | Chọn chức năng Dashboard / Báo cáo |
| **3** | | Kiểm tra quyền truy cập |
| **4** | | Truy xuất dữ liệu doanh thu và sự kiện |
| **5** | | Tính toán các KPI |
| **6** | | Hiển thị doanh thu tháng |
| **7** | | Hiển thị số lượng tiệc đã phục vụ |
| **8** | | Tính và hiển thị giá trị trung bình/tiệc |
| **9** | | Tổng hợp doanh thu theo từng tháng |
| **10** | | Hiển thị biểu đồ cột doanh thu |
| **11** | | Tổng hợp số lượt sử dụng của từng sảnh |
| **12** | | Tính tỷ lệ lấp đầy/tỷ trọng sử dụng của từng sảnh |
| **13** | | Hiển thị biểu đồ tròn |
| **14** | Người dùng | Xem và phân tích các chỉ số trên Dashboard |

---

## 9. Luồng thay thế

* **ALT-01: Người dùng chọn năm khác**:
  1. Người dùng chọn năm cần xem.
  2. Hệ thống truy xuất dữ liệu của năm được chọn.
  3. Hệ thống tính lại KPI và cập nhật biểu đồ doanh thu, tỷ lệ sử dụng sảnh.
* **ALT-02: Không có dữ liệu**:
  KPI doanh thu = 0 VNĐ, Số tiệc = 0, Giá trị trung bình/tiệc = 0 VNĐ. Biểu đồ hiển thị trạng thái *"Không có dữ liệu"*.
* **ALT-03: Người dùng không có quyền**:
  Hệ thống từ chối truy cập Dashboard, hiển thị thông báo: *"Bạn không có quyền truy cập Dashboard báo cáo."* và không trả về dữ liệu doanh thu.

---

## 10. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :--- | :--- | :--- |
| **EX-13-01** | Không kết nối được cơ sở dữ liệu | Thông báo lỗi và yêu cầu tải lại |
| **EX-13-02** | Dữ liệu doanh thu không đầy đủ | Thông báo dữ liệu chưa đầy đủ |
| **EX-13-03** | Lỗi tổng hợp dữ liệu | Không hiển thị số liệu sai, ghi nhận lỗi hệ thống |
| **EX-13-04** | Người dùng không đủ quyền | Từ chối truy cập Dashboard |

---

## 11. Business Rules

| Mã | Quy tắc |
| :--- | :--- |
| **BR-13-01** | Chỉ Ban Giám đốc và Kế toán trưởng được phép xem Dashboard doanh thu. |
| **BR-13-02** | Doanh thu tháng được tổng hợp từ dữ liệu doanh thu hợp lệ trong tháng. |
| **BR-13-03** | Chỉ sự kiện có trạng thái Đã hoàn tất được tính vào số lượng tiệc đã phục vụ. |
| **BR-13-04** | Giá trị trung bình/tiệc được tính bằng tổng doanh thu chia cho số tiệc đã phục vụ. |
| **BR-13-05** | Khi không có tiệc đã phục vụ, giá trị trung bình/tiệc phải bằng 0. |
| **BR-13-06** | Biểu đồ doanh thu phải thể hiện đầy đủ các tháng thuộc năm được chọn. |
| **BR-13-07** | Biểu đồ tròn phải thể hiện tỷ trọng sử dụng của từng sảnh trong cùng khoảng thời gian. |
| **BR-13-08** | Dữ liệu Dashboard phải được tổng hợp từ dữ liệu nghiệp vụ của hệ thống. |
| **BR-13-09** | Người dùng không có quyền không được xem dữ liệu doanh thu và các báo cáo tài chính trên Dashboard. |
| **BR-13-10** | Khi dữ liệu được cập nhật, Dashboard phải có khả năng tải lại để phản ánh dữ liệu mới. |

---

## 12. Acceptance Criteria

| Mã | Tiêu chí nghiệm thu |
| :--- | :--- |
| **AC-13-01** | Ban Giám đốc có thể truy cập Dashboard. |
| **AC-13-02** | Kế toán trưởng có thể truy cập Dashboard. |
| **AC-13-03** | Người dùng không có quyền bị từ chối truy cập. |
| **AC-13-04** | Dashboard hiển thị doanh thu tháng. |
| **AC-13-05** | Dashboard hiển thị số lượng tiệc đã phục vụ. |
| **AC-13-06** | Dashboard hiển thị giá trị trung bình/tiệc. |
| **AC-13-07** | Biểu đồ cột thể hiện doanh thu của từng tháng. |
| **AC-13-08** | Biểu đồ tròn thể hiện tỷ lệ sử dụng của từng sảnh. |
| **AC-13-09** | Khi thay đổi năm/khoảng thời gian, dữ liệu Dashboard được cập nhật. |
| **AC-13-10** | Trường hợp không có dữ liệu, hệ thống hiển thị trạng thái phù hợp. |
| **AC-13-11** | Không xảy ra phép chia cho 0 khi tính giá trị trung bình. |
| **AC-13-12** | Dữ liệu doanh thu chỉ được hiển thị cho người có quyền. |

---

## 13. Hậu điều kiện

Sau khi UC-13 hoàn tất:
- Người dùng có quyền xem được các KPI trên Dashboard.
- Doanh thu theo tháng được tổng hợp và hiển thị bằng biểu đồ cột.
- Tỷ lệ sử dụng của từng sảnh được tổng hợp và hiển thị bằng biểu đồ tròn.
- Người dùng có thể theo dõi số lượng tiệc và giá trị trung bình/tiệc.
- Dữ liệu doanh thu được bảo vệ theo quyền truy cập.
- Không làm thay đổi dữ liệu nghiệp vụ gốc trong quá trình xem Dashboard.
