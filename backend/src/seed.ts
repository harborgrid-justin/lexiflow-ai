import fs from 'fs';
import path from 'path';
import pool from './db';
import { MOCK_ORGS, MOCK_GROUPS } from './data/mockHierarchy';
import { MOCK_AUDIT_LOGS } from './data/mockAdmin';
import { MOCK_USERS } from './data/mockUsers';
import { MOCK_CLIENTS } from './data/mockClients';
import { MOCK_CASES } from './data/mockCases';
import { MOCK_TIME_ENTRIES } from './data/mockBilling';
import { MOCK_CLAUSES } from './data/mockClauses';
import { MOCK_DOCUMENTS } from './data/mockDocuments';
import { MOCK_STAGES } from './data/mockWorkflow';
import { MOCK_MOTIONS } from './data/mockMotions';
import { MOCK_DISCOVERY, MOCK_LEGAL_HOLDS, MOCK_PRIVILEGE_LOG } from './data/mockDiscovery';
import { MOCK_EVIDENCE } from './data/mockEvidence';
import { MOCK_CONFLICTS, MOCK_WALLS } from './data/mockCompliance';
import { MOCK_CONVERSATIONS } from './data/mockMessages';
import { BUSINESS_PROCESSES } from './data/mockFirmProcesses';
import { MOCK_JURISDICTIONS } from './data/mockJurisdictions';
import { MOCK_KNOWLEDGE_BASE } from './data/mockKnowledgeBase';

