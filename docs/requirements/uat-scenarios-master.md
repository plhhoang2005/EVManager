# BỘ KỊCH BẢN KIỂM THỬ CHẤP NHẬN NGƯỜI DÙNG (UAT) – EVManager

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Mục tiêu UAT

UAT nhằm xác nhận hệ thống EVManager đáp ứng các nghiệp vụ thực tế của Trung tâm Hội nghị & Tiệc cưới, tập trung vào 3 quy trình kinh doanh lõi:

* **Quy trình 1 – Tiếp nhận, tư vấn và đặt/giữ sảnh**: Tiếp nhận yêu cầu $\rightarrow$ Nhập thông tin khách $\rightarrow$ Kiểm tra sảnh $\rightarrow$ Kiểm tra trùng lịch $\rightarrow$ Giữ sảnh.
* **Quy trình 2 – Chọn thực đơn, dịch vụ, báo giá, hợp đồng và đặt cọc**: Chọn số bàn $\rightarrow$ Chọn Set Menu $\rightarrow$ Chọn dịch vụ $\rightarrow$ Tính báo giá $\rightarrow$ Xác nhận hợp đồng $\rightarrow$ Thanh toán tiền cọc.
* **Quy trình 3 – Điều phối, nghiệm thu và quyết toán**: Phân công nhân sự $\rightarrow$ Chuẩn bị tiệc $\rightarrow$ Theo dõi phát sinh $\rightarrow$ Nghiệm thu $\rightarrow$ Quyết toán đợt 2 $\rightarrow$ Hoàn tất sự kiện.

---

## 2. Danh sách 15 kịch bản UAT

| Mã | Quy trình | Kịch bản kiểm thử | Kết quả |
| :---: | :---: | :--- | :---: |
| **UAT-01** | QT1 | Tiếp nhận yêu cầu đặt tiệc mới | Đạt / Không đạt |
| **UAT-02** | QT1 | Kiểm tra sảnh phù hợp với số khách | Đạt / Không đạt |
| **UAT-03** | QT1 | Cảnh báo trùng lịch sảnh | Đạt / Không đạt |
| **UAT-04** | QT1 | Giữ sảnh trong thời hạn 48 giờ | Đạt / Không đạt |
| **UAT-05** | QT1 | Tự động giải phóng sảnh khi hết thời gian giữ | Đạt / Không đạt |
| **UAT-06** | QT2 | Chọn Set Menu và số lượng bàn | Đạt / Không đạt |
| **UAT-07** | QT2 | Tùy chỉnh món ăn và yêu cầu đặc biệt | Đạt / Không đạt |
| **UAT-08** | QT2 | Chọn dịch vụ bổ sung và kiểm tra ưu đãi | Đạt / Không đạt |
| **UAT-09** | QT2 | Tự động tính báo giá và VAT | Đạt / Không đạt |
| **UAT-10** | QT2 | Tạo hợp đồng và xác nhận thông tin | Đạt / Không đạt |
| **UAT-11** | QT2 | Thanh toán tiền cọc và khóa chính thức sảnh | Đạt / Không đạt |
| **UAT-12** | QT3 | Tính toán và phân công nhân sự phục vụ | Đạt / Không đạt |
| **UAT-13** | QT3 | Ghi nhận dịch vụ/phát sinh thực tế | Đạt / Không đạt |
| **UAT-14** | QT3 | Nghiệm thu và tính quyết toán đợt 2 | Đạt / Không đạt |
| **UAT-15** | QT3 | Hoàn tất sự kiện và giải phóng sảnh | Đạt / Không đạt |

---

## 3. CHI TIẾT KỊCH BẢN UAT

### UAT-01 – Tiếp nhận yêu cầu đặt tiệc mới
* **Mục tiêu**: Kiểm tra Sales có thể tạo yêu cầu đặt tiệc cho khách hàng.
* **Dữ liệu thử nghiệm**: Khách hàng: Nguyễn Minh Anh, SĐT: `0901234567`, Số khách dự kiến: 340, Ngày tổ chức: `03/10/2026`, Ca: Tối, Nhu cầu: Tiệc cưới.
* **Các bước thực hiện**:
  1. Đăng nhập bằng tài khoản Sales.
  2. Chọn **Quản lý khách hàng** $\rightarrow$ **Thêm khách hàng**.
  3. Nhập: Họ tên: Nguyễn Minh Anh, SĐT: `0901234567` $\rightarrow$ Nhấn Lưu.
  4. Chọn **Tạo yêu cầu đặt tiệc**, nhập Ngày `03/10/2026`, Ca Tối, Số khách 340 $\rightarrow$ Nhấn Tiếp tục.
