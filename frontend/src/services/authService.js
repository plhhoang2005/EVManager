import api from './api';
import { isDemoMode } from '../utils/constants';

/**
 * Trích xuất payload từ JSON Web Token (JWT) được cấp bởi Backend
 * Trả về claims (sub, role, exp...)
 */
export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Lỗi khi giải mã JWT token:', err);
    return null;
  }
}

export const authService = {
  /**
   * Đăng nhập người dùng khớp contract backend LoginRequest { usernameOrEmail, password }
   * Trả về LoginResponse { accessToken, tokenType, user, token }
   */
  async login(usernameOrEmail, password) {
    const payload =
      typeof usernameOrEmail === 'object' && usernameOrEmail !== null
        ? {
            usernameOrEmail: usernameOrEmail.usernameOrEmail || usernameOrEmail.username,
            password: usernameOrEmail.password,
          }
        : {
            usernameOrEmail,
            password,
          };

    // Khi cấu hình VITE_USE_MOCK=true thì chạy luồng demo tách biệt
    if (isDemoMode()) {
      return this.mockLogin(payload.usernameOrEmail, payload.password);
    }

    // Luồng thật: gọi API và KHÔNG nuốt lỗi (400, 401, 403, 429, 500, mạng)
    const data = await api.post('/api/v1/auth/login', payload);

    // Backend LoginResponse: { accessToken: string, tokenType: string }
    const accessToken = data?.accessToken || data?.token;
    if (!accessToken) {
      throw new Error('Máy chủ không trả về accessToken hợp lệ.');
    }

    // Lấy thông tin user và role từ nguồn được backend xác thực (JWT claims do backend ký)
    const claims = parseJwt(accessToken);
    const role =
      claims?.role ||
      (claims?.roles ? (Array.isArray(claims.roles) ? claims.roles[0] : claims.roles) : 'ROLE_USER');
    const username = claims?.sub || payload.usernameOrEmail;

    const user = {
      username,
      fullName: claims?.fullName || username,
      role,
    };

    return {
      accessToken,
      tokenType: data?.tokenType || 'Bearer',
      token: accessToken, // Alias tương thích
      user,
    };
  },

  /**
   * Mock login chỉ kích hoạt khi bật cấu hình demo (VITE_USE_MOCK=true)
   */
  mockLogin(username, password) {
    if (username === 'admin' || username === 'admin_demo@evmanager.vn') {
      if (password === 'Password1!' || password === 'admin123' || password === '123') {
        return {
          accessToken: 'demo-jwt-admin-token',
          token: 'demo-jwt-admin-token',
          tokenType: 'Bearer',
          user: { id: 1, username: 'admin', fullName: 'Quản trị viên Hệ Thống', role: 'ROLE_ADMIN' },
        };
      }
    }
    if (username === 'sales01' || username === 'sales@evmanager.vn') {
      if (password === 'Password1!' || password === 'sales123' || password === '123') {
        return {
          accessToken: 'demo-jwt-sales-token',
          token: 'demo-jwt-sales-token',
          tokenType: 'Bearer',
          user: { id: 2, username: 'sales01', fullName: 'Nhân viên Tư Vấn Sales', role: 'ROLE_SALES' },
        };
      }
    }
    if (username === 'coord01' || username === 'coordinator@evmanager.vn') {
      if (password === 'Password1!' || password === 'coordinator123' || password === '123') {
        return {
          accessToken: 'demo-jwt-coord-token',
          token: 'demo-jwt-coord-token',
          tokenType: 'Bearer',
          user: { id: 3, username: 'coord01', fullName: 'Điều phối viên Sự Kiện', role: 'ROLE_COORDINATOR' },
        };
      }
    }
    if (username === 'user' || username === 'khachhang1@gmail.com') {
      if (password === 'Password1!' || password === '123456' || password === '123') {
        return {
          accessToken: 'demo-jwt-user-token',
          token: 'demo-jwt-user-token',
          tokenType: 'Bearer',
          user: { id: 4, username: 'user', fullName: 'Khách hàng', role: 'ROLE_USER' },
        };
      }
    }
    const err = new Error('Tên đăng nhập hoặc mật khẩu demo không chính xác');
    err.response = { status: 401, data: { message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' } };
    throw err;
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
