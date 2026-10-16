import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, currentUser, logout, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Tự động đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Đóng mobile menu khi click ra ngoài thanh navbar
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuOpen && !e.target.closest('#topNavbar')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [mobileMenuOpen]);

  const getCustomerDisplayName = () => {
    const name = currentUser?.fullName || currentUser?.name;
    if (!name || name === 'Khách hàng Thành viên') {
      return 'Khách hàng';
    }
    return name;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="home-navbar" id="topNavbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" id="brandLogo" onClick={closeMenu}>
          <span className="brand-icon">◒</span>
          <span className="brand-text">LV34 <span>EVENTS</span></span>
        </Link>

        <nav className={`nav-menu ${mobileMenuOpen ? 'open active' : ''}`} id="navMenu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Trang chủ
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Dịch vụ
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Menu thực đơn
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Tính chi phí
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Sự kiện tiêu biểu
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Lịch sắp tới
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Liên hệ
          </NavLink>
        </nav>

        <div className="nav-actions" id="navActions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              {isStaff ? (
                <>
                  <Link
                    to="/admin"
                    className="btn btn-outline"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.82rem',
                      height: '34px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  >
                    ⚙️ Quản trị
                  </Link>
                  <Link
                    to="/user"
                    className="btn btn-outline"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.82rem',
                      height: '34px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                    title="Thay đổi thông tin cá nhân"
                  >
                    <span>👤</span> <span>{currentUser?.fullName || 'Cá nhân'}</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/user"
                  className="btn btn-outline"
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.82rem',
                    height: '34px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                  title="Hồ sơ & Thay đổi thông tin cá nhân"
                >
                  <span>👤</span> <span>{getCustomerDisplayName()}</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="btn btn-primary"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.82rem',
                  height: '34px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  background: '#e11d48',
                  borderColor: '#e11d48',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{
                  padding: '5px 14px',
                  fontSize: '0.82rem',
                  height: '34px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '5px 14px',
                  fontSize: '0.82rem',
                  height: '34px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Đăng ký
              </Link>
            </>
          )}

          <button
            className={`mobile-toggle ${mobileMenuOpen ? 'open active' : ''}`}
            id="mobileMenuBtn"
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
