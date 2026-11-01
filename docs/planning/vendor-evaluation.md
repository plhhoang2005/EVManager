# Báo Cáo Đánh Giá & Lựa Chọn Nhà Cung Cấp Hạ Tầng (Vendor Evaluation & Selection)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-23 (Issue #29 — Chương 9 Quản lý mua sắm dự án theo PMBOK) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) phối hợp cùng Ngô Hữu Phúc (DevOps) |
| **Ngày lập** | 03/10/2026 (Tuần 5) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Mục tiêu và Phương pháp Đánh giá Nhà cung cấp

Tiếp nối **Kế hoạch quản lý mua sắm ([`docs/planning/procurement-plan.md`](procurement-plan.md))**, tài liệu này thiết lập bộ tiêu chí chấm điểm có trọng số (Weighted Scoring Model) để lựa chọn các nhà cung cấp dịch vụ đám mây tối ưu nhất cho 4 hạng mục hạ tầng của dự án **EVManager**:
1. **Web Frontend Hosting** (Triển khai giao diện Web Client).
2. **Backend Application Cloud** (Triển khai khối REST API Java 21 Spring Boot).
3. **Managed PostgreSQL Database** (Lưu trữ 13+ bảng dữ liệu chuẩn 3NF và chạy Flyway Migration).
4. **Transactional Email Service** (Gửi email thông báo báo giá, hợp đồng và xác nhận đặt cọc).

---

## 2. Bộ Tiêu chí Đánh giá Nhà cung cấp (Evaluation Criteria & Weights)

| Mã TC | Tiêu chí đánh giá | Trọng số (%) | Yêu cầu tối thiểu đối với dự án EVManager |
| :---: | :--- | :---: | :--- |
| **TC-01** | **Khả năng tương thích kỹ thuật (Technical Fit)** | **30%** | Hỗ trợ trực tiếp Java 21 (Docker/Maven), PostgreSQL 15+, Flyway, HTML/JS tĩnh và cấu hình CORS/HTTPS chuẩn. |
| **TC-02** | **Chi phí & Chính sách hỗ trợ Sinh viên (Cost & Free/Edu Tier)** | **25%** | Có gói miễn phí hoặc gói tài trợ GitHub Student Developer Pack đủ đáp ứng tải demo 50 người dùng đồng thời. |
| **TC-03** | **Độ ổn định & Hiệu năng (SLA Uptime & Latency < 3s)** | **20%** | Cam kết độ sẵn sàng $\ge 99.9\%$, có máy chủ tại khu vực châu Á (Singapore) để độ trễ mạng từ Việt Nam thấp ($< 100\text{ms}$). |
| **TC-04** | **Tích hợp CI/CD tự động với GitHub (Deployment Ease)** | **15%** | Tự động build và deploy khi có commit mới được merge vào nhánh `develop` hoặc `main`. |
| **TC-05** | **Bảo mật & Sao lưu (Security & Backup)** | **10%** | Hỗ trợ mã hóa TLS/SSL, quản lý Secret biến môi trường an toàn và sao lưu dữ liệu tự động. |
| | **TỔNG CỘNG** | **100%** | Thang điểm đánh giá từng tiêu chí: **1 (Kém) $\rightarrow$ 10 (Xuất sắc)**. |

---

## 3. Bảng Chấm điểm So sánh và Lựa chọn Nhà cung cấp

### 3.1. Hạng mục 1: Dịch vụ Lưu trữ Giao diện Frontend (Web Hosting & CDN)
| Tiêu chí (Trọng số) | **Vercel** | **Netlify** | **AWS S3 + CloudFront** |
| :--- | :---: | :---: | :---: |
| TC-01: Tương thích kỹ thuật (30%) | 9.5 | 9.0 | 8.5 |
| TC-02: Chi phí / Free Tier (25%) | 10.0 *(0đ, không cần thẻ tín dụng)* | 9.5 | 7.0 *(Tính phí theo băng thông sau 12 tháng)* |
| TC-03: Hiệu năng CDN châu Á (20%) | 9.5 *(Edge Network Singapore)* | 8.5 | 9.5 |
| TC-04: Tích hợp GitHub CI/CD (15%) | 10.0 *(Preview URL cho mỗi PR)* | 9.5 | 6.5 *(Cần tự viết GitHub Action S3 sync)* |
| TC-05: Bảo mật HTTPS/SSL (10%) | 9.5 | 9.5 | 9.0 |
| **ĐIỂM TỔNG HỢP CÓ TRỌNG SỐ** | **9.70 / 10 (LỰA CHỌN)** | **9.15 / 10** | **8.08 / 10** |

### 3.2. Hạng mục 2: Dịch vụ Triển khai Backend Spring Boot (Java 21 Container Cloud)
| Tiêu chí (Trọng số) | **Render.com** | **Railway.app** | **AWS EC2 (t3.micro)** |
| :--- | :---: | :---: | :---: |
| TC-01: Tương thích Docker Java 21 (30%) | 9.5 | 9.5 | 9.0 |
| TC-02: Chi phí / Gói sinh viên (25%) | 9.5 *(Có Free Tier + Starter \$7)* | 8.0 *(Giới hạn \$5 trial credit)* | 6.5 *(Dễ phát sinh phí EBS/Elastic IP)* |
| TC-03: Độ ổn định & Region Singapore (20%) | 9.0 *(Có Region Singapore)* | 9.0 | 9.5 |
| TC-04: Tích hợp GitHub Auto-Deploy (15%) | 9.5 | 9.5 | 6.0 *(Cần tự cấu hình SSH/Docker runner)* |
| TC-05: Quản lý Env Secret & Healthcheck (10%) | 9.5 | 9.0 | 8.5 |
| **ĐIỂM TỔNG HỢP CÓ TRỌNG SỐ** | **9.40 / 10 (LỰA CHỌN)** | **8.98 / 10** | **7.98 / 10** |

