/**
 * EVManager - Module Quản Trị Trung Tâm Hội Nghị & Tiệc Cưới (dashboard.js)
 * Đồng bộ với Backend API Spring Boot (/api/v1/customers, /api/v1/venues, /api/v1/events, /api/v1/users)
 * Tuân thủ đầy đủ đặc tả nghiệp vụ BA (SRS v1.0, BRD, Use Cases UC01 -> UC14 & mock-data-demo.json)
 */

// =============================================================================
// 1. BỘ DỮ LIỆU CHUẨN HÓA THEO MOCK-DATA-DEMO.JSON (BA BASELINE)
// =============================================================================
const BA_MOCK_DATA = {
    halls: [
        { hallId: "S01", name: "Sảnh Kim Cương", capacityGuests: 500, maxTables: 50, floor: 1, basePricePerTable: 8000000, rentalPrice: 15000000, status: "AVAILABLE", description: "Không gian lớn, phù hợp tiệc cưới quy mô lớn, trang trí cao cấp" },
        { hallId: "S02", name: "Sảnh Vàng", capacityGuests: 300, maxTables: 30, floor: 2, basePricePerTable: 5500000, rentalPrice: 10000000, status: "AVAILABLE", description: "Phù hợp tiệc cưới quy mô vừa" },
        { hallId: "S03", name: "Sảnh Bạch Kim", capacityGuests: 400, maxTables: 40, floor: 3, basePricePerTable: 7000000, rentalPrice: 12000000, status: "AVAILABLE", description: "Không gian cao cấp, phù hợp tiệc cưới 300–400 khách" },
        { hallId: "S04", name: "Sảnh Ngọc Trai", capacityGuests: 200, maxTables: 20, floor: 1, basePricePerTable: 4500000, rentalPrice: 8000000, status: "HOLD", holdExpireAt: new Date(Date.now() + 36 * 3600000).toISOString(), holdCustomer: "Phạm Ngọc Mai", description: "Phù hợp tiệc cưới gia đình, quy mô nhỏ" },
        { hallId: "S05", name: "Sảnh Ruby", capacityGuests: 250, maxTables: 25, floor: 2, basePricePerTable: 5000000, rentalPrice: 9000000, status: "AVAILABLE", description: "Phù hợp tiệc cưới quy mô vừa và nhỏ" }
    ],
    dishes: [
        { dishId: "M01", name: "Gỏi ngó sen tôm thịt", category: "Khai vị", pricePerTable: 450000 },
        { dishId: "M02", name: "Gỏi hải sản nhiệt đới", category: "Khai vị", pricePerTable: 550000 },
        { dishId: "M03", name: "Chả giò hải sản hoàng gia", category: "Khai vị", pricePerTable: 500000 },
        { dishId: "M04", name: "Súp cua măng tây", category: "Súp", pricePerTable: 350000 },
        { dishId: "M05", name: "Súp hải sản tóc tiên", category: "Súp", pricePerTable: 400000 },
        { dishId: "M06", name: "Súp bào ngư vi cá thượng hạng", category: "Súp", pricePerTable: 650000 },
        { dishId: "M07", name: "Tôm sú hấp bia gừng", category: "Hải sản", pricePerTable: 750000 },
        { dishId: "M08", name: "Tôm càng xanh nướng bơ tỏi", category: "Hải sản", pricePerTable: 900000 },
        { dishId: "M09", name: "Tôm hùm nướng phô mai đút lò", category: "Hải sản", pricePerTable: 1800000 },
        { dishId: "M10", name: "Cua biển sốt tiêu đen Singapore", category: "Hải sản", pricePerTable: 1200000 },
        { dishId: "M11", name: "Cá chẽm hấp Hồng Kông", category: "Món chính", pricePerTable: 850000 },
        { dishId: "M13", name: "Bò Úc lúc lắc khoai tây", category: "Món chính", pricePerTable: 700000 },
        { dishId: "M14", name: "Bò Mỹ sốt tiêu xanh", category: "Món chính", pricePerTable: 1200000 },
        { dishId: "M16", name: "Gà quay mật ong da giòn", category: "Món chính", pricePerTable: 600000 },
        { dishId: "M18", name: "Heo sữa quay giòn bì", category: "Món chính", pricePerTable: 950000 },
        { dishId: "M21", name: "Lẩu hải sản chua cay Thái Lan", category: "Lẩu", pricePerTable: 850000 },
        { dishId: "M24", name: "Cơm chiên Dương Châu hoàng gia", category: "Cơm", pricePerTable: 450000 },
        { dishId: "M28", name: "Bánh flan caramel hạnh nhân", category: "Tráng miệng", pricePerTable: 250000 },
        { dishId: "M29", name: "Chè hạt sen long nhãn tuyết nhĩ", category: "Tráng miệng", pricePerTable: 300000 },
        { dishId: "M30", name: "Trái cây thập cẩm mùa cao cấp", category: "Tráng miệng", pricePerTable: 350000 }
    ],
    setMenus: [
        {
            menuId: "MENU-BASIC",
            name: "Set Menu Cơ Bản",
            tier: "basic",
            totalDishes: 6,
            pricePerTable: 3800000,
            dishIds: ["M01", "M04", "M16", "M24", "M21", "M28"],
            description: "Thực đơn 6 món phổ biến, cân đối chi phí cho tiệc cưới ấm cúng."
        },
        {
            menuId: "MENU-POPULAR",
            name: "Set Menu Phổ Biến",
            tier: "popular",
            totalDishes: 8,
            pricePerTable: 5500000,
            dishIds: ["M02", "M05", "M07", "M13", "M16", "M21", "M24", "M29"],
            description: "Thực đơn 8 món thịnh soạn, hài hòa giữa hải sản, bò và tráng miệng thanh mát."
        },
        {
            menuId: "MENU-PREMIUM",
            name: "Set Menu Cao Cấp",
            tier: "premium",
            totalDishes: 10,
            pricePerTable: 8500000,
            dishIds: ["M03", "M06", "M09", "M10", "M11", "M14", "M18", "M21", "M24", "M30"],
            description: "Thực đơn 10 món đỉnh cao với Tôm hùm, Bào ngư vi cá và Bò Mỹ."
        }
    ],
    services: [
        { serviceId: "SVC-01", name: "Gói trang trí hoa tươi sảnh & bàn tiệc", unitPrice: 12000000, category: "Trang trí", isFreeWith25Tables: false },
        { serviceId: "SVC-02", name: "Hệ thống âm thanh - ánh sáng sân khấu chuyên nghiệp", unitPrice: 10000000, category: "Kỹ thuật", isFreeWith25Tables: false },
        { serviceId: "SVC-03", name: "MC Dẫn chương trình tiệc cưới chuyên nghiệp", unitPrice: 3500000, category: "Nhân sự", isFreeWith25Tables: true },
        { serviceId: "SVC-04", name: "Tháp rượu champagne & Bánh cưới 5 tầng", unitPrice: 3000000, category: "Nghi lễ", isFreeWith25Tables: true },
        { serviceId: "SVC-05", name: "Ban nhạc hòa tấu acoustic đón khách (2 giờ)", unitPrice: 6000000, category: "Giải trí", isFreeWith25Tables: false },
        { serviceId: "SVC-06", name: "Quay phim 4K & Chụp ảnh phóng sự tiệc", unitPrice: 8000000, category: "Truyền thông", isFreeWith25Tables: false }
    ],
    customers: [
        { customerId: 1, fullName: "Nguyễn Minh Anh", phone: "0901234567", email: "minhanh.demo01@gmail.com", address: "Quận 1, TP. Hồ Chí Minh", source: "Facebook" },
        { customerId: 2, fullName: "Trần Quốc Huy", phone: "0912345678", email: "quochuy.demo02@gmail.com", address: "Quận 3, TP. Hồ Chí Minh", source: "Người quen" },
        { customerId: 3, fullName: "Lê Hoàng Nam", phone: "0983456789", email: "hoangnam.demo03@gmail.com", address: "Thủ Dầu Một, Bình Dương", source: "Facebook" },
        { customerId: 4, fullName: "Phạm Ngọc Mai", phone: "0974567890", email: "ngocmai.demo04@gmail.com", address: "Quận Bình Thạnh, TP. Hồ Chí Minh", source: "Vãng lai" },
        { customerId: 5, fullName: "Võ Thanh Tùng", phone: "0935678901", email: "thanhtung.demo05@gmail.com", address: "Biên Hòa, Đồng Nai", source: "Website" }
    ],
    contracts: [
        {
            contractId: "HD-20261003-001",
            customerId: 1,
            customerName: "Nguyễn Minh Anh",
            phone: "0901234567",
            hallId: "S01",
            hallName: "Sảnh Kim Cương",
            weddingDate: "2026-10-03",
            session: "Tối",
            tables: 40,
            menuId: "MENU-PREMIUM",
            menuName: "Set Menu Cao Cấp",
            menuTotal: 340000000,
            services: ["Gói trang trí hoa tươi", "Âm thanh ánh sáng", "MC Dẫn chương trình", "Tháp rượu champagne"],
            serviceTotal: 22000000,
            discountPercent: 5,
            discountAmount: 18100000,
            vatRate: 8,
            vatAmount: 27512000,
            totalAmount: 371412000,
            minDeposit30: 111423600,
            paidDeposit: 111423600,
            status: "Đã cọc",
            staffAssigned: { waiters: 20, mc: "MC Quốc Bình", soundTechs: 2, attendanceStatus: "present" },
            notes: "Tiệc quy mô lớn, hoa tông pastel"
        },
        {
            contractId: "HD-20261010-002",
            customerId: 2,
            customerName: "Trần Quốc Huy",
            phone: "0912345678",
            hallId: "S02",
            hallName: "Sảnh Vàng",
            weddingDate: "2026-10-10",
            session: "Trưa",
            tables: 25,
            menuId: "MENU-POPULAR",
            menuName: "Set Menu Phổ Biến",
            menuTotal: 137500000,
            services: ["Gói trang trí hoa tươi", "MC Dẫn chương trình"],
            serviceTotal: 12000000,
            discountPercent: 0,
            discountAmount: 0,
            vatRate: 8,
            vatAmount: 11960000,
            totalAmount: 161460000,
            minDeposit30: 48438000,
            paidDeposit: 0,
            status: "Chờ cọc",
            staffAssigned: { waiters: 13, mc: "MC Thanh Mai", soundTechs: 2, attendanceStatus: "present" },
            notes: "Khách hẹn chuyển khoản cọc trong 48h"
        },
        {
            contractId: "HD-20261121-003",
            customerId: 4,
            customerName: "Phạm Ngọc Mai",
            phone: "0974567890",
            hallId: "S04",
            hallName: "Sảnh Ngọc Trai",
            weddingDate: "2026-11-21",
            session: "Tối",
            tables: 18,
            menuId: "MENU-BASIC",
            menuName: "Set Menu Cơ Bản",
            menuTotal: 68400000,
            services: ["Âm thanh ánh sáng"],
            serviceTotal: 10000000,
            discountPercent: 0,
            discountAmount: 0,
            vatRate: 8,
            vatAmount: 6272000,
            totalAmount: 84672000,
            minDeposit30: 25401600,
            paidDeposit: 0,
            status: "Chờ duyệt",
            staffAssigned: { waiters: 9, mc: "Chưa phân công", soundTechs: 2, attendanceStatus: "present" },
            notes: "Trường hợp dùng để test kiểm tra xung đột trùng lịch"
        }
    ],
    users: [
        { userId: 1, username: "admin", fullName: "Quản trị viên Hệ thống", email: "admin@evmanager.vn", phone: "0909999999", roleName: "ADMIN", status: "ACTIVE" },
        { userId: 2, username: "sale", fullName: "Nguyễn Thị Thảo (Sales)", email: "thao.sale@evmanager.vn", phone: "0908888888", roleName: "SALES", status: "ACTIVE" },
        { userId: 3, username: "coord", fullName: "Lê Văn Hùng (Điều phối)", email: "hung.coord@evmanager.vn", phone: "0907777777", roleName: "COORDINATOR", status: "ACTIVE" }
    ]
};

