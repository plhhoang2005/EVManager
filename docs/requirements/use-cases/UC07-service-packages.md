# UC-07: Chọn các gói dịch vụ bổ sung đi kèm tiệc cưới

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-07 |
| **Tên Use Case** | Chọn các gói dịch vụ bổ sung đi kèm tiệc cưới |
| **Actor chính** | Nhân viên Tư vấn (Sales) |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Hệ thống EVManager |
| **Mục tiêu** | Cho phép Sales và khách hàng lựa chọn các gói dịch vụ bổ sung phù hợp với nhu cầu tiệc cưới, tự động áp dụng các dịch vụ tặng kèm theo số lượng bàn và tính tổng chi phí dịch vụ. |
| **Trigger** | Khách hàng bắt đầu lựa chọn các dịch vụ bổ sung cho tiệc cưới. |
| **Tiền điều kiện** | Người dùng đã đăng nhập; khách hàng và sự kiện đã tồn tại; danh mục dịch vụ và bảng giá đã được cấu hình trong hệ thống. |
| **Hậu điều kiện thành công** | Các dịch vụ được lưu vào sự kiện, dịch vụ tặng kèm được áp dụng đúng điều kiện và tổng tiền dịch vụ được cập nhật vào đơn đặt tiệc. |
| **Hậu điều kiện thất bại** | Dịch vụ không được lưu hoặc hệ thống yêu cầu người dùng điều chỉnh dữ liệu không hợp lệ. |

---

## 2. Phạm vi chức năng

UC-07 bao gồm:
1. Xem danh mục các gói dịch vụ.
2. Xem chi tiết từng gói dịch vụ.
3. Chọn một hoặc nhiều gói dịch vụ.
4. Chọn mức/gói dịch vụ phù hợp với nhu cầu.
5. Xác định số lượng dịch vụ sử dụng.
6. Kiểm tra dịch vụ được tặng kèm theo số lượng bàn.
7. Tự động áp dụng dịch vụ miễn phí khi đủ điều kiện.
8. Tính giá từng dịch vụ.
9. Tính chi phí dịch vụ phát sinh ngoài gói tiêu chuẩn.
10. Tính tổng tiền dịch vụ.
11. Cập nhật tổng tiền vào đơn đặt tiệc/báo giá.
12. Lưu các dịch vụ đã chọn vào sự kiện.

---

## 3. Danh mục các gói dịch vụ

Hệ thống cung cấp các nhóm dịch vụ bổ sung chính:

| STT | Danh mục dịch vụ | Nội dung |
| :---: | :--- | :--- |
| **1** | Gói trang trí hoa tươi | Trang trí bàn tiệc, sân khấu, khu vực đón khách bằng hoa tươi |
| **2** | Gói âm thanh ánh sáng sân khấu | Hệ thống loa, micro, mixer, đèn sân khấu và thiết bị hỗ trợ |
| **3** | Ban nhạc & MC | MC chương trình, ban nhạc/nhóm nhạc phục vụ tiệc |
| **4** | Tháp rượu & Bánh cưới | Tháp ly/rượu, bánh cưới và các hạng mục đi kèm |

Mỗi danh mục có thể có nhiều gói dịch vụ hoặc mức giá khác nhau tùy cấu hình của nhà hàng.

**Ví dụ:**

| Dịch vụ | Gói | Đơn vị tính |
| :--- | :--- | :---: |
| Trang trí hoa tươi | Cơ bản / Tiêu chuẩn / Cao cấp | Gói |
| Âm thanh ánh sáng | Tiêu chuẩn / Nâng cao / Cao cấp | Gói |
| Ban nhạc & MC | MC / Ban nhạc / MC + Ban nhạc | Gói |
| Tháp rượu & Bánh cưới | Tháp rượu / Bánh cưới / Combo | Gói |

---

## 4. Chính sách dịch vụ tặng kèm theo số lượng bàn

Hệ thống hỗ trợ cấu hình chương trình tặng kèm dịch vụ dựa trên số lượng bàn tiệc.

**Ví dụ chính sách:**
Khi số lượng bàn tiệc lớn hơn 25 bàn, khách hàng được tặng MC và tháp ly/rượu theo chính sách của nhà hàng.

### 4.1. Quy tắc áp dụng

| Số lượng bàn | Dịch vụ tặng kèm |
| :---: | :--- |
| $\le 25$ bàn | Không áp dụng ưu đãi này |
| $> 25$ bàn | Tặng MC + Tháp ly/rượu |

