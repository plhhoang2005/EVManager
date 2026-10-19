-- =============================================================================
-- Migration V16: Add Query Performance Indexes (BE-28)
-- Optimizes event date range lookups and contract status/date filtering
-- =============================================================================

-- 1. Index on contracts(status) for contract status filtering and aggregations
CREATE INDEX idx_contracts_status ON contracts(status);

-- 2. Index on contracts(contract_date) for revenue reports and date range queries
CREATE INDEX idx_contracts_contract_date ON contracts(contract_date);

-- 3. Composite Index on events(start_at, end_at) for date range / calendar queries
CREATE INDEX idx_events_time ON events(start_at, end_at);
