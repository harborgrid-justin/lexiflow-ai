-- Migration: Create docket_entries table
-- Description: Creates table to store PACER docket entries with full metadata

CREATE TABLE IF NOT EXISTS docket_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    entry_number INTEGER NOT NULL,
    date_filed TIMESTAMP NOT NULL,
    text TEXT NOT NULL,
    doc_link VARCHAR(500),
    pages INTEGER,
    file_size VARCHAR(50),
    document_type VARCHAR(100),
    cmecf_id VARCHAR(100),
    clerk_initials VARCHAR(10),
    pacer_seq_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_docket_entries_case_id ON docket_entries(case_id);
CREATE INDEX IF NOT EXISTS idx_docket_entries_date_filed ON docket_entries(date_filed);
CREATE INDEX IF NOT EXISTS idx_docket_entries_entry_number ON docket_entries(entry_number);
CREATE INDEX IF NOT EXISTS idx_docket_entries_case_entry ON docket_entries(case_id, entry_number);
CREATE INDEX IF NOT EXISTS idx_docket_entries_document_type ON docket_entries(document_type);
