import api from './api';
import { isDemoMockEnabled } from '../config/demoConfig';

const DEMO_USERS = [
  {
    user_id: 1,
    role_id: 1,
    username: 'admin',
    full_name: 'Quản trị viên Hệ Thống',
    email: 'admin@evmanager.vn',
    phone: '0909000001',
    role: 'ADMIN',
    status: 'ACTIVE',
    id: 1,
    fullName: 'Quản trị viên Hệ Thống',
  },
  {
    user_id: 2,
    role_id: 2,
    username: 'sales01',
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
    username: 'coord01',
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
    username: 'user',
    full_name: 'Khách hàng đặt tiệc',
    email: 'user@evmanager.vn',
    phone: '0901234567',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    id: 4,
    fullName: 'Khách hàng đặt tiệc',
  },
];

export const userService = {
  async getUsers() {
    try {
      return await api.get('/api/v1/users');
    } catch (err) {
      if (isDemoMockEnabled() && err.response?.status !== 401 && err.response?.status !== 403) {
        return DEMO_USERS;
      }
      throw err;
    }
  },

  /**
   * Cập nhật hồ sơ người dùng hiện tại
   * Backend endpoint: PUT /api/v1/users/me (UserProfileUpdateRequest { fullName, email, phone })
   */
  async updateProfile(userData) {
    const payload = {
      fullName: userData.fullName || userData.name,
      email: userData.email,
      phone: userData.phone || '',
    };
    return await api.put('/api/v1/users/me', payload);
  },

  /**
   * Đổi mật khẩu người dùng hiện tại
   * Backend endpoint: PUT /api/v1/users/me/password (ChangePasswordRequest { oldPassword, newPassword })
   */
  async changePassword(oldPassword, newPassword) {
    return await api.put('/api/v1/users/me/password', { oldPassword, newPassword });
  },
};

export default userService;
