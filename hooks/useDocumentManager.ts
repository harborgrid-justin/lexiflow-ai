
import { useState, useMemo } from 'react';
import { LegalDocument, DocumentVersion } from '../types';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';

const ENRICHED_DOCS: LegalDocument[] = [
    ...MOCK_DOCUMENTS.map(d => ({
        ...d,
        sourceModule: 'General' as const,
        status: 'Final' as const,
        isEncrypted: true,
        fileSize: '1.2 MB'
    })),
    {
        id: 'D-EVD-001', caseId: 'C-2024-001', title: 'Forensic Server Logs', type: 'Evidence', content: 'Log data...',
        uploadDate: '2024-03-01', lastModified: '2024-03-01', tags: ['Evidence', 'Critical'], versions: [],
        sourceModule: 'Evidence', status: 'Final', isEncrypted: true, fileSize: '45 MB'
    },
    {
        id: 'D-DISC-002', caseId: 'C-2024-001', title: 'Response to RFP Set 1', type: 'Discovery', content: 'Response...',
        uploadDate: '2024-03-10', lastModified: '2024-03-12', tags: ['Discovery', 'Draft'], versions: [],
        sourceModule: 'Discovery', status: 'Draft', isEncrypted: false, fileSize: '0.5 MB'
    },
    {
        id: 'D-BILL-003', caseId: 'C-2024-112', title: 'Q1 Invoice Summary', type: 'Financial', content: 'Invoice...',
        uploadDate: '2024-03-15', lastModified: '2024-03-15', tags: ['Billing'], versions: [],
        sourceModule: 'Billing', status: 'Signed', isEncrypted: true, fileSize: '0.2 MB'
    }
];

export const useDocumentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<string>('All');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<LegalDocument | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>(ENRICHED_DOCS);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleRestore = (version: DocumentVersion) => {
    if (!selectedDocForHistory) return;
    const newDocs = documents.map(d => {
      if (d.id === selectedDocForHistory.id) {
        return { ...d, content: version.contentSnapshot || '', lastModified: new Date().toISOString().split('T')[0] };
      }
      return d;
    });
    setDocuments(newDocs);
    setSelectedDocForHistory(null);
  };

  const handleBulkSummarize = async () => {
      if (selectedDocs.length === 0) return;
      setIsProcessingAI(true);
      await new Promise(r => setTimeout(r, 1500));
      alert(`AI Summary generated for ${selectedDocs.length} documents. Report saved to case file.`);
      setIsProcessingAI(false);
      setSelectedDocs([]);
  };

  const toggleSelection = (id: string) => {
      if (selectedDocs.includes(id)) setSelectedDocs(selectedDocs.filter(d => d !== id));
      else setSelectedDocs([...selectedDocs, id]);
  };

  const addTag = (docId: string, tag: string) => {
    if (!tag.trim()) return;
    setDocuments(prev => prev.map(d => {
        if (d.id === docId && !d.tags.includes(tag.trim())) {
            return { ...d, tags: [...d.tags, tag.trim()] };
        }
        return d;
    }));
  };

  const removeTag = (docId: string, tag: string) => {
    setDocuments(prev => prev.map(d => {
        if (d.id === docId) {
            return { ...d, tags: d.tags.filter(t => t !== tag) };
        }
        return d;
    }));
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
