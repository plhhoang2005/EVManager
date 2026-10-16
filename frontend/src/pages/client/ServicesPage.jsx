import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuickConsultationModal from '../../components/features/consultation/QuickConsultationModal';

export const ServicesPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      id: 'wedding',
      name: 'Tổ Chức Tiệc Cưới Sang Trọng',
      type: 'Tiệc Cưới',
      icon: '💒',
      img: '/images/wedding.jpg',
      tag: 'Phổ biến nhất',
      desc: 'Thiết kế không gian lãng mạn, kịch bản độc đáo, trang trí hoa tươi tinh tế và phục vụ chuyên nghiệp.',
      price: '50.000.000đ',
      features: [
        'Thiết kế concept cưới theo yêu cầu',
        'Sân khấu, âm thanh, ánh sáng hiện đại',
        'Nhân sự MC, Band nhạc, Chụp ảnh chuyên nghiệp',
        'Phục vụ tiệc cao cấp tiêu chuẩn 5 sao',
      ],
    },
    {
      id: 'corporate',
      name: 'Hội Nghị & Gala Doanh Nghiệp',
      type: 'Hội Nghị & Gala Doanh Nghiệp',
      icon: '👔',
      img: '/images/corporate.jpg',
      tag: 'Doanh nghiệp',
      highlightTag: true,
      desc: 'Tổ chức sự kiện hội thảo, ra mắt sản phẩm, lễ kỷ niệm thành lập và Gala Dinner nâng tầm thương hiệu.',
      price: '35.000.000đ',
      features: [
        'Màn hình LED cong 4K siêu nét',
        'Hệ thống livestream & dịch thuật cabin',
        'Quản lý check-in QR Code tự động',
        'Báo cáo thống kê khách mời tham dự',
      ],
    },
    {
      id: 'concert',
      name: 'Liveshow & Đại Nhạc Hội',
      type: 'Liveshow & Đại Nhạc Hội',
      icon: '🎸',
      img: '/images/hero_banner.jpg',
      tag: 'Quy mô lớn',
      desc: 'Dàn dựng sân khấu quy mô hàng ngàn khán giả với hiệu ứng khói lửa, laser và kỹ thuật âm thanh trình diễn đỉnh cao.',
      price: '120.000.000đ',
      features: [
        'Dàn âm thanh Line Array tiêu chuẩn quốc tế',
        'Hệ thống chiếu sáng lập trình 3D DMX',
        'Đội ngũ an ninh & hậu cần bài bản',
        'Xin cấp phép biểu diễn trọn gói',
      ],
    },
    {
      id: 'birthday',
      name: 'Tiệc Sinh Nhật & Kỷ Niệm Thôi Nôi',
      type: 'Sinh Nhật & Kỷ Niệm',
      icon: '🎂',
      img: '/images/birthday.jpg',
      tag: 'Ấm cúng',
      desc: 'Không gian ngọt ngào, trang trí bong bóng & hoa nghệ thuật, tiệc buffet bánh ngọt và các hoạt náo viên vui nhộn.',
      price: '15.000.000đ',
      features: [
        'Backdrop chụp ảnh check-in thiết kế theo chủ đề',
        'MC hoạt náo & Chú hề vặn bóng nghệ thuật',
        'Bánh kem sinh nhật nghệ thuật thiết kế riêng',
        'Khu vui chơi an toàn dành cho các bé',
      ],
    },
  ];

  const handleOpenConsultation = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* PAGE BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 40px' }}>
        <div className="section-container" style={{ padding: 0, textAlign: 'center' }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>DỊCH VỤ TRỌN GÓI LV34</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Giải Pháp Tổ Chức Sự Kiện <span>Chuyên Nghiệp</span>
          </h1>
          <p className="section-subtitle">
            Chúng tôi mang đến giải pháp trọn gói từ khâu lập kế hoạch, thiết kế kịch bản, trang trí không gian đến vận hành kỹ thuật hiện đại.
          </p>
        </div>
      </section>

      {/* MAIN SERVICES CONTENT */}
      <section className="services-section" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        <div className="section-container">
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.id} className="service-card">
                <div className="service-img-box">
                  <img
                    src={s.img}
                    alt={s.name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className={`service-tag ${s.highlightTag ? 'highlight' : ''}`}>{s.tag}</span>
                </div>
                <div className="service-body">
                  <div className="service-icon-wrap">{s.icon}</div>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <ul className="service-features">
                    {s.features.map((f, idx) => (
                      <li key={idx}>✓ {f}</li>
                    ))}
                  </ul>
                  <div className="service-footer">
                    <span className="service-price">
                      Từ <span>{s.price}</span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenConsultation(s)}
                      style={{ cursor: 'pointer', fontWeight: 600 }}
                    >
                      Đăng ký tư vấn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL BẢNG ĐĂNG KÝ TƯ VẤN NHANH */}
      <QuickConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default ServicesPage;
