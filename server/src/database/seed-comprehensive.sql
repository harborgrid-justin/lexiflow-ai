-- LexiFlow AI - Comprehensive Seed Data
-- This script adds realistic sample data for testing and demonstration

-- ============================================================================
-- Additional Cases
-- ============================================================================

INSERT INTO cases (
    id, title, client_name, opposing_counsel, status, filing_date, 
    description, matter_type, jurisdiction, court, docket_number,
    owner_org_id, created_at, updated_at
)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Smith v. Acme Corporation',
        'Sarah Smith',
        'Davidson & Partners LLP',
        'active',
        '2024-01-15',
        'Employment discrimination lawsuit alleging wrongful termination and hostile work environment',
        'Civil Litigation',
        'California',
        'Superior Court of California, Los Angeles County',
        'CV-2024-001234',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'People v. Johnson',
        'Robert Johnson',
        'Los Angeles District Attorney',
        'active',
        '2024-03-20',
        'Criminal defense case for white-collar fraud charges',
        'Criminal Defense',
        'California',
        'United States District Court, Central District of California',
        'CR-2024-005678',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'TechCo Inc. v. StartupAI LLC',
        'TechCo Inc.',
        'Wilson IP Law Group',
        'active',
        '2024-02-10',
        'Patent infringement litigation regarding AI technology',
        'Intellectual Property',
        'Federal',
        'United States District Court, Northern District of California',
        'IP-2024-002468',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Green Valley LLC v. Urban Developers',
        'Green Valley LLC',
        'Martinez Real Estate Law',
        'discovery',
        '2024-04-05',
        'Real estate dispute over commercial property development rights',
        'Real Estate',
        'California',
        'Superior Court of California, San Diego County',
        'RE-2024-003690',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'In re: Thompson Family Trust',
        'Thompson Estate',
        'Peterson Family Law',
        'pending',
        '2024-05-12',
        'Family law matter regarding estate distribution',
        'Family Law',
        'California',
        'Superior Court of California, Orange County',
        'FA-2024-001357',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Clients
-- ============================================================================

