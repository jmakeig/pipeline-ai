-- Sales Pipeline Database Schema

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
    label TEXT NOT NULL UNIQUE,
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
