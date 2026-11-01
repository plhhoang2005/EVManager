-- =============================================================================
-- Migration V17: Seed Demo Payments for VietQR and Deposit Tracking
-- =============================================================================

INSERT INTO payments (contract_id, external_reference, payment_type, amount, payment_date, payment_method, status, created_at)
SELECT 
    c.contract_id,
    'VQR-20261101-001',
    'DEPOSIT',
    45000000.00,
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    'VIETQR',
    'SUCCESS',
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
FROM contracts c
WHERE c.contract_code = 'HD-2026-VIP01'
ON CONFLICT (external_reference) DO NOTHING;

INSERT INTO payments (contract_id, external_reference, payment_type, amount, payment_date, payment_method, status, created_at)
SELECT 
    c.contract_id,
    'VQR-20261101-002',
    'INSTALLMENT',
    30000000.00,
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    'BANK_TRANSFER',
    'SUCCESS',
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
FROM contracts c
WHERE c.contract_code = 'HD-2026-VIP01'
ON CONFLICT (external_reference) DO NOTHING;
