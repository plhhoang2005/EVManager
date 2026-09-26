# Bảng mô tả chi tiết các bảng dữ liệu — EVManager

## 1. Quy tắc đặt tên
Hệ thống sử dụng thống nhất quy tắc `snake_case` cho tên bảng và tên cột.
- Tên cột viết thường.
- Các từ được nối bằng `_`.
- Khóa chính đặt theo dạng `<table>_id`, ví dụ `user_id`, `event_id`.
- Khóa ngoại sử dụng đúng tên của khóa chính mà nó tham chiếu.
- Không dùng khoảng trắng, ký tự đặc biệt hoặc cách viết hoa/thường không đồng nhất.
- Các trường thời gian dùng `TIMESTAMP` (hoặc `TIMESTAMPTZ` theo chuẩn PostgreSQL).
- Các trường tiền tệ dùng `DECIMAL`, không dùng `FLOAT`.

*Lưu ý:* ERD hiện tại đang dùng `INT` (hoặc `BIGINT`) cho PK/FK để đồng bộ với DBML đã thiết kế. `UUID` là kiểu dữ liệu có thể dùng cho ID nhưng chưa được áp dụng trong phiên bản ERD này.

---

## 2. Roles
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `role_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của vai trò. |
| `role_name` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên vai trò, ví dụ ADMIN, STAFF, MANAGER. |
| `description` | `VARCHAR(255)` | NULL | Mô tả chức năng và phạm vi quyền của vai trò. |

- **CHECK**: `role_name <> ''`.

---

## 3. Users
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `user_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh duy nhất của tài khoản. |
| `role_id` | `INT` | FK, NOT NULL | Vai trò của người dùng, tham chiếu `Roles.role_id`. |
| `full_name` | `VARCHAR(120)` | NOT NULL | Họ và tên người sử dụng hệ thống. |
| `email` | `VARCHAR(150)` | NOT NULL, UNIQUE | Email đăng nhập/liên hệ, không được trùng. |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Mật khẩu đã được hash, không lưu dạng rõ. |
| `phone` | `VARCHAR(20)` | NULL | Số điện thoại người dùng. |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái tài khoản. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo tài khoản. |

- **CHECK**: `status IN ('ACTIVE', 'INACTIVE', 'LOCKED')`.
- **FK**: `Users.role_id → Roles.role_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 4. Customers
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `customer_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh khách hàng. |
| `full_name` | `VARCHAR(120)` | NOT NULL | Họ tên khách hàng. |
| `phone` | `VARCHAR(20)` | NOT NULL | Số điện thoại liên hệ. |
| `email` | `VARCHAR(150)` | NULL | Email khách hàng nếu có. |
| `address` | `VARCHAR(255)` | NULL | Địa chỉ khách hàng. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hồ sơ khách hàng. |

- **CHECK**: `full_name <> ''`, `phone <> ''`.

---

## 5. Venues
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `venue_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh địa điểm tổ chức. |
| `venue_name` | `VARCHAR(150)` | NOT NULL | Tên địa điểm/sảnh tổ chức. |
| `address` | `VARCHAR(255)` | NOT NULL | Địa chỉ địa điểm. |
| `min_capacity` | `INT` | NOT NULL | Số khách tối thiểu địa điểm có thể phục vụ. |
| `max_capacity` | `INT` | NOT NULL | Số khách tối đa địa điểm có thể phục vụ. |
| `rental_price` | `DECIMAL(12,2)` | NOT NULL | Giá thuê địa điểm. |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'AVAILABLE' | Trạng thái sử dụng của địa điểm. |

- **CHECK**: `min_capacity > 0`, `max_capacity >= min_capacity`, `rental_price >= 0`, `status IN ('AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE')`.

---

## 6. Menus
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `menu_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh thực đơn. |
| `menu_name` | `VARCHAR(150)` | NOT NULL | Tên thực đơn. |
| `price_per_table` | `DECIMAL(12,2)` | NOT NULL | Giá một bàn theo thực đơn. |
| `description` | `VARCHAR(500)` | NULL | Mô tả thực đơn. |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái sử dụng của thực đơn. |

