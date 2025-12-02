-- Migration: Fix evidence table - update tracking_uuid to UUID type and add missing columns
-- Description: Changes tracking_uuid to UUID, adds blockchain_hash, file_type, file_size, admissibility_status

-- First, drop the old tracking_uuid column if it exists
ALTER TABLE evidence
DROP COLUMN IF EXISTS tracking_uuid;

-- Add tracking_uuid as UUID with default
ALTER TABLE evidence
ADD COLUMN tracking_uuid UUID DEFAULT uuid_generate_v4();

-- Add blockchain_hash column
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS blockchain_hash VARCHAR(255);

-- Add file_type column
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);

-- Add file_size column (using varchar to store formatted sizes like "2.5 MB")
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS file_size VARCHAR(50);

-- Add admissibility_status column
ALTER TABLE evidence
ADD COLUMN IF NOT EXISTS admissibility_status VARCHAR(100);

-- Update tracking_uuid for existing records
UPDATE evidence SET tracking_uuid = uuid_generate_v4() WHERE tracking_uuid IS NULL;

-- Recreate unique index for tracking_uuid
CREATE UNIQUE INDEX IF NOT EXISTS idx_evidence_tracking_uuid ON evidence(tracking_uuid);

-- Add index for blockchain_hash
CREATE INDEX IF NOT EXISTS idx_evidence_blockchain_hash ON evidence(blockchain_hash) WHERE blockchain_hash IS NOT NULL;
