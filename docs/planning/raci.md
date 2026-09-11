# RACI Matrix — LV34-001 EVManager

> **Ghi chú ký hiệu:**
> - **R** = Responsible (Người thực hiện)
> - **A** = Accountable (Người chịu trách nhiệm cuối)
> - **C** = Consulted (Người được tham khảo ý kiến)
> - **I** = Informed (Người được thông báo)

---

## A. Quản lý dự án

| Hoạt động | Hoàng (PM) | Hiển (BA) | Nhân (UI) | Phúc (BE) | Hậu (DB/QA) |
|---|:---:|:---:|:---:|:---:|:---:|
| Project Charter | A/R | C | I | I | I |
| WBS & WBS Dictionary | A/R | C | I | I | I |
| Gantt baseline & cập nhật | A/R | I | I | I | I |
| Effort & Cost Budget | A/R | C | I | C | I |
| Risk Register | A/R | C | I | C | C |
| RACI & phân công | A/R | I | I | I | I |
| Timesheet (toàn nhóm) | A | R | R | R | R |
| Change Request / Change Log | A/R | C | I | I | I |
| Status Report hàng tuần | A/R | I | I | I | I |
| Communication Plan | A/R | I | I | I | I |
| Procurement Plan | A | I | I | R | I |
| Project Closure & Lessons Learned | A/R | C | C | C | C |
| Tổ chức họp & biên bản | A/R | I | I | I | I |

---

## B. Phân tích nghiệp vụ & Yêu cầu

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| Xác định stakeholders & actors | C | A/R | I | I | I |
| Problem Statement | C | A/R | I | I | I |
| SRS v1 | I | A/R | C | C | C |
| 10–14 Use Case / User Story | C | A/R | C | C | I |
| Acceptance Criteria | I | A/R | C | C | C |
| Phân loại backlog (Must/Should/Could) | C | A/R | I | I | I |
| Requirement Traceability Matrix (RTM) | I | A | I | I | R |
| Nghiệm thu nghiệp vụ / UAT | I | A/R | C | C | C |

---

## C. Thiết kế UI/UX & Frontend

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| User flow & Information Architecture | I | C | A/R | I | I |
| Wireframe | I | C | A/R | I | I |
| Prototype | I | C | A/R | I | I |
| Design system | I | I | A/R | I | I |
| Màn hình CRUD | I | C | A/R | C | I |
| Dashboard UI | I | C | A/R | C | I |
| Gọi API & xử lý dữ liệu frontend | I | I | A/R | C | I |
| Fix lỗi UI theo defect log | I | I | A/R | I | C |

---

## D. Backend / API / DevOps

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| Đề xuất tech stack | C | C | C | A/R | C |
| Kiến trúc backend | I | I | I | A/R | C |
| API Contract / API Spec | I | C | C | A/R | C |
| Authentication (JWT/session) | I | I | I | A/R | I |
| Authorization / RBAC | I | C | I | A/R | I |
| CRUD API lõi | I | C | C | A/R | C |
| Business logic + Validation | I | C | I | A/R | C |
| Error handling & Security | I | I | I | A/R | I |
| Report API | I | C | C | A/R | C |
| Tích hợp dịch vụ bên ngoài | I | I | I | A/R | I |
| CI/CD pipeline | I | I | I | A/R | I |
| Deploy demo/cloud | C | I | I | A/R | I |
| README & Deployment Guide | C | I | I | A/R | I |

---

## E. Database

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| Xác định entities sơ bộ | I | C | I | C | A/R |
| ERD v1 | I | C | I | C | A/R |
| Schema (8–12 bảng) | I | C | I | C | A/R |
| Data Dictionary | I | C | I | I | A/R |
| Migration scripts | I | I | I | C | A/R |
| Seed dữ liệu mẫu | I | C | I | C | A/R |
| Query dashboard & báo cáo | I | C | I | C | A/R |

---

## F. Kiểm thử (QA/Testing)

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| Test Plan & Test Strategy | I | C | I | I | A/R |
| Definition of Done (DoD) | C | C | C | C | A/R |
| Viết ≥35 Test Case | I | C | I | I | A/R |
| Unit Test | I | I | I | C | A/R |
| Integration Test | I | I | C | C | A/R |
| System Test | I | C | C | C | A/R |
| UAT | I | C | I | I | A/R |
| Regression Test | I | I | I | I | A/R |
| Defect Log | I | I | I | I | A/R |
| Final Test Report | I | C | I | I | A/R |

---

## G. Tích hợp & Release

| Hoạt động | Hoàng | Hiển | Nhân | Phúc | Hậu |
|---|:---:|:---:|:---:|:---:|:---:|
| Quản lý Git workflow & merge | A/R | I | C | C | I |
| Integration branch | A/R | I | C | C | I |
| End-to-end integration test | A/R | I | C | C | C |
| Release checklist | A/R | C | C | C | C |
| Demo rehearsal | A/R | C | C | C | C |

---

## Tóm tắt nhanh theo người

| Người | Chịu trách nhiệm (A) chính về |
|---|---|
| **Hoàng** | Toàn bộ quản lý dự án, tích hợp, release |
| **Hiển** | Yêu cầu, SRS, use case, backlog, nghiệm thu |
| **Nhân** | UI/UX, prototype, frontend, giao diện end-to-end |
| **Phúc** | Kiến trúc backend, toàn bộ API, auth, deploy |
| **Hậu** | ERD, schema, migration, toàn bộ test & QA |

---
*Phiên bản 1.0 — LV34-001 — MAN104 — 07/09/2026*
