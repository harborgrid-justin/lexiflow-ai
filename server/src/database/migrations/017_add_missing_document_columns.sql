-- Migration: Add missing columns to documents table
-- Description: Adds summary, risk_score, source_module, is_encrypted, shared_with_client, uploaded_by, upload_date, last_modified columns

-- Add summary column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS summary TEXT;

-- Add risk_score column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS risk_score INTEGER;

-- Add source_module column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS source_module VARCHAR(255);

-- Add is_encrypted column with default
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE;

-- Add shared_with_client column with default
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS shared_with_client BOOLEAN DEFAULT FALSE;

-- Add uploaded_by column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(255);

-- Add upload_date column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS upload_date TIMESTAMP;

-- Add last_modified column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_summary_trgm ON documents USING GIN (summary gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_documents_risk_score ON documents(risk_score);
CREATE INDEX IF NOT EXISTS idx_documents_is_encrypted ON documents(is_encrypted);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date);
