/**
 * Document Management System API Hooks
 * TanStack Query hooks for document operations
 */

import { useApiRequest, useApiMutation } from '../../../enzyme/services/hooks';
import { enzymeDocumentsService } from '../../../enzyme/services/documents.service';
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
  filters: DocumentFilters = {}
) {
  return useApiRequest<LegalDocument[]>({
    endpoint: '/documents',
    options: {
      params: {
        caseId: filters.caseId,
        folderId: filters.folderId,
        search: filters.search,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        type: filters.type?.join(','),
        tags: filters.tags?.join(','),
        author: filters.author?.join(','),
        status: filters.status?.join(','),
      },
      staleTime: 30000,
    }
  });
}

/**
 * Fetch single document by ID
 */
export function useDocument(id: string) {
  return useApiRequest<LegalDocument>({
    endpoint: `/documents/${id}`,
    options: {
      enabled: !!id,
      staleTime: 60000,
    }
  });
}

/**
 * Fetch document versions
 */
export function useDocumentVersions(documentId: string) {
  return useApiRequest<DocumentVersion[]>({
    endpoint: `/documents/${documentId}/versions`,
    options: {
      enabled: !!documentId,
      staleTime: 60000,
    }
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
      const annotations = await enzymeDocumentsService.getAnnotations(documentId);
      return annotations as unknown as Annotation[];
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
      const docs = await enzymeDocumentsService.getAll({ caseId: filters.caseId });

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
      const activity = await enzymeDocumentsService.getActivity(documentId);
      return activity as unknown as DocumentActivity[];
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
      const folders = await enzymeDocumentsService.getFolders(filters);
      return folders as unknown as Folder[];
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
      return enzymeDocumentsService.upload(file, metadata);
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
      return enzymeDocumentsService.update(id, data);
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
      await enzymeDocumentsService.delete(id);
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
      return enzymeDocumentsService.moveDocument(documentId, folderId);
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
      const shareData = { permissions, expiresAt, password };
      const share = await enzymeDocumentsService.shareDocument(documentId, shareData);
      return share as unknown as DocumentShare;
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
      const newAnnotation = await enzymeDocumentsService.addAnnotation(annotation.documentId, annotation);
      return newAnnotation as unknown as Annotation;
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
      if (!data.documentId) {
        throw new Error("documentId is required for updating annotation");
      }
      const updated = await enzymeDocumentsService.updateAnnotation(data.documentId, id, data);
      return updated as unknown as Annotation;
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
    mutationFn: async ({ id, documentId }) => {
      await enzymeDocumentsService.deleteAnnotation(documentId, id);
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
      const newFolder = await enzymeDocumentsService.createFolder(folder);
      return newFolder as unknown as Folder;
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
      await enzymeDocumentsService.deleteFolder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.folders() });
    },
    ...options,
  });
}
