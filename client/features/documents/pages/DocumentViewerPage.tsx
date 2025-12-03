/**
 * DocumentViewerPage Component
 * Full-featured document viewer with PDF rendering and annotations
 */

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCw,
  Download,
  Share2,
  Printer,
  ChevronLeft,
  ChevronRight,
  List,
  MessageSquare,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { useDocument, useDocumentVersions, useDocumentAnnotations } from '../api/documents.api';
import { AnnotationTools, type AnnotationTool } from '../components/AnnotationTools';
import { VersionHistory } from '../components/VersionHistory';
import { DocumentMetadata } from '../components/DocumentMetadata';
import { Button, LoadingSpinner, Badge } from '../../../components/common';
import type { Annotation } from '../api/documents.types';
import { ApiService } from '../../../services/apiService';

interface DocumentViewerPageProps {
  documentId: string;
  onClose?: () => void;
}

export const DocumentViewerPage: React.FC<DocumentViewerPageProps> = ({
  documentId,
  onClose,
}) => {
  // Document data
  const { data: document, isLoading } = useDocument(documentId);
  const { data: versions = [] } = useDocumentVersions(documentId);
  const { data: annotations = [] } = useDocumentAnnotations(documentId);

  // Viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState<'width' | 'page'>('width');

  // Sidebar state
  const [activeSidebar, setActiveSidebar] = useState<'thumbnails' | 'annotations' | 'versions' | 'info' | null>('thumbnails');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Annotation state
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, _setSearchResults] = useState<number[]>([]);

  // Handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleDownload = async () => {
    if (document) {
      try {
        await ApiService.documents.download(document.id);
      } catch (error) {
        console.error('Failed to download document:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-4">Document not found</p>
          {onClose && (
            <Button onClick={onClose} variant="primary">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Document Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={onClose}
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {document.title}
              </h1>
              <p className="text-sm text-slate-500">
                {document.type}
                {document.status && (
                  <>
                    {' • '}
                    <Badge
                      variant={
                        document.status.toLowerCase() === 'signed'
                          ? 'success'
                          : document.status.toLowerCase() === 'draft'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {document.status}
                    </Badge>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={Download} onClick={handleDownload}>
              Download
            </Button>
            <Button variant="ghost" size="sm" icon={Share2}>
              Share
            </Button>
            <Button variant="ghost" size="sm" icon={Printer} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            />
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                className="w-12 text-center bg-transparent text-sm font-medium text-slate-900 outline-none"
                min={1}
                max={totalPages}
              />
              <span className="text-sm text-slate-500">/ {totalPages}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            />
          </div>

          {/* Center: Annotation Tools */}
          <AnnotationTools
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onUndo={() => console.log('Undo')}
            onRedo={() => console.log('Redo')}
            onDelete={() => console.log('Delete')}
            canUndo={false}
            canRedo={false}
            hasSelection={!!selectedAnnotation}
          />

          {/* Right: Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={ZoomOut} onClick={handleZoomOut} />
            <span className="text-sm font-medium text-slate-700 w-16 text-center">
              {zoom}%
            </span>
            <Button variant="ghost" size="sm" icon={ZoomIn} onClick={handleZoomIn} />
            <div className="w-px h-6 bg-slate-300 mx-1" />
            <Button variant="ghost" size="sm" icon={RotateCw} onClick={handleRotate} />
            <Button variant="ghost" size="sm" icon={Maximize}>
              Fit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {!isSidebarCollapsed && activeSidebar && (
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveSidebar('thumbnails')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeSidebar === 'thumbnails'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="h-4 w-4 mx-auto mb-1" />
                Pages
              </button>
              <button
                onClick={() => setActiveSidebar('annotations')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeSidebar === 'annotations'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="h-4 w-4 mx-auto mb-1" />
                Notes
              </button>
              <button
                onClick={() => setActiveSidebar('versions')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeSidebar === 'versions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="h-4 w-4 mx-auto mb-1" />
                History
              </button>
              <button
                onClick={() => setActiveSidebar('info')}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeSidebar === 'info'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Info className="h-4 w-4 mx-auto mb-1" />
                Info
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {activeSidebar === 'thumbnails' && (
                <div className="p-2 space-y-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <div
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`p-2 border-2 rounded cursor-pointer transition-all ${
                        currentPage === page
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-[8.5/11] bg-slate-100 rounded mb-1 flex items-center justify-center">
                        <span className="text-4xl">📄</span>
                      </div>
                      <p className="text-xs text-center text-slate-600">Page {page}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSidebar === 'annotations' && (
                <div className="p-4 space-y-3">
                  {annotations.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">
                      No annotations yet
                    </p>
                  ) : (
                    annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        onClick={() => setSelectedAnnotation(annotation)}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedAnnotation?.id === annotation.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-700">
                            Page {annotation.page}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: annotation.color || '#fef08a' }}
                          >
                            {annotation.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{annotation.content}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          by {annotation.userName}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSidebar === 'versions' && (
                <div className="p-4">
                  <VersionHistory
                    versions={versions}
                    currentVersionId={document.id}
                    onRestore={(version) => console.log('Restore:', version)}
                    onDownload={(version) => console.log('Download:', version)}
                    onPreview={(version) => console.log('Preview:', version)}
                  />
                </div>
              )}

              {activeSidebar === 'info' && (
                <div className="p-4">
                  <DocumentMetadata
                    document={document}
                    onSave={(updates) => console.log('Save metadata:', updates)}
                    onCancel={() => setActiveSidebar(null)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto bg-slate-200 p-8">
          <div
            className="max-w-4xl mx-auto bg-white shadow-2xl"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
            }}
          >
            {/* PDF/Document Content */}
            <div className="aspect-[8.5/11] bg-white p-12 relative">
              {/* Placeholder for actual PDF rendering */}
              {document.content ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-8xl mb-4">📄</div>
                    <p className="text-slate-600">
                      PDF rendering requires additional library
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Integrate pdf.js or react-pdf for full PDF support
                    </p>
                  </div>
                </div>
              )}

              {/* Annotation Layer */}
              <div className="absolute inset-0 pointer-events-none">
                {annotations
                  .filter((a) => a.page === currentPage)
                  .map((annotation) => (
                    <div
                      key={annotation.id}
                      className="absolute pointer-events-auto cursor-pointer"
                      style={{
                        left: `${annotation.position.x}%`,
                        top: `${annotation.position.y}%`,
                        width: annotation.position.width
                          ? `${annotation.position.width}%`
                          : 'auto',
                        height: annotation.position.height
                          ? `${annotation.position.height}%`
                          : 'auto',
                        backgroundColor:
                          annotation.type === 'highlight'
                            ? annotation.color || '#fef08a'
                            : 'transparent',
                        opacity: annotation.type === 'highlight' ? 0.5 : 1,
                      }}
                      onClick={() => setSelectedAnnotation(annotation)}
                    >
                      {annotation.type === 'note' && (
                        <div className="bg-yellow-100 border-2 border-yellow-400 rounded p-2 shadow-lg">
                          <p className="text-xs">{annotation.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
