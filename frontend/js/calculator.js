/**
 * EVManager - Module Tính Chi Phí Tiệc Cưới Chuẩn BA (calculator.js)
 * Tuân thủ UC-06, UC-07, UC-08:
 * - Tiền Menu = Số bàn * Giá Set Menu
 * - Dịch vụ bổ sung + Tặng kèm MC & Tháp rượu khi bàn > 25
 * - Thuế VAT 8%
 * - Tiền cọc đợt 1 (30%)
 */

document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initWeddingCalculator();
});

function initHeader() {
    const currentUser = sessionStorage.getItem('currentUser');
    const navActions = document.getElementById('navActions');

    if (navActions && currentUser === 'admin') {
        navActions.innerHTML = `
            <a href="admin.html" class="btn btn-primary btn-sm">
                <span>⚡ Trang Quản Trị</span>
            </a>
            <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                <span></span><span></span><span></span>
            </button>
        `;
    }

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
    }
}

function initWeddingCalculator() {
    let selectedMenuPrice = 5500000; // Mặc định Set Phổ biến
    const tableRange = document.getElementById('tableRange');
    const tableCountVal = document.getElementById('tableCountVal');
    const giftNoticeBadge = document.getElementById('autoGiftBadge');

    // Nút chọn phân khúc Set Menu
    const menuBtns = document.querySelectorAll('#menuTypeGroup .calc-opt-btn');
    menuBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            menuBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedMenuPrice = parseInt(btn.getAttribute('data-price'), 10) || 5500000;
            recalculate();
        });
    });

    // Thanh trượt số bàn tiệc
    if (tableRange) {
        tableRange.addEventListener('input', function (e) {
            const tables = parseInt(e.target.value, 10);
            if (tableCountVal) {
                tableCountVal.textContent = `${tables} bàn (${tables * 10} khách)`;
            }
            recalculate();
        });
    }

    // Các checkbox dịch vụ bổ sung
    const checkboxes = document.querySelectorAll('.calc-checkboxes input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
        cb.addEventListener('change', recalculate);
    });

    function recalculate() {
        const tables = parseInt(tableRange ? tableRange.value : 30, 10);
        const menuTotal = tables * selectedMenuPrice;

        // Dịch vụ bổ sung
        let serviceTotal = 0;
        checkboxes.forEach(function (cb) {
            if (cb.checked) {
                serviceTotal += parseInt(cb.value, 10) || 0;
            }
        });

        // Chính sách tặng kèm >25 bàn (UC-07)
        const isFreeGift = tables >= 25;
        if (giftNoticeBadge) {
            giftNoticeBadge.style.display = isFreeGift ? 'block' : 'none';
        }

        const giftLabel = document.getElementById('giftNoticeLabel');
        if (giftLabel) {
            giftLabel.textContent = isFreeGift ? '🎁 Tặng MC & Tháp rượu (0đ)' : 'Không áp dụng (Dưới 25 bàn)';
            giftLabel.style.color = isFreeGift ? '#059669' : '#64748b';
        }

        // Nếu dưới 25 bàn, khách cần thêm MC và Tháp rượu thì tính thêm 6.5tr
        const effectiveServiceTotal = isFreeGift ? serviceTotal : serviceTotal + 6500000;

        const subtotal = menuTotal + effectiveServiceTotal;
        const vat = subtotal * 0.08;
        const grandTotal = subtotal + vat;
        const deposit30 = grandTotal * 0.3;

        // Hiển thị kết quả
        const totalEl = document.getElementById('totalEstimatePrice');
        const menuLabel = document.getElementById('menuPriceLabel');
        const serviceLabel = document.getElementById('servicePriceLabel');
        const vatLabel = document.getElementById('vatPriceLabel');
        const depositLabel = document.getElementById('deposit30Label');

        if (totalEl) totalEl.textContent = `${formatVND(grandTotal)} VNĐ`;
        if (menuLabel) menuLabel.textContent = `${formatVND(menuTotal)}đ`;
        if (serviceLabel) serviceLabel.textContent = `${formatVND(effectiveServiceTotal)}đ`;
        if (vatLabel) vatLabel.textContent = `${formatVND(vat)}đ`;
        if (depositLabel) depositLabel.textContent = `${formatVND(deposit30)}đ`;
    }

    function formatVND(amount) {
        return Math.round(amount).toLocaleString('vi-VN');
    }

    // Nút Đặt tư vấn & Giữ sảnh
    const submitBtn = document.getElementById('calcSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const tables = tableRange ? tableRange.value : 30;
            const totalText = document.getElementById('totalEstimatePrice')?.textContent || '';
            window.location.href = `contact.html?tables=${tables}&estimate=${encodeURIComponent(totalText)}`;
        });
    }

    // Tính lần đầu khi load
    recalculate();
}
