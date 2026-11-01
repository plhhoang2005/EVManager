/**
 * Script xử lý chuyển Tab, Modal và tương tác chung (app.js)
 * Tích hợp toàn diện với kiến trúc Admin độc lập và các vai trò
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tự động kiểm tra session đăng nhập
    const currentUser = sessionStorage.getItem('currentUser') || 'admin';
    const greetingEl = document.getElementById('adminSidebarGreeting');
    if (greetingEl) {
        greetingEl.textContent = `Xin chào, ${currentUser}`;
    }

    // Toggle Sidebar trên thiết bị di động
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Đăng xuất an toàn
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // Phát sự kiện để dashboard.js và calendar.js kích hoạt
    document.dispatchEvent(new CustomEvent('dashboard:ready'));
});

// Quản lý Modal Người dùng và hiển thị danh sách quyền hạn
document.addEventListener('DOMContentLoaded', function() {
    const userModal = document.getElementById('userModal');
    const btnOpenAddUserModal = document.getElementById('btnOpenAddUserModal');
    const btnCloseUserModal = document.getElementById('btnCloseUserModal');
    const btnCancelUserForm = document.getElementById('btnCancelUserForm');
    const userRoleSelect = document.getElementById('userRole');
    const roleDescriptionBox = document.getElementById('roleDescriptionBox');

    function openUserModal() {
        if (userModal) userModal.classList.add('open');
    }

    function closeUserModal() {
        if (userModal) userModal.classList.remove('open');
        const userForm = document.getElementById('userForm');
        if (userForm) userForm.reset();
        if (roleDescriptionBox) roleDescriptionBox.style.display = 'none';
    }

    if (btnOpenAddUserModal) {
        btnOpenAddUserModal.addEventListener('click', () => {
            document.getElementById('userModalTitle').textContent = 'Thêm người dùng mới';
            openUserModal();
        });
    }

    if (btnCloseUserModal) btnCloseUserModal.addEventListener('click', closeUserModal);
    if (btnCancelUserForm) btnCancelUserForm.addEventListener('click', closeUserModal);
    const userModalBackdrop = document.getElementById('userModalBackdrop');
    if (userModalBackdrop) userModalBackdrop.addEventListener('click', closeUserModal);

    const rolePermissions = {
        'ADMIN': '👑 Quản trị viên (Admin) có quyền: Quản lý toàn bộ người dùng, xem mọi báo cáo doanh thu, cấu hình hệ thống, và can thiệp mọi luồng công việc.',
        'SALES': '💼 Nhân viên Kinh doanh (Sales) có quyền: Quản lý khách hàng tiềm năng, tạo báo giá, lập hợp đồng, và theo dõi thanh toán.',
        'COORDINATOR': '📋 Điều phối viên (Coordinator) có quyền: Quản lý sự kiện, xếp lịch nhân sự, đặt địa điểm, theo dõi tiến độ chuẩn bị sự kiện.',
        'CUSTOMER': '🎉 Khách hàng (Customer) có quyền: Xem hợp đồng cá nhân, thanh toán, theo dõi tiến độ sự kiện của mình và liên hệ hỗ trợ.'
    };

    if (userRoleSelect) {
        userRoleSelect.addEventListener('change', function() {
            const role = this.value;
            if (rolePermissions[role]) {
                roleDescriptionBox.textContent = rolePermissions[role];
                roleDescriptionBox.style.display = 'block';
            } else {
                roleDescriptionBox.style.display = 'none';
            }
        });
    }
});
