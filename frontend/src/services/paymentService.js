import api from './api';
import { PAYMENT_TYPE, PAYMENT_STATUS, isDemoMode } from '../utils/constants';

/**
 * Service quản lý thanh toán & phiếu thu đồng bộ 100% với bảng payments trong CSDL PostgreSQL
 */
export const mockPayments = [
  {
    payment_id: 1,
    contract_id: 1,
    external_reference: 'VCB-20261002-8888',
    payment_type: PAYMENT_TYPE.DEPOSIT,
    amount: 66000000,
    payment_date: '2026-10-02T10:30:00+07:00',
    payment_method: 'Chuyển khoản (Vietcombank)',
    status: PAYMENT_STATUS.SUCCESS,
    // Aliases tương thích UI
    id: 'TT-901',
    contractId: 'HD-2026-001',
    customer: 'Nguyễn Văn Minh',
    phase: 'Đặt cọc 30%',
    date: '2026-10-02',
    notes: 'Đã nhận đủ tiền cọc đợt 1 qua VCB STK ...8888',
  },
  {
    payment_id: 2,
    contract_id: 3,
    external_reference: 'BIDV-20261008-1234',
    payment_type: PAYMENT_TYPE.DEPOSIT,
    amount: 96000000,
    payment_date: '2026-10-08T14:15:00+07:00',
    payment_method: 'Chuyển khoản (BIDV)',
    status: PAYMENT_STATUS.SUCCESS,
    id: 'TT-902',
    contractId: 'HD-2026-003',
    customer: 'Lê Thị Hồng',
    phase: 'Đặt cọc 30%',
    date: '2026-10-08',
    notes: 'Tiền cọc cho liveshow âm nhạc',
  },
  {
    payment_id: 3,
    contract_id: 2,
    external_reference: 'TECH-20261010-9999',
    payment_type: PAYMENT_TYPE.DEPOSIT,
    amount: 93000000,
    payment_date: '2026-10-10T09:00:00+07:00',
    payment_method: 'Chuyển khoản doanh nghiệp',
    status: PAYMENT_STATUS.PENDING,
    id: 'TT-903',
    contractId: 'HD-2026-002',
    customer: 'Trần Văn Nam',
    phase: 'Đặt cọc 30%',
    date: '2026-10-10',
    notes: 'UNC TechCorp gửi sang kế toán đang đối soát',
  },
];

export const paymentService = {
  /**
   * Lấy danh sách thanh toán.
   * Khi gọi API thật, không nuốt lỗi 401/403/5xx thành dữ liệu mẫu.
   */
  async getPayments(params) {
    if (isDemoMode()) {
      return mockPayments;
    }
    return await api.get('/api/v1/payments', { params });
  },

  async createPayment(paymentData) {
    if (isDemoMode()) {
      return {
        ...paymentData,
        payment_id: Date.now(),
        status: PAYMENT_STATUS.PENDING,
      };
    }
    return await api.post('/api/v1/payments', paymentData);
  },

  async getPaymentById(id) {
    if (isDemoMode()) {
      const p = mockPayments.find((item) => item.payment_id === Number(id) || item.id === id);
      if (p) return p;
      throw new Error(`Khoản thanh toán #${id} không tồn tại trong dữ liệu demo.`);
    }
    return await api.get(`/api/v1/payments/${id}`);
  },
};

export default paymentService;