Hệ thống phải tự động kiểm tra số lượng bàn sau khi khách hàng chọn Set Menu.

**Nếu:** $\text{Số bàn} > 25$
$\rightarrow$ Hệ thống tự động thêm dịch vụ:
- MC: Miễn phí
- Tháp ly/rượu: Miễn phí

Các dịch vụ tặng kèm phải được hiển thị rõ trên báo giá để khách hàng biết dịch vụ nào được miễn phí.

*Mức $>25$ bàn và danh sách dịch vụ tặng kèm là chính sách nghiệp vụ được cấu hình trong hệ thống. Nếu nhà hàng thay đổi chương trình khuyến mãi, Admin/Quản lý có thể cập nhật điều kiện.*

---

## 5. Luồng chính – Basic Flow

### B1. Mở chức năng dịch vụ
- **B1.1:** Sales mở hồ sơ sự kiện của khách hàng.
- **B1.2:** Sales chọn chức năng Dịch vụ bổ sung.
- **B1.3:** Hệ thống hiển thị danh sách các danh mục dịch vụ.
- **B1.4:** Hệ thống hiển thị:
  - Tên dịch vụ.
  - Tên gói.
  - Mô tả.
  - Đơn vị tính.
  - Đơn giá.
  - Điều kiện áp dụng.
  - Trạng thái còn cung cấp/không cung cấp.
  - Dịch vụ đang được tặng kèm nếu có.

---

## 6. Chọn gói dịch vụ

- **B2.1:** Sales tư vấn các gói dịch vụ cho khách hàng.
- **B2.2:** Khách hàng lựa chọn dịch vụ cần sử dụng.
- **B2.3:** Sales chọn một hoặc nhiều gói dịch vụ.
- **B2.4:** Hệ thống hiển thị chi tiết từng gói.
  - *Ví dụ:* Gói trang trí hoa tươi, Gói âm thanh ánh sáng, Gói MC, Gói ban nhạc, Gói tháp rượu, Gói bánh cưới.
- **B2.5:** Sales xác nhận các dịch vụ khách hàng lựa chọn.

---

## 7. Kiểm tra dịch vụ tặng kèm

Sau khi khách hàng chọn dịch vụ và số lượng bàn đã được xác định, hệ thống tự động kiểm tra chính sách ưu đãi.

- **B3.1:** Hệ thống lấy tổng số bàn của sự kiện.
- **B3.2:** Hệ thống kiểm tra điều kiện khuyến mãi.
- **B3.3:** Nếu số bàn $\le 25$: $\rightarrow$ Không áp dụng chương trình tặng MC và tháp ly/rượu.
- **B3.4:** Nếu số bàn $> 25$: $\rightarrow$ Hệ thống tự động áp dụng:
  - MC = Miễn phí.
  - Tháp ly/rượu = Miễn phí.
- **B3.5:** Hệ thống hiển thị thông báo: *"Sự kiện đạt điều kiện trên 25 bàn. Khách hàng được tặng MC và Tháp ly/rượu."*
- **B3.6:** Các dịch vụ tặng kèm được đánh dấu: *"Tặng kèm – 0 VNĐ"*.

---

## 8. Tính tiền dịch vụ

Đối với các dịch vụ không được tặng kèm, hệ thống lấy đơn giá được cấu hình và tính thành tiền.

**Công thức:**
$$\text{Thành tiền dịch vụ} = \text{Đơn giá} \times \text{Số lượng}$$

**Ví dụ:**

| Dịch vụ | Đơn giá | Số lượng | Thành tiền |
| :--- | :---: | :---: | :---: |
| Trang trí hoa tươi | 5.000.000 | 1 | 5.000.000 |
| Âm thanh ánh sáng | 8.000.000 | 1 | 8.000.000 |
| MC | 3.000.000 | 1 | 3.000.000 |
| Tháp rượu | 2.000.000 | 1 | 2.000.000 |
| **Tổng dịch vụ** | | | **18.000.000 VNĐ** |

Nếu sự kiện đủ điều kiện tặng MC và tháp rượu:

| Dịch vụ | Đơn giá | Trạng thái | Thành tiền |
| :--- | :---: | :---: | :---: |
| Trang trí hoa tươi | 5.000.000 | Tính phí | 5.000.000 |
| Âm thanh ánh sáng | 8.000.000 | Tính phí | 8.000.000 |
| MC | 3.000.000 | Tặng | 0 |
| Tháp rượu | 2.000.000 | Tặng | 0 |

