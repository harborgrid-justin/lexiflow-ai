-- Migration: Add collected_by_user_id to evidence table
-- Description: Adds user reference for who collected the evidence

-- Add collected_by_user_id column
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS collected_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_evidence_collected_by_user_id ON evidence(collected_by_user_id);