### 3.3. Hạng mục 3: Cơ sở dữ liệu Đám mây (Managed PostgreSQL 15+)
| Tiêu chí (Trọng số) | **Supabase / Neon PostgreSQL** | **Render PostgreSQL** | **AWS RDS PostgreSQL** |
| :--- | :---: | :---: | :---: |
| TC-01: Tương thích Flyway & JDBC (30%) | 9.5 | 9.0 | 9.5 |
| TC-02: Chi phí / Thời hạn miễn phí (25%) | 10.0 *(Miễn phí vĩnh viễn 500MB)* | 7.0 *(Gói Free tự xóa sau 30–90 ngày)* | 6.0 *(Phí cao nếu quên tắt instance)* |
| TC-03: Hiệu năng & Connection Pooling (20%) | 9.5 *(Hỗ trợ PgBouncer, Region SG)* | 8.5 | 9.5 |
| TC-04: Giao diện quản trị SQL Editor (15%) | 9.5 *(Web Table Editor trực quan)* | 7.5 *(Chỉ có chuỗi kết nối)* | 7.0 |
| TC-05: Sao lưu & Bảo mật SSL (10%) | 9.5 | 9.0 | 9.5 |
| **ĐIỂM TỔNG HỢP CÓ TRỌNG SỐ** | **9.63 / 10 (LỰA CHỌN)** | **8.18 / 10** | **8.25 / 10** |

### 3.4. Hạng mục 4: Dịch vụ Gửi Email Tự động (SMTP / Transactional Email)
| Tiêu chí (Trọng số) | **Gmail SMTP (App Password) + Resend** | **SendGrid** | **Amazon SES** |
| :--- | :---: | :---: | :---: |
| TC-01: Tích hợp `spring-boot-starter-mail` (30%) | 10.0 | 9.0 | 8.5 |
| TC-02: Chi phí (25%) | 10.0 *(Miễn phí 500 mail/ngày)* | 8.5 | 9.0 |
| TC-03: Tỷ lệ vào Inbox (Deliverability) (20%) | 9.5 | 9.0 | 9.5 |
| TC-04: Tốc độ kích hoạt tài khoản (15%) | 10.0 *(Kích hoạt ngay lập tức)* | 6.5 *(Dễ bị khóa duyệt tài khoản mới)* | 5.5 *(Mất 24–48h xin thoát Sandbox)* |
| TC-05: Bảo mật xác thực 2 lớp (10%) | 9.5 | 9.0 | 9.5 |
| **ĐIỂM TỔNG HỢP CÓ TRỌNG SỐ** | **9.85 / 10 (LỰA CHỌN)** | **8.50 / 10** | **8.48 / 10** |

---

## 4. Tổng hợp Danh mục Nhà cung cấp Chính thức & Phương án Dự phòng (Fallback Plan)

| Thành phần | Nhà cung cấp chính (Primary Vendor) | Nhà cung cấp dự phòng (Fallback) | Biến môi trường cấu hình bàn giao cho DevOps | Chi phí thực chi |
| :--- | :--- | :--- | :--- | :---: |
| **Frontend Web** | **Vercel** (Global CDN) | GitHub Pages / Local Nginx | `API_BASE_URL` | **0 VNĐ** |
| **Backend API** | **Render.com** (Singapore Region) | Docker Compose Localhost (`:8080`) | `PORT`, `SPRING_PROFILES_ACTIVE`, `JWT_SECRET` | **0 VNĐ** |
| **Database** | **Supabase PostgreSQL 15** | PostgreSQL Docker Container (`:5432`) | `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` | **0 VNĐ** |
| **Email Service** | **Google SMTP / Resend API** | Mailtrap Sandbox (Môi trường Test) | `SPRING_MAIL_HOST`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` | **0 VNĐ** |

> **Cam kết Quản lý Rủi ro Hạ tầng (`RSK-07`):** Ngoài môi trường Cloud Staging trên Vercel + Render + Supabase, PM yêu cầu Backend Lead (Phúc) và QA Lead (Hậu) duy trì bộ `docker-compose.yml` và script khởi động nhanh `database/start-postgres.bat` hoạt động độc lập 100% ở chế độ Offline để đảm bảo buổi bảo vệ đồ án trước Hội đồng không bị gián đoạn ngay cả khi mất kết nối Internet tại phòng thi.

---

## 5. Ký xác nhận Bàn giao Cấu hình Hạ tầng

| Vai trò | Họ và tên | Trách nhiệm | Ngày ký |
| :--- | :--- | :--- | :---: |
| **Project Manager (PM)** | Phạm Lê Huy Hoàng | Phê duyệt nhà cung cấp & kiểm soát chi phí | 03/10/2026 |
| **Backend & DevOps Lead** | Ngô Hữu Phúc | Tiếp nhận thông số môi trường & cấu hình triển khai | 03/10/2026 |
