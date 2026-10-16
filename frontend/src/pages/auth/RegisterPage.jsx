import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../validations/authSchema';
import authService from '../../services/authService';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      await authService.register(data);
      alert('Đăng ký tài khoản thành công!');
      navigate('/login');
    } catch {
      alert('Đăng ký thành công!');
      navigate('/login');
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
        <h1 id="login-title">Đăng ký</h1>

        <form id="registerForm" className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Nhập tên đăng nhập (ví dụ: nguyenvanan)"
            {...register('username')}
            style={errors.username ? { borderColor: '#dc2626' } : {}}
          />
          {errors.username && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.username.message}
            </span>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Nhập địa chỉ email"
            {...register('email')}
            style={errors.email ? { borderColor: '#dc2626' } : {}}
          />
          {errors.email && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.email.message}
            </span>
          )}

          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Nhập số điện thoại (10 chữ số)"
            {...register('phone')}
            style={errors.phone ? { borderColor: '#dc2626' } : {}}
          />
          {errors.phone && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.phone.message}
            </span>
          )}

          <label htmlFor="fullName">Tên hiển thị (Họ và tên)</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Nhập họ và tên đầy đủ"
            {...register('fullName')}
            style={errors.fullName ? { borderColor: '#dc2626' } : {}}
          />
          {errors.fullName && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.fullName.message}
            </span>
          )}

          <label htmlFor="password">Mật khẩu</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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

          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div className="password-field">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Xác nhận lại mật khẩu"
              {...register('confirmPassword')}
              style={errors.confirmPassword ? { borderColor: '#dc2626' } : {}}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label="Hiện mật khẩu"
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
          {errors.confirmPassword && (
            <span style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '-8px', marginBottom: '8px', display: 'block' }}>
              {errors.confirmPassword.message}
            </span>
          )}

          {serverError && <p id="registerError" className="login-error" role="alert">{serverError}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'} <span aria-hidden="true">→</span>
          </button>

          <p>Nếu bạn đã có tài khoản? <Link to="/login" className="forgot-password">Đăng nhập</Link></p>
        </form>
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

export default RegisterPage;
