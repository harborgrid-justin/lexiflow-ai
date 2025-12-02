-- Add missing columns to existing tables to match Sequelize models

-- Add owner_org_id to parties table
ALTER TABLE parties ADD COLUMN IF NOT EXISTS owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_parties_owner_org_id ON parties(owner_org_id);

-- Add missing owner_org_id column to case_members table
ALTER TABLE case_members ADD COLUMN IF NOT EXISTS owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Add index for owner_org_id in case_members
CREATE INDEX IF NOT EXISTS idx_case_members_owner_org_id ON case_members(owner_org_id);
