# Kế Hoạch Quản Lý Mua Sắm Dự Án (Procurement Management Plan)
## Phân tích Tự làm hay Mua/Thuê ngoài (Make-or-Buy Analysis)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-22 (Issue #28 — Chương 9 Quản lý mua sắm dự án theo PMBOK) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày lập** | 03/10/2026 (Tuần 5) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Mục tiêu Kế hoạch Mua sắm (Procurement Objectives)

Theo hướng dẫn của PMBOK (Chương 9 — Project Procurement Management), Kế hoạch quản lý mua sắm của dự án **EVManager** được lập nhằm:
1. Xác định rõ những thành phần công nghệ, hạ tầng và dịch vụ nào nhóm **tự phát triển (Make)** và thành phần nào nên **mua/thuê ngoài hoặc sử dụng dịch vụ đám mây có sẵn (Buy / PaaS / SaaS)**.
2. Tối ưu hóa ngân sách dự án trong phạm vi ràng buộc thời gian **8 tuần (07/09/2026 – 01/11/2026)** và quy mô nhân sự **5 thành viên**.
3. Đảm bảo độ sẵn sàng hệ thống ($\ge 99.5\%$), an toàn bảo mật dữ liệu và khả năng truy cập trực tuyến ổn định phục vụ kiểm thử UAT và buổi Bảo vệ đồ án cuối kỳ.

---

## 2. Phân tích Tự làm hay Mua/Thuê ngoài (Make-or-Buy Analysis)

Nhóm dự án đã rà soát toàn bộ kiến trúc hệ thống EVManager và thực hiện phân tích **Make-or-Buy** cho 6 hạng mục cốt lõi:

| STT | Hạng mục | Phương án 1: Tự xây dựng / Tự vận hành (Make / Self-host) | Phương án 2: Mua / Thuê dịch vụ Cloud PaaS/SaaS (Buy / Lease) | Quyết định chốt | Lý do lựa chọn (Rationale) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | **Phần mềm Nghiệp vụ Lõi (Core ERP/CRM Tiệc cưới: Sảnh, Trùng lịch, Thực đơn, Hợp đồng, Đặt cọc)** | Tự thiết kế CSDL 3NF và lập trình toàn bộ bằng **Java 21 + Spring Boot 3** và **HTML5/JS/TailwindCSS**. | Mua phần mềm quản lý nhà hàng thương mại đóng gói sẵn (Odoo, Sapo, KiotViet...). | **TỰ LÀM (MAKE)** | Đây là sản phẩm cốt lõi của đồ án; các phần mềm bán sẵn không có thuật toán kiểm tra trùng ca sảnh cưới và quy trình hợp đồng 2 đợt thanh toán đặc thù. |
| **2** | **Máy chủ Triển khai Ứng dụng (Application Server & Web Hosting)** | Tự mua máy chủ vật lý (On-premise) hoặc tự cấu hình VPS trắng từ đầu (cài OS, Nginx, SSL, Firewall). | Sử dụng nền tảng Cloud PaaS (**Render / Railway** cho Backend Docker và **Vercel** cho Frontend tĩnh). | **THUÊ NGOÀI (BUY / PaaS)** | Tự dựng máy chủ vật lý tốn kém chi phí phần cứng và mất 1–2 tuần cấu hình mạng/bảo mật. Dùng PaaS giúp tích hợp CI/CD tự động từ GitHub trong 15 phút với chi phí gói Sinh viên/Starter bằng 0đ. |
| **3** | **Hệ quản trị Cơ sở dữ liệu (Managed PostgreSQL Database)** | Tự cài PostgreSQL trên máy cá nhân mở port NAT ra Internet. | Thuê dịch vụ Managed PostgreSQL trên đám mây (**Supabase / Neon.tech**) kết hợp Docker local khi dev. | **THUÊ NGOÀI (BUY / DBaaS)** | Đảm bảo dữ liệu chung cho cả 5 thành viên truy cập 24/7, có sẵn cơ chế Daily Backup, SSL connection và không phụ thuộc vào máy tính cá nhân của một thành viên. |
| **4** | **Dịch vụ Gửi Email Thông báo Tự động (Transactional Email API/SMTP)** | Tự cài đặt và vận hành Mail Server riêng (Postfix / Dovecot) trên VPS. | Sử dụng dịch vụ SMTP/API chuyên nghiệp (**Google Workspace SMTP / Resend / Brevo**). | **THUÊ NGOÀI (BUY / SaaS)** | Tự dựng Mail Server rất dễ bị các nhà mạng chặn IP vào mục Spam/Blacklist. Dùng SMTP/API của nhà cung cấp uy tín đảm bảo tỷ lệ gửi thư báo giá/hợp đồng vào Inbox đạt $>99\%$. |
| **5** | **Tên miền & Chứng chỉ Bảo mật (Domain & SSL/TLS Certificate)** | Truy cập qua địa chỉ IP tĩnh dạng số và tự ký chứng chỉ (Self-signed SSL gây cảnh báo đỏ trên trình duyệt). | Sử dụng tên miền phụ chuẩn kèm chứng chỉ **Let's Encrypt SSL (HTTPS)** tự động gia hạn trên Vercel/Render. | **THUÊ NGOÀI (BUY / Managed)** | Cung cấp đường dẫn HTTPS chuyên nghiệp, bảo mật token JWT khi truyền tải giữa Client và Server mà không tốn chi phí mua chứng chỉ SSL thương mại. |
| **6** | **Hệ thống Quản lý Mã nguồn & CI/CD Pipeline** | Tự cài GitLab CE và Jenkins trên máy chủ nội bộ. | Sử dụng **GitHub Repository + GitHub Actions + GitHub Projects**. | **THUÊ NGOÀI (BUY / SaaS)** | Tận dụng gói GitHub Education/Free với hạ tầng runner ổn định, tích hợp sẵn quản lý Issue, Milestone, Pull Request Review và kiểm tra build tự động. |

