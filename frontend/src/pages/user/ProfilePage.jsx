import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import MenuSelectionWizard from '../../components/features/menu/MenuSelectionWizard';

export const ProfilePage = () => {
  const { currentUser, updateCurrentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'schedule' | 'contracts' | 'menu-wizard'

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Lấy chính xác tên đăng nhập của tài khoản đang đăng nhập
  const getLoggedInUsername = () => {
    if (currentUser?.username) return currentUser.username;
    try {
      const stored = sessionStorage.getItem('userInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username) return parsed.username;
      }
    } catch {
      // ignore
    }
    return currentUser?.email ? currentUser.email.split('@')[0] : 'khachhang1';
  };

  // Giá trị khởi tạo
  const getInitialProfile = () => ({
    fullName: currentUser?.fullName || currentUser?.name || 'Nguyễn Văn Minh',
    username: getLoggedInUsername(),
    email: currentUser?.email || 'customer@evmanager.vn',
    phone: currentUser?.phone || '0901234567',
    address: currentUser?.address || 'Tầng 12, Tòa nhà Landmark, Quận 1, TP. Hồ Chí Minh',
    notes:
      currentUser?.notes ||
      'Sở thích tông màu trang trí Pastel (Hồng - Trắng). Thực đơn ưu tiên món hải sản tươi sống và bàn tiệc phong cách hoàng gia.',
  });

  // State thông tin cá nhân
  const [profileForm, setProfileForm] = useState(getInitialProfile());
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Tự động đồng bộ khi currentUser được nạp
  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        fullName: currentUser.fullName || currentUser.name || prev.fullName,
        username: currentUser.username || getLoggedInUsername(),
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        notes: currentUser.notes || prev.notes,
      }));
    }
  }, [currentUser]);

  // State đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Bật/Tắt ẩn hiện mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Đánh giá độ mạnh mật khẩu
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: '#e2e8f0' };
    if (pwd.length < 6) return { score: 1, text: 'Yếu (Dưới 6 ký tự)', color: '#ef4444' };
    const hasNumbers = /\d/.test(pwd);
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    if (pwd.length >= 8 && hasNumbers && hasLetters && hasSpecial) {
      return { score: 3, text: 'Rất mạnh (Bảo mật cao)', color: '#10b981' };
    }
    if (pwd.length >= 6 && hasNumbers && hasLetters) {
      return { score: 2, text: 'Trung bình', color: '#f59e0b' };
    }
    return { score: 1, text: 'Yếu', color: '#ef4444' };
  };
  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setPhoneError('');

    if (!profileForm.fullName.trim()) {
      showToast('Vui lòng nhập họ và tên đại diện!', 'error');
      return;
    }

    // Ràng buộc số điện thoại hợp lệ đúng 10 chữ số bắt đầu bằng số 0
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(profileForm.phone.trim())) {
      setPhoneError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0 (ví dụ: 0901234567).');
      showToast('Số điện thoại phải gồm đúng 10 chữ số!', 'error');
      return;
    }

    if (!profileForm.email.trim()) {
      showToast('Vui lòng nhập địa chỉ email nhận thông báo!', 'error');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await userService.updateProfile(profileForm);
      if (updateCurrentUser) {
        updateCurrentUser({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          email: profileForm.email,
          address: profileForm.address,
          notes: profileForm.notes,
        });
      }
      showToast('Lưu thông tin cá nhân thành công!', 'success');
    } catch {
      showToast('Không thể cập nhật thông tin lúc này. Vui lòng thử lại!', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Xử lý hủy thay đổi
  const handleResetProfile = () => {
    setProfileForm(getInitialProfile());
    setPhoneError('');
    showToast('Đã khôi phục lại thông tin ban đầu!', 'info');
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại đang sử dụng!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có độ dài tối thiểu từ 6 ký tự!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp với mật khẩu mới!');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await userService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showToast('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '36px auto 80px', padding: '0 24px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background:
              toastMessage.type === 'success'
                ? '#087f82'
                : toastMessage.type === 'info'
                ? '#0284c7'
                : '#e11d48',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{toastMessage.type === 'success' ? '✔' : toastMessage.type === 'info' ? 'ℹ' : '⚠'}</span>
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* BỐ CỤC 2 CỘT HIỆN ĐẠI & CÂN ĐỐI (PORTAL DASHBOARD) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px minmax(0, 1fr)',
          gap: '28px',
          alignItems: 'flex-start',
        }}
        className="profile-dashboard-layout"
      >
        {/* ========================================================
            CỘT TRÁI: HỒ SƠ TÓM TẮT & MENU ĐIỀU HƯỚNG DỌC
            ======================================================== */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Đại diện cá nhân */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Header bìa gradient mini */}
            <div
              style={{
                height: '80px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #087f82 100%)',
                position: 'relative',
              }}
            ></div>

            {/* Avatar & Thông tin chính */}
            <div style={{ padding: '0 24px 24px', textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #087f82 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '-42px auto 12px',
                  boxShadow: '0 6px 18px rgba(8, 127, 130, 0.35)',
                  border: '4px solid #ffffff',
                }}
              >
                {profileForm.fullName ? profileForm.fullName.charAt(0).toUpperCase() : 'U'}
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                {profileForm.fullName}
              </h2>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                }}
              >
                <span>👤</span> @{profileForm.username}
              </div>

              <div>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#047857',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    textTransform: 'uppercase',
                  }}
                >
                  Khách hàng VIP 💎
                </span>
              </div>

              {/* Thông số nhanh mini */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sự kiện</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>1 Tiệc</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Hợp đồng</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#087f82' }}>220 Triệu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Menu Điều hướng Dọc (Vertical Tab Selector) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '12px',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'profile' ? '#f0fdfa' : 'transparent',
                color: activeTab === 'profile' ? '#087f82' : '#475569',
                fontWeight: activeTab === 'profile' ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>👤</span>
              <span style={{ flex: 1 }}>Thông tin cá nhân</span>
              {activeTab === 'profile' && <span style={{ color: '#087f82' }}>›</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'password' ? '#f0fdfa' : 'transparent',
                color: activeTab === 'password' ? '#087f82' : '#475569',
                fontWeight: activeTab === 'password' ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>🔒</span>
              <span style={{ flex: 1 }}>Đổi mật khẩu</span>
              {activeTab === 'password' && <span style={{ color: '#087f82' }}>›</span>}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'schedule' ? '#f0fdfa' : 'transparent',
                color: activeTab === 'schedule' ? '#087f82' : '#475569',
                fontWeight: activeTab === 'schedule' ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>📅</span>
              <span style={{ flex: 1 }}>Sự kiện & Lịch trình</span>
              <span
                style={{
                  background: activeTab === 'schedule' ? '#087f82' : '#e2e8f0',
                  color: activeTab === 'schedule' ? '#fff' : '#64748b',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                1
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contracts')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'contracts' ? '#f0fdfa' : 'transparent',
                color: activeTab === 'contracts' ? '#087f82' : '#475569',
                fontWeight: activeTab === 'contracts' ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>📑</span>
              <span style={{ flex: 1 }}>Hợp đồng & Thanh toán</span>
              <span
                style={{
                  background: activeTab === 'contracts' ? '#087f82' : '#e2e8f0',
                  color: activeTab === 'contracts' ? '#fff' : '#64748b',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                1
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('menu-wizard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'menu-wizard' ? '#f0fdfa' : 'transparent',
                color: activeTab === 'menu-wizard' ? '#087f82' : '#475569',
                fontWeight: activeTab === 'menu-wizard' ? 700 : 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>🍽️</span>
              <span style={{ flex: 1 }}>Chọn Thực Đơn Tiệc Cưới</span>
              <span
                style={{
                  background: '#087f82',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                Mới
              </span>
            </button>

            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '6px', paddingTop: '8px' }}>
              <Link
                to="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <span>💬</span>
                <span>Hỗ trợ & Liên hệ tư vấn</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#e11d48',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🚪</span>
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================
            CỘT PHẢI: KHUNG NỘI DUNG CHÍNH (DYNAMIC CONTENT)
            ======================================================== */}
        <main
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
            padding: '32px',
            minHeight: '520px',
          }}
        >
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>👤</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Thông tin cá nhân
                  </h2>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                  Cập nhật các thông tin cơ bản để nhận thông báo xác nhận lịch tiệc và đối soát hợp đồng dịch vụ.
                </p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '22px',
                    marginBottom: '26px',
                  }}
                >
                  {/* Tên đăng nhập (Read-only) */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Tên đăng nhập (Tài khoản đang đăng nhập)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={profileForm.username}
                        readOnly
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          color: '#475569',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                        }}
                      />
                      <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1rem' }}>🔒</span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '11px',
                          background: '#e2e8f0',
                          color: '#64748b',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        Cố định
                      </span>
                    </div>
                    <small style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Tên đăng nhập gắn liền với tài khoản hệ thống của bạn
                    </small>
                  </div>

                  {/* Họ và tên đại diện */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Họ và tên đại diện *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Ví dụ: Nguyễn Văn Minh"
                        required
                      />
                      <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1rem' }}>👤</span>
                    </div>
                    <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Tên người đứng tên hợp đồng và nhận bàn tiệc
                    </small>
                  </div>

                  {/* Địa chỉ Email */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Địa chỉ Email nhận thông báo *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="example@evmanager.vn"
                        required
                      />
                      <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1rem' }}>✉️</span>
                    </div>
                    <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Dùng để nhận file hợp đồng PDF và biên lai thanh toán
                    </small>
                  </div>

                  {/* Số điện thoại (10 chữ số) */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Số điện thoại liên hệ (10 chữ số) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        maxLength={10}
                        value={profileForm.phone}
                        onChange={(e) => {
                          setProfileForm({ ...profileForm, phone: e.target.value });
                          if (phoneError) setPhoneError('');
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: phoneError ? '1px solid #e11d48' : '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Ví dụ: 0901234567"
                        required
                      />
                      <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1rem' }}>📞</span>
                    </div>
                    {phoneError ? (
                      <div style={{ color: '#e11d48', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                        ⚠ {phoneError}
                      </div>
                    ) : (
                      <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                        Định dạng 10 chữ số bắt đầu bằng số 0
                      </small>
                    )}
                  </div>

                  {/* Địa chỉ liên hệ (Full width 2 cột) */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Địa chỉ liên hệ / Gửi hợp đồng thực tế
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Nhập địa chỉ nhà riêng hoặc cơ quan để gửi hợp đồng và hóa đơn..."
                      />
                      <span style={{ position: 'absolute', left: '12px', top: '12px', fontSize: '1rem' }}>📍</span>
                    </div>
                  </div>

                  {/* Ghi chú & Yêu cầu đặc biệt (Full width 2 cột) */}
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Ghi chú / Yêu cầu đặc biệt (Sở thích ẩm thực &amp; Trang trí tiệc)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        rows={3}
                        value={profileForm.notes}
                        onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          lineHeight: '1.5',
                        }}
                        placeholder="Ghi chú sở thích về tông màu hoa tươi, yêu cầu thực đơn chay/dị ứng, màn hình LED, ban nhạc..."
                      ></textarea>
                      <span style={{ position: 'absolute', left: '12px', top: '14px', fontSize: '1rem' }}>📝</span>
                    </div>
                    <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      Đội ngũ điều phối viên sẽ ưu tiên chuẩn bị theo các lưu ý này khi lên kế hoạch sự kiện
                    </small>
                  </div>
                </div>

                {/* Footer nút hành động cân đối */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '14px',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '20px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="btn btn-outline"
                    style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.95rem', borderRadius: '10px' }}
                  >
                    ✕ Hủy thay đổi
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdatingProfile}
                    style={{
                      padding: '12px 30px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: '10px',
                      boxShadow: '0 4px 14px rgba(8, 127, 130, 0.25)',
                    }}
                  >
                    {isUpdatingProfile ? 'Đang lưu...' : '💾 Lưu Thông Tin Cá Nhân'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🔒</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Đổi mật khẩu tài khoản
                  </h2>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                  Thiết lập mật khẩu an toàn với độ dài từ 6 ký tự trở lên để bảo vệ tài khoản cá nhân.
                </p>
              </div>

              {passwordError && (
                <div
                  style={{
                    padding: '14px 18px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '10px',
                    color: '#b91c1c',
                    fontSize: '0.92rem',
                    marginBottom: '24px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>⚠</span> {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ maxWidth: '620px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '28px' }}>
                  {/* Mật khẩu hiện tại */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Mật khẩu hiện tại *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 46px 12px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Nhập mật khẩu đang sử dụng"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        title={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          color: '#64748b',
                          padding: '4px',
                        }}
                      >
                        {showCurrentPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Mật khẩu mới (Tối thiểu 6 ký tự) *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 46px 12px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          color: '#64748b',
                          padding: '4px',
                        }}
                      >
                        {showNewPassword ? '🙈' : '👁️'}
                      </button>
                    </div>

                    {/* Thước đo độ mạnh mật khẩu */}
                    {passwordForm.newPassword && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', height: '6px', marginBottom: '6px' }}>
                          <div
                            style={{
                              flex: 1,
                              borderRadius: '4px',
                              background: passwordStrength.score >= 1 ? passwordStrength.color : '#e2e8f0',
                            }}
                          ></div>
                          <div
                            style={{
                              flex: 1,
                              borderRadius: '4px',
                              background: passwordStrength.score >= 2 ? passwordStrength.color : '#e2e8f0',
                            }}
                          ></div>
                          <div
                            style={{
                              flex: 1,
                              borderRadius: '4px',
                              background: passwordStrength.score >= 3 ? passwordStrength.color : '#e2e8f0',
                            }}
                          ></div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: passwordStrength.color, fontWeight: 700 }}>
                          Độ an toàn: {passwordStrength.text}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Xác nhận lại mật khẩu mới */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Xác nhận lại mật khẩu mới *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 46px 12px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                        }}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          color: '#64748b',
                          padding: '4px',
                        }}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdatingPassword}
                    style={{
                      padding: '12px 28px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: '10px',
                      boxShadow: '0 4px 14px rgba(8, 127, 130, 0.25)',
                    }}
                  >
                    {isUpdatingPassword ? 'Đang cập nhật...' : '🔑 Cập nhật mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SỰ KIỆN & LỊCH TRÌNH */}
          {activeTab === 'schedule' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📅</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Sự kiện & Lịch trình của tôi
                  </h2>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                  Theo dõi thời gian tổ chức, địa điểm sảnh tiệc và tiến độ chuẩn bị sự kiện.
                </p>
              </div>

              {/* 2 Metric Card cân đối */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div
                  style={{
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 700, marginBottom: '6px' }}>
                    SỰ KIỆN SẮP TỚI
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    Lễ cưới Hoàng Gia - Anh Minh &amp; Chị Mai
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>⏰ 15/10/2026 17:30 - 22:30</div>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, marginBottom: '6px' }}>
                    ĐỊA ĐIỂM SẢNH TIỆC
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    Sảnh Kim Cương (Diamond Hall)
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>🏛️ Tầng 1 - Sức chứa 500 khách</div>
                </div>
              </div>

              {/* Bảng chi tiết */}
              <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th>Mã SK</th>
                      <th>Tên Sự Kiện</th>
                      <th>Thời gian bắt đầu</th>
                      <th>Thời gian kết thúc</th>
                      <th>Sảnh tiệc</th>
                      <th>Số lượng khách</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>SK-101</strong></td>
                      <td><strong style={{ color: '#087f82' }}>Lễ cưới Hoàng Gia - Anh Minh &amp; Chị Mai</strong></td>
                      <td>15/10/2026 17:30</td>
                      <td>15/10/2026 22:30</td>
                      <td>Sảnh Kim Cương</td>
                      <td>300 khách</td>
                      <td>
                        {/* TRẠNG THÁI CHỈ ĐỂ TIẾNG VIỆT */}
                        <span className="status-badge status-confirmed">Đã lên lịch</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: HỢP ĐỒNG & THANH TOÁN */}
          {activeTab === 'contracts' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📑</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Hợp đồng &amp; Lịch sử thanh toán
                  </h2>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                  Theo dõi chi tiết giá trị hợp đồng, số tiền đặt cọc và các phiếu thu thanh toán đã đối soát.
                </p>
              </div>

              {/* 2 Metric Card cân đối */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: '6px' }}>
                    TỔNG GIÁ TRỊ HỢP ĐỒNG
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    220.000.000 ₫
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#15803d', fontWeight: 600 }}>
                    ✔ Đã thanh toán đợt 1: 66.000.000 ₫ (30%)
                  </div>
                </div>

                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, marginBottom: '6px' }}>
                    SỐ DƯ CẦN THANH TOÁN
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginBottom: '4px' }}>
                    154.000.000 ₫
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    Hạn thanh toán: Sau khi hoàn tất sự kiện tiệc cưới
                  </div>
                </div>
              </div>

              {/* BẢNG 1: HỢP ĐỒNG DỊCH VỤ */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  Hợp đồng dịch vụ tiệc cưới
                </h3>
                <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table className="admin-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th>Số HĐ</th>
                        <th>Sự kiện</th>
                        <th>Ngày ký kết</th>
                        <th className="text-right">Tổng giá trị</th>
                        <th className="text-right">Đã thanh toán</th>
                        <th className="text-right">Còn lại</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>HD-2026-001</strong></td>
                        <td><strong>Lễ cưới Hoàng Gia - Anh Minh &amp; Chị Mai</strong></td>
                        <td>01/10/2026</td>
                        <td className="text-right"><strong>220.000.000 ₫</strong></td>
                        <td className="text-right" style={{ color: '#087f82', fontWeight: 700 }}>66.000.000 ₫</td>
                        <td className="text-right" style={{ color: '#dc2626', fontWeight: 700 }}>154.000.000 ₫</td>
                        <td>
                          {/* TRẠNG THÁI HỢP ĐỒNG CHỈ TIẾNG VIỆT */}
                          <span className="status-badge status-confirmed">Đã xác nhận</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BẢNG 2: LỊCH SỬ PHIẾU THU */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                  Lịch sử phiếu thu &amp; Biên nhận
                </h3>
                <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table className="admin-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th>Mã Phiếu Thu</th>
                        <th>Đợt thanh toán</th>
                        <th>Hình thức</th>
                        <th>Ngày thu</th>
                        <th className="text-right">Số tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>TT-901</strong></td>
                        <td>Đặt cọc đợt 1 (30%)</td>
                        <td>Chuyển khoản (Vietcombank)</td>
                        <td>02/10/2026</td>
                        <td className="text-right"><strong style={{ color: '#087f82' }}>66.000.000 ₫</strong></td>
                        <td>
                          {/* TRẠNG THÁI PHIẾU THU CHỈ TIẾNG VIỆT */}
                          <span className="status-badge status-confirmed">Thành công</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WIZARD CHỌN THỰC ĐƠN TIỆC CƯỚI */}
          {activeTab === 'menu-wizard' && (
            <div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🍽️</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Lập Thực Đơn Tiệc Cưới Của Bạn
                  </h2>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.92rem' }}>
                  Tự tay lựa chọn các món ăn Khai vị, Món chính và Tráng miệng hoặc chọn Set Menu có sẵn để phục vụ cho sự kiện tiệc cưới của gia đình bạn.
                </p>
              </div>

              <MenuSelectionWizard
                onConfirmMenu={(menuData) => {
                  showToast(`Đã lưu thực đơn (${menuData.tableCount} bàn) vào hồ sơ tiệc cưới của bạn thành công! Chuyên viên tư vấn sẽ liên hệ để xác nhận.`, 'success');
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
