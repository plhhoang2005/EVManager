-- CreateTable roles
CREATE TABLE "roles" (
    "role_id" BIGSERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable users
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable customers
CREATE TABLE "customers" (
    "customer_id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id"),
    CONSTRAINT "chk_customers_contact" CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- CreateTable venues
CREATE TABLE "venues" (
    "venue_id" BIGSERIAL NOT NULL,
    "venue_name" VARCHAR(100) NOT NULL,
    "min_capacity" INTEGER NOT NULL DEFAULT 0,
    "max_capacity" INTEGER NOT NULL,
    "rental_price" DECIMAL(18,2) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("venue_id"),
    CONSTRAINT "chk_venues_min_capacity" CHECK (min_capacity >= 0),
    CONSTRAINT "chk_venues_capacity_range" CHECK (max_capacity >= min_capacity),
    CONSTRAINT "chk_venues_rental_price" CHECK (rental_price >= 0)
);

-- CreateTable dishes
CREATE TABLE "dishes" (
    "dish_id" BIGSERIAL NOT NULL,
    "dish_name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("dish_id"),
    CONSTRAINT "chk_dishes_price" CHECK (price >= 0)
);

-- CreateTable menus
CREATE TABLE "menus" (
    "menu_id" BIGSERIAL NOT NULL,
    "menu_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(18,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("menu_id"),
    CONSTRAINT "chk_menus_price" CHECK (price >= 0)
);

-- CreateTable menu_dishes
CREATE TABLE "menu_dishes" (
    "menu_id" BIGINT NOT NULL,
    "dish_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" VARCHAR(255),

    CONSTRAINT "pk_menu_dishes" PRIMARY KEY ("menu_id","dish_id"),
    CONSTRAINT "chk_menu_dishes_quantity" CHECK (quantity > 0)
);

-- CreateTable services
CREATE TABLE "services" (
    "service_id" BIGSERIAL NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "unit_price" DECIMAL(18,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id"),
    CONSTRAINT "chk_services_unit_price" CHECK (unit_price >= 0)
);

-- CreateTable events
CREATE TABLE "events" (
    "event_id" BIGSERIAL NOT NULL,
    "venue_id" BIGINT NOT NULL,
    "event_name" VARCHAR(100) NOT NULL,
    "start_at" TIMESTAMPTZ NOT NULL,
    "end_at" TIMESTAMPTZ NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id"),
    CONSTRAINT "chk_events_time_range" CHECK (end_at > start_at),
    CONSTRAINT "chk_events_guest_count" CHECK (guest_count > 0)
);

-- CreateTable contracts
CREATE TABLE "contracts" (
    "contract_id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "event_id" BIGINT,
    "menu_id" BIGINT,
    "contract_code" VARCHAR(50) NOT NULL,
    "contract_date" DATE NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "deposit_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_id"),
    CONSTRAINT "chk_contracts_total_amount" CHECK (total_amount >= 0),
    CONSTRAINT "chk_contracts_deposit_amount" CHECK (deposit_amount >= 0)
);

-- CreateTable contract_services
CREATE TABLE "contract_services" (
    "contract_id" BIGINT NOT NULL,
    "service_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "agreed_unit_price" DECIMAL(18,2) NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "pk_contract_services" PRIMARY KEY ("contract_id","service_id"),
    CONSTRAINT "chk_contract_services_quantity" CHECK (quantity > 0),
    CONSTRAINT "chk_contract_services_unit_price" CHECK (agreed_unit_price >= 0)
);

-- CreateTable payments
CREATE TABLE "payments" (
    "payment_id" BIGSERIAL NOT NULL,
    "contract_id" BIGINT NOT NULL,
    "external_reference" VARCHAR(100),
    "payment_type" VARCHAR(30) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "payment_date" TIMESTAMPTZ NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id"),
    CONSTRAINT "chk_payments_amount" CHECK (amount > 0)
);

-- CreateTable audit_logs
CREATE TABLE "audit_logs" (
    "audit_log_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100) NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" INET,
    "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("audit_log_id")
);

-- Unique Constraints
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "uk_venues_name_address" ON "venues"("venue_name", "address");
CREATE UNIQUE INDEX "uk_dishes_name_category" ON "dishes"("dish_name", "category");
CREATE UNIQUE INDEX "menus_menu_name_key" ON "menus"("menu_name");
CREATE UNIQUE INDEX "services_service_name_key" ON "services"("service_name");
CREATE UNIQUE INDEX "contracts_contract_code_key" ON "contracts"("contract_code");
CREATE UNIQUE INDEX "uk_contracts_event_id" ON "contracts"("event_id");
CREATE UNIQUE INDEX "payments_external_reference_key" ON "payments"("external_reference");

-- Indexes
CREATE INDEX "idx_users_role_id" ON "users"("role_id");
CREATE INDEX "idx_menu_dishes_dish_id" ON "menu_dishes"("dish_id");
CREATE INDEX "idx_events_venue_time" ON "events"("venue_id", "start_at", "end_at");
CREATE INDEX "idx_contracts_customer_id" ON "contracts"("customer_id");
CREATE INDEX "idx_contracts_menu_id" ON "contracts"("menu_id");
CREATE INDEX "idx_contract_services_service_id" ON "contract_services"("service_id");
CREATE INDEX "idx_payments_contract_id" ON "payments"("contract_id");
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs"("user_id");
CREATE INDEX "idx_audit_logs_entity_history" ON "audit_logs"("entity_type", "entity_id", "occurred_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "events" ADD CONSTRAINT "fk_events_venues" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "contracts" ADD CONSTRAINT "fk_contracts_customers" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "contracts" ADD CONSTRAINT "fk_contracts_events" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "contracts" ADD CONSTRAINT "fk_contracts_menus" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "menu_dishes" ADD CONSTRAINT "fk_menu_dishes_menus" FOREIGN KEY ("menu_id") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE "menu_dishes" ADD CONSTRAINT "fk_menu_dishes_dishes" FOREIGN KEY ("dish_id") REFERENCES "dishes"("dish_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "contract_services" ADD CONSTRAINT "fk_contract_services_contracts" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE "contract_services" ADD CONSTRAINT "fk_contract_services_services" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_contracts" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "audit_logs" ADD CONSTRAINT "fk_audit_logs_users" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
