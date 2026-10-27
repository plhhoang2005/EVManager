import api from './api';
import { isDemoMode } from '../utils/constants';

/**
 * Dữ liệu mẫu sự kiện đồng bộ 100% với database/schema.sql và V14__seed_demo_events.sql
 */
export const mockEvents = [
  {
    event_id: 1,
    venue_id: 1,
    event_name: 'Lễ cưới Hoàng Gia - Anh Minh & Chị Mai',
    start_at: '2026-10-15T17:30:00+07:00',
    end_at: '2026-10-15T22:30:00+07:00',
    guest_count: 300,
    status: 'SCHEDULED', // SQL Check Constraint: SCHEDULED
    // Aliases tương thích UI
    id: 1,
    title: 'Lễ cưới Hoàng Gia - Anh Minh & Chị Mai',
    eventDate: '2026-10-15',
    venueName: 'Sảnh Kim Cương (Diamond Hall)',
    guestCount: 300,
  },
  {
    event_id: 2,
    venue_id: 2,
    event_name: 'Hội nghị Tech Summit 2026',
    start_at: '2026-10-20T08:00:00+07:00',
    end_at: '2026-10-20T17:00:00+07:00',
    guest_count: 500,
    status: 'PREPARING', // SQL Check Constraint: PREPARING
    id: 2,
    title: 'Hội nghị Tech Summit 2026',
    eventDate: '2026-10-20',
    venueName: 'Sảnh Hoàng Gia (Imperial Hall)',
    guestCount: 500,
  },
  {
    event_id: 3,
    venue_id: 1,
    event_name: 'Đại nhạc hội EDM Summer Splash',
    start_at: '2026-11-05T19:00:00+07:00',
    end_at: '2026-11-05T23:30:00+07:00',
    guest_count: 1500,
    status: 'SCHEDULED',
    id: 3,
    title: 'Đại nhạc hội EDM Summer Splash',
    eventDate: '2026-11-05',
    venueName: 'Sảnh Kim Cương (Diamond Hall)',
    guestCount: 1500,
  },
  {
    event_id: 4,
    venue_id: 3,
    event_name: 'Tiệc sinh nhật 30 tuổi - Doanh nhân Tuấn',
    start_at: '2026-09-28T18:30:00+07:00',
    end_at: '2026-09-28T22:00:00+07:00',
    guest_count: 50,
    status: 'COMPLETED', // SQL Check Constraint: COMPLETED
    id: 4,
    title: 'Tiệc sinh nhật 30 tuổi - Doanh nhân Tuấn',
    eventDate: '2026-09-28',
    venueName: 'Sảnh Ngọc Bích (Emerald Hall)',
    guestCount: 50,
  },
  {
    event_id: 5,
    venue_id: 2,
    event_name: 'Lễ Kỷ Niệm 15 Năm Thành Lập Vinacoffee',
    start_at: '2026-12-10T14:00:00+07:00',
    end_at: '2026-12-10T20:00:00+07:00',
    guest_count: 200,
    status: 'PREPARING',
    id: 5,
    title: 'Lễ Kỷ Niệm 15 Năm Thành Lập Vinacoffee',
    eventDate: '2026-12-10',
    venueName: 'Sảnh Hoàng Gia (Imperial Hall)',
    guestCount: 200,
  },
];

export const eventService = {
  /**
   * Lấy danh sách sự kiện.
   * Khi gọi API thật, lỗi 401/403/5xx không bị nuốt thành mock data.
   */
  async getEvents(params) {
    if (isDemoMode()) {
      return mockEvents;
    }
    return await api.get('/api/v1/events', { params });
  },

  /**
   * Lấy chi tiết sự kiện theo ID
   */
  async getEventById(id) {
    if (isDemoMode()) {
      const found = mockEvents.find((e) => e.event_id === Number(id) || e.id === Number(id));
      if (found) return found;
      throw new Error(`Sự kiện #${id} không tồn tại trong dữ liệu demo.`);
    }
    return await api.get(`/api/v1/events/${id}`);
  },

  /**
   * Kiểm tra xung đột lịch đặt sảnh tiệc.
   * Nếu API chưa hỗ trợ hoặc lỗi kết nối, throw lỗi để UI cảnh báo và chặn xác nhận đặt sảnh.
   * Tuyệt đối không fallback âm thầm thành sảnh trống (hasConflict: false).
   */
  async checkConflict(venueId, eventDate, timeSlot) {
    if (isDemoMode()) {
      return {
        hasConflict: false,
        message: 'Khung giờ và sảnh tiệc còn trống! (Chế độ Demo)',
        verified: true,
      };
    }
    return await api.post('/api/v1/events/check-conflict', { venueId, eventDate, timeSlot });
  },

  /**
   * Tạo sự kiện mới
   */
  async createEvent(eventData) {
    if (isDemoMode()) {
      return { ...eventData, event_id: Date.now(), status: 'SCHEDULED' };
    }
    return await api.post('/api/v1/events', eventData);
  },

  /**
   * Cập nhật trạng thái sự kiện
   */
  async updateEventStatus(id, status) {
    if (isDemoMode()) {
      return { id, status };
    }
    return await api.patch(`/api/v1/events/${id}/status`, { status });
  },
};

export default eventService;