* **Kết quả mong đợi**: Khách hàng được lưu thành công, yêu cầu đặt tiệc được tạo và hệ thống chuyển sang bước tìm kiếm sảnh phù hợp.

### UAT-02 – Kiểm tra sảnh phù hợp với số khách
* **Mục tiêu**: Kiểm tra hệ thống tìm được sảnh đáp ứng số lượng khách.
* **Dữ liệu**: Số khách: 340, Ngày: `03/10/2026`, Ca: Tối.
* **Các bước**: Từ yêu cầu đặt tiệc, chọn **Tìm sảnh**, nhập 340 khách, ngày `03/10/2026`, ca tối $\rightarrow$ Nhấn Tìm kiếm.
* **Kết quả mong đợi**: Hệ thống chỉ hiển thị các sảnh có sức chứa phù hợp và còn khả dụng (ví dụ: Sảnh Kim Cương – 500 khách – Còn trống). Sảnh không đủ sức chứa bị loại hoặc đánh dấu không phù hợp.

### UAT-03 – Cảnh báo trùng lịch sảnh
* **Mục tiêu**: Kiểm tra hệ thống ngăn không cho đặt trùng sảnh.
* **Dữ liệu**: Đã tồn tại hợp đồng cho Sảnh S04 – Ngọc Trai, Ngày `21/11/2026`, Ca tối.
* **Các bước**: Đăng nhập Sales $\rightarrow$ Tạo yêu cầu mới ngày `21/11/2026`, ca tối, Sảnh Ngọc Trai $\rightarrow$ Nhấn Giữ sảnh/Đặt sảnh.
* **Kết quả mong đợi**: Hệ thống hiển thị cảnh báo **Trùng lịch sảnh**, không cho khóa sảnh, hiển thị thông tin thời gian bị trùng và đề xuất sảnh thay thế.

### UAT-04 – Giữ sảnh trong 48 giờ
* **Mục tiêu**: Kiểm tra chức năng tạm giữ sảnh khi khách chưa hoàn tất đặt cọc.
* **Các bước**: Tạo yêu cầu đặt tiệc hợp lệ $\rightarrow$ Chọn sảnh trống $\rightarrow$ Nhấn Giữ sảnh $\rightarrow$ Xác nhận thời gian giữ.
* **Kết quả mong đợi**: Sảnh chuyển trạng thái `TRỐNG` $\rightarrow$ `TẠM GIỮ`. Hệ thống lưu thời điểm giữ, thời điểm hết hạn (mặc định 48 giờ), người thực hiện và khách hàng.

### UAT-05 – Tự động giải phóng sảnh khi hết 48 giờ
* **Mục tiêu**: Kiểm tra hệ thống tự động trả sảnh khi khách không xác nhận/đặt cọc.
* **Các bước**: Tạo yêu cầu giữ sảnh $\rightarrow$ Không thực hiện đặt cọc $\rightarrow$ Mô phỏng thời điểm vượt quá 48 giờ $\rightarrow$ Kiểm tra trạng thái sảnh.
* **Kết quả mong đợi**: Trạng thái sảnh chuyển `TẠM GIỮ` $\rightarrow$ `TRỐNG`. Yêu cầu giữ sảnh hết hiệu lực, có thông báo giải phóng sảnh và sảnh khả dụng cho yêu cầu khác.