INSERT INTO clients (
    id, name, email, phone, type, status, organization_id, created_at, updated_at
)
VALUES
    (
        'c1111111-1111-1111-1111-111111111111',
        'Sarah Smith',
        'sarah.smith@email.com',
        '+1-555-0101',
        'Individual',
        'Active',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        'c2222222-2222-2222-2222-222222222222',
        'Acme Corporation',
        'legal@acmecorp.com',
        '+1-555-0202',
        'Corporate',
        'Active',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        'TechCo Inc.',
        'counsel@techco.com',
        '+1-555-0303',
        'Corporate',
        'Active',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    ),
    (
        'c4444444-4444-4444-4444-444444444444',
        'Robert Johnson',
        'rjohnson@email.com',
        '+1-555-0404',
        'Individual',
        'Active',
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Parties (Linked to Cases)
-- ============================================================================

INSERT INTO parties (
    id, name, type, role, case_id, created_at, updated_at
)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'Sarah Smith', 'Individual', 'Plaintiff', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
    ('p1111112-1111-1111-1111-111111111111', 'Acme Corporation', 'Entity', 'Defendant', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
    ('p2222221-2222-2222-2222-222222222222', 'People of the State', 'Government', 'Plaintiff', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
    ('p2222222-2222-2222-2222-222222222222', 'Robert Johnson', 'Individual', 'Defendant', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
    ('p3333331-3333-3333-3333-333333333333', 'TechCo Inc.', 'Entity', 'Plaintiff', '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
    ('p3333332-3333-3333-3333-333333333333', 'StartupAI LLC', 'Entity', 'Defendant', '33333333-3333-3333-3333-333333333333', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Documents
-- ============================================================================

INSERT INTO documents (
    id, title, description, type, status, file_path, file_size,
    mime_type, case_id, uploaded_by, created_at, updated_at
)
VALUES
    (
        'd1111111-1111-1111-1111-111111111111',
        'Complaint - Smith v. Acme',
        'Initial complaint filing for employment discrimination case',
        'Pleading',
        'Final',
        '/documents/cv-2024-001234/complaint.pdf',
        245678,
        'application/pdf',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'd1111112-1111-1111-1111-111111111111',
        'Employment Agreement',
        'Original employment contract between Smith and Acme',
        'Contract',
        'Final',
        '/documents/cv-2024-001234/employment-agreement.pdf',
        189234,
        'application/pdf',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'd1111113-1111-1111-1111-111111111111',
        'Email Evidence - Manager Communications',
        'Email thread documenting hostile work environment',
        'Evidence',
        'Final',
        '/documents/cv-2024-001234/emails.pdf',
        567890,
        'application/pdf',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'd2222221-2222-2222-2222-222222222222',
        'Indictment - People v. Johnson',
        'Grand jury indictment for fraud charges',
        'Pleading',
        'Final',
        '/documents/cr-2024-005678/indictment.pdf',
        145678,
        'application/pdf',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'Financial Records Subpoena',
        'Subpoena for defendant financial transaction records',
        'Discovery',
        'Draft',
        '/documents/cr-2024-005678/subpoena-draft.pdf',
        98765,
        'application/pdf',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    ),
    (
        'd3333331-3333-3333-3333-333333333333',
        'Patent Application US-2023-12345',
        'Original patent filing for AI technology',
        'Evidence',
        'Final',
        '/documents/ip-2024-002468/patent-app.pdf',
        1234567,
        'application/pdf',
        '33333333-3333-3333-3333-333333333333',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Docket Entries
-- ============================================================================

INSERT INTO docket_entries (
    id, entry_number, filed_date, description, case_id, created_at, updated_at
)
VALUES
    (
        'de111111-1111-1111-1111-111111111111',
        1,
        '2024-01-15',
        'Complaint filed by Plaintiff Sarah Smith',
        '11111111-1111-1111-1111-111111111111',
        NOW(),
        NOW()
    ),
    (
        'de111112-1111-1111-1111-111111111111',
        2,
        '2024-01-22',
        'Summons issued to Defendant Acme Corporation',
        '11111111-1111-1111-1111-111111111111',
        NOW(),
        NOW()
    ),
    (
        'de111113-1111-1111-1111-111111111111',
        3,
        '2024-02-10',
        'Answer filed by Defendant',
        '11111111-1111-1111-1111-111111111111',
        NOW(),
        NOW()
    ),
    (
        'de111114-1111-1111-1111-111111111111',
        4,
        '2024-02-25',
        'Initial Case Management Conference Order',
        '11111111-1111-1111-1111-111111111111',
        NOW(),
        NOW()
    ),
    (
        'de222221-2222-2222-2222-222222222222',
        1,
        '2024-03-20',
        'Grand Jury Indictment filed',
        '22222222-2222-2222-2222-222222222222',
        NOW(),
        NOW()
    ),
    (
        'de222222-2222-2222-2222-222222222222',
        2,
        '2024-03-25',
        'Arraignment - Defendant enters not guilty plea',
        '22222222-2222-2222-2222-222222222222',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Motions
-- ============================================================================

INSERT INTO motions (
    id, title, type, status, filed_date, hearing_date,
    case_id, filed_by, created_at, updated_at
)
VALUES
    (
        'm1111111-1111-1111-1111-111111111111',
        'Motion for Summary Judgment',
        'Dispositive',
        'Pending',
        '2024-06-01',
        '2024-07-15',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'm1111112-1111-1111-1111-111111111111',
        'Motion to Compel Discovery',
        'Discovery',
        'Granted',
        '2024-04-10',
        '2024-05-05',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'm2222221-2222-2222-2222-222222222222',
        'Motion to Suppress Evidence',
        'Pre-Trial',
        'Under Review',
        '2024-05-20',
        '2024-06-30',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Tasks
-- ============================================================================

INSERT INTO tasks (
    id, title, description, priority, status, due_date,
    case_id, assigned_to, created_by, created_at, updated_at
)
VALUES
    (
        't1111111-1111-1111-1111-111111111111',
        'Draft Summary Judgment Motion',
        'Prepare comprehensive motion for summary judgment with supporting declarations',
        'High',
        'In Progress',
        '2024-06-01',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        't1111112-1111-1111-1111-111111111111',
        'Review Discovery Responses',
        'Analyze defendant discovery responses for inconsistencies',
        'Medium',
        'Completed',
        '2024-05-15',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        't1111113-1111-1111-1111-111111111111',
        'Depose Witness - HR Manager',
        'Schedule and prepare for deposition of Acme HR Manager',
        'High',
        'Scheduled',
        '2024-06-20',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        't2222221-2222-2222-2222-222222222222',
        'Prepare Motion to Suppress Hearing',
        'Research and prepare oral arguments for suppression motion',
        'Critical',
        'In Progress',
        '2024-06-25',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    ),
    (
        't2222222-2222-2222-2222-222222222222',
        'Client Meeting - Trial Strategy',
        'Meet with client to discuss trial strategy and plea options',
        'High',
        'Scheduled',
        '2024-06-10',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    ),
    (
        't3333331-3333-3333-3333-333333333333',
        'Patent Claims Analysis',
        'Detailed analysis of patent claims and prior art',
        'High',
        'In Progress',
        '2024-06-15',
        '33333333-3333-3333-3333-333333333333',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Time Entries (Billable Hours)
-- ============================================================================

INSERT INTO time_entries (
    id, description, hours, rate, case_id, user_id,
    entry_date, created_at, updated_at
)
VALUES
    (
        'te111111-1111-1111-1111-111111111111',
        'Legal research on employment discrimination standards',
        3.5,
        450.00,
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        '2024-05-01',
        NOW(),
        NOW()
    ),
    (
        'te111112-1111-1111-1111-111111111111',
        'Draft complaint and supporting documentation',
        6.0,
        450.00,
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        '2024-05-02',
        NOW(),
        NOW()
    ),
    (
        'te111113-1111-1111-1111-111111111111',
        'Client consultation regarding case strategy',
        2.0,
        450.00,
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        '2024-05-05',
        NOW(),
        NOW()
    ),
    (
        'te222221-2222-2222-2222-222222222222',
        'Review indictment and discovery materials',
        4.5,
        500.00,
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        '2024-05-10',
        NOW(),
        NOW()
    ),
    (
        'te222222-2222-2222-2222-222222222222',
        'Prepare motion to suppress evidence',
        5.0,
        500.00,
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        '2024-05-15',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Calendar Events
-- ============================================================================

INSERT INTO calendar_events (
    id, title, description, event_type, start_time, end_time,
    location, case_id, created_by, created_at, updated_at
)
VALUES
    (
        'ce111111-1111-1111-1111-111111111111',
        'Summary Judgment Hearing',
        'Oral arguments for motion for summary judgment',
        'Hearing',
        '2024-07-15 10:00:00',
        '2024-07-15 12:00:00',
        'Superior Court, Dept. 12',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'ce111112-1111-1111-1111-111111111111',
        'HR Manager Deposition',
        'Deposition of Acme Corporation HR Manager',
        'Deposition',
        '2024-06-20 14:00:00',
        '2024-06-20 17:00:00',
        'LexiFlow Conference Room A',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'ce222221-2222-2222-2222-222222222222',
        'Motion to Suppress Hearing',
        'Pre-trial motion to suppress evidence hearing',
        'Hearing',
        '2024-06-30 09:00:00',
        '2024-06-30 11:00:00',
        'Federal District Court, Courtroom 5',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    ),
    (
        'ce222222-2222-2222-2222-222222222222',
        'Client Strategy Meeting',
        'Discuss trial strategy and plea negotiations',
        'Meeting',
        '2024-06-10 15:00:00',
        '2024-06-10 16:30:00',
        'LexiFlow Conference Room B',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Discovery Requests
-- ============================================================================

INSERT INTO discovery_requests (
    id, request_number, type, description, status, due_date,
    case_id, requested_by, created_at, updated_at
)
VALUES
    (
        'dr111111-1111-1111-1111-111111111111',
        'RFP-001',
        'Request for Production',
        'All employment records for Sarah Smith 2020-2024',
        'Received',
        '2024-03-15',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'dr111112-1111-1111-1111-111111111111',
        'ROG-001',
        'Interrogatories',
        'Written interrogatories to Defendant Acme Corporation',
        'Received',
        '2024-03-15',
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000002',
        NOW(),
        NOW()
    ),
    (
        'dr222221-2222-2222-2222-222222222222',
        'SUBP-001',
        'Subpoena',
        'Financial records from Bank of America 2020-2024',
        'Pending',
        '2024-06-01',
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000003',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Print Success Message
-- ============================================================================

DO $$
DECLARE
    case_count INT;
    doc_count INT;
    task_count INT;
BEGIN
    SELECT COUNT(*) INTO case_count FROM cases;
    SELECT COUNT(*) INTO doc_count FROM documents;
    SELECT COUNT(*) INTO task_count FROM tasks;
    
    RAISE NOTICE '✅ Comprehensive seed data loaded successfully';
    RAISE NOTICE '📊 Database now contains:';
    RAISE NOTICE '   - % cases', case_count;
    RAISE NOTICE '   - % documents', doc_count;
    RAISE NOTICE '   - % tasks', task_count;
    RAISE NOTICE '   - Parties, docket entries, motions, time entries, calendar events, and discovery requests';
    RAISE NOTICE '🎉 Your LexiFlow demo environment is ready!';
END $$;
