/**
 * Module Tính chi phí (calculator.js)
 * Xử lý công cụ tính chi phí trên trang calculator.html theo quy chuẩn BA UC-08 & Bug-03
 */

document.addEventListener('DOMContentLoaded', function() {
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
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }

    initCalculatorLogic();
});

function initCalculatorLogic() {
    let selectedBasePrice = 40000000;
    const guestRange = document.getElementById('guestRange');
    const guestCountVal = document.getElementById('guestCountVal');

    const optBtns = document.querySelectorAll('#eventTypeGroup .calc-opt-btn');
    optBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            optBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedBasePrice = parseInt(btn.getAttribute('data-base')) || 40000000;
            recalculate();
        });
    });

    if (guestRange) {
        guestRange.addEventListener('input', function(e) {
            if (guestCountVal) guestCountVal.textContent = `${e.target.value} khách`;
            recalculate();
        });
    }

    const checkboxes = document.querySelectorAll('.calc-checkboxes input[type="checkbox"]');
    checkboxes.forEach(function(cb) { cb.addEventListener('change', recalculate); });

    function recalculate() {
        const guests = parseInt(guestRange ? guestRange.value : 150);
        // Ước tính chi phí thực đơn/bàn: 250.000 đ/khách
        const guestPrice = guests * 250000;

        // Dịch vụ bổ sung (sân khấu, âm thanh, MC, quay phim)
        let addonPrice = 0;
        ['optStage', 'optSound', 'optMC', 'optMedia'].forEach(function(id) {
            const cb = document.getElementById(id);
            if (cb && cb.checked) {
                addonPrice += parseInt(cb.value) || 0;
            }
        });

        // Tổng chi phí trước chiết khấu
        const subtotalBeforeDiscount = selectedBasePrice + guestPrice + addonPrice;

        // 1. Áp dụng Chiết khấu % TRƯỚC theo quy chuẩn BUG-03 & BA UC-08
        const discountCb = document.getElementById('optDiscountPercent');
        const discountPercent = (discountCb && discountCb.checked) ? (parseInt(discountCb.value) || 5) : 0;
        const discountAmount = Math.round(subtotalBeforeDiscount * (discountPercent / 100));
        const afterDiscount = subtotalBeforeDiscount - discountAmount;

        // 2. Tiếp tục trừ Voucher tiền mặt TRỰC TIẾP SAU chiết khấu theo BUG-03
        const voucherCb = document.getElementById('optVoucher');
        const voucherAmount = (voucherCb && voucherCb.checked) ? (parseInt(voucherCb.value) || 2000000) : 0;
        const netSubtotal = Math.max(0, afterDiscount - voucherAmount);

        // 3. Phí phục vụ 5%
        const serviceCharge = Math.round(netSubtotal * 0.05);

        // 4. Thuế GTGT VAT 8% (tính trên tổng dịch vụ đã cộng phí phục vụ)
        const vat = Math.round((netSubtotal + serviceCharge) * 0.08);

        // 5. Tổng ngân sách trọn gói
        const grandTotal = netSubtotal + serviceCharge + vat;

        // 6. Tiền đặt cọc tối thiểu đợt 1 (30% tổng giá trị hợp đồng)
        const depositMin = Math.round(grandTotal * 0.30);

        // Hiển thị ra giao diện
        const totalElem = document.getElementById('totalEstimatePrice');
        const baseElem = document.getElementById('basePriceLabel');
        const guestElem = document.getElementById('guestPriceLabel');
        const addonElem = document.getElementById('addonPriceLabel');
        const discountPercentElem = document.getElementById('discountPercentLabel');
        const voucherElem = document.getElementById('voucherLabel');
        const serviceChargeElem = document.getElementById('serviceChargeLabel');
        const vatElem = document.getElementById('vatLabel');
        const depositElem = document.getElementById('depositLabel');

        if (totalElem) totalElem.textContent = `${grandTotal.toLocaleString('vi-VN')} VNĐ`;
        if (baseElem) baseElem.textContent = `${selectedBasePrice.toLocaleString('vi-VN')}đ`;
        if (guestElem) guestElem.textContent = `${guestPrice.toLocaleString('vi-VN')}đ`;
        if (addonElem) addonElem.textContent = `${addonPrice.toLocaleString('vi-VN')}đ`;
        if (discountPercentElem) discountPercentElem.textContent = `-${discountAmount.toLocaleString('vi-VN')}đ`;
        if (voucherElem) voucherElem.textContent = `-${voucherAmount.toLocaleString('vi-VN')}đ`;
        if (serviceChargeElem) serviceChargeElem.textContent = `${serviceCharge.toLocaleString('vi-VN')}đ`;
        if (vatElem) vatElem.textContent = `${vat.toLocaleString('vi-VN')}đ`;
        if (depositElem) depositElem.textContent = `${depositMin.toLocaleString('vi-VN')}đ`;
    }

    // Tính toán khởi tạo lần đầu
    recalculate();

    const calcSubmitBtn = document.getElementById('calcSubmitBtn');
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', function() {
            const totalElem = document.getElementById('totalEstimatePrice');
            const totalText = totalElem ? totalElem.textContent : '';
            window.location.href = `contact.html?estimate=${encodeURIComponent(totalText)}`;
        });
    }
}
