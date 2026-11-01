# UC-06: Chọn danh mục món ăn và lập thực đơn tiệc cưới

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-06 |
| **Tên Use Case** | Chọn danh mục món ăn và lập thực đơn tiệc cưới |
| **Actor chính** | Nhân viên Tư vấn (Sales) |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Hệ thống EVManager |
| **Mục tiêu** | Cho phép Sales và khách hàng lựa chọn Set Menu phù hợp với ngân sách, số lượng bàn và nhu cầu của tiệc; thay đổi món ăn; ghi nhận yêu cầu đặc biệt; tự động tính giá thực đơn. |
| **Trigger** | Khách hàng bắt đầu lựa chọn thực đơn cho sự kiện. |
| **Tiền điều kiện** | Người dùng đã đăng nhập; khách hàng và thông tin sự kiện đã tồn tại; danh mục món ăn và Set Menu đã được cấu hình trong hệ thống. |
| **Hậu điều kiện thành công** | Thực đơn được lưu vào sự kiện, giá được tính chính xác và các yêu cầu đặc biệt được ghi nhận. |
| **Hậu điều kiện thất bại** | Thực đơn không được lưu hoặc hệ thống yêu cầu người dùng điều chỉnh dữ liệu không hợp lệ. |

---

## 2. Phạm vi chức năng

UC-06 bao gồm:
1. Xem danh mục món ăn.
2. Xem các Set Menu đang được cung cấp.
3. Phân loại Set Menu theo phân khúc giá.
4. Chọn Set Menu phù hợp với nhu cầu và ngân sách.
5. Nhập số lượng bàn sử dụng Set Menu.
6. Xem chi tiết các món trong Set Menu.
7. Thay đổi món ăn trong Set Menu.
8. Tính chênh lệch giá khi đổi món.
9. Tính lại đơn giá Set Menu sau khi đổi món.
10. Ghi nhận món chay.
11. Ghi nhận dị ứng thực phẩm.
12. Ghi nhận các yêu cầu chế biến đặc biệt.
13. Tính tổng giá trị thực đơn.
14. Tính đơn giá trung bình cho mỗi bàn.
15. Kiểm tra tính hợp lệ của Set Menu.
16. Lưu thực đơn vào sự kiện.
17. Cung cấp dữ liệu thực đơn cho bước lập báo giá và hợp đồng.

---

## 3. Phân loại Set Menu và đơn giá

Set Menu được phân loại dựa trên số lượng món, loại nguyên liệu và đơn giá trung bình trên mỗi bàn.

### 3.1. Menu cơ bản

| Tiêu chí | Nội dung |
| :--- | :--- |
| **Số món** | Khoảng 6 món |
| **Đơn giá tham khảo** | 3.500.000 – 5.000.000 VNĐ/bàn |
| **Đối tượng** | Khách hàng có ngân sách tiết kiệm |
| **Đặc điểm** | Các món ăn phổ biến, nguyên liệu thông dụng |
| **Ví dụ** | Khai vị, món gà, món bò/thịt, món rau, lẩu/cơm, tráng miệng |

Menu cơ bản tập trung vào các món phổ biến và đảm bảo đủ nhu cầu cơ bản của một bàn tiệc.

### 3.2. Menu phổ biến

| Tiêu chí | Nội dung |
| :--- | :--- |
| **Số món** | Khoảng 7–8 món |
| **Đơn giá tham khảo** | 5.000.000 – 10.000.000 VNĐ/bàn |
| **Đối tượng** | Phân khúc khách hàng phổ biến |
| **Đặc điểm** | Cân đối giữa thịt, hải sản và các món ăn phụ |
| **Thành phần thường có** | Khai vị, món chính, hải sản, lẩu/cơm, tráng miệng |

Đây là nhóm Set Menu có sự cân bằng giữa số lượng món, chất lượng nguyên liệu và ngân sách.

### 3.3. Menu cao cấp

