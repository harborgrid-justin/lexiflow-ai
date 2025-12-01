-- Migration: Create consolidated_cases table
-- Description: Creates table to track consolidated and related case relationships

CREATE TABLE IF NOT EXISTS consolidated_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_case_number VARCHAR(255),
    member_case_number VARCHAR(255),
    lead_case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    member_case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    association_type VARCHAR(100) DEFAULT 'Consolidated',
    date_start TIMESTAMP,
    date_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient relationship lookups
CREATE INDEX IF NOT EXISTS idx_consolidated_cases_lead_id ON consolidated_cases(lead_case_id);
CREATE INDEX IF NOT EXISTS idx_consolidated_cases_member_id ON consolidated_cases(member_case_id);
CREATE INDEX IF NOT EXISTS idx_consolidated_cases_lead_number ON consolidated_cases(lead_case_number);
CREATE INDEX IF NOT EXISTS idx_consolidated_cases_member_number ON consolidated_cases(member_case_number);