$$\rightarrow \text{Tổng dịch vụ phải thanh toán} = 13.000.000 \text{ VNĐ}$$

---

## 9. Dịch vụ phát sinh ngoài gói tiêu chuẩn

Trong trường hợp khách hàng yêu cầu thêm dịch vụ ngoài phạm vi gói đã chọn:

- **B4.1:** Sales chọn Thêm dịch vụ phát sinh.
- **B4.2:** Hệ thống hiển thị danh sách dịch vụ phát sinh được phép cung cấp.
- **B4.3:** Sales chọn dịch vụ.
- **B4.4:** Sales nhập số lượng.
- **B4.5:** Hệ thống lấy đơn giá phát sinh đã được cấu hình.
- **B4.6:** Hệ thống tính thành tiền.

**Công thức:**
$$\text{Tiền dịch vụ phát sinh} = \text{Đơn giá phát sinh} \times \text{Số lượng}$$

**Ví dụ:**
Khách hàng đã chọn gói âm thanh tiêu chuẩn nhưng yêu cầu thêm 2 micro không dây.
Nếu:
- Đơn giá phát sinh: 500.000 VNĐ/micro.
- Số lượng: 2.

$$\rightarrow \text{Tiền phát sinh}: 500.000 \times 2 = 1.000.000 \text{ VNĐ}$$

Khoản tiền này được cộng vào tổng chi phí dịch vụ.

---

## 10. Tính tổng tiền dịch vụ

Hệ thống tính tổng tiền của toàn bộ dịch vụ.

**Công thức:**
$$\text{Tổng tiền dịch vụ} = \text{Tổng dịch vụ tiêu chuẩn} + \text{Tổng dịch vụ phát sinh} - \text{Giá trị dịch vụ tặng kèm}$$

Trong đó:
Giá trị dịch vụ tặng kèm được ghi nhận để thể hiện giá trị ưu đãi nhưng không tính vào số tiền khách hàng phải thanh toán.

**Ví dụ:**
- Dịch vụ tiêu chuẩn: 20.000.000 VNĐ.
- Dịch vụ phát sinh: 3.000.000 VNĐ.
- Dịch vụ được tặng: 5.000.000 VNĐ.

$$\rightarrow \text{Giá trị dịch vụ phải thanh toán}: 20.000.000 + 3.000.000 - 5.000.000 = 18.000.000 \text{ VNĐ}$$

---

## 11. Cập nhật vào đơn đặt tiệc

Sau khi hoàn tất lựa chọn dịch vụ:
- **B5.1:** Hệ thống tổng hợp các dịch vụ đã chọn.
- **B5.2:** Hệ thống hiển thị:
  - Tên dịch vụ.
  - Tên gói.
  - Số lượng.
  - Đơn giá.
  - Thành tiền.
  - Dịch vụ tặng kèm.
  - Dịch vụ phát sinh.
  - Tổng tiền dịch vụ.
- **B5.3:** Sales kiểm tra thông tin.
- **B5.4:** Sales xác nhận lưu.
- **B5.5:** Hệ thống cập nhật tổng tiền dịch vụ vào đơn đặt tiệc/báo giá.
- **B5.6:** Hệ thống thông báo: *"Lưu dịch vụ thành công."*

---

## 12. Luồng phụ – Alternative Flow

### A1. Không chọn dịch vụ bổ sung
- **A1.1:** Khách hàng không có nhu cầu sử dụng dịch vụ bổ sung.
- **A1.2:** Hệ thống ghi nhận tổng tiền dịch vụ = 0 VNĐ.
- **A1.3:** Sales tiếp tục sang bước lập báo giá.

### A2. Đạt điều kiện tặng dịch vụ
- **A2.1:** Số lượng bàn $> 25$.
- **A2.2:** Hệ thống xác định khách hàng đủ điều kiện.
- **A2.3:** Hệ thống tự động thêm MC và tháp ly/rượu vào danh sách dịch vụ.
- **A2.4:** Giá thanh toán của các dịch vụ này = 0 VNĐ.
- **A2.5:** Hệ thống hiển thị nhãn "Tặng kèm".

### A3. Không đạt điều kiện tặng dịch vụ
- **A3.1:** Số lượng bàn $\le 25$.
- **A3.2:** Hệ thống không áp dụng ưu đãi.
- **A3.3:** Nếu khách hàng chọn MC hoặc tháp ly/rượu, hệ thống tính theo đơn giá hiện hành.