| Tiêu chí | Nội dung |
| :--- | :--- |
| **Số món** | Khoảng 9–10 món hoặc nhiều hơn |
| **Đơn giá tham khảo** | 8.000.000 – 20.000.000 VNĐ/bàn |
| **Đối tượng** | Khách hàng có ngân sách cao |
| **Đặc điểm** | Sử dụng nguyên liệu cao cấp, đặc sản hoặc nguyên liệu nhập khẩu |
| **Ví dụ** | Tôm hùm, cá tầm, cua, bào ngư, bò Mỹ, hải sản cao cấp |

Đối với nhà hàng cao cấp, đơn giá Set Menu có thể nằm trong khoảng 8.000.000 – 20.000.000 VNĐ/bàn tùy nhà hàng, nguyên liệu và cấu hình thực đơn.

*Lưu ý: Các mức giá trên là khoảng giá tham khảo dùng để xây dựng nghiệp vụ và dữ liệu mẫu cho hệ thống EVManager. Giá thực tế có thể thay đổi theo từng nhà hàng, thời điểm, nguyên liệu và chính sách kinh doanh.*

---

## 4. Cấu trúc Set Menu

Số lượng món không bắt buộc cố định cho tất cả Set Menu mà được cấu hình theo từng phân khúc.

| Phân khúc | Khai vị | Món chính | Lẩu/Cơm | Tráng miệng | Tổng số món |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Cơ bản** | 1–2 | 3 | 1 | 0–1 | Khoảng 6 món |
| **Phổ biến** | 2 | 3–4 | 1 | 1 | Khoảng 7–8 món |
| **Cao cấp** | 2 | 4–5 | 1 | 1–2 | Khoảng 9–10 món hoặc hơn |

Hệ thống phải cho phép Admin/Quản lý cấu hình số lượng món theo từng Set Menu.

**Ví dụ:**

**Set Menu Cơ bản A**
- Khai vị: 2 món
- Món chính: 2 món
- Lẩu/Cơm: 1 món
- Tráng miệng: 1 món
- Tổng: 6 món
- Giá: 4.000.000 VNĐ/bàn

**Set Menu Phổ biến B**
- Khai vị: 2 món
- Món chính: 4 món
- Lẩu/Cơm: 1 món
- Tráng miệng: 1 món
- Tổng: 8 món
- Giá: 7.000.000 VNĐ/bàn

**Set Menu Cao cấp C**
- Khai vị: 2 món
- Món chính: 5 món
- Lẩu/Cơm: 1 món
- Tráng miệng: 2 món
- Tổng: 10 món
- Giá: 15.000.000 VNĐ/bàn

---

## 5. Luồng chính – Basic Flow

### B1. Mở chức năng chọn thực đơn
- **B1.1:** Sales mở hồ sơ sự kiện của khách hàng.
- **B1.2:** Sales chọn chức năng Chọn thực đơn.
- **B1.3:** Hệ thống hiển thị danh sách các Set Menu đang được cung cấp.
- **B1.4:** Hệ thống hiển thị thông tin của từng Set Menu:
  - Tên Set Menu.
  - Phân khúc: Cơ bản / Phổ biến / Cao cấp.
  - Đơn giá/bàn.
  - Số lượng món.
  - Các nhóm món.
  - Danh sách món ăn.
  - Mô tả món ăn.
  - Loại nguyên liệu.
  - Các món có thể thay thế.

---

## 6. Nhập số lượng bàn và chọn Set Menu

- **B2.1:** Sales nhập hoặc xác nhận số lượng bàn của sự kiện.
- **B2.2:** Sales tư vấn Set Menu phù hợp với ngân sách và nhu cầu của khách hàng.
- **B2.3:** Khách hàng lựa chọn một hoặc nhiều Set Menu.
- **B2.4:** Sales nhập số lượng bàn sử dụng cho từng Set Menu.

