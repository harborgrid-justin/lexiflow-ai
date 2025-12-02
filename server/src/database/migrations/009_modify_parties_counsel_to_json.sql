-- Migration: Modify parties table for PACER integration
-- Description: Changes counsel column from VARCHAR to JSONB to support multiple attorneys
-- Note: This migration is conditional - it only runs if the parties table exists

DO $$
BEGIN
    -- Check if parties table exists
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'parties') THEN
        -- Add the new JSONB column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'parties' AND column_name = 'counsel_json'
        ) THEN
            ALTER TABLE parties ADD COLUMN counsel_json JSONB;
        END IF;

        -- Copy existing VARCHAR counsel data to the JSONB column
        UPDATE parties 
        SET counsel_json = to_jsonb(counsel) 
        WHERE counsel IS NOT NULL AND counsel_json IS NULL;

        -- Drop the old VARCHAR column if it exists
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'parties' AND column_name = 'counsel' AND data_type != 'jsonb'
        ) THEN
            ALTER TABLE parties DROP COLUMN counsel;
        END IF;

        -- Rename the new column to counsel if needed
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'parties' AND column_name = 'counsel_json'
        ) THEN
            ALTER TABLE parties RENAME COLUMN counsel_json TO counsel;
        END IF;

        -- Add GIN index for efficient JSONB queries
        IF NOT EXISTS (
            SELECT FROM pg_indexes WHERE indexname = 'idx_parties_counsel_gin'
        ) THEN
            CREATE INDEX idx_parties_counsel_gin ON parties USING GIN (counsel);
        END IF;

        RAISE NOTICE 'Migration 009: Updated parties.counsel to JSONB';
    ELSE
        RAISE NOTICE 'Migration 009: Skipped - parties table does not exist yet';
    END IF;
END $$;
