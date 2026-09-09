# EVManager

> LV34-001 — Hệ thống quản lý tổng thể cho dịch vụ sự kiện (Web + Desktop)

Đồ án học phần **MAN104 — Quản lý Dự án CNTT**, thực hiện trong 8 tuần: **07/09/2026 – 01/11/2026**.

## Mục tiêu

Xây dựng MVP quản lý khách hàng, gói dịch vụ, lịch sự kiện, hợp đồng và thanh toán. Hệ thống hướng tới quy trình vận hành xuyên suốt từ tư vấn đến hoàn tất sự kiện, kèm dashboard, báo cáo và kiểm thử.

## Phạm vi MVP

- Đăng nhập, xác thực và phân quyền theo vai trò (RBAC)
- Quản lý khách hàng, gói dịch vụ, lịch sự kiện, hợp đồng và thanh toán
- Kiểm tra trùng lịch, theo dõi trạng thái và thông báo qua dịch vụ ngoài
- Dashboard, báo cáo doanh thu/hợp đồng, import/export dữ liệu
- Ít nhất 4 actor, 10–14 use case, 3 quy trình lõi và 35 test case

## Cấu trúc repository

```text
EVManager/
├── docs/                 # Hồ sơ và tài liệu dự án
│   ├── charter/          # Project Charter, PMP
│   ├── planning/         # WBS, Gantt, RACI, rủi ro
│   ├── requirements/     # SRS, use case, backlog
│   ├── design/           # ERD, kiến trúc, API, UI/UX
│   ├── testing/          # Test plan, test case, defect log
│   └── meetings/         # Biên bản họp, status report
├── frontend/             # Ứng dụng giao diện
├── backend/              # API và business logic
└── database/             # Schema, migration, seed
```

## Cài đặt và chạy dự án

> Tech stack sẽ được nhóm chốt và cập nhật tại đây.

1. Clone repository.
2. Cài đặt dependencies cho `frontend/` và `backend/` theo hướng dẫn riêng của từng thư mục.
3. Cấu hình biến môi trường từ tệp `.env.example` (sẽ bổ sung).
4. Khởi tạo database bằng migration/seed (sẽ bổ sung).
5. Chạy frontend và backend theo lệnh của stack đã chọn.

## Thành viên

| Thành viên | Vai trò chính | Trách nhiệm |
|---|---|---|
| Hoàng | PM / Scrum Master / Integration | Kế hoạch, tiến độ, rủi ro, tích hợp và release |
| Hiển | BA / PO | Yêu cầu, backlog, SRS, nghiệm thu nghiệp vụ |
| Nhân | UI/UX + Frontend | Prototype, giao diện, tích hợp API |
| Phúc | Backend/API + DevOps | API, business logic, xác thực, deploy |
| Hậu | Database + QA/Tester | Dữ liệu, kiểm thử, chất lượng |

## Tài liệu

- [Project Charter & PMP](docs/charter/)
- [Kế hoạch dự án](docs/planning/)
- [Yêu cầu](docs/requirements/)
- [Thiết kế](docs/design/)
- [Kiểm thử](docs/testing/)
- [Biên bản họp](docs/meetings/)

## Quy ước làm việc

- Không push trực tiếp lên `main` hoặc `develop`.
- Phát triển trên nhánh `feature/<ten-chuc-nang>`, `fix/<ten-loi>` hoặc `docs/<noi-dung>`.
- Mỗi thay đổi phải liên kết với Issue; Pull Request cần mô tả và review trước khi merge.
- Mỗi thành viên duy trì commit, issue và timesheet như minh chứng đóng góp cá nhân.
