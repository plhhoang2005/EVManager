-- =============================================================================
-- Migration V11: Seed Demo Accounts for All 4 BA Standard Roles (50% Milestone)
-- 1. ADMIN       : admin@evmanager.vn / admin123
-- 2. SALES       : sales@evmanager.vn (hoặc staff@evmanager.vn) / sales123 (staff123)
-- 3. COORDINATOR : coordinator@evmanager.vn / coordinator123
-- 4. CUSTOMER    : customer@evmanager.vn (hoặc khachhang1@gmail.com) / 123456
-- =============================================================================

-- Ensure standard roles exist
INSERT INTO roles (role_name, description, status) VALUES
('ADMIN', 'Quản trị viên toàn quyền hệ thống', 'ACTIVE'),
('SALES', 'Nhân viên tư vấn & bán hàng', 'ACTIVE'),
('COORDINATOR', 'Điều phối viên sự kiện & sảnh tiệc', 'ACTIVE'),
('CUSTOMER', 'Khách hàng đặt tiệc cá nhân/doanh nghiệp', 'ACTIVE')
ON CONFLICT (role_name) DO NOTHING;

-- 1. ADMIN: admin_demo@evmanager.vn / admin123 (Insert only, do not override existing admin)

INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'ADMIN' LIMIT 1),
    'admin_demo',
    '$2a$10$3oHAPBUUjWL/kkoO5sxodOSnwWlgqxl5MSNIfE6yE6Z5EOCkbT6tW',
    'Quản trị viên Demo',
    'admin_demo@evmanager.vn',
    '0909000001',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin_demo' OR email = 'admin_demo@evmanager.vn'
);

-- 2. SALES: staff@evmanager.vn / staff123 & sales@evmanager.vn / sales123
INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'SALES' LIMIT 1),
    'staff',
    '$2a$10$KysTsnxlyNmc7hONZkNVheLOy.SEkJ2tO9nulxTNYzHvAGHg7wXjm',
    'Nhân viên tư vấn bán hàng',
    'staff@evmanager.vn',
    '0909000002',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'staff' OR email = 'staff@evmanager.vn'
);

INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'SALES' LIMIT 1),
    'sales',
    '$2a$10$7v2ODUNhzEZRRLAmSIKhDuj/JFjjh0rTNsqXS8pUy2XmeQj6hLOXa',
    'Chuyên viên kinh doanh',
    'sales@evmanager.vn',
    '0909000003',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'sales' OR email = 'sales@evmanager.vn'
);

-- 3. COORDINATOR: coordinator@evmanager.vn / coordinator123
INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'COORDINATOR' LIMIT 1),
    'coordinator',
    '$2a$10$NGYPl.4W4yQojatIFDrwXORAxdRVMIor6K.r1oAtbE2T9BWVtjIBm',
    'Điều phối viên sự kiện',
    'coordinator@evmanager.vn',
    '0909000004',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'coordinator' OR email = 'coordinator@evmanager.vn'
);

-- 4. CUSTOMER: customer@evmanager.vn / 123456 & khachhang1@gmail.com / 123456
INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'CUSTOMER' LIMIT 1),
    'customer',
    '$2a$10$MnsqDKgjFZ09zYTQQmBicufqr1fILZANaGsfmwNonDRlRavzf8Dhe',
    'Khách hàng đặt tiệc',
    'customer@evmanager.vn',
    '0901234567',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'customer' OR email = 'customer@evmanager.vn'
);

INSERT INTO users (role_id, username, password_hash, full_name, email, phone, status)
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'CUSTOMER' LIMIT 1),
    'khachhang1',
    '$2a$10$MnsqDKgjFZ09zYTQQmBicufqr1fILZANaGsfmwNonDRlRavzf8Dhe',
    'Nguyễn Khách Hàng',
    'khachhang1@gmail.com',
    '0901234568',
    'ACTIVE'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'khachhang1' OR email = 'khachhang1@gmail.com'
);
