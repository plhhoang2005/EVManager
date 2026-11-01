/**
 * sales.js - Logic Quản lý Bán Hàng Toàn Diện (Sales Portal)
 * Tích hợp đa tab: Bảng điều khiển (Leads AI), Hợp đồng, Khách hàng, Thanh toán VietQR
 */

let cachedLeads = [];
let cachedCustomers = [];
let cachedContracts = [];
let cachedPayments = [];
let currentFilter = 'ALL';
let currentSelectedContract = null;

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Khởi tạo chuyển tab sidebar
    setupSalesTabs();

    // 2. Cập nhật thông tin chào mừng
    const userFullName = sessionStorage.getItem('userFullName') || 'Sales Specialist';
    const greetingEl = document.getElementById('adminSidebarGreeting');
    if (greetingEl) {
        greetingEl.textContent = `Xin chào, ${userFullName}`;
    }

    // 3. Tải song song toàn bộ dữ liệu thật từ Backend
    await Promise.all([
        loadSalesSummary(),
        loadSalesLeads(),
        loadSalesContracts(),
        loadSalesCustomers(),
        loadSalesPayments()
    ]);
});

// ==========================================
// 1. ĐIỀU HƯỚNG TAB
// ==========================================
function setupSalesTabs() {
    const navButtons = document.querySelectorAll('.sidebar-nav .nav-item[data-tab]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchSalesTab(tabId);
        });
    });
}

function switchSalesTab(tabId) {
    // Đổi active cho button
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Đổi active cho tab pane
    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Cập nhật tiêu đề Topbar
    const titleEl = document.getElementById('salesPageTitle');
    const subEl = document.getElementById('salesPageSubtitle');
    const titles = {
        'tab-sales-dashboard': { title: 'Bảng điều khiển Kinh doanh (Sales Hub)', sub: 'Chăm sóc khách hàng tự động từ AI Concierge và chốt hợp đồng tiệc.' },
        'tab-sales-contracts': { title: 'Quản lý Hợp đồng Đặt tiệc', sub: 'Lập hợp đồng, quản lý tiền cọc 30% và kích hoạt trạng thái tiệc.' },
        'tab-sales-customers': { title: 'Quản lý Khách hàng & Đối tác', sub: 'Danh bạ đối tác, khách hàng tiềm năng và liên hệ nhanh.' },
        'tab-sales-payments': { title: 'Đối soát Thanh toán & Đặt cọc VietQR', sub: 'Theo dõi tiền cọc 24/7 trực tiếp từ chuyển khoản ngân hàng & VietQR.' }
    };

    if (titles[tabId] && titleEl && subEl) {
        titleEl.textContent = titles[tabId].title;
        subEl.textContent = titles[tabId].sub;
    }

    // Tự động làm mới dữ liệu tab được chọn
    if (tabId === 'tab-sales-contracts') loadSalesContracts();
    if (tabId === 'tab-sales-customers') loadSalesCustomers();
    if (tabId === 'tab-sales-payments') loadSalesPayments();
}

// ==========================================
// 2. TẢI DỮ LIỆU TỔNG QUAN (DASHBOARD SUMMARY)
// ==========================================
async function loadSalesSummary() {
    try {
        const res = await fetchAPI('/api/v1/dashboard/summary');
        if (res.ok) {
            const data = await res.json();
            const doanhThuEl = document.getElementById('salesDoanhThuVal');
            const contractsEl = document.getElementById('contractsStatValue');
            
            if (doanhThuEl && data.totalRevenue != null) {
                doanhThuEl.textContent = formatVND(data.totalRevenue);
            }
            if (contractsEl && data.totalContracts != null) {
                contractsEl.textContent = data.totalContracts;
            }
        }
    } catch (e) {
        console.warn('Dashboard summary not reachable for sales:', e.message);
    }
}

