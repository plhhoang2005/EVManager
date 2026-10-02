/**
 * EVManager - Module Quên Mật Khẩu (forgotPassword.js)
 * Triển khai luồng A1 theo UC-01: Nhập Email -> Gửi OTP -> Xác thực OTP -> Đặt mật khẩu mới
 */

document.addEventListener('DOMContentLoaded', function() {
    const form1 = document.getElementById('step1EmailForm');
    const form2 = document.getElementById('step2OtpForm');
    const form3 = document.getElementById('step3ResetForm');
    const successBox = document.getElementById('forgotSuccessBox');
    const subtitle = document.getElementById('stepSubtitle');

    let savedEmail = '';
    const DEMO_OTP = '123456';

    // BƯỚC 1: NHẬP VÀ KIỂM TRA EMAIL
    form1?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('recoveryEmail').value.trim();
        const err = document.getElementById('forgotError1');

        if (!email) {
            showError(err, 'Vui lòng nhập địa chỉ email.');
            return;
        }

        savedEmail = email;
        hideError(err);

        // Chuyển sang Bước 2
        form1.style.display = 'none';
        form2.style.display = 'grid';
        if (subtitle) subtitle.textContent = `Mã xác thực OTP đã được gửi tới: ${email}`;
    });

    // BƯỚC 2: XÁC THỰC MÃ OTP
    form2?.addEventListener('submit', function(e) {
        e.preventDefault();
        const code = document.getElementById('otpCode').value.trim();
        const err = document.getElementById('forgotError2');

        if (code !== DEMO_OTP) {
            showError(err, 'Mã OTP không chính xác. Vui lòng nhập mã thử nghiệm: 123456.');
            return;
        }

        hideError(err);

        // Chuyển sang Bước 3
        form2.style.display = 'none';
        form3.style.display = 'grid';
        if (subtitle) subtitle.textContent = 'Mã OTP hợp lệ! Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.';
    });

    document.getElementById('btnResendOtp')?.addEventListener('click', function() {
        alert(`Mã OTP đã được gửi lại tới email: ${savedEmail}. (Mã demo: 123456)`);
    });

    // BƯỚC 3: ĐẶT MẬT KHẨU MỚI
    form3?.addEventListener('submit', function(e) {
        e.preventDefault();
        const pass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;
        const err = document.getElementById('forgotError3');

        if (pass.length < 8) {
            showError(err, 'Mật khẩu mới phải có độ dài tối thiểu 8 ký tự.');
            return;
        }

        if (pass !== confirmPass) {
            showError(err, 'Mật khẩu xác nhận không trùng khớp.');
            return;
        }

        hideError(err);

        // Hoàn tất
        form3.style.display = 'none';
        if (subtitle) subtitle.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
    });

    function showError(el, msg) {
        if (el) {
            el.textContent = msg;
            el.hidden = false;
        }
    }

    function hideError(el) {
        if (el) {
            el.textContent = '';
            el.hidden = true;
        }
    }
});