-- Performance indexes for all tables

-- Organizations table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organizations_created_at ON organizations(created_at);

-- Users table  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_name_trgm ON users USING gin(name gin_trgm_ops);

-- Cases table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_owner_org_id ON cases(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_client_name ON cases(client_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_filing_date ON cases(filing_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_matter_type ON cases(matter_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_jurisdiction ON cases(jurisdiction);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_title_trgm ON cases USING gin(title gin_trgm_ops);

-- Documents table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_case_id ON documents(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_owner_org_id ON documents(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_classification ON documents(classification);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_filename_trgm ON documents USING gin(filename gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_title_trgm ON documents USING gin(title gin_trgm_ops);

-- Evidence table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_custodian_id ON evidence(custodian_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_owner_org_id ON evidence(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_type ON evidence(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_status ON evidence(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_collected_date ON evidence(collected_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_title_trgm ON evidence USING gin(title gin_trgm_ops);

-- Messages and Conversations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_case_id ON conversations(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_owner_org_id ON conversations(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_status ON conversations(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_message_type ON messages(message_type);

-- Workflow tables
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_stages_case_id ON workflow_stages(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_stages_owner_org_id ON workflow_stages(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_stages_status ON workflow_stages(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_stages_order ON workflow_stages("order");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_tasks_stage_id ON workflow_tasks(stage_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_tasks_assignee_id ON workflow_tasks(assignee_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_tasks_created_by ON workflow_tasks(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workflow_tasks_due_date ON workflow_tasks(due_date);

-- Motions table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_case_id ON motions(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_filed_by ON motions(filed_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_owner_org_id ON motions(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_type ON motions(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_status ON motions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_filing_date ON motions(filing_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_hearing_date ON motions(hearing_date);

-- Time entries (billing)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_case_id ON time_entries(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_owner_org_id ON time_entries(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_billable ON time_entries(billable);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_case_date ON time_entries(case_id, date);

-- Discovery requests
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_case_id ON discovery_requests(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_requested_by ON discovery_requests(requested_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_owner_org_id ON discovery_requests(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_type ON discovery_requests(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_status ON discovery_requests(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_discovery_requests_due_date ON discovery_requests(due_date);

-- Clients table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_owner_org_id ON clients(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_name_trgm ON clients USING gin(name gin_trgm_ops);

-- Analytics table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_case_id ON analytics(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_created_by ON analytics(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_owner_org_id ON analytics(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_period ON analytics(period);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_period_value ON analytics(period_value);

-- Compliance records
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_case_id ON compliance_records(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_auditor_id ON compliance_records(auditor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_owner_org_id ON compliance_records(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_compliance_type ON compliance_records(compliance_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_status ON compliance_records(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_risk_level ON compliance_records(risk_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compliance_audit_date ON compliance_records(audit_date);

-- Knowledge articles
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_author_id ON knowledge_articles(author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_modified_by ON knowledge_articles(modified_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_owner_org_id ON knowledge_articles(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_type ON knowledge_articles(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_category ON knowledge_articles(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_status ON knowledge_articles(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_visibility ON knowledge_articles(visibility);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_title_trgm ON knowledge_articles USING gin(title gin_trgm_ops);

-- Jurisdictions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_parent_id ON jurisdictions(parent_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_owner_org_id ON jurisdictions(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_type ON jurisdictions(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_country ON jurisdictions(country);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_code ON jurisdictions(code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jurisdictions_status ON jurisdictions(status);

-- Calendar events
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_case_id ON calendar_events(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_organizer_id ON calendar_events(organizer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_owner_org_id ON calendar_events(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_priority ON calendar_events(priority);

-- Tasks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_case_id ON tasks(case_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_owner_org_id ON tasks(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee_id, status);

-- Clauses
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_author_id ON clauses(author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_modified_by ON clauses(modified_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_owner_org_id ON clauses(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_type ON clauses(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_category ON clauses(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_status ON clauses(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_visibility ON clauses(visibility);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_title_trgm ON clauses USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_content_trgm ON clauses USING gin(content gin_trgm_ops);

-- AI/Vector-specific indexes for new models
-- Document embeddings
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings(document_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_embeddings_owner_org_id ON document_embeddings(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_embeddings_chunk_index ON document_embeddings(chunk_index);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_embeddings_model ON document_embeddings(model);
-- Vector similarity index (requires pgvector extension)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_embeddings_embedding_cosine ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Legal citations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_document_id ON legal_citations(document_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_added_by ON legal_citations(added_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_owner_org_id ON legal_citations(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_case_name ON legal_citations(case_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_citation ON legal_citations(citation);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_year ON legal_citations(year);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_court ON legal_citations(court);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_jurisdiction ON legal_citations(jurisdiction);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_area_of_law ON legal_citations(area_of_law);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_verified ON legal_citations(verified);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_case_name_trgm ON legal_citations USING gin(case_name gin_trgm_ops);

-- Document analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_document_id ON document_analysis(document_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_initiated_by ON document_analysis(initiated_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_owner_org_id ON document_analysis(owner_org_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_analysis_type ON document_analysis(analysis_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_status ON document_analysis(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_model_used ON document_analysis(model_used);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_started_at ON document_analysis(started_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_analysis_completed_at ON document_analysis(completed_at);

-- Search queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_queries_organization_id ON search_queries(organization_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_queries_search_type ON search_queries(search_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_queries_query_text_trgm ON search_queries USING gin(query_text gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_case_type_status ON documents(case_id, type, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_assignee_status_priority ON tasks(assignee_id, status, priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_org_start_time ON calendar_events(owner_org_id, start_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_case_user_date ON time_entries(case_id, user_id, date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_evidence_case_type_status ON evidence(case_id, type, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motions_case_status_filing_date ON motions(case_id, status, filing_date);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_content_fts ON documents USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_content_fts ON cases USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_content_fts ON knowledge_articles USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(summary, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clauses_content_fts ON clauses USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_legal_citations_content_fts ON legal_citations USING gin(to_tsvector('english', coalesce(case_name, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(holding, '')));

-- Partial indexes for common filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cases_active_by_org ON cases(owner_org_id, created_at) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_pending_by_case ON documents(case_id, created_at) WHERE status = 'pending';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_open_by_assignee ON tasks(assignee_id, due_date) WHERE status IN ('pending', 'in_progress');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_upcoming_events ON calendar_events(owner_org_id, start_time) WHERE start_time > NOW();
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_time_entries_billable ON time_entries(case_id, date, hours) WHERE billable = true;