# UC-12: Nghiệm thu hoàn tất sự kiện và thanh toán quyết toán đợt 2

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-12 |
| **Tên Use Case** | Nghiệm thu hoàn tất sự kiện và thanh toán quyết toán đợt 2 |
| **Actor chính** | Nhân viên Điều phối / Coordinator |
| **Actor phụ** | Khách hàng |
| **Actor liên quan** | Kế toán / Thu ngân |
| **Hệ thống** | EVManager |
| **Mục tiêu** | Ghi nhận tình trạng thực tế sau tiệc, lập biên bản nghiệm thu, tính số tiền quyết toán đợt 2, thu phần còn lại và hoàn tất hợp đồng. |

---

## 2. Phạm vi chức năng

Use Case cho phép hệ thống:
- Ghi nhận kết quả thực tế sau khi sự kiện kết thúc.
- Kiểm kê số bàn thực tế sử dụng/phát sinh.
- Ghi nhận số lượng két bia/nước ngọt tiêu thụ thực tế.
- Ghi nhận các dịch vụ hoặc chi phí phát sinh.
- Ghi nhận thiệt hại tài sản nếu có.
- Lập biên bản nghiệm thu sau tiệc.
- Xác nhận biên bản với khách hàng.
- Tính tổng giá trị thực tế của sự kiện.
- Trừ tiền cọc đợt 1.
- Cộng chi phí đền bù nếu có.
- Tính số tiền quyết toán đợt 2.
- Thu tiền còn lại.
- Xuất hóa đơn/thông tin thanh lý hợp đồng.
- In phiếu quyết toán cuối cùng.
- Cập nhật sự kiện thành **Đã hoàn tất**.
- Giải phóng sảnh cho sự kiện tiếp theo.

---

## 3. Điều kiện trước

Trước khi thực hiện Use Case:
1. Sự kiện đã được tổ chức.
2. Hợp đồng đã được xác nhận.
3. Tiền cọc đợt 1 đã được ghi nhận.
4. Sự kiện đã đến trạng thái kết thúc.
5. Coordinator có quyền lập biên bản nghiệm thu.
6. Kế toán/Thu ngân có quyền xác nhận thanh toán quyết toán.

---

## 4. Biên bản kiểm kê sau tiệc

Sau khi sự kiện kết thúc, Coordinator thực hiện kiểm kê thực tế.

### 4.1. Thông tin chung
Biên bản gồm:
- Mã hợp đồng.
- Mã sự kiện.
- Khách hàng.
- Ngày tổ chức.
- Sảnh.
- Thời gian tổ chức.
- Người lập biên bản.
- Thời gian lập biên bản.

### 4.2. Số bàn thực tế
Hệ thống ghi nhận:
- Số bàn theo hợp đồng.
- Số bàn thực tế sử dụng.
- Số bàn phát sinh.
- Số bàn dự phòng đã sử dụng nếu có.

**Ví dụ:**

| Nội dung | Số lượng |
| :--- | :--- |
| Số bàn theo hợp đồng | 30 |
| Số bàn thực tế | 32 |
| Bàn phát sinh | 2 |

*Nếu có bàn phát sinh, hệ thống tính thêm chi phí theo đơn giá Set Menu/dịch vụ tương ứng.*

### 4.3. Đồ uống tiêu thụ thực tế
Hệ thống cho phép ghi nhận:
- Số két bia theo hợp đồng.
- Số két bia thực tế.
- Số két bia phát sinh.
- Số két nước ngọt theo hợp đồng.
- Số két nước ngọt thực tế.
- Số két nước ngọt phát sinh.

**Ví dụ:**

| Loại | Theo hợp đồng | Thực tế | Phát sinh |
| :--- | :--- | :--- | :--- |
| Bia | 20 két | 23 két | +3 |
| Nước ngọt | 10 két | 12 két | +2 |

*Giá trị phát sinh được tính theo đơn giá đã cấu hình/thỏa thuận trong hợp đồng hoặc bảng giá áp dụng.*

---

## 5. Ghi nhận chi phí phát sinh và đền bù

