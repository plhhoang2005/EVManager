import React from 'react';
import { Link } from 'react-router-dom';

export const ServerErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <main className="error-page-container" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 20px 40px -15px rgba(220, 38, 38, 0.12)',
        border: '1px solid #fecaca',
      }}>
        <div style={{
          fontSize: '5.5rem',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-2px',
        }}>
          500
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: '#fef2f2',
          color: '#b91c1c',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '20px',
          border: '1px solid #fca5a5',
        }}>
          <span>⚠️</span> Lỗi hệ thống máy chủ (500 Internal Error)
        </div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '12px',
        }}>
          Đã xảy ra sự cố không mong muốn
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}>
          Hệ thống đang gặp sự cố xử lý tạm thời. Chúng tôi đã ghi nhận nhật ký lỗi kỹ thuật và đang tiến hành khắc phục. Vui lòng tải lại trang hoặc thử lại sau vài phút.
        </p>

        {error && (
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'left',
            fontSize: '0.82rem',
            color: '#e11d48',
            fontFamily: 'monospace',
            marginBottom: '28px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}>
            {error.message || String(error)}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <button
            type="button"
            onClick={() => {
              if (resetErrorBoundary) {
                resetErrorBoundary();
              } else {
                window.location.reload();
              }
            }}
            className="btn btn-outline"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔄 Tải lại trang
          </button>
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            🏠 Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServerErrorPage;
