/**
 * Module Giao diện chính (home.js)
 * Xử lý tương tác Giao diện trang chủ (Header, Calculator, Contact Form)
 */

document.addEventListener('DOMContentLoaded', function () {
    const currentUser = sessionStorage.getItem('currentUser');
    const navActions = document.getElementById('navActions');

    // Cập nhật nút trong Header nếu đã đăng nhập Admin
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

    // Toggle Menu Mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
    }

    // Scroll Header Shadow
    window.addEventListener('scroll', function () {
        const header = document.getElementById('topNavbar');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Công cụ tính chi phí sự kiện
    initCalculatorLogic();

    // Form Liên Hệ
    const contactForm = document.getElementById('publicContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const successMsg = document.getElementById('contactSuccessMsg');
            if (successMsg) {
                successMsg.textContent = '🎉 Yêu cầu của bạn đã được gửi thành công! Chuyên viên EVManager sẽ liên hệ lại trong ít phút.';
                successMsg.hidden = false;
                contactForm.reset();
            }
        });
    }

    // Nút Đăng ký dịch vụ cuộn xuống form liên hệ
    document.querySelectorAll('.open-booking-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const serviceName = e.target.getAttribute('data-service');
            const contactInput = document.getElementById('contactEventType');
            if (contactInput && serviceName) {
                contactInput.value = serviceName;
            }
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

/**
 * Logic tính toán chi phí ước tính linh hoạt
 */
function initCalculatorLogic() {
    let selectedBasePrice = 40000000;
    const guestRange = document.getElementById('guestRange');
    const guestCountVal = document.getElementById('guestCountVal');

    const optBtns = document.querySelectorAll('#eventTypeGroup .calc-opt-btn');
    optBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            optBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedBasePrice = parseInt(btn.getAttribute('data-base')) || 40000000;
            recalculate();
        });
    });

    if (guestRange) {
        guestRange.addEventListener('input', function (e) {
            if (guestCountVal) guestCountVal.textContent = `${e.target.value} khách`;
            recalculate();
        });
    }

    const checkboxes = document.querySelectorAll('.calc-checkboxes input[type="checkbox"]');
    checkboxes.forEach(function (cb) { cb.addEventListener('change', recalculate); });

    function recalculate() {
        const guests = parseInt(guestRange ? guestRange.value : 150);
        // Phụ thu khách vượt mốc 50
        const guestPrice = Math.max(0, (guests - 50) * 100000);

        let addonPrice = 0;
        checkboxes.forEach(function (cb) {
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
        calcSubmitBtn.addEventListener('click', function () {
            const contactSection = document.getElementById('contact');
            const contactInput = document.getElementById('contactEventType');
            if (contactInput) {
                const totalElem = document.getElementById('totalEstimatePrice');
                contactInput.value = `Tư vấn báo giá theo bảng tính (${totalElem ? totalElem.textContent : ''})`;
            }
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}
