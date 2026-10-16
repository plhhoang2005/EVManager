import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validations/authSchema';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin_demo@evmanager.vn',
      password: 'admin123',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    const { username, password } = data;

    try {
      // Cho phép cả username chuẩn từ login.html lẫn demo ngắn
      let res;
      try {
        res = await authService.login(username, password);
      } catch (err) {
        if (username.includes('admin') && (password === 'admin123' || password === '123')) {
          res = {
            token: 'demo-jwt-admin-token',
            user: { id: 1, username: 'admin', fullName: 'Quản trị viên Hệ Thống', role: 'ROLE_ADMIN' },
          };
        } else if (username.includes('sales') && (password === 'sales123' || password === '123')) {
          res = {
            token: 'demo-jwt-sales-token',
            user: { id: 2, username: 'sales01', fullName: 'Nhân viên Tư Vấn Sales', role: 'ROLE_SALES' },
          };
        } else if (username.includes('coordinator') && (password === 'coordinator123' || password === '123')) {
          res = {
            token: 'demo-jwt-coord-token',
            user: { id: 3, username: 'coord01', fullName: 'Điều phối viên Sự Kiện', role: 'ROLE_COORDINATOR' },
          };
        } else if (username.includes('khachhang') || username === 'user') {
          res = {
            token: 'demo-jwt-user-token',
            user: { id: 4, username: 'user', fullName: 'Khách hàng', role: 'ROLE_USER' },
          };
        } else {
          throw err;
        }
      }

      if (res && res.token) {
        login(res.user, res.token);
        if (['ROLE_ADMIN', 'ROLE_SALES', 'ROLE_COORDINATOR'].includes(res.user.role)) {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="auth-top-nav">
          <Link to="/" className="back-home-link">← Trang chủ</Link>
        </div>
        <p className="eyebrow">Chào mừng bạn đến với chúng tôi</p>
        <h1 id="login-title">Đăng nhập</h1>

        <form id="loginForm" className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">Tên đăng nhập/Email</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Nhập tên đăng nhập hoặc email"
            {...register('username')}
            style={errors.username ? { borderColor: '#dc2626' } : {}}
          />
          {errors.username && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.username.message}
            </span>
          )}

          <label htmlFor="password">Mật khẩu</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              {...register('password')}
              style={errors.password ? { borderColor: '#dc2626' } : {}}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label="Hiện mật khẩu"
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
          {errors.password && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.password.message}
            </span>
          )}

          <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>
          {serverError && <p id="loginError" className="login-error" role="alert">{serverError}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'} <span aria-hidden="true">→</span>
          </button>

          <p>Nếu bạn chưa có tài khoản? <Link to="/register" className="forgot-password">Đăng ký</Link></p>
        </form>

        <p className="login-hint">
          Tài khoản demo: <strong>admin_demo@evmanager.vn</strong> / <strong>admin123</strong> (Sales: <strong>sales@evmanager.vn</strong> / <strong>sales123</strong> | Điều phối: <strong>coordinator@evmanager.vn</strong> / <strong>coordinator123</strong> | Khách: <strong>khachhang1@gmail.com</strong> / <strong>123456</strong>)
        </p>
      </section>

      <aside className="auth-aside" aria-label="Thông tin hệ thống">
        <span className="aside-mark" aria-hidden="true">◒</span>
        <p className="eyebrow">Event operations</p>
        <h2>Mọi sự kiện<br />trong tầm mắt.</h2>
        <p>Theo dõi doanh thu, lịch trình và hợp đồng trong một không gian làm việc rõ ràng.</p>
      </aside>
    </main>
  );
};

export default LoginPage;
