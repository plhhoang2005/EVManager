/**
 * Module Quản lý Thanh toán & Đặt cọc VietQR (payments.js)
 */

let adminPayments = [];

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function formatDateTime(str) {
    if (!str) return '';
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function loadPayments() {
    const tableBody = document.getElementById('paymentsTableBody');
    if (!tableBody) return;

    try {
        const res = await fetchAPI('/api/v1/payments?page=0&size=50');
        if (res.ok) {
            const data = await res.json();
            const list = data.content || data;
            if (Array.isArray(list) && list.length > 0) {
                adminPayments = list;
                renderPaymentsTable(adminPayments);
                updatePaymentTotals(adminPayments);
                return;
            }
        }
    } catch (err) {
        console.warn('Backend payments API offline, keeping current display:', err.message);
    }
}

function renderPaymentsTable(payments) {
    const tableBody = document.getElementById('paymentsTableBody');
    if (!tableBody) return;

    if (!payments || payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#64748b;padding:2rem;">Chưa có giao dịch thanh toán nào</td></tr>';
        return;
    }

    tableBody.innerHTML = payments.map(p => {
        const isSuccess = p.status === 'SUCCESS';
        const statusBadge = isSuccess 
            ? '<span class="summary-pill active">Thành công</span>'
            : `<span class="summary-pill" style="background:#fef3c7;color:#b45309;">${p.status}</span>`;
        
        const methodDisplay = p.paymentMethod === 'VIETQR' ? 'VietQR (Napas 247)'
            : p.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản VCB'
            : p.paymentMethod || 'Chuyển khoản';

        const typeLabel = p.paymentType === 'DEPOSIT' ? ' (Đặt cọc)' 
            : p.paymentType === 'INSTALLMENT' ? ' (Đợt 2)' 
            : '';

        return `
            <tr>
                <td><strong>#${p.externalReference || ('TXN-' + p.paymentId)}</strong></td>
                <td><strong>${p.contractCode || ('HD-' + p.contractId)}</strong></td>
                <td>${p.customerName || 'Khách hàng'}</td>
                <td style="color:#087f82;font-weight:700;">${formatVND(p.amount)}</td>
                <td>${methodDisplay}${typeLabel}</td>
                <td>${formatDateTime(p.paymentDate || p.createdAt)}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function updatePaymentTotals(payments) {
    const totalPaidEl = document.getElementById('totalPaidDepositEl');
    if (!totalPaidEl) return;

    const totalPaid = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    totalPaidEl.innerText = formatVND(totalPaid);
}

document.addEventListener('DOMContentLoaded', () => {
    // Tự động tải thanh toán khi chuyển sang tab Payments
    const navItem = document.querySelector('[data-tab="tab-payments"]');
    if (navItem) {
        navItem.addEventListener('click', () => {
            loadPayments();
        });
    }

    // Tải một lần khi khởi tạo
    setTimeout(() => {
        loadPayments();
    }, 1500);
});
