/**
 * Module Bảng quản trị & Quản lý Sự kiện / Khách hàng (dashboard.js)
 * Xử lý tương tác trên trang admin.html: Tab, CRUD Sự kiện, CRUD Khách hàng, Báo cáo & Lịch
 */

// Dữ liệu mockEvents dự phòng cho Sự kiện
const mockEvents = [
    {
        id: "SK-101",
        title: "Lễ cưới Hoàng Gia - Anh Minh & Chị Mai",
        client: "Nguyễn Văn Minh",
        type: "Tiệc cưới",
        date: "2026-10-15T17:30",
        location: "GEM Center, Q.1",
        budget: 150000000,
        status: "Đã xác nhận"
    },
    {
        id: "SK-102",
        title: "Hội nghị Tech Summit 2026",
        client: "Trần Văn Nam (TechCorp)",
        type: "Hội nghị",
        date: "2026-10-20T08:00",
        location: "White Palace, Q. Phú Nhuận",
        budget: 85000000,
        status: "Đang chuẩn bị"
    },
    {
        id: "SK-103",
        title: "Đại nhạc hội EDM Summer Splash",
        client: "Lê Thị Hồng",
        type: "Concert",
        date: "2026-11-05T19:00",
        location: "Sân vận động QK7",
        budget: 320000000,
        status: "Đã xác nhận"
    },
    {
        id: "SK-104",
        title: "Tiệc sinh nhật 30 tuổi - Doanh nhân Tuấn",
        client: "Phạm Quốc Tuấn",
        type: "Sinh nhật",
        date: "2026-09-28T18:30",
        location: "Riverside Palace, Q.4",
        budget: 45000000,
        status: "Hoàn thành"
    },
    {
        id: "SK-105",
        title: "Lễ Kỷ Niệm 15 Năm Thành Lập Vinacoffee",
        client: "Vũ Hoàng Yến",
        type: "Hội nghị",
        date: "2026-12-10T14:00",
        location: "Rex Hotel, Q.1",
        budget: 110000000,
        status: "Đang chuẩn bị"
    }
];

// Dữ liệu mockCustomers dự phòng cho Khách hàng
const mockCustomers = [
    {
        id: "KH-201",
        name: "Nguyễn Văn Minh",
        phone: "0908123456",
        email: "minh.nguyen@gmail.com",
        tier: "VIP",
        eventsCount: 2,
        totalSpent: 220000000,
        dateAdded: "2026-01-15",
        notes: "Khách thích trang trí hoa tươi tông màu pastel"
    },
    {
        id: "KH-202",
        name: "Trần Văn Nam",
        phone: "0912345678",
        email: "nam.tran@techcorp.vn",
        tier: "VIP",
        eventsCount: 3,
        totalSpent: 310000000,
        dateAdded: "2026-02-10",
        notes: "Đại diện tập đoàn TechCorp, yêu cầu màn hình LED 4K"
    },
    {
        id: "KH-203",
        name: "Lê Thị Hồng",
        phone: "0934567890",
        email: "hong.le@entertainment.com",
        tier: "VIP",
        eventsCount: 1,
        totalSpent: 320000000,
        dateAdded: "2026-03-05",
        notes: "Ban tổ chức liveshow âm nhạc"
    },
    {
        id: "KH-204",
        name: "Phạm Quốc Tuấn",
        phone: "0978112233",
        email: "tuan.pham@tuanstar.com",
        tier: "Thường",
        eventsCount: 1,
        totalSpent: 45000000,
        dateAdded: "2026-05-20",
        notes: "Tiệc cá nhân riêng tư"
    },
    {
        id: "KH-205",
        name: "Vũ Hoàng Yến",
        phone: "0989001122",
        email: "hoangyen@vinacoffee.com",
        tier: "Tiềm năng",
        eventsCount: 1,
        totalSpent: 110000000,
        dateAdded: "2026-07-12",
        notes: "Quan tâm đến gói dịch vụ quay phim 4K"
    },
    {
        id: "KH-206",
        name: "Đặng Hoàng Long",
        phone: "0903445566",
        email: "long.dh@gmail.com",
        tier: "Tiềm năng",
        eventsCount: 0,
        totalSpent: 0,
        dateAdded: "2026-09-18",
        notes: "Yêu cầu báo giá hội thảo cuối năm"
    }
];

// Đối tượng mockDashboard tổng hợp dữ liệu dự phòng
const mockDashboard = {
    events: mockEvents,
    customers: mockCustomers,
    revenueMonthly: [120, 180, 150, 290, 310, 420]
};

