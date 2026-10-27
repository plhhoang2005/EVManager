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
      // 1. Gửi LoginRequest { usernameOrEmail, password } tới Backend
      const res = await authService.login(username, password);
      const accessToken = res?.accessToken || res?.token;

      if (!accessToken) {
        throw new Error('Máy chủ không trả về token xác thực hợp lệ.');
      }

      // 2. Lấy thông tin user và role từ nguồn được backend xác thực (GET /api/v1/users/me)
      let user = res?.user;
      if (!user) {
        // Lưu tạm token để axios interceptor đính kèm Authorization header
        sessionStorage.setItem('accessToken', accessToken);
        try {
          const profile = await authService.getProfile();
          const rawRole = profile?.roleName || profile?.role || 'USER';
          const normalizedRole = rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`;

          user = {
            id: profile?.userId || profile?.id,
            userId: profile?.userId || profile?.id,
            username: profile?.username || username,
            fullName: profile?.fullName || profile?.username || 'Người dùng',
            email: profile?.email || '',
            phone: profile?.phone || '',
            role: normalizedRole,
            roleName: rawRole,
            status: profile?.status || 'ACTIVE',
          };
        } catch (profileErr) {
          sessionStorage.removeItem('accessToken');
          throw profileErr;
        }
      }

      // 3. Đăng nhập vào context & điều hướng theo role xác thực
      login(user, accessToken);

      const staffRoles = ['ROLE_ADMIN', 'ROLE_SALES', 'ROLE_COORDINATOR', 'ROLE_MANAGER'];
      if (staffRoles.includes(user.role)) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      const status = err.response?.status;
      let errorMsg = 'Tên đăng nhập hoặc mật khẩu không chính xác!';

      if (status === 400 || status === 401) {
        errorMsg = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!';
      } else if (status === 403) {
        errorMsg = err.response?.data?.message || 'Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập!';
      } else if (status === 429) {
        errorMsg = 'Quá nhiều yêu cầu đăng nhập. Vui lòng chờ giây lát rồi thử lại.';
      } else if (status >= 500) {
        errorMsg = err.response?.data?.message || 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
      } else if (!err.response && err.message) {
        errorMsg = err.message.includes('Network')
          ? 'Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra kết nối mạng.'
          : err.message;
      }

      setServerError(errorMsg);
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
          <label htmlFor="username">Tên đăng nhập / Email</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Nhập username hoặc email (VD: admin hoặc user)"
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
          Tài khoản hệ thống: <strong>admin</strong> / <strong>Password1!</strong> (Quản trị viên) | <strong>user</strong> / <strong>Password1!</strong> (Khách hàng)
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
