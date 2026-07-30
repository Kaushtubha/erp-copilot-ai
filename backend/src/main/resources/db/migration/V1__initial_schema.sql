-- ERP Copilot AI — Database Schema Migration V1
-- Uses Flyway for version-controlled migrations

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN','WAREHOUSE_MANAGER','PURCHASE_MANAGER','SALES_MANAGER','FINANCE')),
    department VARCHAR(100),
    phone VARCHAR(20),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(50),
    unit_price NUMERIC(12, 2) NOT NULL,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    reorder_quantity INTEGER NOT NULL DEFAULT 50,
    brand VARCHAR(100),
    hs_code VARCHAR(50),
    auto_reorder BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);

-- ─────────────────────────────────────────────
-- WAREHOUSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    total_capacity INTEGER NOT NULL,
    used_capacity INTEGER NOT NULL DEFAULT 0,
    contact_phone VARCHAR(20),
    manager_name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- INVENTORY
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    quantity_on_order INTEGER NOT NULL DEFAULT 0,
    last_movement_at TIMESTAMPTZ,
    zone VARCHAR(50),
    bin_location VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0,
    CONSTRAINT uk_inventory_product_warehouse UNIQUE (product_id, warehouse_id)
);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);

-- ─────────────────────────────────────────────
-- VENDORS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    gstin VARCHAR(50),
    pan_number VARCHAR(50),
    rating NUMERIC(3, 2) DEFAULT 3.0,
    lead_time_days INTEGER NOT NULL DEFAULT 7,
    on_time_delivery_rate NUMERIC(5, 2) DEFAULT 85.0,
    quality_rejection_rate NUMERIC(5, 2) DEFAULT 2.0,
    total_purchase_value NUMERIC(15, 2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- PURCHASE ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(30) NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    order_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    total_amount NUMERIC(15, 2) DEFAULT 0,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    notes TEXT,
    approved_by VARCHAR(100),
    approved_at DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_order_date ON purchase_orders(order_date);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    ordered_quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- GOODS RECEIPT NOTES (GRN)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_number VARCHAR(30) NOT NULL UNIQUE,
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
    received_date DATE NOT NULL,
    received_by VARCHAR(100),
    inspected_by VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_INSPECTION',
    quality_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_grn_po ON grns(purchase_order_id);
CREATE INDEX idx_grn_status ON grns(status);

CREATE TABLE IF NOT EXISTS grn_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_id UUID NOT NULL REFERENCES grns(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    ordered_quantity INTEGER NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    accepted_quantity INTEGER DEFAULT 0,
    rejected_quantity INTEGER DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- SALES ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    so_number VARCHAR(30) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    total_amount NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    shipping_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_so_status ON sales_orders(status);
CREATE INDEX idx_so_order_date ON sales_orders(order_date);

CREATE TABLE IF NOT EXISTS sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- WORKFLOW AUTOMATION
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(30) NOT NULL,
    trigger_config JSONB,
    conditions JSONB,
    steps JSONB,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_by VARCHAR(255),
    natural_language_input TEXT,
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_workflow_active ON workflow_definitions(is_active);
CREATE INDEX idx_workflow_trigger_type ON workflow_definitions(trigger_type);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id),
    triggered_by VARCHAR(100),
    trigger_payload JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);
CREATE INDEX idx_we_workflow ON workflow_executions(workflow_definition_id);
CREATE INDEX idx_we_status ON workflow_executions(status);

CREATE TABLE IF NOT EXISTS workflow_execution_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    step_index INTEGER NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50),
    input JSONB,
    output JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workflow_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id),
    step_id UUID REFERENCES workflow_execution_steps(id),
    approver_role VARCHAR(50),
    approved_by VARCHAR(255),
    decision VARCHAR(20),
    comment TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- ─────────────────────────────────────────────
-- AUDIT LOGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_logs(user_email);
CREATE INDEX idx_audit_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ─────────────────────────────────────────────
-- AI CONVERSATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255),
    session_id VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    messages JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_conv_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conv_user ON ai_conversations(user_email);