---

## 3. So sánh Chi phí Kinh tế: Tự vận hành On-Premise vs. Thuê Cloud PaaS (Trong 2 tháng dự án)

| Hạng mục chi phí | Phương án Tự vận hành (On-Premise / Self-hosted) | Phương án Cloud PaaS / Education Tier (Nhóm lựa chọn) | Chênh lệch tiết kiệm |
| :--- | ---: | ---: | ---: |
| Khấu hao / Thuê máy chủ vật lý & IP tĩnh (2 tháng) | 6,000,000 VNĐ | 0 VNĐ *(Render/Vercel Free & Education Tier)* | +6,000,000 VNĐ |
| Công sức quản trị hệ thống (SysAdmin cài đặt, vá lỗi OS, trực 24/7: ~10 man-days) | 5,000,000 VNĐ | 500,000 VNĐ *(1 man-day cấu hình Docker & biến môi trường)* | +4,500,000 VNĐ |
| Dịch vụ Managed PostgreSQL & Sao lưu tự động | 2,000,000 VNĐ | 0 VNĐ *(Neon/Supabase Free Tier 500MB)* | +2,000,000 VNĐ |
| Dịch vụ Email SMTP (3,000 emails/tháng) | 1,500,000 VNĐ | 0 VNĐ *(Gmail App Password / Resend Free Tier)* | +1,500,000 VNĐ |
| Chứng chỉ bảo mật SSL/HTTPS | 500,000 VNĐ | 0 VNĐ *(Let's Encrypt tích hợp sẵn)* | +500,000 VNĐ |
| **TỔNG CHI PHÍ HẠ TẦNG 2 THÁNG** | **15,000,000 VNĐ** | **500,000 VNĐ** *(Quy đổi giờ công cấu hình)* | **Tiết kiệm 14,500,000 VNĐ (96.7%)** |

> **Dự phòng ngân sách hạ tầng:** Trong bảng dự toán tổng thể, PM vẫn giữ khoản ngân sách dự phòng hạ tầng tối đa **1,500,000 VNĐ** để sẵn sàng nâng cấp tức thì lên gói **Render Starter (\$7/tháng)** và **Supabase Pro** trong tuần lễ cao điểm UAT và Bảo vệ đồ án (Tuần 7 – Tuần 8) nhằm loại bỏ hoàn toàn hiện tượng Cold-start (ngủ đông).

---

## 4. Quy trình Quản lý Mua sắm & Tích hợp Dịch vụ Ngoài

1. **Bước 1 — Lập tiêu chí kỹ thuật:** PM (Hoàng) phối hợp cùng Backend/DevOps (Phúc) xác định yêu cầu cấu hình tối thiểu (hỗ trợ Java 21 Docker, PostgreSQL 15+, kết nối JDBC SSL, biến môi trường bảo mật).
2. **Bước 2 — Đánh giá & Lựa chọn nhà cung cấp (Task PM-23):** So sánh ít nhất 3 nhà cung cấp cho mỗi dịch vụ theo bảng chấm điểm trọng số (xem chi tiết tại [`docs/planning/vendor-evaluation.md`](vendor-evaluation.md)).
3. **Bước 3 — Khởi tạo & Bảo mật thông tin xác thực:**
   - Tuyệt đối tuân thủ quy tắc bảo mật trong [`AGENTS.md`](../../AGENTS.md): **Không bao giờ commit mật khẩu DB, API Key hoặc SMTP Secret vào Git**.
   - Toàn bộ chuỗi kết nối được cấu hình qua biến môi trường (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `MAIL_PASSWORD`).
4. **Bước 4 — Kiểm thử & Nghiệm thu dịch vụ:** Chạy kiểm thử hiệu năng (`QA-22 #153`) và kiểm thử chấp nhận người dùng (`QA-23 #154`) trên môi trường Staging trước khi bàn giao.

---

## 5. Phê duyệt Kế hoạch Mua sắm

| Vai trò | Họ và tên | Ngày phê duyệt | Xác nhận |
| :--- | :--- | :---: | :---: |
| **Project Manager (PM)** | Phạm Lê Huy Hoàng | 03/10/2026 | *Đã phê duyệt* |
| **Backend & DevOps Lead** | Ngô Hữu Phúc | 03/10/2026 | *Đã tiếp nhận triển khai* |
