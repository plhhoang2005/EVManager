/**
 * Module Dịch vụ (services.js)
 * Xử lý tương tác trên trang dịch vụ
 */

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const navActions = document.getElementById('navActions');

    if (navActions && currentUser) {
        if (currentUser.toLowerCase() === 'admin') {
            navActions.innerHTML = `
                <a href="admin.html" class="btn btn-primary btn-sm">
                    <span>⚡ Trang Quản Trị</span>
                </a>
                <button class="btn btn-outline btn-sm logout-button">Đăng xuất</button>
                <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                    <span></span><span></span><span></span>
                </button>
            `;
        } else {
            navActions.innerHTML = `
                <a href="user.html" class="nav-user-badge" id="userBadgeNav">
                    <span>👤</span> <span id="navUsername">${currentUser}</span>
                </a>
                <button class="btn btn-outline btn-sm logout-button">Đăng xuất</button>
                <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                    <span></span><span></span><span></span>
                </button>
            `;
        }

        document.querySelectorAll('.logout-button').forEach(btn => {
            btn.addEventListener('click', function() {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        });
    }

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }
});
