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
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    const { username, password } = data;

    try {
      const res = await authService.login(username, password);
      const token = res.accessToken || res.token;
      const user = res.user;

      if (token && user) {
        login(user, token);
        const role = user.role || '';
        if (['ROLE_ADMIN', 'ROLE_SALES', 'ROLE_COORDINATOR', 'ADMIN', 'SALES', 'COORDINATOR'].includes(role)) {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        throw new Error('Dữ liệu xác thực trả về không hợp lệ.');
      }
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (status === 401
          ? 'Tên đăng nhập hoặc mật khẩu không chính xác!'
          : status === 400
          ? 'Thông tin đăng nhập không hợp lệ.'
          : status === 403
          ? 'Tài khoản của bạn không có quyền truy cập.'
          : status === 429
          ? 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau!'
          : status >= 500
          ? 'Hệ thống máy chủ đang gặp sự cố. Vui lòng thử lại sau!'
          : err.message || 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại đường truyền!');
      setServerError(message);
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
