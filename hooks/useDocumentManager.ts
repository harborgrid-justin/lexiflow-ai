
import { useState, useMemo, useEffect, useCallback } from 'react';
import { LegalDocument, DocumentVersion } from '../types';
import { ApiService, ApiError } from '../services/apiService';

export const useDocumentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('All');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<LegalDocument | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const docs = await ApiService.documents.getAll();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to fetch documents:', err);

      if (err instanceof ApiError) {
        setError(`Failed to load documents: ${err.statusText}`);
      } else {
        setError('Failed to load documents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleRestore = async (version: DocumentVersion) => {
    if (!selectedDocForHistory) return;
    try {
      setError(null);

      const updatedDoc = {
        ...selectedDocForHistory,
        content: version.contentSnapshot || '',
        lastModified: new Date().toISOString().split('T')[0]
      };
      await ApiService.documents.update(selectedDocForHistory.id, updatedDoc);

      const newDocs = documents.map(d => {
        if (d.id === selectedDocForHistory.id) {
          return updatedDoc;
        }
        return d;
      });
      setDocuments(newDocs);
      setSelectedDocForHistory(null);
    } catch (err) {
      console.error('Failed to restore document version:', err);

      if (err instanceof ApiError) {
        setError(`Failed to restore document: ${err.statusText}`);
      } else {
        setError('Failed to restore document. Please try again.');
      }
      throw err;
    }
  };

  const handleBulkSummarize = async () => {
      if (selectedDocs.length === 0) return;
      setIsProcessingAI(true);
      // In a real app, this would call a backend endpoint for bulk processing
      await new Promise(r => setTimeout(r, 1500));
      alert(`AI Summary generated for ${selectedDocs.length} documents. Report saved to case file.`);
      setIsProcessingAI(false);
      setSelectedDocs([]);
  };

  const toggleSelection = (id: string) => {
      if (selectedDocs.includes(id)) setSelectedDocs(selectedDocs.filter(d => d !== id));
      else setSelectedDocs([...selectedDocs, id]);
  };

  const addTag = async (docId: string, tag: string) => {
    if (!tag.trim()) return;
    const doc = documents.find(d => d.id === docId);
    if (!doc || doc.tags.includes(tag.trim())) return;

    try {
      setError(null);
      const updatedTags = [...doc.tags, tag.trim()];
      await ApiService.documents.update(docId, { tags: updatedTags });

      setDocuments(prev => prev.map(d => {
          if (d.id === docId) {
              return { ...d, tags: updatedTags };
          }
          return d;
      }));
    } catch (err) {
      console.error('Failed to add tag:', err);

      if (err instanceof ApiError) {
        setError(`Failed to add tag: ${err.statusText}`);
      } else {
        setError('Failed to add tag. Please try again.');
      }
      throw err;
    }
  };

  const removeTag = async (docId: string, tag: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    try {
      setError(null);
      const updatedTags = doc.tags.filter(t => t !== tag);
      await ApiService.documents.update(docId, { tags: updatedTags });

      setDocuments(prev => prev.map(d => {
          if (d.id === docId) {
              return { ...d, tags: updatedTags };
          }
          return d;
      }));
    } catch (err) {
      console.error('Failed to remove tag:', err);

      if (err instanceof ApiError) {
        setError(`Failed to remove tag: ${err.statusText}`);
      } else {
        setError('Failed to remove tag. Please try again.');
      }
      throw err;
    }
  };

  const allTags = useMemo(() => Array.from(new Set(documents.flatMap(d => d.tags))), [documents]);

  const filtered = useMemo(() => {
    return documents.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const refresh = useCallback(() => {
    return fetchDocs();
  }, [fetchDocs]);

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
    setDocuments,
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
