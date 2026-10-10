-- Remove menu_id from contracts
ALTER TABLE contracts DROP COLUMN menu_id;

-- Add table_count and reserve_table_count to contracts
ALTER TABLE contracts ADD COLUMN table_count INT NOT NULL DEFAULT 0;
ALTER TABLE contracts ADD COLUMN reserve_table_count INT NOT NULL DEFAULT 0;

-- Create contract_menus table for N-N relationship
CREATE TABLE contract_menus (
    contract_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    agreed_price NUMERIC(18,2) NOT NULL,
    note VARCHAR(255),
    CONSTRAINT pk_contract_menus PRIMARY KEY (contract_id, menu_id),
    CONSTRAINT fk_contract_menus_contracts FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_contract_menus_menus FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_contract_menus_quantity CHECK (quantity > 0),
    CONSTRAINT chk_contract_menus_price CHECK (agreed_price >= 0)
);

CREATE INDEX idx_contract_menus_menu_id ON contract_menus(menu_id);
