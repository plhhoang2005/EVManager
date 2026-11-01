# UC-11: Điều phối nhân sự phục vụ và phân công ca trực sự kiện

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

---

## 1. Thông tin Use Case

| Thành phần | Nội dung |
| :--- | :--- |
| **Mã Use Case** | UC-11 |
| **Tên Use Case** | Điều phối nhân sự phục vụ và phân công ca trực sự kiện |
| **Actor chính** | Quản lý sảnh (Coordinator) |
| **Actor phụ** | Nhân viên phục vụ, MC, Kỹ thuật viên |
| **Actor liên quan** | Hệ thống EVManager |
| **Mục tiêu** | Phân bổ nhân sự phù hợp với quy mô tiệc, lập ca trực, thông báo lịch làm việc và ghi nhận điểm danh nhân sự. |
| **Trigger** | Sự kiện được xác nhận đặt chính thức và Coordinator tiến hành phân công ca trực trước ngày diễn ra tiệc. |
| **Tiền điều kiện** | Sự kiện đã được tạo; hợp đồng đã xác nhận; sảnh, thời gian và số lượng bàn đã cố định; danh sách nhân viên khả dụng trên hệ thống; người thực hiện là Coordinator. |
| **Hậu điều kiện thành công** | Sự kiện có danh sách phân công nhân sự đủ định mức, không trùng ca, nhân viên nhận được thông báo lịch và kết quả điểm danh được ghi nhận. |
| **Hậu điều kiện thất bại** | Phân công nhân sự không thể lưu do trùng ca hoặc thiếu nhân sự so với định mức nghiệp vụ. |

---

## 2. Phạm vi chức năng

Use Case cho phép Coordinator:
1. Xem danh sách các sự kiện đã được xác nhận.
2. Xem số lượng bàn của từng tiệc.
3. Tự động tính định mức nhân sự.
4. Phân công nhân viên phục vụ.
5. Phân công MC.
6. Phân công kỹ thuật viên âm thanh.
7. Kiểm tra nhân viên có bị trùng ca hay không.
8. Lập danh sách ca trực.
9. Gửi thông báo lịch làm việc.
10. Theo dõi trạng thái xác nhận của nhân viên.
11. Ghi nhận điểm danh khi nhân viên bắt đầu ca.
12. Ghi nhận tình trạng đi làm / vắng / trễ.
13. Lưu lịch sử phân công và điểm danh.

---

## 3. Định mức nhân sự

Hệ thống tự động tính số lượng nhân sự tối thiểu dựa trên số bàn tiệc.

### 3.1. Nhân viên phục vụ
Quy định: Cứ 2 bàn tiệc cần 1 nhân viên phục vụ.

**Công thức:**
$$\text{Số NV phục vụ} = \left\lceil \frac{\text{Số bàn}}{2} \right\rceil$$

*(Trong đó $\lceil x \rceil$ là phép làm tròn lên).*

**Bảng định mức tham khảo:**

| Số bàn | Nhân viên phục vụ tối thiểu |
| :---: | :---: |
| 10 | 5 |
| 15 | 8 |
| 20 | 10 |
| 25 | 13 |
| 30 | 15 |
| 40 | 20 |
| 50 | 25 |

*Ví dụ: Tiệc có 25 bàn $\rightarrow 25 / 2 = 12,5 \rightarrow$ Cần 13 nhân viên phục vụ.*

### 3.2. MC
Mỗi tiệc cần: **1 MC**

### 3.3. Kỹ thuật viên âm thanh
Mỗi tiệc cần: **2 kỹ thuật viên âm thanh**

**Tổng định mức nhân sự cho tiệc $N$ bàn:**
$$\text{Tổng nhân sự tối thiểu} = \left\lceil \frac{N}{2} \right\rceil + 1 \text{ MC} + 2 \text{ Kỹ thuật viên}$$

---

## 4. Điều kiện trước

Trước khi thực hiện Use Case:
- Sự kiện đã được tạo trên hệ thống.
- Hợp đồng đã được xác nhận.
- Sảnh và thời gian tổ chức đã được xác định.
- Số lượng bàn tiệc đã được xác định.
- Danh sách nhân viên đang hoạt động đã có trên hệ thống.
- Coordinator có quyền thực hiện phân công nhân sự.

