import React from 'react';
import { Link } from 'react-router-dom';

export const SchedulePage = () => {
  return (
    <div>
      {/* PAGE BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 30px' }}>
        <div className="section-container" style={{ padding: 0, textAlign: 'center' }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>LỊCH TRÌNH CỘNG ĐỒNG</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Lịch Sự Kiện <span>Sắp Diễn Ra</span>
          </h1>
          <p className="section-subtitle">
            Theo dõi và đăng ký tham gia các sự kiện mở công khai do LV34 đồng tổ chức.
          </p>
        </div>
      </section>

      {/* PUBLIC SCHEDULE SECTION */}
      <section className="schedule-section" style={{ padding: '40px 0 80px' }}>
        <div className="section-container">
          <div className="schedule-list">
            <div className="schedule-card">
              <div className="date-badge">
                <span className="date-day">25</span>
                <span className="date-month">THÁNG 9</span>
              </div>
              <div className="schedule-info">
                <span className="event-tag badge-live">Đang diễn ra</span>
                <h3>Triển lãm Công nghệ Vận hành Sự kiện LV34</h3>
                <p>📍 Trung tâm Triển lãm SECC, Q.7, TP.HCM | ⏰ 09:00 - 18:00</p>
              </div>
              <Link to="/contact" className="btn btn-outline btn-sm">Xem chi tiết</Link>
            </div>

            <div className="schedule-card">
              <div className="date-badge">
                <span className="date-day">28</span>
                <span className="date-month">THÁNG 9</span>
              </div>
              <div className="schedule-info">
                <span className="event-tag badge-upcoming">Sắp diễn ra</span>
                <h3>Đêm Nhạc Từ Thiện - Nối Tròn Vòng Tay</h3>
                <p>📍 Nhà hát Hòa Bình, Q.10, TP.HCM | ⏰ 19:30 - 22:00</p>
              </div>
              <Link to="/contact" className="btn btn-outline btn-sm">Đăng ký tham gia</Link>
            </div>

            <div className="schedule-card">
              <div className="date-badge">
                <span className="date-day">05</span>
                <span className="date-month">THÁNG 10</span>
              </div>
              <div className="schedule-info">
                <span className="event-tag badge-upcoming">Sắp diễn ra</span>
                <h3>Hội Thảo Xu Hướng Đột Phá Tổ Chức Sự Kiện 2026</h3>
                <p>📍 Khách sạn InterContinental, Q.1, TP.HCM | ⏰ 14:00 - 17:30</p>
              </div>
              <Link to="/contact" className="btn btn-outline btn-sm">Đăng ký tham gia</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;
