import React, { useState } from 'react';
import ConflictCheckerModal from '../../../components/features/ConflictCheckerModal';

export const CalendarTab = () => {
  const [showChecker, setShowChecker] = useState(false);

  return (
    <section id="tab-calendar" className="admin-tab-pane active">
      <div className="tab-header-row" style={{ marginBottom: '20px' }}>
        <div>
          <p className="panel-kicker" style={{ margin: 0 }}>LỊCH VẬN HÀNH TRỰC QUAN</p>
          <h2 style={{ margin: 0 }}>Lịch trình các sự kiện đã đặt</h2>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setShowChecker(true)}
          style={{ background: '#d9763d', borderColor: '#d9763d' }}
        >
          ⚡ Kiểm tra xung đột lịch
        </button>
      </div>

      <div className="panel calendar-panel" style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📅</div>
          <h3 style={{ fontWeight: 700, color: '#172333', marginBottom: '8px' }}>
            Lịch Vận Hành Sự Kiện LV34
          </h3>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 20px' }}>
            Hiển thị toàn bộ các ca sự kiện (Sáng 08:00 - 12:00, Chiều 13:00 - 17:00, Tối 17:30 - 22:00) trên 5 sảnh tiệc.
          </p>
          <button className="btn btn-outline btn-sm" type="button" onClick={() => setShowChecker(true)}>
            Mở công cụ kiểm tra xung đột trùng sảnh →
          </button>
        </div>
      </div>

      <ConflictCheckerModal show={showChecker} onHide={() => setShowChecker(false)} />
    </section>
  );
};

export default CalendarTab;
