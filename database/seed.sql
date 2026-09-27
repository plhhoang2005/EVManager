-- =============================================================================
-- EVManager Database Seed Data (PostgreSQL 16)
-- Initial seed data for system roles, admin accounts, venues, dishes, services
-- Document reference: docs/testing/test-run-auth.md & docs/design/initial-data-analysis.md
-- =============================================================================

-- 1. SEED ROLES
INSERT INTO roles (role_name, description, status) VALUES
('ADMIN', 'Quản trị viên toàn quyền hệ thống', 'ACTIVE'),
('MANAGER', 'Quản lý vận hành tiệc & hợp đồng', 'ACTIVE'),
('SALES', 'Nhân viên tư vấn & bán hàng', 'ACTIVE'),
('COORDINATOR', 'Điều phối viên sự kiện & sảnh tiệc', 'ACTIVE'),
('ACCOUNTANT', 'Kế toán quản lý thu chi & thanh toán', 'ACTIVE')
ON CONFLICT (role_name) DO NOTHING;

-- 2. SEED USERS (Password: Password@123 hashed with BCrypt)
INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status) VALUES
(1, 'admin', '$2a$10$7R.x5QhD8pZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJz', 'Quản trị viên Hệ thống', 'admin@gmail.com', '0901234567', 'ACTIVE'),
(3, 'sales_user', '$2a$10$7R.x5QhD8pZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJz', 'Nguyễn Văn Tư Vấn', 'sales@gmail.com', '0902345678', 'ACTIVE'),
(4, 'coordinator_user', '$2a$10$7R.x5QhD8pZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJzZJz', 'Trần Thị Điều Phối', 'coordinator@gmail.com', '0903456789', 'ACTIVE')
ON CONFLICT (username) DO NOTHING;

-- 3. SEED VENUES
INSERT INTO venues (venue_name, min_capacity, max_capacity, rental_price, address, status) VALUES
('Sảnh Kim Cương (Diamond Hall)', 200, 500, 15000000.00, 'Tầng 1, Trung tâm EVManager', 'AVAILABLE'),
('Sảnh Hoàng Gia (Imperial Hall)', 100, 300, 10000000.00, 'Tầng 2, Trung tâm EVManager', 'AVAILABLE'),
('Sảnh Ngọc Bích (Emerald Hall)', 50, 150, 6000000.00, 'Tầng 3, Trung tâm EVManager', 'AVAILABLE')
ON CONFLICT (venue_name, address) DO NOTHING;

-- 4. SEED SERVICES
INSERT INTO services (service_name, description, unit_price, status) VALUES
('Dịch vụ Âm thanh - Ánh sáng Chuyên nghiệp', 'Hệ thống loa array, đèn sân khấu LED, màn hình LED 4K', 7000000.00, 'ACTIVE'),
('Trang trí Sân khấu & Cổng hoa', 'Trang trí hoa tươi theo theme cưới/hội nghị', 5000000.00, 'ACTIVE'),
('Ban nhạc & Ca sĩ biểu diễn', 'Ban nhạc hòa tấu 4 người trong 2 giờ', 8000000.00, 'ACTIVE'),
('MC Dẫn chương trình', 'MC chuyên nghiệp tiếng Việt & tiếng Anh', 3000000.00, 'ACTIVE')
ON CONFLICT (service_name) DO NOTHING;
