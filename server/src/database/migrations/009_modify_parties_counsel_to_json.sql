-- Migration: Modify parties table for PACER integration
-- Description: Changes counsel column from VARCHAR to JSONB to support multiple attorneys

-- First, add the new JSONB column
ALTER TABLE parties 
ADD COLUMN IF NOT EXISTS counsel_json JSONB;

-- Copy existing VARCHAR counsel data to the JSONB column (as a simple string value in JSON)
UPDATE parties 
SET counsel_json = to_jsonb(counsel) 
WHERE counsel IS NOT NULL AND counsel_json IS NULL;

-- Drop the old VARCHAR column
ALTER TABLE parties 
DROP COLUMN IF EXISTS counsel;

-- Rename the new column to counsel
ALTER TABLE parties 
RENAME COLUMN counsel_json TO counsel;

-- Add GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_parties_counsel_gin ON parties USING GIN (counsel);
