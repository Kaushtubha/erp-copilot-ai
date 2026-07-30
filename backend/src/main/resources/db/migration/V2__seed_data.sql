-- ERP Copilot AI — Seed Data
-- Realistic mock data for development and demo

-- ─────────────────────────────────────────────
-- USERS (passwords are BCrypt hashed for "Pass@123" / "Admin@123")
-- ─────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, full_name, role, department) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@erp.com',      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LfQyON5hqzFRU6WiO', 'Arjun Sharma',      'ADMIN',              'Management'),
    ('00000000-0000-0000-0000-000000000002', 'warehouse@erp.com',  '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGAoMgb4LV4T12CK7m', 'Priya Mehta',       'WAREHOUSE_MANAGER',  'Warehouse'),
    ('00000000-0000-0000-0000-000000000003', 'purchase@erp.com',   '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGAoMgb4LV4T12CK7m', 'Rajesh Kumar',      'PURCHASE_MANAGER',   'Procurement'),
    ('00000000-0000-0000-0000-000000000004', 'sales@erp.com',      '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGAoMgb4LV4T12CK7m', 'Anita Desai',       'SALES_MANAGER',      'Sales'),
    ('00000000-0000-0000-0000-000000000005', 'finance@erp.com',    '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGAoMgb4LV4T12CK7m', 'Vikram Nair',       'FINANCE',            'Finance')
ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────────
-- WAREHOUSES
-- ─────────────────────────────────────────────
INSERT INTO warehouses (id, name, location, city, state, total_capacity, used_capacity, manager_name) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Mumbai Central WH',   'MIDC, Andheri East',      'Mumbai',    'Maharashtra', 50000, 38500, 'Priya Mehta'),
    ('10000000-0000-0000-0000-000000000002', 'Pune Logistics Hub',  'Bhosari Industrial Area', 'Pune',      'Maharashtra', 35000, 21000, 'Suresh Patil'),
    ('10000000-0000-0000-0000-000000000003', 'Bengaluru WH-North',  'Hebbal,  NH-44',           'Bengaluru', 'Karnataka',   45000, 40500, 'Ravi Shetty'),
    ('10000000-0000-0000-0000-000000000004', 'Delhi NCR Depot',     'Noida Sector 62',         'Noida',     'Uttar Pradesh',60000, 31200, 'Anil Gupta')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- VENDORS
-- ─────────────────────────────────────────────
INSERT INTO vendors (id, name, contact_person, email, phone, rating, lead_time_days, on_time_delivery_rate, quality_rejection_rate, risk_level) VALUES
    ('20000000-0000-0000-0000-000000000001', 'TechSupply Co.',       'Mohan Das',    'mohan@techsupply.com',  '9876543210', 4.5, 5,  95.0, 0.5, 'LOW'),
    ('20000000-0000-0000-0000-000000000002', 'Global Parts Ltd.',    'Sarah Chen',   'sarah@globalparts.com', '9876543211', 3.2, 12, 68.0, 8.5, 'HIGH'),
    ('20000000-0000-0000-0000-000000000003', 'QuickShip Vendors',    'Ramesh Iyer',  'ramesh@quickship.com',  '9876543212', 4.8, 3,  98.0, 0.2, 'LOW'),
    ('20000000-0000-0000-0000-000000000004', 'Budget Electronics',   'Fatima Khan',  'fatima@budget-elec.com','9876543213', 2.9, 18, 55.0, 15.0,'CRITICAL'),
    ('20000000-0000-0000-0000-000000000005', 'Premier Components',   'Sunil Bose',   'sunil@premier.com',     '9876543214', 4.1, 8,  88.0, 3.2, 'MEDIUM')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