---

## 5. Luồng chính

- **Bước 1. Coordinator mở danh sách sự kiện:** Truy cập `Quản lý sự kiện` $\rightarrow$ `Điều phối nhân sự`. Hệ thống hiển thị danh sách các sự kiện sắp diễn ra (Mã HĐ, Khách hàng, Ngày tổ chức, Thời gian, Sảnh, Số bàn, Trạng thái).
- **Bước 2. Chọn sự kiện:** Coordinator chọn một sự kiện cần phân công nhân sự.
- **Bước 3. Tính định mức nhân sự:** Hệ thống tự động tính NV phục vụ $= \lceil \text{Số bàn} / 2 \rceil$, 1 MC, 2 Kỹ thuật viên.
- **Bước 4. Hiển thị danh sách nhân viên:** Hệ thống hiển thị danh sách nhân viên có thể phân công (Mã NV, Họ tên, Vị trí, Trạng thái, Ca đang phân công, Tình trạng sẵn sàng).
- **Bước 5. Phân công nhân viên phục vụ:** Coordinator chọn đủ số lượng NV phục vụ theo định mức.
- **Bước 6. Phân công MC:** Coordinator chọn 1 MC cho sự kiện.
- **Bước 7. Phân công kỹ thuật viên:** Coordinator chọn 2 kỹ thuật viên âm thanh.
- **Bước 8. Kiểm tra trùng ca:** Hệ thống kiểm tra nhân sự được chọn có trùng lịch sự kiện khác trong cùng thời gian hay không. Nếu trùng $\rightarrow$ Hiển thị cảnh báo *"Nhân viên đã được phân công cho một sự kiện khác trong cùng thời gian"*, yêu cầu chọn người khác.
- **Bước 9. Lưu phân công:** Coordinator chọn `Lưu phân công`. Hệ thống lưu thông tin phân công (Sự kiện, Nhân viên, Vị trí, Ca, Thời gian, Sảnh, Người phân công).
- **Bước 10. Gửi thông báo:** Hệ thống gửi thông báo lịch làm việc cho nhân viên được phân công trước ngày diễn ra sự kiện.
- **Bước 11. Nhân viên xác nhận lịch:** Nhân viên xem thông báo và chọn `Đã nhận lịch`.

---

## 6. Luồng điểm danh nhân sự

- **Bước 12. Mở chức năng điểm danh:** Khi đến ngày tiệc, Coordinator mở `Điều phối sự kiện` $\rightarrow$ `Điểm danh nhân sự`.
- **Bước 13. Ghi nhận điểm danh:** Coordinator ghi nhận trạng thái (**Có mặt**, **Đi trễ**, **Vắng mặt**). Hệ thống lưu Nhân viên, Sự kiện, Thời gian điểm danh, Người thực hiện, Trạng thái.
- **Bước 14. Xử lý nhân viên vắng:** Nếu nhân viên vắng mặt, Coordinator ghi chú và thực hiện điều phối nhân viên thay thế nếu cần.
- **Bước 15. Hoàn tất điểm danh:** Lưu bảng điểm danh sự kiện phục vụ theo dõi, đánh giá ca làm việc và báo cáo nhân sự.

---

## 7. Luồng thay thế

- **ALT-01: Không đủ nhân viên phục vụ:** Số lượng chọn $< \text{Định mức} \rightarrow$ Hệ thống cảnh báo *"Chưa đủ nhân sự phục vụ theo định mức"*, không cho hoàn tất hoặc yêu cầu chọn thêm.
- **ALT-02: Nhân viên bị trùng ca:** Hệ thống cảnh báo trùng ca $\rightarrow$ Coordinator chọn nhân viên khác.
- **ALT-03: Nhân viên không xác nhận lịch:** Trạng thái hiển thị `Chưa xác nhận` $\rightarrow$ Coordinator có thể gửi lại thông báo.
- **ALT-04: Nhân viên vắng mặt:** Coordinator đánh dấu `Vắng mặt` và phân công nhân viên thay thế nếu còn nhân sự khả dụng.
- **ALT-05: Đi trễ:** Coordinator chọn `Đi trễ`, hệ thống lưu thời gian điểm danh thực tế.

---

## 8. Ngoại lệ

