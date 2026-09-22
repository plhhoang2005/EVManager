# Hướng dẫn thiết lập GitHub — Tuần 1
**Dự án:** LV34-001 — EVManager  
**Người thực hiện:** Hoàng (PM)  
**Deadline:** 08/09/2026

---

## 1. Milestones cần tạo (8 milestones)

| Milestone | Due Date | Mô tả |
|---|---|---|
| `Tuần 1 — Khởi động & Scope` | 13/09/2026 | Charter, RACI, Kick-off, stakeholders, user flow, tech stack, entity |
| `Tuần 2 — Phân tích & Thiết kế` | 20/09/2026 | WBS, Gantt, SRS, UC, wireframe, API spec, ERD |
| `Tuần 3 — Xây dựng lõi` | 27/09/2026 | Auth/CRUD API, Login UI, Migration, Test batch 1 |
| `Tuần 4 — Demo giữa kỳ 50%` | 04/10/2026 | Hoàn thiện module lõi, Frontend gọi API thật |
| `Tuần 5 — Dashboard & Report` | 11/10/2026 | 70% nghiệp vụ, Dashboard, Report, External service |
| `Tuần 6 — Feature Complete` | 18/10/2026 | 100% Must-have, ≥35 test case, Fix bug |
| `Tuần 7 — UAT & Deploy` | 25/10/2026 | UAT, Deploy, Tài liệu, Video demo |
| `Tuần 8 — Bảo vệ & Đóng dự án` | 01/11/2026 | Final release, Closure, Lessons Learned |

---

## 2. Labels cần tạo

### Theo loại công việc
| Label | Màu | Mô tả |
|---|---|---|
| `type: feature` | `#0075ca` | Chức năng mới |
| `type: bug` | `#d73a4a` | Lỗi cần sửa |
| `type: docs` | `#e4e669` | Tài liệu |
| `type: test` | `#0e8a16` | Test case, test report |
| `type: chore` | `#e4e4e4` | Setup, cấu hình, tooling |
| `type: design` | `#f9d0c4` | UI/UX, wireframe, prototype |

### Theo thành viên
| Label | Màu |
|---|---|
| `owner: hoang` | `#1d76db` |
| `owner: hien` | `#0075ca` |
| `owner: nhan` | `#5319e7` |
| `owner: phuc` | `#e99695` |
| `owner: hau` | `#c5def5` |

### Theo độ ưu tiên
| Label | Màu |
|---|---|
| `priority: high` | `#b60205` |
| `priority: medium` | `#fbca04` |
| `priority: low` | `#0e8a16` |

### Theo trạng thái
| Label | Màu |
|---|---|
| `status: in-progress` | `#ffa500` |
| `status: blocked` | `#d73a4a` |
| `status: review` | `#7057ff` |

---

## 3. Issues cần tạo cho Tuần 1 (Milestone: Tuần 1)

### Hoàng — PM
**Issue #1:** [PM] Viết và hoàn thiện Project Charter  
Labels: type: docs, owner: hoang, priority: high  
Deadline: 10/09/2026  
- [ ] Problem Statement  
- [ ] Mục tiêu SMART  
- [ ] Phạm vi In/Out-scope  
- [ ] Stakeholders  
- [ ] Thành viên & vai trò  
- [ ] Timeline 8 tuần  
- [ ] Ràng buộc & rủi ro  

**Issue #2:** [PM] Lập RACI Matrix  
Labels: type: docs, owner: hoang, priority: high  
Deadline: 09/09/2026  
- [ ] RACI nhóm Quản lý dự án  
- [ ] RACI Phân tích nghiệp vụ  
- [ ] RACI UI/UX & Frontend  
- [ ] RACI Backend/DevOps  
- [ ] RACI Database  
- [ ] RACI Kiểm thử  

**Issue #3:** [PM] Thiết lập GitHub repo — Milestones, Labels, Board  
Labels: type: chore, owner: hoang, priority: high  
Deadline: 08/09/2026  
- [ ] Tạo 8 Milestones  
- [ ] Tạo Labels  
- [ ] Thiết lập Project Board  
- [ ] Tạo branch develop  

**Issue #4:** [PM] Tổ chức họp Kick-off và lập biên bản  
Labels: type: docs, owner: hoang, priority: high  
Deadline: 07/09/2026  

---

### Hiển — BA/PO
**Issue #5:** [BA] Xác định Stakeholders & Actors  
Labels: type: docs, owner: hien, priority: high  
Deadline: 10/09/2026  
- [ ] Liệt kê stakeholders (≥ 3)  
- [ ] Xác định ≥ 4 actors  
- [ ] Mô tả kỳ vọng/nhu cầu  

**Issue #6:** [BA] Viết Problem Statement & 3 quy trình lõi  
Labels: type: docs, owner: hien, priority: high  
Deadline: 12/09/2026  
- [ ] Problem Statement  
- [ ] Quy trình 1: Tiếp nhận & tư vấn  
- [ ] Quy trình 2: Chốt dịch vụ  
- [ ] Quy trình 3: Điều phối sự kiện  

**Issue #7:** [BA] Draft danh sách Use Case sơ bộ (10–14 UC)  
Labels: type: docs, owner: hien, priority: medium  
Deadline: 13/09/2026  

---

### Nhân — UI/UX
**Issue #8:** [UI/UX] Nghiên cứu User Flow & xác định màn hình chính  
Labels: type: design, owner: nhan, priority: high  
Deadline: 13/09/2026  
- [ ] User flow 3 quy trình lõi  
- [ ] Danh sách màn hình chính  
- [ ] Tham khảo ≥ 2 design system  

---

### Phúc — Backend/DevOps
**Issue #9:** [Backend] Đề xuất Tech Stack & kiến trúc sơ bộ  
Labels: type: docs, owner: phuc, priority: high  
Deadline: 10/09/2026  
- [ ] Frontend framework  
- [ ] Backend framework  
- [ ] Database  
- [ ] Auth method  
- [ ] Kiến trúc sơ bộ (diagram)  

**Issue #10:** [Backend] Chuẩn bị backend repo skeleton  
Labels: type: chore, owner: phuc, priority: medium  
Deadline: 13/09/2026  
Phụ thuộc: Issue #9  
- [ ] Khởi tạo project  
- [ ] Cấu trúc thư mục  
- [ ] .env.example  
- [ ] README backend  

---

### Hậu — Database/QA
**Issue #11:** [DB] Xác định entities sơ bộ & data requirements  
Labels: type: docs, owner: hau, priority: high  
Deadline: 13/09/2026  
- [ ] Liệt kê 8–10 entities (Users, Roles, Customers, ServicePackages, ServiceItems, Events, EventServices, Contracts, Payments, AuditLogs)  
- [ ] Mô tả dữ liệu cần lưu  
- [ ] Xác định quan hệ sơ bộ  

---

## 4. Cấu trúc branch

```
main                        <- Production
└── develop                 <- Integration
    ├── feature/auth-rbac
    ├── feature/customer-management
    ├── feature/event-schedule
    ├── feature/contract-management
    ├── feature/payment
    ├── feature/dashboard-report
    ├── docs/project-charter
    ├── docs/raci
    └── docs/srs
```

## 5. Commit convention

```
feat: them chuc nang moi
fix: sua loi
docs: cap nhat tai lieu
test: them/sua test case
chore: cau hinh, setup
refactor: cai thien code
style: chinh CSS/styling
```

---
*Tai lieu noi bo — LV34-001 — MAN104 — 07/09/2026*
