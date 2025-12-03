/**
 * Domain Service Interfaces
 * 
 * Defines contracts for domain-specific services in the legal management system.
 * Each interface extends the base service contract with domain-specific operations.
 */

import { IBaseService, ServiceResponse, QueryOptions } from './IBaseService';
import type {
  User,
  Case,
  Client,
  ConflictCheck,
  EthicalWall,
  Motion,
  LegalDocument,
  WorkflowTask,
  EvidenceItem,
  TimeEntry,
  Message
} from '../../types';
import type { ComplianceDashboard } from '../../features/compliance/api/compliance.types';

/**
 * Case Management Service Interface
 */
export interface ICaseService extends IBaseService<Case> {
  getCasesByClient(clientId: string): Promise<ServiceResponse<Case[]>>;
  getCasesByStatus(status: string): Promise<ServiceResponse<Case[]>>;
  updateCaseStatus(caseId: string, status: string): Promise<ServiceResponse<Case>>;
  assignCounsel(caseId: string, userId: string): Promise<ServiceResponse<void>>;
  getCaseDocuments(caseId: string): Promise<ServiceResponse<Document[]>>;
  getCaseEvidence(caseId: string): Promise<ServiceResponse<EvidenceItem[]>>;
  getCaseTasks(caseId: string): Promise<ServiceResponse<WorkflowTask[]>>;
}

/**
 * Document Management Service Interface
 */
export interface IDocumentService extends IBaseService<LegalDocument> {
  uploadDocument(file: File, metadata: Partial<LegalDocument>): Promise<ServiceResponse<LegalDocument>>;
  downloadDocument(docId: string): Promise<ServiceResponse<Blob>>;
  getDocumentVersions(docId: string): Promise<ServiceResponse<LegalDocument[]>>;
  searchDocuments(query: string, options?: QueryOptions): Promise<ServiceResponse<LegalDocument[]>>;
  analyzeDocument(docId: string): Promise<ServiceResponse<any>>;
  shareDocument(docId: string, userIds: string[]): Promise<ServiceResponse<void>>;
}

/**
 * Compliance Service Interface
 */
export interface IComplianceService extends IBaseService<ComplianceDashboard> {
  runConflictCheck(entityName: string): Promise<ServiceResponse<ConflictCheck>>;
  getConflictChecks(): Promise<ServiceResponse<ConflictCheck[]>>;
  createEthicalWall(data: Partial<EthicalWall>): Promise<ServiceResponse<EthicalWall>>;
  getEthicalWalls(): Promise<ServiceResponse<EthicalWall[]>>;
  getComplianceRisk(entityId: string): Promise<ServiceResponse<number>>;
  generateComplianceReport(): Promise<ServiceResponse<any>>;
}

/**
 * User Management Service Interface
 */
export interface IUserService extends IBaseService<User> {
  authenticate(email: string, password: string): Promise<ServiceResponse<{ user: User; token: string }>>;
  getCurrentUser(): Promise<ServiceResponse<User>>;
  updateUserProfile(userId: string, profile: Partial<User>): Promise<ServiceResponse<User>>;
  getUsersByRole(role: string): Promise<ServiceResponse<User[]>>;
  assignRole(userId: string, role: string): Promise<ServiceResponse<void>>;
  getUserPermissions(userId: string): Promise<ServiceResponse<string[]>>;
}

/**
 * Client Management Service Interface
 */
export interface IClientService extends IBaseService<Client> {
  getClientCases(clientId: string): Promise<ServiceResponse<Case[]>>;
  getClientContacts(clientId: string): Promise<ServiceResponse<any[]>>;
  updateClientStatus(clientId: string, status: string): Promise<ServiceResponse<Client>>;
  getClientBilling(clientId: string): Promise<ServiceResponse<TimeEntry[]>>;
}

/**
 * Billing Service Interface
 */
export interface IBillingService extends IBaseService<TimeEntry> {
  createTimeEntry(entry: Partial<TimeEntry>): Promise<ServiceResponse<TimeEntry>>;
  getBillingByCase(caseId: string): Promise<ServiceResponse<TimeEntry[]>>;
  getBillingByClient(clientId: string): Promise<ServiceResponse<TimeEntry[]>>;
  generateInvoice(clientId: string, entries: string[]): Promise<ServiceResponse<any>>;
  getBillingStats(): Promise<ServiceResponse<any>>;
}

/**
 * Task Management Service Interface
 */
export interface ITaskService extends IBaseService<WorkflowTask> {
  getTasksByAssignee(userId: string): Promise<ServiceResponse<WorkflowTask[]>>;
  getTasksByCase(caseId: string): Promise<ServiceResponse<WorkflowTask[]>>;
  updateTaskStatus(taskId: string, status: string): Promise<ServiceResponse<WorkflowTask>>;
  assignTask(taskId: string, userId: string): Promise<ServiceResponse<void>>;
  getTaskDependencies(taskId: string): Promise<ServiceResponse<WorkflowTask[]>>;
}

/**
 * Evidence Management Service Interface
 */
export interface IEvidenceService extends IBaseService<EvidenceItem> {
  getEvidenceByCase(caseId: string): Promise<ServiceResponse<EvidenceItem[]>>;
  uploadEvidence(file: File, metadata: Partial<EvidenceItem>): Promise<ServiceResponse<EvidenceItem>>;
  getChainOfCustody(evidenceId: string): Promise<ServiceResponse<any[]>>;
  updateEvidenceStatus(evidenceId: string, status: string): Promise<ServiceResponse<EvidenceItem>>;
}

/**
 * Communication Service Interface
 */
export interface ICommunicationService extends IBaseService<Message> {
  getMessagesByCase(caseId: string): Promise<ServiceResponse<Message[]>>;
  sendMessage(message: Partial<Message>): Promise<ServiceResponse<Message>>;
  getConversations(userId: string): Promise<ServiceResponse<any[]>>;
  markMessageRead(messageId: string): Promise<ServiceResponse<void>>;
}

/**
 * Motion Management Service Interface
 */
export interface IMotionService extends IBaseService<Motion> {
  getMotionsByCase(caseId: string): Promise<ServiceResponse<Motion[]>>;
  generateMotion(type: string, data: any): Promise<ServiceResponse<Motion>>;
  fileMotion(motionId: string): Promise<ServiceResponse<void>>;
  getMotionTemplates(): Promise<ServiceResponse<any[]>>;
}