import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from '../layouts/ClientLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Client Pages
import HomePage from '../pages/client/HomePage';
import ServicesPage from '../pages/client/ServicesPage';
import CalculatorPage from '../pages/client/CalculatorPage';
import GalleryPage from '../pages/client/GalleryPage';
import SchedulePage from '../pages/client/SchedulePage';
import ContactPage from '../pages/client/ContactPage';
import MenuWizardPage from '../pages/client/MenuWizardPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// User Pages
import ProfilePage from '../pages/user/ProfilePage';

// Admin & Staff Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import SalesPage from '../pages/admin/SalesPage';
import CoordinatorPage from '../pages/admin/CoordinatorPage';

// Error Pages
import NotFoundPage from '../pages/error/NotFoundPage';
import ForbiddenPage from '../pages/error/ForbiddenPage';
import ServerErrorPage from '../pages/error/ServerErrorPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Phân hệ Công khai & Khách hàng */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/menu" element={<MenuWizardPage />} />
        <Route path="/menu-wizard" element={<MenuWizardPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Phân hệ Thành viên (Yêu cầu đăng nhập) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Phân hệ Xác thực */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Phân hệ Quản trị (Admin, Sales, Coordinator) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/coordinator" element={<CoordinatorPage />} />
        </Route>
      </Route>

      {/* Trang thông báo lỗi độc lập */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/500" element={<ServerErrorPage />} />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
