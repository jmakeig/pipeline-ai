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

-- Workloads (15 total, varied distribution)
-- Distribution: Globex (4), Stark (4), Acme (2), Initech (1), Umbrella (1), Wayne (1), Oscorp (1), Massive (1)
-- Zero workloads: Cyberdyne, Soylent (early stage customers)
INSERT INTO workloads (workload, label, customer, name) VALUES
-- Acme Corp (2 workloads)
('d0000001-0000-0000-0000-000000000001', 'acme-erp-cloud-migration', 'c0000001-0000-0000-0000-000000000001', 'ERP Cloud Migration Initiative'),
('d0000001-0000-0000-0000-000000000002', 'acme-predictive-analytics', 'c0000001-0000-0000-0000-000000000001', 'Predictive Analytics Platform'),
-- Globex (4 workloads - large tech company with many initiatives)
('d0000001-0000-0000-0000-000000000003', 'globex-ml-infrastructure', 'c0000001-0000-0000-0000-000000000002', 'AI/ML Infrastructure Modernization'),
('d0000001-0000-0000-0000-000000000004', 'globex-customer-360', 'c0000001-0000-0000-0000-000000000002', 'Customer 360 Data Platform'),
('d0000001-0000-0000-0000-000000000005', 'globex-api-consolidation', 'c0000001-0000-0000-0000-000000000002', 'API Gateway Consolidation'),
('d0000001-0000-0000-0000-000000000006', 'globex-mobile-experience', 'c0000001-0000-0000-0000-000000000002', 'Mobile Experience Redesign'),
-- Initech (1 workload)
('d0000001-0000-0000-0000-000000000007', 'initech-compliance-automation', 'c0000001-0000-0000-0000-000000000003', 'Regulatory Compliance Automation'),
-- Umbrella (1 workload)
('d0000001-0000-0000-0000-000000000008', 'umbrella-clinical-data', 'c0000001-0000-0000-0000-000000000004', 'Clinical Trials Data Platform'),
-- Stark Industries (4 workloads - Select tier with major transformation)
('d0000001-0000-0000-0000-000000000009', 'stark-supply-visibility', 'c0000001-0000-0000-0000-000000000005', 'Global Supply Chain Visibility'),
('d0000001-0000-0000-0000-000000000010', 'stark-smart-factory', 'c0000001-0000-0000-0000-000000000005', 'Smart Factory Initiative'),
('d0000001-0000-0000-0000-000000000011', 'stark-predictive-maintenance', 'c0000001-0000-0000-0000-000000000005', 'Predictive Maintenance Program'),
('d0000001-0000-0000-0000-000000000012', 'stark-digital-twin', 'c0000001-0000-0000-0000-000000000005', 'Digital Twin Platform'),
-- Wayne Enterprises (1 workload)
('d0000001-0000-0000-0000-000000000013', 'wayne-soc-modernization', 'c0000001-0000-0000-0000-000000000006', 'Security Operations Modernization'),
-- Oscorp (1 workload)
('d0000001-0000-0000-0000-000000000014', 'oscorp-genomics-platform', 'c0000001-0000-0000-0000-000000000007', 'Genomics Research Platform'),
-- Massive Dynamic (1 workload)
('d0000001-0000-0000-0000-000000000015', 'massive-quantum-lab', 'c0000001-0000-0000-0000-000000000008', 'Quantum Computing Research Lab');

-- Events (90)
-- Mix of customer-level and workload-level events across various stages
INSERT INTO events (event, label, customer, workload, happened_at, outcome, stage, size) VALUES
-- Acme Corp customer-level events
('e0000001-0000-0000-0000-000000000001', 'acme-initial-call', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '180 days', 'Initial discovery call with CTO. Interested in cloud migration.', 1, NULL),
('e0000001-0000-0000-0000-000000000002', 'acme-exec-meeting', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '150 days', 'Executive briefing went well. Budget approved for exploration.', 1, NULL),

