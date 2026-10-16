import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SalesPage = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`admin-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar" id="adminSidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✨</span>
          <div className="brand-info">
            <span className="brand-title">LV34 <span>EVENTS</span></span>
            <span className="brand-badge" style={{ background: '#055f61' }}>SALES PORTAL</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">KHÔNG GIAN LÀM VIỆC</div>
          <button className="nav-item active" type="button">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Bảng điều khiển</span>
          </button>
          <button className="nav-item" type="button" onClick={() => alert('Chức năng Hợp đồng')}>
            <span className="nav-icon">📝</span>
            <span className="nav-text">Quản lý Hợp đồng</span>
          </button>
          <button className="nav-item" type="button" onClick={() => alert('Chức năng Khách hàng')}>
            <span className="nav-icon">👥</span>
            <span className="nav-text">Quản lý Khách hàng</span>
          </button>
          <button className="nav-item" type="button" onClick={() => alert('Chức năng Thanh toán')}>
            <span className="nav-icon">💰</span>
            <span className="nav-text">Quản lý Thanh toán</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user-card">
            <div className="user-avatar">SA</div>
            <div className="user-meta">
              <strong id="adminSidebarGreeting">{currentUser?.fullName || 'Xin chào, Sales'}</strong>
              <span>Kinh doanh</span>
            </div>
          </div>
          <button id="logoutButton" className="btn-sidebar-logout" type="button" title="Đăng xuất" onClick={logout}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle-btn"
              id="sidebarToggle"
              type="button"
              aria-label="Toggle Sidebar"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
            <div>
              <h1 className="topbar-title">Bảng điều khiển Sales</h1>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-actions">
              <Link to="/" className="topbar-action-link" target="_blank" style={{ textDecoration: 'none', color: '#172333', fontSize: '0.9rem', marginRight: '16px', fontWeight: 600 }}>
                🌐 Xem Website
              </Link>
              <div className="status-indicator">
                <span className="indicator-dot"></span>
                <span>Hệ thống online</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-tab-pane active" style={{ padding: '2rem' }}>
            <header className="content-header" style={{ marginBottom: '2rem' }}>
              <h1>Bảng điều khiển Sales</h1>
              <p>Theo dõi doanh thu hợp đồng và khách hàng tiềm năng.</p>
            </header>

            <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <article className="metric-card metric-card--revenue">
                <div className="metric-header">
                  <div className="metric-icon">₫</div>
                  <span className="metric-trend positive">+14.5%</span>
                </div>
                <div className="metric-body">
                  <h3>Tổng doanh thu (Tháng này)</h3>
                  <div className="metric-value">710.000.000 đ</div>
                  <p className="metric-subtext" style={{ color: '#64748b' }}>Đạt 85% KPI</p>
                </div>
              </article>
              <article className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon">📝</div>
                  <span className="metric-trend positive">+3 hợp đồng</span>
                </div>
                <div className="metric-body">
                  <h3>Hợp đồng mới</h3>
                  <div className="metric-value">12</div>
                  <p className="metric-subtext" style={{ color: '#64748b' }}>So với tháng trước</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
