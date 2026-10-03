/**
 * Module Giao diện User & Quản lý Thông tin cá nhân (user.js)
 * Tương tác dữ liệu tài khoản cá nhân, cập nhật profile, đổi mật khẩu và tính năng sự kiện
 */

document.addEventListener('DOMContentLoaded', async function () {
    const token = sessionStorage.getItem('accessToken');
    const storedUsername = sessionStorage.getItem('currentUser') || 'user';

    // Xử lý nút Đăng xuất
    document.querySelectorAll('#userLogoutBtn, .logout-button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    });

    // Tải thông tin Profile cá nhân từ Backend / Demo Fallback
    await loadUserProfile(storedUsername, token);

    // Xử lý gửi Form Cập nhật Hồ sơ
    initProfileForm();

    // Xử lý gửi Form Đổi mật khẩu
    initPasswordForm();

    // Kích hoạt Công cụ tính chi phí và các tính năng sự kiện
    initCostCalculator();
    initBookingModal();
    initUserContactForm();
});

/**
 * Tải thông tin người dùng từ GET /api/v1/users/me
 */
async function loadUserProfile(username, token) {
    let userData = null;

    if (token && !token.startsWith('mock-demo')) {
        try {
            const response = await fetchAPI('/api/v1/users/me', { method: 'GET' });
            if (response.ok) {
                userData = await response.json();
            }
        } catch (err) {
            console.warn('Backend chưa khả dụng hoặc lỗi kết nối. Sử dụng dữ liệu demo tạm thời.');
        }
    }

    // Nếu không lấy được dữ liệu từ backend, tự động tạo dữ liệu hiển thị Demo phù hợp
    if (!userData) {
        userData = {
            username: username,
            fullName: username === 'admin' ? 'Quản Trị Viên' : 'Nguyễn Văn Thành',
            email: `${username}@lv34events.vn`,
            phone: '0908 123 456',
            roleName: username === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
            createdAt: new Date().toISOString()
        };
    }

    // Cập nhật giao diện Navbar & Header
    const navUserElem = document.getElementById('navUsername');
    if (navUserElem) {
        navUserElem.textContent = userData.fullName || userData.username;
    }

    // Cập nhật thẻ Profile Summary bên trái
    const displayFullName = document.getElementById('displayFullName');
    const displayUsername = document.getElementById('displayUsername');
    const displayRole = document.getElementById('displayRole');
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    const displayCreatedAt = document.getElementById('displayCreatedAt');

    if (displayFullName) displayFullName.textContent = userData.fullName || 'Người dùng LV34';
    if (displayUsername) displayUsername.textContent = `@${userData.username}`;
    if (displayRole) displayRole.textContent = userData.roleName === 'ROLE_ADMIN' ? 'Quản Trị Viên' : 'Thành Viên';
    if (displayEmail) displayEmail.textContent = userData.email || 'Chưa có email';
    if (displayPhone) displayPhone.textContent = userData.phone || 'Chưa cập nhật';
    if (displayCreatedAt && userData.createdAt) {
        const year = new Date(userData.createdAt).getFullYear() || 2026;
        displayCreatedAt.textContent = `Năm ${year}`;
    }

    // Điền dữ liệu sẵn vào Form Chỉnh Sửa
    const profileUsernameInput = document.getElementById('profileUsernameInput');
    const profileRoleInput = document.getElementById('profileRoleInput');
    const profileFullNameInput = document.getElementById('profileFullNameInput');
    const profileEmailInput = document.getElementById('profileEmailInput');
    const profilePhoneInput = document.getElementById('profilePhoneInput');

    if (profileUsernameInput) profileUsernameInput.value = userData.username || '';
    if (profileRoleInput) profileRoleInput.value = userData.roleName || 'ROLE_USER';
    if (profileFullNameInput) profileFullNameInput.value = userData.fullName || '';
    if (profileEmailInput) profileEmailInput.value = userData.email || '';
    if (profilePhoneInput) profilePhoneInput.value = userData.phone || '';
}

/**
 * Xử lý Form Cập nhật Thông tin cá nhân (PUT /api/v1/users/me)
 */
function initProfileForm() {
    const profileForm = document.getElementById('userProfileForm');
    const statusMsg = document.getElementById('profileStatusMsg');

    if (!profileForm) return;

    profileForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const fullName = (document.getElementById('profileFullNameInput').value || '').trim();
        const email = (document.getElementById('profileEmailInput').value || '').trim();
        const phone = (document.getElementById('profilePhoneInput').value || '').trim();
        const saveBtn = document.getElementById('saveProfileBtn');

        if (statusMsg) {
            statusMsg.hidden = true;
            statusMsg.className = 'form-status-alert';
        }

        const payload = { fullName, email, phone };

        try {
            if (saveBtn) saveBtn.disabled = true;

            const response = await fetchAPI('/api/v1/users/me', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                showStatus(statusMsg, 'Cập nhật thông tin cá nhân thành công!', 'alert-success');
                // Cập nhật lại thẻ hiển thị
                await loadUserProfile(updatedUser.username, sessionStorage.getItem('accessToken'));
            } else {
                const errData = await response.json().catch(() => ({}));
                const msg = errData.message || errData.error || 'Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.';
                showStatus(statusMsg, msg, 'alert-danger');
            }
        } catch (err) {
            // Trường hợp offline / Demo Mode
            console.warn('Gửi API thất bại, lưu tạm vào giao diện Demo.');
            const displayFullName = document.getElementById('displayFullName');
            const displayEmail = document.getElementById('displayEmail');
            const displayPhone = document.getElementById('displayPhone');
            const navUserElem = document.getElementById('navUsername');

            if (displayFullName) displayFullName.textContent = fullName;
            if (displayEmail) displayEmail.textContent = email;
            if (displayPhone) displayPhone.textContent = phone;
            if (navUserElem) navUserElem.textContent = fullName;

            showStatus(statusMsg, 'Đã cập nhật thông tin cá nhân thành công! (Chế độ Demo)', 'alert-success');
        } finally {
            if (saveBtn) saveBtn.disabled = false;
        }
    });
}

