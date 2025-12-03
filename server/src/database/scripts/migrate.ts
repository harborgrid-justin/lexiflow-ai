import { Sequelize } from 'sequelize-typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function runAllMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔗 Connecting to database...');

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure proper order

    for (const migrationFile of migrationFiles) {
      console.log(`📄 Running migration: ${migrationFile}`);

      const migrationPath = path.join(migrationsDir, migrationFile);
      const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

      // Execute the entire SQL file as one transaction
      await sequelize.query(sqlContent);

      console.log(`✅ ${migrationFile} completed successfully!`);
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

async function runMigration(migrationFile: string) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔗 Connecting to database...');

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

    console.log(`📄 Running migration: ${migrationFile}`);

    // Execute the entire SQL file as one transaction
    await sequelize.query(sqlContent);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Check if --all flag is provided
const runAll = process.argv.includes('--all');
const migrationFile = process.argv[2] || '011_create_missing_tables.sql';

if (runAll) {
  runAllMigrations().catch(console.error);
} else {
  runMigration(migrationFile).catch(console.error);
}
