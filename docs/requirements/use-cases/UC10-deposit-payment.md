# UC-10: Quản lý đặt cọc đợt 1 và xuất phiếu thu tiền

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-10 |
| **Tên Use Case** | Quản lý đặt cọc đợt 1 và xuất phiếu thu tiền |
| **Actor chính** | Nhân viên Kế toán / Thu ngân |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Nhân viên Sales, Hệ thống EVManager |
| **Mục tiêu** | Ghi nhận tiền cọc đợt 1, xuất phiếu thu và chuyển trạng thái sảnh từ "Tạm giữ" sang "Chính thức khóa sảnh". |
| **Trigger** | Khách hàng thực hiện thanh toán cọc đợt 1 sau khi ký hợp đồng tiệc cưới. |
| **Tiền điều kiện** | Hợp đồng tồn tại trên hệ thống ở trạng thái hợp lệ; xác định được tổng giá trị tạm tính; sảnh ở trạng thái Tạm giữ; người thực hiện có quyền Kế toán/Thu ngân. |
| **Hậu điều kiện thành công** | Ghi nhận tiền cọc, tự động sinh phiếu thu, lưu lịch sử thanh toán, sảnh chuyển từ "Tạm giữ" sang "Chính thức khóa sảnh". |
| **Hậu điều kiện thất bại** | Giao dịch thanh toán không được xác nhận, phiếu thu không được tạo, sảnh vẫn giữ nguyên trạng thái Tạm giữ. |

---

## 2. Phạm vi chức năng

Use Case cho phép hệ thống:
1. Kiểm tra hợp đồng đã được ký/xác nhận.
2. Xác định tổng giá trị hợp đồng tạm tính.
3. Tự động tính số tiền cọc tối thiểu.
4. Ghi nhận phương thức thanh toán.
5. Xác nhận số tiền khách hàng thực tế thanh toán.
6. Sinh phiếu thu tiền tự động.
7. Ghi nhận lịch sử thanh toán.
8. Chuyển trạng thái khoản thanh toán.
9. Chuyển trạng thái sảnh từ "Tạm giữ" sang "Chính thức khóa sảnh" sau khi đủ điều kiện.
10. Lưu thông tin người xác nhận thu tiền.

---

## 3. Quy định tiền cọc đợt 1

Tiền cọc đợt 1 tối thiểu bằng:
$$\text{Tiền cọc tối thiểu} = \text{Tổng giá trị hợp đồng tạm tính} \times 30\%$$

Trong đó:
- Tổng giá trị hợp đồng tạm tính được lấy từ hợp đồng đã xác nhận.
- Tỷ lệ cọc tối thiểu: **30%**.
- Khách hàng không được xác nhận đặt cọc nếu số tiền thanh toán thấp hơn mức tối thiểu, trừ trường hợp có quyền điều chỉnh/duyệt theo chính sách của hệ thống.

**Ví dụ:**
- Tổng giá trị hợp đồng tạm tính: `100.000.000 VNĐ`
- Tiền cọc tối thiểu:
$$100.000.000 \times 30\% = 30.000.000 \text{ VNĐ}$$

Khách hàng phải thanh toán tối thiểu `30.000.000 VNĐ` để đáp ứng điều kiện đặt cọc đợt 1.

---

## 4. Hình thức thanh toán

Hệ thống hỗ trợ 3 hình thức thanh toán:

| Phương thức | Mô tả |
| :--- | :--- |
| **Tiền mặt** | Khách hàng thanh toán trực tiếp cho Thu ngân/Kế toán |
| **Chuyển khoản ngân hàng** | Thanh toán thông qua tài khoản ngân hàng của trung tâm |
| **Thẻ POS** | Thanh toán bằng thẻ thông qua thiết bị POS |

### 4.1. Chuyển khoản ngân hàng – QR Code mô phỏng
Hệ thống có thể hiển thị QR Code mô phỏng chứa thông tin: Tên đơn vị nhận tiền, Số tài khoản, Ngân hàng, Số tiền cần thanh toán, Mã hợp đồng, Nội dung chuyển khoản.

**Ví dụ nội dung chuyển khoản:**
$$\text{COC HD-20260926-001}$$

*QR Code trong phạm vi Use Case này được sử dụng để mô phỏng quy trình thanh toán, không bắt buộc tích hợp trực tiếp với hệ thống ngân hàng thực tế.*

---

## 5. Luồng chính

