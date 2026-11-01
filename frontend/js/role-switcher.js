/**
 * ROLE SWITCHER & SHARED UI HELPERS - LV34 EVENTS
 * Tự động tạo thanh điều hướng nhanh giữa 4 vai trò và các tiện ích UX dùng chung
 */

document.addEventListener('DOMContentLoaded', () => {
    initRoleSwitcher();
    initToastNotification();
});

// Demo account credentials for 1-click seamless switching (Đã đồng bộ 100% với database)
const DEMO_ACCOUNTS = {
    ADMIN: { username: 'admin_demo', password: 'admin123', url: 'admin.html', label: '👑 Quản Trị Viên' },
    SALES: { username: 'staff', password: 'staff123', url: 'sales.html', label: '💼 Chuyên Viên Sales' },
    COORDINATOR: { username: 'coordinator', password: 'coordinator123', url: 'coordinator.html', label: '📋 Điều Phối Sự Kiện' },
    CUSTOMER: { username: 'khachhang1', password: '123456', url: 'customer.html', label: '🎉 Khách Hàng VIP' }
};

window.switchDemoRole = async function(roleKey, targetUrl) {
    const cred = DEMO_ACCOUNTS[roleKey];
    if (!cred) {
        window.location.href = targetUrl;
        return;
    }

    // Hiển thị phản hồi thị giác tức thì cho người dùng
    const toast = document.getElementById('globalToastNotification');
    const msg = document.getElementById('globalToastMessage');
    if (toast && msg) {
        msg.textContent = `Đang chuyển sang ${cred.label || roleKey}...`;
        toast.classList.add('show');
    }

    try {
        const res = await fetchAPI('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail: cred.username, password: cred.password })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.accessToken) {
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('currentUser', cred.username);
                sessionStorage.setItem('userRole', roleKey);
            }
        }
    } catch (e) {
        console.warn('Auto demo switch login fallback:', e);
    }
    window.location.href = targetUrl;
};

function initRoleSwitcher() {
    // Tránh inject 2 lần
    if (document.getElementById('demoRoleSwitcherBar')) return;

    const currentPath = window.location.pathname.toLowerCase();
    
    let currentRole = 'Khách viếng thăm';
    let roleColor = '#087f82';

    if (currentPath.includes('admin.html')) {
        currentRole = '👑 Quản Trị Viên (Admin)';
        roleColor = '#7c3aed';
    } else if (currentPath.includes('sales.html')) {
        currentRole = '💼 Chuyên Viên Sales';
        roleColor = '#0284c7';
    } else if (currentPath.includes('coordinator.html')) {
        currentRole = '📋 Điều Phối Sự Kiện (Ops)';
        roleColor = '#059669';
    } else if (currentPath.includes('customer.html')) {
        currentRole = '🎉 Khách Hàng VIP';
        roleColor = '#ea580c';
    }

    const switcherBar = document.createElement('div');
    switcherBar.id = 'demoRoleSwitcherBar';
    switcherBar.className = 'role-switcher-bar';
    switcherBar.innerHTML = `
        <div class="role-switcher-left">
            <span class="role-switcher-badge" style="background: ${roleColor};">DEMO ROLE</span>
            <span class="role-switcher-title">Đang ở chế độ: <strong>${currentRole}</strong></span>
        </div>
        <nav class="role-switcher-nav">
            <a href="javascript:void(0)" onclick="switchDemoRole('ADMIN', 'admin.html')" class="role-pill-btn ${currentPath.includes('admin.html') ? 'active' : ''}" title="Quản trị hệ thống & AI Control Panel">
                👑 Admin
            </a>
            <a href="javascript:void(0)" onclick="switchDemoRole('SALES', 'sales.html')" class="role-pill-btn ${currentPath.includes('sales.html') ? 'active' : ''}" title="Chăm sóc Leads AI & Hợp đồng">
                💼 Sales
            </a>
            <a href="javascript:void(0)" onclick="switchDemoRole('COORDINATOR', 'coordinator.html')" class="role-pill-btn ${currentPath.includes('coordinator.html') ? 'active' : ''}" title="Điều phối lịch tiệc & vận hành sảnh">
                📋 Điều phối
            </a>
            <a href="javascript:void(0)" onclick="switchDemoRole('CUSTOMER', 'customer.html')" class="role-pill-btn ${currentPath.includes('customer.html') ? 'active' : ''}" title="Theo dõi tiến độ tiệc & VietQR 24/7">
                🎉 Khách hàng
            </a>
            <a href="index.html" class="role-pill-btn role-pill-home" title="Trang chủ giới thiệu">
                🏠 Trang chủ
            </a>
        </nav>
    `;

    // Chèn vào đúng container để không bị đè bởi sidebar hoặc navbar
    const adminMain = document.querySelector('.admin-main');
    if (adminMain) {
        adminMain.insertAdjacentElement('afterbegin', switcherBar);
    } else {
        const homeWrapper = document.querySelector('.home-wrapper');
        if (homeWrapper) {
            homeWrapper.insertAdjacentElement('afterbegin', switcherBar);
        } else {
            document.body.insertAdjacentElement('afterbegin', switcherBar);
        }
    }
}

// Utility: Hiển thị Toast thông báo khi sao chép
function initToastNotification() {
    if (document.getElementById('globalToastNotification')) return;

    const toast = document.createElement('div');
    toast.id = 'globalToastNotification';
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span style="font-size: 1.1rem;">⚡</span>
        <span id="globalToastMessage">Đang xử lý...</span>
    `;
    document.body.appendChild(toast);
}

window.copyToClipboard = function(text, label = 'nội dung') {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('globalToastNotification');
        const msg = document.getElementById('globalToastMessage');
        if (toast && msg) {
            msg.textContent = `Đã sao chép ${label}!`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    }).catch(err => {
        console.error('Lỗi khi sao chép:', err);
    });
};
