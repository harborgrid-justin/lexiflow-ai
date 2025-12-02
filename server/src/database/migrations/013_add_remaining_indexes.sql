-- Add remaining owner_org_id indexes after column additions
-- Run after 012_add_missing_columns.sql

-- Primary relationship indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_cases_owner_org_id ON cases(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_documents_owner_org_id ON documents(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_evidence_owner_org_id ON evidence(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_conversations_owner_org_id ON conversations(owner_org_id);
    END IF;
END $$;

-- Workflow and task management indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_stages' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_workflow_stages_owner_org_id ON workflow_stages(owner_org_id);
    END IF;
END $$;

-- Time tracking and billing indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'time_entries' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_time_entries_owner_org_id ON time_entries(owner_org_id);
    END IF;
END $$;

-- Discovery and legal process indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'discovery_requests' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_discovery_requests_owner_org_id ON discovery_requests(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_clients_owner_org_id ON clients(owner_org_id);
    END IF;
END $$;

-- Analytics and compliance indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_analytics_owner_org_id ON analytics(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'compliance_records' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_compliance_records_owner_org_id ON compliance_records(owner_org_id);
    END IF;
END $$;

-- Knowledge management indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'knowledge_articles' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_knowledge_articles_owner_org_id ON knowledge_articles(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jurisdictions' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_jurisdictions_owner_org_id ON jurisdictions(owner_org_id);
    END IF;
END $$;

-- Calendar and task indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendar_events' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_calendar_events_owner_org_id ON calendar_events(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_tasks_owner_org_id ON tasks(owner_org_id);
    END IF;
END $$;

-- Clause library indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clauses' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_clauses_owner_org_id ON clauses(owner_org_id);
    END IF;
END $$;

-- AI and vector search indexes (owner_org_id)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_embeddings' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_document_embeddings_owner_org_id ON document_embeddings(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_citations' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_legal_citations_owner_org_id ON legal_citations(owner_org_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_analysis' AND column_name = 'owner_org_id') THEN
        CREATE INDEX IF NOT EXISTS idx_document_analysis_owner_org_id ON document_analysis(owner_org_id);
    END IF;
END $$;