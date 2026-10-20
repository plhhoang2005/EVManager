# EVManager Backend

> LV34-001 — REST API và Business Logic cho hệ thống quản lý dịch vụ sự kiện

## Yêu cầu môi trường

| Công cụ       | Phiên bản      | Ghi chú                       |
|---------------|----------------|-------------------------------|
| **Java JDK**  | 21 LTS         | Khuyến nghị OpenJDK / Temurin |
| **Maven**     | 3.9+           | Hoặc dùng `./mvnw` trong repo |
| **Docker**    | 24+            | Cần cho PostgreSQL container  |
| **PostgreSQL**| 16             | Tự động khởi tạo qua Docker   |

## Tech Stack

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21 LTS
- **Database**: PostgreSQL 16 + Flyway migration
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT (jjwt 0.12.6)
- **Validation**: Jakarta Bean Validation
- **API Docs**: Springdoc OpenAPI (Swagger UI)
- **Email**: Spring Boot Mail (SMTP)
- **Build**: Maven
- **Testing**: JUnit 5 + Mockito + Spring Security Test
- **Logging**: SLF4J + Logback

## Cài đặt và Chạy

### 1. Clone và cấu hình biến môi trường

```bash
git clone https://github.com/plhhoang2005/EVManager.git
cd EVManager/backend
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin thực tế:

| Biến            | Mô tả                                      | Giá trị mặc định           |
|-----------------|---------------------------------------------|-----------------------------|
| `DB_HOST`       | Địa chỉ PostgreSQL                          | `localhost`                 |
| `DB_PORT`       | Port PostgreSQL (host-side)                  | `5432`                      |
| `DB_NAME`       | Tên database                                | `evmanager`                 |
| `DB_USERNAME`   | Username PostgreSQL                          | `postgres`                  |
| `DB_PASSWORD`   | Password PostgreSQL                          | `postgres`                  |
| `JWT_SECRET`    | Khóa bí mật JWT (≥256 bits, Base64)          | *(bắt buộc thay đổi)*      |
| `MAIL_USERNAME` | Email gửi thông báo (Gmail)                  | *(tùy chọn)*               |
| `MAIL_PASSWORD` | App Password của Gmail                       | *(tùy chọn)*               |

### 2. Khởi động PostgreSQL

```bash
docker compose up -d
```

Lệnh này tạo container PostgreSQL 16 với volume persistent `evmanager_pgdata`.

### 3. Chạy Migration & Khởi động ứng dụng

```bash
./mvnw spring-boot:run
```

Flyway tự động chạy migration khi ứng dụng khởi động. Database schema được tạo từ 16 file migration trong `src/main/resources/db/migration/`.

### 4. Kiểm tra

Truy cập health check:
```
GET http://localhost:8080/api/health
→ {"status": "ok"}
```

Swagger UI (Interactive API Docs):
```
http://localhost:8080/api/docs
```
OpenAPI 3.0 Spec file: `docs/design/openapi-spec.json`

## Flyway Database Migration

Migration files nằm trong `src/main/resources/db/migration/` và được chạy tự động:

| File | Mô tả |
|------|--------|
| `V1__init.sql` | Khởi tạo schema ban đầu |
| `V2__create_users_and_roles.sql` | Bảng users và roles |
| `V3__update_admin_password.sql` | Cập nhật password admin |
| `V4__add_test_user.sql` | Thêm user test |
| `V5__create_customers_table.sql` | Bảng khách hàng |
| `V6__create_audit_logs_table.sql` | Bảng audit log |
| `V7__create_venues_events_contracts_schema.sql` | Sảnh, sự kiện, hợp đồng |
| `V8__seed_demo_data.sql` | Dữ liệu demo |
| `V9__seed_demo_customers_venues.sql` | Demo khách hàng & sảnh |
| `V10__add_system_roles_and_demo_seed.sql` | Roles hệ thống |
| `V11__seed_demo_accounts.sql` | Tài khoản demo |
| `V12__create_otp_tokens_table.sql` | Bảng OTP |
| `V13__add_deposit_amount_to_contracts.sql` | Trường đặt cọc |
| `V14__seed_demo_events.sql` | Sự kiện demo |
| `V15__fix_contract_menu_schema.sql` | Sửa schema menu hợp đồng |
| `V16__add_pricing_discount_fields_to_contracts.sql` | Trường chiết khấu |

> **Lưu ý**: Không sửa file migration đã có. Khi cần thay đổi schema, tạo file mới `V17__mota.sql`.

## Cấu trúc dự án

```
backend/
├── pom.xml                          # Maven dependencies
├── docker-compose.yml               # PostgreSQL container
├── .env.example                     # Template biến môi trường
├── src/
│   ├── main/
│   │   ├── java/com/evmanager/
│   │   │   ├── EvmanagerApplication.java   # Entry point
│   │   │   ├── config/                      # Security, Swagger, WebMvc config
│   │   │   ├── exception/                   # Global exception handler
│   │   │   ├── controller/                  # Health check endpoint
│   │   │   ├── audit/                       # Audit log module
│   │   │   ├── auth/                        # Đăng nhập, JWT, RBAC
│   │   │   ├── users/                       # Quản lý tài khoản nhân viên
│   │   │   ├── customers/                   # Quản lý khách hàng
│   │   │   ├── venues/                      # Quản lý sảnh tiệc
│   │   │   ├── events/                      # Quản lý sự kiện & kiểm tra trùng lịch
│   │   │   ├── dishes/                      # Quản lý món ăn
│   │   │   ├── menus/                       # Quản lý thực đơn
│   │   │   ├── services/                    # Quản lý dịch vụ đi kèm
│   │   │   ├── contracts/                   # Hợp đồng & thanh toán
│   │   │   └── dashboard/                   # Thống kê & báo cáo
│   │   └── resources/
│   │       ├── application.yml              # Cấu hình chính
│   │       ├── application-e2e.yml          # Cấu hình test E2E (H2)
│   │       └── db/migration/               # Flyway migration files
│   └── test/                                # Unit & integration tests
└── logs/                                    # Log files (gitignored)
```

## Kiến trúc

Backend áp dụng **Modular Monolith** kết hợp **Clean Architecture**:

```
Controller → Service → Repository → JPA/Hibernate → PostgreSQL
```

Mỗi module (auth, users, customers, ...) có cấu trúc riêng:
- `controller/` — Tiếp nhận request, trả response
- `service/` — Business logic
- `repository/` — Data access (Spring Data JPA)
- `model/` hoặc `entity/` — JPA entities
- `dto/` — Data Transfer Objects

Chi tiết kiến trúc: xem [backend-architecture.md](../docs/design/backend-architecture.md).

## API Endpoints chính

| Module      | Method | Endpoint                     | Mô tả                    |
|-------------|--------|------------------------------|---------------------------|
| Health      | GET    | `/api/health`                | Kiểm tra server           |
| Auth        | POST   | `/api/v1/auth/login`         | Đăng nhập                 |
| Auth        | POST   | `/api/v1/auth/register`      | Đăng ký                   |
| Users       | GET    | `/api/v1/users`              | Danh sách người dùng      |
| Customers   | GET    | `/api/v1/customers`          | Danh sách khách hàng      |
| Venues      | GET    | `/api/v1/venues`             | Danh sách sảnh            |
| Venues      | GET    | `/api/v1/venues/available`   | Kiểm tra sảnh trống       |
| Events      | GET    | `/api/v1/events`             | Danh sách sự kiện         |
| Events      | GET    | `/api/v1/events/calendar`    | Lịch sự kiện              |
| Dishes      | GET    | `/api/v1/dishes`             | Danh sách món ăn          |
| Menus       | GET    | `/api/v1/menus`              | Danh sách thực đơn        |
| Services    | GET    | `/api/v1/services`           | Danh sách dịch vụ         |
| Contracts   | GET    | `/api/v1/contracts`          | Danh sách hợp đồng        |
| Audit Logs  | GET    | `/api/v1/audit-logs`         | Lịch sử kiểm toán hệ thống|

> Danh sách đầy đủ với request/response schema: truy cập **Swagger UI** tại `/api/docs` hoặc xem file đặc tả [docs/design/openapi-spec.json](../docs/design/openapi-spec.json).

## Chạy Tests

```bash
# Chạy toàn bộ test
./mvnw test

