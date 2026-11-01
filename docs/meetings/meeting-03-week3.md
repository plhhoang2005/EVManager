# Biên bản họp — Weekly Scrum Meeting #03
**Dự án:** LV34-001 — EVManager: Hệ thống Quản lý Dịch vụ Sự kiện & Tiệc cưới  
**Buổi họp:** #03 — Rà soát khắc phục task trễ hạn & Chuẩn bị Demo giữa kỳ 50%  
**Ngày:** 27/09/2026 (Chủ Nhật, kết thúc Tuần 3 / Ngày thứ 20)  
**Thời gian:** 19:30 – 21:30  
**Hình thức:** Trực tuyến qua Google Meet  
**Người chủ trì:** Hoàng (PM)  
**Thư ký:** Hiển (BA)  

---

## 1. Thành phần tham dự

| # | Họ và tên | Vai trò | Trạng thái |
|:---:|---|---|:---:|
| 1 | Phạm Lê Huy Hoàng | Project Manager / Scrum Master | Có mặt |
| 2 | Từ Minh Hiển | Business Analyst / Product Owner | Có mặt |
| 3 | Võ Thành Nhân | UI/UX Designer & Frontend Developer | Có mặt |
| 4 | Ngô Hữu Phúc | Backend Developer & DevOps | Có mặt |
| 5 | Bùi Nguyễn Chí Hậu | Database Engineer & QA/Tester | Có mặt |

---

## 2. Mục tiêu buổi họp

