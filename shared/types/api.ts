// Shared API types for frontend-backend communication
// This file provides type-safe contracts between client and server

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Case {
  id: string;
  caseNumber?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  clientId?: string;
  clientName: string;
  organizationId?: string;
  ownerOrgId?: string;
  matterType?: string;
  jurisdiction?: string;
  court?: string;
  filingDate?: string;
  value?: number;
  billingModel?: string;
  judge?: string;
  opposingCounsel?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
  position?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  primaryContact?: string;
  industry?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  type?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionTier?: string;
  status?: string;
  practiceAreas?: string;
  taxId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  filename: string;
  path?: string;
  mimeType?: string;
  size?: number;
  caseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  trackingUuid: string;
  blockchainHash?: string;
  title: string;
  type: string;
  status: string;
  description?: string;
  fileType?: string;
  fileSize?: string;
  admissibilityStatus?: string;
  location?: string;
  collectedBy?: string;
  collectedByUserId?: string;
  collectedDate?: string;
  collectionNotes?: string;
  tags?: string;
  classification?: string;
  caseId?: string;
  custodianId?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  caseId?: string;
  userId?: string;
  workDate?: string;
  date?: string;
  duration?: number;
  hours?: number;
  description?: string;
  entryType?: string;
  rate: number;
  total?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
  invoiceId?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  amount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status?: string;
  priority?: string;
  allDay?: boolean;
  reminder?: string;
  notes?: string;
  caseId?: string;
  organizerId?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryRequest {
  id: string;
  caseId: string;
  title: string;
  requestType: string;
  description?: string;
  status: string;
  createdBy: string;
  servedDate?: string;
  dueDate?: string;
  responseDate?: string;
  recipient: string;
  priority?: string;
  responseNotes?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTask {
  id: string;
  stageId?: string;
  caseId?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  slaWarning?: boolean;
  automatedTrigger?: string;
  relatedModule?: string;
  actionLabel?: string;
  createdBy?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceRecord {
  id: string;
  title: string;
  type: string;
  status: string;
  description?: string;
  regulation?: string;
  ruleReference?: string;
  deadline?: string;
  checkDate?: string;
  checkResults?: string;
  riskLevel?: string;
  caseId?: string;
  officerId?: string;
  ownerOrgId?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  organizationId?: string;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface ValidationFieldError {
  field: string;
  message: string;
  value?: any;
}