**Ví dụ:**
- Set Menu Phổ biến A: 15 bàn.
- Set Menu Cao cấp B: 5 bàn.

- **B2.5:** Hệ thống kiểm tra số lượng bàn.
- **B2.6:** Hệ thống hiển thị thành tiền của từng Set Menu.

**Công thức:**
$$\text{Thành tiền Set Menu} = \text{Đơn giá/bàn} \times \text{Số lượng bàn}$$

**Ví dụ:**
Set Menu A có giá 7.000.000 VNĐ/bàn và khách chọn 15 bàn:
$$7.000.000 \times 15 = 105.000.000 \text{ VNĐ}$$

---

## 7. Xem và thay đổi món trong Set Menu

- **B3.1:** Khách hàng yêu cầu thay đổi một món trong Set Menu.
- **B3.2:** Sales chọn món cần thay đổi.
- **B3.3:** Hệ thống hiển thị các món có thể thay thế trong cùng nhóm món.
- **B3.4:** Sales/khách hàng chọn món thay thế.
- **B3.5:** Hệ thống lấy đơn giá của món cũ và món mới.
- **B3.6:** Hệ thống tính chênh lệch:
$$\text{Chênh lệch món} = \text{Đơn giá món mới} - \text{Đơn giá món cũ}$$
- **B3.7:** Nếu chênh lệch > 0 $\rightarrow$ Hệ thống tăng đơn giá Set Menu.
- **B3.8:** Nếu chênh lệch < 0 $\rightarrow$ Hệ thống giảm đơn giá Set Menu theo chính sách của nhà hàng.
- **B3.9:** Nếu chênh lệch = 0 $\rightarrow$ Đơn giá Set Menu không thay đổi.
- **B3.10:** Hệ thống cập nhật đơn giá Set Menu mới.
- **B3.11:** Nếu Set Menu được sử dụng cho nhiều bàn, hệ thống tính lại tổng tiền theo số lượng bàn.

**Ví dụ:**
Set Menu ban đầu:
- Giá: 7.000.000 VNĐ/bàn.
- Số lượng: 10 bàn.

Khách thay món A giá 300.000 VNĐ bằng món B giá 500.000 VNĐ.

Chênh lệch:
$$500.000 - 300.000 = +200.000 \text{ VNĐ/bàn}$$

Đơn giá mới:
$$7.000.000 + 200.000 = 7.200.000 \text{ VNĐ/bàn}$$

Tổng tiền:
$$7.200.000 \times 10 = 72.000.000 \text{ VNĐ}$$

---

## 8. Ghi nhận yêu cầu món ăn đặc biệt

- **B4.1:** Khách hàng cung cấp yêu cầu đặc biệt về món ăn.
- **B4.2:** Sales chọn chức năng Yêu cầu đặc biệt.
- **B4.3:** Hệ thống cho phép lựa chọn:
  - Món chay.
  - Dị ứng thực phẩm.
  - Không ăn một số nguyên liệu.
  - Yêu cầu chế biến riêng.
  - Yêu cầu thay đổi nguyên liệu.
  - Yêu cầu khác.
- **B4.4:** Sales nhập nội dung chi tiết.
  - *Ví dụ:* Có 2 bàn yêu cầu thực đơn chay. Hoặc: Khách dị ứng đậu phộng, không sử dụng đậu phộng trong món ăn.
- **B4.5:** Sales nhập số bàn/số suất áp dụng nếu yêu cầu chỉ áp dụng cho một phần khách.
- **B4.6:** Hệ thống lưu yêu cầu đặc biệt cùng với thực đơn của sự kiện.

---

## 9. Tính giá thực đơn

Sau khi khách hàng lựa chọn Set Menu và hoàn tất thay đổi món, hệ thống tự động tính giá.

### 9.1. Giá Set Menu sau khi đổi món
$$\text{Đơn giá Set Menu mới} = \text{Đơn giá Set Menu ban đầu} + \text{Tổng chênh lệch món}$$
Trong đó:
$$\text{Tổng chênh lệch món} = \text{Tổng giá món thay thế} - \text{Tổng giá món ban đầu}$$