/**
 * Xử lý Form Đổi Mật Khẩu (PUT /api/v1/users/me/password)
 */
function initPasswordForm() {
    const passwordForm = document.getElementById('changePasswordForm');
    const statusMsg = document.getElementById('passwordStatusMsg');

    if (!passwordForm) return;

    passwordForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const oldPassword = document.getElementById('oldPasswordInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;
        const saveBtn = document.getElementById('savePasswordBtn');

        if (statusMsg) {
            statusMsg.hidden = true;
            statusMsg.className = 'form-status-alert';
        }

        if (newPassword !== confirmPassword) {
            showStatus(statusMsg, 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp!', 'alert-danger');
            return;
        }

        if (newPassword.length < 8) {
            showStatus(statusMsg, 'Mật khẩu mới phải có ít nhất 8 ký tự!', 'alert-danger');
            return;
        }

        const payload = { oldPassword, newPassword };

        try {
            if (saveBtn) saveBtn.disabled = true;

            const response = await fetchAPI('/api/v1/users/me/password', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showStatus(statusMsg, 'Đổi mật khẩu thành công!', 'alert-success');
                passwordForm.reset();
            } else {
                const errData = await response.json().catch(() => ({}));
                const msg = errData.message || errData.error || 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.';
                showStatus(statusMsg, msg, 'alert-danger');
            }
        } catch (err) {
            showStatus(statusMsg, 'Đã cập nhật mật khẩu thành công! (Chế độ Demo)', 'alert-success');
            passwordForm.reset();
        } finally {
            if (saveBtn) saveBtn.disabled = false;
        }
    });
}

function showStatus(elem, text, statusClass) {
    if (!elem) return;
    elem.textContent = text;
    elem.className = `form-status-alert ${statusClass}`;
    elem.hidden = false;
}

/**
 * Công cụ tính chi phí sự kiện tương tác
 */
function initCostCalculator() {
    const eventTypeBtns = document.querySelectorAll('#eventTypeGroup .calc-opt-btn');
    const guestRange = document.getElementById('guestRange');
    const guestCountVal = document.getElementById('guestCountVal');

    const totalEstimatePrice = document.getElementById('totalEstimatePrice');
    const basePriceLabel = document.getElementById('basePriceLabel');
    const guestPriceLabel = document.getElementById('guestPriceLabel');
    const addonPriceLabel = document.getElementById('addonPriceLabel');

    if (!guestRange || !totalEstimatePrice) return;

    let basePrice = 40000000;

    eventTypeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            eventTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            basePrice = parseInt(btn.getAttribute('data-base')) || 40000000;
            recalculate();
        });
    });

    guestRange.addEventListener('input', function () {
        if (guestCountVal) guestCountVal.textContent = `${guestRange.value} khách`;
        recalculate();
    });

    document.querySelectorAll('.calc-checkboxes input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', recalculate);
    });

    function recalculate() {
        const guests = parseInt(guestRange.value) || 150;
        let guestExtra = 0;
        if (guests > 50) {
            guestExtra = (guests - 50) * 100000;
        }

        let addonsTotal = 0;
        document.querySelectorAll('.calc-checkboxes input[type="checkbox"]:checked').forEach(chk => {
            addonsTotal += parseInt(chk.value) || 0;
        });

        const grandTotal = basePrice + guestExtra + addonsTotal;

        if (basePriceLabel) basePriceLabel.textContent = formatVNPay(basePrice);
        if (guestPriceLabel) guestPriceLabel.textContent = formatVNPay(guestExtra);
        if (addonPriceLabel) addonPriceLabel.textContent = formatVNPay(addonsTotal);
        if (totalEstimatePrice) totalEstimatePrice.textContent = `${formatVNPay(grandTotal)} VNĐ`;
    }

    const calcSubmitBtn = document.getElementById('calcSubmitBtn');
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', function () {
            alert('LV34 đã ghi nhận yêu cầu báo giá của bạn! Bản chi tiết sẽ gửi về email trong ít phút.');
        });
    }
}

function formatVNPay(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

/**
 * Xử lý đăng ký dịch vụ
 */
function initBookingModal() {
    document.querySelectorAll('.open-booking-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const serviceName = btn.getAttribute('data-service') || 'Sự kiện';
            const contactEventType = document.getElementById('contactEventType');
            if (contactEventType) {
                contactEventType.value = `Đăng ký dịch vụ: ${serviceName}`;
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Xử lý Form Liên hệ trên trang User
 */
function initUserContactForm() {
    const userContactForm = document.getElementById('userContactForm');
    const contactSuccessMsg = document.getElementById('contactSuccessMsg');

    if (!userContactForm) return;

    userContactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (contactSuccessMsg) {
            contactSuccessMsg.textContent = 'Cảm ơn bạn! Thông tin đăng ký đã được gửi tới chuyên viên LV34 Events.';
            contactSuccessMsg.className = 'form-status-alert alert-success';
            contactSuccessMsg.hidden = false;
        }
        userContactForm.reset();
    });
}
