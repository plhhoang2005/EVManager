# Kế Hoạch Quản Lý Truyền Thông & Phân Quyền Tài Liệu (Communication Management Plan)

| Thông tin | Chi tiết |
| :--- | :--- |
| **Dự án** | LV34-001 — EVManager: Hệ thống Quản lý Trung tâm Hội nghị & Tiệc cưới |
| **Học phần** | MAN104 — Quản lý Dự án CNTT |
| **Mã công việc** | PM-06 (Issue #12 — Chương 7 Quản lý truyền thông dự án theo PMBOK) |
| **Người thực hiện** | Phạm Lê Huy Hoàng (Project Manager) |
| **Ngày lập** | 12/09/2026 (Tuần 1) |
| **Trạng thái** | Hoàn thành nghiệm thu |

---

## 1. Mục tiêu Quản lý Truyền thông

Kế hoạch quản lý truyền thông thiết lập các kênh liên lạc chính thức, tần suất báo cáo, quy ước lưu trữ hồ sơ và cơ chế giải quyết xung đột giữa 5 thành viên trong nhóm dự án **EVManager** cùng Giảng viên hướng dẫn (Sponsor).

---

## 2. Hệ thống Kênh Truyền thông Chính thức

| Kênh công cụ | Mục đích sử dụng chính | Thời gian phản hồi cam kết (SLA) | Người quản trị |
| :--- | :--- | :--- | :---: |
| **GitHub Repository, Issues & Pull Requests** | Kênh chính thức quản lý 161 Issues, 8 Milestones, Review code và lưu trữ 100% tài liệu dự án (`docs/`). | Trong vòng **12 giờ** sau khi có PR hoặc comment gắn thẻ `@username`. | Hoàng (PM) |
| **Jira Software (Cloud Board)** | Đồng bộ theo dõi bảng Scrum/Kanban, Story Points và báo cáo Burndown/Sprint. | Cập nhật cuối mỗi tuần Sprint. | Hoàng (PM) |
| **Họp Offline & Google Meet** | Họp định kỳ hàng tuần (Weekly Scrum & Sprint Review/Planning) và các buổi giải cứu kỹ thuật (Pair Programming). | Đúng giờ theo lịch cố định (Thứ Ba 10:00–15:00 & Chủ Nhật 20:00). | Hoàng (PM) |
| **Nhóm Zalo Dự án EVManager** | Kênh thông báo khẩn, nhắc deadline, trao đổi nhanh các vướng mắc nhỏ hàng ngày. | Trong vòng **30 – 60 phút** (Khẩn cấp: gọi điện trực tiếp). | Hoàng (PM) |

---

## 3. Ma trận Phân phối Thông tin Dự án (Communication Matrix)

| Loại thông tin / Báo cáo | Nội dung chính | Tần suất | Định dạng / Kênh | Người gửi (Owner) | Người nhận (Audience) |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Họp Sprint Planning & Review** | Rà soát kết quả tuần cũ, kiểm tra tỷ lệ đóng Issue theo Milestone, phân công tuần mới. | Hàng tuần (Chủ Nhật / Thứ Ba) | Họp trực tiếp + Biên bản `docs/meetings/meeting-XX.md` | PM (Hoàng) | Cả nhóm (5 thành viên) |
| **Cập nhật Trạng thái Task & PR** | Báo cáo tiến độ code, mở Pull Request gắn mã Issue, báo cáo vướng mắc (Blocker). | Hàng ngày / Khi xong task | GitHub Issues & Pull Requests | BA, UI/UX, BE, QA | PM & Reviewer độc lập |
| **Thông báo Thay đổi API / DB Schema** | Thông báo khi có thay đổi DTO, Endpoint hoặc thêm bản Flyway Migration mới (`V1`–`V15`). | Tức thì trước khi merge | GitHub PR + Nhóm Zalo + `DECISION_LOG.md` | BE (Phúc) & DBA (Hậu) | FE (Nhân), BA (Hiển), PM (Hoàng) |
| **Báo cáo Kiểm thử & Phiếu Lỗi (Defect Log)** | Báo cáo kết quả chạy Test Suite, khởi tạo phiếu lỗi `BUG-01`..`BUG-08` kèm bước tái hiện. | Sau mỗi đợt build / Sprint | `docs/testing/` & GitHub Issues (`type: bug`) | QA (Hậu) | BE (Phúc), FE (Nhân), PM (Hoàng) |
| **Báo cáo Cột mốc Giữa kỳ & Cuối kỳ** | Báo cáo tiến độ WBS, chỉ số EVM Day 20, phân tích Pareto, kết quả UAT và Demo sản phẩm. | Tuần 4 (04/10) & Tuần 8 (01/11) | Slide `.pptx`, Word `.docx`, PDF & Live Demo | PM (Hoàng) & Cả nhóm | Giảng viên hướng dẫn & Hội đồng |

---

## 4. Quy định Phân quyền Truy cập Tài liệu & Mã nguồn (Access Control Matrix)

| Phân vùng tài nguyên | Hoàng (PM) | Hiển (BA) | Nhân (UI/UX) | Phúc (BE) | Hậu (DB/QA) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Nhánh `main` & `develop` (Protected Branches)** | **Admin / Merge** | Read (Mở PR) | Read (Mở PR) | Read (Mở PR) | Read (Mở PR) |
| **Thư mục `docs/charter/` & `docs/planning/`** | **Write (Owner)** | Read / Consult | Read | Read | Read |
| **Thư mục `docs/requirements/` (SRS, UC, BPMN)** | Approve | **Write (Owner)** | Read | Read | Read |
| **Thư mục `frontend/` & `docs/design/img/`** | Review / Merge | Read | **Write (Owner)** | Read | Read (Test) |
| **Thư mục `backend/`** | Review / Merge | Read | Read | **Write (Owner)** | Write (Migrations/Test) |
| **Thư mục `docs/testing/` & `docs/issues/`** | Review / Merge | Read | Read | Read | **Write (Owner)** |

---

## 5. Quy trình Giải quyết Xung đột & Leo thang Vấn đề (Escalation Path)

1. **Cấp độ 1 — Tự thương lượng kỹ thuật (< 4 giờ):** Khi có vướng mắc giữa 2 thành viên (ví dụ: định dạng JSON giữa Frontend và Backend), hai bên trao đổi trực tiếp dựa trên đặc tả SRS v1.0 của BA.
2. **Cấp độ 2 — Điều phối bởi BA & QA (< 12 giờ):** Nếu liên quan đến quy tắc nghiệp vụ (công thức tính chiết khấu, điều kiện trùng lịch), BA (Hiển) và QA (Hậu) đối chiếu Use Case để phán quyết.
3. **Cấp độ 3 — Quyết định cuối cùng bởi PM (< 24 giờ):** Nếu vẫn chưa thống nhất hoặc ảnh hưởng đến tiến độ đường găng, PM (Hoàng) triệu tập họp nhanh, đưa ra quyết định theo nguyên tắc ưu tiên tiến độ MVP và ghi nhận vào [`docs/agentflow/DECISION_LOG.md`](../agentflow/DECISION_LOG.md).