### 9.2. Tổng giá trị Set Menu
Nếu sự kiện sử dụng nhiều Set Menu:
$$\text{Tổng giá trị Set Menu} = \sum (\text{Đơn giá Set Menu} \times \text{Số lượng bàn})$$

**Ví dụ:**

| Set Menu | Đơn giá/bàn | Số bàn | Thành tiền |
| :--- | :---: | :---: | :---: |
| Menu phổ biến A | 6.000.000 | 10 | 60.000.000 |
| Menu phổ biến B | 8.000.000 | 5 | 40.000.000 |
| **Tổng** | | **15** | **100.000.000** |

---

## 10. Tính đơn giá trung bình mỗi bàn

Khi một sự kiện sử dụng nhiều Set Menu có giá khác nhau, hệ thống phải tính đơn giá trung bình/bàn.

**Công thức:**
$$\text{Đơn giá trung bình/bàn} = \frac{\text{Tổng giá trị các Set Menu}}{\text{Tổng số bàn}}$$

**Ví dụ:**
- 10 bàn Menu A: 6.000.000 VNĐ/bàn.
- 5 bàn Menu B: 8.000.000 VNĐ/bàn.

Tổng giá trị:
$$10 \times 6.000.000 + 5 \times 8.000.000 = 100.000.000 \text{ VNĐ}$$

Tổng số bàn:
$$10 + 5 = 15 \text{ bàn}$$

Đơn giá trung bình:
$$100.000.000 \div 15 = 6.666.667 \text{ VNĐ/bàn}$$

Hệ thống hiển thị:
$$\text{Đơn giá trung bình: } 6.666.667 \text{ VNĐ/bàn}$$

---

## 11. Kiểm tra mức giá theo phân khúc

Khi lưu Set Menu, hệ thống có thể kiểm tra đơn giá nằm trong khoảng giá được cấu hình.

| Phân khúc | Khoảng giá tham khảo |
| :--- | :--- |
| **Cơ bản** | 3.500.000 – 5.000.000 VNĐ/bàn |
| **Phổ biến** | 5.000.000 – 10.000.000 VNĐ/bàn |
| **Cao cấp** | 8.000.000 – 20.000.000 VNĐ/bàn |

Nếu đơn giá nằm ngoài khoảng giá được cấu hình, hệ thống cảnh báo Sales kiểm tra lại.

*Ví dụ:* *"Đơn giá Set Menu hiện tại là 12.000.000 VNĐ/bàn. Set Menu đang thuộc phân khúc Cao cấp. Vui lòng kiểm tra lại thông tin trước khi lưu."*

Việc kiểm tra này chỉ mang tính cảnh báo dữ liệu, không tự động từ chối nếu nhà hàng cho phép cấu hình giá đặc biệt.

---

## 12. Luồng lưu thực đơn

- **B5.1:** Sales kiểm tra lại toàn bộ thực đơn.
- **B5.2:** Hệ thống hiển thị:
  - Tên Set Menu.
  - Phân khúc Set Menu.
  - Số lượng bàn.
  - Các nhóm món.
  - Món đã chọn.
  - Món đã đổi.
  - Chênh lệch giá.
  - Yêu cầu đặc biệt.
  - Đơn giá/bàn.
  - Thành tiền từng Set Menu.
  - Tổng giá trị thực đơn.
  - Đơn giá trung bình/bàn.
- **B5.3:** Sales xác nhận lưu.
- **B5.4:** Hệ thống kiểm tra tính hợp lệ của thực đơn.
- **B5.5:** Hệ thống lưu thực đơn vào sự kiện.
- **B5.6:** Hệ thống thông báo: *"Lưu thực đơn thành công."*

---

## 13. Luồng phụ – Alternative Flow

