# Contract Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng module Quản lý Hợp đồng (Contract) hoàn chỉnh từ Backend API đến Frontend Wizard UI, đảm bảo nguyên tắc Price Snapshot và 1-1 Event.

**Architecture:** 
- Backend: RESTful API với Spring Boot, tách riêng `ContractService` (xử lý CRUD và tính tiền) và `ContractLifecycleService` (xử lý state machine). Giá trị tiền được khóa cứng tại thời điểm tạo (Price Snapshot).
- Frontend: Vanilla JS, tích hợp giao diện Wizard 3 bước trong Modal Popup, tự động tính tổng tiền tạm tính.

**Tech Stack:** Java 21, Spring Boot 3.3, PostgreSQL, Vanilla JS, HTML/CSS.

**Spec:** docs/superpowers/specs/2026-10-04-contract-management-design.md

## Global Constraints

- Chỉ sử dụng thư viện chuẩn của dự án (Spring Boot Starter Web, Data JPA, Validation, SweetAlert2).
- Không được dùng `ddl-auto=update`, mọi cấu trúc DB dựa trên `V7__create_venues_events_contracts_schema.sql` hiện có.
- Không cho phép số âm cho `total_amount` và `deposit_amount` (@Min(0)).
- `SALES` role chỉ thao tác được với trạng thái `DRAFT`.
- `ADMIN` role có quyền `Approve`, `Reject`, `Cancel`.

## Review Focus

- **Gán trùng Event**: Người dùng cố tình gán 1 Event cho 2 Contract khác nhau. Backend phải quăng lỗi `ResourceConflictException`.
- **Hack giá từ Frontend**: Payload Frontend truyền lên giá `total_amount = 0`. Backend phải bỏ qua và tự tính lại giá từ database (Menu price + Services price).
- **Hủy hợp đồng sai trạng thái**: User cố gắng gọi API `/cancel` cho một hợp đồng đã `COMPLETED`. Backend phải chặn.
- **Form Wizard lỗi State**: Bấm Submit ở Bước 3 khi chưa điền thông tin bắt buộc ở Bước 1. JS phải chặn Submit và cảnh báo.
- **Nhập chữ vào ô số**: Đã có global script chặn, nhưng cần test lại ô ngân sách của hợp đồng.

---

### Task 1: Backend Core CRUD (Controller & Service)

**Files:**
- Create: `backend/src/main/java/com/evmanager/contracts/dto/ContractRequest.java`
- Create: `backend/src/main/java/com/evmanager/contracts/dto/ContractResponse.java`
- Create: `backend/src/main/java/com/evmanager/contracts/model/Contract.java`
- Create: `backend/src/main/java/com/evmanager/contracts/model/ContractServiceEntity.java`
- Create: `backend/src/main/java/com/evmanager/contracts/repository/ContractRepository.java`
- Create: `backend/src/main/java/com/evmanager/contracts/service/ContractService.java`
- Create: `backend/src/main/java/com/evmanager/contracts/controller/ContractController.java`

**Interfaces:**
- Consumes: CustomerRepository, EventRepository, MenuRepository, ServiceRepository (to fetch entities and prices).
- Produces: `POST /api/v1/contracts`, `GET /api/v1/contracts`

- [ ] **Step 1: Create JPA Entities (`Contract` & `ContractServiceEntity`)**
Đảm bảo mapping đúng các cột trong DBML (`contract_id`, `customer_id`, `event_id`, v.v.).

- [ ] **Step 2: Create DTOs (`ContractRequest`, `ContractResponse`)**
Request cần `customerId`, `eventId`, `menuId` (optional), và `List<Long> serviceIds`. Thêm @NotNull, @Min phù hợp.

- [ ] **Step 3: Implement `ContractService.createContract(ContractRequest request)`**
Tính toán:
1. Lấy Menu price.
2. Lấy Service prices và map vào `ContractServiceEntity` với `agreed_unit_price`.
3. `totalAmount = menuPrice + sum(servicePrices)`.
4. `depositAmount = totalAmount * 0.3`.
5. Save. Bắt lỗi Event đã tồn tại Hợp đồng (findByEventId).

- [ ] **Step 4: Implement `ContractController` POST và GET**
`GET` có phân trang, `POST` trả về `201 Created`. Phân quyền `@PreAuthorize("hasAnyRole('ADMIN', 'SALES')")`.

- [ ] **Step 5: Verify Backend Compilation**
Run: `.\mvnw.cmd clean compile`
Expected: BUILD SUCCESS

### Task 2: Backend State Machine (Lifecycle)

**Files:**
- Create: `backend/src/main/java/com/evmanager/contracts/service/ContractLifecycleService.java`
- Modify: `backend/src/main/java/com/evmanager/contracts/controller/ContractController.java`

**Interfaces:**
- Consumes: `ContractRepository`
- Produces: `POST /api/v1/contracts/{id}/actions/{approve|cancel|complete}`

- [ ] **Step 1: Implement `ContractLifecycleService` methods**
`approveContract(id)`: DRAFT -> CONFIRMED.
`cancelContract(id)`: DRAFT/PENDING -> CANCELLED.
`completeContract(id)`: CONFIRMED -> COMPLETED.

- [ ] **Step 2: Add Endpoints to `ContractController`**
Gắn các `@PostMapping` cho action và phân quyền chặt chẽ (`approve` -> `ADMIN`, `cancel` -> `ADMIN, SALES`).

- [ ] **Step 3: Verify Backend Build**
Run: `.\mvnw.cmd clean compile`
Expected: BUILD SUCCESS

### Task 3: Frontend - Contract Layout & Wizard UI

**Files:**
- Modify: `frontend/admin.html`
- Create: `frontend/js/contracts.js`

**Interfaces:**
- Consumes: SweetAlert2 (global JS), DOM
- Produces: `tab-contracts` UI

- [ ] **Step 1: Add `tab-contracts` in `admin.html`**
Thêm tab ở sidebar, tạo một `<section>` chứa Bảng Hợp Đồng (table `admin-table mini-table`).

- [ ] **Step 2: Build Wizard Modal in `admin.html`**
Tạo Modal (`admin-modal`, `modal-backdrop`, `modal-card`).
Chia nội dung thành 3 `div` step ẩn/hiện bằng JS.

- [ ] **Step 3: Link `contracts.js` to `admin.html`**
Thêm `<script src="js/contracts.js"></script>`.

### Task 4: Frontend - Contract Wizard Logic & Integration

**Files:**
- Modify: `frontend/js/contracts.js`

**Interfaces:**
- Consumes: `/api/v1/contracts`, `/api/v1/customers`, `/api/v1/events`, `/api/v1/menus`, `/api/v1/services`
- Produces: API calls & UI rendering

- [ ] **Step 1: Fetch and Render Dropdowns**
Khi mở Modal, fetch API để đổ dữ liệu.

- [ ] **Step 2: Implement Next/Prev Step Logic**
Hàm JS ẩn/hiện Step. Validate Step 1.

- [ ] **Step 3: Implement Live Preview (Step 3)**
Tính tổng tiền tạm tính.

- [ ] **Step 4: Implement Submit API**
POST `/api/v1/contracts`.

- [ ] **Step 5: Implement List Rendering & Actions**
Hiển thị danh sách và nút Duyệt/Hủy.

