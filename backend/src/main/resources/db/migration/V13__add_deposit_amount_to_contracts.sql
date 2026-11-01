ALTER TABLE contracts
ADD COLUMN deposit_amount NUMERIC(18,2) NOT NULL DEFAULT 0;

ALTER TABLE contracts
ADD CONSTRAINT chk_contracts_deposit_amount CHECK (deposit_amount >= 0);
