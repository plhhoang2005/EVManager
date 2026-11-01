# Bảng mô tả chi tiết các bảng dữ liệu — EVManager

## 1. Quy tắc đặt tên và chuẩn dữ liệu (PostgreSQL 16)

Hệ thống sử dụng thống nhất quy tắc `snake_case` cho tên bảng và tên cột:
- Tên cột viết thường hoàn toàn, các từ nối bằng ký tự `_`.
- Khóa chính (PK) đặt theo dạng `<table>_id`, ví dụ `user_id`, `event_id`, `contract_id`.
- Định danh Khóa chính (PK) tự tăng dùng kiểu `BIGINT GENERATED ALWAYS AS IDENTITY` (hoặc `BIGSERIAL`) theo chuẩn PostgreSQL 16.
- Khóa ngoại (FK) sử dụng đúng tên của khóa chính mà nó tham chiếu. Tất cả các thao tác cập nhật khóa chính dùng quy tắc `ON UPDATE RESTRICT` để bảo đảm tính toàn vẹn định danh.
- Không dùng khoảng trắng, ký tự đặc biệt hoặc cách viết hoa/thường không đồng nhất.
- Các trường thời gian điểm (instant) dùng kiểu `TIMESTAMPTZ` (Timestamp with time zone - múi giờ UTC+7), các trường ngày dùng kiểu `DATE`.
- Các trường tiền tệ dùng kiểu `DECIMAL(18,2)`, tuyệt đối không dùng `FLOAT` hoặc `DOUBLE` để tránh sai số tính toán tài chính.
- Các trường lưu lịch sử thay đổi cấu trúc/payload dùng kiểu `JSONB`, trường lưu địa chỉ mạng dùng kiểu `INET`.

---

## 2. Mô tả chi tiết từng bảng dữ liệu

