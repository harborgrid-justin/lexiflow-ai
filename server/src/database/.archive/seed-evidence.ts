/**
 * Evidence Seeder Runner
 * Populates the database with evidence records and chain of custody events
 */

import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Import all required models
import { Evidence } from '../models/evidence.model';
import { ChainOfCustodyEvent } from '../models/chain-of-custody-event.model';
import { Case } from '../models/case.model';
import { User } from '../models/user.model';
import { Organization } from '../models/organization.model';
import { Document } from '../models/document.model';
import { DocumentVersion } from '../models/document-version.model';
import { FileChunk } from '../models/file-chunk.model';
import { Party } from '../models/party.model';
import { CaseMember } from '../models/case-member.model';
import { DocketEntry } from '../models/docket-entry.model';
import { seedEvidence } from '../seeders/evidence.seeder';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runEvidenceSeeder() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('🔗 Connecting to database...');

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    models: [
      Evidence,
      ChainOfCustodyEvent,
      Case,
      User,
      Organization,
      Document,
      DocumentVersion,
      FileChunk,
      Party,
      CaseMember,
      DocketEntry,
    ],
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Run seeder
    await seedEvidence(sequelize);

    console.log('\n✨ Evidence seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
runEvidenceSeeder();