// ==========================================
// 3. TAB 1: LEADS AI TIỀM NĂNG
// ==========================================
function getLeadTemperature(lead) {
    const text = (lead.address || '').toLowerCase();
    if (text.includes('250.000.000') || text.includes('180.000.000') || text.includes('gala') || text.includes('tech summit') || text.includes('400 khách')) {
        return { type: 'HOT', badgeClass: 'lead-badge-hot', label: '🔥 Hot Lead', hint: 'Ưu tiên gọi trong 15p' };
    } else if (text.includes('120.000.000') || text.includes('tiệc cưới') || text.includes('200 khách')) {
        return { type: 'WARM', badgeClass: 'lead-badge-warm', label: '⚡ Warm Lead', hint: 'Nhu cầu tiệc cưới chuẩn' };
    } else {
        return { type: 'COOL', badgeClass: 'lead-badge-cool', label: '❄️ Cool Lead', hint: 'Tiệc gia đình ấm cúng' };
    }
}

async function loadSalesLeads() {
    const tableBody = document.getElementById('aiLeadsTableBody');
    const badgeCount = document.getElementById('aiLeadsCount');
    const statVal = document.getElementById('aiLeadsStatValue');
    if (!tableBody) return;

    try {
        const response = await fetchAPI('/api/v1/customers?page=0&size=50');
        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#ef4444;">Không thể tải dữ liệu khách hàng.</td></tr>`;
            return;
        }

        const data = await response.json();
        const customers = data.content || data || [];

        // Lọc khách hàng có tag [AI_LEAD]
        cachedLeads = customers.filter(c => c.address && c.address.includes('[AI_LEAD]'));
        
        if (badgeCount) badgeCount.textContent = cachedLeads.length;
        if (statVal) statVal.textContent = cachedLeads.length;

        renderFilteredLeads();
    } catch (err) {
        console.error('Error loading AI leads:', err);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#ef4444;">Lỗi kết nối khi tải danh sách.</td></tr>`;
    }
}