### A1. Không đổi món
- **A1.1:** Khách hàng chọn Set Menu mẫu và không yêu cầu thay đổi món.
- **A1.2:** Hệ thống giữ nguyên danh sách món và đơn giá Set Menu.

### A2. Đổi món có giá cao hơn
- **A2.1:** Giá món mới cao hơn món cũ.
- **A2.2:** Hệ thống tính phần chênh lệch.
- **A2.3:** Hệ thống cộng chênh lệch vào đơn giá Set Menu/bàn.
- **A2.4:** Hệ thống tính lại tổng tiền dựa trên số bàn sử dụng.

### A3. Đổi món có giá thấp hơn
- **A3.1:** Giá món mới thấp hơn món cũ.
- **A3.2:** Hệ thống tính phần chênh lệch giảm.
- **A3.3:** Hệ thống trừ chênh lệch khỏi đơn giá Set Menu/bàn theo chính sách áp dụng.
- **A3.4:** Hệ thống tính lại tổng tiền.

### A4. Sử dụng nhiều Set Menu
- **A4.1:** Khách hàng chọn nhiều Set Menu.
- **A4.2:** Sales nhập số lượng bàn cho từng Set Menu.
- **A4.3:** Hệ thống tính thành tiền từng Set Menu.
- **A4.4:** Hệ thống cộng tổng giá trị thực đơn.
- **A4.5:** Hệ thống tính đơn giá trung bình/bàn.

### A5. Ghi nhận món chay
- **A5.1:** Khách hàng yêu cầu món chay.
- **A5.2:** Sales chọn loại yêu cầu Món chay.
- **A5.3:** Sales nhập số lượng bàn hoặc số suất áp dụng.
- **A5.4:** Hệ thống lưu yêu cầu vào thực đơn.

### A6. Ghi nhận dị ứng thực phẩm
- **A6.1:** Khách hàng thông báo dị ứng thực phẩm.
- **A6.2:** Sales chọn Dị ứng thực phẩm.
- **A6.3:** Sales nhập nguyên liệu cần tránh.
- **A6.4:** Hệ thống lưu thông tin cảnh báo cùng thực đơn.

---

## 14. Luồng ngoại lệ – Exception Flow

### E1. Món thay thế không hợp lệ
- **E1.1:** Sales chọn món không thuộc danh sách món có thể thay thế.
- **E1.2:** Hệ thống từ chối lựa chọn.
- **E1.3:** Hệ thống thông báo: *"Món được chọn không thuộc danh sách món thay thế hợp lệ."*

### E2. Set Menu chưa đủ món
- **E2.1:** Sales cố gắng lưu Set Menu nhưng thiếu món trong nhóm bắt buộc.
- **E2.2:** Hệ thống không cho phép lưu.
- **E2.3:** Hệ thống thông báo nhóm món còn thiếu: *"Set Menu chưa đủ số lượng món theo cấu hình."*

### E3. Giá món không hợp lệ
- **E3.1:** Hệ thống không tìm thấy đơn giá của món.
- **E3.2:** Hệ thống không cho phép tính giá.
- **E3.3:** Hệ thống thông báo: *"Không thể xác định đơn giá món ăn. Vui lòng kiểm tra lại danh mục món."*

### E4. Yêu cầu đặc biệt thiếu thông tin
- **E4.1:** Sales chọn yêu cầu dị ứng thực phẩm nhưng không nhập nguyên liệu cần tránh.
- **E4.2:** Hệ thống yêu cầu bổ sung thông tin.
- **E4.3:** Hệ thống thông báo: *"Vui lòng nhập nguyên liệu hoặc thực phẩm khách hàng bị dị ứng."*

### E5. Số lượng bàn không hợp lệ
- **E5.1:** Sales nhập số lượng bàn nhỏ hơn hoặc bằng 0.
- **E5.2:** Hệ thống không cho phép tiếp tục.
- **E5.3:** Hệ thống thông báo: *"Số lượng bàn phải lớn hơn 0."*

