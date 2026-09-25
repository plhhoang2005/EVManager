# BA-08: Product Backlog Sơ Bộ & Phân Loại Ưu Tiên Theo Mô Hình MoSCoW

Dự án: **EVManager – Hệ thống quản lý dịch vụ sự kiện**

Bảng tính Excel chính thức được lưu trữ tại: [`docs/requirements/product-backlog.xlsx`](product-backlog.xlsx)

---

## 1. Bảng Product Backlog Tổng Quát (29 User Stories)

| ID | Phân hệ | User Story | MoSCoW | Story Points |
| :---: | :--- | :--- | :---: | :---: |
| **US01** | 🔐 Tài khoản & phân quyền | Là người dùng, tôi muốn đăng nhập/đăng xuất để truy cập hệ thống theo quyền của mình. | **Must** | 3 |
| **US02** | 🔐 Tài khoản & phân quyền | Là Admin, tôi muốn quản lý tài khoản người dùng để kiểm soát người sử dụng hệ thống. | **Must** | 5 |
| **US03** | 🔐 Tài khoản & phân quyền | Là Admin, tôi muốn phân quyền người dùng theo vai trò để đảm bảo đúng quyền truy cập. | **Must** | 5 |
| **US04** | 🏛️ Quản lý sảnh & đặt tiệc | Là Sales, tôi muốn quản lý thông tin sảnh để tư vấn sảnh phù hợp cho khách hàng. | **Must** | 5 |
| **US05** | 🏛️ Quản lý sảnh & đặt tiệc | Là Sales, tôi muốn tra cứu sảnh trống theo ngày/giờ để tư vấn khách hàng. | **Must** | 5 |
| **US06** | 🏛️ Quản lý sảnh & đặt tiệc | Là hệ thống, tôi muốn kiểm tra trùng lịch để ngăn việc đặt cùng một sảnh vào cùng thời gian. | **Must** | 8 |
| **US07** | 🏛️ Quản lý sảnh & đặt tiệc | Là Sales, tôi muốn giữ chỗ sảnh để tránh sảnh bị đặt bởi khách hàng khác trong thời gian tư vấn. | **Must** | 5 |
| **US08** | 🏛️ Quản lý sảnh & đặt tiệc | Là khách hàng, tôi muốn chọn số lượng bàn và Set Menu để phù hợp với nhu cầu tổ chức tiệc. | **Must** | 5 |
| **US09** | 🍽️ Menu & dịch vụ | Là khách hàng, tôi muốn chọn nhiều Set Menu và số lượng từng Set để tùy chỉnh tiệc. | **Must** | 5 |
| **US10** | 🍽️ Menu & dịch vụ | Là khách hàng, tôi muốn tùy chỉnh món ăn trong Set Menu theo nhu cầu. | **Should** | 5 |
| **US11** | 🍽️ Menu & dịch vụ | Là khách hàng, tôi muốn chọn nhiều gói dịch vụ như âm thanh, ánh sáng, MC để hoàn thiện tiệc. | **Must** | 5 |
| **US12** | 🍽️ Menu & dịch vụ | Là hệ thống, tôi muốn tự động tính tổng tiền Menu + dịch vụ để tạo báo giá chính xác. | **Must** | 8 |
| **US13** | 🍽️ Menu & dịch vụ | Là hệ thống, tôi muốn tính số bàn sơ cua theo số bàn đặt để áp dụng chính sách của nhà hàng. | **Must** | 3 |
| **US14** | 📄 Hợp đồng & thanh toán | Là Sales, tôi muốn lập và gửi báo giá để khách hàng xem và xác nhận. | **Must** | 5 |
| **US15** | 📄 Hợp đồng & thanh toán | Là hệ thống, tôi muốn sinh hợp đồng từ mẫu có sẵn để giảm thời gian lập hợp đồng. | **Must** | 8 |
| **US16** | 📄 Hợp đồng & thanh toán | Là khách hàng, tôi muốn xác nhận hợp đồng để chính thức xác nhận dịch vụ. | **Must** | 3 |
| **US17** | 📄 Hợp đồng & thanh toán | Là khách hàng, tôi muốn thanh toán tiền cọc đợt 1 để xác nhận đặt tiệc. | **Must** | 5 |
| **US18** | 📄 Hợp đồng & thanh toán | Là Kế toán, tôi muốn ghi nhận và theo dõi thanh toán để quản lý công nợ. | **Must** | 5 |
| **US19** | 📄 Hợp đồng & thanh toán | Là Điều phối, tôi muốn phân công nhân viên phục vụ và kỹ thuật để chuẩn bị cho tiệc. | **Must** | 5 |
| **US20** | 📄 Hợp đồng & thanh toán | Là Điều phối, tôi muốn ghi nhận các dịch vụ phát sinh trong tiệc để quyết toán chính xác. | **Must** | 5 |
| **US21** | 📄 Hợp đồng & thanh toán | Là khách hàng, tôi muốn ký biên bản nghiệm thu sau tiệc để xác nhận kết quả dịch vụ. | **Must** | 3 |
| **US22** | 📄 Hợp đồng & thanh toán | Là Kế toán, tôi muốn lập quyết toán đợt 2 để thu phần tiền còn lại. | **Must** | 5 |
| **US23** | 📄 Hợp đồng & thanh toán | Là hệ thống, tôi muốn cập nhật trạng thái hợp đồng thành "Đã hoàn tất" sau khi quyết toán. | **Must** | 3 |
| **US24** | 📊 Dashboard & báo cáo | Là Quản lý, tôi muốn xem Dashboard tổng quan để theo dõi tình hình kinh doanh. | **Should** | 5 |
| **US25** | 📊 Dashboard & báo cáo | Là Quản lý, tôi muốn xem báo cáo doanh thu theo thời gian để phân tích hoạt động kinh doanh. | **Should** | 5 |
| **US26** | 📊 Dashboard & báo cáo | Là Quản lý, tôi muốn xuất báo cáo Excel/PDF để phục vụ lưu trữ và báo cáo. | **Should** | 5 |
| **US27** | 🔔 Thông báo | Là hệ thống, tôi muốn gửi email thông báo về báo giá, hợp đồng và thanh toán để khách hàng nhận thông tin kịp thời. | **Should** | 5 |
| **US28** | 🤖 AI | Là khách hàng, tôi muốn được gợi ý Set Menu phù hợp dựa trên số lượng khách và nhu cầu để lựa chọn nhanh hơn. | **Could** | 8 |
| **US29** | 🤖 AI | Là Quản lý, tôi muốn dự báo chi phí bằng AI để hỗ trợ lập kế hoạch ngân sách. | **Could** | 13 |

