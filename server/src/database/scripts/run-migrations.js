#!/usr/bin/env node

/**
 * Migration Runner Script
 * Runs SQL migration files against the Neon PostgreSQL database
 * Usage: node run-migrations.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

async function runMigration(filePath, description) {
  const fileName = path.basename(filePath);
  
  try {
    console.log(`${colors.yellow}📄 Running: ${description}...${colors.reset}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    await pool.query(sql);
    
    console.log(`${colors.green}✅ ${description} completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Failed to run ${fileName}:${colors.reset}`);
    console.error(`${colors.red}   ${error.message}${colors.reset}`);
    return false;
  }
}

async function main() {
  console.log(`${colors.cyan}🚀 Starting Database Migrations${colors.reset}\n`);

  const migrationsDir = path.join(__dirname, '../migrations');
  
  // Define migrations to run in order (only the new PACER-related ones)
  const migrations = [
    {
      file: '005_add_pacer_fields_to_cases.sql',
      description: 'Add PACER fields to cases table',
    },
    {
      file: '006_create_docket_entries_table.sql',
      description: 'Create docket_entries table',
    },
    {
      file: '007_create_consolidated_cases_table.sql',
      description: 'Create consolidated_cases table',
    },
    {
      file: '008_create_attorneys_table.sql',
      description: 'Create attorneys table',
    },
    {
      file: '009_modify_parties_counsel_to_json.sql',
      description: 'Modify parties.counsel to JSONB',
    },
    {
      file: '010_add_pacer_cross_references.sql',
      description: 'Add PACER cross-reference fields',
    },
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`${colors.yellow}⏭️  Skipping ${migration.file} (file not found)${colors.reset}`);
      continue;
    }

    const success = await runMigration(filePath, migration.description);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log(`\n${colors.cyan}📊 Migration Summary${colors.reset}`);
  console.log(`   ${colors.green}✅ Successful: ${successCount}${colors.reset}`);
  if (failureCount > 0) {
    console.log(`   ${colors.red}❌ Failed: ${failureCount}${colors.reset}`);
  }

  await pool.end();

  if (failureCount > 0) {
    console.log(`\n${colors.red}⚠️  Some migrations failed. Please check the errors above.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}🎉 All migrations completed successfully!${colors.reset}`);
    process.exit(0);
  }
}

// Run migrations
main().catch(error => {
  console.error(`${colors.red}💥 Fatal error:${colors.reset}`, error);
  pool.end();
  process.exit(1);
});