// =============================================================================
// 2. BIẾN TRẠNG THÁI TOÀN CỤC ỨNG DỤNG
// =============================================================================
let appVenues = [];
let appCustomers = [];
let appContracts = [];
let appUsers = [];
let appDishes = [...BA_MOCK_DATA.dishes];
let appSetMenus = JSON.parse(JSON.stringify(BA_MOCK_DATA.setMenus));
let appServices = [...BA_MOCK_DATA.services];

let revenueChartInstance = null;
let pendingConfirmCallback = null;

// Quản lý trạng thái đang đổi món
let currentSwapMenuId = null;
let currentSwapDishIndex = null;

// =============================================================================
// 3. TIỆN ÍCH ĐỊNH DẠNG & THÔNG BÁO
// =============================================================================
function formatCurrency(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) amount = 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Bật Modal Xác nhận theo Quy tắc SRS v1.0 Mục 24
function showConfirmDialog(title, message, onProceed, icon = '⚠️') {
    const modal = document.getElementById('confirmDialogModal');
    const titleEl = document.getElementById('confirmDialogTitle');
    const msgEl = document.getElementById('confirmDialogMessage');
    const iconEl = document.getElementById('confirmDialogIcon');

    if (!modal) {
        if (confirm(message)) onProceed();
        return;
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    pendingConfirmCallback = onProceed;
    modal.classList.add('open');
}

function hideConfirmDialog() {
    const modal = document.getElementById('confirmDialogModal');
    if (modal) modal.classList.remove('open');
    pendingConfirmCallback = null;
}

// =============================================================================
// 4. KHỞI TẠO & KẾT NỐI API BACKEND
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    console.log("🚀 Khởi động Hệ thống Quản trị EVManager - Trung tâm Hội nghị & Tiệc cưới...");
    setupUserSessionDisplay();
    await loadInitialData();
    setupTabNavigation();
    setupEventListeners();
    renderAllViews();
}

function setupUserSessionDisplay() {
    const currentUser = sessionStorage.getItem('currentUser') || 'admin';
    const greetingEl = document.getElementById('adminSidebarGreeting');
    const roleEl = document.getElementById('adminRoleDisplay');
    const badgeEl = document.getElementById('userRoleBadge');

    if (greetingEl) greetingEl.textContent = currentUser;
    if (roleEl) roleEl.textContent = currentUser === 'admin' ? 'Quản trị viên (ADMIN)' : 'Nhân viên tư vấn (SALES)';
    if (badgeEl) badgeEl.textContent = currentUser === 'admin' ? 'ADMIN PORTAL' : 'SALES PORTAL';
}

async function loadInitialData() {
    const statusLabel = document.getElementById('backendStatusLabel');

    // 1. Tải Khách hàng (API /api/v1/customers)
    try {
        const res = await fetchAPI('/api/v1/customers');
        if (res.ok) {
            const data = await res.json();
            appCustomers = data.content || data || [];
            if (statusLabel) statusLabel.textContent = "Backend: Đã kết nối API";
        } else {
            throw new Error("API Customers status " + res.status);
        }
    } catch (e) {
        console.warn("Backend /api/v1/customers offline, nạp mock BA customers:", e.message);
        const localCust = localStorage.getItem('ev_customers');
        appCustomers = localCust ? JSON.parse(localCust) : [...BA_MOCK_DATA.customers];
    }

    // 2. Tải Sảnh tiệc (API /api/v1/venues)
    try {
        const res = await fetchAPI('/api/v1/venues');
        if (res.ok) {
            const data = await res.json();
            const list = data.content || data || [];
            if (list.length > 0) {
                appVenues = list.map(v => ({
                    hallId: `S0${v.venueId}`,
                    name: v.venueName,
                    capacityGuests: v.maxCapacity,
                    maxTables: Math.floor(v.maxCapacity / 10),
                    floor: 1,
                    rentalPrice: Number(v.rentalPrice) || 10000000,
                    status: v.status === 'AVAILABLE' ? 'AVAILABLE' : 'HOLD',
                    description: v.address
                }));
            } else {
                appVenues = [...BA_MOCK_DATA.halls];
            }
        } else {
            throw new Error("API Venues status " + res.status);
        }
    } catch (e) {
        console.warn("Backend /api/v1/venues offline, nạp mock BA halls:", e.message);
        const localVenues = localStorage.getItem('ev_venues');
        appVenues = localVenues ? JSON.parse(localVenues) : [...BA_MOCK_DATA.halls];
    }

    // 3. Tải Hợp đồng & Báo giá
    const localContracts = localStorage.getItem('ev_contracts');
    appContracts = localContracts ? JSON.parse(localContracts) : [...BA_MOCK_DATA.contracts];

    // 4. Tải Người dùng (API /api/v1/users)
    try {
        const res = await fetchAPI('/api/v1/users');
        if (res.ok) {
            const data = await res.json();
            const backendUsers = data.content || data || [];

            // Merge dữ liệu backend với danh sách mẫu để đảm bảo có đủ các role SALES, COORDINATOR
            const merged = [...backendUsers];
            const localUsers = JSON.parse(localStorage.getItem('ev_users') || '[]');
            const baseList = localUsers.length > 0 ? localUsers : BA_MOCK_DATA.users;

            baseList.forEach(bu => {
                if (!merged.some(u => u.username && u.username.toLowerCase() === bu.username.toLowerCase())) {
                    merged.push(bu);
                }
            });
            appUsers = merged;
        } else {
            throw new Error("API Users status " + res.status);
        }
    } catch (e) {
        console.warn("Backend /api/v1/users offline, nạp mock BA users:", e.message);
        const localUsers = localStorage.getItem('ev_users');
        appUsers = localUsers ? JSON.parse(localUsers) : [...BA_MOCK_DATA.users];
    }

    // Luôn đồng bộ trạng thái khóa từ ev_locked_accounts
    let lockedList = [];
    try {
        lockedList = JSON.parse(localStorage.getItem('ev_locked_accounts') || '[]');
    } catch (e) {}

    appUsers.forEach(u => {
        if (u.username === 'sales01') u.username = 'sale';
        if (u.username === 'coord01') u.username = 'coord';
        if (u.username && lockedList.includes(u.username.toLowerCase())) {
            u.status = 'LOCKED';
        }
    });
    saveLocalState();
}

function saveLocalState() {
    localStorage.setItem('ev_customers', JSON.stringify(appCustomers));
    localStorage.setItem('ev_venues', JSON.stringify(appVenues));
    localStorage.setItem('ev_contracts', JSON.stringify(appContracts));
    localStorage.setItem('ev_users', JSON.stringify(appUsers));
}

