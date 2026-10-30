import React, { useState } from 'react';

export const GalleryPage = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div>
      {/* PAGE BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 30px' }}>
        <div className="section-container" style={{ padding: 0, textAlign: 'center' }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>THƯ VIỆN DỰ ÁN THỰC TẾ</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Hình Ảnh <span>Sự Kiện Tiêu Biểu</span>
          </h1>
          <p className="section-subtitle">
            Khám phá hình ảnh và thông tin chi tiết từ các sự kiện quy mô do LV34 thiết kế và thực thi.
          </p>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery-section" style={{ padding: '40px 0 80px' }}>
        <div className="section-container">
          <div className="section-header space-between" style={{ marginBottom: '30px' }}>
            <div>
              <p className="eyebrow">BỘ SƯU TẬP DỰ ÁN</p>
              <h2 className="section-title">Hình Ảnh Thực Tế</h2>
            </div>
            <div className="gallery-filters" id="galleryFilters">
              <button
                type="button"
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`filter-btn ${filter === 'wedding' ? 'active' : ''}`}
                onClick={() => setFilter('wedding')}
              >
                Tiệc cưới
              </button>
              <button
                type="button"
                className={`filter-btn ${filter === 'corporate' ? 'active' : ''}`}
                onClick={() => setFilter('corporate')}
              >
                Hội nghị
              </button>
            </div>
          </div>

          <div className="gallery-grid" id="galleryGrid">
            {(filter === 'all' || filter === 'wedding') && (
              <div className="gallery-item" data-category="wedding">
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
            {(filter === 'all' || filter === 'corporate') && (
              <div className="gallery-item" data-category="corporate">
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
            {(filter === 'all' || filter === 'wedding') && (
              <div className="gallery-item" data-category="wedding">
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
    </div>
  );
};

export default GalleryPage;