### 2.1. Roles (Danh mục Vai trò & Phân quyền)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `role_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của vai trò. |
| `role_name` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên vai trò (ví dụ: ADMIN, MANAGER, SALES, COORDINATOR, ACCOUNTANT). |
| `description` | `VARCHAR(255)` | NULL | Mô tả chức năng và phạm vi quyền của vai trò. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái vai trò (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo vai trò. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật vai trò gần nhất. |

- **CHECK**: `role_name <> ''`, `status IN ('ACTIVE', 'INACTIVE')`.

---

### 2.2. Users (Người dùng nội bộ / Tài khoản hệ thống)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `user_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của tài khoản người dùng. |
| `role_id` | `BIGINT` | FK, NOT NULL | Vai trò của người dùng, tham chiếu `Roles.role_id`. |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên đăng nhập của người dùng. |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Mật khẩu đã được mã hóa/hash, không lưu dạng rõ (plain text). |
| `full_name` | `VARCHAR(100)` | NOT NULL | Họ và tên người sử dụng hệ thống. |
| `email` | `VARCHAR(100)` | NULL, UNIQUE | Email đăng nhập/liên hệ, không được trùng. |
| `phone` | `VARCHAR(20)` | NULL | Số điện thoại người dùng. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái tài khoản (ACTIVE, LOCKED, INACTIVE). |
| `last_login_at` | `TIMESTAMPTZ` | NULL | Thời điểm đăng nhập gần nhất. |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo tài khoản. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật tài khoản gần nhất. |

- **CHECK**: `username <> ''`, `status IN ('ACTIVE', 'LOCKED', 'INACTIVE')`.
- **FK**: `Users.role_id → Roles.role_id` — ON DELETE RESTRICT, ON UPDATE RESTRICT.

---

### 2.3. Customers (Khách hàng)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `customer_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của khách hàng. |
| `full_name` | `VARCHAR(100)` | NOT NULL | Họ tên khách hàng. |
| `phone` | `VARCHAR(20)` | NULL | Số điện thoại liên hệ. |
| `email` | `VARCHAR(100)` | NULL | Email khách hàng nếu có. |
| `address` | `VARCHAR(255)` | NULL | Địa chỉ liên hệ của khách hàng. |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hồ sơ khách hàng. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật hồ sơ khách hàng. |

- **CHECK**: `full_name <> ''`, `phone IS NOT NULL OR email IS NOT NULL`.

---

### 2.4. Venues (Địa điểm / Sảnh tổ chức sự kiện)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `venue_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của sảnh/địa điểm. |
| `venue_name` | `VARCHAR(100)` | NOT NULL | Tên địa điểm/sảnh tổ chức. |
| `address` | `VARCHAR(255)` | NOT NULL | Địa chỉ cụ thể của địa điểm. |
| `min_capacity` | `INT` | NOT NULL, DEFAULT 0 | Số khách tối thiểu sảnh có thể phục vụ. |
| `max_capacity` | `INT` | NOT NULL | Số khách tối đa sảnh có thể phục vụ. |
| `rental_price` | `DECIMAL(18,2)` | NOT NULL | Giá thuê địa điểm/sảnh. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'AVAILABLE' | Trạng thái sử dụng (AVAILABLE, MAINTENANCE, INACTIVE). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo sảnh. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật sảnh. |

- **CHECK**: `min_capacity >= 0`, `max_capacity >= min_capacity`, `rental_price >= 0`, `status IN ('AVAILABLE', 'MAINTENANCE', 'INACTIVE')`.

---

### 2.5. Menus (Danh mục Thực đơn)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `menu_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh thực đơn. |
| `menu_name` | `VARCHAR(100)` | NOT NULL, UNIQUE | Tên thực đơn/gói món ăn. |
| `price` | `DECIMAL(18,2)` | NOT NULL | Giá danh mục hiện hành cho một bàn/gói thực đơn. |
| `description` | `TEXT` | NULL | Mô tả nội dung thực đơn. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái sử dụng của thực đơn (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo thực đơn. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật thực đơn. |

- **CHECK**: `price >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.
- **Lưu ý Chuẩn hóa 2NF/3NF**: Quan hệ giữa `Menus` và `Dishes` là quan hệ Nhiều–Nhiều (N–N) và được tách thông qua bảng liên kết `MenuDishes` (Mục 2.7) để một món ăn có thể nằm trong nhiều thực đơn khác nhau.

---

### 2.6. Dishes (Danh mục Món ăn)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `dish_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của món ăn. |
| `dish_name` | `VARCHAR(100)` | NOT NULL | Tên món ăn (ví dụ: Súp hải sản, Gà quay...). |
| `category` | `VARCHAR(50)` | NOT NULL | Nhóm món ăn: khai vị, món chính, tráng miệng, đồ uống... |
| `price` | `DECIMAL(18,2)` | NOT NULL | Đơn giá tham khảo của món ăn. |
| `description` | `TEXT` | NULL | Mô tả chi tiết thành phần/món ăn. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái món ăn (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo món ăn. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật món ăn. |

- **CHECK**: `price >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.

---

### 2.7. MenuDishes (Bảng liên kết Thực đơn — Món ăn [Chuẩn hóa N–N])

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `menu_id` | `BIGINT` | PK, FK, NOT NULL | Mã thực đơn, tham chiếu `Menus.menu_id`. |
| `dish_id` | `BIGINT` | PK, FK, NOT NULL | Mã món ăn, tham chiếu `Dishes.dish_id`. |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Số lượng món ăn trong cấu trúc thực đơn. |
| `note` | `VARCHAR(255)` | NULL | Ghi chú cụ thể cho món ăn trong thực đơn đó. |

- **PK ghép**: (`menu_id`, `dish_id`).
- **CHECK**: `quantity > 0`.
- **FK**: `menu_id → Menus.menu_id` (ON DELETE CASCADE, ON UPDATE RESTRICT), `dish_id → Dishes.dish_id` (ON DELETE RESTRICT, ON UPDATE RESTRICT).

---

### 2.8. Services (Danh mục Dịch vụ bổ sung)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `service_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh dịch vụ. |
| `service_name` | `VARCHAR(100)` | NOT NULL, UNIQUE | Tên dịch vụ: trang trí sảnh, âm thanh, ánh sáng, MC... |
| `unit_price` | `DECIMAL(18,2)` | NOT NULL | Đơn giá niêm yết hiện hành của dịch vụ. |
| `description` | `TEXT` | NULL | Mô tả phạm vi chi tiết của dịch vụ. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái dịch vụ (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo dịch vụ. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật dịch vụ. |

- **CHECK**: `unit_price >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.
- **Lưu ý Chuẩn hóa 2NF/3NF**: Danh mục `Services` lưu giá niêm yết chuẩn. Khi dịch vụ được đặt cho hợp đồng/sự kiện, thông tin và giá thỏa thuận được lưu tại bảng liên kết `ContractServices` (Mục 2.11).

---

### 2.9. Events (Sự kiện)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `event_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh sự kiện. |
| `venue_id` | `BIGINT` | FK, NOT NULL | Địa điểm/sảnh tổ chức, tham chiếu `Venues.venue_id`. |
| `event_name` | `VARCHAR(100)` | NOT NULL | Tên sự kiện (ví dụ: Tiệc cưới Anh A & Chị B...). |
| `start_at` | `TIMESTAMPTZ` | NOT NULL | Thời gian bắt đầu tổ chức sự kiện. |
| `end_at` | `TIMESTAMPTZ` | NOT NULL | Thời gian kết thúc sự kiện. |
| `guest_count` | `INT` | NOT NULL | Số lượng khách dự kiến hoặc thực tế. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'SCHEDULED' | Trạng thái sự kiện (SCHEDULED, PREPARING, IN_PROGRESS, COMPLETED, CANCELLED). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo bản ghi sự kiện. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật sự kiện. |

- **CHECK**: `guest_count > 0`, `end_at > start_at`, `status IN ('SCHEDULED', 'PREPARING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`.
- **FK**: `venue_id → Venues.venue_id` — ON DELETE RESTRICT, ON UPDATE RESTRICT.

---

### 2.10. Contracts (Hợp đồng)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `contract_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của hợp đồng. |
| `customer_id` | `BIGINT` | FK, NOT NULL | Khách hàng đứng tên hợp đồng, tham chiếu `Customers.customer_id`. |
| `event_id` | `BIGINT` | FK, NULL, UNIQUE | Sự kiện thuộc hợp đồng (mỗi sự kiện tối đa 1 hợp đồng). |
| `menu_id` | `BIGINT` | FK, NULL | Thực đơn được chọn cho hợp đồng, tham chiếu `Menus.menu_id`. |
| `contract_code` | `VARCHAR(50)` | NOT NULL, UNIQUE | Số/Mã hợp đồng theo format tra cứu (HD-YYYYMMDD-XXX). |
| `contract_date` | `DATE` | NOT NULL | Ngày lập hoặc ký hợp đồng. |
| `total_amount` | `DECIMAL(18,2)` | NOT NULL | Tổng giá trị hợp đồng đã thỏa thuận (Price Snapshot). |
| `deposit_amount` | `DECIMAL(18,2)` | NOT NULL, DEFAULT 0 | Số tiền đặt cọc thỏa thuận tối thiểu (30% giá trị hợp đồng). |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'DRAFT' | Trạng thái hợp đồng (DRAFT, PENDING_CONFIRMATION, CONFIRMED, COMPLETED, CANCELLED). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hợp đồng. |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật hợp đồng. |

- **CHECK**: `total_amount >= 0`, `deposit_amount >= 0`, `status IN ('DRAFT', 'PENDING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`.
- **FK**: `customer_id → Customers.customer_id`, `event_id → Events.event_id`, `menu_id → Menus.menu_id` — ON DELETE RESTRICT, ON UPDATE RESTRICT.

---

### 2.11. ContractServices (Bảng liên kết Hợp đồng — Dịch vụ [Chuẩn hóa N–N & Snapshot Giá])

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `contract_id` | `BIGINT` | PK, FK, NOT NULL | Mã hợp đồng, tham chiếu `Contracts.contract_id`. |
| `service_id` | `BIGINT` | PK, FK, NOT NULL | Mã dịch vụ, tham chiếu `Services.service_id`. |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Số lượng dịch vụ được chọn cho hợp đồng này. |
| `agreed_unit_price` | `DECIMAL(18,2)` | NOT NULL | Giá dịch vụ đã chốt tại thời điểm xác nhận hợp đồng (Price Snapshot). |
| `note` | `VARCHAR(255)` | NULL | Ghi chú yêu cầu riêng cho dịch vụ trong hợp đồng. |

- **PK ghép**: (`contract_id`, `service_id`).
- **CHECK**: `quantity > 0`, `agreed_unit_price >= 0`.
- **FK**: `contract_id → Contracts.contract_id` (ON DELETE CASCADE, ON UPDATE RESTRICT), `service_id → Services.service_id` (ON DELETE RESTRICT, ON UPDATE RESTRICT).

---

### 2.12. Payments (Giao dịch Thanh toán)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `payment_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh duy nhất của giao dịch thanh toán. |
| `contract_id` | `BIGINT` | FK, NOT NULL | Hợp đồng được thanh toán, tham chiếu `Contracts.contract_id`. |
| `external_reference` | `VARCHAR(100)` | NULL, UNIQUE | Mã tham chiếu giao dịch cổng thanh toán hoặc mã idempotency. |
| `payment_type` | `VARCHAR(30)` | NOT NULL | Loại thanh toán (DEPOSIT, INSTALLMENT, FINAL, REFUND). |
| `amount` | `DECIMAL(18,2)` | NOT NULL | Số tiền thanh toán thực tế của giao dịch. |
| `payment_date` | `TIMESTAMPTZ` | NOT NULL | Thời điểm ghi nhận giao dịch thanh toán. |
| `payment_method` | `VARCHAR(50)` | NOT NULL | Phương thức thanh toán (Tiền mặt, Chuyển khoản, Cổng thanh toán...). |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'PENDING' | Trạng thái giao dịch (PENDING, SUCCESS, FAILED, REFUNDED). |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo bản ghi thanh toán. |

- **CHECK**: `amount > 0`, `status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')`.
- **FK**: `Payments.contract_id → Contracts.contract_id` — ON DELETE RESTRICT, ON UPDATE RESTRICT.

---

### 2.13. AuditLogs (Nhật ký truy vết & Kiểm toán hệ thống)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `audit_log_id` | `BIGINT` | PK, GENERATED ALWAYS AS IDENTITY | Mã định danh bản ghi nhật ký kiểm toán. |
| `user_id` | `BIGINT` | FK, NULL | Người dùng thực hiện thao tác, tham chiếu `Users.user_id`. |
| `action` | `VARCHAR(100)` | NOT NULL | Hành động thực hiện: CREATE, UPDATE, DELETE, LOGIN... |
| `entity_type` | `VARCHAR(100)` | NOT NULL | Loại đối tượng/bảng bị tác động (ví dụ: Contracts, Payments). |
| `entity_id` | `VARCHAR(100)` | NOT NULL | Định danh (ID) của bản ghi bị tác động. |
| `old_values` | `JSONB` | NULL | Dữ liệu cũ trước khi thay đổi (dạng JSONB). |
| `new_values` | `JSONB` | NULL | Dữ liệu mới sau khi thay đổi (dạng JSONB). |
| `ip_address` | `INET` | NULL | Địa chỉ IP của thiết bị thực hiện thao tác (kiểu INET PostgreSQL). |
| `occurred_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm ghi nhận log thao tác. |

- **CHECK**: `action <> ''`, `entity_type <> ''`.
- **FK**: `AuditLogs.user_id → Users.user_id` — ON DELETE RESTRICT, ON UPDATE RESTRICT.

---

## 3. Tổng hợp Bảng Khóa chính (PK) và Khóa ngoại (FK)

| Bảng | Khóa chính (PK) | Khóa ngoại (FK) & Tham chiếu | Hành vi toàn vẹn tham chiếu |
|---|---|---|---|
| **Roles** | `role_id` | — | — |
| **Users** | `user_id` | `role_id → Roles.role_id` | ON DELETE RESTRICT, ON UPDATE RESTRICT |
| **Customers** | `customer_id` | — | — |
| **Venues** | `venue_id` | — | — |
| **Menus** | `menu_id` | — | — |
| **Dishes** | `dish_id` | — | — |
| **MenuDishes** | (`menu_id`, `dish_id`) | `menu_id → Menus.menu_id`<br>`dish_id → Dishes.dish_id` | ON DELETE CASCADE (Menus), RESTRICT (Dishes)<br>ON UPDATE RESTRICT |
| **Services** | `service_id` | — | — |
| **Events** | `event_id` | `venue_id → Venues.venue_id` | ON DELETE RESTRICT, ON UPDATE RESTRICT |
| **Contracts** | `contract_id` | `customer_id → Customers.customer_id`<br>`event_id → Events.event_id`<br>`menu_id → Menus.menu_id` | ON DELETE RESTRICT, ON UPDATE RESTRICT |
| **ContractServices** | (`contract_id`, `service_id`) | `contract_id → Contracts.contract_id`<br>`service_id → Services.service_id` | ON DELETE CASCADE (Contracts), RESTRICT (Services)<br>ON UPDATE RESTRICT |
| **Payments** | `payment_id` | `contract_id → Contracts.contract_id` | ON DELETE RESTRICT, ON UPDATE RESTRICT |
| **AuditLogs** | `audit_log_id` | `user_id → Users.user_id` | ON DELETE RESTRICT, ON UPDATE RESTRICT |

---

## 4. Lưu ý Nghiệp vụ & Giải trình Chuẩn hóa Database EVManager

> [!NOTE]
> **Các điểm lưu ý chuẩn hóa 1NF / 2NF / 3NF giải trình cho đồ án:**
> 1. **Đồng bộ với DBML và PostgreSQL 16**: Tất cả các trường ID sử dụng `BIGINT GENERATED ALWAYS AS IDENTITY`, kiểu thời gian dùng `TIMESTAMPTZ`, kiểu dữ liệu audit dùng `JSONB` và `INET`. Tất cả hành vi `ON UPDATE` đều tuân theo quy tắc `RESTRICT` vì ID là immutable.
> 2. **11 Thực thể cốt lõi vs 2 Bảng liên kết**: Hệ thống phục vụ 11 thực thể nghiệp vụ cốt lõi (`Roles`, `Users`, `Customers`, `Venues`, `Dishes`, `Menus`, `Services`, `Events`, `Contracts`, `Payments`, `AuditLogs`). Hai bảng liên kết `MenuDishes` và `ContractServices` được bổ sung để biểu diễn kỹ thuật cho các quan hệ N–N.
> 3. **Chuẩn hóa 2NF cho Thực đơn & Món ăn**: Việc dùng bảng liên kết `MenuDishes` giúp tái sử dụng món ăn cho nhiều thực đơn mà không vi phạm 2NF.
> 4. **Chuẩn hóa 3NF cho Dịch vụ & Snapshot giá**: `ContractServices.agreed_unit_price` lưu lại giá tại thời điểm chốt hợp đồng (Price Snapshot).
> 5. **Chuẩn hóa Tiền cọc (`deposit_amount` & `Payments`)**: `Contracts.deposit_amount` quy định mức cọc tối thiểu (30%). Mỗi lần khách nộp cọc thực tế sẽ tạo một dòng giao dịch với `payment_type = 'DEPOSIT'` trong `Payments`.
