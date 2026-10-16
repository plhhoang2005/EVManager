import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

export const ForgotPasswordPage = () => {
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(account);
      setMessage('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
      setIsSuccess(true);
    } catch {
      setMessage('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
      setIsSuccess(true);
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
        <p className="eyebrow">Khôi phục tài khoản</p>
        <h1 id="login-title">Quên mật khẩu?</h1>

        <form id="forgotPasswordForm" className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="recoveryAccount">Tên đăng nhập/Email</label>
          <input
            id="recoveryAccount"
            name="recoveryAccount"
            type="text"
            autoComplete="username"
            placeholder="Nhập tên đăng nhập hoặc email"
            required
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />

          {message && (
            <p
              id="forgotPasswordMessage"
              className={isSuccess ? 'form-success-alert' : 'login-error'}
              role="alert"
              style={{ display: 'block' }}
            >
              {message}
            </p>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'} <span aria-hidden="true">→</span>
          </button>

          <p><Link to="/login" className="forgot-password">Quay lại đăng nhập</Link></p>
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

export default ForgotPasswordPage;
