/**
 * Module Đăng nhập (login.js)
 * Xử lý xác thực tài khoản và ẩn/hiện mật khẩu
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Toggle ẩn/hiện mật khẩu
    document.querySelectorAll('.password-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            const input = button.parentElement.querySelector('input');
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.textContent = isPassword ? 'Ẩn' : 'Hiện';
            button.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
            button.setAttribute('aria-pressed', String(isPassword));
        });
    });

    // Xử lý gửi form đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const usernameOrEmail = (formData.get('username') || '').trim();
            const password = formData.get('password') || '';
            const error = document.getElementById('loginError');

            if (error) {
                error.hidden = true;
                error.textContent = '';
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
                    sessionStorage.setItem('accessToken', data.accessToken);
                    sessionStorage.setItem('currentUser', usernameOrEmail);
                    
                    const decoded = typeof parseJwt === 'function' ? parseJwt(data.accessToken) : null;
                    let roleStr = '';
                    if (decoded) {
                        const roleClaim = decoded.role || decoded.roles || decoded.authorities || '';
                        roleStr = Array.isArray(roleClaim) ? roleClaim.join(',') : String(roleClaim);
                    }
                    roleStr = roleStr.toUpperCase();

                    if (roleStr.includes('ADMIN')) {
                        window.location.href = 'admin.html';
                    } else if (roleStr.includes('SALES')) {
                        window.location.href = 'sales.html';
                    } else if (roleStr.includes('COORDINATOR')) {
                        window.location.href = 'coordinator.html';
                    } else if (roleStr.includes('CUSTOMER')) {
                        window.location.href = 'customer.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    let errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
                    if (data) {
                        if (data.message) {
                            errorMsg = data.message;
                        } else if (data.error) {
                            errorMsg = data.error;
                        }
                        if (data.errors && typeof data.errors === 'object') {
                            const details = Object.values(data.errors).join('; ');
                            if (details) {
                                errorMsg = `${errorMsg}: ${details}`;
                            }
                        }
                    }
                    if (error) {
                        error.textContent = errorMsg;
                        error.hidden = false;
                    }
                }
            } catch (err) {
                if (error) {
                    error.textContent = 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc liên hệ quản trị viên.';
                    error.hidden = false;
                }
            }
        });
    }
});