-- =============================================================================
-- Migration V9: Seed additional demo data (Customers and Venues)
-- =============================================================================

-- SEED 2 MORE VENUES (to make it 5 total)
INSERT INTO venues (venue_name, min_capacity, max_capacity, rental_price, address, status) VALUES
('Sảnh Ruby (Ruby Hall)', 80, 200, 8000000.00, 'Tầng 4, Trung tâm EVManager', 'AVAILABLE'),
('Sảnh Bạch Kim (Platinum Hall)', 150, 400, 12000000.00, 'Tầng 5, Trung tâm EVManager', 'AVAILABLE')
ON CONFLICT (venue_name, address) DO NOTHING;

-- SEED 10 CUSTOMERS
INSERT INTO customers (full_name, phone, email, address, customer_type) VALUES
('Nguyễn Văn A', '0901234567', 'nguyenvana@example.com', 'Quận 1, TP.HCM', 'INDIVIDUAL'),
('Trần Thị B', '0912345678', 'tranthib@example.com', 'Quận 3, TP.HCM', 'INDIVIDUAL'),
('Lê Hoàng C', '0923456789', 'lehoangc@example.com', 'Quận 5, TP.HCM', 'INDIVIDUAL'),
('Phạm Thị D', '0934567890', 'phamthid@example.com', 'Quận 7, TP.HCM', 'INDIVIDUAL'),
('Hoàng Văn E', '0945678901', 'hoangvane@example.com', 'Quận 10, TP.HCM', 'INDIVIDUAL'),
('Công ty TNHH Sự Kiện Đỉnh Cao', '0956789012', 'contact@dinhcao.vn', 'Quận 2, TP.HCM', 'CORPORATE'),
('Công ty CP Truyền Thông Sao Mộc', '0967890123', 'info@saomoc.vn', 'Quận Bình Thạnh, TP.HCM', 'CORPORATE'),
('Tập đoàn ABC', '0978901234', 'event@abcgroup.com', 'Quận 1, TP.HCM', 'CORPORATE'),
('Công ty Du lịch Xanh', '0989012345', 'sales@xanh.com', 'Quận Tân Bình, TP.HCM', 'CORPORATE'),
('Trịnh Công F', '0990123456', 'trinhcongf@example.com', 'Quận Phú Nhuận, TP.HCM', 'INDIVIDUAL')
ON CONFLICT (email) DO NOTHING;
