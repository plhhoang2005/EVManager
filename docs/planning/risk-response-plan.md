# Kế Hoạch Ứng Phó Rủi Ro Dự Án Theo Chiến Lược 4T (Risk Response Plan)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-15 (Issue #21 — Chương 8 Quản lý rủi ro dự án theo PMBOK) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày lập** | 22/09/2026 (Tuần 3) |
| **Tài liệu liên kết** | [`docs/planning/risk-register.md`](risk-register.md) |

---

## 1. Khung Chiến lược Ứng phó Rủi ro 4T (4T Risk Response Framework)

Tiếp nối **Bảng đăng ký 10 rủi ro ([`docs/planning/risk-register.md`](risk-register.md))**, Ban Quản lý dự án áp dụng mô hình **4T (PMBOK)** để thiết lập kịch bản chủ động phòng ngừa và xử lý khi rủi ro phát sinh:
1. **Terminate / Avoid (Tránh né):** Thay đổi thiết kế kỹ thuật hoặc quy trình để loại bỏ hoàn toàn nguyên nhân gây ra rủi ro (xác suất $P \rightarrow 0\%$).
2. **Treat / Mitigate (Giảm nhẹ):** Thực hiện các biện pháp kiểm soát sớm nhằm giảm xác suất xảy ra ($P$) hoặc giảm mức độ thiệt hại ($I$).
3. **Transfer (Chuyển giao):** Chuyển giao phần rủi ro vận hành hạ tầng sang các nền tảng đám mây chuyên nghiệp có cam kết SLA cao.
4. **Tolerate / Accept (Chấp nhận có dự phòng):** Chấp nhận các rủi ro mức độ thấp hoặc không thể loại bỏ hoàn toàn, nhưng chuẩn bị sẵn **Quỹ dự phòng (Contingency Reserve)** và kịch bản khẩn cấp (Fallback Plan).

---

## 2. Bảng Kế hoạch Ứng phó Chi tiết cho 10 Rủi ro Dự án

