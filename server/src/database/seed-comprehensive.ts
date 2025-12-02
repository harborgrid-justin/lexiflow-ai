import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import {
  Organization,
  User,
  Case,
  Party,
  CaseMember,
  Attorney,
  DocketEntry,
  Document,
  Motion,
  DiscoveryRequest,
  Task,
  ConflictCheck,
  AuditLogEntry,
  DocumentVersion,
  FileChunk,
  ChainOfCustodyEvent,
  Evidence,
  WorkflowStage,
  WorkflowTask,
  CalendarEvent,
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
  TimeEntry,
  Analytics,
  ComplianceRecord,
  UserProfile,
  Group,
  UserGroup,
  EthicalWall,
  JudgeProfile,
  OpposingCounselProfile,
  Playbook,
  ConsolidatedCase,
  Jurisdiction,
  Client,
  Clause,
  Message,
  Conversation,
} from '../models';

dotenv.config();

async function seedAllData() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
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
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    console.log('🌱 Starting comprehensive data seeding...');

    // Add models to sequelize instance
    sequelize.addModels([
      Organization,
      User,
      Case,
      Party,
      CaseMember,
      Attorney,
      DocketEntry,
      Document,
      Motion,
      DiscoveryRequest,
      Task,
      ConflictCheck,
      AuditLogEntry,
      DocumentVersion,
      FileChunk,
      ChainOfCustodyEvent,
      Evidence,
      WorkflowStage,
      WorkflowTask,
      CalendarEvent,
      DocumentEmbedding,
      LegalCitation,
      DocumentAnalysis,
      SearchQuery,
      TimeEntry,
      Analytics,
      ComplianceRecord,
      UserProfile,
      Group,
      UserGroup,
      EthicalWall,
      JudgeProfile,
      OpposingCounselProfile,
      Playbook,
      ConsolidatedCase,
      Jurisdiction,
      Client,
      Clause,
      Message,
      Conversation,
    ]);

    // Seed organizations first
    console.log('🏢 Seeding organizations...');
    const organizations = [];
    for (let i = 0; i < 5; i++) {
      organizations.push({
        name: faker.company.name(),
        type: faker.helpers.arrayElement(['Law Firm', 'Corporation', 'Government', 'Non-Profit']),
        description: faker.company.catchPhrase(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        website: faker.internet.url(),
        status: 'active',
        license_number: faker.string.alphanumeric(10).toUpperCase(),
        bar_number: faker.string.alphanumeric(8),
        jurisdiction: faker.location.state(),
      });
    }
    await Organization.bulkCreate(organizations, { ignoreDuplicates: true });
    console.log(`✅ Created ${organizations.length} organizations`);

    // Get existing organizations
    const existingOrgs = await Organization.findAll();
    const orgIds = existingOrgs.map((org: any) => org.id);

    // Seed users
    console.log('👥 Seeding users...');
    const users = [];
    const roles = ['Attorney', 'Paralegal', 'Administrator', 'Partner', 'Associate'];
    const positions = ['Senior Partner', 'Partner', 'Associate', 'Paralegal', 'Legal Assistant'];

    for (let i = 0; i < 25; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      users.push({
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        password_hash: '$2b$10$dummy.hash.for.seeding.purposes.only',
        role: faker.helpers.arrayElement(roles),
        position: faker.helpers.arrayElement(positions),
        bar_admission: faker.location.state(),
        bar_number: faker.string.alphanumeric(8),
        phone: faker.phone.number(),
        expertise: faker.helpers.arrayElements([
          'Corporate Law', 'Criminal Law', 'Family Law', 'Real Estate', 'Intellectual Property',
          'Employment Law', 'Tax Law', 'Environmental Law', 'Immigration Law', 'Bankruptcy Law'
        ], { min: 1, max: 3 }).join(', '),
        status: 'active',
        organization_id: faker.helpers.arrayElement(orgIds),
      });
    }
    await User.bulkCreate(users, { ignoreDuplicates: true });
    console.log(`✅ Created ${users.length} users`);

    // Get existing users
    const existingUsers = await User.findAll();
    const userIds = existingUsers.map((user: any) => user.id);

    // Seed 20 cases with comprehensive data
    console.log('⚖️ Seeding 20 cases with associated data...');
    const cases = [];
    const caseTypes = ['Litigation', 'Corporate', 'Criminal', 'Family', 'Real Estate', 'IP', 'Employment', 'Tax'];
    const statuses = ['active', 'pending', 'closed', 'settled'];

    for (let i = 0; i < 20; i++) {
      const filingDate = faker.date.past({ years: 2 });
      cases.push({
        title: `${faker.company.name()} v. ${faker.company.name()}`,
        client_name: faker.company.name(),
        opposing_counsel: `${faker.person.fullName()}, Esq.`,
        status: faker.helpers.arrayElement(statuses),
        filing_date: filingDate,
        description: faker.lorem.paragraphs(2),
        value: faker.number.int({ min: 50000, max: 5000000 }),
        matter_type: faker.helpers.arrayElement(caseTypes),
        jurisdiction: faker.location.state(),
        court: `Superior Court of ${faker.location.state()}`,
        billing_model: faker.helpers.arrayElement(['Hourly', 'Fixed Fee', 'Contingency']),
        judge: `Hon. ${faker.person.fullName()}`,
        owner_org_id: faker.helpers.arrayElement(orgIds),
      });
    }
    await Case.bulkCreate(cases, { ignoreDuplicates: true });
    console.log(`✅ Created ${cases.length} cases`);

    // Get existing cases
    const existingCases = await Case.findAll();
    const caseIds = existingCases.map((case_: any) => case_.id);

    // Seed parties for each case
    console.log('👥 Seeding parties...');
    const parties = [];
    for (const caseId of caseIds) {
      // Plaintiff
      parties.push({
        name: faker.company.name(),
        role: 'Plaintiff',
        contact: faker.internet.email(),
        type: 'Corporation',
        counsel: [{
          name: faker.person.fullName(),
          firm: faker.company.name() + ' Law Firm'
        }],
        case_id: caseId,
        linked_org_id: faker.helpers.arrayElement(orgIds),
        owner_org_id: faker.helpers.arrayElement(orgIds),
      });

      // Defendant
      parties.push({
        name: faker.company.name(),
        role: 'Defendant',
        contact: faker.internet.email(),
        type: 'Corporation',
        counsel: [{
          name: faker.person.fullName(),
          firm: faker.company.name() + ' Law Firm'
        }],
        case_id: caseId,
        linked_org_id: faker.helpers.arrayElement(orgIds),
        owner_org_id: faker.helpers.arrayElement(orgIds),
      });
    }
    await Party.bulkCreate(parties, { ignoreDuplicates: true });
    console.log(`✅ Created ${parties.length} parties`);

    // Seed case members
    console.log('👨‍⚖️ Seeding case members...');
    const caseMembers = [];
    for (const caseId of caseIds) {
      const assignedUsers = faker.helpers.arrayElements(userIds, { min: 1, max: 3 });
      for (const userId of assignedUsers) {
        caseMembers.push({
          case_id: caseId,
          user_id: userId,
          role: faker.helpers.arrayElement(['Lead', 'Associate', 'Paralegal', 'Assistant']),
          joined_at: faker.date.past({ years: 1 }),
          owner_org_id: faker.helpers.arrayElement(orgIds),
        });
      }
    }
    await CaseMember.bulkCreate(caseMembers, { ignoreDuplicates: true });
    console.log(`✅ Created ${caseMembers.length} case members`);

    // Seed attorneys (create parties first, then attorneys)
    console.log('⚖️ Seeding attorneys...');
    const attorneys = [];
    const attorneyParties = [];

    for (let i = 0; i < 30; i++) {
      // Create a party for this attorney
      const attorneyParty = {
        name: faker.person.fullName(),
        role: 'Attorney',
        contact: faker.internet.email(),
        type: 'Individual',
        counsel: [{
          name: faker.person.fullName(),
          firm: faker.company.name() + ' Law Firm'
        }],
        case_id: faker.helpers.arrayElement(caseIds),
        linked_org_id: faker.helpers.arrayElement(orgIds),
        owner_org_id: faker.helpers.arrayElement(orgIds),
      };
      attorneyParties.push(attorneyParty);
    }

    // Bulk create attorney parties
    const createdAttorneyParties = await Party.bulkCreate(attorneyParties, { ignoreDuplicates: true });
    const attorneyPartyIds = createdAttorneyParties.map((party: any) => party.id);

    // Now create attorneys linked to these parties
    for (let i = 0; i < 30; i++) {
      attorneys.push({
        party_id: attorneyPartyIds[i],
        first_name: faker.person.firstName(),
        middle_name: faker.datatype.boolean() ? faker.person.middleName() : null,
        last_name: faker.person.lastName(),
        generation: faker.helpers.arrayElement(['Jr.', 'Sr.', 'III', null]),
        suffix: faker.helpers.arrayElement(['Esq.', 'JD', null]),
        title: faker.helpers.arrayElement(['Attorney', 'Counsel', 'Partner', 'Associate']),
        email: faker.internet.email(),
        office_phone: faker.phone.number(),
        mobile_phone: faker.phone.number(),
        bar_number: faker.string.alphanumeric(8),
        bar_state: faker.location.state({ abbreviated: true }),
        is_lead: faker.datatype.boolean(),
        pro_hac_vice: faker.datatype.boolean(),
        firm: faker.company.name() + ' Law Firm',
        address_line1: faker.location.streetAddress(),
        address_line2: faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        country: 'US',
        status: 'active',
        termination_date: null,
        termination_notice_date: null,
        notice_to_name: null,
        notice_to_address: null,
      });
    }
    await Attorney.bulkCreate(attorneys, { ignoreDuplicates: true });
    console.log(`✅ Created ${attorneys.length} attorneys`);

    // Seed docket entries
    console.log('📋 Seeding docket entries...');
    const docketEntries = [];
    const documentTypes = ['Motion', 'Hearing', 'Filing', 'Order', 'Notice', 'Response', 'Complaint', 'Answer', 'Brief'];

    for (const caseId of caseIds) {
      const numEntries = faker.number.int({ min: 3, max: 8 });
      for (let i = 0; i < numEntries; i++) {
        docketEntries.push({
          case_id: caseId,
          entry_number: i + 1,
          date_filed: faker.date.past({ years: 1 }),
          text: faker.lorem.sentences({ min: 1, max: 3 }),
          doc_link: faker.datatype.boolean() ? faker.internet.url() : null,
          pages: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 50 }) : null,
          file_size: faker.datatype.boolean() ? `${faker.number.int({ min: 1, max: 10 })} MB` : null,
          document_type: faker.helpers.arrayElement(documentTypes),
          cmecf_id: faker.datatype.boolean() ? `[${faker.string.numeric(10)}]` : null,
          clerk_initials: faker.string.alpha({ length: 2, casing: 'upper' }),
          owner_org_id: faker.helpers.arrayElement(orgIds),
        });
      }
    }
    await DocketEntry.bulkCreate(docketEntries, { ignoreDuplicates: true });
    console.log(`✅ Created ${docketEntries.length} docket entries`);

    // Seed documents
    console.log('📄 Seeding documents...');
    const documents = [];
    const docTypes = ['Complaint', 'Motion', 'Brief', 'Contract', 'Affidavit', 'Exhibit', 'Correspondence'];

    for (const caseId of caseIds) {
      const numDocs = faker.number.int({ min: 5, max: 15 });
      for (let i = 0; i < numDocs; i++) {
        documents.push({
          filename: `${faker.system.fileName()}.pdf`,
          title: faker.helpers.arrayElement(docTypes) + ' - ' + faker.lorem.words(3),
          type: 'pdf',
          status: faker.helpers.arrayElement(['draft', 'final', 'archived']),
          file_path: `/storage/docs/${faker.string.uuid()}.pdf`,
          mime_type: 'application/pdf',
          file_size: faker.number.int({ min: 10000, max: 5000000 }),
          version: 1,
          description: faker.lorem.sentences(2),
          tags: faker.helpers.arrayElements(['important', 'confidential', 'evidence', 'correspondence'], { min: 0, max: 2 }).join(','),
          classification: faker.helpers.arrayElement(['Public', 'Confidential', 'Attorney Eyes Only']),
          case_id: caseId,
          created_by: faker.helpers.arrayElement(userIds),
          modified_by: faker.helpers.arrayElement(userIds),
          owner_org_id: faker.helpers.arrayElement(orgIds),
        });
      }
    }
    await Document.bulkCreate(documents, { ignoreDuplicates: true });
    console.log(`✅ Created ${documents.length} documents`);

    // Seed motions
    console.log('📝 Seeding motions...');
    const motions = [];
    const motionTypes = ['Motion to Dismiss', 'Motion for Summary Judgment', 'Motion to Compel', 'Motion in Limine', 'Motion for Extension'];

    for (const caseId of caseIds) {
      const numMotions = faker.number.int({ min: 1, max: 4 });
      for (let i = 0; i < numMotions; i++) {
        motions.push({
          case_id: caseId,
          title: faker.helpers.arrayElement(motionTypes) + ' - ' + faker.lorem.words(3),
          type: faker.helpers.arrayElement(motionTypes),
          description: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(['Filed', 'Granted', 'Denied', 'Pending', 'Withdrawn']),
          filing_date: faker.date.past({ years: 1 }),
          hearing_date: faker.date.future(),
          filed_by: faker.helpers.arrayElement(userIds),
          owner_org_id: faker.helpers.arrayElement(orgIds),
        });
      }
    }
    await Motion.bulkCreate(motions, { ignoreDuplicates: true });
    console.log(`✅ Created ${motions.length} motions`);

    // Seed discovery requests
    console.log('🔍 Seeding discovery requests...');
    const discoveryRequests = [];
    const discoveryTypes = ['Interrogatories', 'Requests for Production', 'Requests for Admission', 'Depositions', 'Subpoenas'];

    for (const caseId of caseIds) {
      const numRequests = faker.number.int({ min: 2, max: 6 });
      for (let i = 0; i < numRequests; i++) {
        discoveryRequests.push({
          case_id: caseId,
          request_type: faker.helpers.arrayElement(discoveryTypes),
          title: faker.helpers.arrayElement(discoveryTypes) + ' - Set ' + faker.number.int({ min: 1, max: 5 }),
          description: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(['Sent', 'Responded', 'Overdue', 'Completed']),
          served_date: faker.date.past({ years: 1 }),
          due_date: faker.date.future(),
          response_date: faker.date.recent(),
          created_by: faker.helpers.arrayElement(userIds),
          recipient: faker.company.name() + ' Legal Department',
          priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
          response_notes: faker.lorem.sentences(2),
        });
      }
    }
    await DiscoveryRequest.bulkCreate(discoveryRequests, { ignoreDuplicates: true });
    console.log(`✅ Created ${discoveryRequests.length} discovery requests`);

    // Seed tasks
    console.log('✅ Seeding tasks...');
    const tasks = [];
    const taskTypes = ['Research', 'Document Review', 'Client Meeting', 'Court Filing', 'Discovery', 'Deposition Prep'];

    for (const caseId of caseIds) {
      const numTasks = faker.number.int({ min: 3, max: 10 });
      for (let i = 0; i < numTasks; i++) {
        const taskType = faker.helpers.arrayElement(taskTypes);
        tasks.push({
          case_id: caseId,
          type: taskType.toLowerCase().replace(' ', '_'),
          title: taskType + ': ' + faker.lorem.words(3),
          description: faker.lorem.sentences(2),
          status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'cancelled']),
          priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
          assigned_to: faker.helpers.arrayElement(userIds),
          created_by: faker.helpers.arrayElement(userIds),
          due_date: faker.date.future(),
          completed_at: faker.helpers.maybe(() => faker.date.recent()),
          owner_org_id: faker.helpers.arrayElement(orgIds),
        });
      }
    }
    await Task.bulkCreate(tasks, { ignoreDuplicates: true });
    console.log(`✅ Created ${tasks.length} tasks`);

    // Seed conflict checks
    console.log('⚠️ Seeding conflict checks...');
    const conflictChecks = [];
    for (let i = 0; i < 50; i++) {
      conflictChecks.push({
        entity_name: faker.company.name(),
        check_date: faker.date.recent(),
        status: faker.helpers.arrayElement(['Cleared', 'Conflict Found', 'Pending Review']),
        found_in: faker.helpers.maybe(() => faker.helpers.arrayElements(['Client Database', 'Former Cases', 'Related Matters'], { min: 1, max: 2 }).join(', ')),
        checked_by: faker.helpers.arrayElement(userIds),
        notes: faker.lorem.sentences(2),
      });
    }
    await ConflictCheck.bulkCreate(conflictChecks, { ignoreDuplicates: true });
    console.log(`✅ Created ${conflictChecks.length} conflict checks`);

    // Seed audit log entries
    console.log('📊 Seeding audit log entries...');
    const auditEntries = [];
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT'];
    const resources = ['case', 'document', 'user', 'client', 'evidence', 'motion'];

    for (let i = 0; i < 200; i++) {
      auditEntries.push({
        timestamp: faker.date.recent(),
        user_id: faker.helpers.arrayElement(userIds),
        action: faker.helpers.arrayElement(actions),
        resource: faker.helpers.arrayElement(resources),
        resource_id: faker.string.uuid(),
        ip_address: faker.internet.ip(),
        user_agent: faker.internet.userAgent(),
        details: `${faker.helpers.arrayElement(actions)} ${faker.helpers.arrayElement(resources)}: ${faker.lorem.sentence()}`,
      });
    }
    await AuditLogEntry.bulkCreate(auditEntries, { ignoreDuplicates: true });
    console.log(`✅ Created ${auditEntries.length} audit log entries`);

    console.log('🎉 Comprehensive data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Organizations: ${organizations.length} (expanded)`);
    console.log(`   - Users: ${users.length} (expanded)`);
    console.log(`   - Cases: ${cases.length} (20 total)`);
    console.log(`   - Parties: ${parties.length}`);
    console.log(`   - Case Members: ${caseMembers.length}`);
    console.log(`   - Attorneys: ${attorneys.length}`);
    console.log(`   - Docket Entries: ${docketEntries.length}`);
    console.log(`   - Documents: ${documents.length}`);
    console.log(`   - Motions: ${motions.length}`);
    console.log(`   - Discovery Requests: ${discoveryRequests.length}`);
    console.log(`   - Tasks: ${tasks.length}`);
    console.log(`   - Conflict Checks: ${conflictChecks.length}`);
    console.log(`   - Audit Log Entries: ${auditEntries.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

seedAllData()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
  });