- **Bước 1. Mở chức năng thu tiền cọc:** Kế toán/Thu ngân tìm kiếm hợp đồng cần thanh toán cọc. Hệ thống hiển thị: Mã hợp đồng, Tên khách hàng, Ngày tổ chức, Sảnh, Tổng giá trị tạm tính, Tiền cọc tối thiểu, Số tiền đã thanh toán, Số tiền còn phải thanh toán.
- **Bước 2. Hệ thống tính tiền cọc tối thiểu:** Cọc tối thiểu = Tổng giá trị hợp đồng tạm tính $\times 30\%$.
- **Bước 3. Nhập số tiền khách hàng thanh toán:** Kế toán/Thu ngân nhập số tiền thực tế. Nếu $< 30\% \rightarrow$ không cho xác nhận. Nếu $\ge 30\% \rightarrow$ cho phép tiếp tục.
- **Bước 4. Chọn phương thức thanh toán:** Tiền mặt, Chuyển khoản, Thẻ POS.
- **Bước 5. Kiểm tra thanh toán:** Tiền mặt (kiểm đếm), Chuyển khoản (kiểm tra giao dịch/QR mô phỏng, nhập mã tham chiếu), Thẻ POS (thực hiện qua thiết bị, nhập mã giao dịch).
- **Bước 6. Xác nhận đã nhận tiền:** Chỉ Kế toán hoặc Thu ngân có quyền nhấn "Xác nhận đã nhận tiền cọc". Hệ thống lưu: Người xác nhận, Thời gian, Số tiền, Phương thức, Mã giao dịch.
- **Bước 7. Sinh phiếu thu:** Hệ thống tự động sinh Phiếu thu tiền cọc (Số phiếu, Mã HĐ, Ngày thu, Người nộp, Số tiền, Số tiền bằng chữ, Nội dung, Phương thức, Người thu, Người xác nhận).
- **Bước 8. Cập nhật trạng thái thanh toán:** Chuyển **Chưa cọc $\rightarrow$ Đã nhận cọc đợt 1**, lưu giao dịch vào lịch sử thanh toán.
- **Bước 9. Chính thức khóa sảnh:** Sảnh chuyển từ **Tạm giữ $\rightarrow$ Chính thức khóa sảnh**.
- **Bước 10. Thông báo kết quả:** Hiển thị thông báo thành công. Có thể xem, in, xuất PDF hoặc gửi phiếu thu cho khách hàng.

---

## 6. Luồng thay thế

- **ALT-01: Khách hàng thanh toán dưới mức tối thiểu:** Số tiền $< 30\% \rightarrow$ Hệ thống cảnh báo *"Số tiền đặt cọc chưa đạt mức tối thiểu 30% giá trị hợp đồng"*, không cho hoàn tất đặt cọc. Sảnh giữ trạng thái Tạm giữ.
- **ALT-02: Khách hàng thanh toán lớn hơn 30%:** Số tiền $> 30\% \rightarrow$ Hệ thống cho phép xác nhận và ghi nhận đúng số tiền thực tế (Ví dụ HĐ 100tr, cọc tối thiểu 30tr, khách trả 40tr $\rightarrow$ Ghi nhận cọc 40tr).
- **ALT-03: Thanh toán chuyển khoản:** Người thu tiền chọn Chuyển khoản $\rightarrow$ Hệ thống hiển thị QR Code mô phỏng và thông tin tài khoản. Kế toán/Thu ngân xác nhận sau khi kiểm tra.
- **ALT-04: Thanh toán bằng POS:** Người thu tiền chọn Thẻ POS $\rightarrow$ Ghi nhận số tiền, thời gian, mã giao dịch POS $\rightarrow$ Người có quyền xác nhận giao dịch.
- **ALT-05: Thanh toán thất bại:** Giao dịch không thành công $\rightarrow$ Không tạo phiếu thu, không chuyển trạng thái sảnh, hiển thị thông báo lỗi và cho phép thử lại.

---

## 7. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :---: | :--- | :--- |
| **EX-10-01** | Không tìm thấy hợp đồng | Không cho thu cọc |
| **EX-10-02** | Hợp đồng không hợp lệ | Không cho xác nhận |
| **EX-10-03** | Tiền cọc < 30% | Không hoàn tất đặt cọc |
| **EX-10-04** | Người dùng không có quyền | Từ chối thao tác |
| **EX-10-05** | Thanh toán thất bại | Không ghi nhận giao dịch thành công |
| **EX-10-06** | Không tạo được phiếu thu | Giao dịch chưa hoàn tất |
| **EX-10-07** | Sảnh đã được khóa bởi hợp đồng khác | Không cho xác nhận khóa sảnh |
| **EX-10-08** | Mã giao dịch bị trùng | Yêu cầu kiểm tra lại giao dịch |

---

## 8. Quyền hạn người dùng

