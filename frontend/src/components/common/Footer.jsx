import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="section-container footer-content">
        <div className="footer-brand-col">
          <div className="nav-brand">
            <span className="brand-icon">◒</span>
            <span className="brand-text">LV34 <span>EVENTS</span></span>
          </div>
          <p>
            Hệ thống quản lý và tổ chức sự kiện chuyên nghiệp hàng đầu. Kiến tạo những trải nghiệm độc đáo và dịch vụ hoàn hảo.
          </p>
        </div>
        <div className="footer-links-col">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/services">Dịch vụ tổ chức</Link></li>
            <li><Link to="/calculator">Công cụ tính chi phí</Link></li>
            <li><Link to="/gallery">Thư viện sự kiện</Link></li>
          </ul>
        </div>
        <div className="footer-links-col">
          <h4>Tài khoản & Hệ thống</h4>
          <ul>
            <li><Link to="/login">Đăng nhập Quản trị</Link></li>
            <li><Link to="/register">Đăng ký tài khoản</Link></li>
            <li><Link to="/admin">Bảng điều khiển (Admin)</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 LV34 Event Operations. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