| Mã RR | Tên rủi ro | Điểm ($P \times I$) | Chiến lược 4T | Biện pháp Phòng ngừa Chủ động (Proactive Action) | Kế hoạch Dự phòng Khẩn cấp khi Rủi ro Xảy ra (Contingency / Fallback Plan) | Chủ sở hữu (Owner) |
| :---: | :--- | :---: | :---: | :--- | :--- | :---: |
| **RSK-01** | Thành viên chậm tiến độ do bận thi cử/việc cá nhân | **16 (Đỏ)** | **Mitigate (Giảm nhẹ)** | Chia nhỏ task $\le 2$ ngày trên GitHub; họp rà soát hàng tuần; cặp đôi hỗ trợ chéo (BA hỗ trợ QA, PM hỗ trợ tích hợp). | Kích hoạt **Fast-tracking** (`fast-tracking-plan.md`) và trích quỹ Overtime để thành viên khác tiếp quản nhánh code trong vòng 24h. | **Hoàng (PM)** |
| **RSK-02** | Thuật toán bị lọt ca tiệc dẫn đến đặt trùng sảnh | **15 (Đỏ)** | **Avoid (Tránh né)** | Thiết kế thuật toán kiểm tra trùng ca ở tầng Service + áp dụng khóa bi quan `@Lock(PESSIMISTIC_WRITE)` tại Database. | Nếu phát hiện lọt ca trong kiểm thử đồng thời, khóa ngay API tạo sự kiện để vá lỗi Transaction trước khi mở lại. | **Phúc (BE)** |
| **RSK-03** | Lệch múi giờ UTC+7 làm sai ngày/giờ trên Calendar | **12 (Đỏ)** | **Avoid (Tránh né)** | Thống nhất định dạng ngày `YYYY-MM-DD` và cấu hình múi giờ `Asia/Ho_Chi_Minh` trong Spring Boot & PostgreSQL. | Chạy bộ test biên múi giờ (`QA-15 #146`); chuẩn hóa hàm parse ngày giờ tại `api.js` và `calendar.js`. | **Hậu (QA) + BE** |
| **RSK-04** | Tính sai tổng tiền khi áp dụng chiết khấu kép (% và Voucher) | **12 (Đỏ)** | **Avoid (Tránh né)** | Chốt cứng công thức trong SRS & ADR-004: Trừ chiết khấu % trước $\rightarrow$ Trừ Voucher sau $\rightarrow$ Cộng phí 5% & VAT 8%; dùng `BigDecimal`. | Đối soát tự động kết quả giữa Frontend (`calculator.js`) và Backend (`ContractServiceTest`) qua 15 bộ số liệu test. | **Hiển (BA) + BE** |
| **RSK-05** | Phát sinh yêu cầu mới sau Demo giữa kỳ (Scope Creep) | **12 (Đỏ)** | **Mitigate (Giảm nhẹ)** | Đóng băng phạm vi Must-have từ Tuần 2; mọi yêu cầu mới bắt buộc phải qua quy trình phiếu **Change Request (`CR-01`, `CR-02`)**. | Chỉ phê duyệt thay đổi thuộc phạm vi lõi (CR-01); đẩy các yêu cầu phụ (in logo riêng, biểu đồ năm) sang Backlog sau MVP. | **Hoàng (PM) + BA** |
| **RSK-06** | Xung đột mã nguồn (Merge Conflict) khi gộp vào `develop` | **8 (Vàng)** | **Mitigate (Giảm nhẹ)** | Áp dụng Branch Protection trên `develop`; phân tách rõ thư mục `backend/`, `frontend/`, `docs/` theo vai trò. | PM trực tiếp review diff, giải quyết conflict trên nhánh tích hợp và giữ nguyên nhánh gốc làm minh chứng. | **Hoàng (PM)** |
| **RSK-07** | Môi trường Cloud Staging bị sập hoặc rớt mạng khi Demo | **8 (Vàng)** | **Transfer & Mitigate** | Thuê hạ tầng PaaS uy tín (**Vercel + Render + Supabase** có SLA 99.9%) thay vì tự dựng máy chủ vật lý. | Chuẩn bị sẵn môi trường **Docker Compose Local + Script Seed Data Offline** trên laptop của PM và BE để chuyển đổi trong 60 giây nếu mất mạng phòng thi. | **Phúc (DevOps)** |
| **RSK-08** | Lỗ hổng phân quyền RBAC (Sales gọi trộm API Admin) | **8 (Vàng)** | **Avoid (Tránh né)** | Kiểm tra quyền kép ở cả Backend (`@PreAuthorize` 4 vai trò chuẩn BA) và Frontend (`authGuard.js`). | Chạy bộ kiểm thử bảo mật âm tính (`test-run-auth.md`, `UAT-02`); thu hồi token ngay nếu phát hiện truy cập trái phép. | **Phúc (BE)** |
| **RSK-09** | Dữ liệu mẫu (Mock/Seed data) thiếu hoặc không thực tế | **6 (Vàng)** | **Mitigate (Giảm nhẹ)** | Quản lý toàn bộ dữ liệu mẫu qua Flyway Migrations (`V6`, `V8`, `V10`, `V14`, `V15`) để tự động nạp khi khởi động. | Chạy script khôi phục dữ liệu mẫu chuẩn trước mỗi buổi Demo và phiên UAT. | **Hậu (DB/QA)** |
| **RSK-10** | Ứng dụng phản hồi chậm ($> 3\text{s}$) khi danh sách sự kiện lớn | **4 (Xanh)** | **Accept & Mitigate** | Áp dụng phân trang `Page<T>` của Spring Data JPA, đánh Index các cột tra cứu (`venue_id`, `event_date`, `keyword`) và Debounce 300ms. | Đo tải bằng kịch bản k6 (`QA-22 #153`); tối ưu câu lệnh JPQL nếu p95 vượt quá $500\text{ms}$. | **Nhân (FE) + BE** |

---

## 3. Quản lý Quỹ Dự phòng Rủi ro (Contingency Reserve Allocation)

- **Quỹ dự phòng tiến độ (Schedule Buffer):** Dự trữ **3 ngày làm việc** ở cuối Tuần 6 và Tuần 7 trước cột mốc bảo vệ đồ án.
- **Quỹ dự phòng ngân sách (Cost Contingency Reserve):** Trích lập **10% tổng ngân sách cơ sở ($13,000,000\text{ VNĐ}$ trên nền $BAC = 130,000,000\text{ VNĐ}$)** để chi trả cho chi phí làm thêm giờ (Overtime Tuần 3) và xử lý yêu cầu thay đổi `CR-01` sau buổi Demo giữa kỳ.
