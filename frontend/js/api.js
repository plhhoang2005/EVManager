/**
 * Module xử lý API trung tâm (api.js)
 * Cung cấp hàm fetchAPI dùng chung cho toàn bộ ứng dụng Frontend EVManager
 */

const API_BASE_URL = 'http://localhost:8080';

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

    // Mặc định Content-Type là application/json nếu gửi body dạng chuỗi
    if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Chỉ tự động logout khi gặp đúng HTTP 401 Unauthorized tại các trang nội bộ
        if (response.status === 401) {
            const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
            if (!isAuthEndpoint && !window.location.pathname.includes('login.html')) {
                console.warn('Phiên đăng nhập hết hạn (HTTP 401). Điều hướng về trang đăng nhập.');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}
