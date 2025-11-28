-- Enable UUID extension if we decide to use it later
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    domain TEXT NOT NULL,
    logo TEXT,
    status TEXT NOT NULL
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    org_id TEXT REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT[]
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL,
    office TEXT,
    org_id TEXT REFERENCES organizations(id),
    user_type TEXT,
    avatar TEXT
);

-- User Profiles (Extended info)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    bio TEXT,
    phone TEXT,
    skills TEXT[],
    notifications JSONB, -- Preferences
    theme_preference TEXT,
    last_active TIMESTAMP
);

-- Case Members (Many-to-Many)
CREATE TABLE IF NOT EXISTS case_members (
    case_id TEXT REFERENCES cases(id),
    user_id TEXT REFERENCES users(id),
    role TEXT NOT NULL, -- 'Lead', 'Associate', 'Paralegal', 'Observer'
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (case_id, user_id)
);

-- User Groups (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_groups (
    user_id TEXT REFERENCES users(id),
    group_id TEXT REFERENCES groups(id),
    PRIMARY KEY (user_id, group_id)
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    status TEXT NOT NULL,
    total_billed DECIMAL,
    risk_score DECIMAL,
    org_id TEXT REFERENCES organizations(id)
);

-- Cases
CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL, -- Denormalized or link to clients? Keeping simple for now matching interface
    opposing_counsel TEXT,
    status TEXT NOT NULL,
    filing_date TIMESTAMP,
    description TEXT,
    value DECIMAL,
    matter_type TEXT,
    jurisdiction TEXT,
    court TEXT,
    billing_model TEXT,
    judge TEXT,
    owner_org_id TEXT REFERENCES organizations(id),
    created_by TEXT REFERENCES users(id)
);

-- Link Clients to Cases (Many-to-Many based on interface 'matters' array)
CREATE TABLE IF NOT EXISTS client_cases (
    client_id TEXT REFERENCES clients(id),
    case_id TEXT REFERENCES cases(id),
    PRIMARY KEY (client_id, case_id)
);

-- Parties
CREATE TABLE IF NOT EXISTS parties (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id), -- Added case_id to link party to case directly
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    type TEXT NOT NULL,
    counsel TEXT,
    linked_org_id TEXT REFERENCES organizations(id)
);

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id),
    date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    description TEXT NOT NULL,
    rate DECIMAL NOT NULL,
    total DECIMAL NOT NULL,
    status TEXT NOT NULL,
    user_id TEXT REFERENCES users(id)
);

-- Clauses
CREATE TABLE IF NOT EXISTS clauses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    version INTEGER NOT NULL,
    usage_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP,
    risk_rating TEXT
);

-- Clause Versions
CREATE TABLE IF NOT EXISTS clause_versions (
    id TEXT PRIMARY KEY,
    clause_id TEXT REFERENCES clauses(id),
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    author TEXT,
    date TIMESTAMP
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    upload_date TIMESTAMP,
    summary TEXT,
    risk_score DECIMAL,
    tags TEXT[],
    last_modified TIMESTAMP,
    source_module TEXT,
    status TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    shared_with_client BOOLEAN DEFAULT FALSE,
    file_size TEXT,
    uploaded_by TEXT REFERENCES users(id)
);

-- Document Versions
CREATE TABLE IF NOT EXISTS document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES documents(id),
    version_number INTEGER NOT NULL,
    upload_date TIMESTAMP,
    uploaded_by TEXT,
    summary TEXT,
    content_snapshot TEXT
);

-- Workflow Stages
CREATE TABLE IF NOT EXISTS workflow_stages (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id), -- Link stage to case
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    "order" INTEGER -- To keep order of stages
);

-- Workflow Tasks
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id TEXT PRIMARY KEY,
    stage_id TEXT REFERENCES workflow_stages(id),
    case_id TEXT REFERENCES cases(id),
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    assignee TEXT,
    due_date TIMESTAMP,
    priority TEXT,
    sla_warning BOOLEAN DEFAULT FALSE,
    automated_trigger TEXT,
    related_module TEXT,
    action_label TEXT,
    description TEXT,
    created_by TEXT REFERENCES users(id)
);