### A4. Thay đổi số lượng bàn
- **A4.1:** Sales thay đổi số lượng bàn của sự kiện.
- **A4.2:** Hệ thống tính lại điều kiện ưu đãi.
- **A4.3:** Nếu từ $\le 25$ bàn tăng lên $> 25$ bàn: $\rightarrow$ Tự động áp dụng ưu đãi.
- **A4.4:** Nếu từ $> 25$ bàn giảm xuống $\le 25$ bàn: $\rightarrow$ Hệ thống hủy trạng thái tặng kèm và tính lại giá dịch vụ theo đơn giá hiện hành nếu khách hàng vẫn sử dụng dịch vụ.

### A5. Thêm dịch vụ phát sinh
- **A5.1:** Khách hàng yêu cầu thêm dịch vụ ngoài gói.
- **A5.2:** Sales nhập dịch vụ và số lượng.
- **A5.3:** Hệ thống lấy đơn giá phát sinh.
- **A5.4:** Hệ thống tính tiền.
- **A5.5:** Hệ thống cộng vào tổng tiền dịch vụ.

---

## 13. Luồng ngoại lệ – Exception Flow

### E1. Dịch vụ không còn cung cấp
- **E1.1:** Sales chọn dịch vụ đã ngừng cung cấp.
- **E1.2:** Hệ thống không cho phép thêm dịch vụ.
- **E1.3:** Hệ thống thông báo: *"Dịch vụ hiện không còn được cung cấp. Vui lòng chọn dịch vụ khác."*

### E2. Đơn giá dịch vụ chưa được cấu hình
- **E2.1:** Sales chọn dịch vụ nhưng hệ thống không tìm thấy đơn giá.
- **E2.2:** Hệ thống không cho phép tính tổng tiền.
- **E2.3:** Hệ thống thông báo: *"Dịch vụ chưa được cấu hình đơn giá. Vui lòng liên hệ Quản lý."*

### E3. Số lượng dịch vụ không hợp lệ
- **E3.1:** Sales nhập số lượng $\le 0$.
- **E3.2:** Hệ thống từ chối dữ liệu.
- **E3.3:** Hệ thống thông báo: *"Số lượng dịch vụ phải lớn hơn 0."*

### E4. Dịch vụ tặng kèm không hợp lệ
- **E4.1:** Hệ thống phát hiện dịch vụ tặng kèm không còn trong chương trình khuyến mãi.
- **E4.2:** Hệ thống không áp dụng miễn phí.
- **E4.3:** Hệ thống thông báo: *"Chính sách tặng kèm đã thay đổi. Vui lòng kiểm tra lại chương trình ưu đãi."*

---

## 14. Quy tắc nghiệp vụ – Business Rules

| Mã | Quy tắc |
| :--- | :--- |
| **BR-01** | Hệ thống cung cấp các nhóm dịch vụ: Trang trí hoa tươi; Âm thanh ánh sáng sân khấu; Ban nhạc & MC; Tháp rượu & Bánh cưới. |
| **BR-02** | Một sự kiện có thể lựa chọn một hoặc nhiều gói dịch vụ. |
| **BR-03** | Mỗi gói dịch vụ phải có đơn giá được cấu hình trước khi được sử dụng. |
| **BR-04** | Số lượng dịch vụ phải lớn hơn 0 đối với dịch vụ tính theo số lượng. |
| **BR-05** | Hệ thống phải tự động kiểm tra số lượng bàn để xác định điều kiện tặng kèm. |
| **BR-06** | Khi số lượng bàn >25 bàn, khách hàng được tặng MC và Tháp ly/rượu theo chính sách cấu hình. |
| **BR-07** | Dịch vụ tặng kèm có giá thanh toán bằng 0 VNĐ nhưng vẫn phải được lưu trong đơn đặt tiệc. |
| **BR-08** | Hệ thống phải hiển thị rõ dịch vụ nào là dịch vụ tặng kèm. |
| **BR-09** | Khi số lượng bàn thay đổi, hệ thống phải tự động kiểm tra lại điều kiện tặng kèm. |
| **BR-10** | Dịch vụ phát sinh ngoài gói tiêu chuẩn phải được tính theo đơn giá phát sinh đã cấu hình. |
| **BR-11** | Thành tiền dịch vụ = Đơn giá × Số lượng. |
| **BR-12** | Tổng tiền dịch vụ phải bao gồm các dịch vụ tiêu chuẩn và dịch vụ phát sinh, đồng thời loại trừ giá trị dịch vụ được tặng. |
| **BR-13** | Tổng tiền dịch vụ phải được cộng vào tổng giá trị đơn đặt tiệc/báo giá. |
| **BR-14** | Đơn giá dịch vụ có thể được cấu hình riêng cho từng nhà hàng hoặc từng gói dịch vụ. |
| **BR-15** | Khi dịch vụ không còn cung cấp, hệ thống không cho phép tạo lựa chọn mới đối với dịch vụ đó. |
| **BR-16** | Mọi thay đổi về dịch vụ và giá phải được lưu lại để sử dụng cho báo giá và hợp đồng. |

