/**
 * EVManager - Module Đăng Nhập & Phân Quyền RBAC (login.js)
 * Điều hướng theo vai trò (Admin, Sales, Coordinator) & Kiểm tra trạng thái khóa tài khoản từ Quản trị viên
 */

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    // Toggle ẩn/hiện mật khẩu
    document.querySelectorAll('.password-toggle').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = button.parentElement.querySelector('input');
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.textContent = isPassword ? 'Ẩn' : 'Hiện';
            button.setAttribute('aria-pressed', String(isPassword));
        });
    });

    // Xóa bỏ hoàn toàn cờ khóa tạm thời nếu có từ trước
    localStorage.removeItem('ev_login_lock_until');
    localStorage.removeItem('ev_failed_attempts');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const usernameOrEmail = (formData.get('username') || '').trim();
            const password = formData.get('password') || '';

            hideError();

            // Kiểm tra trạng thái tài khoản bị khóa trong hệ thống (UC-01 & Quản lý Phân quyền)
            if (checkIsUserLocked(usernameOrEmail)) {
                showError(`🚫 Tài khoản "${usernameOrEmail}" đã bị Quản trị viên KHÓA. Bạn không có quyền truy cập vào hệ thống!`);
                return;
            }

            const payload = {
                usernameOrEmail: usernameOrEmail,
                password: password
            };

            try {
                const response = await fetchAPI('/api/v1/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    // Kiểm tra lần nữa trạng thái khóa
                    if (checkIsUserLocked(usernameOrEmail)) {
                        showError(`🚫 Tài khoản "${usernameOrEmail}" đã bị Quản trị viên KHÓA.`);
                        return;
                    }

                    resetFailedAttempts();

                    // Xác định vai trò từ tên đăng nhập hoặc phản hồi
                    let userRole = 'USER';
                    const lowerUser = usernameOrEmail.toLowerCase();
                    if (lowerUser.includes('admin')) {
                        userRole = 'ADMIN';
                    } else if (lowerUser.includes('coord')) {
                        userRole = 'COORDINATOR';
                    } else if (lowerUser.includes('sale')) {
                        userRole = 'SALES';
                    }

                    sessionStorage.setItem('accessToken', data.accessToken);
                    sessionStorage.setItem('currentUser', usernameOrEmail);
                    window.location.href = 'admin.html';
                } else {
                    // Hỗ trợ đăng nhập nhanh bằng tài khoản demo mật khẩu 123 (kể cả khi backend đang chạy)
                    const mockRoles = {
                        'admin': 'ADMIN',
                        'user': 'USER',
                        'sale': 'SALES',
                        'sales01': 'SALES',
                        'coord': 'COORDINATOR',
                        'coord01': 'COORDINATOR'
                    };
                    const normUser = usernameOrEmail.toLowerCase();
                    if (mockRoles[normUser] && (password === '123' || password === 'Password1!')) {
                        resetFailedAttempts();
                        sessionStorage.setItem('accessToken', `mock-token-${usernameOrEmail}-${Date.now()}`);
                        sessionStorage.setItem('currentUser', usernameOrEmail);
                        sessionStorage.setItem('userRole', mockRoles[normUser]);
                        if (mockRoles[normUser] === 'USER') {
                            window.location.href = 'user.html';
                        } else {
                            window.location.href = 'admin.html';
                        }
                        return;
                    }

                    if (response.status === 403 || (data.message && data.message.includes('KHÓA'))) {
                        showError(data.message || `🚫 Tài khoản "${usernameOrEmail}" đã bị KHÓA bởi Quản trị viên.`);
                    } else {
                        handleLoginFailure(data.message || 'Tài khoản hoặc mật khẩu không chính xác.');
                    }
                }
            } catch (err) {
                // Khi máy chủ Backend chưa bật (Lỗi Failed to fetch / Máy chủ offline)
                if (usernameOrEmail === 'admin' && password === '123') {
                    console.warn('Backend offline (Failed to fetch). Tự động kích hoạt tài khoản Demo để kiểm thử Frontend.');
                    sessionStorage.setItem('accessToken', 'mock-demo-token-123456');
                    sessionStorage.setItem('currentUser', 'admin');
                    window.location.href = 'admin.html';
                    return;
                }

                if (error) {
                    error.textContent = 'Máy chủ Backend chưa bật (http://localhost:8080). Nhập admin/123 để test thử chế độ Demo.';
                    error.hidden = false;
                }

                handleLoginFailure('Thông tin đăng nhập không hợp lệ. Vui lòng thử lại với tài khoản demo: admin / 123, user / 123, sale / 123 hoặc coord / 123.');
            }
        });
    }

    function checkIsUserLocked(usernameOrEmail) {
        if (!usernameOrEmail) return false;
        const norm = usernameOrEmail.toLowerCase();

        // 1. Kiểm tra trực tiếp trong danh sách các tài khoản bị khóa
        try {
            const lockedList = JSON.parse(localStorage.getItem('ev_locked_accounts') || '[]');
            if (lockedList.includes(norm)) return true;
        } catch (e) { }

        // 2. Kiểm tra trong danh sách người dùng ev_users
        const raw = localStorage.getItem('ev_users');
        if (raw) {
            try {
                const users = JSON.parse(raw);
                const found = users.find(u =>
                    (u.username && u.username.toLowerCase() === norm) ||
                    (u.email && u.email.toLowerCase() === norm)
                );
                if (found && (found.status === 'LOCKED' || found.status === 'INACTIVE')) {
                    return true;
                }
            } catch (e) { }
        }
        return false;
    }

    function handleLoginFailure(message) {
        showError(message || 'Tài khoản hoặc mật khẩu không chính xác.');
    }

    function resetFailedAttempts() {
        localStorage.removeItem('ev_failed_attempts');
        localStorage.removeItem('ev_login_lock_until');
    }

    function showError(msg) {
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.hidden = false;
        }
    }

    function hideError() {
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.hidden = true;
        }
    }
});