---

## 15. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :--- | :--- |
| **BR-01** | Set Menu được phân loại thành Cơ bản, Phổ biến và Cao cấp. |
| **BR-02** | Menu cơ bản có khoảng 6 món, giá tham khảo 3.500.000–5.000.000 VNĐ/bàn. |
| **BR-03** | Menu phổ biến có khoảng 7–8 món, giá tham khảo 5.000.000–10.000.000 VNĐ/bàn. |
| **BR-04** | Menu cao cấp có khoảng 9–10 món hoặc nhiều hơn, giá tham khảo 8.000.000–20.000.000 VNĐ/bàn. |
| **BR-05** | Một Set Menu được tính theo đơn vị bàn. |
| **BR-06** | Một sự kiện có thể sử dụng một hoặc nhiều Set Menu. |
| **BR-07** | Khi sử dụng nhiều Set Menu, Sales phải xác định số lượng bàn cho từng Set Menu. |
| **BR-08** | Thành tiền Set Menu = Đơn giá/bàn × Số lượng bàn. |
| **BR-09** | Khách hàng có thể thay đổi món theo danh sách món được phép thay thế. |
| **BR-10** | Khi đổi món, hệ thống phải tự động tính chênh lệch giá. |
| **BR-11** | Món mới có giá cao hơn thì cộng phần chênh lệch vào đơn giá Set Menu/bàn. |
| **BR-12** | Món mới có giá thấp hơn thì trừ phần chênh lệch theo chính sách nhà hàng. |
| **BR-13** | Sau khi đổi món, hệ thống phải cập nhật lại đơn giá Set Menu và tổng tiền. |
| **BR-14** | Khách hàng có thể ghi nhận yêu cầu món chay. |
| **BR-15** | Khách hàng có thể ghi nhận thông tin dị ứng và nguyên liệu cần tránh. |
| **BR-16** | Yêu cầu đặc biệt phải được lưu cùng thực đơn của sự kiện. |
| **BR-17** | Tổng giá trị thực đơn = Tổng thành tiền của tất cả Set Menu. |
| **BR-18** | Đơn giá trung bình/bàn = Tổng giá trị thực đơn ÷ Tổng số bàn. |
| **BR-19** | Đơn giá được lưu và hiển thị theo đơn vị VNĐ/bàn. |
| **BR-20** | Số lượng món trong Set Menu được cấu hình theo từng Set Menu, không bắt buộc tất cả Set Menu có cùng số lượng món. |
| **BR-21** | Các thay đổi về món ăn và giá phải được cập nhật vào báo giá/hợp đồng khi thực đơn được xác nhận. |
| **BR-22** | Giá Set Menu ngoài khoảng giá tham khảo phải được hệ thống cảnh báo để Sales kiểm tra. |
| **BR-23** | Giá thực tế của Set Menu được quản lý theo cấu hình của từng nhà hàng. |

---

## 16. Tiêu chí nghiệm thu – Acceptance Criteria

### AC-01 – Hiển thị Set Menu
- **Given** hệ thống có các Set Menu đang được cung cấp
- **When** Sales mở chức năng chọn thực đơn
- **Then** hệ thống hiển thị tên, phân khúc, số món, danh sách món và đơn giá/bàn.

### AC-02 – Phân loại Set Menu
- **Given** hệ thống có các Set Menu thuộc nhiều phân khúc
- **When** Sales xem danh sách Set Menu
- **Then** hệ thống phân loại được Menu Cơ bản, Menu Phổ biến và Menu Cao cấp.

### AC-03 – Chọn số lượng bàn
- **Given** khách hàng đã chọn Set Menu
- **When** Sales nhập số lượng bàn
- **Then** hệ thống tính thành tiền bằng đơn giá/bàn × số lượng bàn.