### UAT-06 – Chọn Set Menu và số lượng bàn
* **Mục tiêu**: Kiểm tra việc chọn thực đơn và số lượng bàn.
* **Dữ liệu**: Số bàn: 30, Set Menu: POPULAR, Đơn giá: `5.500.000 VNĐ/bàn`.
* **Các bước**: Mở yêu cầu đặt tiệc $\rightarrow$ Nhập 30 bàn $\rightarrow$ Chọn Set Menu Phổ biến $\rightarrow$ Nhấn Xác nhận thực đơn.
* **Kết quả mong đợi**: Hệ thống hiển thị $30 \times 5.500.000 = 165.000.000 \text{ VNĐ}$ và lưu Set Menu vào đơn đặt tiệc.

### UAT-07 – Tùy chỉnh món ăn và yêu cầu đặc biệt
* **Mục tiêu**: Kiểm tra thay đổi món ăn và ghi nhận yêu cầu của khách.
* **Các bước**: Mở Set Menu đã chọn $\rightarrow$ Chọn món thay thế $\rightarrow$ Nhập yêu cầu: *"Khách có người dị ứng hải sản, không sử dụng món có tôm/cua."* $\rightarrow$ Nhấn Lưu thay đổi.
* **Kết quả mong đợi**: Hệ thống thay thế món, tính chênh lệch giá (nếu có), lưu và hiển thị yêu cầu đặc biệt trên báo giá.

### UAT-08 – Chọn dịch vụ bổ sung và kiểm tra ưu đãi
* **Mục tiêu**: Kiểm tra việc chọn dịch vụ và chính sách tặng kèm.
* **Dữ liệu**: 30 bàn; Dịch vụ: Trang trí hoa, Âm thanh ánh sáng, Ban nhạc & MC, Tháp rượu & bánh cưới.
* **Các bước**: Chọn Dịch vụ bổ sung $\rightarrow$ Chọn các dịch vụ cần sử dụng $\rightarrow$ Nhấn Tính dịch vụ $\rightarrow$ Kiểm tra ưu đãi.
* **Kết quả mong đợi**: Vì số lượng bàn >25, hệ thống tự động áp dụng dịch vụ tặng kèm (MC: Tặng kèm – 0 VNĐ, Tháp ly/rượu: Tặng kèm – 0 VNĐ). Dịch vụ tính phí cộng vào tổng tiền.

### UAT-09 – Tự động tính báo giá và VAT
* **Mục tiêu**: Kiểm tra hệ thống tính chính xác tổng tiền báo giá.
* **Dữ liệu**: Set Menu: 165.000.000 VNĐ, Dịch vụ: 20.000.000 VNĐ, Chiết khấu: 5%, VAT: 8%.
* **Các bước**: Mở Báo giá $\rightarrow$ Nhấn Tính báo giá.
* **Kết quả mong đợi**:
  - Giá trị trước chiết khấu = $165.000.000 + 20.000.000 = 185.000.000 \text{ VNĐ}$
  - Chiết khấu (5%) = $185.000.000 \times 5\% = 9.250.000 \text{ VNĐ}$
  - Trước VAT = $175.750.000 \text{ VNĐ}$
  - VAT (8%) = $175.750.000 \times 8\% = 14.060.000 \text{ VNĐ}$
  - **Tổng thanh toán**: $189.810.000 \text{ VNĐ}$

### UAT-10 – Tạo hợp đồng và xác nhận thông tin
* **Mục tiêu**: Kiểm tra tạo hợp đồng từ báo giá đã xác nhận.
* **Các bước**: Mở báo giá đã duyệt $\rightarrow$ Nhấn Tạo hợp đồng $\rightarrow$ Kiểm tra thông tin $\rightarrow$ Nhấn Xác nhận hợp đồng.
* **Kết quả mong đợi**: Hệ thống tạo mã hợp đồng dạng `HD-YYYYMMDD-XXX`, thông tin khớp với báo giá và trạng thái chuyển sang chờ đặt cọc.

### UAT-11 – Thanh toán tiền cọc và khóa chính thức sảnh
* **Mục tiêu**: Kiểm tra nghiệp vụ đặt cọc tối thiểu 30%.
* **Các bước**: Đăng nhập Kế toán/Thu ngân $\rightarrow$ Mở hợp đồng $\rightarrow$ Hệ thống tính tiền cọc tối thiểu ($\text{Tổng hợp đồng} \times 30\%$) $\rightarrow$ Chọn phương thức thanh toán $\rightarrow$ Nhập số tiền $\rightarrow$ Nhấn Xác nhận đã nhận cọc.
* **Kết quả mong đợi**: Tạo phiếu thu, cập nhật thanh toán, chỉ Kế toán/Thu ngân được xác nhận tiền cọc, sảnh chuyển `TẠM GIỮ` $\rightarrow$ `CHÍNH THỨC KHÓA SẢNH`.

