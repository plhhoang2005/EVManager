# Project Charter — LV34-001
**EVManager: Hệ thống quản lý tổng thể cho dịch vụ sự kiện**

| Thông tin | Nội dung |
|---|---|
| Mã dự án | LV34-001 |
| Học phần | MAN104 — Quản lý Dự án CNTT |
| Ngày lập | 07/09/2026 |
| Phiên bản | v1.0 |
| PM | Hoàng |
| Trạng thái | Draft → chờ GV duyệt |

---

## 1. Bối cảnh & Vấn đề (Problem Statement)

Các công ty tổ chức sự kiện (cưới hỏi, tiệc, hội nghị) hiện nay vẫn quản lý khách hàng, lịch sự kiện, hợp đồng và thanh toán bằng Excel hoặc giấy tờ thủ công. Điều này dẫn đến:

- **Trùng lịch sự kiện** do không có hệ thống kiểm tra xung đột tự động.
- **Mất thông tin khách hàng** và lịch sử dịch vụ khi nhân sự thay đổi.
- **Khó theo dõi trạng thái hợp đồng và thanh toán** theo thời gian thực.
- **Báo cáo doanh thu** mất nhiều thời gian tổng hợp thủ công.

---

## 2. Mục tiêu dự án (SMART Goals)

| # | Mục tiêu | Đo lường | Khả thi | Thực tế | Thời hạn |
|---|---|---|---|---|---|
| 1 | Xây dựng MVP quản lý khách hàng, gói dịch vụ, lịch sự kiện, hợp đồng, thanh toán | ≥ 10 Use Case hoàn chỉnh | Có — nhóm 5 người × 8 tuần | Phù hợp mức Khá | 01/11/2026 |
| 2 | Triển khai RBAC với ≥ 4 actor | 4 vai trò: Admin, Tư vấn, Điều phối, Khách hàng | Có | Yêu cầu bắt buộc | 01/11/2026 |
| 3 | Kiểm thử đầy đủ ≥ 35 test case | Test report + defect log | Có | Hậu phụ trách | 25/10/2026 |
| 4 | Deploy demo hoặc cloud | Link truy cập được | Có | CI/CD hoặc manual | 25/10/2026 |
| 5 | Hoàn thiện toàn bộ hồ sơ quản lý dự án | 14 loại tài liệu theo checklist | Có | Phân công rõ | 01/11/2026 |

---

## 3. Phạm vi dự án

### 3.1 In-scope (Phạm vi thực hiện)

- Đăng nhập, đăng xuất, xác thực và phân quyền theo vai trò (RBAC)
- Quản lý khách hàng (CRUD + tìm kiếm/lọc)
- Quản lý gói dịch vụ và danh mục dịch vụ
- Quản lý lịch sự kiện + kiểm tra xung đột lịch tự động
- Quản lý hợp đồng (tạo, xác nhận, theo dõi trạng thái)
- Quản lý đặt cọc và thanh toán
- Dashboard thống kê tổng quan
- Báo cáo doanh thu và báo cáo hợp đồng (xuất PDF/Excel)
- Import/Export dữ liệu
- Thông báo qua ít nhất 1 dịch vụ bên ngoài (email hoặc tương đương)
- Ít nhất 35 test case (unit/integration/system/UAT)
- CI/CD hoặc deploy cloud

### 3.2 Out-of-scope (Ngoài phạm vi)

- Ứng dụng di động (iOS/Android)
- Tích hợp thanh toán trực tuyến thực tế (chỉ mô phỏng)
- AI/ML dự báo chi phí — **chỉ thực hiện nếu MVP hoàn chỉnh và còn thời gian**
- Đa ngôn ngữ
- Chức năng chat/video nội bộ

---

## 4. Stakeholders

| Stakeholder | Vai trò | Kỳ vọng |
|---|---|---|
| Giảng viên hướng dẫn | Người phê duyệt & đánh giá | Hệ thống chạy được, hồ sơ đầy đủ, nhóm hiểu rõ |
| Nhóm phát triển (5 thành viên) | Người thực hiện | Hoàn thành đúng tiến độ, mỗi người có minh chứng rõ |
| Người dùng mô phỏng (demo) | Admin, Tư vấn, Điều phối, Khách hàng | Hệ thống dễ dùng, dữ liệu mẫu hợp lý |

---

## 5. Thành viên và vai trò

| Thành viên | Vai trò | Trách nhiệm chính |
|---|---|---|
| **Hoàng** | PM / Scrum Master / Integration | Kế hoạch, tiến độ, rủi ro, tích hợp, release |
| **Hiển** | BA / PO | Yêu cầu, backlog, SRS, nghiệm thu nghiệp vụ |
| **Nhân** | UI/UX + Frontend | Prototype, giao diện, tích hợp API |
| **Phúc** | Backend/API + DevOps | API, business logic, auth, deploy |
| **Hậu** | Database + QA/Tester | Dữ liệu, kiểm thử, chất lượng |

---

## 6. Thời gian & Mốc quan trọng

| Mốc | Tuần | Ngày dự kiến | Mô tả |
|---|---|---|---|
| Gate 1 — GV duyệt đề tài & scope | Tuần 1 | 13/09/2026 | Charter + phạm vi sơ bộ được duyệt |
| Gate 2 — Kế hoạch khả thi & RTM | Tuần 2 | 20/09/2026 | WBS, Gantt, SRS v1, ERD v1 |
| Demo increment 1 — Login + dữ liệu lõi | Tuần 3 | 27/09/2026 | Hệ thống chạy luồng login + CRUD cơ bản |
| Demo giữa kỳ ≥50% | Tuần 4 | 04/10/2026 | Trình bày giữa kỳ với GV |
| Demo increment 3 + quality report | Tuần 5 | 11/10/2026 | 70% nghiệp vụ + Dashboard/Report |
| Release Candidate 1 | Tuần 6 | 18/10/2026 | Feature complete, không còn lỗi Critical |
| Gate 3 — Ready for Defense | Tuần 7 | 25/10/2026 | UAT xong, deploy thành công, tài liệu đầy đủ |
| Bảo vệ đồ án | Tuần 8 | 26/10–01/11/2026 | Theo lịch GV |

---

## 7. Ràng buộc (Constraints)

- Thời gian: Cố định 8 tuần (07/09 – 01/11/2026)
- Nhân lực: 5 thành viên, làm ngoài giờ học
- Chi phí: Ưu tiên dùng free tier (Vercel, Railway, Supabase, v.v.)
- Mức độ: Phải đạt tiêu chí "Khá" theo yêu cầu môn học

---

## 8. Rủi ro ban đầu

| Rủi ro | Mức | Biện pháp |
|---|---|---|
| Scope quá lớn | Cao | Chốt Must-have từ tuần 1, không thêm chức năng nếu chưa xong MVP |
| Frontend/Backend không khớp API | Cao | Chốt API contract ở Tuần 2 |
| Database thay đổi muộn | Cao | ERD v1 chốt Tuần 2, migration có version |
| Thành viên không có minh chứng | Cao | Commit + issue + timesheet hằng tuần |

---

## 9. Chữ ký phê duyệt

| Vai trò | Họ tên | Ngày |
|---|---|---|
| PM | Hoàng | 07/09/2026 |
| Giảng viên | ________________ | ________________ |

---
*Phiên bản 1.0 — LV34-001 — MAN104 — 07/09/2026*