Ngoài số bàn và đồ uống, Coordinator có thể ghi nhận:
- Món ăn phát sinh.
- Dịch vụ phát sinh.
- Đồ uống phát sinh.
- Thời gian sử dụng dịch vụ phát sinh.
- Thiệt hại tài sản.
- Các khoản chi phí khác được hai bên xác nhận.

Mỗi khoản phát sinh cần có: Nội dung, Số lượng, Đơn giá, Thành tiền, Ghi chú, Người xác nhận.

### Chi phí đền bù
Nếu phát hiện tài sản bị hư hỏng/mất mát:
1. Ghi nhận tài sản.
2. Mô tả tình trạng.
3. Xác định chi phí đền bù theo chính sách/thỏa thuận hợp đồng.
4. Đưa khoản đền bù vào biên bản nghiệm thu và quyết toán nếu được xác nhận.

---

## 6. Luồng chính

* **Bước 1. Kết thúc sự kiện**: Sau khi tiệc kết thúc, Coordinator mở chức năng **Nghiệm thu & Quyết toán**.
* **Bước 2. Kiểm kê thực tế**: Coordinator nhập: Số bàn thực tế, Bàn phát sinh, Số két bia thực tế, Số két nước ngọt thực tế, Dịch vụ phát sinh, Các chi phí khác, Thiệt hại/đền bù (nếu có).
* **Bước 3. Hệ thống tính chi phí phát sinh**:
  $$\text{Chi phí phát sinh} = \sum \text{Các khoản phát sinh được xác nhận}$$
  *(Bao gồm: Bàn phát sinh, Đồ uống phát sinh, Dịch vụ phát sinh, Các khoản khác)*
* **Bước 4. Tính tổng giá trị thực tế**:
  $$\text{Tổng thực tế} = \text{Giá trị hợp đồng theo thực tế} + \text{Chi phí phát sinh}$$
* **Bước 5. Tính tiền quyết toán đợt 2**:
  $$\text{Còn lại} = \text{Tổng thực tế} - \text{Tiền cọc đợt 1} + \text{Chi phí đền bù (nếu có)}$$

### Ví dụ minh họa
- Tổng thực tế: `150.000.000 VNĐ`
- Tiền cọc đợt 1: `50.000.000 VNĐ`
- Chi phí đền bù: `2.000.000 VNĐ`
- **Số tiền còn lại phải thanh toán**: 
  $$\text{Còn lại} = 150.000.000 - 50.000.000 + 2.000.000 = 102.000.000 \text{ VNĐ}$$

---

## 7. Lập biên bản nghiệm thu

Sau khi kiểm kê, hệ thống tạo **Biên bản nghiệm thu sau tiệc** gồm:
1. Thông tin hợp đồng.
2. Thông tin khách hàng.
3. Thông tin sự kiện.
4. Sảnh.
5. Số bàn theo hợp đồng.
6. Số bàn thực tế.
7. Đồ uống theo hợp đồng.
8. Đồ uống thực tế.
9. Dịch vụ phát sinh.
10. Chi phí đền bù nếu có.
11. Tổng giá trị thực tế.
12. Tiền cọc đã thanh toán.
13. Số tiền còn lại.
14. Ghi chú.
15. Xác nhận của hai bên.

---

## 8. Khách hàng xác nhận nghiệm thu

Coordinator gửi biên bản cho khách hàng kiểm tra.
- **Nếu khách hàng đồng ý**: Khách hàng chọn `"Đồng ý nghiệm thu"`. Hệ thống chuyển sang bước quyết toán.
- **Nếu khách hàng không đồng ý**: Khách hàng chọn `"Yêu cầu điều chỉnh"`. Coordinator kiểm tra lại số liệu và cập nhật biên bản. Hệ thống lưu lịch sử thay đổi.

---

## 9. Thanh toán quyết toán đợt 2

1. **Bước 1**: Kế toán/Thu ngân xem số tiền còn phải thanh toán.
2. **Bước 2**: Khách hàng thanh toán số tiền quyết toán qua Tiền mặt, Chuyển khoản hoặc Thẻ POS.
3. **Bước 3**: Kế toán/Thu ngân xác nhận đã nhận tiền.
4. **Bước 4**: Hệ thống ghi nhận: Số tiền, Phương thức, Thời gian, Mã giao dịch, Người xác nhận.
5. **Bước 5**: Hệ thống chuyển trạng thái: `Chưa quyết toán` $\rightarrow$ `Đã quyết toán`.

