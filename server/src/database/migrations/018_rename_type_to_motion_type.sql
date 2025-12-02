-- Migration: Rename type column to motion_type in motions table
-- Description: Aligns database schema with Sequelize model

-- Rename type to motion_type
ALTER TABLE motions
RENAME COLUMN type TO motion_type;

-- Recreate index with new column name
DROP INDEX IF EXISTS idx_motions_type;
CREATE INDEX IF NOT EXISTS idx_motions_motion_type ON motions(motion_type);
