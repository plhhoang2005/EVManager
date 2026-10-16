import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  // State cho bộ tính chi phí nhanh trên trang chủ
  const [eventType, setEventType] = useState('wedding');
  const [basePrice, setBasePrice] = useState(40000000);
  const [guestCount, setGuestCount] = useState(150);
  const [addons, setAddons] = useState({
    optStage: true,
    optSound: true,
    optMC: false,
    optMedia: true,
  });
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  // Tính toán
  const guestSurcharge = guestCount > 50 ? (guestCount - 50) * 150000 : 0;
  const addonTotal =
    (addons.optStage ? 15000000 : 0) +
    (addons.optSound ? 12000000 : 0) +
    (addons.optMC ? 8000000 : 0) +
    (addons.optMedia ? 10000000 : 0);
  const totalEstimate = basePrice + guestSurcharge + addonTotal;

  const handleSelectEventType = (type, price) => {
    setEventType(type);
    setBasePrice(price);
  };

  const handleToggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section" id="hero">
        <div className="hero-bg-glow"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Hệ Thống Tổ Chức & Quản Lý Sự Kiện Hàng Đầu</span>
            </div>
            <h1 className="hero-title">
              Tạo Nên Những Sự Kiện <span>Đẳng Cấp & Đáng Nhớ</span>
            </h1>
            <p className="hero-subtitle">
              Từ tiệc cưới sang trọng, hội nghị doanh nghiệp quy mô lớn đến các liveshow âm nhạc bùng nổ.
              LV34 mang đến giải pháp trọn gói từ khâu thiết kế, nhân sự, thiết bị đến vận hành hoàn hảo.
            </p>

            <div className="hero-cta-group">
              <Link to="/calculator" className="btn btn-primary btn-lg">
                📊 Tính Báo Giá Nhanh
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                📞 Đặt Lịch Tư Vấn
              </Link>
            </div>

            {/* Stats Pill */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">550+</span>
                <span className="stat-label">Sự kiện thành công</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">99.4%</span>
                <span className="stat-label">Khách hàng hài lòng</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Đối tác địa điểm</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card-wrapper">
              <img src="/images/hero_banner.jpg" alt="LV34 Luxury Event Banner" className="hero-img" onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="visual-glass-overlay">
                <div className="glass-badge">
                  <span className="glass-icon">🌟</span>
                  <div>
                    <strong>Đạt chuẩn 5 sao</strong>
                    <p>Âm thanh & Ánh sáng High-End</p>
                  </div>
                </div>
                <div className="glass-badge floating-right">
                  <span className="glass-icon">🎉</span>
                  <div>
                    <strong>100% Trọn Gói</strong>
                    <p>Không chi phí phát sinh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="section-container">
          <div className="section-header center">
            <p className="eyebrow">DỊCH VỤ CỦA CHÚNG TÔI</p>
            <h2 className="section-title">Giải Pháp Tổ Chức Trọn Gói</h2>
            <p className="section-subtitle">Lựa chọn dịch vụ phù hợp nhất với quy mô và mong muốn của bạn</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-img-box">
                <img src="/images/wedding.jpg" alt="Tiệc cưới sang trọng" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="service-tag">Phổ biến nhất</span>
              </div>
              <div className="service-body">
                <div className="service-icon-wrap">💒</div>
                <h3>Tổ Chức Tiệc Cưới Sang Trọng</h3>
                <p>Thiết kế không gian lãng mạn, kịch bản độc đáo, trang trí hoa tươi tinh tế và phục vụ chuyên nghiệp.</p>
                <ul className="service-features">
                  <li>✓ Thiết kế concept cưới theo yêu cầu</li>
                  <li>✓ Sân khấu, âm thanh, ánh sáng hiện đại</li>
                  <li>✓ Nhân sự MC, Band nhạc, Chụp ảnh chuyên nghiệp</li>
                </ul>
                <div className="service-footer">
                  <span className="service-price">Từ <span>50.000.000đ</span></span>
                  <Link to="/calculator" className="btn btn-outline btn-sm">Đăng ký ngay</Link>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-img-box">
                <img src="/images/corporate.jpg" alt="Hội nghị doanh nghiệp" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="service-tag highlight">Doanh nghiệp</span>
              </div>
              <div className="service-body">
                <div className="service-icon-wrap">👔</div>
                <h3>Hội Nghị & Gala Doanh Nghiệp</h3>
                <p>Tổ chức sự kiện hội thảo, ra mắt sản phẩm, lễ kỷ niệm thành lập và Gala Dinner nâng tầm thương hiệu.</p>
                <ul className="service-features">
                  <li>✓ Màn hình LED cong 4K siêu nét</li>
                  <li>✓ Hệ thống livestream & dịch thuật cabin</li>
                  <li>✓ Quản lý check-in QR Code tự động</li>
                </ul>
                <div className="service-footer">
                  <span className="service-price">Từ <span>35.000.000đ</span></span>
                  <Link to="/calculator" className="btn btn-outline btn-sm">Đăng ký ngay</Link>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-img-box">
                <img src="/images/hero_banner.jpg" alt="Liveshow & Event Âm Nhạc" onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="service-tag">Quy mô lớn</span>
              </div>
              <div className="service-body">
                <div className="service-icon-wrap">🎸</div>
                <h3>Liveshow & Đại Nhạc Hội</h3>
                <p>Dàn dựng sân khấu quy mô hàng ngàn khán giả với hiệu ứng khói lửa, laser và kỹ thuật âm thanh trình diễn đỉnh cao.</p>
                <ul className="service-features">
                  <li>✓ Dàn âm thanh Line Array tiêu chuẩn quốc tế</li>
                  <li>✓ Hệ thống chiếu sáng lập trình 3D DMX</li>
                  <li>✓ Đội ngũ an ninh & hậu cần bài bản</li>
                </ul>
                <div className="service-footer">
                  <span className="service-price">Từ <span>120.000.000đ</span></span>
                  <Link to="/calculator" className="btn btn-outline btn-sm">Đăng ký ngay</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE COST CALCULATOR */}
      <section className="calculator-section" id="calculator">
        <div className="section-container">
          <div className="calc-card">
            <div className="calc-header">
              <p className="eyebrow">DỰ TRÙ NGÂN SÁCH NHANH</p>
              <h2>Công Cụ Tính Chi Phí Sự Kiện Nhanh</h2>
              <p>Chọn các thông số bên dưới để nhận ước tính ngân sách chính xác trong 3 giây!</p>
            </div>

            <div className="calc-grid">
              <div className="calc-inputs">
                {/* Step 1: Loại sự kiện */}
                <div className="calc-group">
                  <label className="calc-label">1. Loại hình sự kiện</label>
                  <div className="calc-options" id="eventTypeGroup">
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'wedding' ? 'active' : ''}`}
                      onClick={() => handleSelectEventType('wedding', 40000000)}
                    >
                      💒 Tiệc cưới
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'corporate' ? 'active' : ''}`}
                      onClick={() => handleSelectEventType('corporate', 30000000)}
                    >
                      👔 Hội nghị / Gala
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'birthday' ? 'active' : ''}`}
                      onClick={() => handleSelectEventType('birthday', 15000000)}
                    >
                      🎂 Sinh nhật / Kỷ niệm
                    </button>
                    <button
                      type="button"
                      className={`calc-opt-btn ${eventType === 'concert' ? 'active' : ''}`}
                      onClick={() => handleSelectEventType('concert', 90000000)}
                    >
                      🎵 Concert / Festival
                    </button>
                  </div>
                </div>

                {/* Step 2: Số lượng khách */}
                <div className="calc-group">
                  <div className="calc-label-row">
                    <label className="calc-label" htmlFor="guestRange">2. Quy mô khách mời</label>
                    <span className="calc-value-badge" id="guestCountVal">{guestCount} khách</span>
                  </div>
                  <input
                    type="range"
                    id="guestRange"
                    min="20"
                    max="1000"
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="calc-slider"
                  />
                </div>

                {/* Step 3: Hạng mục dịch vụ đi kèm */}
                <div className="calc-group">
                  <label className="calc-label">3. Hạng mục bổ sung</label>
                  <div className="calc-checkboxes">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optStage}
                        onChange={() => handleToggleAddon('optStage')}
                      />
                      <span>Sân khấu & Màn LED HD (+15 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optSound}
                        onChange={() => handleToggleAddon('optSound')}
                      />
                      <span>Âm thanh & Ánh sáng cao cấp (+12 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optMC}
                        onChange={() => handleToggleAddon('optMC')}
                      />
                      <span>MC & Vũ đoàn biểu diễn (+8 triệu)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={addons.optMedia}
                        onChange={() => handleToggleAddon('optMedia')}
                      />
                      <span>Quay phim 4K & Chụp ảnh Flycam (+10 triệu)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="calc-result-box">
                <div className="result-card">
                  <span className="result-badge">Ước tính ngân sách</span>
                  <div className="result-amount" id="totalEstimatePrice">
                    {new Intl.NumberFormat('vi-VN').format(totalEstimate)} VNĐ
                  </div>
                  <p className="result-note">
                    * Giá chưa bao gồm VAT và địa điểm. Đã bao gồm trọn gói nhân sự kỹ thuật & chi phí vận chuyển trong nội thành.
                  </p>

                  <hr className="result-divider" />

                  <div className="result-breakdown">
                    <div className="bd-row">
                      <span>Phí gói cơ bản:</span>
                      <strong id="basePriceLabel">{new Intl.NumberFormat('vi-VN').format(basePrice)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Phụ thu số lượng khách:</span>
                      <strong id="guestPriceLabel">{new Intl.NumberFormat('vi-VN').format(guestSurcharge)}đ</strong>
                    </div>
                    <div className="bd-row">
                      <span>Dịch vụ bổ sung:</span>
                      <strong id="addonPriceLabel">{new Intl.NumberFormat('vi-VN').format(addonTotal)}đ</strong>
                    </div>
                  </div>

                  <Link to="/contact" className="btn btn-primary btn-block margin-top" id="calcSubmitBtn">
                    📩 Nhận Báo Giá Chi Tiết Qua Email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE GALLERY SECTION */}
      <section className="gallery-section" id="gallery">
        <div className="section-container">
          <div className="section-header space-between">
            <div>
              <p className="eyebrow">DỰ ÁN ĐÃ THỰC HIỆN</p>
              <h2 className="section-title">Hình Ảnh Sự Kiện Tiêu Biểu</h2>
            </div>
            <div className="gallery-filters">
              <button
                type="button"
                className={`filter-btn ${galleryFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('ALL')}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`filter-btn ${galleryFilter === 'WEDDING' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('WEDDING')}
              >
                Tiệc cưới
              </button>
              <button
                type="button"
                className={`filter-btn ${galleryFilter === 'CORPORATE' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('CORPORATE')}
              >
                Hội nghị
              </button>
            </div>
          </div>

          <div className="gallery-grid">
            {(galleryFilter === 'ALL' || galleryFilter === 'WEDDING') && (
              <div className="gallery-item">
                <img src="/images/wedding.jpg" alt="Lễ cưới Hoàng Gia tại GEM Center" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="item-overlay">
                  <div>
                    <h4>Lễ Cưới Hoàng Gia</h4>
                    <p>GEM Center • 500 Khách</p>
                  </div>
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
            )}
            {(galleryFilter === 'ALL' || galleryFilter === 'CORPORATE') && (
              <div className="gallery-item">
                <img src="/images/corporate.jpg" alt="Hội Nghị Tech Summit 2026" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="item-overlay">
                  <div>
                    <h4>Global Tech Summit 2026</h4>
                    <p>White Palace • 800 Khách</p>
                  </div>
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
            )}
            {galleryFilter === 'ALL' && (
              <div className="gallery-item">
                <img src="/images/hero_banner.jpg" alt="Gala & Liveshow Âm Nhạc Trực Tiếp" onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="item-overlay">
                  <div>
                    <h4>Liveshow Âm Nhạc Đêm Hội</h4>
                    <p>Sân vận động Quân Khu 7 • 3000 Khách</p>
                  </div>
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PUBLIC SCHEDULE SECTION */}
      <section className="schedule-section" id="schedule">
        <div className="section-container">
          <div className="section-header center">
            <p className="eyebrow">LỊCH SỰ KIỆN SẮP DIỄN RA</p>
            <h2 className="section-title">Lịch Trình Hoạt Động Cộng Đồng</h2>
            <p className="section-subtitle">Theo dõi các sự kiện mở rộng công khai do LV34 tổ chức</p>
          </div>

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
              <Link to="/schedule" className="btn btn-outline btn-sm">Xem chi tiết</Link>
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
              <Link to="/schedule" className="btn btn-outline btn-sm">Đăng ký tham gia</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header center">
            <p className="eyebrow">ĐÁNH GIÁ TỪ KHÁCH HÀNG</p>
            <h2 className="section-title">Niềm Tin Từ Hàng Trăm Đối Tác</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="quote">
                "LV34 đã làm việc hết sức chuyên nghiệp trong tiệc cưới của vợ chồng mình. Mọi khâu âm thanh, ánh sáng và hoa tươi đều hoàn hảo vượt mong đợi!"
              </p>
              <div className="author">
                <strong>Anh Minh & Chị Mai</strong>
                <span>Khách hàng Tiệc Cưới</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="quote">
                "Sự kiện Gala 10 Năm của tập đoàn chúng tôi diễn ra cực kỳ suôn sẻ. Hệ thống check-in QR và màn hình LED 4K vô cùng ấn tượng."
              </p>
              <div className="author">
                <strong>Ông Trần Văn Nam</strong>
                <span>Giám đốc MKT Tập đoàn TechCorp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="contact-section" id="contact">
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
              <form id="publicContactForm" className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.'); }}>
                <h3>Đăng Ký Tư Vấn Nhanh</h3>
                <div className="form-group">
                  <label htmlFor="contactName">Họ và tên *</label>
                  <input type="text" id="contactName" name="name" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactPhone">Số điện thoại *</label>
                    <input type="tel" id="contactPhone" name="phone" placeholder="0901234567" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email</label>
                    <input type="email" id="contactEmail" name="email" placeholder="example@gmail.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contactEventType">Loại sự kiện & Ngày dự kiến</label>
                  <input type="text" id="contactEventType" name="eventType" placeholder="Ví dụ: Tiệc cưới ngày 15/10/2026" />
                </div>
                <div className="form-group">
                  <label htmlFor="contactMessage">Yêu cầu chi tiết</label>
                  <textarea id="contactMessage" name="message" rows="3" placeholder="Ghi chú thêm về quy mô, ngân sách dự kiến..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Gửi Yêu Cầu Tư Vấn →</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