### AC-04 – Đổi món giá cao hơn
- **Given** khách hàng thay một món có giá thấp bằng món có giá cao hơn
- **When** Sales xác nhận đổi món
- **Then** hệ thống tự động cộng phần chênh lệch vào đơn giá Set Menu/bàn và tính lại tổng tiền.

### AC-05 – Đổi món giá thấp hơn
- **Given** khách hàng thay một món có giá cao bằng món có giá thấp hơn
- **When** Sales xác nhận đổi món
- **Then** hệ thống tự động trừ phần chênh lệch theo chính sách áp dụng.

### AC-06 – Không thay đổi giá
- **Given** món mới có cùng đơn giá với món cũ
- **When** Sales thực hiện đổi món
- **Then** giá Set Menu không thay đổi.

### AC-07 – Sử dụng nhiều Set Menu
- **Given** sự kiện sử dụng nhiều Set Menu
- **When** Sales nhập số lượng bàn của từng Set Menu
- **Then** hệ thống tính thành tiền riêng cho từng Set Menu và tổng giá trị thực đơn.

### AC-08 – Tính đơn giá trung bình/bàn
- **Given** sự kiện sử dụng nhiều Set Menu có đơn giá khác nhau
- **When** Sales hoàn tất lựa chọn thực đơn
- **Then** hệ thống tính: $\text{Đơn giá trung bình/bàn} = \frac{\text{Tổng giá trị Set Menu}}{\text{Tổng số bàn}}$ và hiển thị kết quả bằng VNĐ/bàn.

### AC-09 – Ghi nhận món chay
- **Given** khách hàng có yêu cầu món chay
- **When** Sales ghi nhận yêu cầu
- **Then** hệ thống lưu yêu cầu và số lượng bàn/suất áp dụng.

### AC-10 – Ghi nhận dị ứng
- **Given** khách hàng thông báo dị ứng thực phẩm
- **When** Sales nhập nguyên liệu cần tránh
- **Then** hệ thống lưu thông tin dị ứng và hiển thị cảnh báo trong thông tin thực đơn.

### AC-11 – Kiểm tra cấu trúc Set Menu
- **Given** Set Menu có cấu trúc món được cấu hình
- **When** Sales lưu thực đơn
- **Then** hệ thống chỉ cho phép lưu khi Set Menu đáp ứng đầy đủ số lượng món theo cấu hình.

### AC-12 – Kiểm tra đơn giá
- **Given** đơn giá Set Menu được cập nhật sau khi đổi món
- **When** Sales lưu thực đơn
- **Then** hệ thống kiểm tra và cảnh báo nếu đơn giá nằm ngoài khoảng giá tham khảo của phân khúc.

### AC-13 – Lưu thực đơn
- **Given** thực đơn đã đầy đủ và hợp lệ
- **When** Sales xác nhận lưu
- **Then** hệ thống lưu Set Menu, số lượng bàn, món ăn, giá sau điều chỉnh và các yêu cầu đặc biệt vào sự kiện.

---

## 17. Hậu điều kiện

Sau khi UC-06 hoàn tất thành công:
- Set Menu được gắn với sự kiện.
- Phân khúc Set Menu được ghi nhận.
- Số lượng bàn của từng Set Menu được lưu.
- Danh sách món ăn được lưu theo từng nhóm.
- Các món thay thế được ghi nhận.
- Chênh lệch giá được tính tự động.
- Đơn giá Set Menu sau điều chỉnh được cập nhật.
- Tổng giá trị từng Set Menu được tính.
- Tổng giá trị thực đơn được cập nhật.
- Đơn giá trung bình/bàn được tính bằng VND/bàn.
- Yêu cầu món chay được lưu.
- Thông tin dị ứng thực phẩm được lưu và cảnh báo.
- Thực đơn sẵn sàng được sử dụng cho bước lập báo giá và hợp đồng.
- Giá thực đơn được sử dụng làm cơ sở cho các bước tính tiền cọc và quyết toán tiếp theo.