---

## 2. Phân Loại Theo Mô Hình MoSCoW

### 🔴 Must-have (Bắt buộc phải có – MVP)
Các tính năng phục vụ trực tiếp cho quy trình lõi từ đăng nhập, tư vấn sảnh, kiểm tra trùng lịch, chọn menu/dịch vụ, tính báo giá, sinh hợp đồng, thu cọc đợt 1, điều phối tiệc, nghiệm thu và quyết toán đợt 2:
- **Danh sách User Stories:** `US01 – US09`, `US11 – US23` (Tổng 23 User Stories).

### 🟡 Should-have (Nên có)
Các chức năng quan trọng giúp hoàn thiện trải nghiệm và hỗ trợ công tác quản lý kinh doanh nhưng không làm gián đoạn luồng tiệc cơ bản:
- **Danh sách User Stories:** `US10`, `US24 – US27` (Tổng 4 User Stories).

### 🟢 Could-have (Có thể có – Bonus/Nâng cao)
Các tính năng nâng cao liên quan đến AI hỗ trợ gợi ý và dự báo chi phí:
- **Danh sách User Stories:** `US28`, `US29` (Tổng 2 User Stories).

---

## 3. Tổng Hợp Story Points

| Nhóm MoSCoW | Số Lượng User Story | Tổng Story Points | Tỷ Lệ Story Points |
| :--- | :---: | :---: | :---: |
| 🔴 **Must-have** | 23 | **107 SP** | $72.3\%$ |
| 🟡 **Should-have** | 4 | **20 SP** | $13.5\%$ |
| 🟢 **Could-have** | 2 | **21 SP** | $14.2\%$ |
| **TỔNG CỘNG** | **29** | **148 SP** | **100%** |

*Ghi chú: Story Point là chỉ số ước lượng độ phức tạp tương đối của các User Story, hỗ trợ việc lập kế hoạch Sprint trong Agile/Scrum.*
