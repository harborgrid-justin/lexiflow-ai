// Documents Service using Enzyme API Client
// Provides type-safe document operations with retry, rate limiting, and file upload support

import { enzymeClient } from './client';
import { API_BASE_URL } from '../../services/config';
import { LegalDocument, DocumentVersion } from '../../types';
import { DocumentUploadMetadata } from '../../services/api-error';

// Local type definitions to avoid circular dependencies
export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  caseId?: string;
  documentCount?: number;
  [key: string]: any;
}

export interface Annotation {
  id: string;
  documentId: string;
  content: string;
  [key: string]: any;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  shareLink: string;
  [key: string]: any;
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  action: string;
  [key: string]: any;
}

/**
 * Endpoint definitions for documents
 */
const ENDPOINTS = {
  list: '/documents',
  detail: (id: string) => `/documents/${id}`,
  byType: (type: string) => `/documents/type/${encodeURIComponent(type)}`,
  upload: '/documents/upload',
  download: (id: string) => `/documents/${id}/download`,
  content: (id: string) => `/documents/${id}/content`,
  versions: (id: string) => `/documents/${id}/versions`,
  annotations: (id: string) => `/documents/${id}/annotations`,
  activity: (id: string) => `/documents/${id}/activity`,
  folders: '/folders',
  folder: (id: string) => `/folders/${id}`,
  share: (id: string) => `/documents/${id}/share`,
  move: (id: string) => `/documents/${id}/move`,
} as const;

/**
 * Query parameters for listing documents
 */
interface DocumentListParams {
  caseId?: string;
  orgId?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string;
  author?: string;
  status?: string;
  folderId?: string;
}

/**
 * Documents service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeDocumentsService = {
  /**
   * Get all documents with optional filtering
   * @example
   * const docs = await enzymeDocumentsService.getAll({ caseId: 'case-123' });
   */
  async getAll(params?: DocumentListParams): Promise<LegalDocument[]> {
    const response = await enzymeClient.get<LegalDocument[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  /**
   * Get a single document by ID
   * @example
   * const doc = await enzymeDocumentsService.getById('doc-123');
   */
  async getById(id: string): Promise<LegalDocument> {
    const response = await enzymeClient.get<LegalDocument>(ENDPOINTS.detail(id));
    return response.data;
  },

  /**
   * Get documents by type
   * @example
   * const contracts = await enzymeDocumentsService.getByType('Contract');
   */
  async getByType(type: string): Promise<LegalDocument[]> {
    const response = await enzymeClient.get<LegalDocument[]>(ENDPOINTS.byType(type));
    return response.data || [];
  },

  /**
   * Create a new document
   * @example
   * const doc = await enzymeDocumentsService.create({ title: 'New Document', type: 'Brief' });
   */
  async create(data: Partial<LegalDocument>): Promise<LegalDocument> {
    const response = await enzymeClient.post<LegalDocument>(ENDPOINTS.list, {
      body: data,
    });
    return response.data;
  },

  /**
   * Update an existing document
   * @example
   * const updated = await enzymeDocumentsService.update('doc-123', { title: 'Updated Title' });
   */
  async update(id: string, data: Partial<LegalDocument>): Promise<LegalDocument> {
    const response = await enzymeClient.put<LegalDocument>(ENDPOINTS.detail(id), {
      body: data,
    });
    return response.data;
  },

  /**
   * Delete a document
   * @example
   * await enzymeDocumentsService.delete('doc-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },

  /**
   * Upload a document file
   * Note: File upload requires special handling - falls back to fetch API
   * @example
   * const doc = await enzymeDocumentsService.upload(file, { title: 'Contract', caseId: 'case-123' });
   */
  async upload(file: File, metadata?: DocumentUploadMetadata): Promise<LegalDocument> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    // Note: enzymeClient handles FormData automatically by detecting it
    // and letting the browser set the Content-Type with boundary
    const response = await enzymeClient.post<LegalDocument>(ENDPOINTS.upload, {
      body: formData,
    });
    
    return response.data;
  },

  /**
   * Download a document
   * @example
   * await enzymeDocumentsService.download('doc-123');
   */
  async download(id: string): Promise<void> {
    // Download requires blob handling - use direct fetch
    const token = localStorage.getItem('authToken');
    const baseUrl = API_BASE_URL;
    
    const response = await fetch(`${baseUrl}${ENDPOINTS.download(id)}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'document'
      : 'document';

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Get document content
   * @example
   * const { content, mimeType } = await enzymeDocumentsService.getContent('doc-123');
   */
  async getContent(id: string): Promise<{ content: string; mimeType: string }> {
    const response = await enzymeClient.get<{ content: string; mimeType: string }>(
      ENDPOINTS.content(id)
    );
    return response.data;
  },

  /**
   * Get the download URL for a document
   * @example
   * const url = enzymeDocumentsService.getDownloadUrl('doc-123');
   */
  getDownloadUrl(id: string): string {
    return `${API_BASE_URL}${ENDPOINTS.download(id)}`;
  },

  /**
   * Get document versions
   */
  async getVersions(id: string): Promise<DocumentVersion[]> {
    const response = await enzymeClient.get<DocumentVersion[]>(ENDPOINTS.versions(id));
    return response.data || [];
  },

  /**
   * Get document annotations
   */
  async getAnnotations(id: string): Promise<Annotation[]> {
    const response = await enzymeClient.get<Annotation[]>(ENDPOINTS.annotations(id));
    return response.data || [];
  },

  /**
   * Get document activity
   */
  async getActivity(id: string): Promise<DocumentActivity[]> {
    const response = await enzymeClient.get<DocumentActivity[]>(ENDPOINTS.activity(id));
    return response.data || [];
  },

  /**
   * Get folders
   */
  async getFolders(params?: any): Promise<Folder[]> {
    const response = await enzymeClient.get<Folder[]>(ENDPOINTS.folders, { params });
    return response.data || [];
  },

  /**
   * Create folder
   */
  async createFolder(data: Partial<Folder>): Promise<Folder> {
    const response = await enzymeClient.post<Folder>(ENDPOINTS.folders, { body: data });
    return response.data;
  },

  /**
   * Delete folder
   */
  async deleteFolder(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.folder(id));
  },

  /**
   * Move document
   */
  async moveDocument(id: string, folderId: string): Promise<LegalDocument> {
    const response = await enzymeClient.post<LegalDocument>(ENDPOINTS.move(id), { 
      body: { folderId } 
    });
    return response.data;
  },

  /**
   * Share document
   */
  async shareDocument(id: string, data: any): Promise<DocumentShare> {
    const response = await enzymeClient.post<DocumentShare>(ENDPOINTS.share(id), { body: data });
    return response.data;
  },

  /**
   * Add annotation
   */
  async addAnnotation(documentId: string, data: Partial<Annotation>): Promise<Annotation> {
    const response = await enzymeClient.post<Annotation>(ENDPOINTS.annotations(documentId), { body: data });
    return response.data;
  },

  /**
   * Update annotation
   */
  async updateAnnotation(documentId: string, annotationId: string, data: Partial<Annotation>): Promise<Annotation> {
    const response = await enzymeClient.put<Annotation>(`${ENDPOINTS.annotations(documentId)}/${annotationId}`, { body: data });
    return response.data;
  },

  /**
   * Delete annotation
   */
  async deleteAnnotation(documentId: string, annotationId: string): Promise<void> {
    await enzymeClient.delete(`${ENDPOINTS.annotations(documentId)}/${annotationId}`);
  },
};

export default enzymeDocumentsService;

