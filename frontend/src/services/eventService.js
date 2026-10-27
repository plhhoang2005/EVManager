import api from './api';
import { isDemoMockEnabled } from '../config/demoConfig';

const DEMO_EVENTS = [
  {
    event_id: 1,
    venue_id: 1,
    event_name: 'Lễ cưới Hoàng Gia - Anh Minh & Chị Mai',
    start_at: '2026-10-15T17:30:00+07:00',
    end_at: '2026-10-15T22:30:00+07:00',
    guest_count: 300,
    status: 'SCHEDULED',
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
    status: 'PREPARING',
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
    status: 'COMPLETED',
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
  async getEvents(params) {
    try {
      return await api.get('/api/v1/events', { params });
    } catch (err) {
      // Chỉ trả dữ liệu demo khi chế độ Demo Mock được bật và không phải lỗi xác thực/phân quyền (401/403)
      if (isDemoMockEnabled() && err.response?.status !== 401 && err.response?.status !== 403) {
        return DEMO_EVENTS;
      }
      throw err;
    }
  },

  async getEventById(id) {
    return await api.get(`/api/v1/events/${id}`);
  },

  /**
   * Kiểm tra xung đột lịch đặt sảnh.
   * Tuyệt đối KHÔNG bắt lỗi để trả hasConflict: false giả mạo khi endpoint chưa sẵn sàng hoặc gặp sự cố.
   */
  async checkConflict(venueId, eventDate, timeSlot) {
    try {
      return await api.post('/api/v1/events/check-conflict', { venueId, eventDate, timeSlot });
    } catch (err) {
      // Khi API lỗi, rethrow để caller xử lý cảnh báo, không bao giờ tự ý báo sảnh trống
      throw err;
    }
  },

  async createEvent(eventData) {
    return await api.post('/api/v1/events', eventData);
  },

  async updateEventStatus(id, status) {
    return await api.patch(`/api/v1/events/${id}/status`, { status });
  },
};

export default eventService;
