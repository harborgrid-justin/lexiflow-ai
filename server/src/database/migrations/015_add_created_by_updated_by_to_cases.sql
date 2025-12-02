-- Migration: Add created_by and updated_by columns to cases table
-- Description: Adds audit fields to track who created and last updated cases

-- Add created_by column
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add updated_by column  
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_created_by ON cases(created_by);
CREATE INDEX IF NOT EXISTS idx_cases_updated_by ON cases(updated_by);