-- Motions
CREATE TABLE IF NOT EXISTS motions (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    filing_date TIMESTAMP,
    hearing_date TIMESTAMP,
    outcome TEXT,
    assigned_attorney TEXT,
    opposition_due_date TIMESTAMP,
    reply_due_date TIMESTAMP,
    created_by TEXT REFERENCES users(id)
);

-- Discovery Requests
CREATE TABLE IF NOT EXISTS discovery_requests (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id),
    type TEXT NOT NULL,
    propounding_party TEXT,
    responding_party TEXT,
    service_date TIMESTAMP,
    due_date TIMESTAMP,
    status TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    response_preview TEXT
);

-- Evidence Items
CREATE TABLE IF NOT EXISTS evidence_items (
    id TEXT PRIMARY KEY,
    tracking_uuid TEXT,
    blockchain_hash TEXT,
    case_id TEXT REFERENCES cases(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    description TEXT,
    collection_date TIMESTAMP,
    collected_by TEXT,
    collected_by_user_id TEXT REFERENCES users(id),
    custodian TEXT,
    location TEXT,
    admissibility TEXT,
    tags TEXT[]
);

-- Chain of Custody Events
CREATE TABLE IF NOT EXISTS chain_of_custody_events (
    id TEXT PRIMARY KEY,
    evidence_id TEXT REFERENCES evidence_items(id),
    date TIMESTAMP NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    notes TEXT
);

-- Timeline Events
CREATE TABLE IF NOT EXISTS timeline_events (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id), -- Assuming events belong to a case
    date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    "user" TEXT,
    related_id TEXT
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    "user" TEXT NOT NULL,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip TEXT
);

-- Conflict Checks
CREATE TABLE IF NOT EXISTS conflict_checks (
    id TEXT PRIMARY KEY,
    entity_name TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    found_in TEXT[],
    checked_by TEXT
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    is_external BOOLEAN DEFAULT FALSE,
    unread INTEGER DEFAULT 0,
    status TEXT,
    draft TEXT
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    sender_id TEXT REFERENCES users(id), -- Linked to users
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    is_privileged BOOLEAN DEFAULT FALSE,
    attachments JSONB
);

-- Conversation Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id TEXT REFERENCES conversations(id),
    user_id TEXT REFERENCES users(id),
    last_read TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

-- Ethical Walls
CREATE TABLE IF NOT EXISTS ethical_walls (
    id TEXT PRIMARY KEY,
    case_id TEXT REFERENCES cases(id),
    title TEXT NOT NULL,
    restricted_groups TEXT[],
    authorized_users TEXT[],
    status TEXT NOT NULL
);

-- Firm Processes
CREATE TABLE IF NOT EXISTS firm_processes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    triggers TEXT,
    tasks INTEGER,
    completed INTEGER,
    owner TEXT
);

-- Legal Holds
CREATE TABLE IF NOT EXISTS legal_holds (
    id TEXT PRIMARY KEY,
    custodian TEXT NOT NULL,
    dept TEXT,
    issued TIMESTAMP NOT NULL,
    status TEXT NOT NULL
);

-- Privilege Logs
CREATE TABLE IF NOT EXISTS privilege_logs (
    id TEXT PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    author TEXT,
    recipient TEXT,
    type TEXT,
    basis TEXT,
    description TEXT
);

-- Jurisdictions
CREATE TABLE IF NOT EXISTS jurisdictions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Federal', 'State', 'Regulatory', 'International', 'Arbitration'
    parent_id TEXT,
    metadata JSONB -- Stores judges count, eFiling info, system provider, status, level, region etc.
);

-- Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_base (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Playbook', 'Q&A', 'Precedent'
    summary TEXT,
    content TEXT,
    tags TEXT[],
    author TEXT,
    last_updated TIMESTAMP,
    metadata JSONB -- Stores similarity score, related cases, etc.
);

-- Research Sessions
CREATE TABLE IF NOT EXISTS research_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id), -- Link to user if available
    query TEXT NOT NULL,
    response TEXT,
    sources JSONB, -- Array of source objects
    timestamp TIMESTAMP NOT NULL,
    feedback TEXT -- 'positive', 'negative'
);

