import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuSelectionWizard from '../../components/features/menu/MenuSelectionWizard';
import { useAuth } from '../../context/AuthContext';

export const MenuWizardPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [savedMenu, setSavedMenu] = useState(null);

  const handleConfirmMenu = (menuData) => {
    setSavedMenu(menuData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="menu-wizard-page" style={{ paddingBottom: '80px' }}>
      {/* HERO BANNER */}
      <section className="hero-section" style={{ padding: '50px 0 30px', textAlign: 'center' }}>
        <div className="section-container" style={{ padding: 0 }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>ẨM THỰC TIỆC CƯỚI ĐẲNG CẤP & CÁ NHÂN HÓA</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '14px' }}>
            Chọn <span>Thực Đơn Tiệc Cưới</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto' }}>
            Khám phá tinh hoa ẩm thực Á - Âu. Tự do phối hợp các món Khai vị, Món chính và Tráng miệng theo phong cách riêng của bạn và nhận dự toán chi phí bàn tiệc chính xác tức thì.
          </p>
        </div>
      </section>

      {/* THÔNG BÁO KẾT QUẢ NẾU ĐÃ HOÀN TẤT CHỌN THỰC ĐƠN */}
      {savedMenu && (
        <div className="section-container" style={{ marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
            border: '2px solid #087f82',
            borderRadius: '16px',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 10px 25px -5px rgba(8, 127, 130, 0.15)',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0f766e', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                <span>🎉</span> BẠN ĐÃ TẠO THÀNH CÔNG THỰC ĐƠN TIỆC CƯỚI!
              </div>
              <h3 style={{ margin: '4px 0', color: '#0f172a', fontSize: '1.35rem' }}>
                Tổng quy mô: {savedMenu.tableCount} bàn chính (+{savedMenu.spareTables} bàn sơ cua) – {new Intl.NumberFormat('vi-VN').format(savedMenu.pricePerTable)} ₫/bàn
              </h3>
              <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem' }}>
                Tổng giá trị thực đơn: <strong style={{ color: '#087f82', fontSize: '1.15rem' }}>{new Intl.NumberFormat('vi-VN').format(savedMenu.totalCost)} ₫</strong>
                {savedMenu.vegetarianCount > 0 && ` | ${savedMenu.vegetarianCount} suất ăn chay`}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    alert('Thực đơn đã được đồng bộ vào trang Cá Nhân của bạn!');
                    navigate('/user');
                  }}
                  style={{ fontWeight: 700, padding: '10px 20px' }}
                >
                  👤 Xem trong Hồ sơ của tôi
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-primary"
                    style={{ fontWeight: 700, padding: '10px 20px', textDecoration: 'none' }}
                  >
                    🔑 Đăng nhập để lưu vào hợp đồng
                  </Link>
                  <Link
                    to="/contact"
                    className="btn btn-outline"
                    style={{ fontWeight: 600, padding: '10px 20px', textDecoration: 'none' }}
                  >
                    📞 Liên hệ tư vấn ngay
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WIZARD CHÍNH */}
      <div className="section-container">
        <MenuSelectionWizard
          onConfirmMenu={handleConfirmMenu}
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default MenuWizardPage;
