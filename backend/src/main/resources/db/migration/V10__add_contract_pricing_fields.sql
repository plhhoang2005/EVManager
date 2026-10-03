-- Migration V10: Add Contract Pricing Fields and Sequence, Update Status Lifecycle

-- 1. Create a sequence for contract code generation
CREATE SEQUENCE IF NOT EXISTS contract_code_seq START 1;

-- 2. Add pricing snapshot fields to contracts
ALTER TABLE contracts
ADD COLUMN sub_total NUMERIC(18,2) DEFAULT 0,
ADD COLUMN discount_percent NUMERIC(5,2) DEFAULT 0,
ADD COLUMN vat_percent NUMERIC(5,2) DEFAULT 0;

-- 3. Update the CHECK constraint for contracts status to match BE-19 lifecycle
ALTER TABLE contracts DROP CONSTRAINT chk_contracts_status;

ALTER TABLE contracts ADD CONSTRAINT chk_contracts_status 
CHECK (status IN ('DRAFT', 'PENDING_DEPOSIT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));
