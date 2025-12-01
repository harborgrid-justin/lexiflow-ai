#!/bin/bash
# PostgreSQL initialization script for LexiFlow AI
# This script runs automatically when the PostgreSQL container is first created

set -e

echo "🚀 Initializing LexiFlow database..."

# Enable pgvector extension
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable pgvector extension for semantic search
    CREATE EXTENSION IF NOT EXISTS vector;
    
    -- Create additional extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    
    -- Verify extensions are enabled
    SELECT extname, extversion FROM pg_extension WHERE extname IN ('vector', 'uuid-ossp', 'pg_trgm');
    
    -- Grant necessary permissions
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    
    -- Set timezone to UTC for consistency
    ALTER DATABASE $POSTGRES_DB SET timezone TO 'UTC';
EOSQL

echo "✅ LexiFlow database initialized successfully!"
echo "📊 Extensions enabled: vector, uuid-ossp, pg_trgm"