const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Running schema migration...');
    await client.query(schemaSql);
    console.log('Schema created.');

    console.log('Seeding Organizations...');
    for (const org of MOCK_ORGS) {
      await client.query(
        `INSERT INTO organizations (id, name, type, domain, logo, status) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [org.id, org.name, org.type, org.domain, org.logo, org.status]
      );
    }

    console.log('Seeding Groups...');
    for (const group of MOCK_GROUPS) {
      await client.query(
        `INSERT INTO groups (id, org_id, name, description, permissions) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [group.id, group.orgId, group.name, group.description, group.permissions]
      );
    }

    console.log('Seeding Users...');
    for (const user of MOCK_USERS) {
      await client.query(
        `INSERT INTO users (id, name, email, role, office, org_id, user_type, avatar) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
        [user.id, user.name, user.email, user.role, user.office, user.orgId, user.userType, user.avatar]
      );
      
      if (user.groupIds) {
          for (const gid of user.groupIds) {
              await client.query(
                  `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                  [user.id, gid]
              );
          }
      }
    }

    console.log('Seeding Clients...');
    for (const c of MOCK_CLIENTS) {
      await client.query(
        `INSERT INTO clients (id, name, industry, status, total_billed, risk_score, org_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.industry, c.status, c.totalBilled, c.riskScore, c.orgId]
      );
    }

    console.log('Seeding Cases...');
    for (const c of MOCK_CASES) {
      await client.query(
        `INSERT INTO cases (id, title, client_name, opposing_counsel, status, filing_date, description, value, matter_type, jurisdiction, court, billing_model, judge, owner_org_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (id) DO NOTHING`,
        [c.id, c.title, c.client, c.opposingCounsel, c.status, c.filingDate, c.description, c.value, c.matterType, c.jurisdiction, c.court, c.billingModel, c.judge, c.ownerOrgId]
      );

      // Parties
      if (c.parties) {
          for (const p of c.parties) {
              await client.query(
                  `INSERT INTO parties (id, case_id, name, role, contact, type, counsel, linked_org_id) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
                  [p.id, c.id, p.name, p.role, p.contact, p.type, p.counsel, p.linkedOrgId]
              );
          }
      }
    }

    console.log('Seeding Time Entries...');
    for (const t of MOCK_TIME_ENTRIES) {
        await client.query(
            `INSERT INTO time_entries (id, case_id, date, duration, description, rate, total, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
            [t.id, t.caseId, t.date, t.duration, t.description, t.rate, t.total, t.status]
        );
    }

    console.log('Seeding Clauses...');
    for (const c of MOCK_CLAUSES) {
        await client.query(
            `INSERT INTO clauses (id, name, category, content, version, usage_count, last_updated, risk_rating) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
            [c.id, c.name, c.category, c.content, c.version, c.usageCount, c.lastUpdated, c.riskRating]
        );

        if (c.versions) {
            for (const v of c.versions) {
                await client.query(
                    `INSERT INTO clause_versions (id, clause_id, version, content, author, date) 
                     VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
                    [v.id, c.id, v.version, v.content, v.author, v.date]
                );
            }
        }
    }

    console.log('Seeding Documents...');
    for (const d of MOCK_DOCUMENTS) {
        await client.query(
            `INSERT INTO documents (id, case_id, title, type, content, upload_date, summary, risk_score, tags, last_modified, source_module, status, is_encrypted, shared_with_client, file_size) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (id) DO NOTHING`,
            [d.id, d.caseId, d.title, d.type, d.content, d.uploadDate, d.summary, d.riskScore, d.tags, d.lastModified, d.sourceModule, d.status, d.isEncrypted, d.sharedWithClient, d.fileSize]
        );

        if (d.versions) {
            for (const v of d.versions) {
                await client.query(
                    `INSERT INTO document_versions (id, document_id, version_number, upload_date, uploaded_by, summary, content_snapshot) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
                    [v.id, d.id, v.versionNumber, v.uploadDate, v.uploadedBy, v.summary, v.contentSnapshot]
                );
            }
        }
    }

    console.log('Seeding Workflow...');
    // Assigning all mock stages to the first case 'C-2024-001' for demo purposes
    const demoCaseId = 'C-2024-001'; 
    for (const s of MOCK_STAGES) {
        await client.query(
            `INSERT INTO workflow_stages (id, case_id, title, status) 
             VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
            [s.id, demoCaseId, s.title, s.status]
        );

        if (s.tasks) {
            for (const t of s.tasks) {
                await client.query(
                    `INSERT INTO workflow_tasks (id, stage_id, case_id, title, status, assignee, due_date, priority, sla_warning, automated_trigger, related_module, action_label, description) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING`,
                    [t.id, s.id, demoCaseId, t.title, t.status, t.assignee, t.dueDate, t.priority, t.slaWarning, t.automatedTrigger, t.relatedModule, t.actionLabel, t.description]
                );
            }
        }
    }

    console.log('Seeding Motions...');
    for (const m of MOCK_MOTIONS) {
        await client.query(
            `INSERT INTO motions (id, case_id, title, type, status, filing_date, hearing_date, outcome, assigned_attorney, opposition_due_date, reply_due_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
            [m.id, m.caseId, m.title, m.type, m.status, m.filingDate, m.hearingDate, m.outcome, m.assignedAttorney, m.oppositionDueDate, m.replyDueDate]
        );
    }

    console.log('Seeding Discovery...');
    for (const d of MOCK_DISCOVERY) {
        await client.query(
            `INSERT INTO discovery_requests (id, case_id, type, propounding_party, responding_party, service_date, due_date, status, title, description, response_preview) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
            [d.id, d.caseId, d.type, d.propoundingParty, d.respondingParty, d.serviceDate, d.dueDate, d.status, d.title, d.description, d.responsePreview]
        );
    }

    console.log('Seeding Evidence...');
    for (const e of MOCK_EVIDENCE) {
        await client.query(
            `INSERT INTO evidence_items (id, tracking_uuid, blockchain_hash, case_id, title, type, file_type, file_size, description, collection_date, collected_by, custodian, location, admissibility, tags) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (id) DO NOTHING`,
            [e.id, e.trackingUuid, e.blockchainHash, e.caseId, e.title, e.type, e.fileType, e.fileSize, e.description, e.collectionDate, e.collectedBy, e.custodian, e.location, e.admissibility, e.tags]
        );

        if (e.chainOfCustody) {
            for (const c of e.chainOfCustody) {
                await client.query(
                    `INSERT INTO chain_of_custody_events (id, evidence_id, date, action, actor, notes) 
                     VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
                    [c.id, e.id, c.date, c.action, c.actor, c.notes]
                );
            }
        }
    }

    console.log('Seeding Audit Logs...');
    for (const a of MOCK_AUDIT_LOGS) {
        await client.query(
            `INSERT INTO audit_logs (id, timestamp, "user", action, resource, ip) 
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
            [a.id, a.timestamp, a.user, a.action, a.resource, a.ip]
        );
    }

    console.log('Seeding Conflict Checks...');
    for (const c of MOCK_CONFLICTS) {
        await client.query(
            `INSERT INTO conflict_checks (id, entity_name, date, status, found_in, checked_by) 
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
            [c.id, c.entityName, c.date, c.status, c.foundIn, c.checkedBy]
        );
    }

    console.log('Seeding Conversations & Messages...');
    for (const c of MOCK_CONVERSATIONS) {
        await client.query(
            `INSERT INTO conversations (id, name, role, is_external, unread, status, draft) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
            [c.id, c.name, c.role, c.isExternal, c.unread, c.status, c.draft]
        );

        if (c.messages) {
            for (const m of c.messages) {
                await client.query(
                    `INSERT INTO messages (id, conversation_id, sender_id, text, timestamp, status, is_privileged, attachments) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
                    [m.id, c.id, m.senderId, m.text, m.timestamp, m.status, m.isPrivileged, JSON.stringify(m.attachments)]
                );
            }
        }
    }

    console.log('Seeding Ethical Walls...');
    for (const wall of MOCK_WALLS) {
      await client.query(
        `INSERT INTO ethical_walls (id, case_id, title, restricted_groups, authorized_users, status)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [wall.id, wall.caseId, wall.title, wall.restrictedGroups, wall.authorizedUsers, wall.status]
      );
    }

    console.log('Seeding Firm Processes...');
    for (const p of BUSINESS_PROCESSES) {
      await client.query(
        `INSERT INTO firm_processes (id, name, status, triggers, tasks, completed, owner)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.status, p.triggers, p.tasks, p.completed, p.owner]
      );
    }

    console.log('Seeding Legal Holds...');
    for (const h of MOCK_LEGAL_HOLDS) {
      await client.query(
        `INSERT INTO legal_holds (id, custodian, dept, issued, status)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [h.id, h.custodian, h.dept, h.issued, h.status]
      );
    }

    console.log('Seeding Privilege Logs...');
    for (const l of MOCK_PRIVILEGE_LOG) {
      await client.query(
        `INSERT INTO privilege_logs (id, date, author, recipient, type, basis, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [l.id, l.date, l.author, l.recipient, l.type, l.basis, l.desc]
      );
    }

    console.log('Seeding Jurisdictions...');
    for (const j of MOCK_JURISDICTIONS) {
      await client.query(
        `INSERT INTO jurisdictions (id, name, type, parent_id, metadata)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
        [j.id, j.name, j.type, j.parent_id, j.metadata]
      );
    }

    console.log('Seeding Knowledge Base...');
    for (const k of MOCK_KNOWLEDGE_BASE) {
      await client.query(
        `INSERT INTO knowledge_base (id, title, category, summary, content, tags, author, last_updated, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [k.id, k.title, k.category, k.summary, k.content, k.tags, k.author, k.last_updated, k.metadata]
      );
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
