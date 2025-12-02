/**
 * Document Management System API Hooks
 * TanStack Query hooks for document operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiService } from '../../../services/apiService';
import type {
  LegalDocument,
  DocumentVersion,
  Folder,
  Annotation,
  DocumentShare,
  DocumentFilters,
  DocumentUploadMetadata,
  DocumentStats,
  DocumentActivity,
  DocumentsListResponse,
  FoldersListResponse,
  AnnotationReply,
  SharePermissions,
} from './documents.types';

// Query Keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  versions: (id: string) => [...documentKeys.all, 'versions', id] as const,
  annotations: (id: string) => [...documentKeys.all, 'annotations', id] as const,
  folders: () => [...documentKeys.all, 'folders'] as const,
  folder: (id: string) => [...documentKeys.folders(), id] as const,
  stats: () => [...documentKeys.all, 'stats'] as const,
  activity: (id: string) => [...documentKeys.all, 'activity', id] as const,
  share: (id: string) => [...documentKeys.all, 'share', id] as const,
};

// ============================================================================
// Document Queries
// ============================================================================

/**
 * Fetch documents with filtering and search
 */
export function useDocuments(
  filters: DocumentFilters = {},
  options?: Omit<UseQueryOptions<LegalDocument[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.folderId) params.append('folderId', filters.folderId);
      if (filters.caseId) params.append('caseId', filters.caseId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.type?.length) params.append('type', filters.type.join(','));
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.author?.length) params.append('author', filters.author.join(','));
      if (filters.status?.length) params.append('status', filters.status.join(','));

      return ApiService.documents.getAll(filters.caseId);
    },
    staleTime: 30000, // 30 seconds
    ...options,
  });
}

/**
 * Fetch single document by ID
 */
export function useDocument(
  id: string,
  options?: Omit<UseQueryOptions<LegalDocument, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => ApiService.documents.getById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    ...options,
  });
}

/**
 * Fetch document versions
 */
export function useDocumentVersions(
  documentId: string,
  options?: Omit<UseQueryOptions<DocumentVersion[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.versions(documentId),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return [] as DocumentVersion[];
    },
    enabled: !!documentId,
    staleTime: 60000,
    ...options,
  });
}

/**
 * Fetch document annotations
 */
export function useDocumentAnnotations(
  documentId: string,
  options?: Omit<UseQueryOptions<Annotation[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.annotations(documentId),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return [] as Annotation[];
    },
    enabled: !!documentId,
    staleTime: 30000,
    ...options,
  });
}

/**
 * Fetch document statistics
 */
export function useDocumentStats(
  filters: Pick<DocumentFilters, 'caseId'> = {},
  options?: Omit<UseQueryOptions<DocumentStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...documentKeys.stats(), filters],
    queryFn: async () => {
      const docs = await ApiService.documents.getAll(filters.caseId);

      const stats: DocumentStats = {
        total: docs.length,
        byType: {},
        byStatus: {},
        totalSize: 0,
        recentUploads: 0,
      };

      docs.forEach(doc => {
        // By type
        if (doc.type) {
          stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
        }

        // By status
        if (doc.status) {
          stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
        }

        // Total size
        if (typeof doc.fileSize === 'number') {
          stats.totalSize += doc.fileSize;
        }

        // Recent uploads (last 7 days)
        if (doc.uploadDate || doc.createdAt) {
          const date = new Date(doc.uploadDate || doc.createdAt!);
          const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince <= 7) {
            stats.recentUploads++;
          }
        }
      });

      return stats;
    },
    staleTime: 60000,
    ...options,
  });
}

/**
 * Fetch document activity log
 */
export function useDocumentActivity(
  documentId: string,
  options?: Omit<UseQueryOptions<DocumentActivity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.activity(documentId),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return [] as DocumentActivity[];
    },
    enabled: !!documentId,
    staleTime: 60000,
    ...options,
  });
}

// ============================================================================
// Folder Queries
// ============================================================================

/**
 * Fetch folder tree
 */
