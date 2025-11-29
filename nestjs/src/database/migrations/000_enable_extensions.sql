-- Enable necessary PostgreSQL extensions for LexiFlow AI
-- This should be run first, before any migrations

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for vector similarity search
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enable pg_trgm for full-text search and trigram indexing
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable pgcrypto for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable fuzzystrmatch for approximate string matching
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";

-- Enable unaccent for removing accents from text
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enable btree_gin for composite indexing
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Show enabled extensions
SELECT extname, extversion FROM pg_extension WHERE extname IN (
    'uuid-ossp', 'vector', 'pg_trgm', 'pgcrypto', 'fuzzystrmatch', 'unaccent', 'btree_gin'
);