/**
 * Sequelize Database Sync Script
 * Forces sync of all models and seeds with sample data
 *
 * Usage: npx ts-node src/database/scripts/sequelize-sync.ts
 */

import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../..', '.env') });

// Import all models
import {
  Organization,
  User,
  Case,
  Document,
  Client,
  Evidence,
  Message,
  Conversation,
  WorkflowStage,
  WorkflowTask,
  Motion,
  TimeEntry,
  DiscoveryRequest,
  Analytics,
  ComplianceRecord,
  KnowledgeArticle,
  Jurisdiction,
  CalendarEvent,
  Task,
  Clause,
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
  Party,
  CaseMember,
  UserProfile,
  Group,
  UserGroup,
  ConflictCheck,
  EthicalWall,
  AuditLogEntry,
  JudgeProfile,
  OpposingCounselProfile,
  ChainOfCustodyEvent,
  FileChunk,
  Playbook,
  DocumentVersion,
} from '../../models';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function syncDatabase() {
  console.log('🚀 LexiFlow Sequelize Database Sync');
  console.log('====================================\n');

  const sequelize = new Sequelize(DATABASE_URL!, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    models: [
      Organization,
      User,
      Case,
      Document,
      Client,
      Evidence,
      Message,
      Conversation,
      WorkflowStage,
      WorkflowTask,
      Motion,
      TimeEntry,
      DiscoveryRequest,
      Analytics,
      ComplianceRecord,
      KnowledgeArticle,
      Jurisdiction,
      CalendarEvent,
      Task,
      Clause,
      DocumentEmbedding,
      LegalCitation,
      DocumentAnalysis,
      SearchQuery,
      Party,
      CaseMember,
      UserProfile,
      Group,
      UserGroup,
      ConflictCheck,
      EthicalWall,
      AuditLogEntry,
      JudgeProfile,
      OpposingCounselProfile,
      ChainOfCustodyEvent,
      FileChunk,
      Playbook,
      DocumentVersion,
    ],
  });

  try {
    console.log('📡 Connecting to database...');
    await sequelize.authenticate();
    console.log('  ✅ Connected successfully\n');

    console.log('🔄 Syncing database schema (force)...');
    await sequelize.sync({ force: true });
    console.log('  ✅ Schema synced\n');

    console.log('🌱 Seeding data...');

    // Create organizations
    const org1 = await Organization.create({
      name: 'Sterling & Associates Law Firm',
      type: 'law_firm',
      description: 'Full-service law firm specializing in corporate and litigation matters',
      address: '123 Main Street, New York, NY 10001',
      phone: '+1-212-555-0100',
      email: 'contact@sterlinglaw.com',
      website: 'https://sterlinglaw.com',
      status: 'active',
    });
    console.log('  ✅ Created organization: Sterling & Associates');

    const org2 = await Organization.create({
      name: 'TechCorp Legal Department',
      type: 'in_house',
      description: 'Internal legal department for technology corporation',
      address: '456 Tech Avenue, San Francisco, CA 94105',
      phone: '+1-415-555-0200',
      email: 'legal@techcorp.com',
      website: 'https://techcorp.com/legal',
      status: 'active',
    });
    console.log('  ✅ Created organization: TechCorp Legal');

    // Create password hash
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'LexiFlow2024!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Create users
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lexiflow.com';
    const adminFirstName = process.env.DEFAULT_ADMIN_FIRST_NAME || 'Admin';
    const adminLastName = process.env.DEFAULT_ADMIN_LAST_NAME || 'User';
    
    const _admin = await User.create({
      first_name: adminFirstName,
      last_name: adminLastName,
      name: `${adminFirstName} ${adminLastName}`,
      email: adminEmail,
      password_hash: passwordHash,
      role: 'admin',
      position: 'System Administrator',
      status: 'active',
      organization_id: org1.id,
    });
    console.log(`  ✅ Created user: ${adminEmail}`);

    await User.create({
      first_name: 'John',
      last_name: 'Sterling',
      name: 'John Sterling',
      email: 'j.sterling@sterlinglaw.com',
      password_hash: passwordHash,
      role: 'attorney',
      position: 'Senior Partner',
      bar_admission: 'New York',
      bar_number: 'NY-BAR-12345',
      phone: '+1-212-555-0101',
      expertise: 'Corporate Law, Mergers & Acquisitions',
      status: 'active',
      organization_id: org1.id,
    });
    console.log('  ✅ Created user: j.sterling@sterlinglaw.com');

    await User.create({
      first_name: 'Sarah',
      last_name: 'Johnson',
      name: 'Sarah Johnson',
      email: 's.johnson@sterlinglaw.com',
      password_hash: passwordHash,
      role: 'attorney',
      position: 'Associate',
      bar_admission: 'New York',
      bar_number: 'NY-BAR-12346',
      phone: '+1-212-555-0102',
      expertise: 'Litigation, Employment Law',
      status: 'active',
      organization_id: org1.id,
    });
    console.log('  ✅ Created user: s.johnson@sterlinglaw.com');

    await User.create({
      first_name: 'Emily',
      last_name: 'Rodriguez',
      name: 'Emily Rodriguez',
      email: 'e.rodriguez@sterlinglaw.com',
      password_hash: passwordHash,
      role: 'paralegal',
      position: 'Senior Paralegal',
      phone: '+1-212-555-0103',
      expertise: 'Document Management, Case Research',
      status: 'active',
      organization_id: org1.id,
    });
    console.log('  ✅ Created user: e.rodriguez@sterlinglaw.com');

    await User.create({
      first_name: 'Michael',
      last_name: 'Chen',
      name: 'Michael Chen',
      email: 'm.chen@techcorp.com',
      password_hash: passwordHash,
      role: 'attorney',
      position: 'General Counsel',
      bar_admission: 'California',
      bar_number: 'CA-BAR-67890',
      phone: '+1-415-555-0201',
      expertise: 'Technology Law, IP, Compliance',
      status: 'active',
      organization_id: org2.id,
    });
    console.log('  ✅ Created user: m.chen@techcorp.com');

    // Create clients
    await Client.create({
      name: 'Acme Corporation',
      type: 'corporate',
      email: 'legal@acmecorp.com',
      phone: '+1-555-123-4567',
      address: '100 Business Park Drive, Austin, TX 78701',
      industry: 'Manufacturing',
      primary_contact: 'Jane Doe, General Counsel',
      status: 'active',
    });
    console.log('  ✅ Created client: Acme Corporation');

    await Client.create({
      name: 'TechStartup Inc',
      type: 'startup',
      email: 'founder@techstartup.com',
      phone: '+1-555-345-6789',
      address: '789 Innovation Hub, San Francisco, CA 94105',
      industry: 'Technology',
      primary_contact: 'Alex Johnson, CEO',
      status: 'active',
    });
    console.log('  ✅ Created client: TechStartup Inc');

    // Create cases
    await Case.create({
      title: 'Acme Corp v. Competitor Ltd - Contract Dispute',
      client_name: 'Acme Corporation',
      opposing_counsel: 'Wilson & Partners LLP',
      status: 'active',
      filing_date: new Date('2024-01-15'),
      description: 'Contract dispute over breach of exclusive distribution agreement',
      value: 2500000.00,
      matter_type: 'Commercial Litigation',
      jurisdiction: 'Texas',
      court: 'District Court of Travis County',
      billing_model: 'hourly',
      judge: 'Hon. Patricia Williams',
      owner_org_id: org1.id,
    });
    console.log('  ✅ Created case: Acme Corp v. Competitor Ltd');

    await Case.create({
      title: 'TechStartup Series A Legal Review',
      client_name: 'TechStartup Inc',
      status: 'active',
      filing_date: new Date('2024-03-01'),
      description: 'Legal review and documentation for Series A funding round',
      value: 500000.00,
      matter_type: 'Corporate',
      jurisdiction: 'California',
      billing_model: 'project',
      owner_org_id: org1.id,
    });
    console.log('  ✅ Created case: TechStartup Series A');

    console.log('\n✅ Database sync and seed completed!\n');

    // Show summary
    const userCount = await User.count();
    const orgCount = await Organization.count();
    const caseCount = await Case.count();
    const clientCount = await Client.count();

    console.log('📊 Summary:');
    console.log(`  Organizations: ${orgCount}`);
    console.log(`  Users: ${userCount}`);
    console.log(`  Cases: ${caseCount}`);
    console.log(`  Clients: ${clientCount}`);

    console.log('\n🔐 Default Login Credentials:');
    console.log('  ├──────────────────────────────────────┤');
    console.log(`  │  Email:    ${(process.env.DEFAULT_ADMIN_EMAIL || 'admin@lexiflow.com').padEnd(25)} │`);
    console.log(`  │  Password: ${(process.env.DEFAULT_ADMIN_PASSWORD || 'LexiFlow2024!').padEnd(25)} │`);
    console.log('  └─────────────────────────────────────────┘');
    console.log('\n  Other users (same password):');
    console.log('  - j.sterling@sterlinglaw.com (attorney)');
    console.log('  - s.johnson@sterlinglaw.com (attorney)');
    console.log('  - e.rodriguez@sterlinglaw.com (paralegal)');
    console.log('  - m.chen@techcorp.com (attorney)');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
