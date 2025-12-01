-- Add optional profile fields used by the Organization model and API responses
ALTER TABLE organizations
    ADD COLUMN IF NOT EXISTS domain VARCHAR(255),
    ADD COLUMN IF NOT EXISTS logo VARCHAR(255),
    ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(100),
    ADD COLUMN IF NOT EXISTS practice_areas TEXT,
    ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_organizations_domain ON organizations(domain);