function renderFilteredLeads() {
    const tableBody = document.getElementById('aiLeadsTableBody');
    if (!tableBody) return;

    const searchTerm = (document.getElementById('leadSearchInput')?.value || '').toLowerCase().trim();

    let filtered = cachedLeads.filter(lead => {
        const temp = getLeadTemperature(lead);
        if (currentFilter !== 'ALL' && temp.type !== currentFilter) return false;

        if (searchTerm) {
            const nameMatch = (lead.fullName || '').toLowerCase().includes(searchTerm);
            const phoneMatch = (lead.phone || '').includes(searchTerm);
            const noteMatch = (lead.address || '').toLowerCase().includes(searchTerm);
            return nameMatch || phoneMatch || noteMatch;
        }
        return true;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#64748b;">Không tìm thấy khách hàng phù hợp với bộ lọc.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map((lead, index) => {
        const cleanNote = (lead.address || '').replace('[AI_LEAD]', '').trim();
        const temp = getLeadTemperature(lead);
        const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');

        return `
            <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px;font-weight:600;color:#64748b;">#${lead.customerId || (index + 1)}</td>
                <td style="padding:12px;">
                    <strong style="color:#0f172a;display:block;font-size:0.95rem;">${escapeHtml(lead.fullName || 'Khách vãng lai')}</strong>
                    <span style="font-size:0.75rem;color:#94a3b8;">Nguồn: Trợ lý AI Concierge</span>
                </td>
                <td style="padding:12px;">
                    <a href="tel:${lead.phone}" class="sales-action-btn btn-sales-call" style="margin-bottom:4px;display:inline-flex;">
                        📞 ${lead.phone || '---'}
                    </a>
                    ${lead.email ? `<div style="font-size:0.8rem;color:#64748b;margin-top:2px;">✉️ ${escapeHtml(lead.email)}</div>` : ''}
                </td>
                <td style="padding:12px;">
                    <span class="lead-badge ${temp.badgeClass}">${temp.label}</span>
                    <div style="font-size:0.72rem;color:#64748b;margin-top:4px;">${temp.hint}</div>
                </td>
                <td style="padding:12px;color:#334155;max-width:320px;">
                    <div style="font-size:0.875rem;line-height:1.4;">${escapeHtml(cleanNote)}</div>
                </td>
                <td style="padding:12px;text-align:center;">
                    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                        <a href="https://zalo.me/${cleanPhone}" target="_blank" class="sales-action-btn" style="background:#0068ff;color:#fff;" title="Mở Zalo chat">
                            Zalo
                        </a>
                        <button onclick="quickConvertToContract(${lead.customerId}, '${escapeHtml(lead.fullName)}', '${lead.phone}')" class="sales-action-btn btn-sales-convert" title="Lên hợp đồng sơ bộ">
                            ⚡ Tạo HĐ
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.filterSalesLeads = function() {
    renderFilteredLeads();
};

window.setLeadFilter = function(filterType) {
    currentFilter = filterType;
    ['btnFilterAll', 'btnFilterHot', 'btnFilterWarm', 'btnFilterCool'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active');
    });

    if (filterType === 'ALL') document.getElementById('btnFilterAll')?.classList.add('active');
    if (filterType === 'HOT') document.getElementById('btnFilterHot')?.classList.add('active');
    if (filterType === 'WARM') document.getElementById('btnFilterWarm')?.classList.add('active');
    if (filterType === 'COOL') document.getElementById('btnFilterCool')?.classList.add('active');

    renderFilteredLeads();
};

// ==========================================
// 4. TAB 2: QUẢN LÝ HỢP ĐỒNG (CONTRACTS)
// ==========================================
async function loadSalesContracts() {
    const tableBody = document.getElementById('contractsTableBody');
    const badgeCount = document.getElementById('badgeSalesContractsCount');
    const statContracts = document.getElementById('contractsStatValue');
    if (!tableBody) return;

    try {
        const response = await fetchAPI('/api/v1/contracts?page=0&size=50');
        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Không thể tải danh sách hợp đồng.</td></tr>`;
            return;
        }

        const data = await response.json();
        cachedContracts = data.content || data || [];

        if (badgeCount) badgeCount.textContent = cachedContracts.length;
        if (statContracts) statContracts.textContent = cachedContracts.length;

        if (cachedContracts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#64748b;">Chưa có hợp đồng nào được tạo.</td></tr>`;
            return;
        }

        tableBody.innerHTML = cachedContracts.map((c, index) => {
            const contractCode = c.contractCode || `HD-2026-00${index + 1}`;
            const total = c.totalAmount ? formatVND(c.totalAmount) : '150.000.000 ₫';
            const deposit = c.depositAmount ? formatVND(c.depositAmount) : '0 ₫';

            let statusBadge = '<span class="summary-pill" style="background:#fef3c7;color:#b45309;">Chờ đặt cọc</span>';
            if (c.status === 'CONFIRMED' || c.status === 'DEPOSITED') {
                statusBadge = '<span class="summary-pill active">Đã xác nhận cọc</span>';
            } else if (c.status === 'COMPLETED') {
                statusBadge = '<span class="summary-pill" style="background:#dcfce7;color:#15803d;">Đã tất toán</span>';
            }

            return `
                <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:12px;font-weight:700;color:#087f82;">${escapeHtml(contractCode)}</td>
                    <td style="padding:12px;font-weight:600;color:#334155;">${escapeHtml(c.customerName || 'Khách hàng')}</td>
                    <td style="padding:12px;color:#0369a1;font-weight:600;">Sảnh Diamond Luxury</td>
                    <td style="padding:12px;font-weight:700;color:#0f172a;">${total}</td>
                    <td style="padding:12px;">
                        ${statusBadge}
                        <div style="font-size:0.75rem;color:#64748b;margin-top:2px;">Đã thu: ${deposit}</div>
                    </td>
                    <td style="padding:12px;">${statusBadge}</td>
                    <td style="padding:12px;text-align:center;">
                        <div style="display:flex;gap:6px;justify-content:center;">
                            <button onclick="openViewContractModal(${c.contractId})" class="btn btn-outline" style="padding:5px 10px;font-size:0.8rem;" title="Xem chi tiết hợp đồng">
                                👁️ Chi tiết
                            </button>
                            <button onclick="openPaymentModal(${c.contractId}, '${escapeHtml(contractCode)}', ${c.totalAmount ? Math.round(c.totalAmount * 0.3) : 45000000})" class="btn btn-primary" style="padding:5px 10px;font-size:0.8rem;" title="Thu cọc VietQR">
                                💳 Thu cọc
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading contracts:', err);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Lỗi kết nối khi tải danh sách hợp đồng.</td></tr>`;
    }
}

// ==========================================
// 5. TAB 3: QUẢN LÝ KHÁCH HÀNG (CUSTOMERS)
// ==========================================
async function loadSalesCustomers() {
    const tableBody = document.getElementById('salesCustomersTableBody');
    const badgeCount = document.getElementById('badgeSalesCustomersCount');
    if (!tableBody) return;

    try {
        const response = await fetchAPI('/api/v1/customers?page=0&size=100');
        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#ef4444;padding:1.5rem;">Không thể tải danh sách khách hàng.</td></tr>`;
            return;
        }

        const data = await response.json();
        cachedCustomers = data.content || data || [];

        if (badgeCount) badgeCount.textContent = cachedCustomers.length;

        // Cập nhật select option trong form Tạo Hợp Đồng
        populateCustomerSelect(cachedCustomers);

        renderFilteredCustomers();
    } catch (err) {
        console.error('Error loading customers:', err);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#ef4444;padding:1.5rem;">Lỗi kết nối khi tải danh sách khách hàng.</td></tr>`;
    }
}

function renderFilteredCustomers() {
    const tableBody = document.getElementById('salesCustomersTableBody');
    if (!tableBody) return;

    const searchTerm = (document.getElementById('customerSearchInput')?.value || '').toLowerCase().trim();

    let filtered = cachedCustomers.filter(c => {
        if (!searchTerm) return true;
        const nameMatch = (c.fullName || '').toLowerCase().includes(searchTerm);
        const phoneMatch = (c.phone || '').includes(searchTerm);
        const emailMatch = (c.email || '').toLowerCase().includes(searchTerm);
        const addressMatch = (c.address || '').toLowerCase().includes(searchTerm);
        return nameMatch || phoneMatch || emailMatch || addressMatch;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#64748b;">Không tìm thấy khách hàng nào.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map((c, index) => {
        const cleanNote = (c.address || '').replace('[AI_LEAD]', '').trim();
        const isAiLead = (c.address || '').includes('[AI_LEAD]');
        const badgeTag = isAiLead 
            ? '<span class="lead-badge lead-badge-warm" style="font-size:0.7rem;margin-left:4px;">AI Lead</span>'
            : '<span class="summary-pill active" style="font-size:0.7rem;margin-left:4px;">Khách hàng</span>';

        return `
            <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px;font-weight:600;color:#64748b;">#${c.customerId || (index + 1)}</td>
                <td style="padding:12px;">
                    <strong style="color:#0f172a;display:block;font-size:0.95rem;">${escapeHtml(c.fullName || 'Khách hàng')}</strong>
                    ${badgeTag}
                </td>
                <td style="padding:12px;font-weight:600;color:#087f82;">${escapeHtml(c.phone || '---')}</td>
                <td style="padding:12px;color:#64748b;">${escapeHtml(c.email || '---')}</td>
                <td style="padding:12px;color:#334155;max-width:280px;font-size:0.85rem;">${escapeHtml(cleanNote || 'Chưa có ghi chú')}</td>
                <td style="padding:12px;text-align:center;">
                    <button onclick="quickConvertToContract(${c.customerId}, '${escapeHtml(c.fullName)}', '${c.phone}')" class="btn btn-primary" style="padding:5px 12px;font-size:0.8rem;">
                        ⚡ Lên hợp đồng
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.filterSalesCustomers = function() {
    renderFilteredCustomers();
};

function populateCustomerSelect(customers) {
    const sel = document.getElementById('contractCustomerSelect');
    if (!sel) return;

    sel.innerHTML = '<option value="">-- Chọn khách hàng --</option>' +
        customers.map(c => `<option value="${c.customerId}">${escapeHtml(c.fullName)} (${c.phone || 'Không có SĐT'})</option>`).join('');
}

// ==========================================
// 6. TAB 4: QUẢN LÝ THANH TOÁN (PAYMENTS)
// ==========================================
async function loadSalesPayments() {
    const tableBody = document.getElementById('salesPaymentsTableBody');
    const totalPaidEl = document.getElementById('salesTotalPaidDeposit');
    const totalCountEl = document.getElementById('salesTotalTxnCount');
    if (!tableBody) return;

    try {
        const response = await fetchAPI('/api/v1/payments?page=0&size=50');
        if (!response.ok) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Không thể tải danh sách thanh toán.</td></tr>`;
            return;
        }

        const data = await response.json();
        cachedPayments = data.content || data || [];

        if (cachedPayments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#64748b;">Chưa có giao dịch đặt cọc nào được ghi nhận.</td></tr>`;
            return;
        }

        const totalPaid = cachedPayments
            .filter(p => p.status === 'SUCCESS')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        if (totalPaidEl) totalPaidEl.textContent = formatVND(totalPaid);
        if (totalCountEl) totalCountEl.textContent = `${cachedPayments.length} giao dịch`;

        tableBody.innerHTML = cachedPayments.map(p => {
            const isSuccess = p.status === 'SUCCESS';
            const statusBadge = isSuccess 
                ? '<span class="summary-pill active">Thành công</span>'
                : `<span class="summary-pill" style="background:#fef3c7;color:#b45309;">${p.status}</span>`;

            const methodDisplay = p.paymentMethod === 'VIETQR' ? 'VietQR (Napas 247)'
                : p.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản VCB'
                : p.paymentMethod || 'Chuyển khoản';

            const dateStr = p.paymentDate ? new Date(p.paymentDate).toLocaleString('vi-VN') : '---';

            return `
                <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:12px;font-weight:700;">#${escapeHtml(p.externalReference || ('TXN-' + p.paymentId))}</td>
                    <td style="padding:12px;font-weight:700;color:#087f82;">${escapeHtml(p.contractCode || ('HD-' + p.contractId))}</td>
                    <td style="padding:12px;font-weight:600;color:#334155;">${escapeHtml(p.customerName || 'Khách hàng')}</td>
                    <td style="padding:12px;font-weight:700;color:#087f82;">${formatVND(p.amount)}</td>
                    <td style="padding:12px;">${methodDisplay} (${p.paymentType})</td>
                    <td style="padding:12px;font-size:0.85rem;color:#64748b;">${dateStr}</td>
                    <td style="padding:12px;">${statusBadge}</td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading payments:', err);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#ef4444;padding:1.5rem;">Lỗi kết nối khi tải danh sách thanh toán.</td></tr>`;
    }
}

// ==========================================
// 7. MODALS THAO TÁC NGHIỆP VỤ (CREATE / VIEW)
// ==========================================

// 7.1 MODAL KHÁCH HÀNG
window.openCreateCustomerModal = function() {
    document.getElementById('customerForm')?.reset();
    document.getElementById('customerModal')?.classList.add('open');
};

window.closeCustomerModal = function() {
    document.getElementById('customerModal')?.classList.remove('open');
};

window.handleSaveCustomer = async function(e) {
    e.preventDefault();
    const payload = {
        fullName: document.getElementById('custFullName')?.value.trim(),
        phone: document.getElementById('custPhone')?.value.trim(),
        email: document.getElementById('custEmail')?.value.trim(),
        address: document.getElementById('custAddress')?.value.trim()
    };

    try {
        const res = await fetchAPI('/api/v1/customers', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeCustomerModal();
            alert(`🎉 Đã thêm thành công khách hàng: ${payload.fullName}!`);
            await loadSalesCustomers();
            await loadSalesLeads();
        } else {
            const err = await res.json().catch(() => ({}));
            alert(`❌ Không thể thêm khách hàng: ${err.message || 'Lỗi server'}`);
        }
    } catch (error) {
        alert('❌ Lỗi kết nối khi thêm khách hàng.');
    }
};

// 7.2 MODAL HỢP ĐỒNG
window.quickConvertToContract = function(customerId, customerName, phone) {
    openCreateContractModal(customerId, customerName);
};

window.openCreateContractModal = function(customerId, customerName) {
    const sel = document.getElementById('contractCustomerSelect');
    if (sel && customerId) {
        sel.value = customerId;
    }

    const codeInput = document.getElementById('contractCodeInput');
    if (codeInput) {
        codeInput.value = `HD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const totalInput = document.getElementById('contractTotalAmountInput');
    const depositInput = document.getElementById('contractDepositInput');
    if (totalInput) {
        totalInput.value = 150000000;
        if (depositInput) depositInput.value = 45000000;
        totalInput.oninput = () => {
            if (depositInput) depositInput.value = Math.round(Number(totalInput.value) * 0.3);
        };
    }

    document.getElementById('contractModal')?.classList.add('open');
};

window.closeContractModal = function() {
    document.getElementById('contractModal')?.classList.remove('open');
};

window.handleSaveContract = async function(e) {
    e.preventDefault();
    const customerId = document.getElementById('contractCustomerSelect')?.value;
    const contractCode = document.getElementById('contractCodeInput')?.value.trim();
    const totalAmount = Number(document.getElementById('contractTotalAmountInput')?.value);
    const depositAmount = Number(document.getElementById('contractDepositInput')?.value) || Math.round(totalAmount * 0.3);
    const tableCount = Number(document.getElementById('contractTableCountInput')?.value) || 20;
    const reserveTableCount = Number(document.getElementById('contractReserveCountInput')?.value) || 2;

    if (!customerId) {
        alert('Vui lòng chọn khách hàng.');
        return;
    }

    const payload = {
        customerId: Number(customerId),
        contractCode: contractCode,
        contractDate: new Date().toISOString().split('T')[0],
        totalAmount: totalAmount,
        depositAmount: depositAmount,
        tableCount: tableCount,
        reserveTableCount: reserveTableCount,
        status: 'CONFIRMED'
    };

    try {
        const res = await fetchAPI('/api/v1/contracts', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeContractModal();
            alert(`🎉 Đã lập thành công hợp đồng ${contractCode} cho khách hàng!`);
            await loadSalesContracts();
            await loadSalesSummary();
            switchSalesTab('tab-sales-contracts');
        } else {
            const err = await res.json().catch(() => ({}));
            alert(`❌ Không thể tạo hợp đồng: ${err.message || 'Lỗi server'}`);
        }
    } catch (err) {
        alert('❌ Lỗi kết nối khi tạo hợp đồng.');
    }
};

// 7.3 MODAL XEM CHI TIẾT HỢP ĐỒNG
window.openViewContractModal = function(contractId) {
    const contract = cachedContracts.find(c => c.contractId === contractId);
    if (!contract) return;

    currentSelectedContract = contract;
    const modal = document.getElementById('viewContractModal');
    const title = document.getElementById('viewModalTitle');
    const content = document.getElementById('viewContractContent');

    if (title) title.textContent = `Chi Tiết Hợp Đồng #${contract.contractCode || contractId}`;

    const total = formatVND(contract.totalAmount || 150000000);
    const deposit = formatVND(contract.depositAmount || 45000000);
    const remaining = formatVND(Math.max(0, (contract.totalAmount || 150000000) - (contract.depositAmount || 45000000)));

    // Link VietQR động
    const qrAmount = contract.depositAmount > 0 ? contract.depositAmount : (contract.totalAmount * 0.3);
    const qrMemo = `${contract.contractCode || 'HD'} COC`;
    const vietQrUrl = `https://img.vietqr.io/image/vietcombank-9988776655-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(qrMemo)}&accountName=${encodeURIComponent('LV34 CONVENTION CENTER')}`;

    if (content) {
        content.innerHTML = `
            <div style="background:#f8fafc;border-radius:8px;padding:1rem;margin-bottom:1rem;border:1px solid #e2e8f0;font-size:0.9rem;line-height:1.8;">
                <div>👤 <strong>Khách hàng:</strong> ${escapeHtml(contract.customerName || 'Khách VIP')}</div>
                <div>🏛️ <strong>Sảnh tiệc:</strong> Sảnh Kim Cương Luxury (View toàn cảnh)</div>
                <div>👥 <strong>Quy mô:</strong> ${contract.tableCount || 25} bàn tiệc chính (+ ${contract.reserveTableCount || 2} bàn dự phòng)</div>
                <div>📌 <strong>Trạng thái:</strong> <span class="summary-pill active">${contract.status || 'CONFIRMED'}</span></div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem;">
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
                    <span style="font-size:0.8rem;color:#1e40af;">Tổng giá trị:</span>
                    <strong style="font-size:1.15rem;color:#1d4ed8;display:block;">${total}</strong>
                </div>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
                    <span style="font-size:0.8rem;color:#166534;">Đã thanh toán (Cọc):</span>
                    <strong style="font-size:1.15rem;color:#15803d;display:block;">${deposit}</strong>
                </div>
            </div>

            <div style="text-align:center;padding:10px;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;">
                <span style="font-size:0.85rem;color:#475569;font-weight:600;display:block;margin-bottom:6px;">📱 Mã VietQR thanh toán nhanh cho hợp đồng này:</span>
                <img src="${vietQrUrl}" alt="VietQR" style="width:180px;height:auto;border-radius:6px;" />
            </div>
        `;
    }

    modal?.classList.add('open');
};

window.closeViewContractModal = function() {
    document.getElementById('viewContractModal')?.classList.remove('open');
};

window.quickOpenDepositFromDetail = function() {
    if (!currentSelectedContract) return;
    closeViewContractModal();
    openPaymentModal(
        currentSelectedContract.contractId,
        currentSelectedContract.contractCode,
        Math.round((currentSelectedContract.totalAmount || 150000000) * 0.3)
    );
};

// 7.4 MODAL GHI NHẬN THANH TOÁN
window.openPaymentModal = function(contractId, contractCode, suggestAmount) {
    const idInput = document.getElementById('payContractIdInput');
    const dispInput = document.getElementById('payContractDisplay');
    const amtInput = document.getElementById('payAmountInput');

    if (idInput) idInput.value = contractId;
    if (dispInput) dispInput.value = `${contractCode || ('Hợp đồng #' + contractId)}`;
    if (amtInput) amtInput.value = suggestAmount || 45000000;

    document.getElementById('paymentModal')?.classList.add('open');
};

window.closePaymentModal = function() {
    document.getElementById('paymentModal')?.classList.remove('open');
};

window.handleSavePayment = async function(e) {
    e.preventDefault();
    const contractId = Number(document.getElementById('payContractIdInput')?.value);
    const amount = Number(document.getElementById('payAmountInput')?.value);
    const paymentType = document.getElementById('payTypeSelect')?.value || 'DEPOSIT';
    const paymentMethod = document.getElementById('payMethodSelect')?.value || 'VIETQR';

    const payload = {
        contractId: contractId,
        amount: amount,
        paymentType: paymentType,
        paymentMethod: paymentMethod,
        externalReference: 'VQR-SALES-' + Date.now()
    };

    try {
        const res = await fetchAPI('/api/v1/payments', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closePaymentModal();
            alert(`🎉 Đã ghi nhận thành công giao dịch thu tiền cọc ${formatVND(amount)}!`);
            await loadSalesPayments();
            await loadSalesContracts();
            await loadSalesSummary();
            switchSalesTab('tab-sales-payments');
        } else {
            const err = await res.json().catch(() => ({}));
            alert(`❌ Không thể ghi nhận thanh toán: ${err.message || 'Lỗi server'}`);
        }
    } catch (err) {
        alert('❌ Lỗi kết nối khi ghi nhận thanh toán.');
    }
};
