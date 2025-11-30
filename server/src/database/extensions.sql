-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm extension for trigram similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable btree_gist extension for additional index types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Enable full text search extensions
CREATE EXTENSION IF NOT EXISTS unaccent;