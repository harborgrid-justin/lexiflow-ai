-- Add optional profile fields used in the User model
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS office VARCHAR(255),
    ADD COLUMN IF NOT EXISTS user_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS avatar VARCHAR(255),
    ADD COLUMN IF NOT EXISTS last_active TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_office ON users(office);