// =============================================================================
// 5. RENDER TOÀN BỘ CÁC PHÂN HỆ GIAO DIỆN
// =============================================================================
function renderAllViews() {
    renderDashboardOverview();
    renderVenuesGrid();
    renderCustomersTable();
    renderSetMenus();
    renderServicesList();
    renderContractsTable();
    renderStaffCoordinationTable();
    renderUsersTable();
    renderReports();
    updateBadges();
    populateSelectOptions();
}

function updateBadges() {
    document.getElementById('badgeVenuesCount').textContent = appVenues.length;
    document.getElementById('badgeCustomersCount').textContent = appCustomers.length;
    document.getElementById('badgeContractsCount').textContent = appContracts.length;
}

// TAB 1: BẢNG TỔNG QUAN (DASHBOARD)
function renderDashboardOverview() {
    const totalRev = appContracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
    const availableHalls = appVenues.filter(v => v.status === 'AVAILABLE').length;
    const pendingContracts = appContracts.filter(c => c.status === 'Chờ cọc' || c.status === 'Chờ duyệt').length;

    document.getElementById('doanhThu').textContent = formatCurrency(totalRev);
    document.getElementById('soSanhTrong').textContent = `${availableHalls} / ${appVenues.length} sảnh`;
    document.getElementById('soKhachHang').textContent = appCustomers.length;
    document.getElementById('hopDongCho').textContent = `${pendingContracts} đơn`;

    // Render danh sách gần đây
    const tbody = document.getElementById('quickContractsTableBody');
    if (tbody) {
        tbody.innerHTML = appContracts.slice(0, 5).map(c => `
            <tr>
                <td><strong>${c.contractId}</strong></td>
                <td>${c.customerName || 'N/A'}</td>
                <td>${c.hallName || 'Sảnh'} (${c.weddingDate ? formatDate(c.weddingDate) : 'N/A'})</td>
                <td>${getContractStatusBadge(c.status)}</td>
            </tr>
        `).join('');
    }

    renderRevenueChart();
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (revenueChartInstance) revenueChartInstance.destroy();

    revenueChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['T5/2026', 'T6/2026', 'T7/2026', 'T8/2026', 'T9/2026', 'T10/2026'],
            datasets: [{
                label: 'Doanh thu tiệc cưới (Triệu VNĐ)',
                data: [150, 220, 180, 310, 290, 480],
                backgroundColor: '#087f82',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// =============================================================================
// TAB 2: QUẢN LÝ SẢNH & THUẬT TOÁN XUNG ĐỘT (UC-04, UC-05)
// =============================================================================
function renderVenuesGrid() {
    const container = document.getElementById('venuesGridContainer');
    if (!container) return;

    container.innerHTML = appVenues.map(v => {
        let statusBadge = `<span class="badge-status badge-status--available">Trống (Sẵn sàng)</span>`;
        if (v.status === 'HOLD') {
            statusBadge = `<span class="badge-status badge-status--hold">Đang giữ chỗ (HOLD)</span>`;
        } else if (v.status === 'BOOKED' || v.status === 'ĐÃ ĐẶT') {
            statusBadge = `<span class="badge-status badge-status--booked">Đã khóa lịch</span>`;
        }

        return `
            <div class="venue-card">
                <div>
                    <div class="venue-card-header">
                        <div>
                            <h3 class="venue-name">${v.name}</h3>
                            <span class="venue-floor">Tầng ${v.floor || 1} • Mã: ${v.hallId}</span>
                        </div>
                        ${statusBadge}
                    </div>

                    <p style="font-size:0.85rem; color:var(--muted); margin:0 0 10px 0;">${v.description || ''}</p>

                    <div class="venue-specs">
                        <div class="venue-spec-item">
                            <span>Sức chứa tối đa:</span>
                            <strong>${v.maxTables} bàn (${v.capacityGuests} khách)</strong>
                        </div>
                        <div class="venue-spec-item">
                            <span>Giá thuê sàn:</span>
                            <strong>${formatCurrency(v.rentalPrice || 10000000)}</strong>
                        </div>
                    </div>
                </div>

                <div>
                    ${v.status === 'HOLD' ? `
                        <div class="badge-hold-timer" style="margin-bottom: 10px; width: 100%; justify-content: center;">
                            ⏳ Tạm giữ: ${v.holdCustomer || 'Khách hàng'} • Hết hạn sau 36 giờ
                        </div>
                    ` : ''}

                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="openCheckVenueForHall('${v.hallId}')">
                            🔍 Tra cứu lịch
                        </button>
                        ${v.status === 'AVAILABLE' ? `
                            <button class="btn btn-primary btn-sm" onclick="quickHoldVenue('${v.hallId}')">
                                📌 Giữ chỗ (HOLD 48h)
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// THUẬT TOÁN KIỂM TRA XUNG ĐỘT SẢNH (UC-04 & BR-01 -> BR-09)
function checkVenueConflict(hallId, dateStr, session, tablesNeeded) {
    const hall = appVenues.find(v => v.hallId === hallId);
    if (!hall) return { hasConflict: true, reason: "Sảnh không tồn tại" };

    // 1. Kiểm tra sức chứa
    if (tablesNeeded > hall.maxTables) {
        return {
            hasConflict: true,
            type: "CAPACITY",
            reason: `Sảnh ${hall.name} có sức chứa tối đa ${hall.maxTables} bàn. Số bàn dự kiến (${tablesNeeded} bàn) vượt quá giới hạn cho phép.`
        };
    }

    // 2. Kiểm tra trùng lịch hợp đồng đã tồn tại
    const conflictingContract = appContracts.find(c =>
        c.hallId === hallId &&
        c.weddingDate === dateStr &&
        c.session === session &&
        c.status !== 'Đã hủy'
    );

    if (conflictingContract) {
        return {
            hasConflict: true,
            type: "SCHEDULE",
            reason: `Phát hiện XUNG ĐỘT LỊCH! Sảnh ${hall.name} đã được đặt cho Hợp đồng ${conflictingContract.contractId} (${conflictingContract.customerName}) vào ${session === 'Trưa' ? 'Ca Trưa (10:00 - 14:00)' : 'Ca Tối (17:00 - 21:00)'} ngày ${formatDate(dateStr)}.`,
            conflictingContract
        };
    }

    // 3. Kiểm tra nếu sảnh đang bị giữ chỗ (HOLD)
    if (hall.status === 'HOLD' && hall.holdCustomer) {
        return {
            hasConflict: true,
            type: "HOLD",
            reason: `Sảnh ${hall.name} hiện đang ở trạng thái TẠM GIỮ (HOLD) cho khách hàng ${hall.holdCustomer}. Vui lòng chọn sảnh khác hoặc chờ hết hạn 48 giờ.`
        };
    }

    return { hasConflict: false };
}

// Xử lý gửi Form Tra cứu sảnh
document.getElementById('checkVenueForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const dateStr = document.getElementById('checkDate').value;
    const session = document.getElementById('checkSession').value;
    const tables = parseInt(document.getElementById('checkTables').value) || 20;
    const selectedHall = document.getElementById('checkHallSelect').value;
    const resultBox = document.getElementById('checkResultContainer');

    if (!resultBox) return;

    // Gọi API Backend tra cứu sảnh khả dụng nếu có
    try {
        await fetchAPI(`/api/v1/venues/available?date=${dateStr}&session=${session}`);
    } catch (err) {
        // Backend offline -> Tiếp tục dùng thuật toán kiểm tra chuyên sâu client-side
    }

    resultBox.style.display = 'block';

    if (selectedHall !== 'ALL') {
        const result = checkVenueConflict(selectedHall, dateStr, session, tables);
        const hall = appVenues.find(v => v.hallId === selectedHall);

        if (result.hasConflict) {
            // Tìm sảnh thay thế còn trống
            const substitutes = appVenues.filter(v =>
                v.hallId !== selectedHall &&
                v.maxTables >= tables &&
                !checkVenueConflict(v.hallId, dateStr, session, tables).hasConflict
            );

            resultBox.innerHTML = `
                <div class="conflict-alert-box">
                    <span class="alert-icon">⚠️</span>
                    <div>
                        <h4>CẢNH BÁO XUNG ĐỘT: ${result.reason}</h4>
                        <p style="margin:0 0 10px 0; font-size:0.9rem;">
                            Theo Quy tắc BR-08: Hệ thống tuyệt đối ngăn chặn việc đặt đè lịch lên sảnh đang bận.
                        </p>
                        ${substitutes.length > 0 ? `
                            <div class="suggested-venues-box">
                                <strong>💡 Gợi ý sảnh thay thế phù hợp (đủ sức chứa & còn trống):</strong>
                                <div style="display:flex; gap:10px; margin-top:8px;">
                                    ${substitutes.map(s => `
                                        <button type="button" class="btn btn-outline btn-sm" onclick="selectSuggestedVenue('${s.hallId}')">
                                            🏰 ${s.name} (${s.maxTables} bàn)
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '<div style="color:#b91c1c; font-size:0.85rem;">Không tìm thấy sảnh thay thế nào còn trống cho ca tiệc này. Vui lòng chuyển ngày hoặc ca khác.</div>'}
                    </div>
                </div>
            `;
        } else {
            resultBox.innerHTML = `
                <div style="background:#ecfdf5; border:1px solid #10b981; border-radius:12px; padding:18px; color:#065f46; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="margin:0 0 4px 0; font-size:1.05rem;">✅ Sảnh ${hall.name} HOÀN TOÀN KHẢ DỤNG!</h4>
                        <p style="margin:0; font-size:0.88rem;">
                            Ngày ${formatDate(dateStr)} • ${session === 'Trưa' ? 'Ca Trưa (10h-14h + 60p dọn)' : 'Ca Tối (17h-21h + 60p dọn)'} • Sức chứa ${hall.maxTables} bàn đáp ứng tốt yêu cầu ${tables} bàn.
                        </p>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="proceedToHoldOrQuote('${hall.hallId}', '${dateStr}', '${session}', ${tables})">
                        Tạo Báo Giá / Giữ Sảnh →
                    </button>
                </div>
            `;
        }
    } else {
        // Kiểm tra toàn bộ sảnh
        let html = `<h4 style="margin:0 0 12px 0;">Kết quả tra cứu trạng thái toàn bộ sảnh ngày ${formatDate(dateStr)} (${session}):</h4><div class="venues-grid">`;
        appVenues.forEach(v => {
            const res = checkVenueConflict(v.hallId, dateStr, session, tables);
            html += `
                <div class="venue-card" style="${res.hasConflict ? 'border-color:#fca5a5; background:#fffbfb;' : 'border-color:#6ee7b7; background:#f0fdfa;'}">
                    <div>
                        <div class="venue-card-header">
                            <h4 style="margin:0;">${v.name}</h4>
                            ${res.hasConflict ? `<span class="badge-status badge-status--conflict">Không khả dụng</span>` : `<span class="badge-status badge-status--available">Trống</span>`}
                        </div>
                        <p style="font-size:0.85rem; color:${res.hasConflict ? '#b91c1c' : '#065f46'}; margin:8px 0;">
                            ${res.hasConflict ? res.reason : `Sẵn sàng nhận tiệc (${v.maxTables} bàn)`}
                        </p>
                    </div>
                    ${!res.hasConflict ? `
                        <button type="button" class="btn btn-primary btn-sm" onclick="proceedToHoldOrQuote('${v.hallId}', '${dateStr}', '${session}', ${tables})">
                            Chọn sảnh này →
                        </button>
                    ` : ''}
                </div>
            `;
        });
        html += `</div>`;
        resultBox.innerHTML = html;
    }
});

function openCheckVenueForHall(hallId) {
    switchAdminTab('tab-venues');
    const select = document.getElementById('checkHallSelect');
    if (select) select.value = hallId;
    const dateInput = document.getElementById('checkDate');
    if (dateInput && !dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

function selectSuggestedVenue(hallId) {
    document.getElementById('checkHallSelect').value = hallId;
    document.getElementById('btnCheckVenueAvailability').click();
}

function proceedToHoldOrQuote(hallId, dateStr, session, tables) {
    openCreateQuotationModalWithData({ hallId, dateStr, session, tables });
}

// Nút Giữ chỗ nhanh sảnh 48 giờ (UC-05)
function quickHoldVenue(hallId) {
    const hall = appVenues.find(v => v.hallId === hallId);
    if (!hall) return;

    showConfirmDialog(
        `Giữ chỗ Sảnh ${hall.name} (HOLD 48h)`,
        `Bạn có chắc chắn muốn chuyển Sảnh ${hall.name} sang trạng thái TẠM GIỮ (HOLD)? Hệ thống sẽ thiết lập thời hạn hiệu lực là 48 giờ kể từ lúc này.`,
        () => {
            hall.status = 'HOLD';
            hall.holdExpireAt = new Date(Date.now() + 48 * 3600000).toISOString();
            hall.holdCustomer = "Khách tư vấn chưa cọc";
            saveLocalState();
            renderVenuesGrid();
            renderDashboardOverview();
            alert(`Giữ sảnh ${hall.name} thành công! Thời hạn hiệu lực: 48 giờ.`);
        }
    );
}

// =============================================================================
// TAB 3: QUẢN LÝ KHÁCH HÀNG (UC-03 & BACKEND API /api/v1/customers)
// =============================================================================
function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('customerSearchInput')?.value || '').toLowerCase().trim();
    const sourceFilter = document.getElementById('customerSourceFilter')?.value || 'ALL';

    const filtered = appCustomers.filter(c => {
        const name = (c.fullName || c.name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const address = (c.address || '').toLowerCase();

        const matchSearch = name.includes(searchTerm) || phone.includes(searchTerm) || email.includes(searchTerm) || address.includes(searchTerm);
        const matchSource = sourceFilter === 'ALL' || c.source === sourceFilter;
        return matchSearch && matchSource;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--muted);">Chưa có hồ sơ khách hàng nào phù hợp.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(c => `
        <tr>
            <td><strong>KH-${c.customerId || c.id}</strong></td>
            <td><strong>${c.fullName || c.name}</strong></td>
            <td>📞 ${c.phone}</td>
            <td>✉️ ${c.email || 'N/A'}</td>
            <td>📍 ${c.address || 'N/A'}</td>
            <td><span class="badge-status" style="background:#f1f5f9; color:#475569;">${c.source || 'Trực tiếp'}</span></td>
            <td class="text-right">
                <button class="btn-action" onclick="openEditCustomer(${c.customerId || c.id})">✏️ Sửa</button>
                <button class="btn-action btn-action--danger" onclick="deleteCustomer(${c.customerId || c.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Thêm / Sửa khách hàng kết nối API /api/v1/customers
document.getElementById('customerForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editId = document.getElementById('customerEditId').value;
    const fullName = document.getElementById('customerFullName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const source = document.getElementById('customerSource').value;

    const payload = { fullName, phone, email, address };

    showConfirmDialog(
        editId ? "Xác nhận cập nhật hồ sơ khách hàng" : "Xác nhận lưu khách hàng mới",
        `Lưu thông tin khách hàng: ${fullName} (SĐT: ${phone}) vào cơ sở dữ liệu?`,
        async () => {
            try {
                if (editId) {
                    const res = await fetchAPI(`/api/v1/customers/${editId}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        const updated = await res.json();
                        const idx = appCustomers.findIndex(c => (c.customerId || c.id) == editId);
                        if (idx !== -1) appCustomers[idx] = { ...appCustomers[idx], ...updated, source };
                    }
                } else {
                    const res = await fetchAPI('/api/v1/customers', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        const created = await res.json();
                        appCustomers.unshift({ ...created, source });
                    }
                }
            } catch (err) {
                console.warn("Backend offline, cập nhật client-side:", err.message);
                if (editId) {
                    const idx = appCustomers.findIndex(c => (c.customerId || c.id) == editId);
                    if (idx !== -1) appCustomers[idx] = { ...appCustomers[idx], fullName, phone, email, address, source };
                } else {
                    const newId = appCustomers.length > 0 ? Math.max(...appCustomers.map(c => c.customerId || c.id || 0)) + 1 : 1;
                    appCustomers.unshift({ customerId: newId, fullName, phone, email, address, source });
                }
            }

            saveLocalState();
            renderCustomersTable();
            renderDashboardOverview();
            closeCustomerModal();
            populateSelectOptions();
            alert(editId ? "Cập nhật khách hàng thành công!" : "Thêm khách hàng mới thành công!");
        }
    );
});

function openEditCustomer(id) {
    const cust = appCustomers.find(c => (c.customerId || c.id) == id);
    if (!cust) return;

    document.getElementById('customerEditId').value = id;
    document.getElementById('customerFullName').value = cust.fullName || cust.name || '';
    document.getElementById('customerPhone').value = cust.phone || '';
    document.getElementById('customerEmail').value = cust.email || '';
    document.getElementById('customerAddress').value = cust.address || '';
    document.getElementById('customerSource').value = cust.source || 'Facebook';

    document.getElementById('customerModalTitle').textContent = 'Chỉnh sửa hồ sơ khách hàng';
    document.getElementById('customerModal')?.classList.add('open');
}

function deleteCustomer(id) {
    const cust = appCustomers.find(c => (c.customerId || c.id) == id);
    if (!cust) return;

    showConfirmDialog(
        "Xác nhận xóa hồ sơ khách hàng",
        `Bạn có chắc chắn muốn xóa khách hàng "${cust.fullName || cust.name}"? Thao tác này không thể hoàn tác.`,
        async () => {
            try {
                await fetchAPI(`/api/v1/customers/${id}`, { method: 'DELETE' });
            } catch (e) {
                console.warn("Backend offline:", e.message);
            }
            appCustomers = appCustomers.filter(c => (c.customerId || c.id) != id);
            saveLocalState();
            renderCustomersTable();
            renderDashboardOverview();
            populateSelectOptions();
        }
    );
}

// =============================================================================
// TAB 4: THỰC ĐƠN & GÓI DỊCH VỤ (UC-06, UC-07)
// =============================================================================
function renderSetMenus() {
    const container = document.getElementById('setMenusGrid');
    if (!container) return;

    container.innerHTML = appSetMenus.map(menu => {
        const dishObjects = menu.dishIds.map(dId => appDishes.find(d => d.dishId === dId)).filter(Boolean);

        return `
            <div class="menu-card">
                <div>
                    <div class="menu-card-header">
                        <span class="menu-tier-tag ${menu.tier}">${menu.name}</span>
                        <div style="font-size:1.35rem; font-weight:800; color:var(--teal); margin:6px 0;">
                            ${formatCurrency(menu.pricePerTable)} <span style="font-size:0.85rem; font-weight:500; color:var(--muted);">/ bàn</span>
                        </div>
                        <p style="font-size:0.85rem; color:var(--muted); margin:0;">${menu.description}</p>
                    </div>

                    <div style="font-size:0.8rem; font-weight:700; color:var(--ink); margin-bottom:8px;">
                        DANH SÁCH ${dishObjects.length} MÓN TRONG SET:
                    </div>

                    <ul class="dish-list">
                        ${dishObjects.map((dish, idx) => `
                            <li class="dish-item">
                                <div>
                                    <div class="dish-item-name">${dish.name}</div>
                                    <span class="dish-item-category">${dish.category} • ${formatCurrency(dish.pricePerTable)}</span>
                                </div>
                                <button type="button" class="btn-swap-dish" onclick="openSwapDishModal('${menu.menuId}', ${idx})">
                                    🔄 Đổi món
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="border-top:1px solid var(--line); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.85rem; color:var(--muted);">Quy chuẩn: 10 khách/bàn</span>
                    <button type="button" class="btn btn-outline btn-sm" onclick="openCreateQuotationWithMenu('${menu.menuId}')">
                        Chọn lập báo giá →
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Modal đổi món và tính chênh lệch giá (UC-06 & BR-07)
function openSwapDishModal(menuId, dishIndex) {
    const menu = appSetMenus.find(m => m.menuId === menuId);
    if (!menu) return;

    currentSwapMenuId = menuId;
    currentSwapDishIndex = dishIndex;

    const oldDishId = menu.dishIds[dishIndex];
    const oldDish = appDishes.find(d => d.dishId === oldDishId);

    document.getElementById('swapOldDishName').textContent = oldDish.name;
    document.getElementById('swapOldDishPrice').textContent = formatCurrency(oldDish.pricePerTable);
    document.getElementById('swapDishCategory').textContent = oldDish.category;

    // Lọc danh sách món thay thế
    const select = document.getElementById('swapDishSelect');
    const availableAlternatives = appDishes.filter(d => d.dishId !== oldDishId);

    select.innerHTML = availableAlternatives.map(d => `
        <option value="${d.dishId}" data-price="${d.pricePerTable}">
            [${d.category}] ${d.name} - ${formatCurrency(d.pricePerTable)}
        </option>
    `).join('');

    updateSwapDiffPreview();
    select.onchange = updateSwapDiffPreview;

    document.getElementById('swapDishModal')?.classList.add('open');
}

function updateSwapDiffPreview() {
    const menu = appSetMenus.find(m => m.menuId === currentSwapMenuId);
    const oldDish = appDishes.find(d => d.dishId === menu.dishIds[currentSwapDishIndex]);

    const select = document.getElementById('swapDishSelect');
    const selectedOpt = select.options[select.selectedIndex];
    const newPrice = Number(selectedOpt.getAttribute('data-price')) || 0;
    const diff = newPrice - oldDish.pricePerTable;

    const diffBox = document.getElementById('swapDiffPreview');
    if (diffBox) {
        if (diff > 0) {
            diffBox.innerHTML = `Chênh lệch: <strong style="color:#d97706;">+${formatCurrency(diff)}</strong> / bàn (Tăng đơn giá Set Menu)`;
        } else if (diff < 0) {
            diffBox.innerHTML = `Chênh lệch: <strong style="color:#059669;">${formatCurrency(diff)}</strong> / bàn (Giảm đơn giá Set Menu)`;
        } else {
            diffBox.innerHTML = `Chênh lệch: <strong>0 ₫</strong> (Đồng giá)`;
        }
    }
}

document.getElementById('btnConfirmSwapDish')?.addEventListener('click', function() {
    const menu = appSetMenus.find(m => m.menuId === currentSwapMenuId);
    const oldDish = appDishes.find(d => d.dishId === menu.dishIds[currentSwapDishIndex]);

    const select = document.getElementById('swapDishSelect');
    const newDishId = select.value;
    const newDish = appDishes.find(d => d.dishId === newDishId);

    const diff = newDish.pricePerTable - oldDish.pricePerTable;

    showConfirmDialog(
        "Xác nhận thay đổi món ăn",
        `Đổi món "${oldDish.name}" thành "${newDish.name}"? Đơn giá Set Menu sẽ thay đổi: ${formatCurrency(menu.pricePerTable)} → ${formatCurrency(menu.pricePerTable + diff)}/bàn.`,
        () => {
            menu.dishIds[currentSwapDishIndex] = newDishId;
            menu.pricePerTable += diff;
            renderSetMenus();
            closeModal('swapDishModal');
            alert(`Đã đổi món thành công! Đơn giá mới: ${formatCurrency(menu.pricePerTable)} / bàn.`);
        }
    );
});

// Render danh mục dịch vụ & chính sách ưu đãi >25 bàn (UC-07)
function renderServicesList() {
    const container = document.getElementById('servicesGrid');
    if (!container) return;

    container.innerHTML = appServices.map(svc => `
        <div class="service-select-card ${svc.isFreeWith25Tables ? 'free-gift' : ''}">
            <div>
                ${svc.isFreeWith25Tables ? `<span class="gift-ribbon">🎁 TẶNG MIỄN PHÍ TIỆC > 25 BÀN</span>` : ''}
                <h4 style="margin:4px 0 8px 0; font-size:1rem;">${svc.name}</h4>
                <p style="font-size:0.85rem; color:var(--muted); margin:0;">Phân loại: ${svc.category}</p>
            </div>
            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:var(--teal); font-size:1.1rem;">${formatCurrency(svc.unitPrice)}</strong>
                <span class="badge-status" style="background:#f1f5f9;">Trọn gói</span>
            </div>
        </div>
    `).join('');
}

// =============================================================================
// TAB 5: BÁO GIÁ & HỢP ĐỒNG (UC-08, UC-09, UC-10)
// =============================================================================
function renderContractsTable() {
    const tbody = document.getElementById('contractsTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('contractSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('contractStatusFilter')?.value || 'ALL';

    const filtered = appContracts.filter(c => {
        const id = (c.contractId || '').toLowerCase();
        const cust = (c.customerName || '').toLowerCase();
        const hall = (c.hallName || '').toLowerCase();

        const matchSearch = id.includes(searchTerm) || cust.includes(searchTerm) || hall.includes(searchTerm);
        const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--muted);">Chưa có hợp đồng nào phù hợp.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(c => `
        <tr>
            <td><strong>${c.contractId}</strong></td>
            <td>
                <strong>${c.customerName}</strong>
                <div style="font-size:0.75rem; color:var(--muted);">📞 ${c.phone || 'N/A'}</div>
            </td>
            <td>🏰 ${c.hallName}</td>
            <td>📅 ${formatDate(c.weddingDate)} (${c.session || 'Tối'})</td>
            <td><strong style="color:var(--teal);">${c.tables} bàn</strong></td>
            <td><strong>${formatCurrency(c.totalAmount)}</strong></td>
            <td><span style="color:#b45309; font-weight:700;">${formatCurrency(c.minDeposit30)}</span></td>
            <td><strong style="color:#059669;">${formatCurrency(c.paidDeposit || 0)}</strong></td>
            <td>${getContractStatusBadge(c.status)}</td>
            <td class="text-right">
                <div class="btn-action-group">
                    <button class="btn-action" onclick="viewContractA4('${c.contractId}')" title="Xem Hợp Đồng A4">📄 In HĐ</button>
                    ${c.status !== 'Đã cọc' && c.status !== 'Hoàn tất' ? `
                        <button class="btn-action btn-action--primary" onclick="openDepositModal('${c.contractId}')" title="Thu tiền cọc 30%">💳 Cọc 30%</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function getContractStatusBadge(status) {
    if (status === 'Đã cọc') return `<span class="badge-status badge-status--da-coc">Đã cọc (Đã khóa sảnh)</span>`;
    if (status === 'Chờ cọc') return `<span class="badge-status badge-status--hold">Chờ cọc (Giữ sảnh)</span>`;
    if (status === 'Hoàn tất') return `<span class="badge-status badge-status--available">Hoàn tất</span>`;
    return `<span class="badge-status" style="background:#f1f5f9; color:#475569;">${status || 'Chờ duyệt'}</span>`;
}

// Tính toán chi phí báo giá thời gian thực (UC-08)
function recalculateQuotationModal() {
    const tables = parseInt(document.getElementById('quoteTables').value) || 20;
    const menuId = document.getElementById('quoteMenuSelect').value;
    const discountPct = parseFloat(document.getElementById('quoteDiscountPercent').value) || 0;

    const menu = appSetMenus.find(m => m.menuId === menuId);
    const menuPrice = menu ? menu.pricePerTable : 4500000;
    const menuTotal = tables * menuPrice;

    // Dịch vụ cố định mẫu: Hoa tươi 12tr, Âm thanh 10tr
    let serviceTotal = 12000000 + 10000000;

    // Chính sách tặng kèm >25 bàn: Tặng MC (3.5tr) + Tháp rượu (3tr) = 0 VNĐ
    const giftNotice = document.getElementById('quoteGiftNotice');
    if (tables >= 25) {
        if (giftNotice) giftNotice.style.display = 'block';
    } else {
        if (giftNotice) giftNotice.style.display = 'none';
        serviceTotal += 3500000 + 3000000;
    }

    const subTotal = menuTotal + serviceTotal;
    const discountAmount = subTotal * (discountPct / 100);
    const beforeVat = subTotal - discountAmount;
    const vatAmount = beforeVat * 0.08;
    const grandTotal = beforeVat + vatAmount;
    const minDeposit30 = grandTotal * 0.3;

    document.getElementById('quoteMenuTotalText').textContent = formatCurrency(menuTotal);
    document.getElementById('quoteServiceTotalText').textContent = formatCurrency(serviceTotal);
    document.getElementById('quoteDiscountText').textContent = `-${formatCurrency(discountAmount)}`;
    document.getElementById('quoteVatText').textContent = formatCurrency(vatAmount);
    document.getElementById('quoteGrandTotalText').textContent = formatCurrency(grandTotal);
    document.getElementById('quoteMinDepositText').textContent = formatCurrency(minDeposit30);
}

// Mở modal lập báo giá với dữ liệu sẵn
function openCreateQuotationModalWithData(data = {}) {
    populateSelectOptions();
    if (data.hallId) document.getElementById('quoteHallSelect').value = data.hallId;
    if (data.dateStr) document.getElementById('quoteDate').value = data.dateStr;
    if (data.session) document.getElementById('quoteSession').value = data.session;
    if (data.tables) document.getElementById('quoteTables').value = data.tables;

    recalculateQuotationModal();
    document.getElementById('quotationModal')?.classList.add('open');
}

function openCreateQuotationWithMenu(menuId) {
    switchAdminTab('tab-contracts');
    openCreateQuotationModalWithData();
    const menuSelect = document.getElementById('quoteMenuSelect');
    if (menuSelect) menuSelect.value = menuId;
    recalculateQuotationModal();
}

// Xử lý gửi Form Phát hành báo giá & Tạo hợp đồng (UC-08, UC-09)
document.getElementById('quotationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = document.getElementById('quoteCustomerSelect').value;
    const hallId = document.getElementById('quoteHallSelect').value;
    const dateStr = document.getElementById('quoteDate').value;
    const session = document.getElementById('quoteSession').value;
    const tables = parseInt(document.getElementById('quoteTables').value) || 20;
    const menuId = document.getElementById('quoteMenuSelect').value;
    const discountPct = parseFloat(document.getElementById('quoteDiscountPercent').value) || 0;

    // Kiểm tra xung đột lịch trước khi tạo hợp đồng
    const conflict = checkVenueConflict(hallId, dateStr, session, tables);
    if (conflict.hasConflict) {
        alert(`Không thể tạo hợp đồng do phát hiện xung đột sảnh: ${conflict.reason}`);
        return;
    }

    const customer = appCustomers.find(c => (c.customerId || c.id) == customerId);
    const hall = appVenues.find(v => v.hallId === hallId);
    const menu = appSetMenus.find(m => m.menuId === menuId);

    const menuTotal = tables * menu.pricePerTable;
    let serviceTotal = 22000000;
    if (tables < 25) serviceTotal += 6500000;

    const subTotal = menuTotal + serviceTotal;
    const discountAmount = subTotal * (discountPct / 100);
    const beforeVat = subTotal - discountAmount;
    const vatAmount = beforeVat * 0.08;
    const grandTotal = beforeVat + vatAmount;
    const minDeposit30 = grandTotal * 0.3;

    // Sinh mã hợp đồng chuẩn: HD-YYYYMMDD-XXX
    const cleanDate = dateStr.replace(/-/g, '');
    const randNum = String(Math.floor(100 + Math.random() * 900));
    const contractCode = `HD-${cleanDate}-${randNum}`;

    showConfirmDialog(
        "Xác nhận Phát hành Báo giá & Khởi tạo Hợp đồng",
        `Khởi tạo Hợp đồng ${contractCode} cho khách hàng ${customer.fullName || customer.name} tại ${hall.name} với tổng giá trị tạm tính: ${formatCurrency(grandTotal)}?`,
        () => {
            const newContract = {
                contractId: contractCode,
                customerId: customer.customerId || customer.id,
                customerName: customer.fullName || customer.name,
                phone: customer.phone,
                hallId: hall.hallId,
                hallName: hall.name,
                weddingDate: dateStr,
                session: session,
                tables: tables,
                menuId: menu.menuId,
                menuName: menu.name,
                menuTotal: menuTotal,
                services: ["Gói trang trí hoa tươi", "Âm thanh ánh sáng", "MC Dẫn chương trình", "Tháp rượu champagne"],
                serviceTotal: serviceTotal,
                discountPercent: discountPct,
                discountAmount: discountAmount,
                vatRate: 8,
                vatAmount: vatAmount,
                totalAmount: grandTotal,
                minDeposit30: minDeposit30,
                paidDeposit: 0,
                status: "Chờ cọc",
                staffAssigned: { waiters: Math.ceil(tables / 2), mc: "MC Chuyên nghiệp", soundTechs: 2, attendanceStatus: "present" },
                notes: "Báo giá có thời hạn hiệu lực 7 ngày theo quy định."
            };

            appContracts.unshift(newContract);

            // Chuyển sảnh sang trạng thái HOLD tạm thời chờ cọc
            hall.status = 'HOLD';
            hall.holdExpireAt = new Date(Date.now() + 48 * 3600000).toISOString();
            hall.holdCustomer = customer.fullName || customer.name;

            saveLocalState();
            renderContractsTable();
            renderVenuesGrid();
            renderDashboardOverview();
            closeModal('quotationModal');

            alert(`Phát hành Báo giá & Tạo Hợp đồng thành công! Mã HĐ: ${contractCode}. Vui lòng thực hiện thu tiền cọc 30% để khóa sảnh chính thức.`);
        }
    );
});

// MODAL ĐẶT CỌC 30% & HIỂN THỊ MÃ QR CODE (UC-10)
function openDepositModal(contractId) {
    const contract = appContracts.find(c => c.contractId === contractId);
    if (!contract) return;

    document.getElementById('depositContractId').value = contractId;
    document.getElementById('depositContractCode').textContent = contract.contractId;
    document.getElementById('depositCustomerName').textContent = contract.customerName;
    document.getElementById('depositHallName').textContent = contract.hallName;
    document.getElementById('depositAmountText').textContent = formatCurrency(contract.minDeposit30);
    document.getElementById('depositTransferContent').textContent = `COC ${contract.contractId}`;

    // Sinh link QR Code chuẩn ngân hàng (VietQR / QuickChart)
    const qrAmount = Math.round(contract.minDeposit30);
    const qrDesc = encodeURIComponent(`COC ${contract.contractId}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=EVMANAGER_PAYMENT_${contract.contractId}_AMOUNT_${qrAmount}`;
    document.getElementById('depositQrImage').src = qrUrl;

    document.getElementById('depositModal')?.classList.add('open');
}

document.getElementById('btnConfirmDeposit')?.addEventListener('click', function() {
    const contractId = document.getElementById('depositContractId').value;
    const method = document.getElementById('depositPayMethod').value;
    const contract = appContracts.find(c => c.contractId === contractId);
    if (!contract) return;

    showConfirmDialog(
        "Xác nhận Thu tiền cọc & Khóa sảnh",
        `Xác nhận đã nhận khoản tiền cọc 30% (${formatCurrency(contract.minDeposit30)}) bằng hình thức [${method}] cho Hợp đồng ${contractId}? Sảnh ${contract.hallName} sẽ chuyển sang trạng thái CHÍNH THỨC KHÓA LỊCH.`,
        () => {
            contract.paidDeposit = contract.minDeposit30;
            contract.status = "Đã cọc";

            // Chuyển sảnh sang ĐÃ ĐẶT (Khóa sảnh chính thức)
            const hall = appVenues.find(v => v.hallId === contract.hallId);
            if (hall) {
                hall.status = 'BOOKED';
                delete hall.holdExpireAt;
            }

            saveLocalState();
            renderContractsTable();
            renderVenuesGrid();
            renderDashboardOverview();
            closeModal('depositModal');

            alert(`Xác nhận thanh toán cọc thành công! Sảnh ${contract.hallName} đã được chính thức khóa cho ngày ${formatDate(contract.weddingDate)}.`);
        }
    );
});

// XEM & IN HỢP ĐỒNG A4 (UC-09)
function viewContractA4(contractId) {
    const contract = appContracts.find(c => c.contractId === contractId);
    if (!contract) return;

    const preview = document.getElementById('contractA4Content');
    if (!preview) return;

    preview.innerHTML = `
        <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:12px; margin-bottom:20px;">
            <h4 style="margin:0; text-transform:uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
            <p style="margin:2px 0 0 0; font-weight:700;">Độc lập - Tự do - Hạnh phúc</p>
            <h2 style="margin:16px 0 6px 0; text-transform:uppercase; color:#087f82;">HỢP ĐỒNG DỊCH VỤ TỔ CHỨC TIỆC CƯỚI</h2>
            <p style="margin:0;">Số: <strong>${contract.contractId}</strong></p>
        </div>

        <p>Hôm nay, ngày ${new Date().toLocaleDateString('vi-VN')}, tại Trung tâm Hội nghị & Tiệc cưới EVManager, hai bên gồm có:</p>

        <h4 style="margin:12px 0 6px 0;">BÊN A (ĐƠN VỊ CUNG CẤP DỊCH VỤ):</h4>
        <p style="margin:0 0 10px 0;">
            - Tên đơn vị: <strong>TRUNG TÂM HỘI NGHỊ & TIỆC CƯỚI EVMANAGER</strong><br>
            - Địa chỉ: Số 123 Đại lộ Sự Kiện, Quận 1, TP. Hồ Chí Minh<br>
            - Đại diện: Ban Giám Đốc điều hành • Hotline: 1900 8888
        </p>

        <h4 style="margin:12px 0 6px 0;">BÊN B (KHÁCH HÀNG ĐẶT TIỆC):</h4>
        <p style="margin:0 0 10px 0;">
            - Đại diện: Ông/Bà <strong>${contract.customerName}</strong><br>
            - Số điện thoại: <strong>${contract.phone || '0901234567'}</strong>
        </p>

        <h4 style="margin:12px 0 6px 0;">NỘI DUNG VÀ CHI PHÍ TIỆC:</h4>
        <table style="width:100%; border-collapse:collapse; margin-bottom:14px;" border="1">
            <tr style="background:#f8fafc;">
                <th style="padding:6px;">Hạng mục</th>
                <th style="padding:6px;">Quy cách</th>
                <th style="padding:6px; text-align:right;">Thành tiền</th>
            </tr>
            <tr>
                <td style="padding:6px;">Sảnh tổ chức & Thời gian</td>
                <td style="padding:6px;">${contract.hallName} (Ca ${contract.session || 'Tối'} ngày ${formatDate(contract.weddingDate)})</td>
                <td style="padding:6px; text-align:right;">Đã gồm phí sàn</td>
            </tr>
            <tr>
                <td style="padding:6px;">Thực đơn (${contract.menuName})</td>
                <td style="padding:6px;">${contract.tables} bàn chính thức</td>
                <td style="padding:6px; text-align:right;">${formatCurrency(contract.menuTotal)}</td>
            </tr>
            <tr>
                <td style="padding:6px;">Dịch vụ bổ sung đi kèm</td>
                <td style="padding:6px;">${contract.services ? contract.services.join(', ') : 'Trọn gói'}</td>
                <td style="padding:6px; text-align:right;">${formatCurrency(contract.serviceTotal)}</td>
            </tr>
            <tr>
                <td style="padding:6px;">Thuế VAT (8%)</td>
                <td style="padding:6px;">Theo quy định pháp luật</td>
                <td style="padding:6px; text-align:right;">${formatCurrency(contract.vatAmount)}</td>
            </tr>
            <tr style="font-weight:700; background:#f0fdfa;">
                <td style="padding:8px;" colspan="2">TỔNG GIÁ TRỊ HỢP ĐỒNG TẠM TÍNH</td>
                <td style="padding:8px; text-align:right; color:#087f82;">${formatCurrency(contract.totalAmount)}</td>
            </tr>
        </table>

        <h4 style="margin:12px 0 6px 0;">ĐIỀU KHOẢN ĐẶT CỌC & PHÁP LÝ (SRS v1.0 MỤC 12 & 13):</h4>
        <ol style="padding-left:20px; margin:0 0 20px 0; font-size:0.85rem;">
            <li>Bên B thực hiện đặt cọc đợt 1 tối thiểu 30% giá trị hợp đồng (${formatCurrency(contract.minDeposit30)}) để khóa sảnh.</li>
            <li>Khoản tiền cọc đã thanh toán: <strong>${formatCurrency(contract.paidDeposit || 0)}</strong>. Trạng thái: <strong>${contract.status}</strong>.</li>
            <li>Trong trường hợp Bên B hủy tiệc không do sự kiện bất khả kháng, tiền cọc đợt 1 không được hoàn lại theo chính sách trung tâm.</li>
            <li>Mọi hư hại tài sản trang thiết bị sảnh do khách mời gây ra sẽ được kiểm kê và tính vào biên bản quyết toán sau tiệc.</li>
        </ol>

        <div style="display:flex; justify-content:space-between; margin-top:30px; text-align:center;">
            <div style="width:40%;">
                <strong>ĐẠI DIỆN BÊN A</strong><br>
                <em>(Ký, ghi rõ họ tên và đóng dấu)</em><br><br><br><br>
                <strong>Ban Giám Đốc EVManager</strong>
            </div>
            <div style="width:40%;">
                <strong>ĐẠI DIỆN BÊN B</strong><br>
                <em>(Ký và ghi rõ họ tên)</em><br><br><br><br>
                <strong>${contract.customerName}</strong>
            </div>
        </div>
    `;

    document.getElementById('contractViewModal')?.classList.add('open');
}

document.getElementById('btnPrintContract')?.addEventListener('click', function() {
    window.print();
});

// =============================================================================
// TAB 6: ĐIỀU PHỐI NHÂN SỰ & LỊCH TRÌNH (UC-11)
// =============================================================================
function renderStaffCoordinationTable() {
    const tbody = document.getElementById('coordinationTableBody');
    if (!tbody) return;

    tbody.innerHTML = appContracts.map(c => {
        // Công thức định mức BA (UC-11):
        // Phục vụ = Math.ceil(tables / 2)
        // MC = 1, Âm thanh ánh sáng = 2
        const waiterQuota = Math.ceil(c.tables / 2);
        const mc = c.staffAssigned?.mc || "MC Quốc Bình";
        const totalStaff = waiterQuota + 1 + 2;
        const att = c.staffAssigned?.attendanceStatus || "present";

        return `
            <tr>
                <td>
                    <strong>${c.customerName}</strong>
                    <div style="font-size:0.75rem; color:var(--muted);">${c.contractId}</div>
                </td>
                <td>🏰 ${c.hallName}<br><span style="font-size:0.75rem;">${formatDate(c.weddingDate)} (${c.session || 'Tối'})</span></td>
                <td><strong style="color:var(--teal);">${c.tables} bàn</strong></td>
                <td><strong>${waiterQuota} nhân viên</strong> (1 NV / 2 bàn)</td>
                <td>1 MC (${mc}) • 2 KTV Sound</td>
                <td><span class="staff-quota-badge">👥 ${totalStaff} nhân sự</span></td>
                <td>
                    <span class="attendance-tag ${att}" onclick="toggleAttendance('${c.contractId}')">
                        ${att === 'present' ? '✓ Đủ mặt' : (att === 'late' ? '⏰ Đi trễ' : '✕ Vắng')}
                    </span>
                </td>
                <td class="text-right">
                    <button class="btn-action" onclick="alert('Đã gửi thông báo ca trực cho ${totalStaff} nhân viên!')">
                        📲 Báo ca
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleAttendance(contractId) {
    const c = appContracts.find(x => x.contractId === contractId);
    if (!c || !c.staffAssigned) return;

    const curr = c.staffAssigned.attendanceStatus || 'present';
    c.staffAssigned.attendanceStatus = curr === 'present' ? 'late' : (curr === 'late' ? 'absent' : 'present');
    saveLocalState();
    renderStaffCoordinationTable();
}

// =============================================================================
// TAB 7: BÁO CÁO & QUYẾT TOÁN (UC-12, UC-14)
// =============================================================================
function renderReports() {
    const totalCollected = appContracts.reduce((sum, c) => sum + (c.paidDeposit || 0), 0);
    const totalPending = appContracts.reduce((sum, c) => sum + Math.max(0, c.totalAmount - (c.paidDeposit || 0)), 0);

    const elCol = document.getElementById('reportTotalCollected');
    const elPen = document.getElementById('reportTotalPending');
    if (elCol) elCol.textContent = formatCurrency(totalCollected);
    if (elPen) elPen.textContent = formatCurrency(totalPending);

    const tbody = document.getElementById('settlementReportTableBody');
    if (tbody) {
        tbody.innerHTML = appContracts.map(c => {
            const menuRev = c.menuTotal || (c.tables * 5000000);
            const svcRev = c.serviceTotal || 15000000;
            const vat = c.vatAmount || (c.totalAmount * 0.08 / 1.08);
            const remaining = Math.max(0, c.totalAmount - (c.paidDeposit || 0));

            return `
                <tr>
                    <td><strong>${c.contractId}</strong></td>
                    <td>${c.customerName}</td>
                    <td>${formatDate(c.weddingDate)}</td>
                    <td>${formatCurrency(menuRev)}</td>
                    <td>${formatCurrency(svcRev)}</td>
                    <td>${formatCurrency(vat)}</td>
                    <td><strong style="color:var(--teal);">${formatCurrency(c.totalAmount)}</strong></td>
                    <td><strong style="color:#059669;">${formatCurrency(c.paidDeposit || 0)}</strong></td>
                    <td><strong style="color:#dc2626;">${formatCurrency(remaining)}</strong></td>
                </tr>
            `;
        }).join('');
    }
}

// =============================================================================
// TAB 8: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN RBAC (UC-02)
// =============================================================================
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = appUsers.map(u => `
        <tr>
            <td><strong>#${u.userId || u.id}</strong></td>
            <td><strong>${u.username}</strong></td>
            <td>${u.fullName || u.name}</td>
            <td>✉️ ${u.email}</td>
            <td>📞 ${u.phone || 'N/A'}</td>
            <td><span class="badge-status" style="background:#eff6ff; color:#1d4ed8;">${u.roleName || 'STAFF'}</span></td>
            <td>
                <span class="badge-status ${u.status === 'ACTIVE' ? 'badge-status--available' : 'badge-status--conflict'}">
                    ${u.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
            </td>
            <td class="text-right">
                <button class="btn-action" onclick="toggleUserStatus(${u.userId || u.id})">
                    ${u.status === 'ACTIVE' ? '🔒 Khóa' : '🔓 Mở'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Thêm tài khoản người dùng kết nối API /api/v1/users
document.getElementById('userForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const fullName = document.getElementById('newUserFullName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const roleName = document.getElementById('newUserRole').value;

    const payload = { username, password, fullName, email, phone, roleName };

    showConfirmDialog(
        "Xác nhận tạo tài khoản người dùng",
        `Tạo tài khoản ${username} với vai trò ${roleName} cho nhân viên ${fullName}?`,
        async () => {
            try {
                const res = await fetchAPI('/api/v1/users', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const created = await res.json();
                    appUsers.unshift(created);
                }
            } catch (err) {
                console.warn("Backend offline, cập nhật client-side:", err.message);
                const newId = appUsers.length + 1;
                appUsers.unshift({ userId: newId, username, fullName, email, phone, roleName, status: 'ACTIVE' });
            }

            saveLocalState();
            renderUsersTable();
            closeModal('userModal');
            alert(`Tạo tài khoản "${username}" thành công!`);
        }
    );
});

function toggleUserStatus(id) {
    const u = appUsers.find(x => (x.userId || x.id) == id);
    if (!u) return;

    const newStatus = u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';

    showConfirmDialog(
        "Thay đổi trạng thái tài khoản",
        `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'KÍCH HOẠT' : 'KHÓA'} tài khoản "${u.username}"?`,
        async () => {
            try {
                await fetchAPI(`/api/v1/users/${id}/status`, {
                    method: 'PUT',
                    body: JSON.stringify({ status: newStatus })
                });
            } catch (e) {
                console.warn("Backend offline, cập nhật cục bộ:", e.message);
            }
            u.status = newStatus;

            // Cập nhật danh sách tài khoản bị khóa trong localStorage
            let lockedList = [];
            try {
                lockedList = JSON.parse(localStorage.getItem('ev_locked_accounts') || '[]');
            } catch (e) {}

            const uname = u.username.toLowerCase();
            if (newStatus === 'LOCKED') {
                if (!lockedList.includes(uname)) lockedList.push(uname);
            } else {
                lockedList = lockedList.filter(x => x !== uname);
            }
            localStorage.setItem('ev_locked_accounts', JSON.stringify(lockedList));

            saveLocalState();
            renderUsersTable();

            // Nếu tài khoản bị khóa trùng với tài khoản hiện tại đang đăng nhập
            const currentLoggedIn = sessionStorage.getItem('currentUser');
            if (currentLoggedIn && (currentLoggedIn.toLowerCase() === u.username.toLowerCase()) && newStatus === 'LOCKED') {
                alert(`⚠️ Tài khoản "${u.username}" vừa bị KHÓA. Bạn sẽ được điều hướng về trang đăng nhập!`);
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('userRole');
                window.location.href = 'login.html';
            }
        }
    );
}

// =============================================================================
// 6. TIỆN ÍCH TAB, MODAL & SELECT OPTIONS
// =============================================================================
function setupTabNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchAdminTab(tabId);
        });
    });

    document.getElementById('btnGoToContracts')?.addEventListener('click', () => switchAdminTab('tab-contracts'));
}

function switchAdminTab(tabId) {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.admin-tab-pane').forEach(p => {
        p.classList.toggle('active', p.id === tabId);
    });

    const titles = {
        'tab-dashboard': { title: 'Bảng tổng quan', sub: 'Trung tâm hội nghị & tiệc cưới EVManager - Điều hành thời gian thực' },
        'tab-venues': { title: 'Quản lý sảnh tiệc & Giữ chỗ', sub: 'Kiểm tra khả dụng, phát hiện xung đột lịch và quản lý thời hạn giữ chỗ 48h' },
        'tab-customers': { title: 'Hồ sơ khách hàng', sub: 'Quản lý thông tin liên hệ, nguồn khách và lịch sử đặt tiệc' },
        'tab-menu-services': { title: 'Thực đơn tiệc & Gói dịch vụ', sub: 'Lựa chọn Set Menu, đổi món tính chênh lệch và cấu hình ưu đãi >25 bàn' },
        'tab-contracts': { title: 'Báo giá, Hợp đồng & Đặt cọc', sub: 'Tự động tính thuế VAT 8%, chiết khấu, sinh mã hợp đồng và thanh toán QR' },
        'tab-calendar-staff': { title: 'Lịch tiệc & Điều phối nhân sự', sub: 'Lịch trực quan theo tháng, định mức nhân viên theo số bàn và điểm danh ca' },
        'tab-reports': { title: 'Báo cáo doanh thu & Quyết toán', sub: 'Tổng hợp dòng tiền, đối soát doanh thu thực đơn & dịch vụ theo thời gian thực' },
        'tab-users': { title: 'Tài khoản & Phân quyền RBAC', sub: 'Quản trị danh sách nhân viên Admin, Sales, Coordinator và kiểm soát truy cập' }
    };

    if (titles[tabId]) {
        document.getElementById('pageTitle').textContent = titles[tabId].title;
        document.getElementById('pageSubtitle').textContent = titles[tabId].sub;
    }

    if (tabId === 'tab-calendar-staff' && typeof window.refreshFullCalendar === 'function') {
        window.refreshFullCalendar();
    }
}

function populateSelectOptions() {
    // Sảnh tiệc
    const hallSelects = [document.getElementById('checkHallSelect'), document.getElementById('quoteHallSelect')];
    hallSelects.forEach(select => {
        if (!select) return;
        const currentVal = select.value;
        const isCheck = select.id === 'checkHallSelect';

        select.innerHTML = (isCheck ? `<option value="ALL">Kiểm tra tất cả sảnh</option>` : '') +
            appVenues.map(v => `<option value="${v.hallId}">${v.name} (${v.maxTables} bàn - Sức chứa ${v.capacityGuests})</option>`).join('');

        if (currentVal) select.value = currentVal;
    });

    // Khách hàng
    const custSelect = document.getElementById('quoteCustomerSelect');
    if (custSelect) {
        custSelect.innerHTML = appCustomers.map(c => `
            <option value="${c.customerId || c.id}">${c.fullName || c.name} - ${c.phone}</option>
        `).join('');
    }

    // Set Menu
    const menuSelect = document.getElementById('quoteMenuSelect');
    if (menuSelect) {
        menuSelect.innerHTML = appSetMenus.map(m => `
            <option value="${m.menuId}">${m.name} (${formatCurrency(m.pricePerTable)}/bàn)</option>
        `).join('');
    }
}

function setupEventListeners() {
    // Topbar search input
    document.getElementById('globalSearchInput')?.addEventListener('input', function() {
        const val = this.value;
        const cSearch = document.getElementById('customerSearchInput');
        const contSearch = document.getElementById('contractSearchInput');
        if (cSearch) { cSearch.value = val; renderCustomersTable(); }
        if (contSearch) { contSearch.value = val; renderContractsTable(); }
    });

    document.getElementById('customerSearchInput')?.addEventListener('input', renderCustomersTable);
    document.getElementById('customerSourceFilter')?.addEventListener('change', renderCustomersTable);
    document.getElementById('contractSearchInput')?.addEventListener('input', renderContractsTable);
    document.getElementById('contractStatusFilter')?.addEventListener('change', renderContractsTable);

    // Báo giá form inputs auto recalculate
    ['quoteTables', 'quoteMenuSelect', 'quoteDiscountPercent'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', recalculateQuotationModal);
        document.getElementById(id)?.addEventListener('change', recalculateQuotationModal);
    });

    // Sidebar toggle di động
    document.getElementById('sidebarToggle')?.addEventListener('click', function() {
        document.getElementById('adminSidebar')?.classList.toggle('mobile-open');
    });

    // Mở modal thêm khách hàng
    document.getElementById('btnOpenAddCustomerModal')?.addEventListener('click', function() {
        document.getElementById('customerForm').reset();
        document.getElementById('customerEditId').value = '';
        document.getElementById('customerModalTitle').textContent = 'Thêm khách hàng mới';
        document.getElementById('customerModal')?.classList.add('open');
    });

    // Mở modal thêm sảnh mới
    document.getElementById('btnOpenAddVenueModal')?.addEventListener('click', function() {
        document.getElementById('venueForm').reset();
        document.getElementById('venueEditId').value = '';
        document.getElementById('venueModal')?.classList.add('open');
    });

    // Mở modal lập báo giá
    document.getElementById('btnOpenCreateQuotationModal')?.addEventListener('click', function() {
        openCreateQuotationModalWithData();
    });

    // Mở modal thêm tài khoản người dùng
    document.getElementById('btnOpenAddUserModal')?.addEventListener('click', function() {
        document.getElementById('userForm').reset();
        document.getElementById('userModal')?.classList.add('open');
    });

    // Đóng Modal các nút close
    document.querySelectorAll('.modal-close, [id^="btnCancel"], [id^="btnClose"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.admin-modal');
            if (modal) modal.classList.remove('open');
        });
    });

    // Confirmation dialog actions
    document.getElementById('btnProceedConfirmDialog')?.addEventListener('click', function() {
        if (typeof pendingConfirmCallback === 'function') {
            pendingConfirmCallback();
        }
        hideConfirmDialog();
    });

    document.getElementById('btnCancelConfirmDialog')?.addEventListener('click', hideConfirmDialog);
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
}

function closeCustomerModal() {
    closeModal('customerModal');
}