- **CHECK**: `price_per_table >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.

---

## 7. Dishes
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `dish_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh món ăn. |
| `menu_id` | `INT` | FK, NOT NULL | Thực đơn chứa món ăn này. |
| `dish_name` | `VARCHAR(150)` | NOT NULL | Tên món ăn. |
| `dish_category` | `VARCHAR(80)` | NULL | Nhóm món: khai vị, món chính, tráng miệng... |
| `unit_price` | `DECIMAL(12,2)` | NULL | Giá tham khảo của món ăn. |
| `description` | `VARCHAR(500)` | NULL | Mô tả món ăn. |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái món ăn. |

- **CHECK**: `unit_price IS NULL OR unit_price >= 0`, `status IN ('ACTIVE', 'INACTIVE')`.
- **FK**: `Dishes.menu_id → Menus.menu_id` — ON DELETE CASCADE, ON UPDATE CASCADE.

---

## 8. Events
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `event_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh sự kiện. |
| `customer_id` | `INT` | FK, NOT NULL | Khách hàng đặt/tổ chức sự kiện. |
| `venue_id` | `INT` | FK, NOT NULL | Địa điểm tổ chức. |
| `menu_id` | `INT` | FK, NOT NULL | Thực đơn được chọn cho sự kiện. |
| `created_by` | `INT` | FK, NOT NULL | Người dùng nội bộ tạo sự kiện. |
| `event_name` | `VARCHAR(150)` | NOT NULL | Tên sự kiện. |
| `event_type` | `VARCHAR(80)` | NOT NULL | Loại sự kiện. |
| `start_at` | `TIMESTAMP` | NOT NULL | Thời gian bắt đầu. |
| `end_at` | `TIMESTAMP` | NULL | Thời gian kết thúc. |
| `guest_count` | `INT` | NOT NULL | Số lượng khách dự kiến/thực tế. |
| `table_count` | `INT` | NULL | Số lượng bàn phục vụ. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'PLANNED' | Trạng thái xử lý sự kiện. |
| `notes` | `VARCHAR(500)` | NULL | Ghi chú nghiệp vụ. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo sự kiện. |

- **CHECK**: `guest_count > 0`, `table_count IS NULL OR table_count > 0`, `end_at IS NULL OR end_at > start_at`, `status IN ('PLANNED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`.
- **FK**: `customer_id → Customers.customer_id`, `venue_id → Venues.venue_id`, `menu_id → Menus.menu_id`, `created_by → Users.user_id`; tất cả ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 9. Services
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `service_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh dịch vụ. |
| `event_id` | `INT` | FK, NOT NULL | Sự kiện sử dụng dịch vụ. |
| `service_name` | `VARCHAR(150)` | NOT NULL | Tên dịch vụ: trang trí, âm thanh, ánh sáng... |
| `quantity` | `INT` | NOT NULL, DEFAULT 1 | Số lượng dịch vụ được đặt. |
| `unit_price` | `DECIMAL(12,2)` | NOT NULL | Đơn giá dịch vụ. |
| `description` | `VARCHAR(500)` | NULL | Mô tả dịch vụ. |
| `status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái dịch vụ. |

- **CHECK**: `quantity > 0`, `unit_price >= 0`, `status IN ('ACTIVE', 'CANCELLED')`.
- **FK**: `Services.event_id → Events.event_id` — ON DELETE CASCADE, ON UPDATE CASCADE.

---

## 10. Contracts
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `contract_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh hợp đồng. |
| `event_id` | `INT` | FK, NOT NULL, UNIQUE | Sự kiện gắn với hợp đồng; mỗi sự kiện tối đa một hợp đồng. |
| `contract_no` | `VARCHAR(50)` | NOT NULL, UNIQUE | Số/mã hợp đồng để tra cứu. |
| `signed_date` | `TIMESTAMP` | NULL | Thời điểm hợp đồng được ký. |
| `total_amount` | `DECIMAL(14,2)` | NOT NULL | Tổng giá trị hợp đồng. |
| `deposit_amount` | `DECIMAL(14,2)` | NOT NULL, DEFAULT 0 | Tiền đặt cọc; tối thiểu 30% giá trị hợp đồng theo quy định nghiệp vụ. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'DRAFT' | Trạng thái hợp đồng. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo hợp đồng. |

- **CHECK**: `total_amount >= 0`, `deposit_amount >= 0`, và với hợp đồng đã ký/đang hiệu lực thì deposit_amount >= total_amount * 0.30; `status IN ('DRAFT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')`.
- **FK**: `Contracts.event_id → Events.event_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 11. Payments
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `payment_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh giao dịch thanh toán. |
| `contract_id` | `INT` | FK, NOT NULL | Hợp đồng mà khoản thanh toán thuộc về. |
| `payment_date` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm thanh toán. |
| `amount` | `DECIMAL(14,2)` | NOT NULL | Số tiền khách hàng thanh toán. |
| `payment_method` | `VARCHAR(50)` | NOT NULL | Phương thức thanh toán. |
| `transaction_code` | `VARCHAR(100)` | UNIQUE | Mã giao dịch ngân hàng/cổng thanh toán nếu có. |
| `status` | `VARCHAR(30)` | NOT NULL, DEFAULT 'PENDING' | Trạng thái giao dịch. |
| `note` | `VARCHAR(500)` | NULL | Ghi chú khoản thanh toán. |

- **CHECK**: `amount > 0`, `status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')`.
- **FK**: `Payments.contract_id → Contracts.contract_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 12. AuditLogs
| Column Name | Data Type | Constraints | Ý nghĩa nghiệp vụ |
|---|---|---|---|
| `audit_log_id` | `INT` | PK, NOT NULL, AUTO INCREMENT | Mã định danh bản ghi nhật ký. |
| `user_id` | `INT` | FK, NOT NULL | Người dùng thực hiện thao tác. |
| `action` | `VARCHAR(100)` | NOT NULL | Hành động: CREATE, UPDATE, DELETE, LOGIN... |
| `entity_name` | `VARCHAR(80)` | NOT NULL | Tên đối tượng/bảng bị tác động. |
| `entity_id` | `VARCHAR(100)` | NULL | ID của bản ghi bị tác động. |
| `description` | `VARCHAR(500)` | NULL | Mô tả chi tiết thao tác. |
| `ip_address` | `VARCHAR(45)` | NULL | Địa chỉ IP của thiết bị. |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm ghi log. |

- **CHECK**: `action <> ''`, `entity_name <> ''`.
- **FK**: `AuditLogs.user_id → Users.user_id` — ON DELETE RESTRICT, ON UPDATE CASCADE.

---

## 13. Tổng hợp PK/FK
| Bảng | PK | FK |
|---|---|---|
| **Roles** | `role_id` | — |
| **Users** | `user_id` | `role_id → Roles.role_id` |
| **Customers** | `customer_id` | — |
| **Venues** | `venue_id` | — |
| **Menus** | `menu_id` | — |
| **Dishes** | `dish_id` | `menu_id → Menus.menu_id` |
| **Events** | `event_id` | `customer_id → Customers.customer_id`, `venue_id → Venues.venue_id`, `menu_id → Menus.menu_id`, `created_by → Users.user_id` |
| **Services** | `service_id` | `event_id → Events.event_id` |
| **Contracts** | `contract_id` | `event_id → Events.event_id` |
| **Payments** | `payment_id` | `contract_id → Contracts.contract_id` |
| **AuditLogs** | `audit_log_id` | `user_id → Users.user_id` |

---

## 14. Kết luận
Thiết kế gồm đúng 11 bảng cốt lõi, sử dụng thống nhất quy tắc `snake_case`.
- **1NF**: Thuộc tính có giá trị nguyên tử, không có nhóm lặp.
- **2NF**: Thuộc tính không khóa phụ thuộc đầy đủ vào khóa chính.
- **3NF**: Loại bỏ phụ thuộc bắc cầu và hạn chế dữ liệu dư thừa.
- Mỗi bảng có PK rõ ràng.
- Các quan hệ giữa bảng có FK rõ ràng.
- Sử dụng NOT NULL, UNIQUE, DEFAULT, CHECK phù hợp.
- Có quy định CASCADE hoặc RESTRICT để bảo đảm toàn vẹn tham chiếu.

---
> *Ghi chú bổ sung kỹ thuật:* Trong thiết kế CSDL nâng cao vật lý của EVManager (`erd-logical.dbml`), các quan hệ nhiều-nhiều (N-N) giữa `Menus`-`Dishes` và `Contracts`-`Services` được hỗ trợ thêm bởi 2 bảng liên kết `menu_dishes` và `contract_services` nhằm phục vụ lưu vết giá snapshot và tối ưu hóa 3NF.
