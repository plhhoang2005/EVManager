import api from './api';
import { isDemoMode } from '../utils/constants';

/**
 * Dữ liệu mẫu người dùng đồng bộ 100% với database/schema.sql và V11__seed_demo_accounts.sql
 */
export const mockUsers = [
  {
    user_id: 1,
    role_id: 1,
    username: 'admin_demo',
    full_name: 'Quản trị viên Hệ Thống',
    email: 'admin_demo@evmanager.vn',
    phone: '0909000001',
    role: 'ADMIN', // Khớp roles.role_name
    status: 'ACTIVE', // chk_users_status
    // Aliases tương thích UI
    id: 1,
    fullName: 'Quản trị viên Hệ Thống',
  },
  {
    user_id: 2,
    role_id: 2,
    username: 'sales',
    full_name: 'Chuyên viên kinh doanh',
    email: 'sales@evmanager.vn',
    phone: '0909000003',
    role: 'SALES',
    status: 'ACTIVE',
    id: 2,
    fullName: 'Chuyên viên kinh doanh',
  },
  {
    user_id: 3,
    role_id: 3,
    username: 'coordinator',
    full_name: 'Điều phối viên sự kiện',
    email: 'coordinator@evmanager.vn',
    phone: '0909000004',
    role: 'COORDINATOR',
    status: 'ACTIVE',
    id: 3,
    fullName: 'Điều phối viên sự kiện',
  },
  {
    user_id: 4,
    role_id: 4,
    username: 'customer',
    full_name: 'Khách hàng đặt tiệc',
    email: 'customer@evmanager.vn',
    phone: '0901234567',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    id: 4,
    fullName: 'Khách hàng đặt tiệc',
  },
];

export const userService = {
  /**
   * Lấy danh sách người dùng.
   * Khi gọi API thật, không nuốt lỗi 401/403/5xx thành dữ liệu mẫu.
   */
  async getUsers() {
    if (isDemoMode()) {
      return mockUsers;
    }
    return await api.get('/api/v1/users');
  },

  /**
   * Cập nhật thông tin tài khoản cá nhân
   */
  async updateProfile(userData) {
    if (isDemoMode()) {
      return { success: true, message: 'Cập nhật thông tin thành công! (Demo)', data: userData };
    }
    return await api.put('/api/v1/users/profile', userData);
  },

  /**
   * Đổi mật khẩu tài khoản hiện tại (khớp endpoint backend PUT /api/v1/users/me/password)
   */
  async changePassword(oldPassword, newPassword) {
    if (isDemoMode()) {
      return { message: 'Đổi mật khẩu thành công! (Demo)' };
    }
    return await api.put('/api/v1/users/me/password', { oldPassword, newPassword });
  },
};

export default userService;
