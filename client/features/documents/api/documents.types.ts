/**
 * Document Management System Types
 * Extended types for the comprehensive DMS feature
 */

import { LegalDocument, DocumentVersion } from '../../../types';

// Re-export base types
export type { LegalDocument, DocumentVersion };

// Folder Management
export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  color?: string;
  icon?: string;
  caseId?: string;
  organizationId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
  documentCount?: number;
}

// Document Annotations
export interface Annotation {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'highlight' | 'comment' | 'rectangle' | 'arrow' | 'note';
  page: number;
  position: AnnotationPosition;
  content: string;
  color?: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: AnnotationReply[];
}

export interface AnnotationPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  // For text highlights
  startOffset?: number;
  endOffset?: number;
  textContent?: string;
}

export interface AnnotationReply {
  id: string;
  annotationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

// Document Sharing
export interface DocumentShare {
  id: string;
  documentId: string;
  sharedBy: string;
  sharedWith?: string[]; // User IDs
  shareLink?: string;
  expiresAt?: string;
  permissions: SharePermissions;
  password?: string;
  downloadable: boolean;
  createdAt: string;
}

export interface SharePermissions {
  view: boolean;
  edit: boolean;
  comment: boolean;
  share: boolean;
}

// Document Filters
export interface DocumentFilters {
  search?: string;
  folderId?: string;
  type?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  author?: string[];
  status?: string[];
  classification?: string[];
  caseId?: string;
}

// Document View Modes
export type ViewMode = 'list' | 'grid' | 'preview';

// Upload Queue Item
export interface UploadQueueItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: DocumentUploadMetadata;
  result?: LegalDocument;
}

export interface DocumentUploadMetadata {
  title?: string;
  type?: string;
  description?: string;
  tags?: string[];
  caseId?: string;
  folderId?: string;
  classification?: string;
}

// Document Statistics
export interface DocumentStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalSize: number;
  recentUploads: number;
}

// Document Search Result
export interface DocumentSearchResult {
  document: LegalDocument;
  highlights: string[];
  score: number;
}

// Document Activity
export interface DocumentActivity {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'created' | 'updated' | 'viewed' | 'shared' | 'commented' | 'downloaded' | 'deleted';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Version Comparison
export interface VersionComparison {
  documentId: string;
  version1: DocumentVersion;
  version2: DocumentVersion;
  differences: DocumentDifference[];
}

export interface DocumentDifference {
  type: 'added' | 'removed' | 'modified';
  page?: number;
  description: string;
  oldValue?: string;
  newValue?: string;
}

// Document Preview Data
export interface DocumentPreviewData {
  document: LegalDocument;
  thumbnails: string[]; // Base64 or URLs
  pageCount: number;
  textContent?: string;
}

// API Response Types
export interface DocumentsListResponse {
  documents: LegalDocument[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FoldersListResponse {
  folders: Folder[];
  total: number;
}
