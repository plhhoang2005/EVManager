# Decision Log

Ghi các quyết định kỹ thuật hoặc nghiệp vụ đã được con người xác nhận. Không sửa nội dung quyết định cũ để phản ánh quyết định mới; thêm dòng mới và tham chiếu ID bị thay thế khi cần.

| ID | Ngày | Quyết định | Lý do | Người xác nhận | Ảnh hưởng |
|---|---|---|---|---|---|
| ADR-001 | 2026-09-13 | Sử dụng React + Node.js/Express + TypeScript + Prisma + PostgreSQL | Thống nhất TypeScript giữa Frontend và Backend, dễ tích hợp API và phù hợp thời gian dự án | Cả nhóm | Frontend, Backend, Database, Testing và DevOps |
| ADR-002 | 2026-09-14 | Thay thế Backend trong ADR-001 bằng Java 21 LTS + Spring Boot + Spring Data JPA/Hibernate + Flyway + PostgreSQL; Frontend tiếp tục dùng React + TypeScript | Nhóm đã xác nhận lại Tech Stack chính thức; nội dung Node.js/Express/Prisma không còn được áp dụng | Cả nhóm | Backend, Database, Testing, DevOps và tích hợp Frontend |

## Quy ước ghi nhận

- ID tăng tuần tự theo dạng `ADR-NNN`.
- Ngày dùng định dạng `YYYY-MM-DD` và là ngày quyết định được xác nhận.
- Ghi rõ người xác nhận và phạm vi ảnh hưởng.
- Nếu quyết định bị thay thế, thêm quyết định mới và nêu ID quyết định trước trong phần “Lý do”.
