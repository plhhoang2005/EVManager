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

// Qu?n ly Modal Ng??i dung va hi?n th? danh sach quy?n h?n
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
            document.getElementById('userModalTitle').textContent = 'Them ng??i dung m?i';
            openUserModal();
        });
    }

    if (btnCloseUserModal) btnCloseUserModal.addEventListener('click', closeUserModal);
    if (btnCancelUserForm) btnCancelUserForm.addEventListener('click', closeUserModal);
    const userModalBackdrop = document.getElementById('userModalBackdrop');
    if (userModalBackdrop) userModalBackdrop.addEventListener('click', closeUserModal);

    const rolePermissions = {
        'ADMIN': '?? Qu?n tr? vien (Admin) co quy?n: Qu?n ly toan b? ng??i dung, xem m?i bao cao doanh thu, c?u hinh h? th?ng, va can thi?p m?i lu?ng cong vi?c.',
        'SALES': '?? Nhan vien Kinh doanh (Sales) co quy?n: Qu?n ly khach hang ti?m n?ng, t?o bao gia, l?p h?p ??ng, va theo doi thanh toan.',
        'COORDINATOR': '?? ?i?u ph?i vien (Coordinator) co quy?n: Qu?n ly s? ki?n, x?p l?ch nhan s?, ??t ??a ?i?m, theo doi ti?n ?? chu?n b? s? ki?n.',
        'CUSTOMER': '?? Khach hang (Customer) co quy?n: Xem h?p ??ng ca nhan, thanh toan, theo doi ti?n ?? s? ki?n c?a minh va lien h? h? tr?.'
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

    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            closeUserModal();
            showSuccess('Thêm người dùng thành công!');
        });
    }
});
