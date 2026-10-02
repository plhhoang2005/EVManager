CREATE TABLE contract_menus (
    contract_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    table_count INT NOT NULL,
    agreed_price NUMERIC(18,2) NOT NULL,
    PRIMARY KEY (contract_id, menu_id),
    CONSTRAINT fk_cm_contract FOREIGN KEY (contract_id) REFERENCES contracts (contract_id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_menu FOREIGN KEY (menu_id) REFERENCES menus (menu_id) ON DELETE RESTRICT
);

ALTER TABLE contracts DROP CONSTRAINT IF EXISTS fk_contracts_menu;
ALTER TABLE contracts DROP COLUMN IF EXISTS menu_id;

ALTER TABLE contracts ADD COLUMN deposit_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00;
ALTER TABLE contracts ADD COLUMN backup_table_count INT NOT NULL DEFAULT 0;
