#!/usr/bin/env node
/**
 * Database Sync Script
 * Drops all tables, recreates schema, and seeds with sample data
 *
 * Usage: node sync-database.js [--seed-only]
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

async function runSqlFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  Skipping ${description} - file not found: ${filePath}`);
    return;
  }

  console.log(`  📄 Running ${description}...`);
  const sql = fs.readFileSync(fullPath, 'utf8');

  // Split by semicolons but be careful with strings
  const statements = sql
    .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await client.query(statement);
    } catch (error) {
      // Ignore "already exists" or "does not exist" errors
      if (!error.message.includes('already exists') &&
          !error.message.includes('does not exist') &&
          !error.message.includes('duplicate key')) {
        console.error(`    ❌ Error: ${error.message}`);
        console.error(`    Statement: ${statement.substring(0, 100)}...`);
      }
    }
  }
  console.log(`  ✅ ${description} completed`);
}

async function dropAllTables() {
  console.log('🗑️  Dropping all tables...');

  const dropQuery = `
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      -- Disable triggers
      SET session_replication_role = 'replica';

      -- Drop all tables in public schema
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
      LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;

      -- Re-enable triggers
      SET session_replication_role = 'origin';
    END $$;
  `;

  try {
    await client.query(dropQuery);
    console.log('  ✅ All tables dropped');
  } catch (error) {
    console.error('  ❌ Error dropping tables:', error.message);
  }
}

async function syncDatabase(seedOnly = false) {
  console.log('🚀 LexiFlow Database Sync');
  console.log('========================\n');
  console.log(`📡 Connecting to database...`);

  try {
    await client.connect();
    console.log('  ✅ Connected successfully\n');

    if (!seedOnly) {
      // Drop all tables
      await dropAllTables();
      console.log('');

      // Run migrations in order
      console.log('📦 Running migrations...');
      await runSqlFile('migrations/000_enable_extensions.sql', 'Enable Extensions');
      await runSqlFile('migrations/001_initial_schema.sql', 'Initial Schema');
      await runSqlFile('migrations/002_create_indexes.sql', 'Create Indexes');
      console.log('');
    }

    // Seed data
    console.log('🌱 Seeding database...');

    // Clear existing data first if seed-only
    if (seedOnly) {
      console.log('  🗑️  Clearing existing data...');
      const tables = [
        'document_analysis', 'search_queries', 'legal_citations', 'document_embeddings',
        'time_entries', 'calendar_events', 'workflow_tasks', 'workflow_stages',
        'clauses', 'knowledge_articles', 'jurisdictions', 'evidence', 'documents',
        'cases', 'clients', 'users', 'organizations'
      ];
      for (const table of tables) {
        try {
          await client.query(`DELETE FROM ${table}`);
        } catch (e) {
          // Table might not exist
        }
      }
    }

    await runSqlFile('seeders/003_sample_data.sql', 'Sample Data');
    console.log('');

    // Verify data
    console.log('✅ Verifying seeded data...');
    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM organizations) as organizations,
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM cases) as cases,
        (SELECT COUNT(*) FROM documents) as documents,
        (SELECT COUNT(*) FROM clients) as clients
    `);

    const data = counts.rows[0];
    console.log(`  📊 Organizations: ${data.organizations}`);
    console.log(`  📊 Users: ${data.users}`);
    console.log(`  📊 Cases: ${data.cases}`);
    console.log(`  📊 Documents: ${data.documents}`);
    console.log(`  📊 Clients: ${data.clients}`);
    console.log('');

    // Show login credentials
    console.log('🔐 Default Login Credentials:');
    console.log('  ┌─────────────────────────────────────────┐');
    console.log('  │  Email:    admin@lexiflow.com          │');
    console.log('  │  Password: LexiFlow2024!               │');
    console.log('  └─────────────────────────────────────────┘');
    console.log('');
    console.log('🎉 Database sync completed successfully!');

  } catch (error) {
    console.error('\n❌ Database sync failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Parse arguments
const seedOnly = process.argv.includes('--seed-only');
syncDatabase(seedOnly);