### UAT-12 – Tính toán và phân công nhân sự
* **Mục tiêu**: Kiểm tra hệ thống tính số nhân sự phục vụ và phân công.
* **Dữ liệu**: 30 bàn $\rightarrow$ Nhân viên phục vụ = $\lceil 30 / 2 \rceil = 15$ người + 1 MC + 2 kỹ thuật âm thanh.
* **Các bước**: Đăng nhập Coordinator $\rightarrow$ Mở sự kiện $\rightarrow$ Chọn **Điều phối nhân sự** $\rightarrow$ Chọn danh sách nhân sự $\rightarrow$ Nhấn Lưu phân công & Gửi thông báo.
* **Kết quả mong đợi**: Tính đúng số lượng nhân sự, ngăn phân công trùng ca, lưu danh sách và gửi thông báo cho nhân viên.

### UAT-13 – Ghi nhận dịch vụ/phát sinh thực tế
* **Mục tiêu**: Kiểm tra ghi nhận các phát sinh trong quá trình tổ chức tiệc.
* **Dữ liệu**: Khách dùng thêm 2 bàn và 5 két nước ngọt.
* **Các bước**: Mở sự kiện đang diễn ra $\rightarrow$ Chọn **Phát sinh dịch vụ** $\rightarrow$ Nhập 2 bàn phát sinh, 5 két nước ngọt $\rightarrow$ Nhấn Lưu phát sinh.
* **Kết quả mong đợi**: Lưu số lượng thực tế, tính thành tiền theo đơn giá và cộng vào chi phí quyết toán.

### UAT-14 – Nghiệm thu và tính quyết toán đợt 2
* **Mục tiêu**: Kiểm tra lập biên bản nghiệm thu và tính số tiền khách cần thanh toán.
* **Các bước**: Đăng nhập Coordinator $\rightarrow$ Mở sự kiện kết thúc $\rightarrow$ Chọn **Nghiệm thu** $\rightarrow$ Nhập số liệu thực tế & đền bù $\rightarrow$ Nhấn Tính quyết toán $\rightarrow$ Lập biên bản nghiệm thu $\rightarrow$ Khách xác nhận.
* **Kết quả mong đợi**: Hệ thống tính $\text{Còn lại} = \text{Tổng thực tế} - \text{Tiền cọc đợt 1} + \text{Chi phí đền bù}$. Biên bản nghiệm thu được lưu và trạng thái chuyển `Đã nghiệm thu`.

### UAT-15 – Hoàn tất sự kiện và giải phóng sảnh
* **Mục tiêu**: Kiểm tra hoàn tất toàn bộ quy trình sau khi thanh toán.
* **Các bước**: Đăng nhập Kế toán/Thu ngân $\rightarrow$ Mở biên bản nghiệm thu $\rightarrow$ Nhập thanh toán đợt 2 $\rightarrow$ Nhấn Xác nhận thanh toán $\rightarrow$ Tạo phiếu quyết toán.
* **Kết quả mong đợi**:
  - Sự kiện: `Đang diễn ra` $\rightarrow$ `Chờ nghiệm thu` $\rightarrow$ `Đã nghiệm thu` $\rightarrow$ `Đã quyết toán` $\rightarrow$ `Đã hoàn tất`.
  - Sảnh: `Đang sử dụng` $\rightarrow$ `Trống` (Giải phóng sẵn sàng cho tiệc tiếp theo).

---

## 4. Tiêu chí nghiệm thu tổng thể

Bộ UAT được xem là đạt khi:
1. 15/15 kịch bản được thực hiện.
2. Các chức năng chính của 3 quy trình lõi hoạt động đúng.
3. Không có lỗi nghiêm trọng (Critical/High) làm dừng quy trình nghiệp vụ.
4. Dữ liệu giữa Sales, Coordinator và Kế toán được đồng bộ.
5. Hệ thống ngăn được trường hợp đặt trùng sảnh.
6. Các phép tính tiền, tiền cọc và quyết toán chính xác.
7. Trạng thái sảnh và sự kiện được cập nhật đúng.
8. Người dùng cuối có thể thực hiện nghiệp vụ mà không cần can thiệp kỹ thuật.

