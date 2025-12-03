/**
 * useDocuments Hook - Enzyme-powered document management
 * 
 * Provides type-safe access to document data with file upload,
 * download, and content extraction capabilities.
 */

import { useCallback, useMemo } from 'react';
import { useApiRequest, useApiMutation, invalidateCache } from '../services/hooks';
import { enzymeDocumentsService } from '../services/documents.service';
import { useLatestCallback, useIsMounted, useTrackEvent } from '@missionfabric-js/enzyme/hooks';
import type { LegalDocument } from '../../types';
import type { DocumentUploadMetadata } from '../../services/api-error';

interface UseDocumentsOptions {
  /** Filter by case ID */
  caseId?: string;
  /** Filter by organization ID */
  orgId?: string;
  /** Filter by document type */
  type?: string;
  /** Search term */
  search?: string;
  /** Stale time in milliseconds */
  staleTime?: number;
}

interface UseDocumentsResult {
  /** List of documents */
  documents: LegalDocument[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether data has been fetched */
  isFetched: boolean;
  /** Refetch documents */
  refetch: () => Promise<void>;
  /** Upload a document */
  uploadDocument: (file: File, metadata?: DocumentUploadMetadata) => Promise<LegalDocument>;
  /** Create document metadata */
  createDocument: (data: Partial<LegalDocument>) => Promise<LegalDocument>;
  /** Update a document */
  updateDocument: (id: string, data: Partial<LegalDocument>) => Promise<LegalDocument>;
  /** Delete a document */
  deleteDocument: (id: string) => Promise<void>;
  /** Download a document */
  downloadDocument: (id: string) => Promise<void>;
  /** Get document content */
  getContent: (id: string) => Promise<{ content: string; mimeType: string }>;
  /** Uploading state */
  isUploading: boolean;
  /** Creating state */
  isCreating: boolean;
  /** Updating state */
  isUpdating: boolean;
  /** Deleting state */
  isDeleting: boolean;
}

/**
 * Hook for managing documents with Enzyme
 * 
 * @example
 * ```tsx
 * const { documents, uploadDocument, isUploading } = useDocuments({ caseId: 'case-123' });
 * 
 * // Upload a document
 * const doc = await uploadDocument(file, { title: 'Contract', type: 'Legal' });
 * ```
 */
export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsResult {
  const { caseId, orgId, type, search, staleTime = 60000 } = options;
  
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Build query params
  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (caseId) p.caseId = caseId;
    if (orgId) p.orgId = orgId;
    if (type) p.type = type;
    if (search) p.search = search;
    return Object.keys(p).length > 0 ? p : undefined;
  }, [caseId, orgId, type, search]);

  // Fetch documents
  const { 
    data, 
    isLoading, 
    error, 
    isFetched,
    refetch 
  } = useApiRequest<LegalDocument[]>({
    endpoint: '/documents',
    options: { 
      staleTime,
      params,
    }
  });

  // Create mutation
  const { 
    mutateAsync: createMutation, 
    isPending: isCreating 
  } = useApiMutation<LegalDocument>({
    method: 'POST',
    endpoint: '/documents',
  });

  // Update mutation
  const { 
    mutateAsync: updateMutation, 
    isPending: isUpdating 
  } = useApiMutation<LegalDocument>({
    method: 'PUT',
    endpoint: '/documents',
  });

  // Delete mutation
  const { 
    mutateAsync: deleteMutation, 
    isPending: isDeleting 
  } = useApiMutation<void>({
    method: 'DELETE',
    endpoint: '/documents',
  });

  // Upload state (separate from mutations as it uses FormData)
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = useLatestCallback(async (
    file: File, 
    metadata?: DocumentUploadMetadata
  ): Promise<LegalDocument> => {
    setIsUploading(true);
    try {
      const doc = await enzymeDocumentsService.upload(file, metadata);
      
      if (isMounted()) {
        trackEvent('document_uploaded', { 
          documentId: doc.id, 
          fileType: file.type,
          fileSize: file.size 
        });
        invalidateCache('/documents');
      }
      
      return doc;
    } finally {
      if (isMounted()) {
        setIsUploading(false);
      }
    }
  });

  const createDocument = useLatestCallback(async (docData: Partial<LegalDocument>): Promise<LegalDocument> => {
    const newDoc = await createMutation({ data: docData });
    
    if (isMounted()) {
      trackEvent('document_created', { documentId: newDoc.id });
      invalidateCache('/documents');
    }
    
    return newDoc;
  });

  const updateDocument = useLatestCallback(async (id: string, docData: Partial<LegalDocument>): Promise<LegalDocument> => {
    const updatedDoc = await enzymeDocumentsService.update(id, docData);
    
    if (isMounted()) {
      trackEvent('document_updated', { documentId: id });
      invalidateCache('/documents');
      invalidateCache(`/documents/${id}`);
    }
    
    return updatedDoc;
  });

  const deleteDocument = useLatestCallback(async (id: string): Promise<void> => {
    await enzymeDocumentsService.delete(id);
    
    if (isMounted()) {
      trackEvent('document_deleted', { documentId: id });
      invalidateCache('/documents');
    }
  });

  const downloadDocument = useLatestCallback(async (id: string): Promise<void> => {
    await enzymeDocumentsService.download(id);
    trackEvent('document_downloaded', { documentId: id });
  });

  const getContent = useLatestCallback(async (id: string) => {
    return enzymeDocumentsService.getContent(id);
  });

  return {
    documents: data || [],
    isLoading,
    error,
    isFetched,
    refetch,
    uploadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getContent,
    isUploading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

/**
 * Hook for fetching a single document by ID
 */
export function useDocument(documentId: string | undefined) {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useApiRequest<LegalDocument>({
    endpoint: documentId ? `/documents/${documentId}` : '',
    options: { 
      enabled: !!documentId,
      staleTime: 30000,
    }
  });

  return {
    document: data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching documents by type
 */
export function useDocumentsByType(documentType: string) {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useApiRequest<LegalDocument[]>({
    endpoint: `/documents/type/${encodeURIComponent(documentType)}`,
    options: { 
      enabled: !!documentType,
      staleTime: 60000,
    }
  });

  return {
    documents: data || [],
    isLoading,
    error,
    refetch,
  };
}

// Need to import useState
import { useState } from 'react';

export default useDocuments;
