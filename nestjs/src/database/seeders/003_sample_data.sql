-- Sample data for LexiFlow Legal Management System
-- Run after initial schema and indexes are created

-- Insert sample organizations
INSERT INTO organizations (id, name, type, description, address, phone, email, website, status, license_number, bar_number, jurisdiction) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Sterling & Associates Law Firm', 'law_firm', 'Full-service law firm specializing in corporate and litigation matters', '123 Main Street, New York, NY 10001', '+1-212-555-0100', 'contact@sterlinglaw.com', 'https://sterlinglaw.com', 'active', 'LF-2024-001', 'NY-BAR-12345', 'New York'),
('550e8400-e29b-41d4-a716-446655440001', 'Corporate Legal Department - TechCorp', 'in_house', 'Internal legal department for technology corporation', '456 Tech Avenue, San Francisco, CA 94105', '+1-415-555-0200', 'legal@techcorp.com', 'https://techcorp.com/legal', 'active', 'IH-2024-002', 'CA-BAR-67890', 'California'),
('550e8400-e29b-41d4-a716-446655440002', 'Government Legal Office', 'government', 'Municipal legal services', '789 Government Plaza, Washington, DC 20001', '+1-202-555-0300', 'legal@citygovernment.gov', 'https://citygovernment.gov/legal', 'active', 'GOV-2024-003', 'DC-BAR-11111', 'Washington DC');

