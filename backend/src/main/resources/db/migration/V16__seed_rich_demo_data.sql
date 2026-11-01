-- =============================================================================
-- Migration V16: Seed Rich Demo Data for Seamless Multi-Role Showcase
-- Bổ sung dữ liệu mẫu thực tế cho cả 4 cổng: Admin, Sales, Coordinator, Customer
-- =============================================================================

-- 1. SEED KHÁCH HÀNG TIỀM NĂNG TỪ AI CONCIERGE ([AI_LEAD]) CHO SALES PORTAL
INSERT INTO customers (full_name, phone, email, address, created_at, updated_at) VALUES
('Nguyễn Thu Thảo', '0938112233', 'thuthao.wedding@gmail.com', '[AI_LEAD] Tiệc cưới sang trọng, 200 khách, Ngân sách: 120.000.000 đ | Ghi chú: Tone màu trắng pastel, cần MC hoạt náo', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP),
('Lê Quốc Dũng', '0988223344', 'quocdung.tech@fpt.com', '[AI_LEAD] Hội nghị khách hàng Tech Summit, 350 khách, Ngân sách: 180.000.000 đ | Ghi chú: Cần màn hình LED P3 và cabin dịch thuật', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP),
('Trần Hoàng Ngọc Lan', '0909556677', 'ngoclan.birthday@yahoo.com', '[AI_LEAD] Tiệc sinh nhật ấm cúng, 60 khách, Ngân sách: 45.000.000 đ | Ghi chú: Trang trí bong bóng nghệ thuật cho bé gái', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
('Công ty CP Đầu Tư Alpha', '0918776655', 'event@alphainvest.vn', '[AI_LEAD] Gala Year End Party 2026, 400 khách, Ngân sách: 250.000.000 đ | Ghi chú: Tiệc ngoài trời kết hợp sảnh tiệc chính', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP)
ON CONFLICT (phone) DO UPDATE 
SET address = EXCLUDED.address, updated_at = CURRENT_TIMESTAMP;

-- 2. SEED SỰ KIỆN ĐA DẠNG CHO BẢNG ĐIỀU PHỐI VIÊN (COORDINATOR PORTAL)
INSERT INTO events (venue_id, event_name, start_at, end_at, guest_count, status, created_at, updated_at) VALUES
(1, 'Lễ Thành Hôn - Chú rể Tuấn Kiệt & Cô dâu Mai Phương', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '3 hours', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '7 hours', 250, 'PREPARING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Hội Nghị Thường Niên Doanh Nhân Trẻ TP.HCM', CURRENT_TIMESTAMP + INTERVAL '4 hours', CURRENT_TIMESTAMP + INTERVAL '9 hours', 300, 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Lễ Kỷ Niệm 10 Năm Thành Lập Tập Đoàn GreenTech', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '4 hours', 180, 'COMPLETED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 3. SEED HỢP ĐỒNG ĐẶT TIỆC MẪU CHO CUSTOMER PORTAL & SALES PIPELINE (status tuân thủ chk_contracts_status: DRAFT, PENDING_CONFIRMATION, CONFIRMED, COMPLETED, CANCELLED)
INSERT INTO contracts (customer_id, contract_code, contract_date, total_amount, deposit_amount, status, created_at, updated_at)
SELECT 
    (SELECT customer_id FROM customers WHERE phone = '0901234567' LIMIT 1),
    'HD-2026-VIP01',
    CURRENT_DATE,
    150000000.00,
    45000000.00,
    'CONFIRMED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM contracts WHERE contract_code = 'HD-2026-VIP01'
);

INSERT INTO contracts (customer_id, contract_code, contract_date, total_amount, deposit_amount, status, created_at, updated_at)
SELECT 
    (SELECT customer_id FROM customers WHERE phone = '0938112233' LIMIT 1),
    'HD-2026-WED02',
    CURRENT_DATE,
    120000000.00,
    0.00,
    'DRAFT',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM contracts WHERE contract_code = 'HD-2026-WED02'
);
