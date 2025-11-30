-- Create comprehensive indexes for LexiFlow Legal Management System
-- Run after initial schema creation

-- Primary relationship indexes (most important for performance)
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_cases_owner_org_id ON cases(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_owner_org_id ON documents(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_custodian_id ON evidence(custodian_id);
CREATE INDEX IF NOT EXISTS idx_evidence_owner_org_id ON evidence(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_conversations_case_id ON conversations(case_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_owner_org_id ON conversations(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Workflow and task management indexes
CREATE INDEX IF NOT EXISTS idx_workflow_stages_case_id ON workflow_stages(case_id);
CREATE INDEX IF NOT EXISTS idx_workflow_stages_owner_org_id ON workflow_stages(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_stage_id ON workflow_tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_assignee_id ON workflow_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_created_by ON workflow_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_motions_case_id ON motions(case_id);
CREATE INDEX IF NOT EXISTS idx_motions_filed_by ON motions(filed_by);
CREATE INDEX IF NOT EXISTS idx_motions_owner_org_id ON motions(owner_org_id);

-- Time tracking and billing indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_case_id ON time_entries(case_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_owner_org_id ON time_entries(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_time_entries_billable ON time_entries(billable);
CREATE INDEX IF NOT EXISTS idx_time_entries_billed ON time_entries(billed);

-- Discovery and legal process indexes
CREATE INDEX IF NOT EXISTS idx_discovery_requests_case_id ON discovery_requests(case_id);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_requested_by ON discovery_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_owner_org_id ON discovery_requests(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_clients_owner_org_id ON clients(owner_org_id);

-- Analytics and compliance indexes
CREATE INDEX IF NOT EXISTS idx_analytics_case_id ON analytics(case_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_by ON analytics(created_by);
CREATE INDEX IF NOT EXISTS idx_analytics_owner_org_id ON analytics(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_case_id ON compliance_records(case_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_auditor_id ON compliance_records(auditor_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_owner_org_id ON compliance_records(owner_org_id);

-- Knowledge management indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_author_id ON knowledge_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_modified_by ON knowledge_articles(modified_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_owner_org_id ON knowledge_articles(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_parent_id ON jurisdictions(parent_id);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_owner_org_id ON jurisdictions(owner_org_id);

-- Calendar and task indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_case_id ON calendar_events(case_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_organizer_id ON calendar_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_owner_org_id ON calendar_events(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_tasks_case_id ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_owner_org_id ON tasks(owner_org_id);

-- Clause library indexes
CREATE INDEX IF NOT EXISTS idx_clauses_author_id ON clauses(author_id);
CREATE INDEX IF NOT EXISTS idx_clauses_modified_by ON clauses(modified_by);
CREATE INDEX IF NOT EXISTS idx_clauses_owner_org_id ON clauses(owner_org_id);

-- AI and vector search indexes
CREATE INDEX IF NOT EXISTS idx_document_embeddings_document_id ON document_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_created_by ON document_embeddings(created_by);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_owner_org_id ON document_embeddings(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_legal_citations_document_id ON legal_citations(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_citations_added_by ON legal_citations(added_by);
CREATE INDEX IF NOT EXISTS idx_legal_citations_owner_org_id ON legal_citations(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_document_analysis_document_id ON document_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analysis_initiated_by ON document_analysis(initiated_by);
CREATE INDEX IF NOT EXISTS idx_document_analysis_owner_org_id ON document_analysis(owner_org_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_organization_id ON search_queries(organization_id);

-- Status and type indexes for filtering
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_matter_type ON cases(matter_type);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(type);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(status);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_workflow_stages_status ON workflow_stages(status);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks(status);
CREATE INDEX IF NOT EXISTS idx_motions_type ON motions(type);
CREATE INDEX IF NOT EXISTS idx_motions_status ON motions(status);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_type ON discovery_requests(type);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_status ON discovery_requests(status);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_compliance_records_compliance_type ON compliance_records(compliance_type);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_type ON knowledge_articles(type);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_status ON knowledge_articles(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_type ON jurisdictions(type);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_status ON jurisdictions(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_clauses_type ON clauses(type);
CREATE INDEX IF NOT EXISTS idx_clauses_category ON clauses(category);
CREATE INDEX IF NOT EXISTS idx_clauses_status ON clauses(status);
CREATE INDEX IF NOT EXISTS idx_document_analysis_analysis_type ON document_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_document_analysis_status ON document_analysis(status);

-- Date-based indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_cases_filing_date ON cases(filing_date);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_collected_date ON evidence(collected_date);
CREATE INDEX IF NOT EXISTS idx_motions_filing_date ON motions(filing_date);
CREATE INDEX IF NOT EXISTS idx_motions_hearing_date ON motions(hearing_date);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_due_date ON workflow_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_discovery_requests_due_date ON discovery_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_compliance_records_audit_date ON compliance_records(audit_date);

-- Full-text search indexes using pg_trgm
CREATE INDEX IF NOT EXISTS idx_cases_title_trgm ON cases USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cases_description_trgm ON cases USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_documents_title_trgm ON documents USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_documents_filename_trgm ON documents USING gin(filename gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_evidence_title_trgm ON evidence USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_title_trgm ON knowledge_articles USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_content_trgm ON knowledge_articles USING gin(content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_clauses_title_trgm ON clauses USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_clauses_content_trgm ON clauses USING gin(content gin_trgm_ops);

-- Vector similarity search indexes (for AI features)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_search_queries_embedding ON search_queries USING ivfflat (query_embedding vector_cosine_ops) WITH (lists = 100);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_documents_case_type ON documents(case_id, type);
CREATE INDEX IF NOT EXISTS idx_documents_case_status ON documents(case_id, status);
CREATE INDEX IF NOT EXISTS idx_evidence_case_type ON evidence(case_id, type);
CREATE INDEX IF NOT EXISTS idx_time_entries_case_date ON time_entries(case_id, date);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date ON time_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_stage_status ON workflow_tasks(stage_id, status);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_assignee_status ON workflow_tasks(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_type ON calendar_events(start_time, type);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_case_status ON tasks(case_id, status);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_model_dimension ON document_embeddings(model, dimension);
CREATE INDEX IF NOT EXISTS idx_legal_citations_court_year ON legal_citations(court, year);
CREATE INDEX IF NOT EXISTS idx_search_queries_type_org ON search_queries(search_type, organization_id);

-- Unique indexes for data integrity
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_jurisdictions_code_unique ON jurisdictions(code);

-- Email and communication indexes
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Performance optimization for JSONB fields
CREATE INDEX IF NOT EXISTS idx_analytics_data_gin ON analytics USING gin(data);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_rules_gin ON jurisdictions USING gin(rules);
CREATE INDEX IF NOT EXISTS idx_document_analysis_results_gin ON document_analysis USING gin(results);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_metadata_gin ON document_embeddings USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_search_queries_filters_gin ON search_queries USING gin(filters);

-- Array indexes for efficient array operations
CREATE INDEX IF NOT EXISTS idx_search_queries_result_documents_gin ON search_queries USING gin(result_document_ids);