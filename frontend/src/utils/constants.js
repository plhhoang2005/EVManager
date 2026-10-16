/**
 * Hệ thống hằng số Enums & Helpers đồng bộ 100% với CSDL PostgreSQL (database/schema.sql)
 * và Flyway Migrations của EVManager.
 */

// 1. Trạng thái Sự kiện (Event Status - chk_events_status)
export const EVENT_STATUS = {
  SCHEDULED: 'SCHEDULED',      // Đã lên lịch (Mặc định trong DB)
  PREPARING: 'PREPARING',      // Đang chuẩn bị
  IN_PROGRESS: 'IN_PROGRESS',  // Đang diễn ra
  COMPLETED: 'COMPLETED',      // Hoàn thành
  CANCELLED: 'CANCELLED',      // Đã hủy

  // Legacy & UI Compatibility Aliases
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
};

// 2. Trạng thái Hợp đồng (Contract Status - chk_contracts_status)
export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',                            // Bản nháp (Mặc định trong DB)
  PENDING_CONFIRMATION: 'PENDING_CONFIRMATION', // Chờ duyệt
  CONFIRMED: 'CONFIRMED',                    // Đã xác nhận
  COMPLETED: 'COMPLETED',                    // Hoàn thành
  CANCELLED: 'CANCELLED',                    // Đã hủy

  // Aliases tương thích UI
  SIGNED: 'CONFIRMED',
  PENDING_SIGNATURE: 'PENDING_CONFIRMATION',
};

// 3. Phân loại Giao dịch Thanh toán (Payment Type - chk_payments_type)
export const PAYMENT_TYPE = {
  DEPOSIT: 'DEPOSIT',         // Đặt cọc
  INSTALLMENT: 'INSTALLMENT', // Thanh toán từng đợt
  FINAL: 'FINAL',             // Quyết toán cuối
  REFUND: 'REFUND',           // Hoàn tiền
};

// 4. Trạng thái Giao dịch Thanh toán (Payment Transaction Status - chk_payments_status)
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',   // Chờ xử lý / Đang đối soát
  SUCCESS: 'SUCCESS',   // Giao dịch thành công
  FAILED: 'FAILED',     // Giao dịch thất bại
  REFUNDED: 'REFUNDED', // Đã hoàn tiền

  // Trạng thái công nợ tổng hợp của Hợp đồng (Aggregate Status)
  UNPAID: 'UNPAID',     // Chưa thanh toán
  PARTIAL: 'PARTIAL',   // Thanh toán một phần
  PAID: 'PAID',         // Đã thanh toán đầy đủ
};

// 5. Trạng thái Sảnh tiệc (Venue Status - chk_venues_status)
export const VENUE_STATUS = {
  AVAILABLE: 'AVAILABLE',     // Sẵn sàng (Mặc định trong DB)
  MAINTENANCE: 'MAINTENANCE', // Đang bảo trì
  INACTIVE: 'INACTIVE',       // Ngưng hoạt động

  // UI status filter alias
  BOOKED: 'BOOKED',           // Đã có lịch đặt
};

// 6. Phân quyền Người dùng (System Roles - V11 migration & roles table)
export const SYSTEM_ROLES = {
  ADMIN: 'ADMIN',             // Quản trị viên
  MANAGER: 'MANAGER',         // Quản lý vận hành
  SALES: 'SALES',             // Nhân viên tư vấn & bán hàng
  COORDINATOR: 'COORDINATOR', // Điều phối viên sự kiện
  ACCOUNTANT: 'ACCOUNTANT',   // Kế toán
  CUSTOMER: 'CUSTOMER',       // Khách hàng
};

// 7. Trạng thái Người dùng (User Status - chk_users_status)
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',     // Đang hoạt động
  LOCKED: 'LOCKED',     // Đã khóa
  INACTIVE: 'INACTIVE', // Ngưng hoạt động
};

// 8. Trạng thái Món ăn & Dịch vụ (chk_dishes_status, chk_services_status)
export const ITEM_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

// 9. Danh mục Món ăn (Dishes Category - seed V8)
export const DISH_CATEGORY = {
  STARTER: 'STARTER', // Khai vị
  SOUP: 'SOUP',       // Món súp
  MAIN: 'MAIN',       // Món chính
  HOTPOT: 'HOTPOT',   // Lẩu
  DESSERT: 'DESSERT', // Tráng miệng
};

