import api from './api';
import { isDemoMockEnabled } from '../config/demoConfig';

export const authService = {
  /**
   * Đăng nhập người dùng qua Backend API
   * Contract Backend: LoginRequest { usernameOrEmail, password }
   * Response Backend: LoginResponse { accessToken, tokenType }
   * Tuyệt đối không fallback sang mock khi gặp lỗi xác thực/phân quyền (400, 401, 403, 429).
   */
  async login(usernameOrEmail, password) {
    try {
      const data = await api.post('/api/v1/auth/login', { usernameOrEmail, password });
      return data;
    } catch (err) {
      // Chỉ cho phép mock offline khi cấu hình demo được BẬT rõ ràng và không phải lỗi xác thực từ backend (400, 401, 403, 429)
      const isAuthError = err.response && [400, 401, 403, 429].includes(err.response.status);
      if (isDemoMockEnabled() && !isAuthError && !err.response) {
        if (usernameOrEmail === 'admin' && (password === 'Password1!' || password === '123')) {
          return {
            accessToken: 'demo-jwt-admin-token',
            tokenType: 'Bearer',
            user: { id: 1, userId: 1, username: 'admin', fullName: 'Quản trị viên Hệ Thống', role: 'ROLE_ADMIN', roleName: 'ADMIN' },
          };
        }
        if (usernameOrEmail === 'sales01' && (password === 'Password1!' || password === '123')) {
          return {
            accessToken: 'demo-jwt-sales-token',
            tokenType: 'Bearer',
            user: { id: 2, userId: 2, username: 'sales01', fullName: 'Nhân viên Tư Vấn Sales', role: 'ROLE_SALES', roleName: 'SALES' },
          };
        }
        if (usernameOrEmail === 'coord01' && (password === 'Password1!' || password === '123')) {
          return {
            accessToken: 'demo-jwt-coord-token',
            tokenType: 'Bearer',
            user: { id: 3, userId: 3, username: 'coord01', fullName: 'Điều phối viên Sự Kiện', role: 'ROLE_COORDINATOR', roleName: 'COORDINATOR' },
          };
        }
        if (usernameOrEmail === 'user' && (password === 'Password1!' || password === '123')) {
          return {
            accessToken: 'demo-jwt-user-token',
            tokenType: 'Bearer',
            user: { id: 4, userId: 4, username: 'user', fullName: 'Khách hàng', role: 'ROLE_USER', roleName: 'USER' },
          };
        }
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
   * Lấy thông tin hồ sơ người dùng hiện tại từ nguồn backend xác thực
   * Endpoint chuẩn: GET /api/v1/users/me (UserResponse)
   */
  async getProfile() {
    return await api.get('/api/v1/users/me');
  },
};

export default authService;
