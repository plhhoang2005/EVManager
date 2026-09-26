# Bảng mô tả chi tiết các bảng dữ liệu — EVManager

## 1. Quy tắc đặt tên và chuẩn dữ liệu

Hệ thống sử dụng thống nhất quy tắc `snake_case` cho tên bảng và tên cột:
- Tên cột viết thường hoàn toàn, các từ nối bằng ký tự `_`.
- Khóa chính (PK) đặt theo dạng `<table>_id`, ví dụ `user_id`, `event_id`, `contract_id`.
- Khóa ngoại (FK) sử dụng đúng tên của khóa chính mà nó tham chiếu.
- Không dùng khoảng trắng, ký tự đặc biệt hoặc cách viết hoa/thường không đồng nhất.
- Các trường thời gian sử dụng kiểu dữ liệu `TIMESTAMP` (khuyến nghị `TIMESTAMPTZ` để chuẩn hóa múi giờ UTC+7).
- Các trường tiền tệ sử dụng kiểu `DECIMAL(12,2)` hoặc `DECIMAL(14,2)` (hoặc `DECIMAL(18,2)`), tuyệt đối không dùng `FLOAT` hoặc `DOUBLE` để tránh sai số tính toán tài chính.
- Kiểu dữ liệu PK/FK sử dụng `INT` (hoặc `BIGINT` AUTO_INCREMENT / SERIAL) để đồng bộ với sơ đồ DBML và ERD. Kiểu `UUID` là giải pháp thay thế nâng cao có thể áp dụng ở phiên bản sau.

---

## 2. Mô tả chi tiết từng bảng dữ liệu

