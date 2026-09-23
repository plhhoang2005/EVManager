# Chuẩn hóa dữ liệu và ERD logic — EVManager

## 1. Phạm vi và trạng thái

Tài liệu này chuẩn hóa mô hình dữ liệu EVManager đến **dạng chuẩn 3NF** và xác định PK, FK cùng quy tắc toàn vẹn tham chiếu. ERD logic được lưu bằng DBML tại [`erd-logical.dbml`](erd-logical.dbml) để có thể nhập trực tiếp vào dbdiagram.io.

Đây là **thiết kế logic**, chưa phải schema vật lý hoặc Flyway migration. Thiết kế gồm:

- 11 thực thể nghiệp vụ: `Roles`, `Users`, `Customers`, `Venues`, `Dishes`, `Menus`, `Services`, `Events`, `Contracts`, `Payments`, `AuditLogs`.
- 2 thực thể liên kết: `MenuDishes`, `ContractServices`.
- Tổng cộng 13 bảng vật lý. Hai bảng liên kết là cấu trúc kỹ thuật cần thiết cho quan hệ N–N, không làm tăng số thực thể nghiệp vụ cốt lõi.

## 2. Giả định thiết kế

Các điểm chưa được BA chốt trong phân tích ban đầu được biểu diễn bằng giả định có thể thay đổi trước khi tạo migration:

1. Một hợp đồng có tối đa một sự kiện; `Contracts.event_id` cho phép rỗng ở trạng thái nháp và có `UNIQUE` để bảo đảm một sự kiện không thuộc nhiều hợp đồng.
2. Một hợp đồng chọn tối đa một thực đơn; một thực đơn có thể được dùng lại cho nhiều hợp đồng.
3. `Menus.price` là giá danh mục hiện hành. `Contracts.total_amount` và `ContractServices.agreed_unit_price` là giá trị chốt theo thời điểm giao kết để bảo toàn lịch sử.
4. Tiền cọc không được lặp trong `Contracts`; nó được ghi thành một dòng `Payments.payment_type = DEPOSIT`.
5. Các bản ghi nghiệp vụ đã phát sinh giao dịch được ngừng hoạt động hoặc hủy theo trạng thái thay vì xóa vật lý.

## 3. Chuẩn hóa dạng chuẩn 1NF

### 3.1. Tiêu chí

- Mỗi ô chứa một giá trị nguyên tử.
- Không có cột lặp như `dish_1`, `dish_2`, `service_1`, `service_2`.
- Mỗi bảng có khóa chính xác định duy nhất một dòng.

### 3.2. Áp dụng

| Nhóm lặp ban đầu có thể phát sinh | Cách tách theo 1NF |
|---|---|
| Danh sách món trong một thực đơn | Mỗi món là một dòng trong `MenuDishes` |
| Danh sách dịch vụ của một hợp đồng | Mỗi dịch vụ là một dòng trong `ContractServices` |
| Các lần đặt cọc/thanh toán | Mỗi giao dịch là một dòng trong `Payments` |
| Nhiều thao tác trên cùng đối tượng | Mỗi thao tác là một dòng trong `AuditLogs` |
| Ngày và giờ sự kiện | Dùng `start_at`, `end_at` kiểu `TIMESTAMPTZ`; mỗi cột biểu diễn một thời điểm |

Kết quả: toàn bộ thuộc tính là đơn trị, các tập giá trị lặp được chuyển thành bảng con hoặc bảng liên kết.

## 4. Chuẩn hóa dạng chuẩn 2NF

### 4.1. Tiêu chí

Mô hình đã đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc đầy đủ vào toàn bộ khóa chính, không chỉ một phần của khóa ghép.

### 4.2. Áp dụng cho bảng khóa đơn

Các bảng `Roles`, `Users`, `Customers`, `Venues`, `Dishes`, `Menus`, `Services`, `Events`, `Contracts`, `Payments`, `AuditLogs` dùng một khóa chính thay thế. Vì khóa chỉ có một thuộc tính nên không tồn tại phụ thuộc hàm một phần.

### 4.3. Áp dụng cho bảng khóa ghép

