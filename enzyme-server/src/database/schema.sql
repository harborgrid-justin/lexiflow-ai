-- LexiFlow Database Schema
-- PostgreSQL Database Setup Script

-- Create database (run this separately as superuser)
-- CREATE DATABASE lexiflow;
-- CREATE USER lexiflow_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE lexiflow TO lexiflow_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

-- Create custom types for better data integrity
CREATE TYPE user_role AS ENUM ('admin', 'attorney', 'paralegal', 'clerk', 'intern', 'client');
CREATE TYPE case_status AS ENUM ('active', 'closed', 'pending', 'settled', 'dismissed');
CREATE TYPE document_status AS ENUM ('draft', 'review', 'approved', 'filed', 'archived');
CREATE TYPE motion_status AS ENUM ('draft', 'filed', 'pending', 'granted', 'denied');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE event_type AS ENUM ('hearing', 'deposition', 'meeting', 'deadline', 'filing', 'court_date');

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_documents_content_search ON documents USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_knowledge_content_search ON knowledge_articles USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_clauses_content_search ON clauses USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_cases_org_status ON cases(owner_org_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_case_type ON documents(case_id, type);
CREATE INDEX IF NOT EXISTS idx_evidence_case_status ON evidence(case_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date_range ON calendar_events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date ON time_entries(user_id, date);

-- Create triggers for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Performance optimization views
CREATE OR REPLACE VIEW case_statistics AS
SELECT 
    c.owner_org_id,
    COUNT(*) as total_cases,
    COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_cases,
    COUNT(CASE WHEN c.status = 'closed' THEN 1 END) as closed_cases,
    AVG(EXTRACT(days FROM (COALESCE(c.updated_at, NOW()) - c.created_at))) as avg_case_duration_days
FROM cases c
GROUP BY c.owner_org_id;

CREATE OR REPLACE VIEW billing_summary AS
SELECT 
    te.case_id,
    te.user_id,
    COUNT(*) as entry_count,
    SUM(te.hours) as total_hours,
    SUM(te.hours * te.rate) as total_amount,
    DATE_TRUNC('month', te.date) as billing_month
FROM time_entries te
GROUP BY te.case_id, te.user_id, DATE_TRUNC('month', te.date);

-- Create audit trail table for sensitive operations
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, operation, old_values, new_values, user_id)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        COALESCE(NEW.created_by, OLD.created_by, NEW.user_id, OLD.user_id)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to sensitive tables (uncomment as needed)
-- CREATE TRIGGER audit_cases AFTER INSERT OR UPDATE OR DELETE ON cases FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON documents FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_evidence AFTER INSERT OR UPDATE OR DELETE ON evidence FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_operation ON audit_log(table_name, operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);