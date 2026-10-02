CREATE TABLE contract_menus (
    contract_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    table_count INT NOT NULL,
    agreed_price NUMERIC(18,2) NOT NULL,
    PRIMARY KEY (contract_id, menu_id),
    CONSTRAINT fk_cm_contract FOREIGN KEY (contract_id) REFERENCES contracts (contract_id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_menu FOREIGN KEY (menu_id) REFERENCES menus (menu_id) ON DELETE RESTRICT
);

-- Data Migration: Migrate existing menus to contract_menus
INSERT INTO contract_menus (contract_id, menu_id, table_count, agreed_price)
SELECT c.contract_id, c.menu_id, 
       GREATEST(COALESCE((e.guest_count + 9) / 10, 1), 1) as table_count, 
       m.price
FROM contracts c
JOIN menus m ON c.menu_id = m.menu_id
JOIN events e ON c.event_id = e.event_id
WHERE c.menu_id IS NOT NULL;

-- Drop foreign key and column after data migration
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS fk_contracts_menu;
ALTER TABLE contracts DROP COLUMN IF EXISTS menu_id;

ALTER TABLE contracts ADD COLUMN deposit_amount NUMERIC(18,2) NOT NULL DEFAULT 0.00;
ALTER TABLE contracts ADD COLUMN backup_table_count INT NOT NULL DEFAULT 0;
