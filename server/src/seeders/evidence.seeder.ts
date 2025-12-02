import { Sequelize } from 'sequelize-typescript';
import { Evidence } from '../models/evidence.model';
import { ChainOfCustodyEvent } from '../models/chain-of-custody-event.model';
import { Case } from '../models/case.model';
import { User } from '../models/user.model';
import { Organization } from '../models/organization.model';

export async function seedEvidence(sequelize: Sequelize) {
  console.log('🔬 Seeding evidence data...');

  try {
    // Get existing cases and users for relationships
    const cases = await Case.findAll({ limit: 5 });
    const users = await User.findAll({ limit: 5 });
    const organizations = await Organization.findAll({ limit: 1 });

    if (cases.length === 0 || users.length === 0 || organizations.length === 0) {
      console.log('⚠️  No cases, users, or organizations found. Skipping evidence seeding.');
      return;
    }

    const evidenceData = [
      {
        title: 'Security Camera Footage - Building Entrance',
        description: 'Digital video recording from main entrance camera showing incident on March 15, 2024',
        type: 'Digital',
        admissibility: 'Authenticated',
        case_id: cases[0].id,
        custodian_id: users[0].id,
        organization_id: organizations[0].id,
        location: 'Evidence Locker A-101',
        storage_location: 'Digital Archive - Server Room 3',
        collection_date: new Date('2024-03-15'),
        collected_by: users[1]?.name || 'Detective Sarah Johnson',
        chain_of_custody_notes: 'Original digital file extracted from security system',
        tags: 'surveillance,video,entrance,digital',
        status: 'Active',
        blockchain_hash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
        metadata: {
          format: 'MP4',
          duration: '00:45:30',
          resolution: '1920x1080',
          fileSize: '2.3 GB',
        },
      },
      {
        title: 'Blood Sample - Defendant',
        description: 'Blood sample collected during arrest, chain of custody maintained',
        type: 'Physical',
        admissibility: 'Pending Lab Analysis',
        case_id: cases[0].id,
        custodian_id: users[1].id,
        organization_id: organizations[0].id,
        location: 'Evidence Refrigerator B-205',
        storage_location: 'Forensic Lab - Cold Storage Unit 5',
        collection_date: new Date('2024-03-16'),
        collected_by: 'Forensic Technician Mike Chen',
        chain_of_custody_notes: 'Sealed vial, tamper-evident packaging',
        tags: 'biological,blood,forensic,dna',
        status: 'Active',
        metadata: {
          vialNumber: 'BS-2024-0316-001',
          temperature: '-20°C',
          collectionTime: '14:35:00',
        },
      },
      {
        title: 'Email Thread - Contract Negotiations',
        description: 'Email correspondence between parties regarding disputed contract terms',
        type: 'Digital',
        admissibility: 'Authenticated',
        case_id: cases[1]?.id || cases[0].id,
        custodian_id: users[2]?.id || users[0].id,
        organization_id: organizations[0].id,
        location: 'Digital Evidence Archive',
        storage_location: 'Cloud Storage - Secure Vault',
        collection_date: new Date('2024-02-10'),
        collected_by: 'IT Forensics - Alex Rodriguez',
        chain_of_custody_notes: 'Extracted from company email server with proper authorization',
        tags: 'email,digital,contract,correspondence',
        status: 'Active',
        blockchain_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        metadata: {
          emailCount: 47,
          dateRange: '2023-11-01 to 2024-01-31',
          participants: ['john.doe@acme.com', 'jane.smith@techcorp.com'],
        },
      },
      {
        title: 'Handwritten Contract - Original',
        description: 'Original handwritten contract signed by both parties',
        type: 'Physical',
        admissibility: 'Authenticated',
        case_id: cases[1]?.id || cases[0].id,
        custodian_id: users[0].id,
        organization_id: organizations[0].id,
        location: 'Evidence Safe C-301',
        storage_location: 'Document Vault - Climate Controlled',
        collection_date: new Date('2024-01-05'),
        collected_by: users[0]?.name || 'Attorney Lisa Park',
        chain_of_custody_notes: 'Original document preserved in archival sleeve',
        tags: 'contract,document,original,handwritten',
        status: 'Active',
        metadata: {
          pages: 12,
          condition: 'Good',
          hasNotarization: true,
        },
      },
      {
        title: 'Financial Records - Bank Statements',
        description: 'Bank statements for accounts involved in fraud investigation',
        type: 'Digital',
        admissibility: 'Authenticated',
        case_id: cases[2]?.id || cases[0].id,
        custodian_id: users[1]?.id || users[0].id,
        organization_id: organizations[0].id,
        location: 'Secure Digital Archive',
        storage_location: 'Encrypted Server - Financial Evidence',
        collection_date: new Date('2024-03-20'),
        collected_by: 'Forensic Accountant David Lee',
        chain_of_custody_notes: 'Obtained via subpoena, certified by bank',
        tags: 'financial,banking,fraud,digital',
        status: 'Active',
        blockchain_hash: '0x9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b',
        metadata: {
          accountNumbers: ['****1234', '****5678'],
          dateRange: '2023-01-01 to 2024-03-15',
          transactionCount: 342,
        },
      },
      {
        title: 'Weapon - Firearm Evidence',
        description: 'Firearm recovered from crime scene with serial number',
        type: 'Physical',
        admissibility: 'Authenticated',
        case_id: cases[3]?.id || cases[0].id,
        custodian_id: users[2]?.id || users[0].id,
        organization_id: organizations[0].id,
        location: 'Evidence Locker D-405',
        storage_location: 'Weapons Storage - Secured Vault',
        collection_date: new Date('2024-02-28'),
        collected_by: 'Crime Scene Investigator Tom Martinez',
        chain_of_custody_notes: 'Weapon secured in locked case, ammunition removed',
        tags: 'weapon,firearm,physical,crime-scene',
        status: 'Active',
        metadata: {
          make: 'Smith & Wesson',
          model: 'M&P Shield',
          serialNumber: 'SW123456',
          caliber: '9mm',
        },
      },
      {
        title: 'Phone Records - Call Logs',
        description: 'Mobile phone call and text message records for suspect',
        type: 'Digital',
        admissibility: 'Authenticated',
        case_id: cases[3]?.id || cases[0].id,
        custodian_id: users[0].id,
        organization_id: organizations[0].id,
        location: 'Digital Evidence Archive',
        storage_location: 'Secure Server - Telecommunications Data',
        collection_date: new Date('2024-03-01'),
        collected_by: 'Digital Forensics - Rachel Kim',
        chain_of_custody_notes: 'Records obtained via court order from carrier',
        tags: 'phone,telecommunications,digital,call-logs',
        status: 'Active',
        blockchain_hash: '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
        metadata: {
          phoneNumber: '***-***-7890',
          carrier: 'Verizon Wireless',
          recordCount: 1247,
          dateRange: '2023-12-01 to 2024-02-29',
        },
      },
      {
        title: 'Surveillance Photos - Parking Lot',
        description: 'Photographs from surveillance showing vehicle involved in incident',
        type: 'Digital',
        admissibility: 'Authenticated',
        case_id: cases[4]?.id || cases[0].id,
        custodian_id: users[1]?.id || users[0].id,
        organization_id: organizations[0].id,
        location: 'Digital Archive',
        storage_location: 'Image Server - Evidence Storage',
        collection_date: new Date('2024-03-10'),
        collected_by: 'Security Officer James Wilson',
        chain_of_custody_notes: 'Original high-resolution images preserved',
        tags: 'surveillance,photos,parking,vehicle',
        status: 'Active',
        metadata: {
          imageCount: 23,
          format: 'JPEG',
          resolution: '4000x3000',
          timestamp: '2024-03-10 18:45:00',
        },
      },
      {
        title: 'DNA Evidence - Clothing Item',
        description: 'Shirt with biological evidence submitted for DNA analysis',
        type: 'Physical',
        admissibility: 'Pending Lab Analysis',
        case_id: cases[4]?.id || cases[0].id,
        custodian_id: users[2]?.id || users[0].id,
        organization_id: organizations[0].id,
        location: 'Evidence Locker E-501',
        storage_location: 'Forensic Lab - Biological Evidence',
        collection_date: new Date('2024-03-12'),
        collected_by: 'CSI Amanda Foster',
        chain_of_custody_notes: 'Item sealed in evidence bag, stored in climate control',
        tags: 'dna,biological,clothing,forensic',
        status: 'Active',
        metadata: {
          itemType: 'White T-shirt, size L',
          condition: 'Stained',
          evidenceNumber: 'DNA-2024-0312-003',
        },
      },
      {
        title: 'Computer Hard Drive',
        description: 'Hard drive from suspect computer containing potential digital evidence',
        type: 'Digital',
        admissibility: 'Under Forensic Analysis',
        case_id: cases[2]?.id || cases[0].id,
        custodian_id: users[0].id,
        organization_id: organizations[0].id,
        location: 'Digital Forensics Lab',
        storage_location: 'Secure Evidence Room - Computer Equipment',
        collection_date: new Date('2024-03-05'),
        collected_by: 'Digital Forensics Team',
        chain_of_custody_notes: 'Drive imaged and write-blocked, original preserved',
        tags: 'computer,digital,hard-drive,forensic',
        status: 'Active',
        blockchain_hash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        metadata: {
          make: 'Seagate',
          capacity: '2TB',
          serialNumber: 'HD987654321',
          imageHash: 'SHA256:a1b2c3d4e5f6...',
        },
      },
    ];

    // Create evidence records
    const createdEvidence = await Evidence.bulkCreate(evidenceData as any, {
      validate: true,
    });

    console.log(`✅ Created ${createdEvidence.length} evidence records`);

    // Create chain of custody events for some evidence
    const custodyEvents = [
      {
        evidence_id: createdEvidence[0].id,
        action: 'Collected from Security System',
        actor: users[1]?.name || 'Detective Sarah Johnson',
        location: 'Building Entrance',
        notes: 'Digital file extracted and verified from security system',
        event_date: new Date('2024-03-15T10:00:00'),
      },
      {
        evidence_id: createdEvidence[0].id,
        action: 'Transferred to Lead Investigator',
        actor: users[0]?.name || 'Evidence Officer',
        location: 'Evidence Room',
        notes: 'File copied to secure analysis workstation',
        event_date: new Date('2024-03-16T09:30:00'),
      },
      {
        evidence_id: createdEvidence[1].id,
        action: 'Collected at County Hospital',
        actor: 'Forensic Technician Mike Chen',
        location: 'County Hospital',
        notes: 'Sample collected with proper medical supervision during processing',
        event_date: new Date('2024-03-16T14:35:00'),
      },
      {
        evidence_id: createdEvidence[1].id,
        action: 'Stored in Forensic Lab',
        actor: 'Lab Supervisor',
        location: 'Forensic Lab',
        notes: 'Stored in refrigerated unit at -20°C pending analysis',
        event_date: new Date('2024-03-16T16:00:00'),
      },
      {
        evidence_id: createdEvidence[5].id,
        action: 'Collected from Crime Scene',
        actor: 'Crime Scene Investigator Tom Martinez',
        location: 'Crime Scene - 123 Main St',
        notes: 'Weapon photographed and tagged before collection',
        event_date: new Date('2024-02-28T15:20:00'),
      },
      {
        evidence_id: createdEvidence[5].id,
        action: 'Transferred to Ballistics Lab',
        actor: 'Evidence Officer',
        location: 'Evidence Processing',
        notes: 'Weapon transferred for firearm examination and ballistics analysis',
        event_date: new Date('2024-03-01T10:00:00'),
      },
    ];

    const createdCustodyEvents = await ChainOfCustodyEvent.bulkCreate(
      custodyEvents as any,
      { validate: true },
    );

    console.log(`✅ Created ${createdCustodyEvents.length} chain of custody events`);
    console.log('✅ Evidence seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding evidence:', error);
    throw error;
  }
}
