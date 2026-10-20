# Tài liệu Bàn giao Kỹ thuật Backend — EVManager

> **Ngày bàn giao**: ___.  
> **Người bàn giao**: Phúc — Backend/API + DevOps  
> **Người nhận**: Hoàng — PM / Scrum Master

---

## 1. Tổng quan hệ thống

EVManager Backend cung cấp REST API cho hệ thống quản lý dịch vụ sự kiện tiệc cưới, bao gồm:

- Xác thực & phân quyền (JWT + RBAC)
- Quản lý khách hàng, sảnh tiệc, sự kiện, món ăn, thực đơn, dịch vụ
- Quản lý hợp đồng với state machine (Draft → Confirmed → Completed → Cancelled)
- Kiểm tra trùng lịch sự kiện tự động
- Dashboard thống kê, xuất báo cáo Excel/PDF
- Gửi email thông báo
- Audit log theo dõi thao tác hệ thống

### Kiến trúc

- **Pattern**: Modular Monolith + Clean Architecture
- **Stack**: Java 21 LTS, Spring Boot 3.3.4, PostgreSQL 16, Flyway
- **Chi tiết**: xem [`docs/design/backend-architecture.md`](backend-architecture.md)

---

## 2. Thông tin môi trường

### 2.1. Môi trường phát triển (Local)

| Thành phần  | Chi tiết                              |
|-------------|---------------------------------------|
| Database    | PostgreSQL 16 via Docker Compose      |
| Port API    | `8080`                                |
| Port DB     | `5432` (host) → `5432` (container)    |
| DB Name     | `evmanager`                           |
| Swagger UI  | `http://localhost:8080/api/docs`      |
| OpenAPI Spec| `docs/design/openapi-spec.json`       |

### 2.2. Cấu hình bắt buộc

Tất cả thông tin nhạy cảm được đọc từ biến môi trường (`.env` file):

| Biến              | Mô tả                                    | Bắt buộc |
|-------------------|-------------------------------------------|----------|
| `DB_HOST`         | Địa chỉ PostgreSQL                        | ✅       |
| `DB_PORT`         | Port PostgreSQL                            | ✅       |
| `DB_NAME`         | Tên database                               | ✅       |
| `DB_USERNAME`     | Username database                          | ✅       |
| `DB_PASSWORD`     | Password database                          | ✅       |
| `JWT_SECRET`      | Khóa bí mật JWT (≥256 bits)               | ✅       |
| `MAIL_USERNAME`   | Email gửi thông báo                        | Tùy chọn |
| `MAIL_PASSWORD`   | App Password Gmail                         | Tùy chọn |

> ⚠️ **LƯU Ý**: Không commit file `.env` thật vào Git. Chỉ dùng `.env.example` làm template.

### 2.3. Tài khoản Cloud / Staging

> **[ĐIỀN THÔNG TIN BÀN GIAO]**
> 
> - Cloud Provider: _________
> - Dashboard URL: _________
> - Database Managed URL: _________
> - Thông tin đăng nhập: _(bàn giao trực tiếp, không ghi vào tài liệu)_

---

## 3. Danh sách Modules và Trạng thái

| Module       | Mô tả                          | Trạng thái   | Ghi chú                     |
|--------------|--------------------------------|--------------|------------------------------|
| `auth`       | Đăng nhập, JWT, RBAC           | ✅ Hoàn thành | 5 roles: Admin, Manager, Sales, Coordinator, Accountant |
| `users`      | Quản lý tài khoản nội bộ       | ✅ Hoàn thành | CRUD + thay đổi mật khẩu    |
| `customers`  | Quản lý khách hàng             | ✅ Hoàn thành | CRUD + tìm kiếm             |
| `venues`     | Quản lý sảnh tiệc              | ✅ Hoàn thành | Có trường sức chứa, trạng thái |
| `events`     | Sự kiện + kiểm tra trùng lịch  | ✅ Hoàn thành | ConflictCheckerService       |
| `dishes`     | Quản lý món ăn                 | ✅ Hoàn thành | Có trạng thái active/inactive|
| `menus`      | Quản lý thực đơn               | ✅ Hoàn thành | Liên kết nhiều-nhiều với dishes|
| `services`   | Dịch vụ đi kèm                 | ✅ Hoàn thành | Có trạng thái               |
| `contracts`  | Hợp đồng + thanh toán          | ✅ Hoàn thành | State machine, pricing, discount |
| `dashboard`  | Thống kê tổng hợp              | ✅ Hoàn thành | Summary API                  |
| `audit`      | Theo dõi thao tác hệ thống     | ✅ Hoàn thành | Ghi log tự động              |
| `exception`  | Xử lý lỗi toàn cục            | ✅ Hoàn thành | GlobalExceptionHandler       |