// Từ điển nhãn tiếng Việt cho tất cả trạng thái & enums
export const STATUS_LABELS = {
  // Event Status (PostgreSQL DB)
  SCHEDULED: 'Đã lên lịch',
  PREPARING: 'Đang chuẩn bị',
  IN_PROGRESS: 'Đang diễn ra',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',

  // Contract Status (PostgreSQL DB)
  DRAFT: 'Bản nháp',
  PENDING_CONFIRMATION: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  SIGNED: 'Đã ký kết',
  PENDING_SIGNATURE: 'Chờ ký kết',

  // Payment Status & Types
  PENDING: 'Chờ xử lý',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  REFUNDED: 'Đã hoàn tiền',
  DEPOSIT: 'Đặt cọc',
  INSTALLMENT: 'Thanh toán từng đợt',
  FINAL: 'Quyết toán',
  REFUND: 'Hoàn tiền',

  // Payment Overview (Tổng hợp HĐ)
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',

  // Venue Status
  AVAILABLE: 'Sẵn sàng đón khách',
  MAINTENANCE: 'Đang bảo trì',
  BOOKED: 'Đã có lịch đặt',

  // User & System Status
  ACTIVE: 'Đang hoạt động',
  LOCKED: 'Đã khóa',
  INACTIVE: 'Ngưng hoạt động',

  // Dish Categories
  STARTER: 'Khai vị',
  SOUP: 'Món súp',
  MAIN: 'Món chính',
  HOTPOT: 'Lẩu',
  DESSERT: 'Tráng miệng',

  // Roles
  ADMIN: 'Quản trị viên',
  MANAGER: 'Quản lý vận hành',
  SALES: 'Nhân viên kinh doanh',
  COORDINATOR: 'Điều phối viên',
  ACCOUNTANT: 'Kế toán',
  CUSTOMER: 'Khách hàng',

  // Fallback tiếng Việt nguyên bản
  'Đã lên lịch': 'Đã lên lịch',
  'Đã xác nhận': 'Đã xác nhận',
  'Đang chuẩn bị': 'Đang chuẩn bị',
  'Đang diễn ra': 'Đang diễn ra',
  'Hoàn thành': 'Hoàn thành',
  'Đã hủy': 'Đã hủy',
  'Đã ký kết': 'Đã ký kết',
  'Đã ký': 'Đã ký kết',
  'Chờ duyệt': 'Chờ duyệt',
  'Chờ ký': 'Chờ ký kết',
  'Hoàn tất': 'Hoàn thành',
  'Sẵn sàng': 'Sẵn sàng đón khách',
  'Đang bảo trì': 'Đang bảo trì',
  'Đã thanh toán': 'Đã thanh toán',
  'Chờ xác nhận': 'Chờ xử lý',
};

/**
 * Lấy nhãn tiếng Việt hiển thị
 */
export const getStatusLabel = (status) => {
  if (!status) return 'Chưa xác định';
  return STATUS_LABELS[status] || status;
};

/**
 * Lấy class CSS badge phù hợp cho trạng thái
 */
export const getStatusBadgeClass = (status) => {
  if (!status) return 'status-pending';

  switch (status) {
    // Thành công / Xác nhận / Sẵn sàng / Hoạt động
    case 'SCHEDULED':
    case 'CONFIRMED':
    case 'SIGNED':
    case 'ACTIVE':
    case 'AVAILABLE':
    case 'SUCCESS':
    case 'PAID':
    case 'Đã lên lịch':
    case 'Đã xác nhận':
    case 'Đã ký kết':
    case 'Đã ký':
    case 'Sẵn sàng':
    case 'Sẵn sàng đón khách':
    case 'Đang hoạt động':
    case 'Đã thanh toán':
      return 'status-confirmed';

    // Đang chờ / Đang xử lý / Chuẩn bị
    case 'PREPARING':
    case 'IN_PROGRESS':
    case 'PENDING':
    case 'PENDING_CONFIRMATION':
    case 'PENDING_SIGNATURE':
    case 'PARTIAL':
    case 'BOOKED':
    case 'Đang chuẩn bị':
    case 'Đang diễn ra':
    case 'Chờ duyệt':
    case 'Chờ ký':
    case 'Chờ xử lý':
    case 'Chờ xác nhận':
    case 'Thanh toán một phần':
      return 'status-pending';

    // Hoàn thành
    case 'COMPLETED':
    case 'Hoàn thành':
    case 'Hoàn tất':
      return 'status-completed';

    // Đã hủy / Thất bại / Khóa / Bảo trì
    case 'CANCELLED':
    case 'FAILED':
    case 'LOCKED':
    case 'UNPAID':
    case 'MAINTENANCE':
    case 'INACTIVE':
    case 'REFUNDED':
    case 'Đã hủy':
    case 'Thất bại':
    case 'Đã khóa':
    case 'Đang bảo trì':
    case 'Ngưng hoạt động':
    case 'Chưa thanh toán':
    case 'Đã hoàn tiền':
      return 'status-cancelled';

    default:
      return 'status-pending';
  }
};