-- Acme ERP Cloud Migration events (w001)
('e0000001-0000-0000-0000-000000000003', 'acme-erp-kickoff', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '140 days', 'Kicked off ERP cloud migration initiative. Initial sizing complete.', 1, 450000),
('e0000001-0000-0000-0000-000000000004', 'acme-erp-poc-start', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '120 days', 'Started POC with sample data migration. Team engaged.', 2, 450000),
('e0000001-0000-0000-0000-000000000005', 'acme-erp-poc-complete', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '90 days', 'POC successful. Performance exceeded expectations.', 2, 500000),
('e0000001-0000-0000-0000-000000000006', 'acme-erp-proposal', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '60 days', 'Submitted final proposal. Awaiting procurement review.', 3, 520000),
('e0000001-0000-0000-0000-000000000007', 'acme-erp-negotiation', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days', 'Contract negotiation in progress. Legal reviewing terms.', 3, 520000),
('e0000001-0000-0000-0000-000000000008', 'acme-erp-signed', NULL, 'd0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days', 'Contract signed! Implementation starting next month.', 4, 520000),

-- Acme Predictive Analytics Platform events (w002)
('e0000001-0000-0000-0000-000000000009', 'acme-analytics-intro', NULL, 'd0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '100 days', 'Introduced predictive analytics during ERP discussions.', 1, 200000),
('e0000001-0000-0000-0000-000000000010', 'acme-analytics-requirements', NULL, 'd0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '80 days', 'Gathered requirements. Need real-time demand forecasting.', 1, 250000),
('e0000001-0000-0000-0000-000000000011', 'acme-analytics-poc', NULL, 'd0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '50 days', 'POC underway. Testing with production data samples.', 2, 280000),

-- Globex customer-level events
('e0000001-0000-0000-0000-000000000012', 'globex-intro', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '200 days', 'Referral from Acme. Initial meeting with VP Engineering.', 1, NULL),
('e0000001-0000-0000-0000-000000000013', 'globex-workshop', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '180 days', 'Technical workshop with engineering team. Strong interest.', 1, NULL),

-- Globex AI/ML Infrastructure events (w003)
('e0000001-0000-0000-0000-000000000014', 'globex-ml-discovery', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '170 days', 'ML infrastructure needs identified. GPU requirements significant.', 1, 800000),
('e0000001-0000-0000-0000-000000000015', 'globex-ml-arch', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '150 days', 'Architecture review complete. Hybrid approach recommended.', 2, 850000),
('e0000001-0000-0000-0000-000000000016', 'globex-ml-poc', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '120 days', 'POC running. Training times 40% faster than current setup.', 2, 900000),
('e0000001-0000-0000-0000-000000000017', 'globex-ml-expand', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '90 days', 'Expanding POC scope. Adding inference workloads.', 2, 1200000),
('e0000001-0000-0000-0000-000000000018', 'globex-ml-decision', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '45 days', 'Technical decision made. Moving to commercial discussions.', 3, 1200000),
('e0000001-0000-0000-0000-000000000019', 'globex-ml-contract', NULL, 'd0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '20 days', 'Contract review in progress. Expected close this quarter.', 3, 1150000),

-- Globex Customer 360 Platform events (w004)
('e0000001-0000-0000-0000-000000000020', 'globex-c360-intro', NULL, 'd0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '130 days', 'Customer data unification initiative identified during ML discussions.', 1, 350000),
('e0000001-0000-0000-0000-000000000021', 'globex-c360-eval', NULL, 'd0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '100 days', 'Evaluation started. Multiple data sources to consolidate.', 2, 400000),
('e0000001-0000-0000-0000-000000000022', 'globex-c360-progress', NULL, 'd0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '60 days', 'POC showing promising results. Customer insights improved.', 2, 420000),

-- Globex API Consolidation events (w005)
('e0000001-0000-0000-0000-000000000023', 'globex-api-start', NULL, 'd0000001-0000-0000-0000-000000000005', NOW() - INTERVAL '80 days', 'API gateway consolidation project. Microservices transformation.', 1, 150000),
('e0000001-0000-0000-0000-000000000024', 'globex-api-stalled', NULL, 'd0000001-0000-0000-0000-000000000005', NOW() - INTERVAL '50 days', 'Project on hold. Team focused on ML platform first.', 90, 150000),

-- Globex Mobile Experience events (w006)
('e0000001-0000-0000-0000-000000000025', 'globex-mobile-start', NULL, 'd0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '70 days', 'Mobile experience redesign initiative. Consumer app backend.', 1, 300000),
('e0000001-0000-0000-0000-000000000026', 'globex-mobile-design', NULL, 'd0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '40 days', 'Architecture design sessions complete. Scalability focus.', 1, 350000),

-- Initech customer-level events
('e0000001-0000-0000-0000-000000000027', 'initech-cold-call', 'c0000001-0000-0000-0000-000000000003', NULL, NOW() - INTERVAL '160 days', 'Cold outreach successful. CFO interested in cost reduction.', 1, NULL),

-- Initech Regulatory Compliance Automation events (w007)
('e0000001-0000-0000-0000-000000000028', 'initech-comply-start', NULL, 'd0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '100 days', 'Compliance automation needed for new SEC regulations.', 1, 180000),
('e0000001-0000-0000-0000-000000000029', 'initech-comply-eval', NULL, 'd0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '70 days', 'Evaluation underway. Good fit for requirements.', 2, 200000),
('e0000001-0000-0000-0000-000000000030', 'initech-comply-decide', NULL, 'd0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '40 days', 'Decision pending. Budget cycle alignment needed.', 3, 200000),

-- Umbrella customer-level events
('e0000001-0000-0000-0000-000000000031', 'umbrella-intro', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '220 days', 'Healthcare conference lead. HIPAA compliance key concern.', 1, NULL),
('e0000001-0000-0000-0000-000000000032', 'umbrella-security', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '200 days', 'Security review complete. Approved vendor status.', 1, NULL),

-- Umbrella Clinical Trials Data Platform events (w008)
('e0000001-0000-0000-0000-000000000033', 'umbrella-clinical-req', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '190 days', 'Clinical trials data platform requirements gathered.', 1, 400000),
('e0000001-0000-0000-0000-000000000034', 'umbrella-clinical-poc', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '160 days', 'POC with anonymized data. HIPAA controls validated.', 2, 450000),
('e0000001-0000-0000-0000-000000000035', 'umbrella-clinical-expand', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '130 days', 'Expanding scope to include EU operations. GDPR needed.', 2, 550000),
('e0000001-0000-0000-0000-000000000036', 'umbrella-clinical-final', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '100 days', 'Final proposal submitted. Multi-region deployment.', 3, 600000),
('e0000001-0000-0000-0000-000000000037', 'umbrella-clinical-impl', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '60 days', 'Contract signed. Implementation phase started.', 4, 620000),
('e0000001-0000-0000-0000-000000000038', 'umbrella-clinical-live', NULL, 'd0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '10 days', 'Phase 1 go-live successful. Expanding to more trials.', 5, 620000),

-- Stark Industries customer-level events
('e0000001-0000-0000-0000-000000000039', 'stark-exec-intro', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '240 days', 'Executive introduction via board connection.', 1, NULL),
('e0000001-0000-0000-0000-000000000040', 'stark-nda', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '230 days', 'NDA signed. Cleared for classified project discussions.', 1, NULL),

-- Stark Global Supply Chain Visibility events (w009)
('e0000001-0000-0000-0000-000000000041', 'stark-supply-req', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '220 days', 'Supply chain visibility project. Global scope across 40 countries.', 1, 1500000),
('e0000001-0000-0000-0000-000000000042', 'stark-supply-poc', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '180 days', 'POC with non-classified suppliers. Strong results.', 2, 1500000),
('e0000001-0000-0000-0000-000000000043', 'stark-supply-expand', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '140 days', 'Expanding to classified tier. Security clearance obtained.', 2, 1800000),
('e0000001-0000-0000-0000-000000000044', 'stark-supply-decide', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '100 days', 'Technical evaluation complete. Commercial phase.', 3, 2000000),
('e0000001-0000-0000-0000-000000000045', 'stark-supply-contract', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '50 days', 'Contract negotiations. Government compliance review.', 3, 2000000),
('e0000001-0000-0000-0000-000000000046', 'stark-supply-signed', NULL, 'd0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '25 days', 'Contract signed. Largest deal this quarter!', 4, 2100000),

-- Stark Smart Factory Initiative events (w010)
('e0000001-0000-0000-0000-000000000047', 'stark-factory-discuss', NULL, 'd0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '150 days', 'Smart factory initiative. IoT and manufacturing analytics.', 1, 800000),
('e0000001-0000-0000-0000-000000000048', 'stark-factory-pilot', NULL, 'd0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '110 days', 'Pilot at Malibu facility. Sensor integration testing.', 2, 850000),
('e0000001-0000-0000-0000-000000000049', 'stark-factory-expand', NULL, 'd0000001-0000-0000-0000-000000000010', NOW() - INTERVAL '70 days', 'Expanding to three additional facilities.', 2, 1200000),

-- Stark Predictive Maintenance Program events (w011)
('e0000001-0000-0000-0000-000000000050', 'stark-maint-intro', NULL, 'd0000001-0000-0000-0000-000000000011', NOW() - INTERVAL '90 days', 'Predictive maintenance program. Reduce equipment downtime.', 1, 500000),
('e0000001-0000-0000-0000-000000000051', 'stark-maint-eval', NULL, 'd0000001-0000-0000-0000-000000000011', NOW() - INTERVAL '60 days', 'ML model evaluation for failure prediction.', 2, 550000),

-- Stark Digital Twin Platform events (w012)
('e0000001-0000-0000-0000-000000000052', 'stark-twin-discuss', NULL, 'd0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '60 days', 'Digital twin platform for virtual asset modeling.', 1, 600000),
('e0000001-0000-0000-0000-000000000053', 'stark-twin-scope', NULL, 'd0000001-0000-0000-0000-000000000012', NOW() - INTERVAL '30 days', 'Scoping complete. Starting with propulsion systems.', 1, 750000),

-- Wayne Enterprises customer-level events
('e0000001-0000-0000-0000-000000000054', 'wayne-gala', 'c0000001-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '200 days', 'Met at charity gala. Scheduled follow-up meeting.', 1, NULL),

-- Wayne Security Operations Modernization events (w013)
('e0000001-0000-0000-0000-000000000055', 'wayne-sec-req', NULL, 'd0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '180 days', 'Enterprise SOC modernization initiative.', 1, 900000),
('e0000001-0000-0000-0000-000000000056', 'wayne-sec-poc', NULL, 'd0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '150 days', 'POC with existing SIEM integration.', 2, 950000),
('e0000001-0000-0000-0000-000000000057', 'wayne-sec-review', NULL, 'd0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '120 days', 'Security architecture review. Additional requirements.', 2, 1100000),
('e0000001-0000-0000-0000-000000000058', 'wayne-sec-decide', NULL, 'd0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '80 days', 'Vendor selection committee approved. Final negotiations.', 3, 1100000),
('e0000001-0000-0000-0000-000000000059', 'wayne-sec-delay', NULL, 'd0000001-0000-0000-0000-000000000013', NOW() - INTERVAL '40 days', 'Project delayed. Internal restructuring at Wayne.', 3, 1100000),

-- Oscorp customer-level events
('e0000001-0000-0000-0000-000000000060', 'oscorp-referral', 'c0000001-0000-0000-0000-000000000007', NULL, NOW() - INTERVAL '170 days', 'Referral from industry analyst. Biotech focus.', 1, NULL),

-- Oscorp Genomics Research Platform events (w014)
('e0000001-0000-0000-0000-000000000061', 'oscorp-gen-req', NULL, 'd0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '160 days', 'Genomics research platform. High-performance sequencing compute.', 1, 700000),
('e0000001-0000-0000-0000-000000000062', 'oscorp-gen-poc', NULL, 'd0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '130 days', 'POC with gene sequencing workloads.', 2, 750000),
('e0000001-0000-0000-0000-000000000063', 'oscorp-gen-results', NULL, 'd0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '100 days', 'POC results excellent. 60% cost reduction.', 2, 800000),
('e0000001-0000-0000-0000-000000000064', 'oscorp-gen-budget', NULL, 'd0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '70 days', 'Budget approval process. Q2 target.', 3, 850000),
('e0000001-0000-0000-0000-000000000065', 'oscorp-gen-approved', NULL, 'd0000001-0000-0000-0000-000000000014', NOW() - INTERVAL '35 days', 'Budget approved. Contract finalization in progress.', 3, 850000),

-- Massive Dynamic customer-level events
('e0000001-0000-0000-0000-000000000066', 'massive-conf', 'c0000001-0000-0000-0000-000000000008', NULL, NOW() - INTERVAL '190 days', 'Tech conference meeting. Interest in quantum computing.', 1, NULL),

-- Massive Dynamic Quantum Computing Research Lab events (w015)
('e0000001-0000-0000-0000-000000000067', 'massive-quantum-req', NULL, 'd0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '180 days', 'Quantum computing research lab infrastructure exploration.', 1, 2000000),
('e0000001-0000-0000-0000-000000000068', 'massive-quantum-pilot', NULL, 'd0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '150 days', 'Pilot program started. Limited quantum access.', 2, 2000000),
('e0000001-0000-0000-0000-000000000069', 'massive-quantum-expand', NULL, 'd0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '110 days', 'Expanding pilot. Good early results.', 2, 2500000),
('e0000001-0000-0000-0000-000000000070', 'massive-quantum-decide', NULL, 'd0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '70 days', 'Business case approved. Moving to contract.', 3, 2500000),
('e0000001-0000-0000-0000-000000000071', 'massive-quantum-final', NULL, 'd0000001-0000-0000-0000-000000000015', NOW() - INTERVAL '20 days', 'Final contract review. Expected close next week.', 3, 2400000),

-- Cyberdyne customer-level events (no workloads - early stage)
('e0000001-0000-0000-0000-000000000072', 'cyberdyne-outreach', 'c0000001-0000-0000-0000-000000000009', NULL, NOW() - INTERVAL '140 days', 'Outbound prospecting. AI/robotics startup.', 1, NULL),
('e0000001-0000-0000-0000-000000000073', 'cyberdyne-discovery', 'c0000001-0000-0000-0000-000000000009', NULL, NOW() - INTERVAL '100 days', 'Discovery call with CTO. Discussing compute needs for neural networks.', 1, NULL),
('e0000001-0000-0000-0000-000000000074', 'cyberdyne-followup', 'c0000001-0000-0000-0000-000000000009', NULL, NOW() - INTERVAL '60 days', 'Follow-up meeting. Still in early exploration phase.', 1, NULL),

-- Soylent customer-level events (no workloads - early stage)
('e0000001-0000-0000-0000-000000000075', 'soylent-intro', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '160 days', 'Food tech startup. Interesting production needs.', 1, NULL),
('e0000001-0000-0000-0000-000000000076', 'soylent-meeting', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '140 days', 'On-site meeting at production facility.', 1, NULL),
('e0000001-0000-0000-0000-000000000077', 'soylent-proposal', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '90 days', 'Discussing potential production tracking initiative.', 1, NULL),
('e0000001-0000-0000-0000-000000000078', 'soylent-delay', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '45 days', 'Project on hold. Budget constraints this quarter.', 1, NULL),

-- Additional customer-level events
('e0000001-0000-0000-0000-000000000079', 'acme-quarterly', 'c0000001-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '45 days', 'Quarterly business review. Expansion opportunities.', NULL, NULL),
('e0000001-0000-0000-0000-000000000080', 'globex-strategy', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '30 days', 'Strategy session with new CIO. Positive outlook.', NULL, NULL),
('e0000001-0000-0000-0000-000000000081', 'umbrella-review', 'c0000001-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '25 days', 'Annual vendor review. Excellent feedback.', NULL, NULL),
('e0000001-0000-0000-0000-000000000082', 'stark-exec-update', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '20 days', 'Executive update meeting. New projects coming.', NULL, NULL),
('e0000001-0000-0000-0000-000000000083', 'wayne-check-in', 'c0000001-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '15 days', 'Check-in on delayed security project. Resuming soon.', NULL, NULL),
('e0000001-0000-0000-0000-000000000084', 'oscorp-expansion', 'c0000001-0000-0000-0000-000000000007', NULL, NOW() - INTERVAL '12 days', 'Discussing expansion to European labs.', NULL, NULL),
('e0000001-0000-0000-0000-000000000085', 'massive-partner', 'c0000001-0000-0000-0000-000000000008', NULL, NOW() - INTERVAL '8 days', 'Partnership discussion for joint research.', NULL, NULL),
('e0000001-0000-0000-0000-000000000086', 'soylent-green', 'c0000001-0000-0000-0000-000000000010', NULL, NOW() - INTERVAL '5 days', 'New product line discussion. Increased capacity needs.', NULL, NULL),
('e0000001-0000-0000-0000-000000000087', 'initech-annual', 'c0000001-0000-0000-0000-000000000003', NULL, NOW() - INTERVAL '20 days', 'Annual account review. Compliance project progressing.', NULL, NULL),
('e0000001-0000-0000-0000-000000000088', 'cyberdyne-tech', 'c0000001-0000-0000-0000-000000000009', NULL, NOW() - INTERVAL '25 days', 'Technical deep dive on AI infrastructure requirements.', NULL, NULL),
('e0000001-0000-0000-0000-000000000089', 'stark-innovation', 'c0000001-0000-0000-0000-000000000005', NULL, NOW() - INTERVAL '10 days', 'Innovation lab tour. Discussing R&D collaboration.', NULL, NULL),
('e0000001-0000-0000-0000-000000000090', 'globex-roadmap', 'c0000001-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '5 days', 'Product roadmap discussion. Alignment on 2025 priorities.', NULL, NULL);
