-- Migration: Add tracking_uuid column to evidence table
-- Description: Adds tracking UUID for evidence chain of custody

-- Add tracking_uuid column
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS tracking_uuid VARCHAR(255);

-- Add unique index for tracking_uuid
CREATE UNIQUE INDEX IF NOT EXISTS idx_evidence_tracking_uuid ON evidence(tracking_uuid) WHERE tracking_uuid IS NOT NULL;