INSERT INTO products (id, sku, name, category, unit, unit_price, reorder_level, reorder_quantity, brand, auto_reorder) VALUES
    ('30000000-0000-0000-0000-000000000001', 'ELEC-001', 'Arduino Mega 2560',        'Electronics',  'piece', 850.00,   20, 100, 'Arduino',      true),
    ('30000000-0000-0000-0000-000000000002', 'ELEC-002', 'Raspberry Pi 4 (4GB)',     'Electronics',  'piece', 4200.00,  15, 50,  'Raspberry Pi', true),
    ('30000000-0000-0000-0000-000000000003', 'ELEC-003', 'ESP32 Development Board',  'Electronics',  'piece', 320.00,   50, 200, 'Espressif',    true),
    ('30000000-0000-0000-0000-000000000004', 'MECH-001', 'Industrial Servo Motor',   'Mechanical',   'piece', 2800.00,  10, 40,  'Siemens',      false),
    ('30000000-0000-0000-0000-000000000005', 'MECH-002', 'Precision Bearing 6205',   'Mechanical',   'piece', 180.00,   100,500, 'SKF',          true),
    ('30000000-0000-0000-0000-000000000006', 'CHEM-001', 'Isopropyl Alcohol 5L',     'Chemicals',    'litre', 450.00,   30, 150, 'SRL',          false),
    ('30000000-0000-0000-0000-000000000007', 'PACK-001', 'Bubble Wrap Roll 50m',     'Packaging',    'roll',  380.00,   25, 100, 'Generic',      false),
    ('30000000-0000-0000-0000-000000000008', 'ELEC-004', 'LiPo Battery 3.7V 2000mAh','Electronics',  'piece', 220.00,   80, 300, 'Tattu',        true),
    ('30000000-0000-0000-0000-000000000009', 'TOOL-001', 'Digital Multimeter',       'Tools',        'piece', 1200.00,  5,  20,  'Fluke',        false),
    ('30000000-0000-0000-0000-000000000010', 'ELEC-005', 'OLED Display 128x64',      'Electronics',  'piece', 95.00,    100,500, 'Adafruit',     true)
ON CONFLICT (sku) DO NOTHING;

-- ─────────────────────────────────────────────
-- INVENTORY
-- ─────────────────────────────────────────────
INSERT INTO inventory (product_id, warehouse_id, quantity_on_hand, quantity_reserved, last_movement_at, zone, bin_location) VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 85,   10,  NOW() - INTERVAL '2 days',   'A', 'A-101'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 12,   5,   NOW() - INTERVAL '1 day',    'A', 'A-102'),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 220,  50,  NOW() - INTERVAL '3 days',   'B', 'B-201'),
    ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 8,    2,   NOW() - INTERVAL '95 days',  'C', 'C-301'),  -- dead stock!
    ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 450,  100, NOW() - INTERVAL '1 day',    'C', 'C-302'),
    ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 25,   0,   NOW() - INTERVAL '5 days',   'D', 'D-401'),  -- low stock!
    ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 60,   15,  NOW() - INTERVAL '2 days',   'D', 'D-402'),
    ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 280,  80,  NOW() - INTERVAL '1 day',    'A', 'A-103'),
    ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 3,    0,   NOW() - INTERVAL '100 days', 'E', 'E-501'),  -- dead stock, low stock!
    ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 750,  200, NOW() - INTERVAL '4 hours',  'A', 'A-104')
