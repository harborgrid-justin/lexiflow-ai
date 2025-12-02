// Model exports for LexiFlow AI Legal Management System

// Core Legal Models (12)
export { Organization } from './organization.model';
export { User } from './user.model';
export { Case } from './case.model';
export { Document } from './document.model';
export { Evidence } from './evidence.model';
export { Message, Conversation } from './message.model';
export { Motion } from './motion.model';
export { Task } from './task.model';
export { Clause } from './clause.model';
export { DiscoveryRequest } from './discovery.model';
export { Client } from './client.model';
export { Jurisdiction } from './jurisdiction.model';

// Workflow Models (3)
export { WorkflowStage, WorkflowTask } from './workflow.model';
export { CalendarEvent } from './calendar.model';

// AI & Vector Search Models (4)
export { DocumentEmbedding } from './document-embedding.model';
export { LegalCitation } from './legal-citation.model';
export { DocumentAnalysis } from './document-analysis.model';
export { SearchQuery } from './search-query.model';

// Financial & Analytics (3)
export { TimeEntry } from './billing.model';
export { Analytics } from './analytics.model';
export { ComplianceRecord } from './compliance.model';

// PACER & Advanced Models (14)
export { Party } from './party.model';
export { CaseMember } from './case-member.model';
export { UserProfile } from './user-profile.model';
export { Group } from './group.model';
export { UserGroup } from './user-group.model';
export { ConflictCheck } from './conflict-check.model';
export { EthicalWall } from './ethical-wall.model';
export { AuditLogEntry } from './audit-log-entry.model';
export { JudgeProfile } from './judge-profile.model';
export { OpposingCounselProfile } from './opposing-counsel-profile.model';
export { ChainOfCustodyEvent } from './chain-of-custody-event.model';
export { FileChunk } from './file-chunk.model';
export { Playbook } from './playbook.model';
export { DocumentVersion } from './document-version.model';
export { DocketEntry } from './docket-entry.model';
export { ConsolidatedCase } from './consolidated-case.model';
export { Attorney } from './attorney.model';

// Additional Model
export { KnowledgeArticle } from './knowledge.model';

/**
 * Array of all models for Sequelize registration
 * Use this array when initializing Sequelize to register all models at once
 *
 * Example:
 * ```typescript
 * sequelize.addModels(models);
 * ```
 */
import { Organization } from './organization.model';
import { User } from './user.model';
import { Case } from './case.model';
import { Document } from './document.model';
import { Evidence } from './evidence.model';
import { Message, Conversation } from './message.model';
import { Motion } from './motion.model';
import { Task } from './task.model';
import { Clause } from './clause.model';
import { DiscoveryRequest } from './discovery.model';
import { Client } from './client.model';
import { Jurisdiction } from './jurisdiction.model';
import { WorkflowStage, WorkflowTask } from './workflow.model';
import { CalendarEvent } from './calendar.model';
import { DocumentEmbedding } from './document-embedding.model';
import { LegalCitation } from './legal-citation.model';
import { DocumentAnalysis } from './document-analysis.model';
import { SearchQuery } from './search-query.model';
import { TimeEntry } from './billing.model';
import { Analytics } from './analytics.model';
import { ComplianceRecord } from './compliance.model';
import { Party } from './party.model';
import { CaseMember } from './case-member.model';
import { UserProfile } from './user-profile.model';
import { Group } from './group.model';
import { UserGroup } from './user-group.model';
import { ConflictCheck } from './conflict-check.model';
import { EthicalWall } from './ethical-wall.model';
import { AuditLogEntry } from './audit-log-entry.model';
import { JudgeProfile } from './judge-profile.model';
import { OpposingCounselProfile } from './opposing-counsel-profile.model';
import { ChainOfCustodyEvent } from './chain-of-custody-event.model';
import { FileChunk } from './file-chunk.model';
import { Playbook } from './playbook.model';
import { DocumentVersion } from './document-version.model';
import { DocketEntry } from './docket-entry.model';
import { ConsolidatedCase } from './consolidated-case.model';
import { Attorney } from './attorney.model';
import { KnowledgeArticle } from './knowledge.model';

export const models = [
  // Core Legal Models (12)
  Organization,
  User,
  Case,
  Document,
  Evidence,
  Message,
  Conversation,
  Motion,
  Task,
  Clause,
  DiscoveryRequest,
  Client,
  Jurisdiction,

  // Workflow Models (3)
  WorkflowStage,
  WorkflowTask,
  CalendarEvent,

  // AI & Vector Search Models (4)
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,

  // Financial & Analytics (3)
  TimeEntry,
  Analytics,
  ComplianceRecord,

  // PACER & Advanced Models (17)
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
  DocketEntry,
  ConsolidatedCase,
  Attorney,

  // Additional
  KnowledgeArticle,
];

export default models;