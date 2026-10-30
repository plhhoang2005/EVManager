import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('accessToken');
      const storedUser = sessionStorage.getItem('userInfo');

      if (storedToken) {
        setToken(storedToken);
        let parsed = null;
        if (storedUser) {
          try {
            parsed = JSON.parse(storedUser);
          } catch (e) {
            console.error('Lỗi phân tích userInfo:', e);
          }
        }
        if (!parsed) {
          // Khôi phục user từ token claims
          try {
            const parts = storedToken.split('.');
            if (parts.length >= 2) {
              const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const claims = JSON.parse(jsonPayload);
              parsed = {
                username: claims?.sub || '',
                role: claims?.role || 'ROLE_USER',
                fullName: claims?.sub || 'Người dùng',
              };
            }
          } catch (e) {
            console.error('Không thể trích xuất user từ token:', e);
          }
        }
        if (parsed) {
          if (parsed?.fullName === 'Khách hàng Thành viên') {
            parsed.fullName = 'Khách hàng';
          }
          setCurrentUser(parsed);
        }
      }
    } catch (err) {
      console.error('Lỗi khi đọc token từ sessionStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, accessToken) => {
    setCurrentUser(userData);
    setToken(accessToken);
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userInfo');
  };

  const updateCurrentUser = (newUserData) => {
    const updated = { ...currentUser, ...newUserData };
    setCurrentUser(updated);
    sessionStorage.setItem('userInfo', JSON.stringify(updated));
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!token,
    role: currentUser?.role || null,
    isAdmin: currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN',
    isStaff: ['ROLE_ADMIN', 'ROLE_SALES', 'ROLE_COORDINATOR', 'ADMIN', 'SALES', 'COORDINATOR'].includes(currentUser?.role),
    loading,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được gọi trong AuthProvider');
  }
  return context;
};

export default AuthContext;