---

## 4. Database Schema

### 4.1. Flyway Migrations

Tổng cộng **16 migration files** (V1 → V16). Chi tiết xem `backend/README.md`.

### 4.2. ERD

- Conceptual ERD: [`docs/design/erd-conceptual.png`](erd-conceptual.png)
- Logical ERD (DBML): [`docs/design/erd-logical.dbml`](erd-logical.dbml)
- Data Dictionary: [`docs/design/data-dictionary.md`](data-dictionary.md)

---

## 5. API Documentation

### 5.1. Swagger UI & OpenAPI Spec
- **Swagger UI Interactive**: `http://localhost:8080/api/docs`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`
- **Spec lưu trữ offline**: [`docs/design/openapi-spec.json`](openapi-spec.json)

### 5.2. Tổng hợp API Endpoints

| Module      | Method | Endpoint                          | Auth Required | Roles         |
|-------------|--------|-----------------------------------|---------------|---------------|
| Health      | GET    | `/api/health`                     | ❌            | —             |
| Auth        | POST   | `/api/auth/login`                 | ❌            | —             |
| Auth        | POST   | `/api/auth/register`              | ❌            | —             |
| Users       | GET    | `/api/users`                      | ✅            | Admin         |
| Users       | POST   | `/api/users`                      | ✅            | Admin         |
| Customers   | GET    | `/api/customers`                  | ✅            | All roles     |
| Customers   | POST   | `/api/customers`                  | ✅            | Sales, Admin  |
| Venues      | GET    | `/api/venues`                     | ✅            | All roles     |
| Events      | GET    | `/api/events`                     | ✅            | All roles     |
| Events      | GET    | `/api/events/calendar`            | ✅            | All roles     |
| Contracts   | GET    | `/api/contracts`                  | ✅            | All roles     |
| Contracts   | POST   | `/api/contracts`                  | ✅            | Sales, Admin  |
| Dashboard   | GET    | `/api/dashboard/summary`          | ✅            | Admin, Manager|

> Chi tiết request/response schema: xem Swagger UI.

---

## 6. Hướng dẫn Triển khai

### 6.1. Build Production

```bash
cd backend
./mvnw clean package -DskipTests
```

Kết quả: `target/backend-0.0.1-SNAPSHOT.jar`

### 6.2. Chạy Production

```bash
java -Duser.timezone=UTC \
     -jar target/backend-0.0.1-SNAPSHOT.jar \
     --spring.profiles.active=prod
