/**
 * Module Đăng ký (register.js)
 * Xử lý đăng ký tài khoản mới và ẩn/hiện mật khẩu
 */

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
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

    // Xử lý gửi form đăng ký
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const username = formData.get('username').trim();
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            const email = formData.get('email') || '';
            const fullName = formData.get('fullName') || '';
            const error = document.getElementById('registerError');

            if (error) {
                error.hidden = true;
                error.textContent = '';
            }

            if (!username || !password || !confirmPassword || !email || !fullName) {
                if (error) {
                    error.textContent = 'Vui lòng nhập đầy đủ thông tin (Tên đăng nhập, Email, Tên hiển thị, Mật khẩu).';
                    error.style.color = '#c34f49';
                    error.hidden = false;
                }
                return;
            }

            if (password !== confirmPassword) {
                if (error) {
                    error.textContent = 'Mật khẩu xác nhận không khớp.';
                    error.style.color = '#c34f49';
                    error.hidden = false;
                }
                return;
            }

            const payload = {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                fullName: fullName
            };

            try {
                // Thay vì mock cứng, giờ gọi API thật tới backend
                const response = await fetchAPI('/api/v1/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                // Xử lý response text/json
                const contentType = response.headers.get("content-type");
                let data = null;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                if (response.ok) {
                    if (error) {
                        error.textContent = '🎉 Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
                        error.style.color = '#087f82';
                        error.hidden = false;
                    }
                    setTimeout(function() {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    // Extract validation errors from backend response
                    let errorMsg = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
                    if (data) {
                        if (typeof data === 'object') {
                            if (data.message) {
                                errorMsg = data.message;
                            } else if (data.error) {
                                errorMsg = data.error;
                            }
                            
                            // Nối fieldErrors vào câu báo lỗi để hiển thị rõ ràng trên UI
                            if (data.fieldErrors && typeof data.fieldErrors === 'object') {
                                const details = Object.values(data.fieldErrors).join('; ');
                                if (details) {
                                    errorMsg = `${errorMsg}: ${details}`;
                                }
                            }
                        } else {
                            errorMsg = data; // plain text string error
                        }
                    }
                    if (error) {
                        error.textContent = errorMsg;
                        error.style.color = '#c34f49';
                        error.hidden = false;
                    }
                }
            } catch (err) {
                if (error) {
                    error.textContent = 'Máy chủ Backend chưa bật (http://localhost:8080) hoặc lỗi kết nối.';
                    error.style.color = '#c34f49';
                    error.hidden = false;
                }
            }
        });
    }
});