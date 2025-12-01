-- Migration: Add PACER cross-reference fields
-- Description: Adds docket entry reference fields to motions, documents, and calendar_events

-- Add docket entry references to motions
ALTER TABLE motions
ADD COLUMN IF NOT EXISTS docket_entry_id UUID REFERENCES docket_entries(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS pacer_doc_link VARCHAR(500);

-- Add docket entry references to documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS docket_entry_id UUID REFERENCES docket_entries(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS pacer_doc_link VARCHAR(500);

-- Add docket entry references to calendar_events (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'calendar_events') THEN
        ALTER TABLE calendar_events
        ADD COLUMN IF NOT EXISTS docket_entry_id UUID REFERENCES docket_entries(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS docket_entry_number INTEGER,
        ADD COLUMN IF NOT EXISTS pacer_link VARCHAR(500);
    END IF;
END $$;

-- Create indexes for efficient cross-reference lookups
CREATE INDEX IF NOT EXISTS idx_motions_docket_entry_id ON motions(docket_entry_id);
CREATE INDEX IF NOT EXISTS idx_documents_docket_entry_id ON documents(docket_entry_id);

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'calendar_events') THEN
        CREATE INDEX IF NOT EXISTS idx_calendar_events_docket_entry_id ON calendar_events(docket_entry_id);
    END IF;
END $$;
