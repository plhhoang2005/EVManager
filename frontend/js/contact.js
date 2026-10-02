/**
 * Module Liên hệ (contact.js)
 * Xử lý tự động điền dịch vụ và gửi form liên hệ trên trang contact.html
 */

document.addEventListener('DOMContentLoaded', function () {
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

    // Tự động nhận URL Parameters (ví dụ từ services.html hoặc calculator.html)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const estimateParam = urlParams.get('estimate');
    const eventParam = urlParams.get('event');

    const contactInput = document.getElementById('contactEventType');
    if (contactInput) {
        if (serviceParam) {
            contactInput.value = `Tư vấn gói: ${serviceParam}`;
        } else if (estimateParam) {
            contactInput.value = `Yêu cầu báo giá theo bảng tính (${estimateParam})`;
        } else if (eventParam) {
            contactInput.value = `Đăng ký sự kiện: ${eventParam}`;
        }
    }

    // Form Submit
    const contactForm = document.getElementById('publicContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const successMsg = document.getElementById('contactSuccessMsg');
            if (successMsg) {
                successMsg.textContent = '🎉 Yêu cầu của bạn đã được gửi thành công! Chuyên viên tư vấn EVManager sẽ liên hệ lại trong ít phút.';
                successMsg.hidden = false;
                contactForm.reset();
            }
        });
    }
});