---

## 15. Tiêu chí nghiệm thu – Acceptance Criteria

### AC-01 – Hiển thị danh mục dịch vụ
- **Given** hệ thống đã cấu hình các gói dịch vụ
- **When** Sales mở chức năng dịch vụ bổ sung
- **Then** hệ thống hiển thị đầy đủ các nhóm dịch vụ.

### AC-02 – Chọn nhiều dịch vụ
- **Given** khách hàng có nhu cầu sử dụng nhiều dịch vụ
- **When** Sales chọn các gói dịch vụ
- **Then** hệ thống cho phép lưu nhiều dịch vụ trong cùng một sự kiện.

### AC-03 – Tặng dịch vụ khi >25 bàn
- **Given** sự kiện có số lượng bàn lớn hơn 25
- **When** hệ thống kiểm tra chính sách ưu đãi
- **Then** hệ thống tự động áp dụng MC và Tháp ly/rượu là dịch vụ tặng kèm với giá thanh toán bằng 0 VNĐ.

### AC-04 – Không đủ điều kiện tặng
- **Given** sự kiện có số lượng bàn nhỏ hơn hoặc bằng 25
- **When** hệ thống kiểm tra chính sách ưu đãi
- **Then** hệ thống không áp dụng chương trình tặng MC và Tháp ly/rượu.

### AC-05 – Tính tiền dịch vụ
- **Given** khách hàng chọn một hoặc nhiều dịch vụ có tính phí
- **When** Sales xác nhận dịch vụ
- **Then** hệ thống tính thành tiền theo công thức đơn giá × số lượng.

### AC-06 – Dịch vụ phát sinh
- **Given** khách hàng yêu cầu dịch vụ ngoài gói tiêu chuẩn
- **When** Sales nhập dịch vụ phát sinh và số lượng
- **Then** hệ thống lấy đơn giá phát sinh và cộng chi phí vào tổng tiền dịch vụ.

### AC-07 – Thay đổi số lượng bàn
- **Given** số lượng bàn của sự kiện thay đổi
- **When** số lượng bàn vượt qua hoặc giảm xuống dưới mốc 25
- **Then** hệ thống phải tự động tính lại điều kiện tặng dịch vụ.

### AC-08 – Tổng tiền dịch vụ
- **Given** sự kiện đã có các dịch vụ tiêu chuẩn, phát sinh và tặng kèm
- **When** Sales hoàn tất lựa chọn dịch vụ
- **Then** hệ thống hiển thị tổng tiền dịch vụ phải thanh toán chính xác.

### AC-09 – Cập nhật đơn đặt tiệc
- **Given** các dịch vụ đã được xác nhận
- **When** Sales lưu dịch vụ
- **Then** tổng tiền dịch vụ được cộng vào tổng giá trị đơn đặt tiệc/báo giá.

### AC-10 – Đơn giá chưa cấu hình
- **Given** một dịch vụ chưa có đơn giá
- **When** Sales cố gắng thêm dịch vụ
- **Then** hệ thống cảnh báo và không cho phép tính tiền dịch vụ đó.

---

## 16. Hậu điều kiện

Sau khi UC-07 hoàn tất thành công:
- Các dịch vụ được chọn được gắn với sự kiện.
- Số lượng từng dịch vụ được lưu.
- Đơn giá từng dịch vụ được ghi nhận.
- Dịch vụ tặng kèm được đánh dấu rõ ràng.
- Điều kiện tặng dịch vụ được lưu theo số lượng bàn.
- Dịch vụ phát sinh được ghi nhận.
- Chi phí dịch vụ phát sinh được tính tự động.
- Tổng tiền dịch vụ được cập nhật.
- Tổng giá trị đơn đặt tiệc/báo giá được cập nhật.
- Thông tin dịch vụ sẵn sàng được sử dụng cho lập báo giá, hợp đồng, tiền cọc và quyết toán.