export function useFolders(
  filters: Pick<DocumentFilters, 'caseId'> = {},
  options?: Omit<UseQueryOptions<Folder[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...documentKeys.folders(), filters],
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      const mockFolders: Folder[] = [
        {
          id: 'root',
          name: 'Documents',
          path: '/',
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          documentCount: 0,
        },
      ];
      return mockFolders;
    },
    staleTime: 60000,
    ...options,
  });
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Upload document mutation
 */
export function useUploadDocument(
  options?: UseMutationOptions<LegalDocument, Error, { file: File; metadata?: DocumentUploadMetadata }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, metadata }) => {
      return ApiService.documents.upload(file, metadata);
    },
    onSuccess: (data, variables) => {
      // Invalidate document lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.stats() });

      // Update cache with new document
      queryClient.setQueryData(documentKeys.detail(data.id), data);
    },
    ...options,
  });
}

/**
 * Update document mutation
 */
export function useUpdateDocument(
  options?: UseMutationOptions<LegalDocument, Error, { id: string; data: Partial<LegalDocument> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return ApiService.documents.update(id, data);
    },
    onSuccess: (data, variables) => {
      // Update cache
      queryClient.setQueryData(documentKeys.detail(variables.id), data);

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    ...options,
  });
}

/**
 * Delete document mutation
 */
export function useDeleteDocument(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ApiService.documents.delete(id);
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: documentKeys.detail(id) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
    },
    ...options,
  });
}

/**
 * Move document to folder
 */
export function useMoveDocument(
  options?: UseMutationOptions<LegalDocument, Error, { documentId: string; folderId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, folderId }) => {
      // Mock implementation - replace with actual API call
      return ApiService.documents.update(documentId, {
        // Add folderId field when backend supports it
      } as any);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentKeys.detail(variables.documentId), data);
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    ...options,
  });
}

/**
 * Share document mutation
 */
export function useShareDocument(
  options?: UseMutationOptions<DocumentShare, Error, {
    documentId: string;
    permissions: SharePermissions;
    expiresAt?: string;
    password?: string;
  }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, permissions, expiresAt, password }) => {
      // Mock implementation - replace with actual API call
      const share: DocumentShare = {
        id: Math.random().toString(36),
        documentId,
        sharedBy: 'current-user',
        shareLink: `https://lexiflow.com/share/${Math.random().toString(36)}`,
        expiresAt,
        permissions,
        password,
        downloadable: permissions.view,
        createdAt: new Date().toISOString(),
      };
      return share;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.share(variables.documentId) });
    },
    ...options,
  });
}

/**
 * Add annotation mutation
 */
export function useAddAnnotation(
  options?: UseMutationOptions<Annotation, Error, Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (annotation) => {
      // Mock implementation - replace with actual API call
      const newAnnotation: Annotation = {
        ...annotation,
        id: Math.random().toString(36),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newAnnotation;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.annotations(variables.documentId) });
    },
    ...options,
  });
}

/**
 * Update annotation mutation
 */
export function useUpdateAnnotation(
  options?: UseMutationOptions<Annotation, Error, { id: string; data: Partial<Annotation> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Mock implementation - replace with actual API call
      return { ...data, id } as Annotation;
    },
    onSuccess: (data, variables) => {
      if (data.documentId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.annotations(data.documentId) });
      }
    },
    ...options,
  });
}

/**
 * Delete annotation mutation
 */
export function useDeleteAnnotation(
  options?: UseMutationOptions<void, Error, { id: string; documentId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      // Mock implementation - replace with actual API call
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.annotations(variables.documentId) });
    },
    ...options,
  });
}

/**
 * Create folder mutation
 */
export function useCreateFolder(
  options?: UseMutationOptions<Folder, Error, Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'documentCount'>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder) => {
      // Mock implementation - replace with actual API call
      const newFolder: Folder = {
        ...folder,
        id: Math.random().toString(36),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documentCount: 0,
      };
      return newFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.folders() });
    },
    ...options,
  });
}

/**
 * Delete folder mutation
 */
export function useDeleteFolder(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation - replace with actual API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.folders() });
    },
    ...options,
  });
}
