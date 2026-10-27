import api from './api';
import { isDemoMode } from '../utils/constants';

/**
 * Dữ liệu mẫu sảnh tiệc đồng bộ 100% với database/schema.sql và seed.sql (V8, V9)
 */
export const mockVenues = [
  {
    venue_id: 1,
    venue_name: 'Sảnh Kim Cương (Diamond Hall)',
    min_capacity: 200,
    max_capacity: 500,
    rental_price: 15000000,
    address: 'Tầng 1, Trung tâm EVManager',
    status: 'AVAILABLE',
    // Aliases tương thích giao diện cũ
    id: 1,
    name: 'Sảnh Kim Cương (Diamond Hall)',
    capacity: 500,
    pricePerTable: 5500000,
    description: 'Sảnh lớn phong cách hoàng gia, âm thanh Line Array cao cấp',
  },
  {
    venue_id: 2,
    venue_name: 'Sảnh Hoàng Gia (Imperial Hall)',
    min_capacity: 100,
    max_capacity: 300,
    rental_price: 10000000,
    address: 'Tầng 2, Trung tâm EVManager',
    status: 'AVAILABLE',
    id: 2,
    name: 'Sảnh Hoàng Gia (Imperial Hall)',
    capacity: 300,
    pricePerTable: 4500000,
    description: 'Phong cách sang trọng quý phái, phù hợp hội nghị & dạ tiệc lớn',
  },
  {
    venue_id: 3,
    venue_name: 'Sảnh Ngọc Bích (Emerald Hall)',
    min_capacity: 50,
    max_capacity: 150,
    rental_price: 6000000,
    address: 'Tầng 3, Trung tâm EVManager',
    status: 'AVAILABLE',
    id: 3,
    name: 'Sảnh Ngọc Bích (Emerald Hall)',
    capacity: 150,
    pricePerTable: 4000000,
    description: 'Thiết kế vườn ngọc bích hiện đại, ấm cúng và gần gũi',
  },
  {
    venue_id: 4,
    venue_name: 'Sảnh Ruby (Ruby Hall)',
    min_capacity: 80,
    max_capacity: 200,
    rental_price: 8000000,
    address: 'Tầng 4, Trung tâm EVManager',
    status: 'AVAILABLE',
    id: 4,
    name: 'Sảnh Ruby (Ruby Hall)',
    capacity: 200,
    pricePerTable: 3800000,
    description: 'Tone màu ấm cúng, phù hợp thôi nôi, sinh nhật, tiệc thân mật',
  },
  {
    venue_id: 5,
    venue_name: 'Sảnh Bạch Kim (Platinum Hall)',
    min_capacity: 150,
    max_capacity: 400,
    rental_price: 12000000,
    address: 'Tầng 5, Trung tâm EVManager',
    status: 'AVAILABLE',
    id: 5,
    name: 'Sảnh Bạch Kim (Platinum Hall)',
    capacity: 400,
    pricePerTable: 5000000,
    description: 'Không gian mở thoáng đãng, view ngắm toàn cảnh thành phố',
  },
];

export const venueService = {
  /**
   * Lấy danh sách sảnh tiệc.
   * Khi gọi API thật, không nuốt lỗi 401/403/5xx thành dữ liệu mẫu.
   */
  async getVenues() {
    if (isDemoMode()) {
      return mockVenues;
    }
    return await api.get('/api/v1/venues');
  },
};

export default venueService;