- [x] Đánh giá kết quả thực hiện kế hoạch Fast-Tracking đã đề ra cuối Tuần 2 ([fast-tracking-plan.md](../planning/fast-tracking-plan.md)).
- [x] Rà soát và nghiệm thu các Pull Requests kỹ thuật quan trọng của Tuần 3 (PR #177, #178, #179, #180, #181).
- [x] Kiểm tra việc hoàn thành 9 task từng bị trễ hạn cuối Tuần 2 và gỡ bỏ hoàn toàn nhãn `status: delayed`.
- [x] Kiểm tra độ sẵn sàng của hệ thống phục vụ cột mốc Demo giữa kỳ 50% (Milestone 4).
- [x] Thống nhất kịch bản phân vai và lịch tổng duyệt (Rehearsal) chuẩn bị cho buổi báo cáo với Giảng viên.

---

## 3. Đánh giá kết quả Tuần 3 và Nghiệm thu các Pull Requests

Trong Tuần 3, nhóm đã áp dụng triệt để phương pháp Fast-Tracking (chạy song song và hỗ trợ chéo), đạt được các kết quả kỹ thuật vượt bậc:

| STT | Phân hệ | Nội dung bàn giao | PR liên kết | Người thực hiện | Đánh giá nghiệm thu |
|:---:|---|---|:---:|:---:|---|
| 1 | **Database** | Bổ sung DDL 13 bảng 3NF PostgreSQL (`schema.sql`) và dữ liệu mẫu (`seed.sql`) | **PR #179** (Merged) | Hậu | Đạt chuẩn 3NF, schema rõ ràng, có ràng buộc toàn vẹn. |
| 2 | **Database / BE** | Viết Flyway Migration `V7` (9 bảng nghiệp vụ) và `V8` (Seed demo data) cho Backend | **PR #181** (Merged) | Hậu & Phúc | Đã test với Spring Boot, 11/11 tests pass. |
| 3 | **Backend** | Hoàn thiện Module Quản lý Khách hàng (`BE-10`) và Nhật ký kiểm toán (`BE-11`) | **PR #176, #178** (Merged) | Phúc | Kiến trúc Clean Architecture, chuẩn REST API. |
| 4 | **Frontend** | Cung cấp toàn bộ 27 tệp giao diện Web (Trang chủ, Đăng nhập, Dashboard, Sảnh tiệc, Tính phí) | **PR #180** (Merged) | Nhân | Giao diện chuẩn Responsive, tải tức thì, tích hợp API Backend. |
| 5 | **QA / Test** | Nghiệm thu Master Test Plan, bộ 35 Test Cases và báo cáo kiểm thử đợt 1 | **PR #177** (Merged) | Hậu | Đã phát hiện và đóng lỗi `BUG-01` (case-insensitive login). |

---

## 4. Xử lý và Đóng 09 Task từng bị trễ hạn cuối Tuần 2

Toàn bộ 09 task từng bị trễ hạn do rào cản kỹ thuật và nợ kỹ thuật cuối Tuần 2 đã được giải quyết triệt để trong Tuần 3:

1. `BA-12` (Issue #48) & `BA-13` (Issue #49): Hiển đã hoàn thiện đặc tả UC-04 (Chống trùng lịch sảnh) và UC-05 (Giữ chỗ sảnh), đã merge trong PR #173 $\rightarrow$ **CLOSED**.
2. `UI-06` (Issue #71) & `UI-07` (Issue #72): Nhân đã hoàn thiện Prototype Figma và mã nguồn HTML/JS tương ứng trong PR #180 $\rightarrow$ **Đủ điều kiện đóng**.
3. `BE-04` (Issue #101), `BE-05` (Issue #102), `BE-06` (Issue #103): Phúc đã chuyển đổi thành công sang Spring Boot 3 skeleton, Global Exception và Validation $\rightarrow$ **CLOSED**.
4. `QA-06` (Issue #137) & `QA-07` (Issue #138): Hậu đã hoàn thành 35+ Test cases và Script Migration CSDL $\rightarrow$ **CLOSED**.

> 🎯 **Kết luận:** Nhóm đã triệt tiêu hoàn toàn 24 giờ công trễ hạn, khôi phục tiến độ dự án sát với đường cơ sở (Baseline).

---

## 5. Thống nhất Kịch bản và Phân vai Demo giữa kỳ 50%

Cả nhóm thống nhất luồng demo thực tế tại buổi báo cáo:

| Phần trình bày | Thời lượng | Nội dung chi tiết | Người phụ trách |
|---|:---:|---|:---:|
| **Phần 1: Giới thiệu & Quản lý** | 5 phút | Giới thiệu dự án, bối cảnh, cơ cấu WBS, tiến độ đường găng CPM, phân tích chỉ số EVM Day 20 | **Hoàng (PM)** |
| **Phần 2: Phân tích Nghiệp vụ** | 3 phút | Trình bày 14 Use Cases, ma trận RTM, quy trình lõi chống trùng lịch tiệc cưới | **Hiển (BA)** |
| **Phần 3: Kiến trúc & API Backend** | 4 phút | Giới thiệu kiến trúc Clean Architecture Spring Boot 3, cơ chế bảo mật JWT/RBAC và Audit Log | **Phúc (BE)** |
| **Phần 4: Giao diện Web (Live Demo)** | 5 phút | Chạy demo trực tiếp: Đăng nhập Admin $\rightarrow$ Quản lý khách hàng $\rightarrow$ Tra cứu sảnh Kim Cương $\rightarrow$ Tính phí | **Nhân (UI)** |
| **Phần 5: CSDL & Kiểm thử (QA)** | 3 phút | Demo sơ đồ CSDL 13 bảng 3NF trên PostgreSQL, báo cáo kết quả kiểm thử đợt 1 và defect log | **Hậu (DB/QA)** |
| **Hỏi đáp với Giảng viên** | 10 phút | Cả nhóm phối hợp trả lời các câu hỏi chất vấn | **Cả nhóm** |

---

## 6. Kế hoạch hành động tuần tiếp theo (Tuần 4: 28/09 – 04/10/2026)

| # | Nhiệm vụ | Người phụ trách | Hạn chót |
|:---:|---|:---:|:---:|
| 1 | Lập Bảng tính toán EVM Ngày 20 (`PM-18`) và Báo cáo giải trình sai lệch (`PM-19`) | Hoàng (PM) | 29/09 |
| 2 | Hoàn thiện Kịch bản chi tiết (`midterm-demo-script.md`) và Slide báo cáo giữa kỳ (`.pptx`) | Hoàng & Cả nhóm | 01/10 |
| 3 | Chạy thử nghiệm tổng duyệt toàn bộ luồng demo trên máy chiếu (Rehearsal lần 1) | Cả nhóm | 02/10 |
| 4 | Tổng duyệt lần cuối trước buổi báo cáo chính thức | Cả nhóm | 03/10 |

---

*Biên bản họp kết thúc lúc 21:30 cùng ngày. Các thành viên đã thống nhất 100% nội dung và cam kết thực hiện đúng tiến độ.*

**Thư ký cuộc họp:** Từ Minh Hiển (đã ký)  
**Xác nhận của PM:** Phạm Lê Huy Hoàng (đã ký)  
