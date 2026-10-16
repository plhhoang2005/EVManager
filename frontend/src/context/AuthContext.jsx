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

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        if (parsed?.fullName === 'Khách hàng Thành viên') {
          parsed.fullName = 'Khách hàng';
          sessionStorage.setItem('userInfo', JSON.stringify(parsed));
        }
        setCurrentUser(parsed);
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
    isAdmin: currentUser?.role === 'ROLE_ADMIN',
    isStaff: ['ROLE_ADMIN', 'ROLE_SALES', 'ROLE_COORDINATOR'].includes(currentUser?.role),
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
