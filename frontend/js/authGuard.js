// authGuard.js
// Executes immediately to protect routes before rendering

(function() {
    const token = sessionStorage.getItem('accessToken');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // parseJwt is available from api.js which is loaded before authGuard.js
        const decoded = parseJwt(token);
        const roleStr = String(decoded.role || decoded.roles || decoded.authorities || '').toUpperCase();
        
        const path = window.location.pathname.toLowerCase();

        if (path.includes('admin.html') && !roleStr.includes('ADMIN')) {
            window.location.href = 'login.html';
        } else if (path.includes('sales.html') && !roleStr.includes('SALES')) {
            window.location.href = 'login.html';
        } else if (path.includes('coordinator.html') && !roleStr.includes('COORDINATOR')) {
            window.location.href = 'login.html';
        } else if (path.includes('customer.html') && !roleStr.includes('CUSTOMER')) {
            window.location.href = 'login.html';
        }
    } catch (e) {
        console.error("Token parsing failed in authGuard", e);
        window.location.href = 'login.html';
    }
})();
