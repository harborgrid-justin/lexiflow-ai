-- Migration: Fix motions table - add back type column alongside motion_type
-- Description: The model uses both type and motion_type columns

-- Add type column back (it should coexist with motion_type)
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS type VARCHAR(100);

-- Copy motion_type values to type if needed
UPDATE motions SET type = motion_type WHERE type IS NULL;

-- Add index for type column
CREATE INDEX IF NOT EXISTS idx_motions_type ON motions(type);
