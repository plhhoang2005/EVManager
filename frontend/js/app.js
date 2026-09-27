/**
 * Module Điều hướng & Vận hành Quản trị (app.js)
 * Quản lý phiên làm việc admin và sự kiện phát khởi tạo dashboard/calendar
 */

document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('accessToken');
    const currentUser = sessionStorage.getItem('currentUser');

    // Bắt buộc phải có accessToken trong sessionStorage mới được ở lại trang admin.html
    if (window.location.pathname.includes('admin.html') && !token) {
        window.location.href = 'login.html';
        return;
    }

    const greetingElems = [
        document.getElementById('adminUserGreeting'),
        document.getElementById('adminSidebarGreeting')
    ];

    greetingElems.forEach(elem => {
        if (elem && currentUser) {
            elem.textContent = `Xin chào, ${currentUser}`;
        }
    });

    document.querySelectorAll('#logoutButton, .logout-button').forEach(btn => {
        btn.addEventListener('click', function() {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    });

    // Phát sự kiện để dashboard.js và calendar.js kích hoạt
    document.dispatchEvent(new CustomEvent('dashboard:ready'));
});
