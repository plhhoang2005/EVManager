/**
 * EVManager - Module Đăng Ký Tài Khoản (register.js)
 * Thu thập thông tin khách hàng và tài khoản người dùng, đồng bộ với cơ sở dữ liệu
 */

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorEl = document.getElementById('registerError');

    // Toggle ẩn/hiện mật khẩu
    document.querySelectorAll('.password-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            const input = button.parentElement.querySelector('input');
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.textContent = isPassword ? 'Ẩn' : 'Hiện';
            button.setAttribute('aria-pressed', String(isPassword));
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const username = (formData.get('username') || '').trim();
            const fullName = (formData.get('fullName') || '').trim();
            const phone = (formData.get('phone') || '').trim();
            const email = (formData.get('email') || '').trim();
            const address = (formData.get('address') || '').trim();
            const password = formData.get('password') || '';
            const confirmPassword = formData.get('confirmPassword') || '';

            if (password.length < 8) {
                showMsg('Mật khẩu phải có độ dài tối thiểu 8 ký tự.', true);
                return;
            }

            if (password !== confirmPassword) {
                showMsg('Mật khẩu xác nhận không khớp.', true);
                return;
            }

            // Gọi API Backend tạo khách hàng nếu có
            try {
                await fetchAPI('/api/v1/customers', {
                    method: 'POST',
                    body: JSON.stringify({ fullName, phone, email, address })
                });
            } catch (err) {
                console.warn('Backend offline, lưu thông tin khách hàng vào local state:', err.message);
            }

            // Lưu vào danh sách khách hàng
            const savedCust = localStorage.getItem('ev_customers');
            let custArr = savedCust ? JSON.parse(savedCust) : [];
            const newCustId = custArr.length > 0 ? Math.max(...custArr.map(c => c.customerId || c.id || 0)) + 1 : 1;
            custArr.unshift({ customerId: newCustId, fullName, phone, email, address, source: 'Website' });
            localStorage.setItem('ev_customers', JSON.stringify(custArr));

            // Lưu tài khoản để đăng nhập
            const savedUsers = localStorage.getItem('ev_users');
            let userArr = savedUsers ? JSON.parse(savedUsers) : [];
            userArr.unshift({ userId: userArr.length + 1, username, fullName, email, phone, roleName: 'CUSTOMER', status: 'ACTIVE' });
            localStorage.setItem('ev_users', JSON.stringify(userArr));

            showMsg('🎉 Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...', false);

            setTimeout(function() {
                window.location.href = 'login.html';
            }, 1200);
        });
    }

    function showMsg(msg, isError) {
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.color = isError ? '#dc2626' : '#059669';
            errorEl.hidden = false;
        }
    }
});