---

## 10. Xuất hóa đơn thanh lý hợp đồng

Sau khi thanh toán hoàn tất, hệ thống cho phép tạo hóa đơn/thông tin thanh lý hợp đồng gồm: Mã hợp đồng, Khách hàng, Sự kiện, Tổng giá trị thực tế, Tiền cọc đợt 1, Phát sinh, Đền bù, Tổng tiền đã thanh toán, Số tiền quyết toán đợt 2, Tổng số tiền cuối cùng, Ngày thanh lý, Người xác nhận.

---

## 11. In phiếu quyết toán cuối cùng

Hệ thống cung cấp chức năng **In phiếu quyết toán** (Xuất file PDF hoặc in bản giấy).
Phiếu thể hiện rõ luồng tài chính:
$$\text{Tổng thực tế} \rightarrow \text{Đã cọc} \rightarrow \text{Phát sinh/Đền bù} \rightarrow \text{Còn phải thanh toán} \rightarrow \text{Đã thanh toán}$$

---

## 12. Cập nhật trạng thái sự kiện

Sau khi hoàn tất đầy đủ 4 điều kiện (Sự kiện kết thúc, Biên bản nghiệm thu xác nhận, Quyết toán thực hiện, Khoản tiền còn lại thanh toán đủ), hệ thống chuyển trạng thái:
`Đang diễn ra` $\rightarrow$ `Chờ nghiệm thu` $\rightarrow$ `Đã nghiệm thu` $\rightarrow$ `Đã quyết toán` $\rightarrow$ `Đã hoàn tất`

---

## 13. Giải phóng sảnh

Khi sự kiện chuyển sang **Đã hoàn tất**, hệ thống tự động cập nhật trạng thái sảnh:
`Đang sử dụng` $\rightarrow$ `Trống`

Sảnh được đưa trở lại danh sách sảnh có thể đặt cho các sự kiện tiếp theo. Lịch sử sử dụng sảnh vẫn được lưu trữ để tra cứu.

---

## 14. Luồng thay thế

* **ALT-01: Số bàn thực tế lớn hơn hợp đồng**: Hệ thống ghi nhận số bàn phát sinh và tự động tính thêm chi phí theo đơn giá áp dụng.
* **ALT-02: Đồ uống phát sinh**: Hệ thống ghi nhận số lượng két bia/nước ngọt phát sinh và tính chi phí bổ sung.
* **ALT-03: Không có phát sinh**: Chi phí phát sinh = 0 VNĐ. Hệ thống tiếp tục quy trình nghiệm thu bình thường.
* **ALT-04: Có thiệt hại tài sản**: Coordinator ghi nhận tài sản và chi phí đền bù. Khoản đền bù được cộng vào số tiền quyết toán.
* **ALT-05: Khách hàng không đồng ý biên bản**: Trạng thái chuyển thành `Yêu cầu điều chỉnh`, không cho hoàn tất quyết toán cho đến khi biên bản được xác nhận.
* **ALT-06: Chưa thanh toán đủ**: Hợp đồng chưa được thanh lý, sự kiện chưa chuyển sang `Đã hoàn tất` và sảnh chưa được giải phóng.

---

## 15. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :--- | :--- | :--- |
| **EX-12-01** | Không tìm thấy sự kiện | Không thể nghiệm thu |
| **EX-12-02** | Chưa kết thúc sự kiện | Không cho quyết toán |
| **EX-12-03** | Thiếu số liệu kiểm kê | Yêu cầu bổ sung |
| **EX-12-04** | Số liệu không hợp lệ | Không cho xác nhận |
| **EX-12-05** | Khách hàng không xác nhận biên bản | Chuyển yêu cầu điều chỉnh |
| **EX-12-06** | Thanh toán quyết toán thất bại | Không hoàn tất hợp đồng |
| **EX-12-07** | Không tạo được phiếu quyết toán | Cho phép tạo lại |
| **EX-12-08** | Hợp đồng chưa đủ điều kiện thanh lý | Không chuyển Đã hoàn tất |