-- Insert sample users
INSERT INTO users (id, first_name, last_name, name, email, password_hash, role, position, bar_admission, bar_number, phone, expertise, status, organization_id) VALUES
('660f9511-f3ac-52e5-b827-557766551111', 'John', 'Sterling', 'John Sterling', 'j.sterling@sterlinglaw.com', '$2b$10$example.hash.for.demo.purposes.only', 'admin', 'Senior Partner', 'New York', 'NY-BAR-12345-001', '+1-212-555-0101', 'Corporate Law, Mergers & Acquisitions', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('660f9511-f3ac-52e5-b827-557766551112', 'Sarah', 'Johnson', 'Sarah Johnson', 's.johnson@sterlinglaw.com', '$2b$10$example.hash.for.demo.purposes.only', 'attorney', 'Associate', 'New York', 'NY-BAR-12345-002', '+1-212-555-0102', 'Litigation, Employment Law', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('660f9511-f3ac-52e5-b827-557766551113', 'Michael', 'Chen', 'Michael Chen', 'm.chen@techcorp.com', '$2b$10$example.hash.for.demo.purposes.only', 'attorney', 'General Counsel', 'California', 'CA-BAR-67890-001', '+1-415-555-0201', 'Technology Law, IP, Compliance', 'active', '550e8400-e29b-41d4-a716-446655440001'),
('660f9511-f3ac-52e5-b827-557766551114', 'Emily', 'Rodriguez', 'Emily Rodriguez', 'e.rodriguez@sterlinglaw.com', '$2b$10$example.hash.for.demo.purposes.only', 'paralegal', 'Senior Paralegal', NULL, NULL, '+1-212-555-0103', 'Document Management, Case Research', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('660f9511-f3ac-52e5-b827-557766551115', 'David', 'Kim', 'David Kim', 'd.kim@citygovernment.gov', '$2b$10$example.hash.for.demo.purposes.only', 'attorney', 'Assistant City Attorney', 'Washington DC', 'DC-BAR-11111-001', '+1-202-555-0301', 'Municipal Law, Regulatory Compliance', 'active', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample clients
INSERT INTO clients (id, name, type, email, phone, address, industry, contact_person, notes, status, owner_org_id) VALUES
('770fa622-04bd-63f6-c938-668877662222', 'Acme Corporation', 'corporate', 'legal@acmecorp.com', '+1-555-123-4567', '100 Business Park Drive, Suite 200, Austin, TX 78701', 'Manufacturing', 'Jane Doe, General Counsel', 'Major client - ongoing corporate matters', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('770fa622-04bd-63f6-c938-668877662223', 'Smith Family Trust', 'individual', 'robert.smith@email.com', '+1-555-234-5678', '456 Residential Lane, Suburbia, NY 12345', 'Estate Planning', 'Robert Smith, Trustee', 'Estate planning and trust administration', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('770fa622-04bd-63f6-c938-668877662224', 'TechStartup Inc', 'startup', 'founder@techstartup.com', '+1-555-345-6789', '789 Innovation Hub, San Francisco, CA 94105', 'Technology', 'Alex Johnson, CEO', 'Series A funding and incorporation matters', 'active', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample cases
INSERT INTO cases (id, title, client_name, opposing_counsel, status, filing_date, description, value, matter_type, jurisdiction, court, billing_model, judge, owner_org_id) VALUES
('880fb733-15ce-74g7-d049-779988773333', 'Acme Corp v. Competitor Ltd - Contract Dispute', 'Acme Corporation', 'Wilson & Partners LLP', 'active', '2024-01-15', 'Contract dispute over breach of exclusive distribution agreement', 2500000.00, 'Commercial Litigation', 'Texas', 'District Court of Travis County', 'hourly', 'Hon. Patricia Williams', '550e8400-e29b-41d4-a716-446655440000'),
('880fb733-15ce-74g7-d049-779988773334', 'Smith Family Trust - Estate Administration', 'Smith Family Trust', NULL, 'active', '2024-02-01', 'Comprehensive estate planning and trust administration', 150000.00, 'Estate Planning', 'New York', NULL, 'flat_fee', NULL, '550e8400-e29b-41d4-a716-446655440000'),
('880fb733-15ce-74g7-d049-779988773335', 'TechStartup Series A Legal Review', 'TechStartup Inc', NULL, 'active', '2024-03-01', 'Legal review and documentation for Series A funding round', 500000.00, 'Corporate', 'California', NULL, 'project', NULL, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample documents
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, owner_org_id) VALUES
('990fc844-26df-85h8-e15a-88aa99884444', 'distribution_agreement.pdf', 'Exclusive Distribution Agreement', 'contract', 'final', '/documents/2024/acme_corp/distribution_agreement.pdf', 'application/pdf', 2048576, 1, 'Original distribution agreement between Acme Corp and Competitor Ltd', 'contract,distribution,exclusive', 'confidential', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000'),
('990fc844-26df-85h8-e15a-88aa99884445', 'motion_summary_judgment.docx', 'Motion for Summary Judgment', 'pleading', 'draft', '/documents/2024/acme_corp/motion_summary_judgment.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1024000, 3, 'Motion for summary judgment in Acme Corp contract dispute', 'motion,summary judgment,litigation', 'work_product', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000'),
('990fc844-26df-85h8-e15a-88aa99884446', 'trust_agreement.pdf', 'Smith Family Trust Agreement', 'trust_document', 'final', '/documents/2024/smith_trust/trust_agreement.pdf', 'application/pdf', 1536000, 1, 'Revocable living trust agreement for Smith family', 'trust,estate planning,family', 'confidential', '880fb733-15ce-74g7-d049-779988773334', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample evidence
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id) VALUES
('aa0fd955-37ef-96i9-f26b-99bb0aa95555', 'Email Communications - Contract Negotiations', 'electronic', 'active', 'Email chain between parties during contract negotiation phase', 'Document Production ESI-001', 'Discovery Vendor ABC', '2024-01-20', 'Collected from client email server, includes 47 emails spanning 3 months', 'email,negotiation,contract', 'confidential', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551114', '550e8400-e29b-41d4-a716-446655440000'),
('aa0fd955-37ef-96i9-f26b-99bb0aa95556', 'Original Signed Contract', 'physical', 'active', 'Original executed distribution agreement with signatures', 'Law Firm Vault - Box 2024-001', 'Client Representative', '2024-01-10', 'Original document provided by client, blue ink signatures', 'original,signed,contract', 'confidential', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample workflow stages
INSERT INTO workflow_stages (id, name, description, status, "order", estimated_duration, case_id, owner_org_id) VALUES
('bb1fe066-48fg-07ja-037c-aaccbbaa6666', 'Case Initiation', 'Initial case setup and client intake', 'completed', 1, 5, '880fb733-15ce-74g7-d049-779988773333', '550e8400-e29b-41d4-a716-446655440000'),
('bb1fe066-48fg-07ja-037c-aaccbbaa6667', 'Discovery Phase', 'Document production and depositions', 'active', 2, 90, '880fb733-15ce-74g7-d049-779988773333', '550e8400-e29b-41d4-a716-446655440000'),
('bb1fe066-48fg-07ja-037c-aaccbbaa6668', 'Motion Practice', 'Pre-trial motions and court filings', 'pending', 3, 60, '880fb733-15ce-74g7-d049-779988773333', '550e8400-e29b-41d4-a716-446655440000'),
('bb1fe066-48fg-07ja-037c-aaccbbaa6669', 'Trial Preparation', 'Trial preparation and witness coordination', 'pending', 4, 45, '880fb733-15ce-74g7-d049-779988773333', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample workflow tasks
INSERT INTO workflow_tasks (id, title, description, status, due_date, estimated_hours, stage_id, assignee_id, created_by) VALUES
('cc2gf177-59gh-18kb-148d-bbddccbb7777', 'Conduct Client Interview', 'Initial client interview to gather case facts and documentation', 'completed', '2024-01-20', 3.0, 'bb1fe066-48fg-07ja-037c-aaccbbaa6666', '660f9511-f3ac-52e5-b827-557766551112', '660f9511-f3ac-52e5-b827-557766551111'),
('cc2gf177-59gh-18kb-148d-bbddccbb7778', 'Draft Document Requests', 'Prepare and serve discovery requests to opposing party', 'active', '2024-04-15', 8.0, 'bb1fe066-48fg-07ja-037c-aaccbbaa6667', '660f9511-f3ac-52e5-b827-557766551114', '660f9511-f3ac-52e5-b827-557766551112'),
('cc2gf177-59gh-18kb-148d-bbddccbb7779', 'Review Produced Documents', 'Review and analyze documents produced by opposing party', 'pending', '2024-05-01', 25.0, 'bb1fe066-48fg-07ja-037c-aaccbbaa6667', '660f9511-f3ac-52e5-b827-557766551114', '660f9511-f3ac-52e5-b827-557766551112');

-- Insert sample time entries
INSERT INTO time_entries (id, description, hours, rate, date, billable, activity_type, case_id, user_id, owner_org_id) VALUES
('dd3hg288-6ahi-29lc-259e-cceeeccc8888', 'Client interview and case analysis', 3.5, 450.00, '2024-01-20', true, 'Client Meeting', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000'),
('dd3hg288-6ahi-29lc-259e-cceeeccc8889', 'Research applicable contract law', 5.0, 450.00, '2024-01-22', true, 'Legal Research', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000'),
('dd3hg288-6ahi-29lc-259e-cceeeccc888a', 'Document review and analysis', 8.0, 200.00, '2024-01-25', true, 'Document Review', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551114', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample calendar events
INSERT INTO calendar_events (id, title, type, description, start_time, end_time, location, status, priority, case_id, organizer_id, owner_org_id) VALUES
('ee4ih399-7bij-3and-36af-ddeefedd9999', 'Client Deposition - John Acme', 'deposition', 'Deposition of John Acme, CEO of Acme Corporation', '2024-04-15 09:00:00', '2024-04-15 17:00:00', 'Sterling & Associates Conference Room A', 'scheduled', 'high', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000'),
('ee4ih399-7bij-3and-36af-ddeefedd999a', 'Court Hearing - Motion for Summary Judgment', 'hearing', 'Hearing on Motion for Summary Judgment', '2024-05-20 10:30:00', '2024-05-20 11:30:00', 'Travis County District Court, Courtroom 4', 'scheduled', 'high', '880fb733-15ce-74g7-d049-779988773333', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample jurisdictions
INSERT INTO jurisdictions (id, name, type, code, description, country, rules, court_website, status, owner_org_id) VALUES
('ff5ji4aa-8ckj-4boe-47bg-eeffggee0000', 'Texas', 'state', 'TX', 'State of Texas jurisdiction', 'US', '{"filing_deadlines": {"answer": 21, "appeal": 30}, "discovery_limits": {"interrogatories": 25, "requests_for_production": 50}}', 'https://www.txcourts.gov', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('ff5ji4aa-8ckj-4boe-47bg-eeffggee0001', 'New York', 'state', 'NY', 'State of New York jurisdiction', 'US', '{"filing_deadlines": {"answer": 30, "appeal": 30}, "discovery_limits": {"interrogatories": 25, "requests_for_production": 75}}', 'https://www.nycourts.gov', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('ff5ji4aa-8ckj-4boe-47bg-eeffggee0002', 'California', 'state', 'CA', 'State of California jurisdiction', 'US', '{"filing_deadlines": {"answer": 30, "appeal": 60}, "discovery_limits": {"interrogatories": 35, "requests_for_production": 75}}', 'https://www.courts.ca.gov', 'active', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample knowledge articles
INSERT INTO knowledge_articles (id, title, type, status, category, content, summary, tags, visibility, author_id, owner_org_id) VALUES
('1156k5bb-9dlk-5cpf-58ch-ffgghhff1111', 'Texas Contract Law - Breach of Contract Elements', 'legal_research', 'published', 'Contract Law', 'To establish a breach of contract claim in Texas, a plaintiff must prove: (1) the existence of a valid contract; (2) performance or tendered performance by the plaintiff; (3) breach of the contract by the defendant; and (4) damages sustained as a result of the breach. See Mustang Pipeline Co. v. Driver Pipeline Co., 134 S.W.3d 195, 195 (Tex. 2004).', 'Essential elements for breach of contract claims under Texas law', 'contract,breach,texas,elements', 'internal', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000'),
('1156k5bb-9dlk-5cpf-58ch-ffgghhff1112', 'Document Production Best Practices', 'procedure', 'published', 'Discovery', 'Best practices for document production in litigation: 1) Implement litigation hold immediately, 2) Identify key custodians and data sources, 3) Use proportional discovery approach, 4) Consider using technology-assisted review (TAR) for large datasets, 5) Maintain detailed privilege logs, 6) Ensure metadata preservation when required.', 'Comprehensive guide to effective document production in litigation', 'discovery,document production,litigation,best practices', 'internal', '660f9511-f3ac-52e5-b827-557766551114', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample clauses
INSERT INTO clauses (id, title, type, category, content, description, status, tags, author_id, owner_org_id) VALUES
('2267l6cc-aelm-6dqg-69di-gghhjjgg2222', 'Standard Limitation of Liability', 'limitation', 'Contract Terms', 'LIMITATION OF LIABILITY. IN NO EVENT SHALL [PARTY] BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY.', 'Standard limitation of liability clause for service agreements', 'active', 'limitation,liability,damages,contract', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000'),
('2267l6cc-aelm-6dqg-69di-gghhjjgg2223', 'Confidentiality and Non-Disclosure', 'confidentiality', 'Contract Terms', 'CONFIDENTIALITY. Each party acknowledges that it may receive certain confidential or proprietary information of the other party. Each party agrees to maintain such information in confidence and not to disclose it to third parties without prior written consent.', 'Basic confidentiality clause for business agreements', 'active', 'confidentiality,nda,proprietary,information', '660f9511-f3ac-52e5-b827-557766551111', '550e8400-e29b-41d4-a716-446655440000');

-- Note: AI-related tables (document_embeddings, legal_citations, document_analysis, search_queries) 
-- would typically be populated through automated processes rather than manual seeding
-- Sample entries for reference:

INSERT INTO document_analysis (id, document_id, analysis_type, status, results, confidence_score, model_used, summary, initiated_by, owner_org_id, completed_at) VALUES
('3378m7dd-bfmn-7erh-7aej-hhjjkkjj3333', '990fc844-26df-85h8-e15a-88aa99884444', 'contract_analysis', 'completed', '{"key_terms": ["exclusive distribution", "territory restrictions", "performance metrics"], "risk_factors": ["termination clauses", "liability limitations"], "compliance_issues": []}', 0.8950, 'gpt-4', 'Distribution agreement analysis reveals standard commercial terms with moderate risk profile', '660f9511-f3ac-52e5-b827-557766551112', '550e8400-e29b-41d4-a716-446655440000', '2024-01-16 14:30:00');

-- Update sequences to prevent ID conflicts (PostgreSQL auto-generates UUIDs so this is not typically necessary,
-- but included for completeness)

-- Show sample data counts
SELECT 
    'organizations' as table_name, COUNT(*) as record_count FROM organizations
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'cases', COUNT(*) FROM cases
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'evidence', COUNT(*) FROM evidence
UNION ALL
SELECT 'workflow_stages', COUNT(*) FROM workflow_stages
UNION ALL
SELECT 'workflow_tasks', COUNT(*) FROM workflow_tasks
UNION ALL
SELECT 'time_entries', COUNT(*) FROM time_entries
UNION ALL
SELECT 'calendar_events', COUNT(*) FROM calendar_events
UNION ALL
SELECT 'jurisdictions', COUNT(*) FROM jurisdictions
UNION ALL
SELECT 'knowledge_articles', COUNT(*) FROM knowledge_articles
UNION ALL
SELECT 'clauses', COUNT(*) FROM clauses
UNION ALL
SELECT 'document_analysis', COUNT(*) FROM document_analysis;