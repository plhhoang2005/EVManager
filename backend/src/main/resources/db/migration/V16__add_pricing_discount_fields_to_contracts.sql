-- V16: Add pricing, discount, voucher and vat fields to contracts
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS sub_total NUMERIC(18,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS voucher_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS vat_percent NUMERIC(5,2) NOT NULL DEFAULT 0;

ALTER TABLE contracts
ADD CONSTRAINT chk_contracts_sub_total CHECK (sub_total >= 0),
ADD CONSTRAINT chk_contracts_discount_percent CHECK (discount_percent >= 0 AND discount_percent <= 100),
ADD CONSTRAINT chk_contracts_voucher_amount CHECK (voucher_amount >= 0),
ADD CONSTRAINT chk_contracts_vat_percent CHECK (vat_percent >= 0);