---

## 5. Mẫu phiếu ghi nhận kết quả UAT

### PHIẾU GHI NHẬN KẾT QUẢ UAT

**Thông tin chung:**
- Dự án: EVManager – Hệ thống quản lý Trung tâm Hội nghị & Tiệc cưới
- Mã kịch bản: `UAT-___` | Tên kịch bản: ______________________________
- Người kiểm thử: ______________________________ (Vai trò: Sales / Kế toán / Coordinator / Khách hàng)
- Ngày kiểm thử: ____ / ____ / ______ | Môi trường: UAT / Beta

**Kết quả kiểm thử:**

| Nội dung | Kết quả |
| :--- | :--- |
| **Dữ liệu đầu vào** | __________________________ |
| **Kết quả thực tế** | __________________________ |
| **Kết quả mong đợi** | __________________________ |
| **Trạng thái** | ☐ Đạt &nbsp;&nbsp;&nbsp;&nbsp; ☐ Không đạt |
| **Mức độ lỗi** | ☐ Critical &nbsp;&nbsp; ☐ High &nbsp;&nbsp; ☐ Medium &nbsp;&nbsp; ☐ Low |

**Góp ý cải tiến & Đề xuất xử lý:**
........................................................................................................................

**Xác nhận:**
- Người kiểm thử (Ký & ghi rõ họ tên): _____________
- Đại diện nghiệp vụ (Ký & ghi rõ họ tên): _____________
- QA/Tester (Ký & ghi rõ họ tên): _____________

---

## 6. Bảng tổng hợp kết quả UAT

| Mã UAT | Kịch bản | Người kiểm thử | Kết quả | Góp ý | Trạng thái xử lý |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **UAT-01** | Tiếp nhận yêu cầu | | ☐ Đạt ☐ Không đạt | | |
| **UAT-02** | Kiểm tra sảnh | | ☐ Đạt ☐ Không đạt | | |
| **UAT-03** | Trùng lịch | | ☐ Đạt ☐ Không đạt | | |
| **UAT-04** | Giữ sảnh | | ☐ Đạt ☐ Không đạt | | |
| **UAT-05** | Hết hạn giữ sảnh | | ☐ Đạt ☐ Không đạt | | |
| **UAT-06** | Chọn Set Menu | | ☐ Đạt ☐ Không đạt | | |
| **UAT-07** | Tùy chỉnh món | | ☐ Đạt ☐ Không đạt | | |
| **UAT-08** | Dịch vụ bổ sung | | ☐ Đạt ☐ Không đạt | | |
| **UAT-09** | Báo giá | | ☐ Đạt ☐ Không đạt | | |
| **UAT-10** | Hợp đồng | | ☐ Đạt ☐ Không đạt | | |
| **UAT-11** | Đặt cọc | | ☐ Đạt ☐ Không đạt | | |
| **UAT-12** | Phân công nhân sự | | ☐ Đạt ☐ Không đạt | | |
| **UAT-13** | Phát sinh | | ☐ Đạt ☐ Không đạt | | |
| **UAT-14** | Nghiệm thu | | ☐ Đạt ☐ Không đạt | | |
| **UAT-15** | Quyết toán & hoàn tất | | ☐ Đạt ☐ Không đạt | | |

---

## 7. Quy ước kết quả UAT

- **ĐẠT**: Chức năng hoạt động đúng với yêu cầu và kết quả mong đợi.
- **KHÔNG ĐẠT**: Kết quả thực tế khác kết quả mong đợi hoặc xuất hiện lỗi ảnh hưởng đến nghiệp vụ.
- **GÓP Ý CẢI TIẾN**: Chức năng vẫn đáp ứng yêu cầu nhưng người dùng đề xuất thay đổi về giao diện, thao tác hoặc bổ sung tiện ích *(không mặc định là lỗi hệ thống)*.
