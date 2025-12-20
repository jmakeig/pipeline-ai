-- Sales Pipeline Database Schema

-- Drop existing objects (in dependency order)
DROP VIEW IF EXISTS pipeline CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS workloads CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    customer UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('NORTHAM', 'EMEA', 'JAPAC', 'LATAM')),
    segment TEXT NOT NULL CHECK (segment IN ('Select', 'Enterprise', 'SMB')),
    industry TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workloads (
    workload UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE,
    customer UUID NOT NULL REFERENCES customers(customer) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    event UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer UUID REFERENCES customers(customer) ON DELETE CASCADE,
    workload UUID REFERENCES workloads(workload) ON DELETE CASCADE,
    happened_at TIMESTAMPTZ DEFAULT NOW(),
    outcome TEXT NOT NULL,
    stage INTEGER CHECK (stage IN (1, 2, 3, 4, 5, 90, 91, 92, 99)),
    size NUMERIC(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT event_scope CHECK (
        (customer IS NOT NULL AND workload IS NULL) OR
        (customer IS NULL AND workload IS NOT NULL)
    )
);

-- Indexes for common queries
CREATE INDEX idx_workloads_customer ON workloads(customer);
CREATE INDEX idx_events_customer ON events(customer);
CREATE INDEX idx_events_workload ON events(workload);
CREATE INDEX idx_events_happened_at ON events(happened_at DESC);

-- View: Pipeline with current stage and size derived from events
-- Stage comes from the most recent event with a non-null stage
-- Size comes from the most recent event with a non-null size
CREATE VIEW pipeline AS
SELECT
    w.workload,
    w.label,
    w.customer,
    w.name,
    w.created_at,
    w.updated_at,
    c.name as customer_name,
    c.label as customer_label,
    latest_stage.stage as current_stage,
    latest_size.size as current_size
FROM workloads w
JOIN customers c ON w.customer = c.customer
LEFT JOIN LATERAL (
    SELECT stage
    FROM events
    WHERE workload = w.workload AND stage IS NOT NULL
    ORDER BY happened_at DESC
    LIMIT 1
) latest_stage ON true
LEFT JOIN LATERAL (
    SELECT size
    FROM events
    WHERE workload = w.workload AND size IS NOT NULL
    ORDER BY happened_at DESC
    LIMIT 1
) latest_size ON true;
