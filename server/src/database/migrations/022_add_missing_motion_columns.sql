-- Migration: Add documents column to motions table
-- Description: Adds documents column to store linked document IDs

-- Add documents column to store comma-separated document IDs
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS documents TEXT;

-- Add created_by column if missing
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add assigned_attorney column
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS assigned_attorney VARCHAR(255);

-- Add opposition_due_date column
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS opposition_due_date VARCHAR(50);

-- Add reply_due_date column
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS reply_due_date VARCHAR(50);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_motions_created_by ON motions(created_by);
