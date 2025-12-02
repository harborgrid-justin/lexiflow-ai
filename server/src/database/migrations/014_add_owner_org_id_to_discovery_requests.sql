-- Add owner_org_id column to discovery_requests table
ALTER TABLE discovery_requests
ADD COLUMN IF NOT EXISTS owner_org_id UUID REFERENCES organizations(id);

-- Add index for owner_org_id
CREATE INDEX IF NOT EXISTS idx_discovery_requests_owner_org_id ON discovery_requests(owner_org_id);