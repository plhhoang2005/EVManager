# Contract Management - Design Specification
**Date**: 2026-10-04
**Module**: Contract Management (Quản lý hợp đồng)

## 1. Overview
Hợp đồng (Contract) là thực thể trung tâm liên kết Khách hàng, Sự kiện, Thực đơn, Dịch vụ và Thanh toán. Chức năng Quản lý hợp đồng cần cung cấp trải nghiệm mượt mà cho nhân viên Sale để lên báo giá và chốt hợp đồng mà không bị ngợp thông tin, đồng thời đảm bảo tính vẹn toàn dữ liệu ở Backend.

## 2. Architecture & Components

### 2.1. Backend (Spring Boot)
- **Entities**: 
  - Tái sử dụng bảng `contracts`, `contract_services` đã có trong DB (`V7__create_venues_events_contracts_schema.sql`).
  - Hợp đồng lưu *Price Snapshot* (giá trị cứng tại thời điểm tạo) để đề phòng sau này đổi giá dịch vụ/thực đơn.
- **Controllers & Endpoints**:
  - `GET /api/v1/contracts`: Phân trang, lọc theo trạng thái, khách hàng.
  - `GET /api/v1/contracts/{id}`: Lấy chi tiết hợp đồng gồm Event, Menu, Services liên quan.
  - `POST /api/v1/contracts`: Khởi tạo hợp đồng mới (DRAFT).
  - `PUT /api/v1/contracts/{id}`: Cập nhật thông tin khi hợp đồng chưa chốt.
  - **State Machine Endpoints**: `POST /api/v1/contracts/{id}/actions/{action}` (approve, reject, cancel, start, complete).
- **Service Layer**:
  - Xử lý tính toán tổng tiền (`total_amount`) dựa trên Menu và Services.
  - Xử lý logic tiền cọc (`deposit_amount = 30% total_amount`).
- **Security / RBAC**:
  - `SALES`: Được quyền Tạo, Sửa (khi DRAFT), và Hủy.
  - `ADMIN`: Được quyền Approve, Reject, Cancel.
  - `COORDINATOR`: Được quyền Start, Complete.

### 2.2. Frontend (HTML/JS/CSS)
- **UI Architecture**: Thêm tab `tab-contracts` vào `admin.html`.
- **List View**: 
  - Bảng `admin-table mini-table` hiển thị Mã HĐ, Tên KH, Sự kiện, Tổng tiền, Trạng thái, Thao tác.
  - Badge trạng thái có màu sắc tương ứng (Vàng = Draft, Xanh = Confirmed, Xám = Cancelled...).
- **Creation Wizard (Trình tạo hợp đồng 3 bước)**:
  - Sử dụng Modal lớn (`modal-card` 800px) chia làm 3 Tab/Bước nội bộ:
    1. **Bước 1: Cơ bản**: Chọn Khách hàng (Dropdown/Search), Chọn Sự kiện (Dropdown), Chọn Ngày ký.
    2. **Bước 2: Dịch vụ & Thực đơn**: Chọn Menu (Dropdown), Chọn các Dịch vụ kèm theo (Multi-select / Checkbox).
    3. **Bước 3: Xem trước & Xác nhận**: Hệ thống tự động tính bảng báo giá (Tổng tiền, Tiền cọc). Bấm "Lưu" để chốt.
- **Validation (Superpowers Defense-in-depth)**:
  - Bắt lỗi chữ trong ô số, kiểm tra ràng buộc chọn Khách hàng/Sự kiện.

## 3. Data Flow
1. **Load Data**: Mở wizard ➔ Gọi API lấy danh sách Customer, Event (chưa có HĐ), Menu, Service để đổ vào các dropdown.
2. **Calculate**: Khi Sale tick chọn Menu/Service ở Bước 2, JS tự động cộng dồn giá và hiển thị sang Bước 3.
3. **Submit**: Gửi object JSON khổng lồ chứa `customerId, eventId, menuId, list(services)` xuống API `POST`.
4. **Persist**: Backend kiểm tra tính hợp lệ, snapshot giá từ Database, tính lại tổng tiền lần 2 để chống hack, rồi lưu vào `contracts` và `contract_services`.

## 4. Error Handling
- Nếu Event đã bị gán cho Hợp đồng khác ➔ Backend trả lỗi `ResourceConflictException`.
- Nếu Frontend truyền sai giá ➔ Backend bỏ qua giá Frontend, tự map từ ID.
- Xử lý lỗi SweetAlert2 popup trên Frontend.

## 5. Testing Strategy
- Viết Unit Test cho việc chuyển đổi State Machine (`ContractLifecycleService`).
- Viết Unit Test cho hàm tính tổng tiền hợp đồng.
- Test bằng tay trên UI (Thử bỏ trống Khách hàng, thử nhập sai quy trình).

