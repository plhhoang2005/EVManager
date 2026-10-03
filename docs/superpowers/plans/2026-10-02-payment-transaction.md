# Implementation Plan: BE-20 Payment Transaction

## 1. Traceability & Requirements Reviewed

- **Business Requirement**: BR-16 (Quản lý thanh toán).
- **Use Case**: UC-12 (Quản lý thanh toán), UC-09 (Đặt cọc/Thanh toán - Business Req Doc).
- **BPMN**: 
  - Khách hàng: "Thanh toán tiền cọc".
  - Hệ thống: "Tiếp nhận & kiểm tra giao dịch", "Giao dịch hợp lệ $\rightarrow$ Ghi nhận thanh toán & chuyển hợp đồng sang Đã chốt".
  - BR-11: "Tiền cọc đợt 1 bắt buộc bằng 30% tổng giá trị hợp đồng sau chiết khấu."
- **SRS UC-12**: Quản lý Tiền đặt cọc, Các lần thanh toán, Số tiền đã thanh toán, Số tiền còn lại, Ngày thanh toán, Phương thức thanh toán, Trạng thái thanh toán. Cập nhật số tiền còn lại sau mỗi giao dịch.

## 2. Payment Business Rules & Lifecycles
- **Source of Truth for "Total Paid"**: `SUM(amount)` from `payments` table where `status = 'SUCCESS'`. NO `paid_amount` column will be added to `contracts`.
- **Payment Lifecycle**:
  - Khách hàng thực hiện thanh toán $\rightarrow$ Trạng thái `PENDING` (chờ duyệt) hoặc `SUCCESS` ngay (nếu trực tiếp/hợp lệ).
  - Nếu thất bại $\rightarrow$ `FAILED`.
  - Không có trạng thái `REFUND` (vì Requirements không quy định quy trình hoàn tiền, chỉ có khấu trừ hóa đơn cuối).
  - Webhook/Payment Gateway không được implement (vì Requirements không đề cập hệ thống thứ 3, chỉ quản lý thanh toán nội bộ).
- **Quyền hạn (RBAC) dựa trên Business Requirements**:
  - **ADMIN / ACCOUNTANT**: Có quyền tạo, duyệt (xác nhận) thanh toán (`SUCCESS`), từ chối thanh toán (`FAILED`).
  - **SALES**: Chỉ có quyền "Theo dõi thanh toán" (READ-ONLY).
  - **CUSTOMER**: Có thể gửi yêu cầu thanh toán (tạo `PENDING` payment) và xem lịch sử của mình.
- **Contract State Validation**:
  - **DEPOSIT**: Chỉ được thanh toán khi Contract ở trạng thái `PENDING_DEPOSIT`.
  - **FINAL_PAYMENT**: Chỉ được thanh toán khi Contract ở trạng thái `COMPLETED` (sau tiệc).
  - Bị block đối với các trạng thái: `DRAFT`, `PENDING_APPROVAL`, `CANCELLED`.
- **Payment Amount Validation**:
  - Deposit phải đạt mốc `contract.depositAmount`. Nếu tổng `SUCCESS` payment >= `depositAmount`, kích hoạt chốt hợp đồng.
  - Tổng thanh toán không được vượt quá `contract.totalAmount`.

## 3. Deposit Confirmation Flow
- Khi một Payment được xác nhận `SUCCESS` (bởi Kế toán/Admin):
  1. Record payment status = `SUCCESS`.
  2. Tính `totalSuccessfulPaid = SUM(amount WHERE status = 'SUCCESS' AND contract_id = X)`.
  3. Nếu `totalSuccessfulPaid >= contract.depositAmount` và `contract.status == PENDING_DEPOSIT`:
  4. Gọi `contractLifecycleService.transitionToConfirmed(contractId)`.

## 4. Database Schema Proposal
Table `payments`:
- `payment_id` (PK, BIGINT, Auto Increment)
- `contract_id` (FK to contracts, BIGINT, NOT NULL)
- `amount` (DECIMAL, NOT NULL)
- `payment_date` (TIMESTAMP)
- `payment_method` (VARCHAR: CASH, TRANSFER, CARD) - Theo UC-12
- `payment_type` (VARCHAR: DEPOSIT, FINAL) - Theo BPMN đợt 1 và đợt cuối
- `status` (VARCHAR: PENDING, SUCCESS, FAILED) - Theo BPMN "Kiểm tra giao dịch hợp lệ"
- `created_at`, `updated_at` (Audit)

*(Không thêm `paid_amount` vào bảng `contracts`, không thêm `reference_code` nếu không cần thiết)*

## 5. API Proposal
Dựa trên UC-12 và RBAC:
- `POST /api/v1/payments` (Tạo payment): Dành cho Khách hàng (tạo PENDING), hoặc ACCOUNTANT/ADMIN (tạo SUCCESS trực tiếp).
- `GET /api/v1/contracts/{id}/payments` (Xem lịch sử): Dành cho ADMIN, ACCOUNTANT, SALES, CUSTOMER.
- `POST /api/v1/payments/{paymentId}/actions/confirm`: ACCOUNTANT/ADMIN duyệt thanh toán PENDING thành SUCCESS.
- `POST /api/v1/payments/{paymentId}/actions/reject`: ACCOUNTANT/ADMIN từ chối thanh toán PENDING thành FAILED.

## 6. Transaction / Concurrency
- `@Transactional` trên hàm xác nhận thanh toán.
- Payment approval phải chạy trong transaction, gọi `ContractLifecycleService.transitionToConfirmed(contractId)` khi đủ điều kiện.
- Locking/concurrency hardening thực tế là dependency của BE-21. State check (`contract.status != PENDING_DEPOSIT`) không phải là cơ chế chống race-condition hoàn chỉnh. BE-21 sẽ chịu trách nhiệm hoàn thiện phần locking này.

## 7. Gaps in Requirements (Chưa được quy định)
1. **Trả góp cọc / Nhiều lần cọc:** Requirements không cấm nạp cọc nhiều lần. Ta sẽ hỗ trợ nạp nhiều lần, miễn là `SUM() >= depositAmount`.
2. **Khách hàng nạp dư (Overpayment):** Bổ sung rule `SUM(SUCCESS payments) + new payment amount <= contract.totalAmount`. Nếu vượt thì reject. Lưu ý: Đây là Implementation Decision để bảo vệ financial integrity, không phải business rule do SRS/BPMN quy định.
3. **Refund (Hoàn cọc):** Không có nhắc đến việc trả lại tiền.
4. **Quyền sở hữu của Khách hàng (Ownership):** Phải kiểm tra `contract.customer_id` ứng với người đang đăng nhập nếu role là `CUSTOMER`. Không được dựa hoàn toàn vào `hasRole('CUSTOMER')`.
