/**
 * Document Management Hooks
 *
 * Composite hooks for document features using Enzyme patterns.
 * Combines API calls with analytics and state management.
 */

import { useState, useMemo } from 'react';
import { usePageView, useTrackEvent, useLatestCallback } from '@/enzyme';
import {
  useDocuments,
  useDocument,
  useDocumentVersions,
  useDocumentAnnotations,
  useDocumentStats,
  useFolders,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
  useMoveDocument,
  useAddAnnotation,
  type LegalDocument,
  type DocumentFilters,
  type Folder,
  type Annotation,
  type DocumentUploadMetadata,
} from '../api';

/**
 * Hook for the document manager page
 * Provides documents, folders, and document management functionality
 */
export function useDocumentManager(caseId?: string) {
  const trackEvent = useTrackEvent();

  // Track page view
  usePageView('document_manager', { caseId });

  // State
  const [filters, setFilters] = useState<DocumentFilters>({ caseId });
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Queries
  const documentsQuery = useDocuments({ ...filters, folderId: currentFolderId || undefined });
  const foldersQuery = useFolders({ caseId });
  const statsQuery = useDocumentStats({ caseId });
  const selectedDocumentQuery = useDocument(selectedDocumentId || '');

  // Mutations
  const uploadMutation = useUploadDocument();
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();
  const moveMutation = useMoveDocument();

  // Stable callbacks
  const uploadDocument = useLatestCallback(async (file: File, metadata?: DocumentUploadMetadata) => {
    trackEvent('document_upload_started', { fileName: file.name, fileSize: file.size });
    
    const result = await uploadMutation.mutateAsync({ file, metadata });
    
    trackEvent('document_upload_completed', { documentId: result.id });
    return result;
  });

  const updateDocument = useLatestCallback(async (id: string, data: Partial<LegalDocument>) => {
    trackEvent('document_updated', { documentId: id, fields: Object.keys(data) });
    return updateMutation.mutateAsync({ id, data });
  });

  const deleteDocument = useLatestCallback(async (id: string) => {
    trackEvent('document_deleted', { documentId: id });
    await deleteMutation.mutateAsync(id);
    
    // Clear selection if deleted document was selected
    if (selectedDocumentId === id) {
      setSelectedDocumentId(null);
    }
  });

  const moveDocument = useLatestCallback(async (documentId: string, folderId: string) => {
    trackEvent('document_moved', { documentId, folderId });
    return moveMutation.mutateAsync({ documentId, folderId });
  });

  const selectDocument = useLatestCallback((id: string | null) => {
    setSelectedDocumentId(id);
    if (id) {
      trackEvent('document_selected', { documentId: id });
    }
  });

  const navigateToFolder = useLatestCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    trackEvent('folder_navigated', { folderId });
  });

  const updateFilters = useLatestCallback((newFilters: Partial<DocumentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  });

  const searchDocuments = useLatestCallback((query: string) => {
    trackEvent('document_search', { query });
    updateFilters({ search: query });
  });

  // Computed values
  const documents = useMemo(() => documentsQuery.data || [], [documentsQuery.data]);
  
  const folders = useMemo(() => foldersQuery.data || [], [foldersQuery.data]);
  
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return folders.find(f => f.id === currentFolderId) || null;
  }, [folders, currentFolderId]);

  const breadcrumbs = useMemo(() => {
    const crumbs: Folder[] = [];
    if (!currentFolder) return crumbs;
    
    // Build breadcrumb path from folder hierarchy
    // This is simplified - would need full path from API
    crumbs.push(currentFolder);
    return crumbs;
  }, [currentFolder]);

  const stats = useMemo(() => statsQuery.data || {
    total: 0,
    byType: {},
    byStatus: {},
    totalSize: 0,
    recentUploads: 0,
  }, [statsQuery.data]);

  return {
    // State
    filters,
    selectedDocumentId,
    currentFolderId,
    viewMode,
    
    // Data
    documents,
    folders,
    currentFolder,
    breadcrumbs,
    selectedDocument: selectedDocumentQuery.data,
    stats,
    
    // Loading states
    isLoading: documentsQuery.isLoading,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Actions
    uploadDocument,
    updateDocument,
    deleteDocument,
    moveDocument,
    selectDocument,
    navigateToFolder,
    updateFilters,
    searchDocuments,
    setViewMode,
    
    // Errors
    error: documentsQuery.error || uploadMutation.error,
  };
}

