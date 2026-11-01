# Decision Log

Ghi các quyết định kỹ thuật hoặc nghiệp vụ đã được con người xác nhận. Không sửa nội dung quyết định cũ để phản ánh quyết định mới; thêm dòng mới và tham chiếu ID bị thay thế khi cần.

| ID | Ngày | Quyết định | Lý do | Người xác nhận | Ảnh hưởng |
|---|---|---|---|---|---|
| ADR-001 | 2026-09-13 | Sử dụng React + Node.js/Express + TypeScript + Prisma + PostgreSQL | Thống nhất TypeScript giữa Frontend và Backend, dễ tích hợp API và phù hợp thời gian dự án | Cả nhóm | Frontend, Backend, Database, Testing và DevOps |
| ADR-002 | 2026-09-14 | Thay thế Backend trong ADR-001 bằng Java 21 LTS + Spring Boot + Spring Data JPA/Hibernate + Flyway + PostgreSQL; Frontend tiếp tục dùng React + TypeScript | Nhóm đã xác nhận lại Tech Stack chính thức; nội dung Node.js/Express/Prisma không còn được áp dụng | Cả nhóm | Backend, Database, Testing, DevOps và tích hợp Frontend |
| ADR-003 | 2026-10-04 | Phê duyệt Yêu cầu thay đổi CR-01 sau Demo giữa kỳ: Chuẩn hóa 4 role RBAC (`ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`), tách giao diện theo vai trò, triển khai Contract Wizard 3 bước có lưu Snapshot giá và ràng buộc cọc tối thiểu 30% | Tiếp thu góp ý của Hội đồng đánh giá giữa kỳ 50%, khắc phục triệt để lệch pha giữa đặc tả BA và mã nguồn thực tế | Hoàng (PM) & Cả nhóm | Database (Flyway V10, V13–V15), Backend (Auth, RBAC, Contracts, Dashboard), Frontend và Testing |
| ADR-004 | 2026-10-05 | Phê duyệt chính sách tính giá & ưu đãi CR-02 (Chiết khấu % trước, trừ Voucher sau, cộng Phí phục vụ 5% và VAT 8%) và áp dụng khóa bi quan (`PESSIMISTIC_WRITE`) khi đặt giữ sảnh | Đảm bảo tính nhất quán doanh thu hợp đồng (Fix BUG-03) và ngăn chặn xung đột đồng thời khi 2 Sales đặt cùng sảnh cùng giây (Fix BUG-04) | Hoàng (PM), Hiển (BA), Phúc (BE), Hậu (QA) | Phân hệ Events, Venues, Contracts, Pricing Calculator và bộ kiểm thử tích hợp |

## Quy ước ghi nhận

- ID tăng tuần tự theo dạng `ADR-NNN`.
- Ngày dùng định dạng `YYYY-MM-DD` và là ngày quyết định được xác nhận.
- Ghi rõ người xác nhận và phạm vi ảnh hưởng.
- Nếu quyết định bị thay thế, thêm quyết định mới và nêu ID quyết định trước trong phần “Lý do”.
