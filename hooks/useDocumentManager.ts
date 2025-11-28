
import { useState, useMemo, useEffect } from 'react';
import { LegalDocument, DocumentVersion } from '../types';
import { ApiService } from '../services/apiService';

export const useDocumentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('All');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<LegalDocument | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await ApiService.getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };
    fetchDocs();
  }, []);

  const handleRestore = async (version: DocumentVersion) => {
    if (!selectedDocForHistory) return;
    try {
      const updatedDoc = { 
        ...selectedDocForHistory, 
        content: version.contentSnapshot || '', 
        lastModified: new Date().toISOString().split('T')[0] 
      };
      await ApiService.updateDocument(selectedDocForHistory.id, updatedDoc);
      
      const newDocs = documents.map(d => {
        if (d.id === selectedDocForHistory.id) {
          return updatedDoc;
        }
        return d;
      });
      setDocuments(newDocs);
      setSelectedDocForHistory(null);
    } catch (error) {
      console.error("Failed to restore document version", error);
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
      const updatedTags = [...doc.tags, tag.trim()];
      await ApiService.updateDocument(docId, { tags: updatedTags });
      
      setDocuments(prev => prev.map(d => {
          if (d.id === docId) {
              return { ...d, tags: updatedTags };
          }
          return d;
      }));
    } catch (error) {
      console.error("Failed to add tag", error);
    }
  };

  const removeTag = async (docId: string, tag: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    try {
      const updatedTags = doc.tags.filter(t => t !== tag);
      await ApiService.updateDocument(docId, { tags: updatedTags });

      setDocuments(prev => prev.map(d => {
          if (d.id === docId) {
              return { ...d, tags: updatedTags };
          }
          return d;
      }));
    } catch (error) {
      console.error("Failed to remove tag", error);
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
    handleRestore,
    handleBulkSummarize,
    toggleSelection,
    addTag,
    removeTag,
    allTags,
    filtered,
    stats
  };
};
