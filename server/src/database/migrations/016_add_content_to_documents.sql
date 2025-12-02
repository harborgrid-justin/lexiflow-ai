-- Migration: Add content column to documents table
-- Description: Adds content column to store document text content

-- Add content column for storing document text
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add index for text search on content
CREATE INDEX IF NOT EXISTS idx_documents_content_trgm ON documents USING GIN (content gin_trgm_ops);
