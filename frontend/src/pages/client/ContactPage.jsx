import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ContactPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);

  const serviceParam = searchParams.get('service') || searchParams.get('type') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: serviceParam,
    message: '',
  });

  // Tự động điền thông tin người dùng nếu đã đăng nhập và đồng bộ loại dịch vụ
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.fullName || currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        eventType: serviceParam || prev.eventType,
      }));
    } else if (serviceParam) {
      setFormData((prev) => ({ ...prev, eventType: serviceParam }));
    }
  }, [currentUser, serviceParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({
      name: currentUser?.fullName || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      eventType: '',
      message: '',
    });
  };

  return (
    <div>
      {/* PAGE BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 30px' }}>
        <div className="section-container" style={{ padding: 0, textAlign: 'center' }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>TƯ VẤN 24/7</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Liên Hệ <span>LV34 Events</span>
          </h1>
          <p className="section-subtitle">
            Gửi thông tin cho chúng tôi để nhận kế hoạch & phương án ngân sách tối ưu nhất.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" style={{ padding: '40px 0 80px' }}>
        <div className="section-container">
          <div className="contact-card">
            <div className="contact-info-side">
              <p className="eyebrow">KẾT NỐI VỚI CHÚNG TÔI</p>
              <h2>Sẵn Sàng Cho Sự Kiện Đáng Nhớ Của Bạn?</h2>
              <p>
                Hãy gửi thông tin cho LV34. Chuyên viên tư vấn sự kiện của chúng tôi sẽ liên hệ và gửi bản kế hoạch chi tiết trong vòng 15 phút!
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <div>
                    <strong>Địa chỉ văn phòng:</strong>
                    <p>Tòa nhà LV34 Tower, Đường 3/2, Quận 10, TP. Hồ Chí Minh</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <div>
                    <strong>Hotline tư vấn 24/7:</strong>
                    <p>0908 123 456 - 028 38 888 999</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="icon">✉️</span>
                  <div>
                    <strong>Email hỗ trợ:</strong>
                    <p>contact@lv34events.vn</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-side">
              <form id="publicContactForm" className="contact-form" onSubmit={handleSubmit}>
                <h3>Đăng Ký Tư Vấn Nhanh</h3>

                {isAuthenticated && (
                  <div
                    style={{
                      background: '#f0fdfa',
                      border: '1px solid #99f6e4',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: '16px',
                      fontSize: '0.85rem',
                      color: '#0f766e',
                    }}
                  >
                    ✓ Đã tự động điền thông tin từ tài khoản <strong>{currentUser?.fullName || currentUser?.username}</strong>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="contactName">Họ và tên *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactPhone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="phone"
                      placeholder="0901234567"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contactEventType">Loại sự kiện & Dịch vụ quan tâm *</label>
                  <input
                    type="text"
                    id="contactEventType"
                    name="eventType"
                    placeholder="Ví dụ: Tiệc cưới sang trọng ngày 15/10/2026"
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactMessage">Yêu cầu chi tiết</label>
                  <textarea
                    id="contactMessage"
                    name="message"
                    rows="3"
                    placeholder="Ghi chú thêm về quy mô, ngân sách dự kiến..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                {success && (
                  <p id="contactSuccessMsg" className="form-success-alert" style={{ display: 'block' }}>
                    Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công. Chuyên viên LV34 sẽ liên hệ lại ngay!
                  </p>
                )}
                <button type="submit" className="btn btn-primary btn-block">Gửi Yêu Cầu Tư Vấn →</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
