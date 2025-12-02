-- LexiFlow Database Seed Data
-- Sample data for development and testing

-- Insert sample organizations
INSERT INTO organizations (id, name, type, description, address, phone, email, website, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Smith & Associates Law Firm', 'law_firm', 'Full-service law firm specializing in corporate law', '123 Legal Street, New York, NY 10001', '+1-555-0123', 'contact@smithlaw.com', 'https://smithlaw.com', 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Corporate Legal Services Inc', 'corporate', 'In-house legal department for Fortune 500 company', '456 Corporate Ave, Los Angeles, CA 90210', '+1-555-0456', 'legal@corpservices.com', 'https://corpservices.com', 'active', NOW(), NOW());

-- Insert sample users (Password for all users: LexiFlow2024!)
INSERT INTO users (id, first_name, last_name, name, email, password_hash, role, position, bar_admission, bar_number, phone, expertise, status, organization_id, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440099', 'Admin', 'User', 'Admin User', 'admin@lexiflow.com', '$2b$10$7yzWINresOJxRuVqbYT6geWxfDgFvhv5k3ej8WKRxXE37KLpv4Zei', 'admin', 'System Administrator', NULL, NULL, '+1-555-0100', 'System Administration', 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440000', 'John', 'Smith', 'John Smith', 'john.smith@smithlaw.com', '$2b$10$7yzWINresOJxRuVqbYT6geWxfDgFvhv5k3ej8WKRxXE37KLpv4Zei', 'attorney', 'Senior Partner', 'New York', 'NY123456', '+1-555-0101', 'Corporate Law, M&A', 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440001', 'Jane', 'Doe', 'Jane Doe', 'jane.doe@smithlaw.com', '$2b$10$7yzWINresOJxRuVqbYT6geWxfDgFvhv5k3ej8WKRxXE37KLpv4Zei', 'paralegal', 'Senior Paralegal', NULL, NULL, '+1-555-0102', 'Document Review, Case Management', 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'Michael', 'Johnson', 'Michael Johnson', 'mjohnson@corpservices.com', '$2b$10$7yzWINresOJxRuVqbYT6geWxfDgFvhv5k3ej8WKRxXE37KLpv4Zei', 'attorney', 'General Counsel', 'California', 'CA789012', '+1-555-0103', 'Corporate Compliance, Employment Law', 'active', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Insert sample cases
INSERT INTO cases (id, title, client_name, opposing_counsel, status, filing_date, description, value, matter_type, jurisdiction, court, billing_model, judge, owner_org_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440000', 'TechCorp vs DataSystems Inc', 'TechCorp International', 'Wilson & Partners LLP', 'active', '2024-01-15', 'Patent infringement dispute over data processing algorithms', 5000000.00, 'Intellectual Property', 'Federal', 'US District Court for the Southern District of NY', 'Contingency', 'Hon. Sarah Wilson', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440001', 'ABC Corp Employment Matter', 'ABC Corporation', 'Internal HR Investigation', 'pending', '2024-02-01', 'Employment discrimination investigation and compliance review', 250000.00, 'Employment Law', 'State', 'New York Supreme Court', 'Hourly', NULL, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Insert sample documents
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, version_notes, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440000', 'complaint_techcorp_v1.pdf', 'Initial Complaint - TechCorp vs DataSystems', 'Complaint', 'filed', '/storage/documents/850e8400-e29b-41d4-a716-446655440000.pdf', 'application/pdf', 2048576, 1, 'Initial filing version', 'Original complaint filed in patent dispute', 'patent, complaint, filing', 'Confidential', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample evidence
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440000', 'Email Chain - Algorithm Development', 'Email', 'active', 'Email correspondence between TechCorp engineers discussing algorithm development', '/storage/evidence/950e8400-e29b-41d4-a716-446655440000/', 'Jane Doe - Paralegal', '2024-01-20', 'Chain of custody maintained, authenticated by IT department', 'email, development, algorithm', 'Highly Confidential', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample knowledge articles
INSERT INTO knowledge_articles (id, title, type, status, category, content, summary, tags, visibility, view_count, rating, author_id, modified_by, owner_org_id, created_at, updated_at) VALUES
('a50e8400-e29b-41d4-a716-446655440000', 'Patent Filing Best Practices', 'best_practices', 'published', 'Intellectual Property', 'Comprehensive guide to patent filing procedures, timelines, and best practices for technology companies...', 'Essential guide for patent filing in technology sector', 'patent, filing, technology, best-practices', 'internal', 45, 4.8, '650e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample jurisdictions
INSERT INTO jurisdictions (id, name, type, code, description, country, rules, court_website, status, owner_org_id, created_at, updated_at) VALUES
('b50e8400-e29b-41d4-a716-446655440000', 'New York', 'state', 'NY', 'State of New York jurisdiction', 'US', '{"statute_of_limitations": "3 years", "discovery_deadlines": "120 days"}', 'https://www.nycourts.gov', 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440001', 'Federal Southern District NY', 'federal', 'SDNY', 'US District Court for the Southern District of New York', 'US', '{"patent_venue": "specialized", "expedited_proceedings": "available"}', 'https://www.nysd.uscourts.gov', 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample calendar events
INSERT INTO calendar_events (id, title, type, description, start_time, end_time, location, status, priority, all_day, reminder, notes, case_id, organizer_id, owner_org_id, created_at, updated_at) VALUES
('c50e8400-e29b-41d4-a716-446655440000', 'Discovery Conference - TechCorp Case', 'hearing', 'Court-ordered discovery conference to establish timelines', '2024-12-15 14:00:00', '2024-12-15 16:00:00', 'US District Court, Room 501', 'scheduled', 'high', false, '30m', 'Prepare discovery plan and timeline proposals', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample tasks
INSERT INTO tasks (id, title, type, description, status, priority, due_date, start_date, estimated_hours, progress, notes, case_id, assignee_id, created_by, owner_org_id, created_at, updated_at) VALUES
('d50e8400-e29b-41d4-a716-446655440000', 'Review Patent Documentation', 'document_review', 'Comprehensive review of all patent documentation for prior art analysis', 'in_progress', 'high', '2024-12-10 17:00:00', '2024-12-01 09:00:00', 16.0, 75, 'Initial review completed, focusing on claims 1-5', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample clauses
INSERT INTO clauses (id, title, type, category, content, description, status, version, version_notes, tags, usage_count, visibility, author_id, modified_by, owner_org_id, created_at, updated_at) VALUES
('e50e8400-e29b-41d4-a716-446655440000', 'Standard IP Indemnification Clause', 'indemnification', 'Intellectual Property', 'Each party agrees to indemnify and hold harmless the other party from and against any claims, damages, losses, and expenses arising out of any allegation that...', 'Standard intellectual property indemnification clause for technology licensing agreements', 'active', 2, 'Updated for recent case law changes', 'indemnification, intellectual-property, technology, standard', 23, 'internal', '650e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- Insert sample time entries
INSERT INTO time_entries (id, description, hours, rate, date, billable, activity_type, case_id, user_id, owner_org_id, created_at, updated_at) VALUES
('f50e8400-e29b-41d4-a716-446655440000', 'Client consultation regarding patent strategy. Notes: Discussed patent landscape and litigation strategy.', 2.5, 450.00, '2024-11-28', true, 'Client Communication', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('f50e8400-e29b-41d4-a716-446655440001', 'Document review - patent prior art research. Notes: Reviewed 50+ patent documents for prior art analysis.', 4.0, 125.00, '2024-11-28', true, 'Document Review', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());
