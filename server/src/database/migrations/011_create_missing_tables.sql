-- Migration to create all missing tables that have models but no migrations
-- This syncs the database schema with the Sequelize models

-- Create audit_log_entries table
CREATE TABLE IF NOT EXISTS audit_log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(255) NOT NULL,
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create case_members table
CREATE TABLE IF NOT EXISTS case_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create chain_of_custody_events table
CREATE TABLE IF NOT EXISTS chain_of_custody_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    event_date TIMESTAMP NOT NULL,
    action VARCHAR(255) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    notes TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create conflict_checks table
CREATE TABLE IF NOT EXISTS conflict_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name VARCHAR(255) NOT NULL,
    check_date TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    found_in TEXT,
    checked_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create document_versions table
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    upload_date TIMESTAMP NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    content_snapshot TEXT,
    file_path VARCHAR(255),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create ethical_walls table
CREATE TABLE IF NOT EXISTS ethical_walls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    restricted_groups TEXT,
    authorized_users TEXT,
    status VARCHAR(255) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create file_chunks table
CREATE TABLE IF NOT EXISTS file_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content_preview TEXT NOT NULL,
    hash VARCHAR(255) NOT NULL,
    size_bytes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create judge_profiles table
CREATE TABLE IF NOT EXISTS judge_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    court VARCHAR(255) NOT NULL,
    grant_rate_dismiss DECIMAL(5,2),
    grant_rate_summary DECIMAL(5,2),
    avg_case_duration INTEGER,
    tendencies TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create opposing_counsel_profiles table
CREATE TABLE IF NOT EXISTS opposing_counsel_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    firm VARCHAR(255) NOT NULL,
    settlement_rate DECIMAL(5,2),
    trial_rate DECIMAL(5,2),
    avg_settlement_variance DECIMAL(5,2),
    practice_patterns TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create parties table
CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    counsel JSON,
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    linked_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id) ON DELETE CASCADE,
    matter_type VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_groups table (junction table between users and groups)
CREATE TABLE IF NOT EXISTS user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL,
    role VARCHAR(255) DEFAULT 'Member',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    phone VARCHAR(255),
    skills TEXT,
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    notifications_digest VARCHAR(50) DEFAULT 'daily',
    theme_preference VARCHAR(50) DEFAULT 'system',
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create workflow_tasks table (referenced in migrations but no model exists)
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(100) DEFAULT 'pending',
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create docket_entries table
CREATE TABLE IF NOT EXISTS docket_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    entry_number INTEGER NOT NULL,
    date_filed TIMESTAMP NOT NULL,
    text TEXT NOT NULL,
    doc_link VARCHAR(255),
    pages INTEGER,
    file_size VARCHAR(255),
    document_type VARCHAR(255),
    cmecf_id VARCHAR(255),
    clerk_initials VARCHAR(255),
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add owner_org_id column to docket_entries if it doesn't exist
ALTER TABLE docket_entries ADD COLUMN IF NOT EXISTS owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_user_id ON audit_log_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_action ON audit_log_entries(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_resource ON audit_log_entries(resource);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_timestamp ON audit_log_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_entries_ip_address ON audit_log_entries(ip_address);

-- Create indexes for case_members
CREATE INDEX IF NOT EXISTS idx_case_members_case_id ON case_members(case_id);
CREATE INDEX IF NOT EXISTS idx_case_members_user_id ON case_members(user_id);
CREATE INDEX IF NOT EXISTS idx_case_members_role ON case_members(role);

-- Create indexes for chain_of_custody_events
CREATE INDEX IF NOT EXISTS idx_chain_of_custody_events_evidence_id ON chain_of_custody_events(evidence_id);
CREATE INDEX IF NOT EXISTS idx_chain_of_custody_events_event_date ON chain_of_custody_events(event_date);
CREATE INDEX IF NOT EXISTS idx_chain_of_custody_events_action ON chain_of_custody_events(action);

-- Create indexes for conflict_checks
CREATE INDEX IF NOT EXISTS idx_conflict_checks_entity_name ON conflict_checks(entity_name);
CREATE INDEX IF NOT EXISTS idx_conflict_checks_status ON conflict_checks(status);
CREATE INDEX IF NOT EXISTS idx_conflict_checks_checked_by ON conflict_checks(checked_by);
CREATE INDEX IF NOT EXISTS idx_conflict_checks_check_date ON conflict_checks(check_date);

-- Create indexes for document_versions
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_version_number ON document_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_document_versions_uploaded_by ON document_versions(uploaded_by);

-- Create indexes for ethical_walls
CREATE INDEX IF NOT EXISTS idx_ethical_walls_case_id ON ethical_walls(case_id);
CREATE INDEX IF NOT EXISTS idx_ethical_walls_status ON ethical_walls(status);

-- Create indexes for file_chunks
CREATE INDEX IF NOT EXISTS idx_file_chunks_evidence_id ON file_chunks(evidence_id);
CREATE INDEX IF NOT EXISTS idx_file_chunks_page_number ON file_chunks(page_number);
CREATE INDEX IF NOT EXISTS idx_file_chunks_hash ON file_chunks(hash);

-- Create indexes for groups
CREATE INDEX IF NOT EXISTS idx_groups_org_id ON groups(org_id);
CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);

-- Create indexes for judge_profiles
CREATE INDEX IF NOT EXISTS idx_judge_profiles_name ON judge_profiles(name);
CREATE INDEX IF NOT EXISTS idx_judge_profiles_court ON judge_profiles(court);

-- Create indexes for opposing_counsel_profiles
CREATE INDEX IF NOT EXISTS idx_opposing_counsel_profiles_name ON opposing_counsel_profiles(name);
CREATE INDEX IF NOT EXISTS idx_opposing_counsel_profiles_firm ON opposing_counsel_profiles(firm);

-- Create indexes for parties
CREATE INDEX IF NOT EXISTS idx_parties_case_id ON parties(case_id);
CREATE INDEX IF NOT EXISTS idx_parties_type ON parties(type);
CREATE INDEX IF NOT EXISTS idx_parties_role ON parties(role);
CREATE INDEX IF NOT EXISTS idx_parties_linked_org_id ON parties(linked_org_id);
CREATE INDEX IF NOT EXISTS idx_parties_owner_org_id ON parties(owner_org_id);

-- Create indexes for playbooks
CREATE INDEX IF NOT EXISTS idx_playbooks_jurisdiction_id ON playbooks(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_playbooks_matter_type ON playbooks(matter_type);
CREATE INDEX IF NOT EXISTS idx_playbooks_name ON playbooks(name);

-- Create indexes for user_groups
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_group_unique ON user_groups(user_id, group_id);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id_unique ON user_profiles(user_id);

-- Create indexes for workflow_tasks
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_assigned_to ON workflow_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks(status);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_due_date ON workflow_tasks(due_date);
