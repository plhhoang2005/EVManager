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

    // Kiểm tra nếu tài khoản đang đăng nhập đã bị Quản trị viên khóa
    if (currentUser) {
        const lockedRaw = localStorage.getItem('ev_locked_accounts');
        const lockedList = lockedRaw ? JSON.parse(lockedRaw) : [];
        const isLockedDirect = lockedList.includes(currentUser.toLowerCase());

        let isLockedInUsers = false;
        const usersRaw = localStorage.getItem('ev_users');
        if (usersRaw) {
            try {
                const uList = JSON.parse(usersRaw);
                const found = uList.find(u => u.username && u.username.toLowerCase() === currentUser.toLowerCase());
                if (found && (found.status === 'LOCKED' || found.status === 'INACTIVE')) {
                    isLockedInUsers = true;
                }
            } catch (e) {}
        }

        if (isLockedDirect || isLockedInUsers) {
            alert(`⚠️ Tài khoản "${currentUser}" đã bị Quản trị viên KHÓA. Phiên làm việc của bạn kết thúc!`);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('userRole');
            window.location.href = 'login.html';
            return;
        }
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
            sessionStorage.removeItem('userRole');
            window.location.href = 'login.html';
        });
    });

    // Phát sự kiện để dashboard.js và calendar.js kích hoạt
    document.dispatchEvent(new CustomEvent('dashboard:ready'));
});
