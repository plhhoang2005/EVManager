import api from './api';

export const authService = {
  /**
   * Đăng nhập người dùng (kèm fallback Offline Demo khi chưa chạy Backend)
   */
  async login(username, password) {
    try {
      const data = await api.post('/api/v1/auth/login', { username, password });
      return data;
    } catch (err) {
      // Fallback offline demo accounts
      if (username === 'admin' && (password === 'Password1!' || password === '123')) {
        return {
          token: 'demo-jwt-admin-token',
          user: { id: 1, username: 'admin', fullName: 'Quản trị viên Hệ Thống', role: 'ROLE_ADMIN' },
        };
      }
      if (username === 'sales01' && (password === 'Password1!' || password === '123')) {
        return {
          token: 'demo-jwt-sales-token',
          user: { id: 2, username: 'sales01', fullName: 'Nhân viên Tư Vấn Sales', role: 'ROLE_SALES' },
        };
      }
      if (username === 'coord01' && (password === 'Password1!' || password === '123')) {
        return {
          token: 'demo-jwt-coord-token',
          user: { id: 3, username: 'coord01', fullName: 'Điều phối viên Sự Kiện', role: 'ROLE_COORDINATOR' },
        };
      }
      if (username === 'user' && (password === 'Password1!' || password === '123')) {
        return {
          token: 'demo-jwt-user-token',
          user: { id: 4, username: 'user', fullName: 'Khách hàng', role: 'ROLE_USER' },
        };
      }
      throw err;
    }
  },

  /**
   * Đăng ký tài khoản mới
   */
  async register(registerData) {
    return await api.post('/api/v1/auth/register', registerData);
  },

  /**
   * Yêu cầu khôi phục mật khẩu
   */
  async forgotPassword(email) {
    return await api.post('/api/v1/auth/forgot-password', { email });
  },

  /**
   * Lấy thông tin người dùng hiện tại
   */
  async getProfile() {
    return await api.get('/api/v1/auth/me');
  },
};

export default authService;
