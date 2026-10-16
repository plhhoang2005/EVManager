import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { currentUser, isStaff, isAuthenticated } = useAuth();

  return (
    <main className="error-page-container" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 20px 40px -15px rgba(234, 88, 12, 0.12)',
        border: '1px solid #fed7aa',
      }}>
        <div style={{
          fontSize: '5.5rem',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-2px',
        }}>
          403
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: '#fff7ed',
          color: '#c2410c',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '20px',
          border: '1px solid #fdba74',
        }}>
          <span>🛡️</span> Quyền truy cập bị từ chối (403 Forbidden)
        </div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '12px',
        }}>
          Bạn không có quyền truy cập khu vực này
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}>
          Tài khoản của bạn ({currentUser?.username || 'Chưa đăng nhập'} - vai trò: <strong>{currentUser?.role || 'Khách'}</strong>) không có đặc quyền quản trị (Admin, Sales, Coordinator) để xem trang này.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Quay lại
          </button>
          {isAuthenticated ? (
            <Link
              to={isStaff ? '/admin' : '/user'}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {isStaff ? 'Về Bảng Quản Trị' : 'Về Trang Cá Nhân'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Đăng nhập tài khoản khác
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForbiddenPage;
