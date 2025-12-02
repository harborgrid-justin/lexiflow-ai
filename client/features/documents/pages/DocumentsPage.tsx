/**
 * DocumentsPage Component
 * Main document management interface with split-pane layout
 */

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Grid3x3,
  List,
  Eye,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  FolderPlus,
  Download,
  Star,
  Clock,
} from 'lucide-react';
import { useDocuments, useDocumentStats, useFolders, useDeleteDocument } from '../api/documents.api';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentRow } from '../components/DocumentRow';
import { FolderTree } from '../components/FolderTree';
import { UploadDropzone } from '../components/UploadDropzone';
import { DocumentPreview } from '../components/DocumentPreview';
import { ShareDialog } from '../components/ShareDialog';
import { MoveDialog } from '../components/MoveDialog';
import { NewFolderDialog } from '../components/NewFolderDialog';
import { DocumentTags } from '../components/DocumentTags';
import { Button, SearchInput, Card, PageHeader, EmptyState, LoadingSpinner } from '../../../components/common';
import type { LegalDocument } from '../../../types';
import type { ViewMode, DocumentFilters, Folder as FolderType } from '../api/documents.types';
import { ApiService } from '../../../services/apiService';

export const DocumentsPage: React.FC = () => {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Selection and active items
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [previewDocument, setPreviewDocument] = useState<LegalDocument | null>(null);
  const [shareDocument, setShareDocument] = useState<LegalDocument | null>(null);
  const [moveDocuments, setMoveDocuments] = useState<LegalDocument[]>([]);
  const [tagDocument, setTagDocument] = useState<LegalDocument | null>(null);

  // Filters
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    folderId: undefined,
    type: [],
    tags: [],
    dateFrom: undefined,
    dateTo: undefined,
  });

  // Folder state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [parentFolderForNew, setParentFolderForNew] = useState<string | undefined>();

  // API queries
  const { data: documents = [], isLoading: isLoadingDocuments } = useDocuments(filters);
  const { data: stats } = useDocumentStats({ caseId: filters.caseId });
  const { data: folders = [] } = useFolders({ caseId: filters.caseId });
  const deleteMutation = useDeleteDocument();

  // Filter documents based on selected folder
  const filteredDocuments = documents;

  // Selection handlers
  const handleSelectDocument = (id: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocumentIds.length === filteredDocuments.length) {
      setSelectedDocumentIds([]);
    } else {
      setSelectedDocumentIds(filteredDocuments.map((doc) => doc.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedDocumentIds([]);
  };

  // Document actions
  const handleDocumentClick = (document: LegalDocument) => {
    setPreviewDocument(document);
  };

  const handleDownload = async (document: LegalDocument) => {
    try {
      await ApiService.documents.download(document.id);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const handleShare = (document: LegalDocument) => {
    setShareDocument(document);
  };

  const handleMove = (document: LegalDocument) => {
    setMoveDocuments([document]);
  };

  const handleBulkMove = () => {
    const docs = filteredDocuments.filter((doc) => selectedDocumentIds.includes(doc.id));
    setMoveDocuments(docs);
  };

  const handleTag = (document: LegalDocument) => {
    setTagDocument(document);
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteMutation.mutateAsync(documentId);
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  // Folder handlers
  const handleFolderSelect = (folder: FolderType) => {
    setSelectedFolderId(folder.id);
    setFilters((prev) => ({ ...prev, folderId: folder.id }));
  };

  const handleCreateFolder = (parentId?: string) => {
    setParentFolderForNew(parentId);
    setIsNewFolderDialogOpen(true);
  };

  // Get all available tags
  const allTags = Array.from(
    new Set(
      documents.flatMap((doc) =>
        Array.isArray(doc.tags) ? doc.tags : doc.tags?.split(',').map((t) => t.trim()) || []
      )
    )
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <PageHeader
          title="Document Management"
          subtitle="Organize, search, and manage all your legal documents"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={FolderPlus}
                onClick={() => handleCreateFolder()}
              >
                New Folder
              </Button>
              <Button
                variant="primary"
                icon={Upload}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload
              </Button>
            </div>
          }
        />

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card className="p-4">
              <p className="text-sm text-slate-500">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-500">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900">
                {(stats.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-500">Recent Uploads</p>
              <p className="text-2xl font-bold text-slate-900">{stats.recentUploads}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-500">Folders</p>
              <p className="text-2xl font-bold text-slate-900">{folders.length}</p>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isSidebarCollapsed && (
          <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
            <FolderTree
              folders={folders}
              selectedFolderId={selectedFolderId}
              onFolderSelect={handleFolderSelect}
              onCreateFolder={handleCreateFolder}
            />
          </div>
        )}

        {/* Document List Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setIsSidebarCollapsed(true)}
                />
              )}
              {isSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="rotate-180"
                />
              )}

              <SearchInput
                value={filters.search || ''}
                onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                placeholder="Search documents..."
                className="w-80"
              />

              <Button variant="ghost" size="sm" icon={SlidersHorizontal}>
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {selectedDocumentIds.length > 0 && (
                <>
                  <span className="text-sm text-slate-600">
                    {selectedDocumentIds.length} selected
                  </span>
                  <Button variant="secondary" size="sm" onClick={handleBulkMove}>
                    Move
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                    Clear
                  </Button>
                  <div className="w-px h-6 bg-slate-300" />
                </>
              )}

              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-50'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-50'
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Document List/Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingDocuments && (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            )}

            {!isLoadingDocuments && filteredDocuments.length === 0 && (
              <EmptyState
                icon={Upload}
                title="No documents yet"
                description="Upload your first document to get started"
                action={
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    icon={Upload}
                    variant="primary"
                  >
                    Upload Document
                  </Button>
                }
              />
            )}

            {!isLoadingDocuments && filteredDocuments.length > 0 && (
              <>
                {viewMode === 'list' && (
                  <Card className="overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                      <div className="w-4">
                        <input
                          type="checkbox"
                          checked={selectedDocumentIds.length === filteredDocuments.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-5" />
                      <div className="flex-1">Name</div>
                      <div className="hidden md:block w-32">Type</div>
                      <div className="hidden lg:block w-24 text-right">Size</div>
                      <div className="hidden xl:block w-32 text-right">Modified</div>
                      <div className="w-40" />
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-100">
                      {filteredDocuments.map((document) => (
                        <DocumentRow
                          key={document.id}
                          document={document}
                          selected={selectedDocumentIds.includes(document.id)}
                          onSelect={handleSelectDocument}
                          onClick={handleDocumentClick}
                          onDownload={handleDownload}
                          onShare={handleShare}
                          onMove={handleMove}
                          onTag={handleTag}
                        />
                      ))}
                    </div>
                  </Card>
                )}

                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((document) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        selected={selectedDocumentIds.includes(document.id)}
                        onSelect={handleSelectDocument}
                        onClick={handleDocumentClick}
                        onDownload={handleDownload}
                        onShare={handleShare}
                        onMove={handleMove}
                        onTag={handleTag}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Upload Documents</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <UploadDropzone
                onUploadComplete={(id) => {
                  console.log('Upload complete:', id);
                }}
                metadata={{
                  folderId: selectedFolderId || undefined,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onDownload={handleDownload}
        onShare={handleShare}
        onOpenFullView={(doc) => {
          // Navigate to document viewer
          window.location.href = `/documents/${doc.id}/view`;
        }}
      />

      {shareDocument && (
        <ShareDialog
          isOpen={!!shareDocument}
          onClose={() => setShareDocument(null)}
          onShare={(permissions, options) => {
            console.log('Share:', permissions, options);
            setShareDocument(null);
          }}
          documentTitle={shareDocument.title}
        />
      )}

      {moveDocuments.length > 0 && (
        <MoveDialog
          isOpen={moveDocuments.length > 0}
          onClose={() => setMoveDocuments([])}
          onMove={(folderId) => {
            console.log('Move to folder:', folderId);
            setMoveDocuments([]);
          }}
          folders={folders}
          documentCount={moveDocuments.length}
        />
      )}

      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        onClose={() => {
          setIsNewFolderDialogOpen(false);
          setParentFolderForNew(undefined);
        }}
        onCreate={(name, color, parentId) => {
          console.log('Create folder:', name, color, parentId);
        }}
        parentFolderId={parentFolderForNew}
      />

      {tagDocument && (
        <DocumentTags
          isOpen={!!tagDocument}
          onClose={() => setTagDocument(null)}
          currentTags={
            Array.isArray(tagDocument.tags)
              ? tagDocument.tags
              : tagDocument.tags?.split(',').map((t) => t.trim()) || []
          }
          availableTags={allTags}
          onAddTag={(tag) => {
            console.log('Add tag:', tag);
          }}
          onRemoveTag={(tag) => {
            console.log('Remove tag:', tag);
          }}
          documentTitle={tagDocument.title}
        />
      )}
    </div>
  );
};