| Mã | Ngoại lệ | Xử lý |
| :---: | :--- | :--- |
| **EX-11-01** | Không tìm thấy sự kiện | Không thể phân công |
| **EX-11-02** | Số bàn chưa xác định | Không thể tính định mức |
| **EX-11-03** | Không đủ nhân viên | Hiển thị cảnh báo |
| **EX-11-04** | Nhân viên trùng ca | Không cho phân công |
| **EX-11-05** | Nhân viên đã nghỉ/ngưng hoạt động | Không cho chọn |
| **EX-11-06** | Không gửi được thông báo | Lưu trạng thái gửi thất bại và cho phép gửi lại |
| **EX-11-07** | Nhân viên vắng mặt | Cho phép điều phối người thay thế |
| **EX-11-08** | Điểm danh ngoài thời gian cho phép | Hiển thị cảnh báo theo chính sách hệ thống |

---

## 9. Quy tắc nghiệp vụ

| Mã | Quy tắc |
| :---: | :--- |
| **BR-11-01** | Cứ 2 bàn tiệc cần tối thiểu 1 nhân viên phục vụ. |
| **BR-11-02** | Số nhân viên phục vụ được tính bằng $\lceil \text{Số bàn} / 2 \rceil$. |
| **BR-11-03** | Mỗi tiệc cần 1 MC. |
| **BR-11-04** | Mỗi tiệc cần 2 kỹ thuật viên âm thanh. |
| **BR-11-05** | Chỉ Coordinator có quyền lập và điều chỉnh phân công nhân sự. |
| **BR-11-06** | Một nhân viên không được phân công cho hai sự kiện bị trùng thời gian. |
| **BR-11-07** | Hệ thống phải kiểm tra trùng ca trước khi lưu phân công. |
| **BR-11-08** | Danh sách phân công phải được gửi cho nhân viên trước ngày diễn ra sự kiện. |
| **BR-11-09** | Nhân viên có thể xác nhận đã nhận lịch. |
| **BR-11-10** | Coordinator có quyền ghi nhận điểm danh. |
| **BR-11-11** | Hệ thống phải lưu thời gian và trạng thái điểm danh. |
| **BR-11-12** | Trạng thái điểm danh gồm tối thiểu: Có mặt, Đi trễ, Vắng mặt. |
| **BR-11-13** | Nhân viên vắng có thể được thay thế bởi nhân viên phù hợp nếu còn nhân sự. |

---

## 10. Tiêu chí nghiệm thu

| Mã | Tiêu chí |
| :---: | :--- |
| **AC-11-01** | Hệ thống tự động tính đúng số nhân viên phục vụ theo số bàn. |
| **AC-11-02** | Tiệc luôn yêu cầu 1 MC. |
| **AC-11-03** | Tiệc luôn yêu cầu 2 kỹ thuật viên âm thanh. |
| **AC-11-04** | Coordinator có thể phân công nhân sự cho sự kiện. |
| **AC-11-05** | Hệ thống phát hiện nhân viên bị trùng ca. |
| **AC-11-06** | Không cho lưu phân công có nhân viên trùng ca. |
| **AC-11-07** | Hệ thống gửi thông báo lịch làm việc trước ngày sự kiện. |
| **AC-11-08** | Nhân viên có thể xác nhận đã nhận lịch. |
| **AC-11-09** | Coordinator có thể ghi nhận điểm danh. |
| **AC-11-10** | Hệ thống lưu chính xác thời gian và trạng thái điểm danh. |
| **AC-11-11** | Có thể xác định nhân viên vắng mặt/đi trễ. |
| **AC-11-12** | Lịch sử phân công và điểm danh được lưu để tra cứu. |

---

## 11. Hậu điều kiện

Sau khi UC-11 hoàn tất:
- Sự kiện có danh sách nhân sự được phân công đúng định mức (NV phục vụ, MC, Kỹ thuật viên).
- Cảnh báo xung đột ca trực được giải quyết.
- Nhân viên nhận được thông báo lịch làm việc và xác nhận.
- Kết quả điểm danh nhân sự (Có mặt, Đi trễ, Vắng mặt) được lưu hệ thống.
- Lịch sử phân công và điểm danh sẵn sàng phục vụ báo cáo và đánh giá nhân sự.
