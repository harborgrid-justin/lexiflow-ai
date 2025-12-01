// Model exports for LexiFlow AI Legal Management System
export { Organization } from './organization.model';
export { User } from './user.model';
export { Case } from './case.model';
export { Document } from './document.model';
export { Evidence } from './evidence.model';
export { Message, Conversation } from './message.model';
export { WorkflowStage, WorkflowTask } from './workflow.model';
export { Motion } from './motion.model';
export { TimeEntry } from './billing.model';
export { DiscoveryRequest } from './discovery.model';
export { Client } from './client.model';
export { Analytics } from './analytics.model';
export { ComplianceRecord } from './compliance.model';
export { KnowledgeArticle } from './knowledge.model';
export { Jurisdiction } from './jurisdiction.model';
export { CalendarEvent } from './calendar.model';
export { Task } from './task.model';
export { Clause } from './clause.model';
export { DocumentEmbedding } from './document-embedding.model';
export { LegalCitation } from './legal-citation.model';
export { DocumentAnalysis } from './document-analysis.model';
export { SearchQuery } from './search-query.model';

// New models for frontend requirements
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

// PACER import models
export { DocketEntry } from './docket-entry.model';
export { ConsolidatedCase } from './consolidated-case.model';
export { Attorney } from './attorney.model';