
import React, { useState } from 'react';
import { Search, Plus, Share2, Split, Wand2, RefreshCw, X } from 'lucide-react';
import { UserRole, LegalDocument } from '../types';
import { DocumentVersions } from './DocumentVersions';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Card } from './common/Card';
import { StatCard } from './common/Stats';
import { useDocumentManager } from '../hooks/useDocumentManager';
import { DocumentTable } from './document/DocumentTable';
import { DocumentFilters } from './document/DocumentFilters';
import { ensureTagsArray } from '../utils/type-transformers';

interface DocumentManagerProps {
  currentUserRole?: UserRole;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ currentUserRole = 'Associate' }) => {
  const {
    searchTerm,
    setSearchTerm,
    activeModuleFilter,
    setActiveModuleFilter,
    selectedDocs,
    setSelectedDocs,
    selectedDocForHistory,
    setSelectedDocForHistory,
    isProcessingAI,
    handleRestore,
    handleBulkSummarize,
    toggleSelection,
    addTag,
    removeTag,
    allTags,
    filtered,
    stats
  } = useDocumentManager();

  const [taggingDoc, setTaggingDoc] = useState<LegalDocument | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 relative animate-fade-in">
      {selectedDocForHistory && (
        <DocumentVersions 
          document={selectedDocForHistory} 
          userRole={currentUserRole} 
          onRestore={handleRestore}
          onClose={() => setSelectedDocForHistory(null)}
        />
      )}

      {/* Tag Management Modal */}
      <Modal isOpen={!!taggingDoc} onClose={() => { setTaggingDoc(null); setNewTagInput(''); }} title="Manage Document Tags" size="sm">
        <div className="p-6">
            <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Current Tags</label>
                <div className="flex flex-wrap gap-2">
                    {ensureTagsArray(taggingDoc?.tags).length === 0 && <span className="text-sm text-slate-400 italic">No tags assigned.</span>}
                    {ensureTagsArray(taggingDoc?.tags).map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm border border-blue-100">
                            {tag}
                            <button onClick={() => removeTag(taggingDoc!.id, tag)} className="ml-2 text-blue-400 hover:text-blue-600"><X className="h-3 w-3"/></button>
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Add New Tag</label>
                <div className="flex gap-2">
                    <input 
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type new tag name..."
                        value={newTagInput}
                        onChange={e => setNewTagInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                addTag(taggingDoc!.id, newTagInput);
                                setNewTagInput('');
                            }
                        }}
                    />
                    <Button size="sm" onClick={() => { addTag(taggingDoc!.id, newTagInput); setNewTagInput(''); }} disabled={!newTagInput.trim()}>Add</Button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Suggested / Recent</label>
                <div className="flex flex-wrap gap-2">
                    {allTags.filter(t => !ensureTagsArray(taggingDoc?.tags).includes(t)).slice(0, 8).map(t => (
                        <button key={t} onClick={() => addTag(taggingDoc!.id, t)} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 flex items-center">
                            <Plus className="h-3 w-3 mr-1"/> {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </Modal>

      <PageHeader 
        title="Central Document Repository" 
        subtitle="Unified access to Case Files, Evidence, Discovery, and Financial records."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Share2} onClick={() => alert("Secure Share Link Generated")}>Share</Button>
            <Button variant="primary" icon={Plus}>Upload</Button>
          </div>
        }
      />

      {/* Feature 1: Advanced Filtering & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Assets" value={stats.total} color="text-slate-900" bg="bg-white" />
          <StatCard label="Evidence Linked" value={stats.evidence} color="text-blue-600" bg="bg-white" />
          <StatCard label="Discovery Prod." value={stats.discovery} color="text-purple-600" bg="bg-white" />
          <StatCard label="e-Signed" value={stats.signed} color="text-green-600" bg="bg-white" />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
          <DocumentFilters activeModuleFilter={activeModuleFilter} setActiveModuleFilter={setActiveModuleFilter} />

          <Card className="flex-1 flex flex-col overflow-hidden p-0">
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search content & tags..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                {/* Feature 3: Bulk Actions */}
                <div className="flex gap-2">
                    {selectedDocs.length > 0 && (
                        <>
                            <Button variant="ghost" size="sm" icon={Split} onClick={() => alert("Compare Mode Activated")}>Compare (2)</Button>
                            <Button variant="ghost" size="sm" icon={Wand2} onClick={handleBulkSummarize} isLoading={isProcessingAI}>AI Summarize</Button>
                            <span className="h-8 w-px bg-slate-300 mx-1"></span>
                        </>
                    )}
                    <Button variant="secondary" size="sm" icon={RefreshCw}>Sync</Button>
                </div>
             </div>

             <DocumentTable 
                documents={filtered}
                selectedDocs={selectedDocs}
                toggleSelection={toggleSelection}
                setSelectedDocs={setSelectedDocs}
                setSelectedDocForHistory={setSelectedDocForHistory}
                setTaggingDoc={setTaggingDoc}
             />
          </Card>
      </div>
    </div>
  );
};
