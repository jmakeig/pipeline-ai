-- Seed data for Pipeline AI
-- Run with: npm run db:seed

-- Clear existing data
TRUNCATE events, workloads, customers RESTART IDENTITY CASCADE;

-- Customers (10)
INSERT INTO customers (customer, label, name, region, segment, industry) VALUES
('c0000001-0000-0000-0000-000000000001', 'acme-corp', 'Acme Corporation', 'NORTHAM', 'Enterprise', 'Manufacturing'),
('c0000001-0000-0000-0000-000000000002', 'globex', 'Globex Industries', 'NORTHAM', 'Enterprise', 'Technology'),
('c0000001-0000-0000-0000-000000000003', 'initech', 'Initech Solutions', 'NORTHAM', 'SMB', 'Financial Services'),
('c0000001-0000-0000-0000-000000000004', 'umbrella', 'Umbrella Research', 'EMEA', 'Enterprise', 'Healthcare'),
('c0000001-0000-0000-0000-000000000005', 'stark-ind', 'Stark Industries', 'NORTHAM', 'Select', 'Aerospace'),
('c0000001-0000-0000-0000-000000000006', 'wayne-ent', 'Wayne Enterprises', 'NORTHAM', 'Select', 'Conglomerate'),
('c0000001-0000-0000-0000-000000000007', 'oscorp', 'Oscorp Technologies', 'EMEA', 'Enterprise', 'Biotechnology'),
('c0000001-0000-0000-0000-000000000008', 'massive-dyn', 'Massive Dynamic', 'JAPAC', 'Enterprise', 'Technology'),
('c0000001-0000-0000-0000-000000000009', 'cyberdyne', 'Cyberdyne Systems', 'JAPAC', 'SMB', 'Robotics'),
('c0000001-0000-0000-0000-000000000010', 'soylent', 'Soylent Corp', 'LATAM', 'SMB', 'Food & Beverage');

-- Workloads (20, spread across customers)
INSERT INTO workloads (workload, label, customer, name) VALUES
-- Acme Corp (2 workloads)
('w0000001-0000-0000-0000-000000000001', 'acme-erp-migration', 'c0000001-0000-0000-0000-000000000001', 'ERP Migration'),
('w0000001-0000-0000-0000-000000000002', 'acme-data-warehouse', 'c0000001-0000-0000-0000-000000000001', 'Data Warehouse'),
-- Globex (3 workloads)
('w0000001-0000-0000-0000-000000000003', 'globex-ml-platform', 'c0000001-0000-0000-0000-000000000002', 'ML Platform'),
('w0000001-0000-0000-0000-000000000004', 'globex-api-gateway', 'c0000001-0000-0000-0000-000000000002', 'API Gateway'),
('w0000001-0000-0000-0000-000000000005', 'globex-mobile-app', 'c0000001-0000-0000-0000-000000000002', 'Mobile App Backend'),
-- Initech (2 workloads)
('w0000001-0000-0000-0000-000000000006', 'initech-trading', 'c0000001-0000-0000-0000-000000000003', 'Trading Platform'),
('w0000001-0000-0000-0000-000000000007', 'initech-compliance', 'c0000001-0000-0000-0000-000000000003', 'Compliance System'),
-- Umbrella (2 workloads)
('w0000001-0000-0000-0000-000000000008', 'umbrella-clinical', 'c0000001-0000-0000-0000-000000000004', 'Clinical Trials DB'),
('w0000001-0000-0000-0000-000000000009', 'umbrella-research', 'c0000001-0000-0000-0000-000000000004', 'Research Portal'),
-- Stark Industries (2 workloads)
('w0000001-0000-0000-0000-000000000010', 'stark-supply-chain', 'c0000001-0000-0000-0000-000000000005', 'Supply Chain'),
('w0000001-0000-0000-0000-000000000011', 'stark-arc-reactor', 'c0000001-0000-0000-0000-000000000005', 'Arc Reactor Monitoring'),
-- Wayne Enterprises (2 workloads)
('w0000001-0000-0000-0000-000000000012', 'wayne-security', 'c0000001-0000-0000-0000-000000000006', 'Security Operations'),
('w0000001-0000-0000-0000-000000000013', 'wayne-foundation', 'c0000001-0000-0000-0000-000000000006', 'Foundation CRM'),
-- Oscorp (2 workloads)
('w0000001-0000-0000-0000-000000000014', 'oscorp-genetics', 'c0000001-0000-0000-0000-000000000007', 'Genetics Lab System'),
('w0000001-0000-0000-0000-000000000015', 'oscorp-inventory', 'c0000001-0000-0000-0000-000000000007', 'Inventory Management'),
-- Massive Dynamic (2 workloads)
('w0000001-0000-0000-0000-000000000016', 'massive-quantum', 'c0000001-0000-0000-0000-000000000008', 'Quantum Computing'),
('w0000001-0000-0000-0000-000000000017', 'massive-analytics', 'c0000001-0000-0000-0000-000000000008', 'Analytics Platform'),
-- Cyberdyne (2 workloads)
('w0000001-0000-0000-0000-000000000018', 'cyberdyne-skynet', 'c0000001-0000-0000-0000-000000000009', 'Neural Net Processor'),
('w0000001-0000-0000-0000-000000000019', 'cyberdyne-hk', 'c0000001-0000-0000-0000-000000000009', 'Hunter-Killer Drone'),
-- Soylent (1 workload)
('w0000001-0000-0000-0000-000000000020', 'soylent-production', 'c0000001-0000-0000-0000-000000000010', 'Production Tracking');

