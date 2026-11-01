# Bảng đăng ký rủi ro dự án (Risk Register)

| Thông tin | Chi tiết |
|---|---|
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-14 (WBS Level 3 — Chương 8 Quản lý rủi ro dự án) |
| **Người thực hiện** | Hoàng (Project Manager) |
| **Ngày lập** | 22/09/2026 (Tuần 3) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Phương pháp nhận biết rủi ro (Risk Identification Methods)

Theo chuẩn PMBOK (Chương 8) và quy trình thực hiện đồ án môn học, Ban Quản lý dự án EVManager đã kết hợp 3 phương pháp chính để nhận biết các nguy cơ tiềm ẩn:

1. **Động não (Brainstorming):** Tổ chức phiên thảo luận cởi mở giữa cả 5 thành viên (PM, BA, UI/UX, Backend, QA) trong phiên họp Kick-off và phiên họp tuần 2 để liệt kê mọi trở ngại có thể phát sinh trong quá trình thiết kế, lập trình và phối hợp nhóm.
2. **Phân tích danh sách kiểm tra (Checklist Analysis):** Đối chiếu với các lỗi thường gặp trong đồ án học phần MAN104 từ các khóa trước (như lỗi đặt trùng lịch, lỗi lệch múi giờ, rủi ro nộp code muộn, xung đột mã nguồn).
3. **Phỏng vấn và tham vấn chuyên môn (Expert Judgment):** Tham khảo ý kiến định hướng của Giảng viên hướng dẫn về các bẫy kỹ thuật trong việc phân quyền và xử lý giao dịch thanh toán tiệc cưới.

---

## 2. Thang điểm và Ma trận đánh giá rủi ro ($P \times I$)

Mức độ nghiêm trọng của từng rủi ro được định lượng dựa trên hai tiêu chí: **Xác suất xảy ra ($P$)** và **Mức độ tác động ($I$)**.

### 2.1. Thang đo Xác suất ($P$ — Probability)
- **1 — Rất thấp:** Khả năng xảy ra $< 10\%$.
- **2 — Thấp:** Khả năng xảy ra từ $10\% - 25\%$.
- **3 — Trung bình:** Khả năng xảy ra từ $25\% - 40\%$.
- **4 — Cao:** Khả năng xảy ra từ $40\% - 60\%$.
- **5 — Rất cao:** Khả năng xảy ra $> 60\%$.

### 2.2. Thang đo Mức độ tác động ($I$ — Impact)
- **1 — Không đáng kể:** Ảnh hưởng nhẹ, có thể khắc phục trong vòng 1-2 giờ, không ảnh hưởng tiến độ.
- **2 — Nhẹ:** Làm chậm một số tác vụ phụ, giải quyết trong vòng 1 ngày.
- **3 — Trung bình:** Ảnh hưởng đến tiến độ tuần, gây sai sót giao diện hoặc logic phụ.
- **4 — Lớn:** Gây sai lệch nghiệp vụ cốt lõi (tính tiền, trùng sảnh), đe dọa mốc Demo Milestone.
- **5 — Nghiêm trọng:** Sập hệ thống, mất dữ liệu, không thể nộp bài hoặc bị đình chỉ nghiệm thu.

### 2.3. Ma trận đánh giá rủi ro ($5 \times 5$)
$$\text{Điểm rủi ro (Risk Score)} = P \times I$$

- **Điểm 1 – 4 (Màu xanh — Thấp):** Theo dõi định kỳ trong các phiên họp tuần.
- **Điểm 5 – 11 (Màu vàng — Trung bình):** Cần có biện pháp giảm nhẹ và chuẩn bị kế hoạch dự phòng.
- **Điểm 12 – 25 (Màu đỏ — Cao / Khẩn cấp):** Ưu tiên số 1 của PM, bắt buộc phải có giải pháp kiểm soát hàng ngày.

---

## 3. Bảng đăng ký 10 rủi ro cốt lõi của dự án EVManager

Dưới đây là danh mục 10 rủi ro thực tế được nhận diện cho dự án tiệc cưới EVManager trong vòng đời 8 tuần:

