
import { useState, useMemo } from 'react';
import { LegalDocument, DocumentVersion } from '../types';
import { ApiService, ApiError } from '../services/apiService';
import { ensureTagsArray } from '../utils/type-transformers';
import { useApiRequest, useApiMutation, useLatestCallback, useIsMounted } from '../enzyme';
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

  // Fetch documents with Enzyme - automatic caching and refetching
  const { data: documents = [], isLoading: loading, refetch } = useApiRequest<LegalDocument[]>({
    endpoint: '/api/v1/documents',
    options: { 
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: 2
    }
  });

  // Mutation for updating documents
  const { mutateAsync: updateDocument } = useApiMutation<LegalDocument, Partial<LegalDocument>>({
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/documents'] });
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
        endpoint: `/api/v1/documents/${selectedDocForHistory.id}`,
        data: updatedDoc
      });

      if (isMounted()) setSelectedDocForHistory(null);
    } catch (err) {
      console.error('Failed to restore document version:', err);

      if (isMounted()) {
        if (err instanceof ApiError) {
          setError(`Failed to restore document: ${err.statusText}`);
        } else {
          setError('Failed to restore document. Please try again.');
        }
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

  const toggleSelection = (id: string) => {
      if (selectedDocs.includes(id)) setSelectedDocs(selectedDocs.filter(d => d !== id));
      else setSelectedDocs([...selectedDocs, id]);
  };

  const addTag = useLatestCallback(async (docId: string, tag: string) => {
    if (!tag.trim()) return;
    const doc = documents.find(d => d.id === docId);
    if (!doc || ensureTagsArray(doc.tags).includes(tag.trim())) return;

    try {
      if (isMounted()) setError(null);
      const updatedTags = [...ensureTagsArray(doc.tags), tag.trim()];
      
      await updateDocument({
        endpoint: `/api/v1/documents/${docId}`,
        data: { tags: updatedTags }
      });
    } catch (err) {
      console.error('Failed to add tag:', err);

      if (isMounted()) {
        if (err instanceof ApiError) {
          setError(`Failed to add tag: ${err.statusText}`);
        } else {
          setError('Failed to add tag. Please try again.');
        }
      }
      throw err;
    }
  });

  const removeTag = useLatestCallback(async (docId: string, tag: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    try {
      if (isMounted()) setError(null);
      const updatedTags = ensureTagsArray(doc.tags).filter(t => t !== tag);
      
      await updateDocument({
        endpoint: `/api/v1/documents/${docId}`,
        data: { tags: updatedTags }
      });
    } catch (err) {
      console.error('Failed to remove tag:', err);

      if (isMounted()) {
        if (err instanceof ApiError) {
          setError(`Failed to remove tag: ${err.statusText}`);
        } else {
          setError('Failed to remove tag. Please try again.');
        }
      }
      throw err;
    }
  });

  const allTags = useMemo(() => Array.from(new Set(documents.flatMap(d => ensureTagsArray(d.tags)))), [documents]);

  const filtered = useMemo(() => {
    return documents.filter(d => {
        const matchesSearch = (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || ensureTagsArray(d.tags).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesModule = activeModuleFilter === 'All' || d.sourceModule === activeModuleFilter;
        return matchesSearch && matchesModule;
    });
  }, [documents, searchTerm, activeModuleFilter]);

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