-- Events (100)
-- Mix of customer-level and workload-level events across various stages
INSERT INTO events (event, label, customer, workload, happened_at, outcome, stage, size) VALUES
-- Acme Corp customer-level events
('e0000001-0000-0000-0000-000000000001', 'acme-initial-call', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '180 days', 'Initial discovery call with CTO. Interested in cloud migration.', 1, NULL),
('e0000001-0000-0000-0000-000000000002', 'acme-exec-meeting', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '150 days', 'Executive briefing went well. Budget approved for exploration.', 1, NULL),

-- Acme ERP Migration events
('e0000001-0000-0000-0000-000000000003', 'acme-erp-kickoff', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '140 days', 'Kicked off ERP migration project. Initial sizing complete.', 1, 450000),
('e0000001-0000-0000-0000-000000000004', 'acme-erp-poc-start', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '120 days', 'Started POC with sample data migration. Team engaged.', 2, 450000),
('e0000001-0000-0000-0000-000000000005', 'acme-erp-poc-complete', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '90 days', 'POC successful. Performance exceeded expectations.', 2, 500000),
('e0000001-0000-0000-0000-000000000006', 'acme-erp-proposal', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '60 days', 'Submitted final proposal. Awaiting procurement review.', 3, 520000),
('e0000001-0000-0000-0000-000000000007', 'acme-erp-negotiation', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days', 'Contract negotiation in progress. Legal reviewing terms.', 3, 520000),
('e0000001-0000-0000-0000-000000000008', 'acme-erp-signed', NULL, 'w0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days', 'Contract signed! Implementation starting next month.', 4, 520000),

-- Acme Data Warehouse events
('e0000001-0000-0000-0000-000000000009', 'acme-dw-intro', NULL, 'w0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '100 days', 'Introduced data warehouse solution during ERP discussions.', 1, 200000),
('e0000001-0000-0000-0000-000000000010', 'acme-dw-requirements', NULL, 'w0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '80 days', 'Gathered requirements. Need real-time analytics.', 1, 250000),
('e0000001-0000-0000-0000-000000000011', 'acme-dw-poc', NULL, 'w0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '50 days', 'POC underway. Testing with production data samples.', 2, 280000),

-- Globex customer-level events
('e0000001-0000-0000-0000-000000000012', 'globex-intro', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '200 days', 'Referral from Acme. Initial meeting with VP Engineering.', 1, NULL),
('e0000001-0000-0000-0000-000000000013', 'globex-workshop', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '180 days', 'Technical workshop with engineering team. Strong interest.', 1, NULL),

-- Globex ML Platform events
('e0000001-0000-0000-0000-000000000014', 'globex-ml-discovery', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '170 days', 'ML platform needs identified. GPU requirements significant.', 1, 800000),
('e0000001-0000-0000-0000-000000000015', 'globex-ml-arch', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '150 days', 'Architecture review complete. Hybrid approach recommended.', 2, 850000),
('e0000001-0000-0000-0000-000000000016', 'globex-ml-poc', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '120 days', 'POC running. Training times 40% faster than current setup.', 2, 900000),
('e0000001-0000-0000-0000-000000000017', 'globex-ml-expand', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '90 days', 'Expanding POC scope. Adding inference workloads.', 2, 1200000),
('e0000001-0000-0000-0000-000000000018', 'globex-ml-decision', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '45 days', 'Technical decision made. Moving to commercial discussions.', 3, 1200000),
('e0000001-0000-0000-0000-000000000019', 'globex-ml-contract', NULL, 'w0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '20 days', 'Contract review in progress. Expected close this quarter.', 3, 1150000),

-- Globex API Gateway events
('e0000001-0000-0000-0000-000000000020', 'globex-api-intro', NULL, 'w0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '130 days', 'Upsell opportunity during ML discussions. Need API management.', 1, 150000),
('e0000001-0000-0000-0000-000000000021', 'globex-api-eval', NULL, 'w0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '100 days', 'Evaluation started. Comparing against existing solution.', 2, 150000),
('e0000001-0000-0000-0000-000000000022', 'globex-api-stalled', NULL, 'w0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '60 days', 'Project on hold. Team focused on ML platform first.', 90, 150000),

-- Globex Mobile App events
('e0000001-0000-0000-0000-000000000023', 'globex-mobile-start', NULL, 'w0000001-0000-0000-0000-000000000005', NOW() - INTERVAL '80 days', 'New mobile initiative. Need scalable backend.', 1, 300000),
('e0000001-0000-0000-0000-000000000024', 'globex-mobile-design', NULL, 'w0000001-0000-0000-0000-000000000005', NOW() - INTERVAL '50 days', 'Architecture design sessions complete.', 1, 350000),

-- Initech customer-level events
('e0000001-0000-0000-0000-000000000025', 'initech-cold-call', 'c0000001-0000-0000-0000-000000000003', NULL, NOW() - INTERVAL '160 days', 'Cold outreach successful. CFO interested in cost reduction.', 1, NULL),

-- Initech Trading Platform events
('e0000001-0000-0000-0000-000000000026', 'initech-trade-discover', NULL, 'w0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '150 days', 'Trading platform modernization needed. Latency critical.', 1, 600000),
('e0000001-0000-0000-0000-000000000027', 'initech-trade-poc', NULL, 'w0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '120 days', 'POC started. Testing low-latency requirements.', 2, 650000),
('e0000001-0000-0000-0000-000000000028', 'initech-trade-fail', NULL, 'w0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '90 days', 'POC did not meet latency requirements. Lost to competitor.', 92, 650000),

-- Initech Compliance events
('e0000001-0000-0000-0000-000000000029', 'initech-comply-start', NULL, 'w0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '100 days', 'Compliance system needed for new regulations.', 1, 180000),
('e0000001-0000-0000-0000-000000000030', 'initech-comply-eval', NULL, 'w0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '70 days', 'Evaluation underway. Good fit for requirements.', 2, 200000),
('e0000001-0000-0000-0000-000000000031', 'initech-comply-decide', NULL, 'w0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '40 days', 'Decision pending. Budget cycle alignment needed.', 3, 200000),

-- Umbrella customer-level events
('e0000001-0000-0000-0000-000000000032', 'umbrella-intro', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '220 days', 'Healthcare conference lead. HIPAA compliance key concern.', 1, NULL),
('e0000001-0000-0000-0000-000000000033', 'umbrella-security', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '200 days', 'Security review complete. Approved vendor status.', 1, NULL),

-- Umbrella Clinical Trials events
('e0000001-0000-0000-0000-000000000034', 'umbrella-clinical-req', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '190 days', 'Clinical trials database requirements gathered.', 1, 400000),
('e0000001-0000-0000-0000-000000000035', 'umbrella-clinical-poc', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '160 days', 'POC with anonymized data. HIPAA controls validated.', 2, 450000),
('e0000001-0000-0000-0000-000000000036', 'umbrella-clinical-expand', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '130 days', 'Expanding scope to include EU operations. GDPR needed.', 2, 550000),
('e0000001-0000-0000-0000-000000000037', 'umbrella-clinical-final', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '100 days', 'Final proposal submitted. Multi-region deployment.', 3, 600000),
('e0000001-0000-0000-0000-000000000038', 'umbrella-clinical-impl', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '60 days', 'Contract signed. Implementation phase started.', 4, 620000),
('e0000001-0000-0000-0000-000000000039', 'umbrella-clinical-live', NULL, 'w0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '10 days', 'Phase 1 go-live successful. Expanding to more trials.', 5, 620000),

-- Umbrella Research Portal events
('e0000001-0000-0000-0000-000000000040', 'umbrella-research-idea', NULL, 'w0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '80 days', 'Research portal identified as follow-on opportunity.', 1, 200000),
('e0000001-0000-0000-0000-000000000041', 'umbrella-research-scope', NULL, 'w0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '50 days', 'Scoping sessions complete. Integration with clinical DB.', 1, 250000),

-- Stark Industries customer-level events
('e0000001-0000-0000-0000-000000000042', 'stark-exec-intro', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '240 days', 'Executive introduction via board connection.', 1, NULL),
('e0000001-0000-0000-0000-000000000043', 'stark-nda', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '230 days', 'NDA signed. Cleared for classified project discussions.', 1, NULL),

-- Stark Supply Chain events
('e0000001-0000-0000-0000-000000000044', 'stark-supply-req', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '220 days', 'Supply chain visibility project. Global scope.', 1, 1500000),
('e0000001-0000-0000-0000-000000000045', 'stark-supply-poc', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '180 days', 'POC with non-classified suppliers. Strong results.', 2, 1500000),
('e0000001-0000-0000-0000-000000000046', 'stark-supply-expand', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '140 days', 'Expanding to classified tier. Security clearance obtained.', 2, 1800000),
('e0000001-0000-0000-0000-000000000047', 'stark-supply-decide', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '100 days', 'Technical evaluation complete. Commercial phase.', 3, 2000000),
('e0000001-0000-0000-0000-000000000048', 'stark-supply-contract', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '50 days', 'Contract negotiations. Government compliance review.', 3, 2000000),
('e0000001-0000-0000-0000-000000000049', 'stark-supply-signed', NULL, 'w0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '25 days', 'Contract signed. Largest deal this quarter!', 4, 2100000),

-- Stark Arc Reactor events
('e0000001-0000-0000-0000-000000000050', 'stark-arc-discuss', NULL, 'w0000001-0000-0000-0000-000000000011', NOW() - INTERVAL '60 days', 'Monitoring system for new energy project. Highly classified.', 1, 500000),
('e0000001-0000-0000-0000-000000000051', 'stark-arc-clear', NULL, 'w0000001-0000-0000-0000-000000000011', NOW() - INTERVAL '30 days', 'Additional clearances obtained. Deep technical dive next.', 1, 750000),

-- Wayne Enterprises customer-level events
('e0000001-0000-0000-0000-000000000052', 'wayne-gala', 'c0000001-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '200 days', 'Met at charity gala. Scheduled follow-up meeting.', 1, NULL),

-- Wayne Security Operations events
('e0000001-0000-0000-0000-000000000053', 'wayne-sec-req', NULL, 'w0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '180 days', 'Enterprise security operations center modernization.', 1, 900000),
('e0000001-0000-0000-0000-000000000054', 'wayne-sec-poc', NULL, 'w0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '150 days', 'POC with existing SIEM integration.', 2, 950000),
('e0000001-0000-0000-0000-000000000055', 'wayne-sec-review', NULL, 'w0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '120 days', 'Security architecture review. Additional requirements.', 2, 1100000),
('e0000001-0000-0000-0000-000000000056', 'wayne-sec-decide', NULL, 'w0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '80 days', 'Vendor selection committee approved. Final negotiations.', 3, 1100000),
('e0000001-0000-0000-0000-000000000057', 'wayne-sec-delay', NULL, 'w0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '40 days', 'Project delayed. Internal restructuring at Wayne.', 3, 1100000),

-- Wayne Foundation CRM events
('e0000001-0000-0000-0000-000000000058', 'wayne-crm-intro', NULL, 'w0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '100 days', 'Foundation needs donor management system.', 1, 120000),
('e0000001-0000-0000-0000-000000000059', 'wayne-crm-demo', NULL, 'w0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '70 days', 'Demo completed. Good fit for nonprofit requirements.', 2, 150000),
('e0000001-0000-0000-0000-000000000060', 'wayne-crm-closed', NULL, 'w0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '30 days', 'Deal closed. Implementation starting Q1.', 99, 150000),

-- Oscorp customer-level events
('e0000001-0000-0000-0000-000000000061', 'oscorp-referral', 'c0000001-0000-0000-0000-000000000007', NULL, NOW() - INTERVAL '170 days', 'Referral from industry analyst. Biotech focus.', 1, NULL),

-- Oscorp Genetics Lab events
('e0000001-0000-0000-0000-000000000062', 'oscorp-gen-req', NULL, 'w0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '160 days', 'Genetics lab compute requirements. Heavy simulation.', 1, 700000),
('e0000001-0000-0000-0000-000000000063', 'oscorp-gen-poc', NULL, 'w0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '130 days', 'POC with gene sequencing workloads.', 2, 750000),
('e0000001-0000-0000-0000-000000000064', 'oscorp-gen-results', NULL, 'w0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '100 days', 'POC results excellent. 60% cost reduction.', 2, 800000),
('e0000001-0000-0000-0000-000000000065', 'oscorp-gen-budget', NULL, 'w0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '70 days', 'Budget approval process. Q2 target.', 3, 850000),
('e0000001-0000-0000-0000-000000000066', 'oscorp-gen-approved', NULL, 'w0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '35 days', 'Budget approved. Contract finalization in progress.', 3, 850000),

-- Oscorp Inventory events
('e0000001-0000-0000-0000-000000000067', 'oscorp-inv-discuss', NULL, 'w0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '90 days', 'Lab inventory tracking needs identified.', 1, 100000),
('e0000001-0000-0000-0000-000000000068', 'oscorp-inv-eval', NULL, 'w0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '60 days', 'Evaluation with sample data.', 2, 120000),

-- Massive Dynamic customer-level events
('e0000001-0000-0000-0000-000000000069', 'massive-conf', 'c0000001-0000-0000-0000-000000000008', NULL, NOW() - INTERVAL '190 days', 'Tech conference meeting. Interest in quantum computing.', 1, NULL),

-- Massive Dynamic Quantum Computing events
('e0000001-0000-0000-0000-000000000070', 'massive-quantum-req', NULL, 'w0000001-0000-0000-0000-000000000016', NOW() - INTERVAL '180 days', 'Quantum computing infrastructure exploration.', 1, 2000000),
('e0000001-0000-0000-0000-000000000071', 'massive-quantum-pilot', NULL, 'w0000001-0000-0000-0000-000000000016', NOW() - INTERVAL '150 days', 'Pilot program started. Limited quantum access.', 2, 2000000),
('e0000001-0000-0000-0000-000000000072', 'massive-quantum-expand', NULL, 'w0000001-0000-0000-0000-000000000016', NOW() - INTERVAL '110 days', 'Expanding pilot. Good early results.', 2, 2500000),
('e0000001-0000-0000-0000-000000000073', 'massive-quantum-decide', NULL, 'w0000001-0000-0000-0000-000000000016', NOW() - INTERVAL '70 days', 'Business case approved. Moving to contract.', 3, 2500000),
('e0000001-0000-0000-0000-000000000074', 'massive-quantum-final', NULL, 'w0000001-0000-0000-0000-000000000016', NOW() - INTERVAL '20 days', 'Final contract review. Expected close next week.', 3, 2400000),

-- Massive Dynamic Analytics events
('e0000001-0000-0000-0000-000000000075', 'massive-analytics-intro', NULL, 'w0000001-0000-0000-0000-000000000017', NOW() - INTERVAL '120 days', 'Analytics platform for research data.', 1, 400000),
('e0000001-0000-0000-0000-000000000076', 'massive-analytics-poc', NULL, 'w0000001-0000-0000-0000-000000000017', NOW() - INTERVAL '80 days', 'POC with historical research data.', 2, 450000),
('e0000001-0000-0000-0000-000000000077', 'massive-analytics-stall', NULL, 'w0000001-0000-0000-0000-000000000017', NOW() - INTERVAL '30 days', 'Project deprioritized. Focus on quantum deal first.', 90, 450000),

-- Cyberdyne customer-level events
('e0000001-0000-0000-0000-000000000078', 'cyberdyne-outreach', 'c0000001-0000-0000-0000-000000000009', NULL, NOW() - INTERVAL '140 days', 'Outbound prospecting. AI/robotics startup.', 1, NULL),

-- Cyberdyne Neural Net events
('e0000001-0000-0000-0000-000000000079', 'cyberdyne-nn-req', NULL, 'w0000001-0000-0000-0000-000000000018', NOW() - INTERVAL '130 days', 'Neural net training infrastructure needs.', 1, 350000),
('e0000001-0000-0000-0000-000000000080', 'cyberdyne-nn-poc', NULL, 'w0000001-0000-0000-0000-000000000018', NOW() - INTERVAL '100 days', 'POC with training workloads.', 2, 400000),
('e0000001-0000-0000-0000-000000000081', 'cyberdyne-nn-concern', NULL, 'w0000001-0000-0000-0000-000000000018', NOW() - INTERVAL '70 days', 'Some concerns about AI ethics review.', 2, 400000),
('e0000001-0000-0000-0000-000000000082', 'cyberdyne-nn-disq', NULL, 'w0000001-0000-0000-0000-000000000018', NOW() - INTERVAL '45 days', 'Deal disqualified. Ethics committee concerns.', 91, 400000),

-- Cyberdyne HK Drone events
('e0000001-0000-0000-0000-000000000083', 'cyberdyne-hk-req', NULL, 'w0000001-0000-0000-0000-000000000019', NOW() - INTERVAL '110 days', 'Autonomous drone project compute needs.', 1, 250000),
('e0000001-0000-0000-0000-000000000084', 'cyberdyne-hk-review', NULL, 'w0000001-0000-0000-0000-000000000019', NOW() - INTERVAL '80 days', 'Under legal review for military applications.', 1, 250000),
('e0000001-0000-0000-0000-000000000085', 'cyberdyne-hk-disq', NULL, 'w0000001-0000-0000-0000-000000000019', NOW() - INTERVAL '50 days', 'Disqualified due to defense regulations.', 91, 250000),

-- Soylent customer-level events
('e0000001-0000-0000-0000-000000000086', 'soylent-intro', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '160 days', 'Food tech startup. Interesting production needs.', 1, NULL),
('e0000001-0000-0000-0000-000000000087', 'soylent-meeting', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '140 days', 'On-site meeting at production facility.', 1, NULL),

-- Soylent Production Tracking events
('e0000001-0000-0000-0000-000000000088', 'soylent-prod-req', NULL, 'w0000001-0000-0000-0000-000000000020', NOW() - INTERVAL '130 days', 'Production tracking system requirements.', 1, 80000),
('e0000001-0000-0000-0000-000000000089', 'soylent-prod-demo', NULL, 'w0000001-0000-0000-0000-000000000020', NOW() - INTERVAL '100 days', 'Product demo. Good reception.', 2, 100000),
('e0000001-0000-0000-0000-000000000090', 'soylent-prod-trial', NULL, 'w0000001-0000-0000-0000-000000000020', NOW() - INTERVAL '70 days', 'Trial period started. One production line.', 2, 100000),
('e0000001-0000-0000-0000-000000000091', 'soylent-prod-expand', NULL, 'w0000001-0000-0000-0000-000000000020', NOW() - INTERVAL '40 days', 'Expanding trial to all lines.', 2, 150000),
('e0000001-0000-0000-0000-000000000092', 'soylent-prod-decide', NULL, 'w0000001-0000-0000-0000-000000000020', NOW() - INTERVAL '15 days', 'Purchase decision pending. Budget review.', 3, 150000),

-- Additional customer-level events to reach 100
('e0000001-0000-0000-0000-000000000093', 'acme-quarterly', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '45 days', 'Quarterly business review. Expansion opportunities.', NULL, NULL),
('e0000001-0000-0000-0000-000000000094', 'globex-strategy', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '30 days', 'Strategy session with new CIO. Positive outlook.', NULL, NULL),
('e0000001-0000-0000-0000-000000000095', 'umbrella-review', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '25 days', 'Annual vendor review. Excellent feedback.', NULL, NULL),
('e0000001-0000-0000-0000-000000000096', 'stark-exec-update', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '20 days', 'Executive update meeting. New projects coming.', NULL, NULL),
('e0000001-0000-0000-0000-000000000097', 'wayne-check-in', 'c0000001-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '15 days', 'Check-in on delayed security project. Resuming soon.', NULL, NULL),
('e0000001-0000-0000-0000-000000000098', 'oscorp-expansion', 'c0000001-0000-0000-0000-000000000007', NULL, NOW() - INTERVAL '12 days', 'Discussing expansion to European labs.', NULL, NULL),
('e0000001-0000-0000-0000-000000000099', 'massive-partner', 'c0000001-0000-0000-0000-000000000008', NULL, NOW() - INTERVAL '8 days', 'Partnership discussion for joint research.', NULL, NULL),
('e0000001-0000-0000-0000-000000000100', 'soylent-green', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '5 days', 'New product line discussion. Increased capacity needs.', NULL, NULL);
