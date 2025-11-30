-- Initial migration to create all tables for LexiFlow Legal Management System
-- Run after enabling extensions

-- Create Organizations table first (no dependencies)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    license_number VARCHAR(100),
    bar_number VARCHAR(100),
    jurisdiction VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Users table (depends on organizations)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    position VARCHAR(255),
    bar_admission VARCHAR(100),
    bar_number VARCHAR(100),
    phone VARCHAR(50),
    expertise TEXT,
    status VARCHAR(50) DEFAULT 'active',
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Cases table (depends on organizations)
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    opposing_counsel VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    filing_date TIMESTAMP,
    description TEXT,
    value DECIMAL(15,2),
    matter_type VARCHAR(255),
    jurisdiction VARCHAR(255),
    court VARCHAR(255),
    billing_model VARCHAR(100),
    judge VARCHAR(255),
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Documents table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    file_path VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INTEGER,
    version INTEGER DEFAULT 1,
    version_notes TEXT,
    description TEXT,
    tags VARCHAR(255),
    classification VARCHAR(100),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Evidence table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    description TEXT,
    location VARCHAR(255),
    collected_by VARCHAR(255),
    collected_date TIMESTAMP,
    collection_notes TEXT,
    tags VARCHAR(255),
    classification VARCHAR(100),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    custodian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Conversations table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Messages table (depends on conversations, users)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    encrypted BOOLEAN DEFAULT false,
    read_status BOOLEAN DEFAULT false,
    attachment_url VARCHAR(255),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Workflow Stages table (depends on cases, organizations)
CREATE TABLE IF NOT EXISTS workflow_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    "order" INTEGER NOT NULL,
    estimated_duration INTEGER,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Workflow Tasks table (depends on workflow_stages, users)
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    completed_date TIMESTAMP,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    stage_id UUID NOT NULL REFERENCES workflow_stages(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Motions table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS motions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    filing_date TIMESTAMP,
    hearing_date TIMESTAMP,
    decision TEXT,
    outcome VARCHAR(100),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    filed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Time Entries table for billing (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    rate DECIMAL(10,2),
    date DATE NOT NULL,
    billable BOOLEAN DEFAULT true,
    billed BOOLEAN DEFAULT false,
    activity_type VARCHAR(100),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Discovery Requests table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS discovery_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date TIMESTAMP,
    response_date TIMESTAMP,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Clients table (depends on organizations)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    industry VARCHAR(100),
    contact_person VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Analytics table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    data JSONB,
    period VARCHAR(50),
    period_value VARCHAR(100),
    insights TEXT,
    confidence_score DECIMAL(3,2),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Compliance Records table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    compliance_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    risk_level VARCHAR(50),
    audit_date TIMESTAMP,
    findings TEXT,
    remediation_plan TEXT,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Knowledge Articles table (depends on users, organizations)
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    category VARCHAR(100) NOT NULL,
    content TEXT,
    summary TEXT,
    tags VARCHAR(255),
    visibility VARCHAR(50) DEFAULT 'internal',
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Jurisdictions table (depends on organizations, self-referencing)
CREATE TABLE IF NOT EXISTS jurisdictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    country VARCHAR(2) NOT NULL,
    parent_id UUID REFERENCES jurisdictions(id) ON DELETE SET NULL,
    rules JSONB,
    court_website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Calendar Events table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled',
    priority VARCHAR(50) DEFAULT 'medium',
    all_day BOOLEAN DEFAULT false,
    reminder VARCHAR(50),
    notes TEXT,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Tasks table (depends on cases, users, organizations)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    due_date TIMESTAMP,
    start_date TIMESTAMP,
    completed_date TIMESTAMP,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    progress INTEGER DEFAULT 0,
    notes TEXT,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Clauses table (depends on users, organizations)
CREATE TABLE IF NOT EXISTS clauses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    version INTEGER DEFAULT 1,
    version_notes TEXT,
    tags VARCHAR(255),
    usage_count INTEGER DEFAULT 0,
    visibility VARCHAR(50) DEFAULT 'internal',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AI/Vector tables (require pgvector extension)
-- Create Document Embeddings table (depends on documents, users, organizations)
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 embedding size
    model VARCHAR(100) NOT NULL,
    dimension INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    start_position INTEGER,
    end_position INTEGER,
    metadata JSONB,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Legal Citations table (depends on documents, users, organizations)
CREATE TABLE IF NOT EXISTS legal_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_name VARCHAR(255) NOT NULL,
    citation VARCHAR(255) NOT NULL,
    year INTEGER,
    court VARCHAR(255),
    jurisdiction VARCHAR(255),
    area_of_law VARCHAR(255),
    summary TEXT,
    holding TEXT,
    topics VARCHAR(255),
    url VARCHAR(255),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    position_in_document INTEGER,
    added_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    verified BOOLEAN DEFAULT false,
    relevance_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Document Analysis table (depends on documents, users, organizations)
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    results JSONB,
    confidence_score DECIMAL(5,4),
    model_used VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    summary TEXT,
    tags VARCHAR(255),
    initiated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Search Queries table for analytics (depends on users, organizations)
CREATE TABLE IF NOT EXISTS search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_text TEXT NOT NULL,
    search_type VARCHAR(50) NOT NULL,
    query_embedding vector(1536),
    filters JSONB,
    result_count INTEGER,
    result_document_ids UUID[],
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    case_context UUID,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);