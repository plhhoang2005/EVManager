# [BUG-05] Ô tìm kiếm khách hàng và sự kiện không hiển thị dữ liệu trên giao diện

**Labels:** `type: bug`, `priority: high`, `frontend`, `backend`  
**Assignee:** `nhanvo134679`, `phucngo1707`  
**Jira Key:** `EV-157`

## 1. Mô tả lỗi
- Tại màn hình Quản lý khách hàng (`admin.html#tab-customers`), khi người dùng nhập từ khóa tìm kiếm (ví dụ: *"Nguyễn Văn An"* hoặc số điện thoại *"0901234567"*), bảng khách hàng hiển thị rỗng: *"Không tìm thấy khách hàng nào phù hợp"*.
- Màn hình Quản lý sự kiện (`admin.html#tab-events`) cũng gặp hiện tượng tương tự khi gõ tìm kiếm.

## 2. Nguyên nhân kỹ thuật
- **Frontend (`dashboard.js`):** Hàm `setupFiltersAndSearch()` chỉ gắn sự kiện lọc mảng tĩnh JavaScript `adminCustomers.filter(...)`. Do hàm tải dữ liệu ban đầu bị lỗi (gọi `/api/v1/dashboard` bị 404), mảng `adminCustomers` bị rỗng.
- **Lệch pha API:** Frontend không hề gửi request tìm kiếm `GET /api/v1/customers?keyword=...` xuống Backend, trong khi `CustomerController.java` đã có sẵn tham số `@RequestParam(required = false) String keyword`.
- Không có cơ chế Debounce khiến giao diện bị giật lag khi gõ nhanh.

## 3. Giải pháp khắc phục
1. Bổ sung cơ chế Debounce 300ms cho input tìm kiếm `customerSearchInput`.
2. Khi người dùng nhập từ khóa, Frontend gửi HTTP request: `GET /api/v1/customers?keyword=<từ_khóa>`.
3. Bóc tách trường `content` từ Spring Data `Page<CustomerResponse>` và render danh sách khách hàng từ CSDL PostgreSQL.