### 2.1. Roles (Danh mục Vai trò & Phân quyền)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `role_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của vai trò. |
| `role_name` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên vai trò (ví dụ: ADMIN, MANAGER, SALES, COORDINATOR, ACCOUNTANT). |
| `description` | `VARCHAR(255)` | NULL | Mô tả chức năng và phạm vi quyền của vai trò. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái vai trò (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo vai trò. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật vai trò gần nhất. |

- **CHECK**: `role_name <> ''`, `status IN ('ACTIVE', 'INACTIVE')`.

---

### 2.2. Users (Người dùng nội bộ / Tài khoản hệ thống)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `user_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của tài khoản người dùng. |
| `role_id` | `INT` | FK, NOT NULL | Vai trò của người dùng, tham chiếu `Roles.role_id`. |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên đăng nhập của người dùng. |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Mật khẩu đã được mã hóa/hash, không lưu dạng rõ (plain text). |
| `full_name` | `VARCHAR(120)` | NOT NULL | Họ và tên người sử dụng hệ thống. |
| `email` | `VARCHAR(150)` | NULL, UNIQUE | Email đăng nhập/liên hệ, không được trùng. |
| `phone` | `VARCHAR(20)` | NULL | Số điện thoại người dùng. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái tài khoản (ACTIVE, INACTIVE, LOCKED). |
| `last_login_at` | `TIMESTAMP` | NULL | Thời điểm đăng nhập gần nhất. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo tài khoản. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật tài khoản gần nhất. |

- **CHECK**: `username <> ''`, `status IN ('ACTIVE', 'INACTIVE', 'LOCKED')`.
- **FK**: `Users.role_id → Roles.role_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

### 2.3. Customers (Khách hàng)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `customer_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của khách hàng. |
| `full_name` | `VARCHAR(120)` | NOT NULL | Họ tên khách hàng. |
| `phone` | `VARCHAR(20)` | NULL | Số điện thoại liên hệ. |
| `email` | `VARCHAR(150)` | NULL | Email khách hàng nếu có. |
| `address` | `VARCHAR(255)` | NULL | Địa chỉ liên hệ của khách hàng. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hồ sơ khách hàng. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật hồ sơ khách hàng. |

- **CHECK**: `full_name <> ''`, `phone IS NOT NULL OR email IS NOT NULL`.

---

### 2.4. Venues (Địa điểm / Sảnh tổ chức sự kiện)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `venue_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của sảnh/địa điểm. |
| `venue_name` | `VARCHAR(150)` | NOT NULL | Tên địa điểm/sảnh tổ chức. |
| `address` | `VARCHAR(255)` | NOT NULL | Địa chỉ cụ thể của địa điểm. |
| `min_capacity` | `INT` | NOT NULL, DEFAULT 0 | Số khách tối thiểu sảnh có thể phục vụ. |
| `max_capacity` | `INT` | NOT NULL | Số khách tối đa sảnh có thể phục vụ. |
| `rental_price` | `DECIMAL(12,2)` | NOT NULL | Giá thuê địa điểm/sảnh. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'AVAILABLE' | Trạng thái sử dụng (AVAILABLE, UNAVAILABLE, MAINTENANCE). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo sảnh. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật sảnh. |

- **CHECK**: `min_capacity >= 0`, `max_capacity >= min_capacity`, `rental_price >= 0`, `status IN ('AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE')`.

---

### 2.5. Menus (Danh mục Thực đơn)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `menu_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh thực đơn. |
| `menu_name` | `VARCHAR(150)` | NOT NULL, UNIQUE | Tên thực đơn/gói món ăn. |
| `price_per_table` | `DECIMAL(12,2)` | NOT NULL | Giá danh mục hiện hành cho một bàn/gói thực đơn. |
| `description` | `VARCHAR(500)` | NULL | Mô tả nội dung thực đơn. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái sử dụng của thực đơn (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo thực đơn. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật thực đơn. |

- **CHECK**: `price_per_table >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.
- **Lưu ý Chuẩn hóa 2NF/3NF**: Quan hệ giữa `Menus` và `Dishes` là quan hệ Nhiều–Nhiều (N–N) và được tách thông qua bảng liên kết `MenuDishes` (Mục 2.7) để một món ăn có thể nằm trong nhiều thực đơn khác nhau.

---

### 2.6. Dishes (Danh mục Món ăn)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `dish_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của món ăn. |
| `dish_name` | `VARCHAR(150)` | NOT NULL | Tên món ăn (ví dụ: Súp hải sản, Gà quay...). |
| `dish_category` | `VARCHAR(80)` | NOT NULL | Nhóm món ăn: khai vị, món chính, tráng miệng, đồ uống... |
| `unit_price` | `DECIMAL(12,2)` | NOT NULL | Đơn giá tham khảo của món ăn. |
| `description` | `VARCHAR(500)` | NULL | Mô tả chi tiết thành phần/món ăn. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái món ăn (ACTIVE, INACTIVE). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo món ăn. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật món ăn. |

- **CHECK**: `unit_price >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.

---

### 2.7. MenuDishes (Bảng liên kết Thực đơn — Món ăn [Chuẩn hóa N–N])

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `menu_id` | `INT` | PK, FK, NOT NULL | Mã thực đơn, tham chiếu `Menus.menu_id`. |
| `dish_id` | `INT` | PK, FK, NOT NULL | Mã món ăn, tham chiếu `Dishes.dish_id`. |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Số lượng món ăn trong cấu trúc thực đơn. |
| `note` | `VARCHAR(255)` | NULL | Ghi chú cụ thể cho món ăn trong thực đơn đó. |

- **PK ghép**: (`menu_id`, `dish_id`).
- **CHECK**: `quantity > 0`.
- **FK**: `menu_id → Menus.menu_id` (ON DELETE CASCADE, ON UPDATE RESTRICT), `dish_id → Dishes.dish_id` (ON DELETE RESTRICT, ON UPDATE RESTRICT).
- **Lưu ý Chuẩn hóa**: Đảm bảo 2NF vì thuộc tính `quantity` và `note` phụ thuộc hoàn toàn vào cả cặp (`menu_id`, `dish_id`).

---

### 2.8. Services (Danh mục Dịch vụ bổ sung)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `service_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh dịch vụ. |
| `service_name` | `VARCHAR(150)` | NOT NULL, UNIQUE | Tên dịch vụ: trang trí sảnh, âm thanh, ánh sáng, MC... |
| `unit_price` | `DECIMAL(12,2)` | NOT NULL | Đơn giá niêm yết hiện hành của dịch vụ. |
| `description` | `VARCHAR(500)` | NULL | Mô tả phạm vi chi tiết của dịch vụ. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái dịch vụ (ACTIVE, CANCELLED, INACTIVE). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo dịch vụ. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật dịch vụ. |

- **CHECK**: `unit_price >= 0`, `status IN ('ACTIVE', 'CANCELLED', 'INACTIVE')`.
- **Lưu ý Chuẩn hóa 2NF/3NF**: Danh mục `Services` lưu giá niêm yết chuẩn. Khi dịch vụ được đặt cho hợp đồng/sự kiện, thông tin và giá thỏa thuận được lưu tại bảng liên kết `ContractServices` (Mục 2.10).

---

### 2.9. Events (Sự kiện)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `event_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh sự kiện. |
| `venue_id` | `INT` | FK, NOT NULL | Địa điểm/sảnh tổ chức, tham chiếu `Venues.venue_id`. |
| `event_name` | `VARCHAR(150)` | NOT NULL | Tên sự kiện (ví dụ: Tiệc cưới Anh A & Chị B...). |
| `start_at` | `TIMESTAMP` | NOT NULL | Thời gian bắt đầu tổ chức sự kiện. |
| `end_at` | `TIMESTAMP` | NOT NULL | Thời gian kết thúc sự kiện. |
| `guest_count` | `INT` | NOT NULL | Số lượng khách dự kiến hoặc thực tế. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'PLANNED' | Trạng thái sự kiện (PLANNED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo bản ghi sự kiện. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật sự kiện. |

- **CHECK**: `guest_count > 0`, `end_at > start_at`, `status IN ('PLANNED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`.
- **FK**: `venue_id → Venues.venue_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

### 2.10. Contracts (Hợp đồng)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `contract_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của hợp đồng. |
| `customer_id` | `INT` | FK, NOT NULL | Khách hàng đứng tên hợp đồng, tham chiếu `Customers.customer_id`. |
| `event_id` | `INT` | FK, NULL, UNIQUE | Sự kiện thuộc hợp đồng (mỗi sự kiện tối đa 1 hợp đồng). |
| `menu_id` | `INT` | FK, NULL | Thực đơn được chọn cho hợp đồng, tham chiếu `Menus.menu_id`. |
| `contract_no` | `VARCHAR(50)` | NOT NULL, UNIQUE | Số/Mã hợp đồng để tra cứu. |
| `signed_date` | `TIMESTAMP` | NOT NULL | Ngày/thời điểm lập hoặc ký hợp đồng. |
| `total_amount` | `DECIMAL(14,2)` | NOT NULL | Tổng giá trị hợp đồng đã thỏa thuận. |
| `deposit_amount` | `DECIMAL(14,2)` | NOT NULL, DEFAULT 0 | Tiền đặt cọc thỏa thuận; quy định tối thiểu 30% tổng giá trị hợp đồng khi xác nhận. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'DRAFT' | Trạng thái hợp đồng (DRAFT, SIGNED, ACTIVE, COMPLETED, CANCELLED). |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hợp đồng. |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm cập nhật hợp đồng. |

- **CHECK**: `total_amount >= 0`, `deposit_amount >= 0`, `status IN ('DRAFT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')`.
- **FK**: `customer_id → Customers.customer_id`, `event_id → Events.event_id`, `menu_id → Menus.menu_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

### 2.11. ContractServices (Bảng liên kết Hợp đồng — Dịch vụ [Chuẩn hóa N–N & Snapshot Giá])

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `contract_id` | `INT` | PK, FK, NOT NULL | Mã hợp đồng, tham chiếu `Contracts.contract_id`. |
| `service_id` | `INT` | PK, FK, NOT NULL | Mã dịch vụ, tham chiếu `Services.service_id`. |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Số lượng dịch vụ được chọn cho hợp đồng này. |
| `agreed_unit_price` | `DECIMAL(12,2)` | NOT NULL | Giá dịch vụ đã chốt tại thời điểm xác nhận hợp đồng (Snapshot price). |
| `note` | `VARCHAR(255)` | NULL | Ghi chú yêu cầu riêng cho dịch vụ trong hợp đồng. |

- **PK ghép**: (`contract_id`, `service_id`).
- **CHECK**: `quantity > 0`, `agreed_unit_price >= 0`.
- **FK**: `contract_id → Contracts.contract_id` (ON DELETE CASCADE, ON UPDATE RESTRICT), `service_id → Services.service_id` (ON DELETE RESTRICT, ON UPDATE RESTRICT).

---

### 2.12. Payments (Giao dịch Thanh toán)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `payment_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của giao dịch thanh toán. |
| `contract_id` | `INT` | FK, NOT NULL | Hợp đồng được thanh toán, tham chiếu `Contracts.contract_id`. |
| `payment_type` | `VARCHAR(30)` | NOT NULL | Loại thanh toán (DEPOSIT: Đặt cọc, INSTALLMENT: Trả góp, FINAL: Tất toán, REFUND: Hoàn tiền). |
| `payment_date` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm ghi nhận giao dịch thanh toán. |
| `amount` | `DECIMAL(14,2)` | NOT NULL | Số tiền thanh toán thực tế của giao dịch. |
| `payment_method` | `VARCHAR(50)` | NOT NULL | Phương thức thanh toán (Tiền mặt, Chuyển khoản, Cổng thanh toán...). |
| `transaction_code` | `VARCHAR(100)` | NULL, UNIQUE | Mã giao dịch ngân hàng / cổng thanh toán nếu có. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'PENDING' | Trạng thái giao dịch (PENDING, PAID/SUCCESS, FAILED, REFUNDED). |
| `note` | `VARCHAR(500)` | NULL | Ghi chú chi tiết khoản thanh toán. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo bản ghi thanh toán. |

- **CHECK**: `amount > 0`, `status IN ('PENDING', 'PAID', 'SUCCESS', 'FAILED', 'REFUNDED')`.
- **FK**: `Payments.contract_id → Contracts.contract_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

### 2.13. AuditLogs (Nhật ký truy vết & Kiểm toán hệ thống)

| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `audit_log_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh bản ghi nhật ký kiểm toán. |
| `user_id` | `INT` | FK, NULL | Người dùng thực hiện thao tác, tham chiếu `Users.user_id`. |
| `action` | `VARCHAR(100)` | NOT NULL | Hành động thực hiện: CREATE, UPDATE, DELETE, LOGIN... |
| `entity_name` | `VARCHAR(80)` | NOT NULL | Tên đối tượng/bảng bị tác động (ví dụ: Contracts, Payments). |
| `entity_id` | `VARCHAR(100)` | NOT NULL | ID của bản ghi bị tác động. |
| `old_values` | `VARCHAR(500)` | NULL | Giá trị trước khi thay đổi (hoặc dạng JSONB). |
| `new_values` | `VARCHAR(500)` | NULL | Giá trị sau khi thay đổi (hoặc dạng JSONB). |
| `ip_address` | `VARCHAR(45)` | NULL | Địa chỉ IP của thiết bị thực hiện thao tác. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm ghi nhận log. |

- **CHECK**: `action <> ''`, `entity_name <> ''`.
- **FK**: `AuditLogs.user_id → Users.user_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 3. Tổng hợp Bảng Khóa chính (PK) và Khóa ngoại (FK)

| Bảng | Khóa chính (PK) | Khóa ngoại (FK) & Tham chiếu | Hành vi toàn vẹn tham chiếu |
|---|---|---|---|
| **Roles** | `role_id` | — | — |
| **Users** | `user_id` | `role_id → Roles.role_id` | ON DELETE RESTRICT, ON UPDATE CASCADE |
| **Customers** | `customer_id` | — | — |
| **Venues** | `venue_id` | — | — |
| **Menus** | `menu_id` | — | — |
| **Dishes** | `dish_id` | — | — |
| **MenuDishes** | (`menu_id`, `dish_id`) | `menu_id → Menus.menu_id`<br>`dish_id → Dishes.dish_id` | ON DELETE CASCADE (Menus), RESTRICT (Dishes)<br>ON UPDATE RESTRICT |
| **Services** | `service_id` | — | — |
| **Events** | `event_id` | `venue_id → Venues.venue_id` | ON DELETE RESTRICT, ON UPDATE CASCADE |
| **Contracts** | `contract_id` | `customer_id → Customers.customer_id`<br>`event_id → Events.event_id`<br>`menu_id → Menus.menu_id` | ON DELETE RESTRICT, ON UPDATE CASCADE |
| **ContractServices** | (`contract_id`, `service_id`) | `contract_id → Contracts.contract_id`<br>`service_id → Services.service_id` | ON DELETE CASCADE (Contracts), RESTRICT (Services)<br>ON UPDATE RESTRICT |
| **Payments** | `payment_id` | `contract_id → Contracts.contract_id` | ON DELETE RESTRICT, ON UPDATE CASCADE |
| **AuditLogs** | `audit_log_id` | `user_id → Users.user_id` | ON DELETE RESTRICT, ON UPDATE CASCADE |

---

## 4. Lưu ý Nghiệp vụ & Giải trình Chuẩn hóa Database EVManager

> [!NOTE]
> Các ghi chú dưới đây được tổng hợp nhằm giải trình chi tiết về kiến trúc dữ liệu đã được tối ưu hóa cho đồ án EVManager:

1. **Phân biệt 11 Thực thể Nghiệp vụ cốt lõi và 2 Bảng Liên kết**:
   - Hệ thống bao gồm **11 thực thể nghiệp vụ cốt lõi**: `Roles`, `Users`, `Customers`, `Venues`, `Dishes`, `Menus`, `Services`, `Events`, `Contracts`, `Payments`, `AuditLogs`.
   - 2 bảng liên kết kỹ thuật `MenuDishes` và `ContractServices` được bổ sung để biểu diễn chuẩn mực các quan hệ Nhiều–Nhiều (N–N) trong cơ sở dữ liệu thực tế.

2. **Lưu ý Chuẩn hóa 2NF cho Thực đơn & Món ăn (`MenuDishes`)**:
   - Việc tách bảng `MenuDishes` cho phép một món ăn có thể xuất hiện trong nhiều thực đơn khác nhau mà không bị trùng lặp dữ liệu trong bảng `Dishes`. Cột `quantity` và `note` nằm trên bảng liên kết để đáp ứng dạng chuẩn 2NF (phụ thuộc vào toàn bộ khóa ghép `menu_id` và `dish_id`).

3. **Lưu ý Chuẩn hóa 3NF cho Dịch vụ & Hợp đồng (`ContractServices`)**:
   - Dịch vụ được lưu đơn giá niêm yết hiện hành tại `Services.unit_price`. Khi chốt hợp đồng, đơn giá thỏa thuận được chụp lại (snapshot) tại `ContractServices.agreed_unit_price`. Việc này vừa tránh dư thừa dữ liệu vừa đảm bảo tính toàn vẹn lịch sử doanh thu khi bảng giá danh mục dịch vụ thay đổi trong tương lai.

4. **Lưu ý Chuẩn hóa Tiền cọc (`Payments` vs `Contracts.deposit_amount`)**:
   - Trong `Contracts`, trường `deposit_amount` thể hiện số tiền cọc thỏa thuận tối thiểu theo quy định (30% giá trị hợp đồng). Khi khách hàng tiến hành nộp tiền cọc thực tế, giao dịch được ghi nhận thành dòng thanh toán có `payment_type = 'DEPOSIT'` trong bảng `Payments` để tránh trùng lặp thông tin công nợ.
