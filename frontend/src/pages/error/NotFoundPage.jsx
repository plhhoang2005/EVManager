import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="error-page-container" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{
          fontSize: '5.5rem',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #087f82 0%, #0e7490 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-2px',
        }}>
          404
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: '#f0fdfa',
          color: '#087f82',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '20px',
          border: '1px solid #99f6e4',
        }}>
          <span>🔍</span> Không tìm thấy trang (Page Not Found)
        </div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '12px',
        }}>
          Đường dẫn không tồn tại hoặc đã thay đổi
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          Địa chỉ URL bạn đang cố truy cập không có trên hệ thống EVManager. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
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
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🏠</span> Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
