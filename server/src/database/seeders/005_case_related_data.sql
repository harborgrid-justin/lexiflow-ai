-- LexiFlow Case Related Data Seed
-- Team Members, Parties, Motions, Documents, Evidence, Discovery, Messages, Workflow, Billing
-- Fixed for proper UUID handling

-- ============================================
-- CASE MEMBERS (Team) for all 100 cases
-- ============================================
INSERT INTO case_members (id, case_id, user_id, role, joined_at, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    u.id,
    CASE
        WHEN u.role = 'attorney' AND u.position LIKE '%Partner%' THEN 'Lead Attorney'
        WHEN u.role = 'attorney' THEN 'Associate Attorney'
        WHEN u.role = 'paralegal' THEN 'Paralegal'
        WHEN u.role = 'clerk' THEN 'Law Clerk'
        WHEN u.role = 'admin' THEN 'Case Manager'
        ELSE 'Team Member'
    END,
    c.created_at + INTERVAL '1 day' * (RANDOM() * 7),
    NOW(),
    NOW()
FROM cases c
CROSS JOIN LATERAL (
    SELECT id, role, position FROM users
    WHERE organization_id = c.owner_org_id
    ORDER BY RANDOM()
    LIMIT 3 + FLOOR(RANDOM() * 3)::INT
) u
WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- ============================================
-- PARTIES for all 100 cases
-- ============================================
-- Generate plaintiff parties
INSERT INTO parties (id, name, role, contact, type, counsel, case_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.client_name,
    'Plaintiff',
    LOWER(REPLACE(REPLACE(c.client_name, ' ', '.'), '''', '')) || '@email.com',
    CASE WHEN c.client_name LIKE '%Corp%' OR c.client_name LIKE '%LLC%' OR c.client_name LIKE '%Inc%' THEN 'Corporation' ELSE 'Individual' END,
    'Smith & Associates',
    c.id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Generate defendant parties
INSERT INTO parties (id, name, role, contact, type, counsel, case_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    COALESCE(NULLIF(SPLIT_PART(c.title, ' v. ', 2), ''), NULLIF(SPLIT_PART(c.title, ' - ', 2), ''), 'Defendant Party'),
    'Defendant',
    'defendant.' || SUBSTRING(c.id::text, 35) || '@email.com',
    CASE WHEN c.title LIKE '%Corp%' OR c.title LIKE '%LLC%' OR c.title LIKE '%Inc%' THEN 'Corporation' ELSE 'Individual' END,
    COALESCE(c.opposing_counsel, 'Opposing Counsel LLP'),
    c.id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Add expert witness parties for high-value cases
INSERT INTO parties (id, name, role, contact, type, counsel, case_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Dr. ' || (ARRAY['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'])[1 + FLOOR(RANDOM() * 10)::INT] || ' (Expert)',
    'Expert Witness',
    'expert.' || SUBSTRING(c.id::text, 35) || '@consulting.com',
    'Individual',
    NULL,
    c.id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 1000000
ON CONFLICT DO NOTHING;

-- ============================================
-- MOTIONS for all 100 cases
-- ============================================
-- Motion to Compel Discovery
INSERT INTO motions (id, case_id, title, motion_type, type, filing_date, status, description, filed_by, filed_date, response_due, hearing_date, judge, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Motion to Compel Discovery',
    'discovery',
    'Discovery',
    TO_CHAR(c.filing_date + INTERVAL '30 days', 'YYYY-MM-DD'),
    CASE WHEN RANDOM() > 0.5 THEN 'filed' ELSE 'pending' END,
    'Motion to compel defendant to produce requested documents',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '30 days',
    c.filing_date + INTERVAL '51 days',
    c.filing_date + INTERVAL '60 days',
    c.judge,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Motion for Summary Judgment
INSERT INTO motions (id, case_id, title, motion_type, type, filing_date, status, description, filed_by, filed_date, response_due, hearing_date, judge, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Motion for Summary Judgment',
    'summary_judgment',
    'Dispositive',
    TO_CHAR(c.filing_date + INTERVAL '90 days', 'YYYY-MM-DD'),
    CASE WHEN RANDOM() > 0.7 THEN 'granted' WHEN RANDOM() > 0.4 THEN 'pending' ELSE 'denied' END,
    'Motion seeking judgment as a matter of law on all claims',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '90 days',
    c.filing_date + INTERVAL '111 days',
    c.filing_date + INTERVAL '120 days',
    c.judge,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status IN ('active', 'pending')
ON CONFLICT DO NOTHING;

-- Motion in Limine for high-value cases
INSERT INTO motions (id, case_id, title, motion_type, type, filing_date, status, description, filed_by, filed_date, response_due, hearing_date, judge, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Motion in Limine',
    'in_limine',
    'Evidentiary',
    TO_CHAR(c.filing_date + INTERVAL '120 days', 'YYYY-MM-DD'),
    'filed',
    'Motion to exclude prejudicial evidence from trial',
    '650e8400-e29b-41d4-a716-446655440003',
    c.filing_date + INTERVAL '120 days',
    c.filing_date + INTERVAL '141 days',
    c.filing_date + INTERVAL '150 days',
    c.judge,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 2000000
ON CONFLICT DO NOTHING;

-- Motion to Dismiss
INSERT INTO motions (id, case_id, title, motion_type, type, filing_date, status, description, filed_by, filed_date, response_due, hearing_date, judge, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Motion to Dismiss',
    'dismiss',
    'Dispositive',
    TO_CHAR(c.filing_date + INTERVAL '21 days', 'YYYY-MM-DD'),
    CASE WHEN c.status = 'dismissed' THEN 'granted' ELSE 'denied' END,
    'Motion to dismiss for failure to state a claim',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '21 days',
    c.filing_date + INTERVAL '42 days',
    c.filing_date + INTERVAL '50 days',
    c.judge,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND RANDOM() > 0.5
ON CONFLICT DO NOTHING;

-- ============================================
-- DOCUMENTS for all 100 cases
-- ============================================
-- Initial Complaint
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'complaint_' || SUBSTRING(c.id::text, 35) || '.pdf',
    'Initial Complaint - ' || SUBSTRING(c.title, 1, 50),
    'Complaint',
    'filed',
    '/storage/documents/' || c.id::text || '/complaint.pdf',
    'application/pdf',
    (500000 + FLOOR(RANDOM() * 2000000))::BIGINT,
    1,
    'Original complaint filed with the court',
    'complaint, filing, pleading',
    'Confidential',
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.owner_org_id,
    c.filing_date,
    c.filing_date
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Answer
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'answer_' || SUBSTRING(c.id::text, 35) || '.pdf',
    'Answer and Affirmative Defenses',
    'Answer',
    'filed',
    '/storage/documents/' || c.id::text || '/answer.pdf',
    'application/pdf',
    (400000 + FLOOR(RANDOM() * 1500000))::BIGINT,
    1,
    'Defendant''s answer with affirmative defenses',
    'answer, pleading, defense',
    'Confidential',
    c.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.owner_org_id,
    c.filing_date + INTERVAL '21 days',
    c.filing_date + INTERVAL '21 days'
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Discovery Requests
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'discovery_requests_' || SUBSTRING(c.id::text, 35) || '.pdf',
    'First Set of Discovery Requests',
    'Discovery',
    'filed',
    '/storage/documents/' || c.id::text || '/discovery_requests.pdf',
    'application/pdf',
    (300000 + FLOOR(RANDOM() * 1000000))::BIGINT,
    1,
    'Initial discovery requests including interrogatories and document requests',
    'discovery, interrogatories, requests',
    'Confidential',
    c.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.owner_org_id,
    c.filing_date + INTERVAL '35 days',
    c.filing_date + INTERVAL '35 days'
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Contract Exhibit for contract/corporate cases
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'contract_exhibit_' || SUBSTRING(c.id::text, 35) || '.pdf',
    'Contract Exhibit A',
    'Exhibit',
    'approved',
    '/storage/documents/' || c.id::text || '/exhibit_a.pdf',
    'application/pdf',
    (200000 + FLOOR(RANDOM() * 800000))::BIGINT,
    1,
    'Primary contract at issue in this dispute',
    'contract, exhibit, evidence',
    'Highly Confidential',
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.owner_org_id,
    c.filing_date,
    c.filing_date
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.matter_type IN ('Contract Dispute', 'Corporate')
ON CONFLICT DO NOTHING;

-- Legal Research Memo
INSERT INTO documents (id, filename, title, type, status, file_path, mime_type, file_size, version, description, tags, classification, case_id, created_by, modified_by, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'memo_legal_research_' || SUBSTRING(c.id::text, 35) || '.docx',
    'Legal Research Memorandum',
    'Memo',
    'draft',
    '/storage/documents/' || c.id::text || '/legal_memo.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    (150000 + FLOOR(RANDOM() * 500000))::BIGINT,
    2,
    'Internal legal research memorandum on key issues',
    'research, memo, internal',
    'Work Product',
    c.id,
    '650e8400-e29b-41d4-a716-446655440007',
    '650e8400-e29b-41d4-a716-446655440003',
    c.owner_org_id,
    c.filing_date + INTERVAL '14 days',
    c.filing_date + INTERVAL '21 days'
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- ============================================
-- EVIDENCE for all 100 cases
-- ============================================
-- Email Communications
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Email Communications - ' || c.client_name,
    'Email',
    'authenticated',
    'Relevant email communications between parties',
    '/storage/evidence/' || c.id::text || '/emails/',
    'Jane Doe - Paralegal',
    c.filing_date + INTERVAL '10 days',
    'Exported from client email system with proper chain of custody',
    'email, communications, electronic',
    'Confidential',
    c.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.owner_org_id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Financial Records for higher value cases
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Financial Records - ' || SUBSTRING(c.title, 1, 30),
    'Financial Document',
    'under_review',
    'Financial statements and transaction records',
    '/storage/evidence/' || c.id::text || '/financials/',
    'Emily Davis - Paralegal',
    c.filing_date + INTERVAL '20 days',
    'Obtained through discovery, certified copies',
    'financial, records, accounting',
    'Highly Confidential',
    c.id,
    '650e8400-e29b-41d4-a716-446655440005',
    c.owner_org_id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 500000
ON CONFLICT DO NOTHING;

-- Contract Documents
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Contract Documents',
    'Contract',
    'authenticated',
    'Original signed contracts and amendments',
    '/storage/evidence/' || c.id::text || '/contracts/',
    'John Smith - Attorney',
    c.filing_date - INTERVAL '5 days',
    'Original documents scanned and preserved',
    'contract, original, signed',
    'Confidential',
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.owner_org_id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.matter_type IN ('Contract Dispute', 'Corporate', 'Real Estate')
ON CONFLICT DO NOTHING;

-- Deposition Transcripts
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Deposition Transcripts',
    'Transcript',
    'authenticated',
    'Certified deposition transcripts',
    '/storage/evidence/' || c.id::text || '/depositions/',
    'Court Reporter',
    c.filing_date + INTERVAL '60 days',
    'Certified transcripts from depositions',
    'deposition, transcript, testimony',
    'Confidential',
    c.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.owner_org_id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active' AND c.value > 1000000
ON CONFLICT DO NOTHING;

-- Expert Report for high value cases
INSERT INTO evidence (id, title, type, status, description, location, collected_by, collected_date, collection_notes, tags, classification, case_id, custodian_id, owner_org_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Expert Report - Damages Analysis',
    'Expert Report',
    'under_review',
    'Expert witness report on damages calculation',
    '/storage/evidence/' || c.id::text || '/expert_reports/',
    'Dr. Expert Witness',
    c.filing_date + INTERVAL '90 days',
    'Expert report prepared for litigation',
    'expert, damages, analysis',
    'Work Product',
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.owner_org_id,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 5000000
ON CONFLICT DO NOTHING;

-- ============================================
-- DISCOVERY REQUESTS for all 100 cases
-- ============================================
-- Interrogatories
INSERT INTO discovery_requests (id, case_id, title, request_type, description, status, created_by, served_date, due_date, recipient, priority, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'First Set of Interrogatories',
    'interrogatories',
    'Initial interrogatories seeking factual information from defendant',
    CASE WHEN RANDOM() > 0.5 THEN 'responded' ELSE 'served' END,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '30 days',
    c.filing_date + INTERVAL '60 days',
    'Defendant',
    'high',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Document Requests
INSERT INTO discovery_requests (id, case_id, title, request_type, description, status, created_by, served_date, due_date, recipient, priority, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Request for Production of Documents',
    'document_request',
    'Request for production of all relevant documents and communications',
    CASE WHEN RANDOM() > 0.3 THEN 'responded' ELSE 'served' END,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.filing_date + INTERVAL '30 days',
    c.filing_date + INTERVAL '60 days',
    'Defendant',
    'high',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Requests for Admission
INSERT INTO discovery_requests (id, case_id, title, request_type, description, status, created_by, served_date, due_date, recipient, priority, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Requests for Admission',
    'admissions',
    'Requests for admission of facts to streamline issues for trial',
    'served',
    '650e8400-e29b-41d4-a716-446655440003',
    c.filing_date + INTERVAL '45 days',
    c.filing_date + INTERVAL '75 days',
    'Defendant',
    'medium',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active' AND c.value > 1000000
ON CONFLICT DO NOTHING;

-- Subpoena
INSERT INTO discovery_requests (id, case_id, title, request_type, description, status, created_by, served_date, due_date, recipient, priority, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Subpoena Duces Tecum - Third Party',
    'subpoena',
    'Subpoena to third party for document production',
    'draft',
    '37e72ab9-e028-430e-91fe-9352b535c487',
    NULL,
    c.filing_date + INTERVAL '90 days',
    'Third Party Custodian',
    'medium',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active' AND RANDOM() > 0.6
ON CONFLICT DO NOTHING;

-- ============================================
-- CONVERSATIONS AND MESSAGES for all 100 cases
-- ============================================
-- Create conversations
INSERT INTO conversations (id, title, type, case_id, created_by, status, participants, last_message_at, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    'Case Discussion - ' || SUBSTRING(c.title, 1, 40),
    'case',
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    'active',
    '["650e8400-e29b-41d4-a716-446655440000", "650e8400-e29b-41d4-a716-446655440001", "650e8400-e29b-41d4-a716-446655440003"]'::JSON,
    NOW() - INTERVAL '1 day' * (RANDOM() * 7)::INT,
    c.filing_date + INTERVAL '1 day',
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Add messages to conversations
INSERT INTO messages (id, conversation_id, sender_id, content, message_type, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    conv.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    'Team, I''ve reviewed the initial complaint and want to discuss our strategy for this case. Key issues include liability and damages calculation.',
    'text',
    'read',
    conv.created_at + INTERVAL '1 hour',
    conv.created_at + INTERVAL '1 hour'
FROM conversations conv WHERE conv.case_id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, message_type, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    conv.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    'I''ve started reviewing the documents and found some key evidence that supports our position. Will share the summary shortly.',
    'text',
    'read',
    conv.created_at + INTERVAL '2 hours',
    conv.created_at + INTERVAL '2 hours'
FROM conversations conv WHERE conv.case_id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, message_type, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    conv.id,
    '650e8400-e29b-41d4-a716-446655440003',
    'Discovery responses are due next week. I''ll prepare a draft for review.',
    'text',
    'sent',
    conv.created_at + INTERVAL '3 hours',
    conv.created_at + INTERVAL '3 hours'
FROM conversations conv WHERE conv.case_id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- ============================================
-- WORKFLOW STAGES for all 100 cases
-- ============================================
-- Stage 1: Case Initiation
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Case Initiation',
    'Initial case setup, client intake, and conflict check',
    'completed',
    1,
    c.filing_date - INTERVAL '7 days',
    c.filing_date,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    100,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Stage 2: Pleadings
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Pleadings',
    'Draft and file initial pleadings',
    CASE WHEN c.status = 'active' THEN 'completed' ELSE 'in_progress' END,
    2,
    c.filing_date,
    c.filing_date + INTERVAL '30 days',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    CASE WHEN c.status = 'active' THEN 100 ELSE 75 END,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Stage 3: Discovery
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Discovery',
    'Written discovery, depositions, and document review',
    CASE
        WHEN c.status = 'settled' OR c.status = 'closed' THEN 'completed'
        WHEN c.status = 'active' THEN 'in_progress'
        ELSE 'pending'
    END,
    3,
    c.filing_date + INTERVAL '30 days',
    c.filing_date + INTERVAL '180 days',
    '37e72ab9-e028-430e-91fe-9352b535c487',
    CASE
        WHEN c.status = 'settled' OR c.status = 'closed' THEN 100
        WHEN c.status = 'active' THEN (30 + FLOOR(RANDOM() * 50))::INT
        ELSE 0
    END,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Stage 4: Dispositive Motions
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Dispositive Motions',
    'Summary judgment and other dispositive motions',
    CASE
        WHEN c.status = 'dismissed' THEN 'completed'
        WHEN c.status IN ('settled', 'closed') THEN 'completed'
        WHEN c.status = 'active' AND c.value > 2000000 THEN 'in_progress'
        ELSE 'pending'
    END,
    4,
    c.filing_date + INTERVAL '180 days',
    c.filing_date + INTERVAL '270 days',
    '650e8400-e29b-41d4-a716-446655440003',
    CASE
        WHEN c.status = 'dismissed' THEN 100
        WHEN c.status IN ('settled', 'closed') THEN 100
        WHEN c.status = 'active' AND c.value > 2000000 THEN (20 + FLOOR(RANDOM() * 40))::INT
        ELSE 0
    END,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Stage 5: Trial Preparation
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Trial Preparation',
    'Witness preparation, exhibit organization, and trial briefs',
    CASE
        WHEN c.status IN ('settled', 'closed', 'dismissed') THEN 'completed'
        ELSE 'pending'
    END,
    5,
    c.filing_date + INTERVAL '270 days',
    c.filing_date + INTERVAL '365 days',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    CASE WHEN c.status IN ('settled', 'closed', 'dismissed') THEN 100 ELSE 0 END,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Stage 6: Trial
INSERT INTO workflow_stages (id, case_id, name, description, status, "order", start_date, due_date, assigned_to, progress, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'Trial',
    'Trial proceedings',
    CASE WHEN c.status = 'closed' THEN 'completed' ELSE 'pending' END,
    6,
    c.filing_date + INTERVAL '365 days',
    c.filing_date + INTERVAL '380 days',
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    CASE WHEN c.status = 'closed' THEN 100 ELSE 0 END,
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- ============================================
-- TIME ENTRIES (Billing) for all 100 cases
-- ============================================
-- Entry 1: Initial case review
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date,
    TO_CHAR(c.filing_date, 'YYYY-MM-DD'),
    180,
    3.0,
    'Initial case review and strategy discussion with team',
    'billable',
    450.00,
    1350.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Entry 2: Document review
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '37e72ab9-e028-430e-91fe-9352b535c487',
    c.filing_date + INTERVAL '7 days',
    TO_CHAR(c.filing_date + INTERVAL '7 days', 'YYYY-MM-DD'),
    360,
    6.0,
    'Document review and analysis - initial production',
    'billable',
    175.00,
    1050.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Entry 3: Legal research (active cases only)
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '650e8400-e29b-41d4-a716-446655440003',
    c.filing_date + INTERVAL '14 days',
    TO_CHAR(c.filing_date + INTERVAL '14 days', 'YYYY-MM-DD'),
    240,
    4.0,
    'Legal research on key liability issues',
    'billable',
    350.00,
    1400.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Entry 4: Client communication
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '21 days',
    TO_CHAR(c.filing_date + INTERVAL '21 days', 'YYYY-MM-DD'),
    120,
    2.0,
    'Client communication and status update call',
    'billable',
    450.00,
    900.00,
    'draft',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Entry 5: Discovery document review (active cases)
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '650e8400-e29b-41d4-a716-446655440005',
    c.filing_date + INTERVAL '28 days',
    TO_CHAR(c.filing_date + INTERVAL '28 days', 'YYYY-MM-DD'),
    480,
    8.0,
    'Discovery document review and privilege log preparation',
    'billable',
    150.00,
    1200.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.status = 'active'
ON CONFLICT DO NOTHING;

-- Entry 6: Motion drafting (high value cases)
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '650e8400-e29b-41d4-a716-446655440006',
    c.filing_date + INTERVAL '35 days',
    TO_CHAR(c.filing_date + INTERVAL '35 days', 'YYYY-MM-DD'),
    300,
    5.0,
    'Motion drafting and legal argument development',
    'billable',
    375.00,
    1875.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 1000000
ON CONFLICT DO NOTHING;

-- Entry 7: Case law research
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '650e8400-e29b-41d4-a716-446655440007',
    c.filing_date + INTERVAL '42 days',
    TO_CHAR(c.filing_date + INTERVAL '42 days', 'YYYY-MM-DD'),
    240,
    4.0,
    'Case law research and memorandum preparation',
    'billable',
    125.00,
    500.00,
    'draft',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%'
ON CONFLICT DO NOTHING;

-- Entry 8: Deposition prep (high value cases)
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    'f937bb0d-d9cc-4b76-b18c-0579393a496a',
    c.filing_date + INTERVAL '60 days',
    TO_CHAR(c.filing_date + INTERVAL '60 days', 'YYYY-MM-DD'),
    420,
    7.0,
    'Deposition preparation and witness interview',
    'billable',
    450.00,
    3150.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 5000000
ON CONFLICT DO NOTHING;

-- Entry 9: Deposition attendance (very high value cases)
INSERT INTO time_entries (id, case_id, user_id, work_date, date, duration, hours, description, entry_type, rate, total, status, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    '650e8400-e29b-41d4-a716-446655440004',
    c.filing_date + INTERVAL '75 days',
    TO_CHAR(c.filing_date + INTERVAL '75 days', 'YYYY-MM-DD'),
    540,
    9.0,
    'Deposition attendance and real-time analysis',
    'billable',
    425.00,
    3825.00,
    'approved',
    NOW(),
    NOW()
FROM cases c WHERE c.id::text LIKE 'c0000001-%' AND c.value > 10000000
ON CONFLICT DO NOTHING;
