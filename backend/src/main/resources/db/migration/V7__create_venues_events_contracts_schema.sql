-- =============================================================================
-- Migration V7: Create Venues, Dishes, Menus, Services, Events, Contracts & Payments
-- Aligns Spring Boot Flyway schema with official database/schema.sql (13-table 3NF design)
-- =============================================================================

-- 1. VENUES (Sảnh tiệc)
CREATE TABLE IF NOT EXISTS venues (
    venue_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    min_capacity INT NOT NULL DEFAULT 0,
    max_capacity INT NOT NULL,
    rental_price NUMERIC(18,2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_venues_name_address UNIQUE (venue_name, address),
    CONSTRAINT chk_venues_min_capacity CHECK (min_capacity >= 0),
    CONSTRAINT chk_venues_capacity_range CHECK (max_capacity >= min_capacity),
    CONSTRAINT chk_venues_rental_price CHECK (rental_price >= 0),
    CONSTRAINT chk_venues_status CHECK (status IN ('AVAILABLE', 'MAINTENANCE', 'INACTIVE'))
);

-- 2. DISHES (Món ăn)
CREATE TABLE IF NOT EXISTS dishes (
    dish_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dish_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(18,2) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_dishes_name_category UNIQUE (dish_name, category),
    CONSTRAINT chk_dishes_price CHECK (price >= 0),
    CONSTRAINT chk_dishes_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 3. MENUS (Thực đơn)
CREATE TABLE IF NOT EXISTS menus (
    menu_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(18,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_menus_price CHECK (price >= 0),
    CONSTRAINT chk_menus_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 4. MENU_DISHES (Liên kết N-N Thực đơn - Món ăn)
CREATE TABLE IF NOT EXISTS menu_dishes (
    menu_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    note VARCHAR(255),
    CONSTRAINT pk_menu_dishes PRIMARY KEY (menu_id, dish_id),
    CONSTRAINT fk_menu_dishes_menus FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_menu_dishes_dishes FOREIGN KEY (dish_id) REFERENCES dishes(dish_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_menu_dishes_quantity CHECK (quantity > 0)
);
CREATE INDEX IF NOT EXISTS idx_menu_dishes_dish_id ON menu_dishes(dish_id);

-- 5. SERVICES (Dịch vụ)
CREATE TABLE IF NOT EXISTS services (
    service_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    unit_price NUMERIC(18,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_services_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_services_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 6. EVENTS (Sự kiện / Tiệc cưới)
CREATE TABLE IF NOT EXISTS events (
    event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    venue_id BIGINT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    guest_count INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_venues FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_events_time_range CHECK (end_at > start_at),
    CONSTRAINT chk_events_guest_count CHECK (guest_count > 0),
    CONSTRAINT chk_events_status CHECK (status IN ('SCHEDULED', 'PREPARING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);
CREATE INDEX IF NOT EXISTS idx_events_venue_time ON events(venue_id, start_at, end_at);

-- 7. CONTRACTS (Hợp đồng)
CREATE TABLE IF NOT EXISTS contracts (
    contract_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    event_id BIGINT UNIQUE,
    menu_id BIGINT,
    contract_code VARCHAR(50) NOT NULL UNIQUE,
    contract_date DATE NOT NULL,
    total_amount NUMERIC(18,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contracts_customers FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_contracts_events FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_contracts_menus FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_contracts_total_amount CHECK (total_amount >= 0),
    CONSTRAINT chk_contracts_status CHECK (status IN ('DRAFT', 'PENDING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED'))
);
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_menu_id ON contracts(menu_id);

-- 8. CONTRACT_SERVICES (Liên kết N-N Hợp đồng - Dịch vụ)
CREATE TABLE IF NOT EXISTS contract_services (
    contract_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    agreed_unit_price NUMERIC(18,2) NOT NULL,
    note VARCHAR(255),
    CONSTRAINT pk_contract_services PRIMARY KEY (contract_id, service_id),
    CONSTRAINT fk_contract_services_contracts FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_contract_services_services FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_contract_services_quantity CHECK (quantity > 0),
    CONSTRAINT chk_contract_services_unit_price CHECK (agreed_unit_price >= 0)
);
CREATE INDEX IF NOT EXISTS idx_contract_services_service_id ON contract_services(service_id);

-- 9. PAYMENTS (Thanh toán)
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    external_reference VARCHAR(100) UNIQUE,
    payment_type VARCHAR(30) NOT NULL,
    amount NUMERIC(18,2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_contracts FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT chk_payments_amount CHECK (amount > 0),
    CONSTRAINT chk_payments_type CHECK (payment_type IN ('DEPOSIT', 'INSTALLMENT', 'FINAL', 'REFUND')),
    CONSTRAINT chk_payments_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
);
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
