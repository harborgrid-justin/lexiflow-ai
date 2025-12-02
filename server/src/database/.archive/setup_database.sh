#!/bin/bash

# LexiFlow AI Database Setup Script
# This script sets up the PostgreSQL database with all necessary extensions, schemas, indexes, and sample data

set -e  # Exit on any error

# Configuration
DB_NAME="lexiflow_ai"
DB_USER="lexiflow_user"
DB_PASSWORD="lexiflow_password"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting LexiFlow AI Database Setup${NC}"

# Check if PostgreSQL is running
echo -e "${YELLOW}📋 Checking PostgreSQL service...${NC}"
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
    echo -e "${YELLOW}💡 Please start PostgreSQL service and try again${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ File not found: $file${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📄 $description...${NC}"
    
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $description completed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to execute: $description${NC}"
        echo -e "${YELLOW}💡 Please check the file and try again: $file${NC}"
        exit 1
    fi
}

# Function to check if database exists
database_exists() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"
}

# Function to check if user exists
user_exists() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1
}

# Create database user if it doesn't exist (requires superuser access)
echo -e "${YELLOW}👤 Checking database user...${NC}"
if ! user_exists; then
    echo -e "${YELLOW}➕ Creating database user: $DB_USER${NC}"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB CREATEROLE;"
    echo -e "${GREEN}✅ Database user created${NC}"
else
    echo -e "${GREEN}✅ Database user exists${NC}"
fi

# Create database if it doesn't exist
echo -e "${YELLOW}🗄️  Checking database...${NC}"
if ! database_exists; then
    echo -e "${YELLOW}➕ Creating database: $DB_NAME${NC}"
    PGPASSWORD="$DB_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${GREEN}✅ Database exists${NC}"
fi

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/../migrations"
SEEDERS_DIR="$SCRIPT_DIR/../seeders"

# Run migrations in order
echo -e "${GREEN}🔧 Running database migrations...${NC}"

# 1. Enable extensions
run_sql_file "$MIGRATIONS_DIR/000_enable_extensions.sql" "Enabling PostgreSQL extensions"

# 2. Create initial schema
run_sql_file "$MIGRATIONS_DIR/001_initial_schema.sql" "Creating initial database schema"

# 3. Create indexes
run_sql_file "$MIGRATIONS_DIR/002_create_indexes.sql" "Creating database indexes"

# Run seeders (optional)
echo -e "${YELLOW}🌱 Do you want to populate the database with sample data? (y/N)${NC}"
read -r -n 1 -t 10 response || response="n"
echo

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🌱 Populating database with sample data...${NC}"
    run_sql_file "$SEEDERS_DIR/003_sample_data.sql" "Inserting sample data"
else
    echo -e "${YELLOW}⏭️  Skipping sample data population${NC}"
fi

# Verify setup
echo -e "${GREEN}🔍 Verifying database setup...${NC}"

# Check if vector extension is enabled
VECTOR_CHECK=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT count(*) FROM pg_extension WHERE extname='vector'")
if [ "$VECTOR_CHECK" -eq 1 ]; then
    echo -e "${GREEN}✅ Vector extension is enabled${NC}"
else
    echo -e "${RED}❌ Vector extension is not enabled${NC}"
fi

# Count tables
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")
echo -e "${GREEN}✅ Created $TABLE_COUNT database tables${NC}"

# Count indexes
INDEX_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT count(*) FROM pg_indexes WHERE schemaname='public'")
echo -e "${GREEN}✅ Created $INDEX_COUNT database indexes${NC}"

echo -e "${GREEN}🎉 LexiFlow AI Database Setup Complete!${NC}"
echo -e "${YELLOW}📋 Database Details:${NC}"
echo -e "   Database: $DB_NAME"
echo -e "   Host: $DB_HOST:$DB_PORT"
echo -e "   User: $DB_USER"
echo -e "   Tables: $TABLE_COUNT"
echo -e "   Indexes: $INDEX_COUNT"
echo ""
echo -e "${GREEN}🔗 Connection String:${NC}"
echo -e "   postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo -e "   1. Update your .env file with the database connection details"
echo -e "   2. Start your NestJS application"
echo -e "   3. Test the API endpoints"
echo ""