# Chạy test cho một module cụ thể
./mvnw test -Dtest="ContractServiceTest"
```

## Build Production

```bash
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Sao lưu & Phục hồi CSDL (Backup & Restore)

Hệ thống cung cấp sẵn các kịch bản sao lưu nén tự động (`pg_dump`) và phục hồi trong thư mục `scripts/`:

- **Linux / Docker**:
  ```bash
  # Sao lưu CSDL ra file .sql.gz có gắn timestamp:
  ./scripts/backup.sh
  
  # Phục hồi CSDL từ bản sao lưu:
  ./scripts/restore.sh ../backups/evmanager_backup_YYYYMMDD_HHMMSS.sql.gz
  ```
- **Windows**:
  ```cmd
  scripts\backup.bat
  scripts\restore.bat ..\backups\evmanager_backup_YYYYMMDD_HHMMSS.sql
  ```
- Chi tiết quy trình vận hành và thiết lập lịch tự động: xem [backup-restore-guide.md](../docs/planning/backup-restore-guide.md).

## Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|-----|-------------|----------------|
| `Connection refused` | PostgreSQL chưa chạy | `docker compose up -d` |
| `Flyway migration failed` | Conflict migration | Kiểm tra `flyway_schema_history` |
| `JWT token invalid` | Secret key sai | Kiểm tra `JWT_SECRET` trong `.env` |
| `Port 8080 already in use` | Port bị chiếm | Tắt process khác hoặc đổi port |
