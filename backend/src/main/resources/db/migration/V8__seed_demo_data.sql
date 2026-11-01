-- =============================================================================
-- Migration V8: Seed Demo Data for Venues, Services, Dishes, Menus and Roles
-- Aligns Spring Boot Flyway demo data with official database/seed.sql
-- =============================================================================

-- 1. SEED ADDITIONAL ROLES
INSERT INTO roles (role_name, description, status) VALUES
('MANAGER', 'Quản lý vận hành tiệc & hợp đồng', 'ACTIVE'),
('SALES', 'Nhân viên tư vấn & bán hàng', 'ACTIVE'),
('COORDINATOR', 'Điều phối viên sự kiện & sảnh tiệc', 'ACTIVE'),
('ACCOUNTANT', 'Kế toán quản lý thu chi & thanh toán', 'ACTIVE')
ON CONFLICT (role_name) DO NOTHING;

-- 2. SEED VENUES
INSERT INTO venues (venue_name, min_capacity, max_capacity, rental_price, address, status) VALUES
('Sảnh Kim Cương (Diamond Hall)', 200, 500, 15000000.00, 'Tầng 1, Trung tâm EVManager', 'AVAILABLE'),
('Sảnh Hoàng Gia (Imperial Hall)', 100, 300, 10000000.00, 'Tầng 2, Trung tâm EVManager', 'AVAILABLE'),
('Sảnh Ngọc Bích (Emerald Hall)', 50, 150, 6000000.00, 'Tầng 3, Trung tâm EVManager', 'AVAILABLE')
ON CONFLICT (venue_name, address) DO NOTHING;

-- 3. SEED SERVICES
INSERT INTO services (service_name, description, unit_price, status) VALUES
('Dịch vụ Âm thanh - Ánh sáng Chuyên nghiệp', 'Hệ thống loa array, đèn sân khấu LED, màn hình LED 4K', 7000000.00, 'ACTIVE'),
('Trang trí Sân khấu & Cổng hoa', 'Trang trí hoa tươi theo theme cưới/hội nghị', 5000000.00, 'ACTIVE'),
('Ban nhạc & Ca sĩ biểu diễn', 'Ban nhạc hòa tấu 4 người trong 2 giờ', 8000000.00, 'ACTIVE'),
('MC Dẫn chương trình', 'MC chuyên nghiệp tiếng Việt & tiếng Anh', 3000000.00, 'ACTIVE')
ON CONFLICT (service_name) DO NOTHING;

-- 4. SEED DISHES
INSERT INTO dishes (dish_name, category, price, description, status) VALUES
('Khai vị 3 món (Chả giò, Gỏi ngó sen, Tôm chiên xù)', 'STARTER', 450000.00, 'Món khai vị đặc biệt', 'ACTIVE'),
('Súp bào ngư vi cá hải sản', 'SOUP', 650000.00, 'Súp thượng hạng dinh dưỡng', 'ACTIVE'),
('Bò sốt tiêu đen kèm bánh mì', 'MAIN', 850000.00, 'Thịt bò Úc thượng hạng sốt tiêu đen', 'ACTIVE'),
('Cá chẽm hấp Hồng Kông', 'MAIN', 750000.00, 'Cá chẽm tươi sốt nước tương Hồng Kông', 'ACTIVE'),
('Gà quay mật ong xôi chiên phồng', 'MAIN', 680000.00, 'Gà thả vườn quay da giòn', 'ACTIVE'),
('Lẩu thái hải sản chua cay', 'HOTPOT', 950000.00, 'Lẩu hải sản mực, tôm càng, nghêu', 'ACTIVE'),
('Chè hạt sen long nhãn tuyết nhĩ', 'DESSERT', 250000.00, 'Món tráng miệng thanh mát', 'ACTIVE')
ON CONFLICT (dish_name, category) DO NOTHING;

-- 5. SEED MENUS
INSERT INTO menus (menu_name, description, price, status) VALUES
('Thực đơn Kim Cương (Diamond Banquet)', 'Thực đơn 7 món cao cấp dành cho tiệc cưới sang trọng', 4500000.00, 'ACTIVE'),
('Thực đơn Hoàng Gia (Imperial Banquet)', 'Thực đơn 6 món chọn lọc tinh tế dành cho sự kiện', 3800000.00, 'ACTIVE')
ON CONFLICT (menu_name) DO NOTHING;
