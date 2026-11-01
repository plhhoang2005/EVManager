# PHIẾU YÊU CẦU THAY ĐỔI (CHANGE REQUEST) — CR-01
## Chuẩn hóa Phân quyền 4 Vai trò (RBAC), Quy trình Hợp đồng Wizard 3 Bước & Công thức Tính giá Tiệc

| Thông tin | Chi tiết |
| :--- | :--- |
| **Mã yêu cầu** | **CR-01** |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc WBS** | PM-21 (Issue #27 — Quản lý thay đổi sau Demo giữa kỳ 50%) |
| **Ngày tiếp nhận** | 04/10/2026 (Ngay sau buổi Báo cáo Demo Giữa kỳ Tuần 4) |
| **Người đề xuất** | Giảng viên hướng dẫn & Hội đồng đánh giá giữa kỳ |
| **Người tiếp nhận & xử lý** | Phạm Lê Huy Hoàng (Project Manager) |
| **Mức độ ưu tiên** | **High / Must-have** (Ảnh hưởng trực tiếp luồng nghiệp vụ cốt lõi) |
| **Trạng thái** | **Đã phê duyệt & Triển khai hoàn tất (Approved & Implemented)** |

---

## 1. Bối cảnh & Nội dung Góp ý sau Buổi Demo Giữa Kỳ (04/10/2026)

Trong buổi báo cáo và chạy thử bản Demo giữa kỳ 50% (Milestone 4), Giảng viên hướng dẫn và đại diện nghiệp vụ đã ghi nhận hệ thống hoàn thành tốt cơ sở dữ liệu 3NF, luồng đăng nhập JWT, tra cứu sảnh và kiểm tra xung đột lịch. Tuy nhiên, Hội đồng yêu cầu điều chỉnh và làm rõ **3 hạng mục thay đổi (CR-01)** để hệ thống bám sát thực tế vận hành trung tâm tiệc cưới:

1. **Chuẩn hóa đồng bộ 4 Vai trò người dùng (RBAC Alignment):**
   - Bản chạy thử ban đầu ở Backend đang dùng các mã quyền kỹ thuật (`ADMIN`, `MANAGER`, `STAFF`, `USER`) chưa khớp hoàn toàn với 4 Actor trong tài liệu SRS v1.0 của BA (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`), đồng thời giao diện cần tách riêng cổng thao tác cho từng vai trò (`admin.html`, `sales.html`, `coordinator.html`, `customer.html`).
2. **Nâng cấp Luồng tạo Hợp đồng thành Wizard 3 bước có Snapshot Giá & Ràng buộc Cọc 30%:**
   - Thay vì nhập hợp đồng trên một biểu mẫu đơn giản dễ sai sót, hệ thống cần dẫn dắt nhân viên Tư vấn (Sales) qua 3 bước: *(1) Thông tin khách & sự kiện $\rightarrow$ (2) Chọn nhiều thực đơn (N-to-N) & gói dịch vụ đi kèm $\rightarrow$ (3) Tự động tổng hợp báo giá, kiểm tra cọc tối thiểu 30% và lưu cứng đơn giá (Price Snapshot) tại thời điểm ký*.
3. **Chuẩn hóa Thứ tự Tính Chiết khấu, Voucher (CR-02), Phí phục vụ & Thuế VAT:**
   - Thống nhất quy tắc tính tiền giữa Frontend (`calculator.js`, `contracts.js`) và Backend (`ContractService.java`): Áp dụng chiết khấu % trước, trừ mã giảm giá trực tiếp (Voucher Code theo CR-02) sau, rồi mới cộng phí phục vụ (5%) và thuế VAT (8%).

---

## 2. Phân tích Tác động (Impact Assessment)

Ban Quản lý dự án (PM) đã chủ trì họp khẩn cùng BA, Backend, Frontend và QA để đánh giá tác động của CR-01 trên 4 khía cạnh chuẩn PMBOK:

### 2.1. Tác động đến Phạm vi & Kỹ thuật (Scope & Technical Impact)
| Phân hệ | Thành phần bị ảnh hưởng | Nội dung thay đổi cụ thể | Người thực hiện |
| :--- | :--- | :--- | :---: |
| **Database** | Flyway Migrations `V10`, `V13`, `V14`, `V15` | • Bổ sung đủ 4 role chuẩn BA (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`).<br>• Thêm cột `deposit_amount` vào bảng `contracts` (`CHECK deposit_amount >= 0`).<br>• Nâng cấp bảng trung gian `contract_menus` hỗ trợ chọn nhiều Set Menu trong 1 hợp đồng. | Hậu (DBA/QA) |
| **Backend** | `SecurityConfig`, Controllers, `ContractService`, `DashboardController` | • Đồng bộ `@PreAuthorize` theo 4 role chuẩn BA.<br>• Xây dựng State Machine cho Hợp đồng (`DRAFT` $\rightarrow$ `CONFIRMED` $\rightarrow$ `COMPLETED` / `CANCELLED`).<br>• Bổ sung API `/api/v1/dashboard/summary` và phân trang chuẩn cho `/api/v1/events`. | Phúc (Backend) |
| **Frontend** | `admin.html`, `sales.html`, `coordinator.html`, `customer.html`, `contracts.js`, `authGuard.js` | • Thiết lập Auth Guard điều hướng tự động theo JWT Role.<br>• Xây dựng Modal Wizard 3 bước tạo hợp đồng.<br>• Chuyển giao diện `customer.html` sang bố cục Top-Navbar thân thiện với khách đặt tiệc.<br>• Sửa công thức tính tiền đồng nhất với Backend. | Nhân (Frontend) |
| **BA & QA** | `SRS_EVManager_v1.0.md`, `Requirement_Traceability_Matrix.md`, Bộ Test Suite | • Cập nhật đặc tả `UC-08`, `UC-09`, `UC-10` và phiếu `CR-02`.<br>• Bổ sung bộ Test Suite kiểm thử công thức tính giá (`test-suite-pricing-calc.md`) và E2E Contract-Menu. | Hiển (BA) & Hậu (QA) |

### 2.2. Tác động đến Tiến độ & Đường găng (Schedule & Critical Path Impact)
- **Thời gian thực hiện ước tính:** **16 giờ công (2 man-days)** chia đều cho 5 thành viên trong đầu Tuần 5.
- **Ảnh hưởng đường găng:** Nhờ tận dụng kỹ thuật **Fast-tracking** (Frontend và Backend làm việc song song dựa trên JSON Contract đã chốt), CR-01 **không làm lùi mốc Feature Complete (Tuần 6 — 18/10/2026)** và **không làm thay đổi ngày kết thúc dự án (01/11/2026)**.

### 2.3. Tác động đến Ngân sách (Cost & Budget Impact)
- **Chi phí nhân công phát sinh:** $2 \text{ ngày công} \times 500,000 \text{ VNĐ/ngày} = \mathbf{1,000,000 \text{ VNĐ}}$.
- **Nguồn chi trả:** Trích từ **Quỹ dự phòng rủi ro (Contingency Reserve — 10% ngân sách)** đã được thiết lập trong kế hoạch dự toán COCOMO và quản lý rủi ro (`RSK-05: Khách hàng/Thầy cô yêu cầu đổi nghiệp vụ sau Demo giữa kỳ`). Tổng ngân sách cơ sở (Baseline Budget) giữ nguyên không đổi.

---

## 3. Nhật ký Theo dõi Triển khai & Minh chứng Nghiệm thu (Traceability)

Toàn bộ các hạng mục của CR-01 đã được triển khai, kiểm thử và tích hợp vào nhánh `develop`:

| Hạng mục CR-01 | Issue liên quan | Pull Request minh chứng | Trạng thái kiểm thử QA |
| :--- | :---: | :---: | :---: |
| Đồng bộ 4 Role RBAC & Seed Data Demo | `#208` (BUG-08) | PR `#209`, PR `#211` | **PASS 100%** (UAT-01, UAT-02) |
| Bổ sung API Dashboard Summary & chống văng phiên | `#206` (BUG-06) | PR `#210`, PR `#212` | **PASS 100%** (UAT-14) |
| Chuẩn hóa công thức tính giá, chiết khấu, VAT & Cọc 30% | `#148`, `#204` (BUG-03) | PR `#203`, PR `#214` | **PASS 100%** (UAT-10, UAT-11) |
| Luồng Hợp đồng Wizard 3 bước, Snapshot giá & Customer Portal | `#215`, `#149` | PR `#216`, PR `#217`, PR `#218` | **PASS 100%** (UAT-09, UAT-12) |

---

## 4. Quyết định Phê duyệt của Ban Quản lý Dự án (Change Control Board Sign-off)

Sau khi xem xét toàn diện lợi ích nghiệp vụ và mức độ ảnh hưởng nằm trong giới hạn quỹ dự phòng, Ban Kiểm soát Thay đổi (CCB) của dự án EVManager thống nhất **PHÊ DUYỆT VÀ ĐÓNG YÊU CẦU THAY ĐỔI CR-01**.

| Vai trò | Họ và tên | Quyết định | Ngày ký | Chữ ký xác nhận |
| :--- | :--- | :---: | :---: | :---: |
| **Project Manager (PM)** | Phạm Lê Huy Hoàng | **☑ Phê duyệt (Approved)** | 04/10/2026 | *Hoàng (Đã ký)* |
| **Business Analyst Lead (BA)** | Từ Minh Hiển | **☑ Đồng ý (Agreed)** | 04/10/2026 | *Hiển (Đã ký)* |
| **Backend & DevOps Lead** | Ngô Hữu Phúc | **☑ Đồng ý (Agreed)** | 04/10/2026 | *Phúc (Đã ký)* |
| **UI/UX & Frontend Lead** | Võ Thành Nhân | **☑ Đồng ý (Agreed)** | 04/10/2026 | *Nhân (Đã ký)* |
| **Database & QA Lead** | Bùi Nguyễn Chí Hậu | **☑ Đã nghiệm thu (Verified)** | 05/10/2026 | *Hậu (Đã ký)* |
