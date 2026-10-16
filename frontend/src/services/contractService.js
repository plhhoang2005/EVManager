import api from './api';

export const contractService = {
  async getContracts() {
    try {
      return await api.get('/api/v1/contracts');
    } catch {
      // Dữ liệu mẫu đồng bộ 100% với database/schema.sql và V13 Flyway (contracts)
      return [
        {
          contract_id: 1,
          contract_code: 'HD-2026-001',
          customer_id: 1,
          event_id: 1,
          menu_id: 1,
          contract_date: '2026-10-01',
          total_amount: 220000000,
          deposit_amount: 66000000,
          status: 'CONFIRMED', // PostgreSQL Check: CONFIRMED (Đã xác nhận / Đã ký)
          // Aliases tương thích UI
          id: 'HD-2026-001',
          customerName: 'Nguyễn Văn Minh',
          eventTitle: 'Lễ cưới Hoàng Gia - Anh Minh & Chị Mai',
          totalAmount: 220000000,
          depositAmount: 66000000,
        },
        {
          contract_id: 2,
          contract_code: 'HD-2026-002',
          customer_id: 2,
          event_id: 2,
          menu_id: 2,
          contract_date: '2026-10-05',
          total_amount: 310000000,
          deposit_amount: 93000000,
          status: 'PENDING_CONFIRMATION', // PostgreSQL Check: PENDING_CONFIRMATION (Chờ duyệt / Chờ ký)
          id: 'HD-2026-002',
          customerName: 'Trần Văn Nam',
          eventTitle: 'Hội nghị Tech Summit 2026',
          totalAmount: 310000000,
          depositAmount: 93000000,
        },
        {
          contract_id: 3,
          contract_code: 'HD-2026-003',
          customer_id: 3,
          event_id: 3,
          menu_id: null,
          contract_date: '2026-10-08',
          total_amount: 320000000,
          deposit_amount: 96000000,
          status: 'CONFIRMED',
          id: 'HD-2026-003',
          customerName: 'Lê Thị Hồng',
          eventTitle: 'Đại nhạc hội EDM Summer Splash',
          totalAmount: 320000000,
          depositAmount: 96000000,
        },
      ];
    }
  },

  async createContract(contractData) {
    return await api.post('/api/v1/contracts', contractData);
  },
};

export default contractService;