| Bảng | Khóa chính | Phụ thuộc hàm hợp lệ | Thuộc tính không được lưu tại bảng liên kết |
|---|---|---|---|
| `MenuDishes` | (`menu_id`, `dish_id`) | (`menu_id`, `dish_id`) → `quantity`, `note` | `menu_name`, `dish_name`, `dish_price` |
| `ContractServices` | (`contract_id`, `service_id`) | (`contract_id`, `service_id`) → `quantity`, `agreed_unit_price`, `note` | `contract_code`, `service_name`, giá danh mục hiện hành |

`agreed_unit_price` phụ thuộc vào cặp hợp đồng–dịch vụ vì cùng một dịch vụ có thể được chốt với giá khác nhau ở các hợp đồng khác nhau. Do đó thuộc tính này không phải phụ thuộc một phần vào `service_id`.

## 5. Chuẩn hóa dạng chuẩn 3NF

### 5.1. Tiêu chí

Mô hình đã đạt 2NF và không có thuộc tính không khóa phụ thuộc bắc cầu vào khóa chính thông qua một thuộc tính không khóa khác.

### 5.2. Các phụ thuộc bắc cầu đã loại bỏ

| Không lưu lặp | Nguồn dữ liệu chuẩn | Lý do |
|---|---|---|
| `role_name` trong `Users` | `Users.role_id` → `Roles.role_name` | Tránh đổi tên vai trò ở nhiều tài khoản |
| Tên/địa chỉ sảnh trong `Events` | `Events.venue_id` → `Venues` | Tránh lặp thông tin sảnh theo từng sự kiện |
| Tên khách hàng trong `Contracts` | `Contracts.customer_id` → `Customers` | Tránh dữ liệu khách hàng không đồng nhất |
| Tên sự kiện hoặc sảnh trong `Contracts` | `Contracts.event_id` → `Events` → `Venues` | Không lưu thuộc tính bắc cầu |
| Tên món/giá món trong `MenuDishes` | `dish_id` → `Dishes` | Bảng liên kết chỉ lưu dữ kiện của quan hệ |
| Tên dịch vụ trong `ContractServices` | `service_id` → `Services` | Tránh lặp danh mục dịch vụ |
| Tổng tiền đã thanh toán trong `Contracts` | Tổng các `Payments` trạng thái `SUCCESS` | Tránh hai nguồn số dư công nợ |
| `deposit_amount` trong `Contracts` | Dòng `Payments` có loại `DEPOSIT` | Tránh lặp tiền cọc |

### 5.3. Thuộc tính snapshot có chủ đích

- `Contracts.total_amount` là tổng giá trị đã thỏa thuận của hợp đồng, không phải giá danh mục hiện tại.
- `ContractServices.agreed_unit_price` là giá dịch vụ tại thời điểm chốt hợp đồng.

Hai thuộc tính này phụ thuộc trực tiếp vào khóa của bản ghi giao dịch tương ứng và cần thiết để bảo toàn lịch sử. Chúng không phải dữ liệu dư thừa vi phạm 3NF.

## 6. Khóa chính và khóa ngoại

| Bảng | Khóa chính | Khóa ngoại |
|---|---|---|
| `Roles` | `role_id` | — |
| `Users` | `user_id` | `role_id` → `Roles.role_id` |
| `Customers` | `customer_id` | — |
| `Venues` | `venue_id` | — |
| `Dishes` | `dish_id` | — |
| `Menus` | `menu_id` | — |
| `MenuDishes` | (`menu_id`, `dish_id`) | `menu_id` → `Menus`; `dish_id` → `Dishes` |
| `Services` | `service_id` | — |
| `Events` | `event_id` | `venue_id` → `Venues.venue_id` |
| `Contracts` | `contract_id` | `customer_id` → `Customers`; `event_id` → `Events`; `menu_id` → `Menus` |
| `ContractServices` | (`contract_id`, `service_id`) | `contract_id` → `Contracts`; `service_id` → `Services` |
| `Payments` | `payment_id` | `contract_id` → `Contracts.contract_id` |
| `AuditLogs` | `audit_log_id` | `user_id` → `Users.user_id` |

## 7. Quy tắc toàn vẹn tham chiếu

### 7.1. `CASCADE`

Chỉ dùng khi dòng con là thành phần phụ thuộc và không có ý nghĩa khi tách khỏi dòng cha.