// Biến lưu trữ trạng thái ứng dụng
let adminEvents = [];
let adminCustomers = [];
let revenueChartInstance = null;

// Utility format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Utility format ngày tháng
function formatDate(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Lấy dữ liệu từ Backend API với khối try...catch fallback mockDashboard
async function loadAdminData() {
    try {
        const response = await fetchAPI('/api/v1/dashboard');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: API Dashboard chưa sẵn sàng.`);
        }
        const data = await response.json();
        adminEvents = data.events || mockDashboard.events;
        adminCustomers = data.customers || mockDashboard.customers;
    } catch (error) {
        console.warn('Backend chưa có API Dashboard (Lỗi 404/kết nối). Tự động kích hoạt mockDashboard:', error.message);
        
        const savedEvents = localStorage.getItem('lv34_events');
        const savedCustomers = localStorage.getItem('lv34_customers');

        if (savedEvents) {
            try { adminEvents = JSON.parse(savedEvents); } catch (e) { adminEvents = [...mockDashboard.events]; }
        } else {
            adminEvents = [...mockDashboard.events];
            localStorage.setItem('lv34_events', JSON.stringify(adminEvents));
        }

        if (savedCustomers) {
            try { adminCustomers = JSON.parse(savedCustomers); } catch (e) { adminCustomers = [...mockDashboard.customers]; }
        } else {
            adminCustomers = [...mockDashboard.customers];
            localStorage.setItem('lv34_customers', JSON.stringify(adminCustomers));
        }
    }
}

// Lưu dữ liệu vào LocalStorage
function saveAdminData() {
    localStorage.setItem('lv34_events', JSON.stringify(adminEvents));
    localStorage.setItem('lv34_customers', JSON.stringify(adminCustomers));
}

// Khởi tạo Dashboard Admin
async function initDashboard() {
    console.log("Đã khởi chạy Module Quản Trị Admin LV34!");
    await loadAdminData();

    setupTabNavigation();
    setupFiltersAndSearch();
    setupModals();
    setupSidebarToggle();

    renderAllViews();
}

// Chuyển đổi Tab trong Admin
function switchAdminTab(tabId) {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    tabPanes.forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Cập nhật tiêu đề Topbar tương ứng với Tab
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    const titles = {
        'tab-dashboard': { title: 'Bảng tổng quan', sub: 'Tổng quan doanh thu, sự kiện & hoạt động mới nhất' },
        'tab-events': { title: 'Quản lý sự kiện', sub: 'Danh sách, lọc và điều hành các sự kiện trong hệ thống' },
        'tab-customers': { title: 'Quản lý khách hàng', sub: 'Thông tin đối tác, khách hàng VIP và lịch sử hợp tác' },
        'tab-calendar': { title: 'Lịch trình sự kiện', sub: 'Xem lịch vận hành sự kiện theo tháng/tuần' },
        'tab-reports': { title: 'Báo cáo doanh thu', sub: 'Thống kê chi tiết tài chính & xu hướng phát triển' },
        'tab-settings': { title: 'Cấu hình hệ thống', sub: 'Quản lý tài khoản và thiết lập vận hành' }
    };

    if (titles[tabId] && pageTitle && pageSubtitle) {
        pageTitle.textContent = titles[tabId].title;
        pageSubtitle.textContent = titles[tabId].sub;
    }

    // Refresh calendar if calendar tab active
    if (tabId === 'tab-calendar' && typeof window.refreshFullCalendar === 'function') {
        window.refreshFullCalendar();
    }
}

// Thiết lập chuyển Tab
function setupTabNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchAdminTab(tabId);
        });
    });

    const btnGoToEvents = document.getElementById('btnGoToEvents');
    if (btnGoToEvents) {
        btnGoToEvents.addEventListener('click', () => switchAdminTab('tab-events'));
    }
}

// Sidebar Toggle cho di động
function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

// Render toàn bộ giao diện
function renderAllViews() {
    renderMetrics();
    renderChart();
    renderQuickEventsTable();
    renderEventsTable();
    renderCustomersTable();
    updateBadgesAndCounts();
}

// Cập nhật các chỉ số tổng quan (KPIs)
function renderMetrics() {
    // 1. Tổng doanh thu sự kiện
    const totalRevenue = adminEvents.reduce((sum, ev) => sum + (Number(ev.budget) || 0), 0);
    const totalEvents = adminEvents.length;
    const totalCustomers = adminCustomers.length;
    const pendingContracts = adminEvents.filter(ev => ev.status === 'Đang chuẩn bị').length;

    const doanhThuEl = document.getElementById('doanhThu');
    const soSuKienEl = document.getElementById('soSuKien');
    const soKhachHangEl = document.getElementById('soKhachHang');
    const hopDongChoEl = document.getElementById('hopDongCho');

    if (doanhThuEl) doanhThuEl.innerText = formatCurrency(totalRevenue);
    if (soSuKienEl) soSuKienEl.innerText = totalEvents;
    if (soKhachHangEl) soKhachHangEl.innerText = totalCustomers;
    if (hopDongChoEl) hopDongChoEl.innerText = pendingContracts;

    const trendEventsText = document.getElementById('trendEventsText');
    if (trendEventsText) trendEventsText.innerText = `+${totalEvents} sự kiện`;

    const vipCount = adminCustomers.filter(c => c.tier === 'VIP').length;
    const trendCustomersText = document.getElementById('trendCustomersText');
    if (trendCustomersText) trendCustomersText.innerText = `${vipCount} VIP`;
}

// Cập nhật các Badge đếm số lượng
function updateBadgesAndCounts() {
    const badgeEvents = document.getElementById('badgeEventsCount');
    const badgeCustomers = document.getElementById('badgeCustomersCount');

    if (badgeEvents) badgeEvents.textContent = adminEvents.length;
    if (badgeCustomers) badgeCustomers.textContent = adminCustomers.length;

    // Đếm theo trạng thái Sự kiện
    const evAll = adminEvents.length;
    const evConfirmed = adminEvents.filter(e => e.status === 'Đã xác nhận').length;
    const evPending = adminEvents.filter(e => e.status === 'Đang chuẩn bị').length;
    const evCompleted = adminEvents.filter(e => e.status === 'Hoàn thành').length;

    document.getElementById('countEvAll').textContent = evAll;
    document.getElementById('countEvConfirmed').textContent = evConfirmed;
    document.getElementById('countEvPending').textContent = evPending;
    document.getElementById('countEvCompleted').textContent = evCompleted;

    // Đếm theo phân loại Khách hàng
    const custAll = adminCustomers.length;
    const custVip = adminCustomers.filter(c => c.tier === 'VIP').length;
    const custNormal = adminCustomers.filter(c => c.tier === 'Thường').length;
    const custLead = adminCustomers.filter(c => c.tier === 'Tiềm năng').length;

    document.getElementById('countCustAll').textContent = custAll;
    document.getElementById('countCustVip').textContent = custVip;
    document.getElementById('countCustNormal').textContent = custNormal;
    document.getElementById('countCustLead').textContent = custLead;
}

// Biểu đồ Doanh thu Chart.js
function renderChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    revenueChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['T5/2026', 'T6/2026', 'T7/2026', 'T8/2026', 'T9/2026', 'T10/2026'],
            datasets: [{
                label: 'Doanh thu (Triệu VNĐ)',
                data: [120, 180, 150, 290, 310, 420],
                backgroundColor: 'rgba(8, 127, 130, 0.85)',
                hoverBackgroundColor: '#087f82',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}

// Render Bảng xem nhanh sự kiện ở trang Tổng quan
function renderQuickEventsTable() {
    const tbody = document.getElementById('quickEventsTableBody');
    if (!tbody) return;

    const recentEvents = adminEvents.slice(0, 4);

    if (recentEvents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center">Chưa có sự kiện nào</td></tr>`;
        return;
    }

    tbody.innerHTML = recentEvents.map(ev => `
        <tr>
            <td>
                <strong>${ev.title}</strong>
                <div style="font-size:0.75rem; color:#64748b;">📅 ${formatDate(ev.date)}</div>
            </td>
            <td>${ev.client}</td>
            <td>${getStatusBadgeHTML(ev.status)}</td>
        </tr>
    `).join('');
}

// Utility tạo Badge trạng thái sự kiện
function getStatusBadgeHTML(status) {
    switch (status) {
        case 'Đã xác nhận':
            return `<span class="badge-status badge-status--confirmed">✓ Đã xác nhận</span>`;
        case 'Đang chuẩn bị':
            return `<span class="badge-status badge-status--pending">⌛ Đang chuẩn bị</span>`;
        case 'Hoàn thành':
            return `<span class="badge-status badge-status--completed">★ Hoàn thành</span>`;
        case 'Đã hủy':
            return `<span class="badge-status badge-status--cancelled">✕ Đã hủy</span>`;
        default:
            return `<span class="badge-status">${status}</span>`;
    }
}

// Utility tạo Badge phân loại khách hàng
function getTierBadgeHTML(tier) {
    switch (tier) {
        case 'VIP':
            return `<span class="badge-tier badge-tier--vip">👑 VIP</span>`;
        case 'Thường':
            return `<span class="badge-tier badge-tier--normal">👤 Thường</span>`;
        case 'Tiềm năng':
            return `<span class="badge-tier badge-tier--lead">💡 Tiềm năng</span>`;
        default:
            return `<span class="badge-tier">${tier}</span>`;
    }
}

// Render Bảng Quản Lý Sự Kiện
function renderEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('eventSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('eventStatusFilter')?.value || 'ALL';
    const typeFilter = document.getElementById('eventTypeFilter')?.value || 'ALL';

    const filtered = adminEvents.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(searchTerm) ||
            ev.client.toLowerCase().includes(searchTerm) ||
            ev.location.toLowerCase().includes(searchTerm) ||
            ev.id.toLowerCase().includes(searchTerm);

        const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || ev.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #64748b;">
                    Không tìm thấy sự kiện nào phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(ev => `
        <tr>
            <td><strong>${ev.id}</strong></td>
            <td><strong>${ev.title}</strong></td>
            <td>${ev.client}</td>
            <td><span class="summary-pill" style="font-size:0.75rem; padding: 2px 8px;">${ev.type}</span></td>
            <td>${formatDate(ev.date)}</td>
            <td>${ev.location}</td>
            <td><strong>${formatCurrency(ev.budget)}</strong></td>
            <td>${getStatusBadgeHTML(ev.status)}</td>
            <td class="text-right">
                <div class="btn-action-group">
                    <button class="btn-action" onclick="openEditEventModal('${ev.id}')" title="Chỉnh sửa">✏️ Sửa</button>
                    <button class="btn-action btn-action--danger" onclick="deleteEvent('${ev.id}')" title="Xóa">🗑️ Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Bảng Quản Lý Khách Hàng
function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('customerSearchInput')?.value || '').toLowerCase().trim();
    const tierFilter = document.getElementById('customerTierFilter')?.value || 'ALL';

    const filtered = adminCustomers.filter(cust => {
        const matchesSearch = cust.name.toLowerCase().includes(searchTerm) ||
            cust.phone.toLowerCase().includes(searchTerm) ||
            (cust.email && cust.email.toLowerCase().includes(searchTerm)) ||
            cust.id.toLowerCase().includes(searchTerm);

        const matchesTier = tierFilter === 'ALL' || cust.tier === tierFilter;

        return matchesSearch && matchesTier;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #64748b;">
                    Không tìm thấy khách hàng nào phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(cust => `
        <tr>
            <td><strong>${cust.id}</strong></td>
            <td>
                <strong>${cust.name}</strong>
                ${cust.notes ? `<div style="font-size:0.75rem; color:#64748b;">📝 ${cust.notes}</div>` : ''}
            </td>
            <td>📞 ${cust.phone}</td>
            <td>✉️ ${cust.email || 'N/A'}</td>
            <td>${getTierBadgeHTML(cust.tier)}</td>
            <td><strong style="color:#087f82;">${cust.eventsCount || 0} SK</strong></td>
            <td><strong>${formatCurrency(cust.totalSpent || 0)}</strong></td>
            <td>${cust.dateAdded || 'N/A'}</td>
            <td class="text-right">
                <div class="btn-action-group">
                    <button class="btn-action" onclick="openEditCustomerModal('${cust.id}')" title="Chỉnh sửa">✏️ Sửa</button>
                    <button class="btn-action btn-action--danger" onclick="deleteCustomer('${cust.id}')" title="Xóa">🗑️ Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Lọc & Tìm kiếm sự kiện / khách hàng
function setupFiltersAndSearch() {
    // Sự kiện
    const eventSearch = document.getElementById('eventSearchInput');
    const eventStatusFilter = document.getElementById('eventStatusFilter');
    const eventTypeFilter = document.getElementById('eventTypeFilter');

    if (eventSearch) eventSearch.addEventListener('input', renderEventsTable);
    if (eventStatusFilter) eventStatusFilter.addEventListener('change', renderEventsTable);
    if (eventTypeFilter) eventTypeFilter.addEventListener('change', renderEventsTable);

    // Pill filter sự kiện
    document.querySelectorAll('[data-event-filter]').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('[data-event-filter]').forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const status = this.getAttribute('data-event-filter');
            if (eventStatusFilter) {
                eventStatusFilter.value = status;
                renderEventsTable();
            }
        });
    });

    // Khách hàng
    const customerSearch = document.getElementById('customerSearchInput');
    const customerTierFilter = document.getElementById('customerTierFilter');

    if (customerSearch) customerSearch.addEventListener('input', renderCustomersTable);
    if (customerTierFilter) customerTierFilter.addEventListener('change', renderCustomersTable);

    // Pill filter khách hàng
    document.querySelectorAll('[data-cust-filter]').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('[data-cust-filter]').forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const tier = this.getAttribute('data-cust-filter');
            if (customerTierFilter) {
                customerTierFilter.value = tier;
                renderCustomersTable();
            }
        });
    });

    // Tìm kiếm toàn cục Topbar
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) {
        globalSearch.addEventListener('input', function() {
            const val = this.value.trim();
            if (val) {
                if (eventSearch) eventSearch.value = val;
                if (customerSearch) customerSearch.value = val;
                renderEventsTable();
                renderCustomersTable();
            }
        });
    }
}

