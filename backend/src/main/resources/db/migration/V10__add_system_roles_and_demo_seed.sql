-- =============================================================================
-- Migration V10: Align System Roles with BA Specifications and Seed Demo Data
-- Closes #208: Add CUSTOMER role and demo customer 'Nguyễn Văn An'
-- =============================================================================

-- 1. Ensure all 4 BA standard roles exist (ADMIN, SALES, COORDINATOR, CUSTOMER)
INSERT INTO roles (role_name, description, status) VALUES
('ADMIN', 'Quản trị viên toàn quyền hệ thống', 'ACTIVE'),
('SALES', 'Nhân viên tư vấn & bán hàng', 'ACTIVE'),
('COORDINATOR', 'Điều phối viên sự kiện & sảnh tiệc', 'ACTIVE'),
('CUSTOMER', 'Khách hàng đặt tiệc cá nhân/doanh nghiệp', 'ACTIVE')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Ensure customer Nguyễn Văn An (0901234567) exists for demo
INSERT INTO customers (full_name, phone, email, address) VALUES
('Nguyễn Văn An', '0901234567', 'nguyenvana@example.com', '123 Lê Lợi, Quận 1, TP.HCM')
ON CONFLICT (phone) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    address = EXCLUDED.address;
