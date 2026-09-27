# Quản lý Cơ sở Dữ liệu EVManager

Thư mục này chứa các tài liệu, kịch bản tạo bảng (DDL Schema) và dữ liệu mẫu (Seed Data) cho hệ thống **EVManager**.

## 1. Nền tảng & Công nghệ (Tech Stack)
* **Hệ quản trị CSDL:** PostgreSQL 16
* **ORM Framework:** Spring Data JPA + Hibernate (`PostgreSQLDialect`)
* **Công cụ Migration:** Flyway (tích hợp trong Backend)
* **Kiểu dữ liệu đặc trưng:** `TIMESTAMPTZ` (ngày giờ múi giờ), `NUMERIC(18,2)` (tiền tệ), `JSONB` (nhật ký hệ thống), `INET` (IP address).

---

## 2. Cấu trúc Thư mục

```text
database/
├── README.md              # Tài liệu hướng dẫn & tổng quan cơ sở dữ liệu
├── schema.sql             # DDL script tạo toàn bộ 13 bảng & ràng buộc (PostgreSQL)
└── seed.sql               # Script dữ liệu mẫu ban đầu (Roles, Admin, Services, Venues...)
```

> 📌 **Lưu ý triển khai trong Backend:**
> Các file script chính thức phục vụ tự động hóa migration (Flyway) được đặt tại:
> [`backend/src/main/resources/db/migration/`](file:///d:/EVManager/backend/src/main/resources/db/migration/)

---

## 3. Danh sách các Bảng trong Hệ thống (13 Bảng - 3NF)

| STT | Tên Bảng | Ý nghĩa Nghiệp vụ |
|:---:|---|---|
| 1 | `roles` | Danh mục vai trò người dùng (ADMIN, MANAGER, SALES, COORDINATOR, ACCOUNTANT) |
| 2 | `users` | Tài khoản người dùng nội bộ hệ thống |
| 3 | `customers` | Hồ sơ khách hàng đặt tiệc / sự kiện |
| 4 | `venues` | Danh mục sảnh tiệc & địa điểm tổ chức |
| 5 | `dishes` | Danh mục món ăn |
| 6 | `menus` | Danh mục thực đơn gói |
| 7 | `menu_dishes` | Bảng phụ trách liên kết Thực đơn - Món ăn (N-N) |
| 8 | `services` | Danh mục dịch vụ đi kèm (Âm thanh, Ánh sáng, Trang trí...) |
| 9 | `events` | Thông tin sự kiện / tiệc được tổ chức tại sảnh |
| 10 | `contracts` | Hợp đồng tổ chức sự kiện giữa Khách hàng & Nhà hàng |
| 11 | `contract_services` | Bảng liên kết Hợp đồng - Dịch vụ đi kèm (N-N) |
| 12 | `payments` | Lịch sử thanh toán & đặt cọc hợp đồng |
| 13 | `audit_logs` | Nhật ký ghi nhận các thao tác quan trọng trên hệ thống |

---

## 4. Tài liệu Thiết kế chi tiết
* 📖 **Từ điển dữ liệu (Data Dictionary):** [data-dictionary.md](file:///d:/EVManager/docs/design/data-dictionary.md)
* 📐 **Sơ đồ ERD (Logical DBML):** [erd-logical.dbml](file:///d:/EVManager/docs/design/erd-logical.dbml)
* 🔄 **Báo cáo chuẩn hóa 3NF:** [data-normalization.md](file:///d:/EVManager/docs/design/data-normalization.md)