---

## 16. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| :--- | :--- |
| **BR-12-01** | Biên bản nghiệm thu phải ghi nhận số bàn thực tế sau sự kiện. |
| **BR-12-02** | Hệ thống phải ghi nhận số lượng bia/nước ngọt tiêu thụ thực tế. |
| **BR-12-03** | Mọi khoản phát sinh phải được ghi nhận trước khi quyết toán. |
| **BR-12-04** | Tổng thực tế phải phản ánh các khoản sử dụng/phát sinh được xác nhận. |
| **BR-12-05** | Công thức quyết toán: Còn lại = Tổng thực tế − Tiền cọc đợt 1 + Chi phí đền bù (nếu có). |
| **BR-12-06** | Chi phí đền bù chỉ được cộng khi có phát sinh và được xác nhận. |
| **BR-12-07** | Khách hàng phải có cơ hội kiểm tra và xác nhận biên bản nghiệm thu. |
| **BR-12-08** | Chỉ giao dịch thanh toán đã được xác nhận mới được ghi nhận là đã quyết toán. |
| **BR-12-09** | Phải xuất được phiếu quyết toán cuối cùng. |
| **BR-12-10** | Hợp đồng chỉ được thanh lý hoàn tất khi đáp ứng đủ điều kiện theo quy trình. |
| **BR-12-11** | Sự kiện chỉ chuyển sang "Đã hoàn tất" sau khi hoàn thành nghiệm thu và quyết toán. |
| **BR-12-12** | Sau khi sự kiện hoàn tất, sảnh được giải phóng cho các sự kiện tiếp theo. |
| **BR-12-13** | Lịch sử nghiệm thu, phát sinh và thanh toán phải được lưu trữ. |

---

## 17. Tiêu chí nghiệm thu

| Mã | Tiêu chí |
| :--- | :--- |
| **AC-12-01** | Coordinator có thể lập biên bản kiểm kê sau tiệc. |
| **AC-12-02** | Có thể nhập số bàn thực tế và số bàn phát sinh. |
| **AC-12-03** | Có thể nhập số lượng bia/nước ngọt thực tế. |
| **AC-12-04** | Hệ thống tính đúng các khoản phát sinh. |
| **AC-12-05** | Hệ thống tính đúng tiền quyết toán theo công thức nghiệp vụ. |
| **AC-12-06** | Có thể ghi nhận chi phí đền bù nếu phát sinh. |
| **AC-12-07** | Khách hàng có thể xác nhận hoặc yêu cầu điều chỉnh biên bản. |
| **AC-12-08** | Kế toán/Thu ngân có thể ghi nhận thanh toán đợt 2. |
| **AC-12-09** | Hệ thống xuất được phiếu quyết toán cuối cùng. |
| **AC-12-10** | Hệ thống xuất được thông tin hóa đơn/thanh lý hợp đồng theo quy trình của trung tâm. |
| **AC-12-11** | Sự kiện chuyển sang trạng thái "Đã hoàn tất" khi đủ điều kiện. |
| **AC-12-12** | Sảnh được giải phóng sau khi sự kiện hoàn tất. |
| **AC-12-13** | Lịch sử nghiệm thu và quyết toán được lưu để tra cứu. |

---

## 18. Hậu điều kiện

Sau khi UC-12 hoàn tất:
- Biên bản nghiệm thu được lưu.
- Số bàn thực tế và số lượng bia/nước ngọt thực tế được ghi nhận.
- Các khoản phát sinh và đền bù được cập nhật.
- Tiền cọc đợt 1 được đối trừ.
- Tiền quyết toán đợt 2 được xác định và thanh toán.
- Phiếu quyết toán cuối cùng được tạo.
- Hợp đồng được thanh lý theo quy trình.
- Sự kiện chuyển sang **Đã hoàn tất**.
- Sảnh được giải phóng và sẵn sàng phục vụ sự kiện tiếp theo.
- Toàn bộ lịch sử nghiệm thu, phát sinh và thanh toán được lưu trên hệ thống.