Đây là quy tắc kiểm soát quan trọng của Use Case:

| Chức năng | Sales | Kế toán | Thu ngân | Admin/Quản lý |
| :--- | :---: | :---: | :---: | :---: |
| Xem thông tin cọc | ✓ | ✓ | ✓ | ✓ |
| Nhập yêu cầu thanh toán | ✓ | ✓ | ✓ | ✓ |
| **Xác nhận đã nhận tiền** | ✗ | **✓** | **✓** | Theo phân quyền |
| Sinh phiếu thu | ✗ | ✓ | ✓ | Theo phân quyền |
| In phiếu thu | ✓ | ✓ | ✓ | ✓ |
| Chính thức khóa sảnh | ✗ | ✓ | ✓ | Theo phân quyền |
| Hủy/điều chỉnh giao dịch | ✗ | Theo phân quyền | Theo phân quyền | Theo phân quyền |

*Quy tắc BR-10-01: Chỉ Kế toán hoặc Thu ngân mới được quyền xác nhận trạng thái "Đã nhận tiền cọc".*

---

## 9. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| :---: | :--- |
| **BR-10-01** | Tiền cọc đợt 1 tối thiểu bằng 30% tổng giá trị hợp đồng tạm tính. |
| **BR-10-02** | Hệ thống tự động tính số tiền cọc tối thiểu. |
| **BR-10-03** | Hỗ trợ tiền mặt, chuyển khoản và thẻ POS. |
| **BR-10-04** | QR Code chuyển khoản trong phạm vi hệ thống có thể sử dụng cho mục đích mô phỏng. |
| **BR-10-05** | Chỉ Kế toán/Thu ngân có quyền xác nhận đã nhận tiền. |
| **BR-10-06** | Phiếu thu được sinh tự động sau khi giao dịch được xác nhận hợp lệ. |
| **BR-10-07** | Mỗi giao dịch thu tiền phải được lưu vào lịch sử thanh toán. |
| **BR-10-08** | Hệ thống phải lưu người xác nhận và thời gian xác nhận. |
| **BR-10-09** | Chỉ khi tiền cọc được xác nhận đủ điều kiện, sảnh mới chuyển từ "Tạm giữ" sang "Chính thức khóa sảnh". |
| **BR-10-10** | Không cho phép khóa sảnh nếu giao dịch thanh toán chưa được xác nhận. |
| **BR-10-11** | Không được tạo phiếu thu chính thức cho giao dịch thanh toán thất bại. |
| **BR-10-12** | Số tiền thực tế nhận phải được lưu chính xác trên giao dịch và phiếu thu. |

---

## 10. Tiêu chí nghiệm thu

| Mã | Tiêu chí |
| :---: | :--- |
| **AC-10-01** | Hệ thống tự động tính đúng tiền cọc tối thiểu = 30% giá trị hợp đồng. |
| **AC-10-02** | Không cho xác nhận nếu tiền cọc thấp hơn 30%. |
| **AC-10-03** | Hệ thống hỗ trợ tiền mặt, chuyển khoản và POS. |
| **AC-10-04** | Hệ thống hiển thị QR Code mô phỏng khi chọn chuyển khoản. |
| **AC-10-05** | Chỉ Kế toán/Thu ngân có thể xác nhận đã nhận tiền. |
| **AC-10-06** | Hệ thống tự động sinh phiếu thu sau khi xác nhận thành công. |
| **AC-10-07** | Phiếu thu chứa đầy đủ thông tin giao dịch. |
| **AC-10-08** | Hệ thống lưu lịch sử thanh toán. |
| **AC-10-09** | Sảnh chuyển từ "Tạm giữ" sang "Chính thức khóa sảnh" sau khi cọc hợp lệ được xác nhận. |
| **AC-10-10** | Không khóa sảnh khi thanh toán chưa được xác nhận. |
| **AC-10-11** | Người không có quyền không thể xác nhận thu tiền. |
| **AC-10-12** | Có thể in/xuất phiếu thu sau khi giao dịch hoàn tất. |

---

## 11. Hậu điều kiện

Sau khi UC-10 hoàn tất:
- Tiền cọc đợt 1 được ghi nhận và lưu vào lịch sử thanh toán.
- Phiếu thu được tự động khởi tạo.
- Sảnh chuyển từ "Tạm giữ" sang "Chính thức khóa sảnh".
- Ghi nhận người và thời điểm xác nhận tiền.
- Khách hàng có thể nhận phiếu thu theo kênh hỗ trợ.
- Giao dịch sẵn sàng chuyển sang các bước thanh toán/quyết toán tiếp theo.
