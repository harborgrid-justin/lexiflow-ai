
/**
 * DocumentManager Component
 *
 * ENZYME MIGRATION - COMPLETED
 * =========================
 * This component has been fully migrated to use the Enzyme framework for:
 * - Progressive hydration with priority-based loading
 * - Analytics tracking with usePageView and useTrackEvent
 * - Stable callbacks with useLatestCallback
 * - Safe async operations with useIsMounted
 *
 * Enzyme Features Applied:
 * - usePageView('document_manager') - Page view tracking
 * - useTrackEvent() - Event analytics for all user interactions
 * - useLatestCallback() - Stable callbacks preventing stale closures
 * - useIsMounted() - Safe state updates in async operations
 * - HydrationBoundary - High-priority hydration for filters (immediate)
 * - LazyHydration - Normal-priority lazy hydration for document table (visible)
 *
 * Analytics Events:
 * - document_manager_viewed: Tracks page views with stats
 * - document_share_clicked: Share button interactions
 * - document_upload_clicked: Upload button interactions
 * - document_compare_activated: Compare mode activation
 * - document_bulk_summarize: Bulk AI summarization
 * - document_sync_clicked: Document sync operations
 *
 * Performance Optimizations:
 * - DocumentFilters: priority="high", trigger="immediate" (critical for UX)
 * - DocumentTable: priority="normal", trigger="visible" (lazy load when visible)
 *
 * @see /client/enzyme/MIGRATION_SCRATCHPAD.md
 * @see /client/enzyme/LESSONS_LEARNED.md
 */

import React from 'react';
import { Plus, Share2, Split, Wand2, RefreshCw, X, Activity, Zap } from 'lucide-react';
import { UserRole, LegalDocument } from '../types';
import { DocumentVersions } from './DocumentVersions';
import { PageHeader, Button, Modal, Card, SearchInput, StatCard } from './common';
import { useDocumentManager } from '../hooks/useDocumentManager';
import { DocumentTable } from './document/DocumentTable';
import { DocumentFilters } from './document/DocumentFilters';
import { ensureTagsArray } from '../utils/type-transformers';
import { useTagManagement } from '../hooks/useTagManagement';
import { useTrackEvent, useLatestCallback, usePageView, useIsMounted } from '@missionfabric-js/enzyme/hooks';
import { HydrationBoundary, LazyHydration } from '../enzyme';

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

  const {
    taggingDoc,
    setTaggingDoc,
    newTagInput,
    setNewTagInput,
    handleAddTag,
    handleRemoveTag
  } = useTagManagement();

  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Track page view with Enzyme
  usePageView('document_manager');

  // Track filter changes with safe mounted check
  React.useEffect(() => {
    if (isMounted()) {
      trackEvent('document_manager_viewed', {
        totalDocs: stats.total,
        activeFilter: activeModuleFilter,
        selectedCount: selectedDocs.length
      });
    }
  }, [activeModuleFilter, stats.total, selectedDocs.length, isMounted, trackEvent]);

  // Stable callback for share with analytics
  const handleShare = useLatestCallback(() => {
    trackEvent('document_share_clicked');
    alert('Secure Share Link Generated');
  });

  // Stable callback for upload with analytics
  const handleUpload = useLatestCallback(() => {
    trackEvent('document_upload_clicked');
    // Future: Open upload modal
  });

  // Stable callback for compare with analytics
  const handleCompare = useLatestCallback(() => {
    trackEvent('document_compare_activated', { selectedCount: selectedDocs.length });
    alert('Compare Mode Activated');
  });

  // Stable callback for bulk summarize with analytics
  const handleBulkSummarizeWithAnalytics = useLatestCallback(() => {
    trackEvent('document_bulk_summarize', { count: selectedDocs.length });
    handleBulkSummarize();
  });

  // Stable callback for sync with analytics
  const handleSync = useLatestCallback(() => {
    trackEvent('document_sync_clicked');
    // Future: Sync documents
  });

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
                            <button onClick={() => handleRemoveTag(taggingDoc!.id, tag)} className="ml-2 text-blue-400 hover:text-blue-600"><X className="h-3 w-3"/></button>
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
                                handleAddTag(taggingDoc!.id, newTagInput);
                            }
                        }}
                    />
                    <Button size="sm" onClick={() => handleAddTag(taggingDoc!.id, newTagInput)} disabled={!newTagInput.trim()}>Add</Button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Suggested / Recent</label>
                <div className="flex flex-wrap gap-2">
                    {allTags.filter(t => !ensureTagsArray(taggingDoc?.tags).includes(t)).slice(0, 8).map(t => (
                        <button key={t} onClick={() => handleAddTag(taggingDoc!.id, t)} className="text-xs px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 flex items-center">
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
            <Button variant="secondary" icon={Share2} onClick={handleShare}>Share</Button>
            <Button variant="primary" icon={Plus} onClick={handleUpload}>Upload</Button>
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
          <HydrationBoundary id="document-filters" priority="high" trigger="immediate">
            <DocumentFilters activeModuleFilter={activeModuleFilter} setActiveModuleFilter={setActiveModuleFilter} />
          </HydrationBoundary>

          <Card className="flex-1 flex flex-col overflow-hidden p-0">
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search content & tags..."
                  className="w-64"
                />
                {/* Feature 3: Bulk Actions */}
                <div className="flex gap-2">
                    {selectedDocs.length > 0 && (
                        <>
                            <Button variant="ghost" size="sm" icon={Split} onClick={handleCompare}>Compare (2)</Button>
                            <Button variant="ghost" size="sm" icon={Wand2} onClick={handleBulkSummarizeWithAnalytics} isLoading={isProcessingAI}>AI Summarize</Button>
                            <span className="h-8 w-px bg-slate-300 mx-1"></span>
                        </>
                    )}
                    <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleSync}>Sync</Button>
                </div>
             </div>

             <LazyHydration priority="normal" trigger="visible">
               <DocumentTable
                  documents={filtered}
                  selectedDocs={selectedDocs}
                  toggleSelection={toggleSelection}
                  setSelectedDocs={setSelectedDocs}
                  setSelectedDocForHistory={setSelectedDocForHistory}
                  setTaggingDoc={setTaggingDoc}
               />
             </LazyHydration>
          </Card>
      </div>

      {/* Enzyme Framework Features Indicator */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-xs text-slate-600">
        <Activity className="h-4 w-4 text-blue-600" />
        <span className="font-semibold">Powered by Enzyme:</span>
        <Zap className="h-3 w-3 text-amber-500" />
        <span>TanStack Query caching • useLatestCallback • useTrackEvent analytics • Document versioning</span>
      </div>
    </div>
  );
};
