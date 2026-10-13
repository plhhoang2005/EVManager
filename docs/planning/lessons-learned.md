# Báo Cáo Tổng Kết Rút Kinh Nghiệm Dự Án (Project Post-Mortem & Lessons Learned)
## Kèm Bảng Đánh Giá Đóng Góp Cá Nhân (Peer Review — 5 Thành Viên)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-29 (Issue #35 — Họp tổng kết rút kinh nghiệm dự án & Đánh giá đóng góp cá nhân) |
| **Chủ trì** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày thực hiện** | 13/10/2026 (Tổng kết chuẩn bị Đóng dự án Tuần 8) |
| **Trạng thái** | Hoàn thành & Toàn nhóm ký xác nhận |

---

## 1. Tóm tắt Kết quả Đạt được so với Mục tiêu Project Charter

Sau chặng đường phát triển theo mô hình **Hybrid (PMBOK + Agile/Scrum)**, nhóm dự án **EVManager** đã hoàn thành toàn bộ các mục tiêu SMART đề ra trong [`docs/charter/project_charter.md`](../charter/project_charter.md):

| Mục tiêu SMART trong Project Charter | Chỉ tiêu cam kết ban đầu | Kết quả đạt được thực tế | Đánh giá |
| :--- | :--- | :--- | :---: |
| **1. Phạm vi nghiệp vụ cốt lõi (MVP)** | $\ge 10$ Use Cases hoàn chỉnh | **14 Use Cases** (`UC-01` $\rightarrow$ `UC-14`) & **29 User Stories** | **Vượt chỉ tiêu (140%)** |
| **2. Phân quyền theo vai trò (RBAC)** | $\ge 4$ Actor | **4 vai trò chuẩn BA** (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`) với 4 cổng giao diện riêng | **Đạt 100%** |
| **3. Đảm bảo chất lượng & Kiểm thử** | $\ge 35$ Test Cases | **35+ System Test Cases + Unit/Concurrency Tests + 15 UAT Scenarios (Pass 100%)** | **Vượt chỉ tiêu** |
| **4. Hiệu năng & Chống trùng lịch** | Tải trang $< 3\text{s}$, không đặt trùng sảnh | Avg API `33.24ms`, p95 `142.50ms`; khóa `PESSIMISTIC_WRITE` chặn 100% trùng lịch đồng thời | **Đạt xuất sắc** |
| **5. Hồ sơ Quản lý Dự án chuẩn PMBOK** | Đầy đủ 10 lĩnh vực kiến thức PMBOK | Hoàn thành trọn bộ Charter, WBS, PERT/CPM, Gantt, COCOMO, EVM, Risk, Procurement, Quality, Closure | **Đạt 100%** |

---

## 2. Phân tích Điểm Mạnh — Những điều Nhóm đã làm tốt (What Went Well / Successes)

1. **Quy trình GitFlow, Phân vai RACI và Quản trị Issue bài bản:**
   - Ngay từ Tuần 1, nhóm đã thiết lập chuẩn làm việc trong [`AGENTS.md`](../../AGENTS.md), quy trình [`docs/agentflow/WORKFLOW.md`](../agentflow/WORKFLOW.md), phân rã **161 GitHub Issues** gắn với **8 Milestones** theo tuần và kiểm soát hợp nhất code qua **56 Pull Requests** (giữ nguyên toàn bộ nhánh làm minh chứng truy vết).
2. **Giải quyết triệt để bài toán nghiệp vụ khó nhất (Chống trùng lịch sảnh & Snapshot giá Hợp đồng):**
   - Nhóm đã kết hợp kiểm tra xung đột khung giờ ở tầng Service với cơ chế khóa bi quan (`PESSIMISTIC_WRITE`) ở tầng Database và lưu cứng đơn giá (`Price Snapshot`) khi tạo hợp đồng, giúp hệ thống đạt độ tin cậy cấp độ thương mại.
3. **Phát hiện sớm sai lệch qua EVM Day 20 và Áp dụng Fast-tracking kịp thời:**
   - Khi chỉ số EVM tại Ngày 20 báo động nhẹ ($SPI = 0.944, CPI = 0.873$), PM đã kích hoạt ngay kế hoạch **Fast-tracking** ([`docs/planning/fast-tracking-plan.md`](fast-tracking-plan.md)) và kế hoạch khắc phục ([`docs/planning/evm-variance-report.md`](evm-variance-report.md)), giúp kéo tiến độ về đúng đường cơ sở từ Tuần 5 mà không bị trượt bất kỳ cột mốc nào.
4. **Ứng dụng hiệu quả Phân tích Pareto 80/20 trong Quản lý Chất lượng:**
   - Thay vì sửa lỗi dàn trải, nhóm đã dùng biểu đồ Pareto xác định đúng 2 nhóm lỗi chiếm 80% sự cố (Lệch múi giờ/Trùng lịch 50% và Công thức tính chiết khấu 30%) để tập trung dứt điểm trước khi vào UAT.

---

## 3. Phân tích Điểm Hạn chế — Những vấn đề gặp phải (What Could Be Improved / Shortcomings)

1. **Ước lượng thời gian ban đầu cho thiết kế Database và Security còn lạc quan:**
   -Ở Tuần 2, việc nâng cấp thiết kế từ 8 bảng sơ bộ lên **13+ bảng chuẩn hóa 3NF** (bổ sung quản lý giá theo ca, hợp đồng nhiều thực đơn `contract_menus`, dịch vụ đi kèm `contract_services`) và cấu hình Spring Security 6 JWT tiêu tốn nhiều giờ công hơn dự kiến, dẫn đến phát sinh 48 giờ Overtime ở Tuần 3.
2. **Hiện tượng "Đóng non" Issue và Lệch pha API Contract ở giai đoạn đầu:**
   - Trước mốc Demo giữa kỳ, một số tác vụ Frontend và Backend được đánh dấu hoàn thành khi mới chạy trên dữ liệu giả lập (`localStorage`) hoặc dùng tên role tạm (`STAFF`, `MANAGER`) chưa khớp với đặc tả của BA (`SALES`, `COORDINATOR`).
3. **Quản lý hợp nhất nhánh (PR Hygiene):**
   - Một số nhánh tính năng đầu kỳ (`PR #194–#197`) chứa lẫn các tệp cấu hình cục bộ hoặc kéo dài qua nhiều ngày không rebase với `develop`, gây ra xung đột khi gộp code.

---

## 4. Bài học Kinh nghiệm Đúc kết cho các Dự án Tương lai (Key Lessons Learned)

| Lĩnh vực PMBOK | Bài học kinh nghiệm rút ra (Lesson Learned) | Khuyến nghị áp dụng cho dự án sau (Actionable Recommendation) |
| :--- | :--- | :--- |
| **Quản lý Tích hợp & Phạm vi** | Sự lệch pha nhỏ về tên trường JSON hoặc mã Role giữa BA – Backend – Frontend sẽ gây lỗi dây chuyền khi ghép nối. | **Chốt cứng API Contract (OpenAPI/Swagger) và danh mục Enum/Role ngay từ Tuần 2** trước khi viết code giao diện và controller. |
| **Quản lý Thời gian & Chi phí** | Giai đoạn xây dựng nền móng (DB Schema 3NF + Auth Skeleton) luôn tốn chi phí cao hơn trung bình ($CPI < 1$ ở đầu dự án). | Dành **Quỹ dự phòng tiến độ & ngân sách (10%–15% Buffer)** cho Sprint nền tảng và tái sử dụng các Component/Base Service ở các Sprint sau. |
| **Quản lý Chất lượng & Kiểm thử** | Chỉ đóng Issue khi đã qua kiểm thử tích hợp đầu-cuối (End-to-End) trên dữ liệu PostgreSQL thật. | Áp dụng nghiêm ngặt **Definition of Done (DoD)**: Không chấp nhận mock tĩnh khi nghiệm thu task tích hợp; chạy Regression Test tự động sau mỗi PR. |
| **Quản lý Cấu hình & GitFlow** | Các Pull Request nhỏ, tập trung vào 1 issue duy nhất giúp review và merge nhanh gấp 5 lần so với PR khổng lồ. | Mỗi PR chỉ giải quyết 1 Issue (`feature/<issue>-<name>`), cấu hình `.gitignore` chặt chẽ ngay từ commit đầu tiên. |

---

## 5. Bảng Đánh Giá Đóng Góp Cá Nhân & Đồng Thuận Nhóm (Peer Review & Contribution Matrix)

Dựa trên số lượng Issue hoàn thành, lịch sử Commit/PR trên GitHub, bảng chấm công họp nhóm và chất lượng sản phẩm bàn giao trong suốt 8 tuần, cả 5 thành viên thống nhất kết quả đánh giá đóng góp cá nhân như sau:

| STT | Họ và tên | MSSV | Vai trò chính | Tài khoản GitHub | Khối lượng công việc hoàn thành (Minh chứng chính) | Tỷ lệ đóng góp | Điểm đánh giá (/100) | Chữ ký cam kết |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **1** | **Phạm Lê Huy Hoàng** | `2380600738` | **Project Manager (PM) / Scrum Master / Integration** | `plhhoang2005` | Toàn bộ hồ sơ QLDA 10 chương PMBOK (Issues `#1`, `#2`, `#7`–`#36`), tích hợp hệ thống (`#215`, PR `#185`, `#216`, `#217`), điều phối & review toàn bộ 56 PRs. | **100%** | **100 / 100** | *Hoàng (Đã ký)* |
| **2** | **Từ Minh Hiển** | — | **Business Analyst (BA) / Product Owner** | `tuminhhien324-svg` | Khảo sát nghiệp vụ, Stakeholder Register, SOW, 3 sơ đồ BPMN, SRS v1.0, 14 Use Cases (`UC-01`..`UC-14`), Product Backlog MoSCoW, RTM Matrix, CR-02, UAT Scenarios (`#3`, `#37`–`#65`). | **100%** | **100 / 100** | *Hiển (Đã ký)* |
| **3** | **Võ Thành Nhân** | — | **UI/UX Designer & Frontend Developer** | `nhanvo134679` | User Flow, Figma Wireframe/Prototype, Design System, 4 cổng giao diện (`admin`, `sales`, `coordinator`, `customer`), Contract Wizard 3 bước, Pricing Calculator (`#4`, `#66`–`#97`, PR `#212`–`#214`). | **100%** | **100 / 100** | *Nhân (Đã ký)* |
| **4** | **Ngô Hữu Phúc** | — | **Backend Developer & DevOps Lead** | `phucngo1707` | Kiến trúc Spring Boot 3, JWT Auth, RBAC 4 roles, toàn bộ REST APIs (Users, Customers, Venues, Events, Conflict Checker, Dishes, Menus, Services, Contracts, Payments, Dashboard) (`#5`, `#98`–`#131`). | **100%** | **100 / 100** | *Phúc (Đã ký)* |
| **5** | **Bùi Nguyễn Chí Hậu** | — | **Database Architect & QA/Test Lead** | `2005buinguyenchihau-alt` | Thiết kế ERD 3NF, Data Dictionary, 15 bản Flyway Migrations (`V1`–`V15`), Master Test Plan, 35+ Test Cases, Concurrency Test, Performance Test k6, Pareto & UAT Report (`#6`, `#132`–`#156`, PR `#218`–`#221`). | **100%** | **100 / 100** | *Hậu (Đã ký)* |

> **Cam kết tập thể:** Cả 5 thành viên xác nhận bảng đánh giá trên phản ánh trung thực, công bằng và khách quan công sức đóng góp thực tế của từng cá nhân trong dự án EVManager.
