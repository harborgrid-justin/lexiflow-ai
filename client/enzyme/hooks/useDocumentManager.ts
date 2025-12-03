/**
 * useDocumentManager Hook - Document Management
 *
 * Manages document CRUD, tagging, filtering, and AI processing.
 *
 * Enzyme Features:
 * - useApiRequest: Automatic caching and refetching
 * - useApiMutation: Type-safe mutations with cache invalidation
 * - useLatestCallback: Stable callback references
 * - useIsMounted: Safe state updates after async operations
 * - useDebouncedValue: Optimized search term filtering
 * - useOptimisticUpdate: Instant UI updates with rollback
 * - useErrorToast: Consistent error messaging
 * - useSafeCallback: Error-safe callback execution
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState, useMemo } from 'react';
import { LegalDocument, DocumentVersion } from '../../types';
import { ApiError } from '../../services/apiService';
import { ensureTagsArray } from '../../utils/type-transformers';
import { useApiRequest, useApiMutation } from '../services/hooks';
import {
  useLatestCallback,
  useIsMounted,
  useDebouncedValue,
} from '@missionfabric-js/enzyme/hooks';
import {
  useOptimisticUpdate,
  useErrorToast,
  useSafeCallback,
} from '@missionfabric-js/enzyme/hooks';
import { useQueryClient } from '@tanstack/react-query';

export const useDocumentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('All');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<LegalDocument | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();
  const showErrorToast = useErrorToast();

  // Debounce search term for optimized filtering
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Fetch documents with automatic caching
  const { data: documents = [], isLoading: loading, refetch: _refetch } = useApiRequest<LegalDocument[]>({
    endpoint: '/documents',
    options: { 
      staleTime: 5 * 60 * 1000,
      retry: 2
    }
  });

  // Mutation for updating documents
  const { mutateAsync: updateDocument } = useApiMutation<LegalDocument, Partial<LegalDocument>>({
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/documents'] });
    }
  });

  const handleRestore = useLatestCallback(async (version: DocumentVersion) => {
    if (!selectedDocForHistory) return;
    try {
      if (isMounted()) setError(null);

      const updatedDoc = {
        ...selectedDocForHistory,
        content: version.contentSnapshot || '',
        lastModified: new Date().toISOString().split('T')[0]
      };

      await updateDocument({
        endpoint: `/documents/${selectedDocForHistory.id}`,
        data: updatedDoc
      });

      if (isMounted()) setSelectedDocForHistory(null);
    } catch (err) {
      console.error('Failed to restore document version:', err);

      if (isMounted()) {
        const errorMessage = err instanceof ApiError
          ? `Failed to restore document: ${err.statusText}`
          : 'Failed to restore document. Please try again.';
        setError(errorMessage);
        showErrorToast(errorMessage);
      }
      throw err;
    }
  });

  const handleBulkSummarize = useLatestCallback(async () => {
    if (selectedDocs.length === 0) return;
    if (isMounted()) setIsProcessingAI(true);
    // In a real app, this would call a backend endpoint for bulk processing
    await new Promise(r => setTimeout(r, 1500));
    alert(`AI Summary generated for ${selectedDocs.length} documents. Report saved to case file.`);
    if (isMounted()) {
      setIsProcessingAI(false);
      setSelectedDocs([]);
    }
  });

  // Error-safe UI interactions
  const toggleSelection = useSafeCallback((id: string) => {
    if (selectedDocs.includes(id)) setSelectedDocs(selectedDocs.filter(d => d !== id));
    else setSelectedDocs([...selectedDocs, id]);
  }, [selectedDocs]);

  // Optimistically add a tag with automatic rollback on failure
  const addTag = useOptimisticUpdate(
    async (docId: string, tag: string) => {
      if (!tag.trim()) return;
      const doc = documents.find(d => d.id === docId);
      if (!doc || ensureTagsArray(doc.tags).includes(tag.trim())) return;

      const updatedTags = [...ensureTagsArray(doc.tags), tag.trim()];

      await updateDocument({
        endpoint: `/documents/${docId}`,
        data: { tags: updatedTags }
      });
    },
    {
      onError: (err) => {
        console.error('Failed to add tag:', err);
        const errorMessage = err instanceof ApiError
          ? `Failed to add tag: ${err.statusText}`
          : 'Failed to add tag. Please try again.';

        if (isMounted()) {
          setError(errorMessage);
          showErrorToast(errorMessage);
        }
      },
      onOptimisticUpdate: (docId: string, tag: string) => {
        queryClient.setQueryData(['/documents'], (oldData: LegalDocument[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(d => {
            if (d.id === docId) {
              const updatedTags = [...ensureTagsArray(d.tags), tag.trim()];
              return { ...d, tags: updatedTags };
            }
            return d;
          });
        });
      },
      onRollback: () => {
        queryClient.invalidateQueries({ queryKey: ['/documents'] });
      }
    }
  );

  // Optimistically remove a tag with automatic rollback on failure
  const removeTag = useOptimisticUpdate(
    async (docId: string, tag: string) => {
      const doc = documents.find(d => d.id === docId);
      if (!doc) return;

      const updatedTags = ensureTagsArray(doc.tags).filter(t => t !== tag);

      await updateDocument({
        endpoint: `/documents/${docId}`,
        data: { tags: updatedTags }
      });
    },
    {
      onError: (err) => {
        console.error('Failed to remove tag:', err);
        const errorMessage = err instanceof ApiError
          ? `Failed to remove tag: ${err.statusText}`
          : 'Failed to remove tag. Please try again.';

        if (isMounted()) {
          setError(errorMessage);
          showErrorToast(errorMessage);
        }
      },
      onOptimisticUpdate: (docId: string, tag: string) => {
        queryClient.setQueryData(['/api/v1/documents'], (oldData: LegalDocument[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(d => {
            if (d.id === docId) {
              const updatedTags = ensureTagsArray(d.tags).filter(t => t !== tag);
              return { ...d, tags: updatedTags };
            }
            return d;
          });
        });
      },
      onRollback: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/v1/documents'] });
      }
    }
  );

  const allTags = useMemo(() => Array.from(new Set(documents.flatMap(d => ensureTagsArray(d.tags)))), [documents]);

  // Use debounced search term for optimized filtering
  const filtered = useMemo(() => {
    return documents.filter(d => {
      const matchesSearch = (d.title || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        ensureTagsArray(d.tags).some(t => t.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      const matchesModule = activeModuleFilter === 'All' || d.sourceModule === activeModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [documents, debouncedSearchTerm, activeModuleFilter]);

  const stats = {
    total: documents.length,
    evidence: documents.filter(d => d.sourceModule === 'Evidence').length,
    discovery: documents.filter(d => d.sourceModule === 'Discovery').length,
    signed: documents.filter(d => d.status === 'Signed').length
  };

  const refresh = useLatestCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/v1/documents'] });
  });

  return {
    searchTerm,
    setSearchTerm,
    activeModuleFilter,
    setActiveModuleFilter,
    selectedDocs,
    setSelectedDocs,
    selectedDocForHistory,
    setSelectedDocForHistory,
    documents,
    isProcessingAI,
    loading,
    error,
    handleRestore,
    handleBulkSummarize,
    toggleSelection,
    addTag,
    removeTag,
    allTags,
    filtered,
    stats,
    refresh
  };
};
