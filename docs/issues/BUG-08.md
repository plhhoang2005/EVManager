# [BUG-08] Phân quyền RBAC trên develop chưa hỗ trợ 4 vai trò chuẩn theo đặc tả BA UC-01

**Labels:** `type: bug`, `priority: high`, `backend`, `database`  
**Assignee:** `phucngo1707`, `2005buinguyenchihau-alt`  
**Jira Key:** `EV-160`

## 1. Mô tả lỗi
- Theo đặc tả BA trong `actors-personas.md` và `UC01-login-rbac.md`, hệ thống có 4 vai trò chuẩn: `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`.
- Tuy nhiên trên nhánh `develop`, bảng `roles` chỉ khởi tạo `ADMIN`, `USER` (migration `V2`), rồi thêm `MANAGER`, `STAFF` (migration `V8`).
- Các Controller (`CustomerController`, `VenueController`) gắn annotation `@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")`. Khi đăng nhập bằng tài khoản Sales hoặc Coordinator, người dùng bị chặn bằng lỗi `HTTP 403 Forbidden`.

## 2. Nguyên nhân kỹ thuật
- Backend Dev dùng từ khóa tự đặt (`STAFF`, `MANAGER`) thay vì bám theo SRS v1.0 của BA.
- Mặc dù Backend đã viết migration `V11__add_system_roles.sql` và sửa `@PreAuthorize` trong PR 194, nhưng PR này chưa được merge vào `develop`.

## 3. Giải pháp khắc phục
1. **Database:** Nạp migration Flyway bổ sung đủ 4 Role: `ADMIN`, `SALES`, `COORDINATOR`, `CUSTOMER`.
2. **Backend:** Cập nhật `@PreAuthorize` trên các Controller chấp nhận cả `ADMIN`, `SALES`, `COORDINATOR` và `CUSTOMER` (với các API xem sảnh).
