/**
 * Module Quên mật khẩu (forgotPassword.js)
 * Xử lý yêu cầu gửi hướng dẫn khôi phục mật khẩu
 */

document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const account = new FormData(event.currentTarget).get('recoveryAccount').trim();
            const message = document.getElementById('forgotPasswordMessage');

            if (message) {
                message.textContent = `Nếu tài khoản "${account}" tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.`;
                message.className = 'login-success';
                message.hidden = false;
            }
        });
    }
});