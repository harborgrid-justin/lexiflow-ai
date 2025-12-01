/**
 * Comprehensive Seed Script
 * Runs all seed files to populate the database with 100 cases and related data
 */

import { Sequelize } from 'sequelize-typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runSeed() {
  // Use DATABASE_URL if available (for Neon/cloud databases)
  const databaseUrl = process.env.DATABASE_URL;

  let sequelize: Sequelize;

  if (databaseUrl) {
    console.log('Using DATABASE_URL for connection');
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false, // Set to console.log for debugging
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    console.log('Using individual DB params for connection');
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'lexiflow_user',
      password: process.env.DB_PASSWORD || 'lexiflow_password',
      database: process.env.DB_NAME || 'lexiflow',
      logging: false,
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      } : undefined,
    });
  }

  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully!\n');

    // Define seed files in order
    const seedFiles = [
      'seeders/004_comprehensive_cases.sql',
      'seeders/005_case_related_data.sql',
    ];

    for (const seedFile of seedFiles) {
      const filePath = path.join(__dirname, seedFile);

      if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${seedFile} (file not found)`);
        continue;
      }

      console.log('\n========================================');
      console.log(`Running: ${seedFile}`);
      console.log('========================================\n');

      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute the entire SQL file as one transaction
      console.log('Executing SQL file...');
      try {
        await sequelize.query(sql);
        console.log('SQL file executed successfully');
      } catch (error: any) {
        console.error('Error executing SQL file:', error.message);
      }

      // Split by semicolons - simpler approach
      const statements: string[] = [];

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        if (!statement || statement.startsWith('--')) {continue;}

        try {
          await sequelize.query(statement);
          successCount++;
        } catch (error: any) {
          // Ignore "already exists" errors for idempotency
          if (error.message?.includes('already exists') ||
              error.message?.includes('duplicate key') ||
              error.message?.includes('violates unique constraint')) {
            console.log(`Skipping (already exists): ${statement.substring(0, 60)}...`);
          } else {
            errorCount++;
            console.error(`Error executing: ${statement.substring(0, 100)}...`);
            console.error(`Error: ${error.message}\n`);
          }
        }
      }

      console.log(`\nCompleted ${seedFile}: ${successCount} statements executed, ${errorCount} errors`);
    }

    // Show summary
    console.log('\n========================================');
    console.log('SEED SUMMARY');
    console.log('========================================');

    const counts = await Promise.all([
      sequelize.query('SELECT COUNT(*) as count FROM cases', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM case_members', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM parties', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM motions', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM documents', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM evidence', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM discovery_requests', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM conversations', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM messages', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM workflow_stages', { type: 'SELECT' as any }),
      sequelize.query('SELECT COUNT(*) as count FROM time_entries', { type: 'SELECT' as any }),
    ]);

    const tables = ['Cases', 'Team Members', 'Parties', 'Motions', 'Documents', 'Evidence', 'Discovery', 'Conversations', 'Messages', 'Workflow Stages', 'Time Entries'];

    counts.forEach((result: any, index) => {
      console.log(`${tables[index]}: ${result[0]?.count || 0}`);
    });

    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSeed();
