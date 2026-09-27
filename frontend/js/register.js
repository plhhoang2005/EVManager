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
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const username = formData.get('username').trim();
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');
            const error = document.getElementById('registerError');

            if (!username || !password || !confirmPassword) {
                if (error) {
                    error.textContent = 'Vui lòng nhập đầy đủ thông tin.';
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

            if (error) {
                error.textContent = '🎉 Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
                error.style.color = '#087f82';
                error.hidden = false;
            }

            setTimeout(function() {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});