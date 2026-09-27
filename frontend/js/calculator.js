/**
 * Module Tính chi phí (calculator.js)
 * Xử lý công cụ tính chi phí trên trang calculator.html
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
        const guestPrice = Math.max(0, (guests - 50) * 100000);

        let addonPrice = 0;
        checkboxes.forEach(function(cb) {
            if (cb.checked) addonPrice += parseInt(cb.value) || 0;
        });

        const total = selectedBasePrice + guestPrice + addonPrice;

        const totalElem = document.getElementById('totalEstimatePrice');
        const baseElem = document.getElementById('basePriceLabel');
        const guestElem = document.getElementById('guestPriceLabel');
        const addonElem = document.getElementById('addonPriceLabel');

        if (totalElem) totalElem.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
        if (baseElem) baseElem.textContent = `${selectedBasePrice.toLocaleString('vi-VN')}đ`;
        if (guestElem) guestElem.textContent = `${guestPrice.toLocaleString('vi-VN')}đ`;
        if (addonElem) addonElem.textContent = `${addonPrice.toLocaleString('vi-VN')}đ`;
    }

    const calcSubmitBtn = document.getElementById('calcSubmitBtn');
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', function() {
            const totalElem = document.getElementById('totalEstimatePrice');
            const totalText = totalElem ? totalElem.textContent : '';
            window.location.href = `contact.html?estimate=${encodeURIComponent(totalText)}`;
        });
    }
}