| Quan hệ | Khi xóa cha | Giải thích |
|---|---|---|
| `Menus` → `MenuDishes` | `CASCADE` | Xóa thực đơn thì xóa cấu trúc món của chính thực đơn đó |
| `Contracts` → `ContractServices` | `CASCADE` | Xóa hợp đồng chưa phát sinh giao dịch thì xóa các dòng dịch vụ đi kèm |

### 7.2. `RESTRICT`

| Quan hệ | Khi xóa cha | Giải thích |
|---|---|---|
| `Roles` → `Users` | `RESTRICT` | Không xóa vai trò đang được tài khoản sử dụng |
| `Users` → `AuditLogs` | `RESTRICT` | Bảo toàn chủ thể tạo lịch sử kiểm toán; ưu tiên khóa tài khoản |
| `Venues` → `Events` | `RESTRICT` | Bảo toàn lịch sử địa điểm tổ chức |
| `Customers` → `Contracts` | `RESTRICT` | Bảo toàn hồ sơ hợp đồng của khách hàng |
| `Events` → `Contracts` | `RESTRICT` | Không xóa sự kiện đã gắn hợp đồng |
| `Menus` → `Contracts` | `RESTRICT` | Không xóa thực đơn đã được hợp đồng tham chiếu |
| `Dishes` → `MenuDishes` | `RESTRICT` | Món đang thuộc thực đơn phải được gỡ khỏi thực đơn trước |
| `Services` → `ContractServices` | `RESTRICT` | Không xóa danh mục dịch vụ đã được chốt trong hợp đồng |
| `Contracts` → `Payments` | `RESTRICT` | Không xóa hợp đồng có lịch sử tài chính |

Tất cả khóa chính dùng `ON UPDATE RESTRICT` vì định danh không được sửa. Với danh mục hoặc dữ liệu lịch sử, ứng dụng dùng cột `status` để ngừng hoạt động thay cho xóa vật lý.

## 8. Quy tắc toàn vẹn khác

| Nhóm | Quy tắc |
|---|---|
| Sức chứa | `min_capacity >= 0`, `max_capacity >= min_capacity`; `guest_count` phải nằm trong sức chứa sảnh |
| Thời gian | `end_at > start_at`; không cho hai sự kiện cùng sảnh bị trùng khoảng thời gian và phải xét khoảng đệm nếu BA duyệt |
| Tiền | Mọi giá trị tiền không âm; `Payments.amount > 0`; chỉ giao dịch `SUCCESS` được tính vào công nợ |
| Hợp đồng | `contract_code` duy nhất; `event_id` duy nhất nếu có; không xác nhận hợp đồng thiếu dữ liệu bắt buộc |
| Danh mục | Không cho dùng sảnh, món, thực đơn hoặc dịch vụ `INACTIVE` cho giao dịch mới |
| Audit | Chỉ ghi thêm; không chứa mật khẩu, JWT, connection string hoặc dữ liệu thanh toán nhạy cảm |
| Xung đột lịch | Cần kiểm tra trong service và dùng exclusion constraint PostgreSQL ở thiết kế vật lý; DBML chỉ ghi chú quy tắc |

## 9. Mở sơ đồ bằng dbdiagram.io

1. Mở [dbdiagram.io](https://dbdiagram.io/).
2. Tạo diagram mới hoặc mở diagram của nhóm.
3. Chọn **Import → DBML** và tải file [`erd-logical.dbml`](erd-logical.dbml), hoặc dán toàn bộ nội dung file vào editor.
4. Kiểm tra 13 bảng, các đường liên kết và nhãn PK/FK.
5. Xuất PNG/PDF sau khi nhóm xác nhận các giả định ở Mục 2.

## 10. Tiêu chí nghiệm thu

- Không có thuộc tính đa trị hoặc nhóm cột lặp.
- Thuộc tính của hai bảng nối phụ thuộc vào toàn bộ khóa ghép.
- Không lưu lặp thuộc tính có thể suy ra qua FK, trừ snapshot giá đã giải thích.
- Mọi bảng có PK; mọi quan hệ có FK và hành vi xóa/cập nhật rõ ràng.
- `CASCADE` chỉ áp dụng cho hai bảng chi tiết phụ thuộc.
- Dữ liệu hợp đồng, thanh toán, sự kiện, danh mục đang được dùng và audit được bảo vệ bằng `RESTRICT`.
- DBML có thể được nhập vào dbdiagram.io trước khi chuyển thành Flyway migration.