/**
 * Hook for document detail view
 * Provides document data, versions, annotations
 */
export function useDocumentDetail(documentId: string) {
  const trackEvent = useTrackEvent();

  // Track page view
  usePageView('document_detail', { documentId });

  // Queries
  const documentQuery = useDocument(documentId);
  const versionsQuery = useDocumentVersions(documentId);
  const annotationsQuery = useDocumentAnnotations(documentId);

  // Mutations
  const updateMutation = useUpdateDocument();
  const addAnnotationMutation = useAddAnnotation();

  // Stable callbacks
  const updateDocument = useLatestCallback(async (data: Partial<LegalDocument>) => {
    trackEvent('document_updated', { documentId, fields: Object.keys(data) });
    return updateMutation.mutateAsync({ id: documentId, data });
  });

  const addAnnotation = useLatestCallback(async (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    trackEvent('annotation_added', { documentId, type: annotation.type });
    return addAnnotationMutation.mutateAsync(annotation);
  });

  const downloadDocument = useLatestCallback(() => {
    const doc = documentQuery.data;
    if (!doc?.filePath) return;
    
    trackEvent('document_downloaded', { documentId });
    
    // Trigger download
    const link = globalThis.document.createElement('a');
    link.href = doc.filePath;
    link.download = doc.filename || doc.title || 'document';
    link.click();
  });

  // Computed
  const documentData = documentQuery.data;
  const versions = versionsQuery.data || [];
  const annotations = useMemo(() => annotationsQuery.data || [], [annotationsQuery.data]);

  const annotationsByType = useMemo(() => {
    const grouped: Record<string, Annotation[]> = {};
    annotations.forEach(ann => {
      const type = ann.type || 'other';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(ann);
    });
    return grouped;
  }, [annotations]);

  return {
    // Data
    document: documentData,
    versions,
    annotations,
    annotationsByType,
    
    // Loading states
    isLoading: documentQuery.isLoading,
    isUpdating: updateMutation.isPending,
    
    // Actions
    updateDocument,
    addAnnotation,
    downloadDocument,
    
    // Refetch
    refetch: documentQuery.refetch,
    
    // Errors
    error: documentQuery.error,
  };
}

/**
 * Hook for document upload with progress tracking
 */
export function useDocumentUpload(caseId?: string) {
  const trackEvent = useTrackEvent();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const uploadMutation = useUploadDocument();

  const uploadFiles = useLatestCallback(async (files: File[], metadata?: DocumentUploadMetadata) => {
    const results: LegalDocument[] = [];
    
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate progress updates (real implementation would use XHR/fetch with progress)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90),
          }));
        }, 100);
        
        const result = await uploadMutation.mutateAsync({
          file,
          metadata: { ...metadata, caseId },
        });
        
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        
        results.push(result);
        trackEvent('document_uploaded', { documentId: result.id, fileName: file.name });
        
      } catch (error) {
        setUploadErrors(prev => ({
          ...prev,
          [fileId]: error instanceof Error ? error.message : 'Upload failed',
        }));
        trackEvent('document_upload_failed', { fileName: file.name });
      }
    }
    
    return results;
  });

  const clearProgress = useLatestCallback(() => {
    setUploadProgress({});
    setUploadErrors({});
  });

  return {
    uploadFiles,
    uploadProgress,
    uploadErrors,
    isUploading: uploadMutation.isPending,
    clearProgress,
  };
}

export type { LegalDocument, DocumentFilters, Folder, Annotation };
