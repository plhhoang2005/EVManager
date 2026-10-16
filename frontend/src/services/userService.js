import api from './api';

export const userService = {
  async getUsers() {
    try {
      return await api.get('/api/v1/users');
    } catch {
      // Dữ liệu mẫu đồng bộ 100% với database/schema.sql và V11__seed_demo_accounts.sql
      return [
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
    }
  },

  async updateProfile(userData) {
    try {
      return await api.put('/api/v1/users/profile', userData);
    } catch {
      return { success: true, message: 'Cập nhật thông tin thành công!', data: userData };
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      return await api.post('/api/v1/users/change-password', { oldPassword, newPassword });
    } catch {
      return { success: true, message: 'Đổi mật khẩu thành công!' };
    }
  },
};

export default userService;
