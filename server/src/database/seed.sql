-- LexiFlow AI - Initial Seed Data
-- This file provides minimal essential data for a functional system
-- For comprehensive test data, use: npm run db:seed

-- ============================================================================
-- Organizations
-- ============================================================================

-- Default organization
INSERT INTO organizations (id, name, type, description, status, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'LexiFlow Demo Law Firm',
    'Law Firm',
    'Default demonstration organization',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Users
-- ============================================================================

-- System Administrator
-- Email: admin@lexiflow.com
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO users (
    id,
    first_name,
    last_name,
    name,
    email,
    password_hash,
    role,
    position,
    status,
    organization_id,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'System',
    'Administrator',
    'System Administrator',
    'admin@lexiflow.com',
    '$2b$10$lSfiMM5QyHr8ICBBDPmRDedRiCuUUYJIDYJMO6jZ/98HI7Kt2dcg6',
    'Administrator',
    'System Administrator',
    'active',
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Senior Partner
-- Email: partner@lexiflow.com
-- Password: Partner123! (hashed with bcrypt)
INSERT INTO users (
    id,
    first_name,
    last_name,
    name,
    email,
    password_hash,
    role,
    position,
    bar_admission,
    status,
    organization_id,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Jane',
    'Smith',
    'Jane Smith',
    'partner@lexiflow.com',
    '$2b$10$QNiysjzTm9KJHK2QvP0bP.Qg0JUixp0kp.xRxXaGggJ8QxOganQ5G',
    'Senior Partner',
    'Managing Partner',
    'CA',
    'active',
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Jurisdictions (if table exists from migrations)
-- ============================================================================

-- Note: This will fail silently if jurisdictions table doesn't exist yet
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'jurisdictions') THEN
        INSERT INTO jurisdictions (id, code, name, type, country, created_at, updated_at)
        VALUES
            ('00000000-0000-0000-0000-000000000010', 'US-FED', 'Federal Courts', 'federal', 'US', NOW(), NOW()),
            ('00000000-0000-0000-0000-000000000011', 'US-CA', 'California', 'state', 'US', NOW(), NOW()),
            ('00000000-0000-0000-0000-000000000012', 'US-NY', 'New York', 'state', 'US', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- Print Success Message
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Seed data loaded successfully';
    RAISE NOTICE '📧 Admin user: admin@lexiflow.com';
    RAISE NOTICE '📧 Partner user: partner@lexiflow.com';
    RAISE NOTICE '⚠️  Update password hashes before production use!';
END $$;