ON CONFLICT (product_id, warehouse_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- PURCHASE ORDERS
-- ─────────────────────────────────────────────
INSERT INTO purchase_orders (id, po_number, vendor_id, status, order_date, expected_delivery_date, total_amount, notes) VALUES
    ('40000000-0000-0000-0000-000000000001', 'PO-2024-001', '20000000-0000-0000-0000-000000000001', 'APPROVED',         CURRENT_DATE - 5,  CURRENT_DATE + 2,  42500.00, 'Urgent reorder for Arduino boards'),
    ('40000000-0000-0000-0000-000000000002', 'PO-2024-002', '20000000-0000-0000-0000-000000000002', 'SENT_TO_VENDOR',   CURRENT_DATE - 10, CURRENT_DATE - 2,  128000.00,'Raspberry Pi batch order'),  -- DELAYED
    ('40000000-0000-0000-0000-000000000003', 'PO-2024-003', '20000000-0000-0000-0000-000000000003', 'RECEIVED',         CURRENT_DATE - 15, CURRENT_DATE - 5,  67200.00, 'ESP32 boards - received'),
    ('40000000-0000-0000-0000-000000000004', 'PO-2024-004', '20000000-0000-0000-0000-000000000004', 'PENDING_APPROVAL', CURRENT_DATE - 1,  CURRENT_DATE + 18, 56000.00, 'Battery order'),
    ('40000000-0000-0000-0000-000000000005', 'PO-2024-005', '20000000-0000-0000-0000-000000000002', 'SENT_TO_VENDOR',   CURRENT_DATE - 20, CURRENT_DATE - 8,  95000.00, 'Servo motors - overdue')   -- DELAYED
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- SALES ORDERS
-- ─────────────────────────────────────────────
INSERT INTO sales_orders (id, so_number, customer_name, customer_email, status, order_date, expected_delivery_date, total_amount) VALUES
    ('50000000-0000-0000-0000-000000000001', 'SO-2024-001', 'Tata Electronics',   'procurement@tata.com',    'DELIVERED',  CURRENT_DATE - 30, CURRENT_DATE - 20, 185000.00),
    ('50000000-0000-0000-0000-000000000002', 'SO-2024-002', 'Infosys Tech Park',  'tech@infosys.com',        'SHIPPED',    CURRENT_DATE - 5,  CURRENT_DATE + 2,  67500.00),
    ('50000000-0000-0000-0000-000000000003', 'SO-2024-003', 'Wipro Robotics',     'robo@wipro.com',          'PROCESSING', CURRENT_DATE - 2,  CURRENT_DATE + 5,  240000.00),
    ('50000000-0000-0000-0000-000000000004', 'SO-2024-004', 'DRDO Research Lab',  'purchase@drdo.gov.in',    'CONFIRMED',  CURRENT_DATE - 1,  CURRENT_DATE + 10, 520000.00),
    ('50000000-0000-0000-0000-000000000005', 'SO-2024-005', 'IIT Bombay',         'stores@iitb.ac.in',       'DRAFT',      CURRENT_DATE,      CURRENT_DATE + 15, 89000.00)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- SAMPLE WORKFLOW DEFINITION
-- ─────────────────────────────────────────────
INSERT INTO workflow_definitions (
    id, name, description, trigger_type, trigger_config, conditions, steps, is_active, created_by, natural_language_input
) VALUES (
    '60000000-0000-0000-0000-000000000001',
    'Auto Reorder on Low Stock',
    'Automatically creates a purchase order when inventory drops below the reorder level',
    'THRESHOLD',
    '{"field": "inventory.quantity_on_hand", "operator": "less_than", "value": "reorder_level", "check_interval_minutes": 60}',
    '{"operator": "AND", "conditions": [{"field": "product.auto_reorder", "operator": "equals", "value": true}, {"field": "inventory.quantity_on_order", "operator": "equals", "value": 0}]}',
    '{"steps": [{"index": 1, "name": "Create Purchase Order", "action": "CREATE_PURCHASE_ORDER", "params": {"quantity": "product.reorder_quantity", "vendor": "product.preferred_vendor"}}, {"index": 2, "name": "Notify Purchase Manager", "action": "SEND_NOTIFICATION", "params": {"role": "PURCHASE_MANAGER", "message": "Auto PO created for low stock: {{product.name}}"}}, {"index": 3, "name": "Log Audit", "action": "AUDIT_LOG", "params": {"message": "Auto-reorder triggered for {{product.sku}}"}}]}',
    TRUE,
    'admin@erp.com',
    'Auto-create a purchase order when inventory falls below reorder level'
) ON CONFLICT DO NOTHING;
