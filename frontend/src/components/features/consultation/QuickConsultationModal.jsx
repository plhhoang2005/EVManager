import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const QuickConsultationModal = ({
  isOpen,
  onClose,
  service,
  currentUser,
  isAuthenticated,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    guestCount: 150,
    venuePreference: 'Sảnh Kim Cương (Diamond Hall)',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Tự động điền thông tin khách hàng và loại sự kiện khi modal mở
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14); // 2 tuần sau
      const dateStr = defaultDate.toISOString().split('T')[0];

      setFormData({
        fullName: currentUser?.fullName || currentUser?.name || '',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        eventType: service?.name || service?.type || 'Tiệc cưới trọn gói cao cấp',
        eventDate: dateStr,
        guestCount: 150,
        venuePreference: 'Sảnh Kim Cương (Diamond Hall)',
        notes: '',
      });
    }
  }, [isOpen, service, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      if (onSuccess) {
        onSuccess(formData);
      }
    }, 600);
  };

  return (
    <div className="admin-modal open" id="quickConsultationModal" style={{ zIndex: 9999 }}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div
        className="modal-card"
        style={{
          maxWidth: '620px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #087f82 0%, #0e7490 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              BẢNG ĐĂNG KÝ TƯ VẤN NHANH
            </span>
            <h3 style={{ margin: '6px 0 0 0', fontSize: '1.3rem', color: '#ffffff' }}>
              {service?.icon || '✨'} {service?.name || 'Đăng ký tư vấn dịch vụ'}
            </h3>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            style={{ color: '#ffffff', background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {submitted ? (
            /* TRẠNG THÁI GỬI THÀNH CÔNG */
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  background: '#dcfce7',
                  color: '#15803d',
                  borderRadius: '50%',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '8px' }}>
                Đăng Ký Tư Vấn Thành Công!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 20px' }}>
                Cảm ơn quý khách <strong>{formData.fullName}</strong> đã đăng ký tư vấn dịch vụ <strong>{formData.eventType}</strong>. Chuyên viên tư vấn sự kiện của LV34 sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> trong vòng 15 phút!
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: '#334155',
                  marginBottom: '24px',
                }}
              >
                <div>• <strong>Loại sự kiện:</strong> {formData.eventType}</div>
                <div>• <strong>Ngày dự kiến:</strong> {formData.eventDate}</div>
                <div>• <strong>Quy mô ước tính:</strong> {formData.guestCount} khách</div>
                <div>• <strong>Sảnh ưa thích:</strong> {formData.venuePreference}</div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ padding: '10px 28px', fontWeight: 700 }}
              >
                Hoàn tất & Đóng
              </button>
            </div>
          ) : (
            /* FORM ĐĂNG KÝ TƯ VẤN */
            <form onSubmit={handleSubmit}>
              {/* THÔNG BÁO TÀI KHOẢN ĐÃ ĐĂNG NHẬP */}
              {isAuthenticated ? (
                <div
                  style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f766e',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                  <div>
                    <strong>Đã nhận diện tài khoản:</strong> {currentUser?.fullName || currentUser?.name || currentUser?.username} ({currentUser?.email})
                    <div style={{ fontSize: '0.78rem', color: '#087f82' }}>Thông tin liên hệ của bạn đã được tự động điền sẵn bên dưới.</div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: '#c2410c',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <span>💡 Bạn đã có tài khoản? Đăng nhập để tự động điền nhanh</span>
                  <Link to="/login" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'underline' }}>
                    Đăng nhập ngay →
                  </Link>
                </div>
              )}

              {/* TRƯỜNG LOẠI SỰ KIỆN (ĐÃ TỰ ĐỘNG CHỌN THEO DỊCH VỤ VỪA ẤN) */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                  Hạng mục / Dịch vụ đăng ký *
                </label>
                <input
                  type="text"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '2px solid #087f82',
                    background: '#f0fdfa',
                    fontWeight: 700,
                    color: '#087f82',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              {/* HỌ TÊN VÀ SỐ ĐIỆN THOẠI */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label htmlFor="regFullName" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Họ và tên của bạn *
                  </label>
                  <input
                    id="regFullName"
                    type="text"
                    placeholder="Nguyễn Văn An"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regPhone" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Số điện thoại nhận tư vấn *
                  </label>
                  <input
                    id="regPhone"
                    type="tel"
                    placeholder="0901234567"
                    required
                    pattern="^(0[3|5|7|8|9])[0-9]{8}$"
                    title="Số điện thoại phải gồm 10 số (03x, 05x, 07x, 08x, 09x)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
              </div>

              {/* EMAIL VÀ NGÀY DỰ KIẾN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label htmlFor="regEmail" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Địa chỉ Email nhận báo giá *
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    placeholder="khachhang@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regEventDate" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Ngày dự kiến *
                  </label>
                  <input
                    id="regEventDate"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
              </div>

              {/* QUY MÔ KHÁCH & SẢNH ƯA THÍCH */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label htmlFor="regGuestCount" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Quy mô khách mời ước tính
                  </label>
                  <input
                    id="regGuestCount"
                    type="number"
                    min="20"
                    max="3000"
                    step="10"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="regVenuePref" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                    Sảnh tiệc quan tâm
                  </label>
                  <select
                    id="regVenuePref"
                    value={formData.venuePreference}
                    onChange={(e) => setFormData({ ...formData, venuePreference: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                    }}
                  >
                    <option value="Sảnh Kim Cương (Diamond Hall)">Sảnh Kim Cương (Đến 500 khách)</option>
                    <option value="Sảnh Hoàng Gia (Imperial Hall)">Sảnh Hoàng Gia (Đến 800 khách)</option>
                    <option value="Sảnh Ngọc Bích (Emerald Hall)">Sảnh Ngọc Bích (Đến 300 khách)</option>
                    <option value="Sảnh Ruby & Bạch Kim">Sảnh Ruby & Bạch Kim (VIP)</option>
                    <option value="Cần chuyên viên tư vấn sảnh phù hợp">Cần tư vấn sảnh phù hợp</option>
                  </select>
                </div>
              </div>

              {/* YÊU CẦU CHI TIẾT */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="regNotes" style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  Ghi chú hoặc yêu cầu riêng của quý khách:
                </label>
                <textarea
                  id="regNotes"
                  rows="2"
                  placeholder="Ví dụ: Mong muốn tư vấn thêm về gói âm thanh ánh sáng, menu món hải sản..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                  }}
                ></textarea>
              </div>

              {/* NÚT THAO TÁC */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                  style={{ padding: '10px 20px', fontWeight: 600 }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ padding: '10px 24px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Tư Vấn Ngay →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickConsultationModal;
