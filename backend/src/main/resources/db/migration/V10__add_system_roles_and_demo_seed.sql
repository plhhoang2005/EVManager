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

-- 2. Safely add unique constraint on phone if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_customers_phone'
    ) THEN
        ALTER TABLE customers ADD CONSTRAINT uk_customers_phone UNIQUE (phone);
    END IF;
EXCEPTION
    WHEN duplicate_table OR duplicate_object OR unique_violation THEN
        NULL;
END $$;

-- 3. Ensure customer Nguyễn Văn An (0901234567) exists for demo
INSERT INTO customers (full_name, phone, email, address)
SELECT 'Nguyễn Văn An', '0901234567', 'nguyenvana@example.com', '123 Lê Lợi, Quận 1, TP.HCM'
WHERE NOT EXISTS (
    SELECT 1 FROM customers WHERE phone = '0901234567'
);

-- Update customer details if already present
UPDATE customers 
SET full_name = 'Nguyễn Văn An', 
    email = 'nguyenvana@example.com', 
    address = '123 Lê Lợi, Quận 1, TP.HCM'
WHERE phone = '0901234567';
