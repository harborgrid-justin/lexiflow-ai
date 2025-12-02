# Database Management

This directory contains database migrations, seeders, and scripts for the LexiFlow AI platform.

## 📁 Directory Structure

```
database/
├── migrations/          # SQL migration files (numbered)
├── scripts/            # Database management scripts
│   ├── sync.ts         # Full database sync with Sequelize
│   ├── migrate.ts      # Run SQL migrations
│   └── seed.ts         # Seed database with sample data
├── init/               # Docker initialization scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- PostgreSQL 14+ with pgvector extension
- Node.js 18+ with TypeScript
- Environment variables configured in `server/.env`

### NPM Scripts

```bash
# Sync database schema (drops and recreates all tables)
npm run db:sync

# Run migrations (incremental schema updates)
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

## 📝 Database Scripts

### sync.ts
Full database synchronization using Sequelize models. **Warning:** Drops all existing tables.

```bash
npm run db:sync
```

### migrate.ts
Runs numbered SQL migrations from the `migrations/` directory in order.

```bash
npm run db:migrate
```

### seed.ts
Seeds the database with comprehensive sample data including users, cases, documents, and more.

```bash
npm run db:seed
```

## 📊 Database Schema

### Core Tables

**Organizations & Users**
- `organizations` - Law firms and legal entities
- `users` - Attorneys, paralegals, staff
- `user_profiles` - Extended user information

**Cases & Workflow**
- `cases` - Legal matters and case management
- `case_members` - Case team assignments
- `parties` - Case parties and representation
- `workflow_stages` - Case workflow stages
- `workflow_tasks` - Task assignments

**Documents & Evidence**
- `documents` - Document repository
- `document_versions` - Version control
- `evidence` - Evidence management
- `file_chunks` - Document chunking
- `chain_of_custody_events` - Evidence tracking

**Legal Operations**
- `motions` - Legal motions and filings
- `docket_entries` - Court docket tracking
- `discovery_requests` - Discovery management
- `time_entries` - Billing and time tracking

**AI & Search**
- `document_embeddings` - Vector embeddings (pgvector)
- `document_analysis` - AI analysis results
- `legal_citations` - Citation extraction
- `search_queries` - Search analytics

**Communication & Collaboration**
- `conversations` - Secure messaging
- `messages` - Message storage
- `calendar_events` - Scheduling
- `tasks` - Task management

**Additional Features**
- `clients` - Client information
- `attorneys` - Attorney profiles
- `clauses` - Clause library
- `compliance_records` - Compliance tracking
- `analytics` - Case analytics
- `audit_log_entries` - Audit trail

## 🔄 Migration Management

Migrations are numbered SQL files in `migrations/` directory:

- `000_*` - Extensions and prerequisites
- `001_*` - Initial schema
- `002_*` - Indexes and constraints
- `003+` - Incremental schema changes

The migrate script runs all migrations in order and tracks which have been applied.

## 🔒 Environment Variables

Required in `server/.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📈 Performance Features

- **Vector similarity search** using pgvector (1536 dimensions)
- **IVFFlat indexes** for efficient vector queries
- **Full-text search** with trigram indexes
- **GIN indexes** on JSONB metadata fields
- **150+ optimized indexes** for common queries

## 🐛 Troubleshooting

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check migrations have run
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"

# Verify pgvector extension
psql $DATABASE_URL -c "SELECT extname FROM pg_extension WHERE extname = 'vector';"
```

## 📚 Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [Sequelize ORM](https://sequelize.org/docs/v6/)

---

For Docker deployment, see `/docker-compose.yml` which handles initialization automatically.