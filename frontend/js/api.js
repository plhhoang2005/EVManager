/**
 * Module xử lý API trung tâm (api.js)
 * Cung cấp hàm fetchAPI dùng chung cho toàn bộ ứng dụng Frontend EVManager
 */

const API_BASE_URL = (() => {
    if (typeof window !== 'undefined') {
        if (window.APP_CONFIG && window.APP_CONFIG.API_URL) {
            return window.APP_CONFIG.API_URL;
        }
        if (localStorage.getItem('API_URL')) {
            return localStorage.getItem('API_URL');
        }
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return window.location.port === '8080' ? '' : 'http://localhost:8080';
        }
        // Khi deploy lên Cloud (Vercel / Netlify / GitHub Pages)
        return 'https://evmanager-api.onrender.com';
    }
    return 'http://localhost:8080';
})();

/**
 * Hàm fetchAPI dùng chung gửi request tới Backend
 * - Tự động lấy accessToken từ sessionStorage và đính kèm vào Header Authorization: Bearer <token>
 * - Tích hợp logic: nếu API trả về HTTP Status 401 hoặc 403, tự động xóa token và điều hướng người dùng về login.html
 * 
 * @param {string} endpoint - Đường dẫn API (ví dụ: '/api/v1/auth/login' hoặc URL tuyệt đối)
 * @param {RequestInit} [options={}] - Option cấu hình cho fetch (method, headers, body...)
 * @returns {Promise<Response>} Trả về Response object từ fetch
 */
function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT', e);
        return null;
    }
}

async function fetchAPI(endpoint, options = {}) {
    const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = new Headers(options.headers || {});

    // Tự động lấy accessToken từ sessionStorage và đính kèm vào Header Authorization
    const token = sessionStorage.getItem('accessToken');
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Nếu gửi kèm Body mà chưa set Content-Type, mặc định là application/json
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Xử lý bảo mật: Kiểm tra lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
        if (response.status === 401) {
            console.warn(`[fetchAPI] Request to ${endpoint} returned 401 Unauthorized. Redirecting to login.`);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('userRole');
            
            // Chỉ redirect nếu không đang ở trang login để tránh lặp vô tận
            const currentPath = window.location.pathname.toLowerCase();
            if (!currentPath.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }

        return response;
    } catch (error) {
        console.error(`[fetchAPI] Network error while calling ${endpoint}:`, error);
        throw error;
    }
}

// =====================================
// GLOBAL UI NOTIFICATION HELPERS (SweetAlert2)
// =====================================
window.showSuccess = function(title) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'success',
            title: title,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    } else {
        alert(title);
    }
};

window.showError = function(title, text = '') {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#087f82'
        });
    } else {
        alert(title + (text ? '\n' + text : ''));
    }
};

window.showConfirm = function(title, text) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Có, đồng ý',
            cancelButtonText: 'Hủy'
        }).then(result => result.isConfirmed);
    } else {
        return Promise.resolve(confirm(title + (text ? '\n' + text : '')));
    }
};

// Cho phép người dùng hoặc tester đổi Backend URL nhanh trên giao diện nếu cần
window.setBackendUrl = function(newUrl) {
    if (newUrl) {
        localStorage.setItem('API_URL', newUrl);
        alert(`Đã lưu Backend API URL: ${newUrl}. Trang sẽ tải lại!`);
        window.location.reload();
    }
};

window.resetBackendUrl = function() {
    localStorage.removeItem('API_URL');
    alert('Đã xóa URL tùy chỉnh, quay lại cấu hình mặc định. Trang sẽ tải lại!');
    window.location.reload();
};
