
import React, { useState } from 'react';
import { Search, FileText, Filter, Plus, Clock, MoreVertical, Download, Eye, Layers, ShieldCheck, Share2, Split, CheckSquare, Wand2, RefreshCw, X, Tag } from 'lucide-react';
import { UserRole, LegalDocument } from '../types';
import { DocumentVersions } from './DocumentVersions';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import { useDocumentManager } from '../hooks/useDocumentManager';

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
                    {taggingDoc?.tags.length === 0 && <span className="text-sm text-slate-400 italic">No tags assigned.</span>}
                    {taggingDoc?.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm border border-blue-100">
                            {tag}
                            <button onClick={() => removeTag(taggingDoc.id, tag)} className="ml-2 text-blue-400 hover:text-blue-600"><X className="h-3 w-3"/></button>
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
                    {allTags.filter(t => !taggingDoc?.tags.includes(t)).slice(0, 8).map(t => (
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
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold">Total Assets</div>
             <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold">Evidence Linked</div>
             <div className="text-2xl font-bold text-blue-600">{stats.evidence}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold">Discovery Prod.</div>
             <div className="text-2xl font-bold text-purple-600">{stats.discovery}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <div className="text-xs text-slate-500 uppercase font-bold">e-Signed</div>
             <div className="text-2xl font-bold text-green-600">{stats.signed}</div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
          {/* Feature 2: Cross-Module Filters */}
          <div className="w-full lg:w-64 bg-white rounded-lg border border-slate-200 p-4 h-fit">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Filter className="h-4 w-4 mr-2"/> Source Module</h3>
              <div className="space-y-1">
                  {['All', 'General', 'Evidence', 'Discovery', 'Billing'].map(mod => (
                      <button 
                        key={mod}
                        onClick={() => setActiveModuleFilter(mod)}
                        className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeModuleFilter === mod ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                          {mod}
                      </button>
                  ))}
              </div>

              <h3 className="font-bold text-slate-800 mt-6 mb-4 flex items-center"><Layers className="h-4 w-4 mr-2"/> Smart Categories</h3>
               <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Contracts</div>
                  <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Pleadings</div>
                  <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Correspondence</div>
              </div>
          </div>

          <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
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

             {/* Table */}
             <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                    <th className="w-10 px-6 py-3"><input type="checkbox" onChange={() => selectedDocs.length === filtered.length ? setSelectedDocs([]) : setSelectedDocs(filtered.map(d => d.id))} checked={selectedDocs.length === filtered.length && filtered.length > 0} /></th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Document Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Module Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Security</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {filtered.map((doc) => (
                    <tr key={doc.id} className={`hover:bg-slate-50 cursor-pointer group ${selectedDocs.includes(doc.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleSelection(doc.id)}>
                        <td className="px-6 py-4"><input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => toggleSelection(doc.id)} onClick={(e) => e.stopPropagation()}/></td>
                        <td className="px-6 py-4">
                        <div className="flex items-center">
                            <FileText className={`h-8 w-8 p-1.5 rounded-lg mr-3 transition-colors ${doc.sourceModule === 'Evidence' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`} />
                            <div>
                            <div className="text-sm font-medium text-slate-900 group-hover:text-blue-700">{doc.title}</div>
                            {/* Feature 4: Meta-tagging display & Edit */}
                            <div className="flex gap-1 mt-1 flex-wrap items-center">
                                {doc.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">{t}</span>)}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setTaggingDoc(doc); }} 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600" 
                                    title="Manage Tags"
                                >
                                    <Tag className="h-3 w-3"/>
                                </button>
                            </div>
                            </div>
                        </div>
                        </td>
                        {/* Feature 5: Module Linking */}
                        <td className="px-6 py-4">
                            <Badge variant={doc.sourceModule === 'Evidence' ? 'warning' : doc.sourceModule === 'Discovery' ? 'info' : 'neutral'}>
                                {doc.sourceModule}
                            </Badge>
                        </td>
                        {/* Feature 6: Status Indicators (OCR/Sign) */}
                        <td className="px-6 py-4">
                             {doc.status === 'Signed' ? (
                                 <span className="flex items-center text-xs text-green-700 font-medium"><CheckSquare className="h-3 w-3 mr-1"/> e-Signed</span>
                             ) : doc.status === 'Draft' ? (
                                <span className="flex items-center text-xs text-slate-500"><Clock className="h-3 w-3 mr-1"/> Draft</span>
                             ) : (
                                <span className="flex items-center text-xs text-blue-600">Final</span>
                             )}
                        </td>
                        {/* Feature 7: Security Status */}
                        <td className="px-6 py-4">
                            {doc.isEncrypted && <div className="flex items-center text-xs text-slate-500" title="AES-256 Encrypted"><ShieldCheck className="h-3 w-3 mr-1 text-green-500"/> Secure</div>}
                        </td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600"><Download className="h-4 w-4"/></button>
                            <button onClick={() => setSelectedDocForHistory(doc)} className="p-1.5 text-slate-400 hover:text-blue-600" title="View History"><Eye className="h-4 w-4"/></button>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600"><MoreVertical className="h-4 w-4"/></button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
             </div>
          </div>
      </div>
    </div>
  );
};