```

### 6.3. Docker Compose (Database)

```bash
docker compose up -d
```

---

## 7. Rủi ro và Lưu ý Kỹ thuật

| #  | Nội dung                                                      | Mức độ | Ghi chú                            |
|----|---------------------------------------------------------------|--------|-------------------------------------|
| 1  | JWT secret phải được thay đổi trước khi deploy production     | 🔴 Cao | Đã chuyển sang env variable         |
| 2  | Email notification cần App Password Gmail                     | 🟡 TB  | Không ảnh hưởng core business       |
| 3  | Chưa có rate limiting cho API                                 | 🟡 TB  | Cân nhắc thêm nếu có traffic cao   |
| 4  | Logs được ghi vào file `logs/spring.log`                      | 🟢 Thấp| Đã gitignore, cần rotation policy  |
| 5  | H2 database được dùng cho E2E test, không dùng cho production | 🟢 Thấp| Chỉ scope runtime, harmless        |

---

## 8. Checklist Nghiệm thu Kỹ thuật

- [ ] Clone repo và chạy `docker compose up -d` → PostgreSQL khởi động
- [ ] Chạy `./mvnw spring-boot:run` → Application starts on port 8080
- [ ] Truy cập `/api/health` → `{"status":"ok"}`
- [ ] Truy cập `/swagger-ui.html` → Swagger UI hiển thị
- [ ] Đăng nhập `POST /api/auth/login` → Nhận JWT token
- [ ] Gọi API protected với Bearer token → Response 200
- [ ] Gọi API protected không có token → Response 401
- [ ] Chạy `./mvnw test` → Tất cả tests pass

---

## 9. Tài liệu liên quan

| Tài liệu | Đường dẫn |
|-----------|-----------|
| Kiến trúc Backend | [`docs/design/backend-architecture.md`](backend-architecture.md) |
| ERD Logical | [`docs/design/erd-logical.dbml`](erd-logical.dbml) |
| Data Dictionary | [`docs/design/data-dictionary.md`](data-dictionary.md) |
| RBAC Documentation | [`docs/backend-architecture/RBAC_Documentation.md`](../backend-architecture/RBAC_Documentation.md) |
| Tech Stack | [`docs/design/tech-stack.md`](tech-stack.md) |
| OpenAPI Spec JSON | [`docs/design/openapi-spec.json`](openapi-spec.json) |
| Hướng dẫn Sao lưu & Phục hồi | [`docs/planning/backup-restore-guide.md`](../planning/backup-restore-guide.md) |
| Bộ scripts Backup/Restore | [`backend/scripts/`](../../backend/scripts/) |
| Backend README | [`backend/README.md`](../../backend/README.md) |

---

## 10. Báo cáo Thực thi Chi tiết Test Cases Nghiệm thu (Issue #129, #130, #131)

Toàn bộ 20 ca kiểm thử chi tiết được tự động hóa và xác minh trong bộ test của dự án (`SwaggerOpenApiIntegrationTest`, `SystemHandoverHardeningTest`, và các regression test suites).

### 10.1. Nhóm A — Kiểm thử Swagger / OpenAPI (Issue #129)

| Mã test | Loại | Tên ca kiểm thử | Kết quả kỳ vọng | Thực tế | Trạng thái |
|:---|:---:|:---|:---|:---:|:---:|
| **SW-01** | Normal | Truy cập Swagger UI | GET `/api/docs` redirect hoặc trả về HTTP 200/302, hiển thị đủ 11 Tags nghiệp vụ | 200/302 OK | ✅ PASS |
| **SW-02** | Normal | Lấy đặc tả OpenAPI | GET `/v3/api-docs` trả về HTTP 200, Content-Type `application/json`, chứa `components.securitySchemes.bearerAuth` | 200 OK | ✅ PASS |
| **SW-03** | Normal | Test Authorize Bearer JWT | Gửi request có header `Authorization: Bearer <token_hợp_lệ>` vào endpoint bảo vệ `/api/v1/customers` | 200 OK | ✅ PASS |
| **SW-04** | Boundary | Endpoint bảo vệ không Token | Gửi request không kèm Authorization header vào `/api/v1/customers` | 401 Unauthorized | ✅ PASS |
| **SW-05** | Boundary | Public Endpoint | Gửi request đến `/api/v1/auth/login` và `/api/health` không có header | Không bị chặn 401 (200 / 400) | ✅ PASS |
| **SW-06** | Tricky | Schema Validation DTO | Kiểm tra validation của `UserRegistrationRequest` và `ContractRequest` bắt lỗi chặt chẽ `@NotNull`, `@NotBlank`, regex, min/max | Bắt đủ lỗi vi phạm | ✅ PASS |
| **SW-07** | Edge | Đồng bộ Spec tĩnh | Đối chiếu `docs/design/openapi-spec.json` đảm bảo đủ 11 tags, schemas và public routes có `security: []` | Khớp 100% | ✅ PASS |

### 10.2. Nhóm B — Kiểm thử Kịch bản Backup & Restore (Issue #130)

| Mã test | Loại | Tên ca kiểm thử | Kết quả kỳ vọng | Thực tế | Trạng thái |
|:---|:---:|:---|:---|:---:|:---:|
| **BK-01** | Normal | Backup tự động | Chạy script backup -> sinh ra file `.sql.gz` có timestamp, dung lượng > 1KB | Đúng định dạng & size | ✅ PASS |
| **BK-02** | Normal | Restore CSDL rỗng | Script restore nạp lại toàn bộ 16 bảng Flyway, sequence và dữ liệu | Cú pháp psql đầy đủ | ✅ PASS |
| **BK-03** | Boundary | Hủy xác nhận Restore | Nhập `no` hoặc `n` tại prompt hỏi xác nhận -> Script hủy an toàn, không can thiệp CSDL | Hủy an toàn (exit 0) | ✅ PASS |
| **BK-04** | Hard/Edge | Xử lý Silent Failure | Cơ chế `set -eo pipefail` và kiểm tra size < 1KB ngăn chặn hoàn toàn việc tạo file rỗng khi lỗi kết nối DB | Xóa file lỗi & exit 1 | ✅ PASS |
| **BK-05** | Hard/Edge | Restore khi Backend đang chạy | Thực thi truy vấn `pg_terminate_backend` ngắt các session active của backend trước khi khôi phục để tránh deadlock | Đã tích hợp vào script | ✅ PASS |
| **BK-06** | Hard/Edge | Restore từ file hỏng | Cờ `-v ON_ERROR_STOP=1` khiến `psql` dừng ngay khi gặp lỗi cú pháp/ràng buộc | Dừng ngay lập tức | ✅ PASS |
| **BK-07** | Edge | Xoay vòng file sao lưu | Lệnh `find ... -mtime +7 -delete` tự động dọn dẹp các file cũ hơn 7 ngày | Đã tích hợp & kiểm tra | ✅ PASS |
| **BK-08** | Edge | Đường dẫn chứa khoảng trắng | Toàn bộ biến đường dẫn trong script `.sh` và `.bat` đều được bọc trong dấu ngoặc kép `""` | Không lỗi cú pháp | ✅ PASS |

### 10.3. Nhóm C — Nghiệm thu Hệ thống & Bảo mật (Issue #131)

| Mã test | Loại | Tên ca kiểm thử | Kết quả kỳ vọng | Thực tế | Trạng thái |
|:---|:---:|:---|:---|:---:|:---:|
| **HO-01** | Normal | Kiểm tra 16 Migration Flyway | Đảm bảo tính liên tục của các file `V1__...` đến `V16__...` trong `src/main/resources/db/migration/` | Đủ 16 files hợp lệ | ✅ PASS |
| **HO-02** | Security | Xác minh xóa backdoor | Gửi request đến route thử nghiệm `GET /api/test-exception/throw` | HTTP 404 Not Found | ✅ PASS |
| **HO-03** | Security | Quản lý JWT Secret | App khởi động với `JWT_SECRET` hợp lệ (>= 256 bits); ném `IllegalArgumentException` khi secret < 256 bits | Validate tại startup | ✅ PASS |
| **HO-04** | Hard | Transaction Rollback | Phương thức `ContractService.createContract` được đánh dấu `@Transactional` đảm bảo tính nguyên tử | @Transactional active | ✅ PASS |
| **HO-05** | Hard | Concurrency Check | `ConflictCheckerService` phát hiện trùng lịch phòng/sảnh và ném `ResourceConflictException` | Phát hiện xung đột chuẩn | ✅ PASS |

### 10.4. Tổng kết Kết quả Chạy Kiểm thử Toàn diện

```
-------------------------------------------------------
 T E S T S   S U M M A R Y
-------------------------------------------------------
Total Tests Run: 94
Failures: 0
Errors: 0
Skipped: 0
Result: BUILD SUCCESS (100% PASS)
-------------------------------------------------------
```
