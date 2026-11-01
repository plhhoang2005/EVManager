# Gantt Overview — LV34-001 EVManager
**Thời gian dự án:** 07/09/2026 – 01/11/2026 (8 tuần)  
**Phiên bản:** v1.0 Baseline — 07/09/2026

---

## Timeline tổng quan

```
Tuần     ->  T1    T2    T3    T4    T5    T6    T7    T8
Ngày     ->  7-13  14-20 21-27 28-4  5-11  12-18 19-25 26-1
             Sep   Sep   Sep   Oct   Oct   Oct   Oct   Nov
----------------------------------------------------------
QUAN LY DU AN (Hoang)
Project Charter      ████
RACI & Phan cong     ████
WBS & Gantt               ████
Risk Register             ████──────────────────────────
Status Report             ████──────────────────────────
Change Log                          ████──────────────
Integration/Release            ████──────────────████
Project Closure                                     ████

PHAN TICH NGHIEP VU (Hien)
Stakeholders/Actors  ████
Problem Statement    ████
SRS v1                    ████
10-14 Use Case/US    ████──████
Acceptance Criteria       ████
Backlog priorities        ████
RTM                       ████──────────────────────────
UAT                                    ████──────████

THIET KE & FRONTEND (Nhan)
Nghien cuu user flow ████
Danh sach man hinh   ████
Wireframe                 ████
Prototype                 ████
Design system             ████
Login + Layout                  ████
CRUD screens                    ████──████
Dashboard UI                          ████
Report UI                             ████
API integration                  ████──████──████
UX polish & fix                               ████──████

BACKEND / API (Phuc)
Tech stack proposal  ████
Kien truc so bo      ████
Backend repo setup   ████
API spec/contract         ████
Auth/RBAC skeleton        ████
Auth/RBAC hoan chinh            ████
CRUD API loi                    ████──████
Business logic                        ████──████
Report API                                  ████
External integration                        ████
CI/CD                                             ████
Deploy demo/cloud                           ████──████

DATABASE (Hau)
Entity so bo         ████
Data requirements    ████
ERD v1                    ████
Schema (8-12 bang)        ████
Data dictionary           ████
Migration scripts               ████
Seed du lieu mau               ████──████
Query dashboard/report               ████──████

KIEM THU / QA (Hau)
Test Plan & Strategy      ████
Test Case (draft)               ████──████
Unit/Integration test                 ████──████──████
System test                                   ████──████
UAT                                               ████──████
Regression                                              ████
Defect log                            ████──────────────████
Final Test Report                                       ████

----------------------------------------------------------
MILESTONE
Gate 1 - GV duyet   ^
Gate 2 - KH & SRS         ^
Demo increment 1                ^
Demo giua ky 50%                     ^
Feature Complete                                ^
Gate 3 - Ready                                      ^
Bao ve do an                                            ^^
```

---

## Phân rã task chi tiết — Tuần 1 (07–13/09)

| Task | Người | Ngày bắt đầu | Ngày kết thúc | Phụ thuộc |
|---|---|---|---|---|
| Project Charter | Hoàng | 07/09 | 10/09 | — |
| RACI Matrix | Hoàng | 07/09 | 09/09 | — |
| Thiết lập GitHub repo + board + milestone | Hoàng | 07/09 | 08/09 | — |
| Họp Kick-off | Hoàng | 07/09 | 07/09 | — |
| Xác định stakeholders & actors | Hiển | 07/09 | 10/09 | — |
| Problem Statement | Hiển | 08/09 | 11/09 | Stakeholders |
| 3 quy trình nghiệp vụ lõi | Hiển | 09/09 | 12/09 | Problem Statement |
| Draft Use Case sơ bộ | Hiển | 10/09 | 13/09 | Quy trình lõi |
| Nghiên cứu user flow | Nhân | 07/09 | 11/09 | — |
| Danh sách màn hình chính | Nhân | 10/09 | 13/09 | User flow |
| Đề xuất tech stack | Phúc | 07/09 | 10/09 | — |
| Kiến trúc sơ bộ | Phúc | 09/09 | 12/09 | Tech stack |
| Backend repo skeleton | Phúc | 11/09 | 13/09 | Kiến trúc |
| Entity sơ bộ | Hậu | 07/09 | 11/09 | — |
| Data requirements | Hậu | 09/09 | 13/09 | Entities |
| **Gate 1 — GV duyệt scope** | **Cả nhóm** | **13/09** | **13/09** | Tất cả Tuần 1 |

---

## Planned vs Actual (cập nhật hằng tuần)

| Tuần | Kế hoạch (Planned) | Thực tế (Actual) | % hoàn thành | Ghi chú |
|---|---|---|---|---|
| T1 | Charter, RACI, Kickoff, Stakeholders, User flow, Tech stack, Entity | Hoàn thành 22/22 issues Tuần 1 (Charter, Scope, RACI, SOW, Stakeholders, User flow, Tech stack, Conceptual ERD) | **100%** | Đạt Gate 1 đúng hạn |
| T2 | WBS, Gantt, SRS, UC, Wireframe, API spec, ERD | Hoàn thành 30/30 issues Tuần 2 (WBS cấp 4, PERT/CPM, Gantt Baseline, COCOMO, BPMN 1–3, ERD 3NF 13 bảng, Test Plan & 35+ TC) | **100%** | Đạt Gate 2 đúng hạn |
| T3 | Auth/CRUD API, Login UI, CRUD screens, Migration, Seed, Test batch 1 | Hoàn thành 23/23 issues Tuần 3 (Risk Register, 4T Plan, Fast-tracking, SRS v1.0, RTM, Auth JWT, RBAC, Users, Customers, Seed Data) | **100%** | Đạt Increment 1 |
| T4 | ≥50% + Demo giữa kỳ | Hoàn thành 18/18 issues Tuần 4 (EVM Day 20, Variance Report, Slide & Demo Script, Venues, Conflict Checker, Midterm Test Report, CR-01) | **100%** | Hoàn thành Demo 50% |
| T5 | Dashboard, Report, External service, Test batch 2 | Hoàn thành 20/21 issues Tuần 5 (Dishes, Menus, Services, Contracts, State Machine, Payments, Procurement & Vendor Plan, Concurrency Fix) | **95.2%** | Còn #84 đang hoàn thiện UI |
| T6 | Feature complete, ≥35 test case, Fix bug | Đã hoàn thành Quality Plan, Quality Checklist, Pareto 80/20 Analysis, Regression Test, Performance Test (<3s) | **85.0%** | Đang chốt các API xuất file |
| T7 | UAT, Deploy, Tài liệu, Video | Đã hoàn thành UAT Plan, UAT Scenarios Master và thực thi UAT đạt 15/15 kịch bản ACCEPTED (`uat-execution-results.md`) | **80.0%** | Sẵn sàng Gate 3 |
| T8 | Bảo vệ, Closure | Đã hoàn thành dự thảo Báo cáo tổng kết 10 chương PMBOK, Lessons Learned & Peer Review, Biên bản đóng dự án | **90.0%** | Sẵn sàng Bảo vệ đồ án |

---
*Phiên bản 1.2 — LV34-001 — MAN104 — Cập nhật 13/10/2026*
