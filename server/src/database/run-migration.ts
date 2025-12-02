import { Sequelize } from 'sequelize-typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

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

    const migrationPath = path.join(__dirname, 'migrations', migrationFile);
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

const migrationFile = process.argv[2] || '011_create_missing_tables.sql';
runMigration(migrationFile)
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
  });
