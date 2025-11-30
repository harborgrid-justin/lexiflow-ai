# Database Setup and Migration Guide

This directory contains all the necessary files to set up and manage the LexiFlow AI Legal Management System database.

## 📁 Directory Structure

```
database/
├── migrations/           # Database schema migrations
│   ├── 000_enable_extensions.sql
│   ├── 001_initial_schema.sql
│   └── 002_create_indexes.sql
├── seeders/             # Sample data seeders
│   └── 003_sample_data.sql
├── scripts/             # Setup and utility scripts
│   ├── setup_database.sh     # Linux/macOS setup script
│   └── setup_database.ps1    # Windows PowerShell setup script
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

1. **PostgreSQL 14+** installed and running
2. **pgvector extension** available (install with: `CREATE EXTENSION vector;`)
3. **Superuser access** to PostgreSQL for initial setup

### Windows Setup

```powershell
# Navigate to the scripts directory
cd backend/src/database/scripts

# Run the PowerShell setup script
./setup_database.ps1

# Or with custom parameters
./setup_database.ps1 -DBName "my_lexiflow" -DBUser "my_user" -DBPassword "my_password"

# Skip sample data
./setup_database.ps1 -SkipSampleData
```

### Linux/macOS Setup

```bash
# Navigate to the scripts directory
cd backend/src/database/scripts

# Make script executable
chmod +x setup_database.sh

# Run the setup script
./setup_database.sh
```

## 📊 Database Schema Overview

### Core Tables (22 total)

| Table Name | Purpose | Dependencies |
|------------|---------|--------------|
| `organizations` | Law firms, corporations, government entities | None |
| `users` | Attorneys, paralegals, staff | organizations |
| `cases` | Legal matters and cases | organizations |
| `documents` | Case documents and files | cases, users |
| `evidence` | Evidence management | cases, users |
| `conversations` | Secure messaging | cases, users |
| `messages` | Individual messages | conversations, users |
| `workflow_stages` | Case workflow management | cases |
| `workflow_tasks` | Individual workflow tasks | workflow_stages, users |
| `motions` | Legal motions and filings | cases, users |
| `time_entries` | Billing and time tracking | cases, users |
| `discovery_requests` | Discovery management | cases, users |
| `clients` | Client information | organizations |
| `analytics` | Case analytics and insights | cases, users |
| `compliance_records` | Compliance tracking | cases, users |
| `knowledge_articles` | Knowledge management | users |
| `jurisdictions` | Legal jurisdictions | organizations |
| `calendar_events` | Calendar and scheduling | cases, users |
| `tasks` | Task management | cases, users |
| `clauses` | Clause library | users |

### AI-Powered Tables

| Table Name | Purpose | Vector Support |
|------------|---------|----------------|
| `document_embeddings` | Document vector embeddings | ✅ pgvector |
| `legal_citations` | Legal citation extraction | No |
| `document_analysis` | AI document analysis | No |
| `search_queries` | Search query analytics | ✅ pgvector |

## 🔧 Manual Setup Steps

If you prefer manual setup or need to troubleshoot:

### 1. Enable Extensions

```sql
-- Run in PostgreSQL as superuser
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

### 2. Create Database Schema

```bash
psql -h localhost -U lexiflow_user -d lexiflow_ai -f migrations/001_initial_schema.sql
```

### 3. Create Indexes

```bash
psql -h localhost -U lexiflow_user -d lexiflow_ai -f migrations/002_create_indexes.sql
```

### 4. Insert Sample Data (Optional)

```bash
psql -h localhost -U lexiflow_user -d lexiflow_ai -f seeders/003_sample_data.sql
```

## 📈 Performance Features

### Vector Similarity Search
- **Document embeddings** using OpenAI ada-002 (1536 dimensions)
- **IVFFlat indexes** for efficient similarity queries
- **Cosine similarity** search for document retrieval

### Full-Text Search
- **Trigram indexes** on text fields for fuzzy matching
- **GIN indexes** on JSONB fields for metadata search
- **Composite indexes** for common query patterns

### Query Optimization
- **150+ indexes** covering all common access patterns
- **Foreign key indexes** for join optimization
- **Date-based indexes** for time-series queries
- **Status/type indexes** for filtering

## 🔒 Security Features

### Data Protection
- **Encrypted passwords** using bcrypt
- **Row-level security** ready (organizations)
- **Audit trails** with created_at/updated_at timestamps
- **Soft deletes** via status fields

### Access Control
- **Organization-based isolation** via owner_org_id
- **User role management** (admin, attorney, paralegal)
- **Document classification** levels

## 📋 Sample Data Overview

The seed file includes:

- **3 Organizations**: Law firm, in-house legal, government
- **5 Users**: Partners, associates, paralegals with different roles
- **3 Clients**: Corporate, individual, startup clients
- **3 Cases**: Contract dispute, estate planning, corporate matter
- **3 Documents**: Contracts, motions, trust agreements
- **2 Evidence items**: Email communications, signed contracts
- **Workflow stages and tasks** for litigation management
- **Time entries** for billing
- **Calendar events** for scheduling
- **Knowledge articles** and clause library
- **Jurisdictional rules** for Texas, New York, California

## 🧪 Testing the Setup

### Verify Extensions

```sql
SELECT extname, extversion 
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm');
```

### Check Table Counts

```sql
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Test Vector Search

```sql
SELECT count(*) 
FROM document_embeddings 
WHERE embedding IS NOT NULL;
```

### Verify Relationships

```sql
SELECT 
    c.title as case_title,
    d.title as document_title,
    u.name as created_by
FROM cases c
JOIN documents d ON c.id = d.case_id
JOIN users u ON d.created_by = u.id;
```

## 🔄 Migration Management

### Adding New Migrations

1. Create new migration file: `004_your_migration_name.sql`
2. Follow naming convention: `[number]_[description].sql`
3. Include rollback instructions in comments
4. Test on development environment first

### Best Practices

- **Always backup** before running migrations
- **Test migrations** on sample data
- **Document changes** in migration comments
- **Use transactions** for atomic operations
- **Verify indexes** after schema changes

## 🐛 Troubleshooting

### Common Issues

1. **Extension not found**: Install pgvector extension
2. **Permission denied**: Run as database superuser
3. **Connection refused**: Check PostgreSQL service status
4. **Out of disk space**: Monitor database size during setup

### Useful Commands

```bash
# Check PostgreSQL service status
systemctl status postgresql   # Linux
Get-Service postgresql*        # Windows PowerShell

# Test database connection
psql -h localhost -U lexiflow_user -d lexiflow_ai -c "SELECT version();"

# View database size
psql -c "SELECT pg_size_pretty(pg_database_size('lexiflow_ai'));"

# Check active connections
psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='lexiflow_ai';"
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [NestJS Database Integration](https://docs.nestjs.com/techniques/database)
- [Sequelize ORM Documentation](https://sequelize.org/docs/v6/)

## 🤝 Contributing

When adding new tables or modifying existing ones:

1. Update the migration files
2. Add appropriate indexes in `002_create_indexes.sql`
3. Include sample data in `003_sample_data.sql`
4. Update this README with new table information
5. Test the complete setup script

---

**Need Help?** Check the troubleshooting section or review the setup logs for detailed error information.