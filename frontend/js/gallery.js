/**
 * Module Thư viện sự kiện (gallery.js)
 * Xử lý bộ lọc và tương tác trên trang gallery.html
 */

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const navActions = document.getElementById('navActions');

    if (navActions && currentUser) {
        if (currentUser.toLowerCase() === 'admin') {
            navActions.innerHTML = `
                <a href="admin.html" class="btn btn-primary btn-sm">
                    <span>⚡ Trang Quản Trị</span>
                </a>
                <button class="btn btn-outline btn-sm logout-button">Đăng xuất</button>
                <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                    <span></span><span></span><span></span>
                </button>
            `;
        } else {
            navActions.innerHTML = `
                <a href="user.html" class="nav-user-badge" id="userBadgeNav">
                    <span>👤</span> <span id="navUsername">${currentUser}</span>
                </a>
                <button class="btn btn-outline btn-sm logout-button">Đăng xuất</button>
                <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Navigation">
                    <span></span><span></span><span></span>
                </button>
            `;
        }

        document.querySelectorAll('.logout-button').forEach(btn => {
            btn.addEventListener('click', function() {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        });
    }

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });
    }

    // Bộ lọc danh mục Gallery
    const filterBtns = document.querySelectorAll('#galleryFilters .filter-btn');
    const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(function(item) {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
