// Documents Service using Enzyme API Client
// Provides type-safe document operations with retry, rate limiting, and file upload support

import { enzymeClient } from './client';
import { API_BASE_URL } from '../../services/config';
import { LegalDocument } from '../../types';
import { DocumentUploadMetadata } from '../../services/api-error';

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
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.type) formData.append('type', metadata.type);
      if (metadata.caseId) formData.append('case_id', metadata.caseId);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.tags) formData.append('tags', metadata.tags.join(','));
      if (metadata.classification) formData.append('classification', metadata.classification);
    }

    // Use native fetch for multipart/form-data as Enzyme client may not support it
    const response = await enzymeClient.post<LegalDocument>(ENDPOINTS.upload, {
      body: formData as unknown as Record<string, unknown>,
      headers: {
        // Let browser set Content-Type with boundary
        'Content-Type': undefined as unknown as string,
      },
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
};

export default enzymeDocumentsService;