// Thao tác với Modal
function setupModals() {
    // Event Modal
    const eventModal = document.getElementById('eventModal');
    const btnOpenAddEventModal = document.getElementById('btnOpenAddEventModal');
    const btnCloseEventModal = document.getElementById('btnCloseEventModal');
    const btnCancelEventForm = document.getElementById('btnCancelEventForm');
    const eventForm = document.getElementById('eventForm');

    function openEventModal() {
        if (eventModal) eventModal.classList.add('open');
    }

    function closeEventModal() {
        if (eventModal) eventModal.classList.remove('open');
        if (eventForm) eventForm.reset();
        document.getElementById('eventEditId').value = '';
    }

    if (btnOpenAddEventModal) {
        btnOpenAddEventModal.addEventListener('click', () => {
            document.getElementById('eventModalTitle').textContent = 'Thêm sự kiện mới';
            openEventModal();
        });
    }

    if (btnCloseEventModal) btnCloseEventModal.addEventListener('click', closeEventModal);
    if (btnCancelEventForm) btnCancelEventForm.addEventListener('click', closeEventModal);
    document.getElementById('eventModalBackdrop')?.addEventListener('click', closeEventModal);

    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const editId = document.getElementById('eventEditId').value;
            const title = document.getElementById('eventTitle').value.trim();
            const client = document.getElementById('eventClient').value.trim();
            const type = document.getElementById('eventType').value;
            const date = document.getElementById('eventDate').value;
            const budget = Number(document.getElementById('eventBudget').value) || 0;
            const location = document.getElementById('eventLocation').value.trim();
            const status = document.getElementById('eventStatus').value;

            if (editId) {
                // Sửa sự kiện hiện có
                const index = adminEvents.findIndex(ev => ev.id === editId);
                if (index !== -1) {
                    adminEvents[index] = { ...adminEvents[index], title, client, type, date, budget, location, status };
                }
            } else {
                // Thêm mới sự kiện
                const newId = `SK-${Math.floor(100 + Math.random() * 900)}`;
                adminEvents.unshift({ id: newId, title, client, type, date, budget, location, status });

                // Tự động kiểm tra/tạo hoặc cập nhật thông tin khách hàng tương ứng
                let existingCustomer = adminCustomers.find(c => c.name.toLowerCase() === client.toLowerCase());
                if (existingCustomer) {
                    existingCustomer.eventsCount = (existingCustomer.eventsCount || 0) + 1;
                    existingCustomer.totalSpent = (existingCustomer.totalSpent || 0) + budget;
                } else {
                    adminCustomers.unshift({
                        id: `KH-${Math.floor(200 + Math.random() * 800)}`,
                        name: client,
                        phone: "0900000000",
                        email: `${client.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                        tier: "Thường",
                        eventsCount: 1,
                        totalSpent: budget,
                        dateAdded: new Date().toISOString().split('T')[0],
                        notes: `Đặt sự kiện: ${title}`
                    });
                }
            }

            saveAdminData();
            renderAllViews();
            closeEventModal();
            alert(editId ? "Cập nhật sự kiện thành công!" : "Thêm sự kiện mới thành công!");
        });
    }

    // Customer Modal
    const customerModal = document.getElementById('customerModal');
    const btnOpenAddCustomerModal = document.getElementById('btnOpenAddCustomerModal');
    const btnCloseCustomerModal = document.getElementById('btnCloseCustomerModal');
    const btnCancelCustomerForm = document.getElementById('btnCancelCustomerForm');
    const customerForm = document.getElementById('customerForm');

    function openCustomerModal() {
        if (customerModal) customerModal.classList.add('open');
    }

    function closeCustomerModal() {
        if (customerModal) customerModal.classList.remove('open');
        if (customerForm) customerForm.reset();
        document.getElementById('customerEditId').value = '';
    }

    if (btnOpenAddCustomerModal) {
        btnOpenAddCustomerModal.addEventListener('click', () => {
            document.getElementById('customerModalTitle').textContent = 'Thêm khách hàng mới';
            openCustomerModal();
        });
    }

    if (btnCloseCustomerModal) btnCloseCustomerModal.addEventListener('click', closeCustomerModal);
    if (btnCancelCustomerForm) btnCancelCustomerForm.addEventListener('click', closeCustomerModal);
    document.getElementById('customerModalBackdrop')?.addEventListener('click', closeCustomerModal);

    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const editId = document.getElementById('customerEditId').value;
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            const email = document.getElementById('customerEmail').value.trim();
            const tier = document.getElementById('customerTier').value;
            const totalSpent = Number(document.getElementById('customerTotalSpent').value) || 0;
            const notes = document.getElementById('customerNotes').value.trim();

            if (editId) {
                // Sửa khách hàng
                const index = adminCustomers.findIndex(c => c.id === editId);
                if (index !== -1) {
                    adminCustomers[index] = { ...adminCustomers[index], name, phone, email, tier, totalSpent, notes };
                }
            } else {
                // Thêm khách hàng mới
                const newId = `KH-${Math.floor(200 + Math.random() * 800)}`;
                adminCustomers.unshift({
                    id: newId,
                    name,
                    phone,
                    email,
                    tier,
                    eventsCount: 0,
                    totalSpent,
                    dateAdded: new Date().toISOString().split('T')[0],
                    notes
                });
            }

            saveAdminData();
            renderAllViews();
            closeCustomerModal();
            alert(editId ? "Cập nhật thông tin khách hàng thành công!" : "Thêm khách hàng mới thành công!");
        });
    }
}

// Mở modal sửa sự kiện
window.openEditEventModal = function(id) {
    const ev = adminEvents.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('eventModalTitle').textContent = `Chỉnh sửa sự kiện #${ev.id}`;
    document.getElementById('eventEditId').value = ev.id;
    document.getElementById('eventTitle').value = ev.title;
    document.getElementById('eventClient').value = ev.client;
    document.getElementById('eventType').value = ev.type;
    document.getElementById('eventDate').value = ev.date;
    document.getElementById('eventBudget').value = ev.budget;
    document.getElementById('eventLocation').value = ev.location;
    document.getElementById('eventStatus').value = ev.status;

    const eventModal = document.getElementById('eventModal');
    if (eventModal) eventModal.classList.add('open');
};

// Xóa sự kiện
window.deleteEvent = function(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa sự kiện ${id}?`)) {
        adminEvents = adminEvents.filter(ev => ev.id !== id);
        saveAdminData();
        renderAllViews();
    }
};

// Mở modal sửa khách hàng
window.openEditCustomerModal = function(id) {
    const cust = adminCustomers.find(c => c.id === id);
    if (!cust) return;

    document.getElementById('customerModalTitle').textContent = `Chỉnh sửa khách hàng #${cust.id}`;
    document.getElementById('customerEditId').value = cust.id;
    document.getElementById('customerName').value = cust.name;
    document.getElementById('customerPhone').value = cust.phone;
    document.getElementById('customerEmail').value = cust.email || '';
    document.getElementById('customerTier').value = cust.tier;
    document.getElementById('customerTotalSpent').value = cust.totalSpent || 0;
    document.getElementById('customerNotes').value = cust.notes || '';

    const customerModal = document.getElementById('customerModal');
    if (customerModal) customerModal.classList.add('open');
};

// Xóa khách hàng
window.deleteCustomer = function(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng ${id}?`)) {
        adminCustomers = adminCustomers.filter(c => c.id !== id);
        saveAdminData();
        renderAllViews();
    }
};

// Chờ sự kiện ready từ app.js
document.addEventListener('dashboard:ready', initDashboard);