| STT | Mã RR | Tên rủi ro & Mô tả sự cố | Xác suất ($P$) | Tác động ($I$) | Điểm ($P \times I$) | Xếp hạng (Rank) | Phạm vi ảnh hưởng | Dấu hiệu nhận biết (Triggers) | Người phụ trách (Risk Owner) |
|:---:|:---:|---|:---:|:---:|:---:|:---:|:---:|---|:---:|
| 1 | **RSK-01** | **Thành viên chậm tiến độ do bận thi cử/việc cá nhân**<br>Thành viên không hoàn thành task đúng deadline sprint. | 4 (40%) | 4 (Lớn) | **16** | **1** | Toàn dự án | Không cập nhật task trên GitHub, vắng mặt hoặc ít phản hồi Zalo. | **PM (Hoàng)** |
| 2 | **RSK-02** | **Thuật toán bị lọt ca tiệc, dẫn đến đặt trùng sảnh**<br>Hệ thống cho phép đặt 2 tiệc cùng sảnh trong cùng khung giờ. | 3 (30%) | 5 (Nghiêm trọng) | **15** | **2** | Phân hệ Sự kiện & Sảnh | Khi test thử 2 tiệc cách nhau < 60 phút dọn dẹp hệ thống vẫn cho lưu. | **Backend (Phúc)** |
| 3 | **RSK-03** | **Lệch múi giờ UTC+7 làm sai ngày/giờ trên Calendar**<br>Lưu ngày giờ từ Client lên DB bị lệch 7 tiếng dẫn đến sai ngày tiệc. | 4 (40%) | 3 (Trung bình) | **12** | **3** | Phân hệ Lịch & CSDL | Đặt tiệc 18:00 tối nhưng giao diện Calendar hiển thị 11:00 trưa. | **QA (Hậu) + BE** |
| 4 | **RSK-04** | **Tính sai tổng tiền khi áp dụng chiết khấu kép (% và voucher)**<br>Sai thứ tự ưu tiên trừ tiền dẫn đến sai lệch doanh thu hợp đồng. | 3 (30%) | 4 (Lớn) | **12** | **4** | Phân hệ Hợp đồng & Kế toán | Tổng tiền trên hợp đồng không khớp với kết quả tính toán tay của BA. | **BA (Hiển) + BE** |
| 5 | **RSK-05** | **Khách hàng/Thầy cô yêu cầu đổi nghiệp vụ sau Demo giữa kỳ**<br>Phát sinh yêu cầu mới làm phình to phạm vi dự án (Scope Creep). | 4 (40%) | 3 (Trung bình) | **12** | **5** | Toàn dự án | Nhận xét sau buổi Demo Tuần 4 yêu cầu thêm tính năng voucher/khách VIP. | **BA (Hiển) + PM** |
| 6 | **RSK-06** | **Xung đột mã nguồn (Merge Conflict) khi gộp code vào develop**<br>Frontend và Backend sửa chung các tệp cấu hình gây lỗi build. | 4 (40%) | 2 (Nhẹ) | **8** | **6** | Mã nguồn dự án | Pull Request trên GitHub báo đỏ, xuất hiện thông báo "Can't automatically merge". | **PM (Hoàng)** |
| 7 | **RSK-07** | **Môi trường Cloud Staging bị sập hoặc rớt mạng khi Demo**<br>Dịch vụ hosting miễn phí bị ngủ đông (Sleep) hoặc hết băng thông. | 2 (15%) | 4 (Lớn) | **8** | **7** | Buổi báo cáo với Thầy | Truy cập link web báo lỗi 502/504 Bad Gateway, trang tải quay tròn. | **DevOps (Phúc)** |
| 8 | **RSK-08** | **Lỗ hổng phân quyền RBAC (Tư vấn viên gọi trộm API Admin)**<br>Thiếu Guard bảo vệ route dẫn đến người dùng sửa trái phép sảnh tiệc. | 2 (20%) | 4 (Lớn) | **8** | **8** | Bảo mật hệ thống | Đăng nhập tài khoản Sales nhưng vẫn gửi được request DELETE sảnh tiệc trên Postman. | **Backend (Phúc)** |
| 9 | **RSK-09** | **Dữ liệu mẫu (Mock data) bị thiếu, không đủ demo trơn tru**<br>Database trống hoặc dữ liệu không thực tế làm vỡ bố cục giao diện. | 3 (30%) | 2 (Nhẹ) | **6** | **9** | Kiểm thử & Demo | Bảng danh sách tiệc cưới bị trắng, các biểu đồ Dashboard không có số liệu. | **QA (Hậu)** |
| 10 | **RSK-10** | **Ứng dụng bị chậm (> 3s) khi tải danh sách nhiều sự kiện**<br>Truy vấn database không có Index làm giảm hiệu năng trải nghiệm. | 2 (20%) | 2 (Nhẹ) | **4** | **10** | Trải nghiệm UI/UX | Chuyển tháng trên Calendar mất hơn 3 giây mới hiển thị các thẻ tiệc. | **Frontend (Nhân)** |

---

## 4. Ma trận nhiệt phân bổ rủi ro (Risk Heatmap)

Biểu diễn vị trí của 10 rủi ro trên lưới tọa độ $5 \times 5$:

```
Tác động (I)
  5 |          |          | RSK-02   |          |          |
  4 |          | RSK-07,08| RSK-04   | RSK-01   |          |
  3 |          |          |          | RSK-03,05|          |
  2 |          | RSK-10   | RSK-09   | RSK-06   |          |
  1 |          |          |          |          |          |
----+----------+----------+----------+----------+----------+
         1          2          3          4          5
                              Xác suất (P)
```

- **Vùng đỏ (Ưu tiên cao nhất — Điểm 12 - 25):** `RSK-01` (Chậm task), `RSK-02` (Trùng lịch sảnh), `RSK-03` (Lệch múi giờ), `RSK-04` (Sai tiền), `RSK-05` (Phình phạm vi).
- **Vùng vàng (Ưu tiên trung bình — Điểm 5 - 11):** `RSK-06` (Xung đột Git), `RSK-07` (Sập server cloud), `RSK-08` (Hổng RBAC), `RSK-09` (Thiếu dữ liệu seed).
- **Vùng xanh (Ưu tiên thấp — Điểm 1 - 4):** `RSK-10` (Tải chậm > 3s).

---

## 5. Quy trình theo dõi và cập nhật rủi ro (Monitoring & Control)

1. **Tần suất rà soát:** PM chủ trì rà soát lại Bảng đăng ký rủi ro vào mỗi tối Chủ Nhật trong phiên họp tuần.
2. **Cập nhật trạng thái:**
   - **Active (Đang hiện hữu):** Rủi ro có khả năng xảy ra trong tuần tới.
   - **Triggered (Đã phát sinh):** Rủi ro đã xảy ra trong thực tế (VD: `RSK-01` xảy ra ở Tuần 2 dẫn đến một số task trễ hạn) $\rightarrow$ Kích hoạt kế hoạch ứng phó ngay lập tức.
   - **Closed (Đã giải quyết):** Rủi ro đã được kiểm soát triệt để sau khi fix bug hoặc nghiệm thu chức năng.
3. **Chuyển tiếp nghiệp vụ:** Bảng đăng ký rủi ro này là tiền đề trực tiếp để PM xây dựng **Kế hoạch ứng phó rủi ro 4T (Task PM-15)**.
