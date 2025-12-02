/**
 * DocumentPreview Component
 * Quick preview modal for documents
 */

import React from 'react';
import { X, Download, Share2, ExternalLink, Maximize2 } from 'lucide-react';
import type { LegalDocument } from '../../../types';
import { Modal, Badge, Button } from '../../../components/common';

interface DocumentPreviewProps {
  document: LegalDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (document: LegalDocument) => void;
  onShare?: (document: LegalDocument) => void;
  onOpenFullView?: (document: LegalDocument) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onOpenFullView,
}) => {
  if (!document) return null;

  const tags = Array.isArray(document.tags)
    ? document.tags
    : document.tags?.split(',').map(t => t.trim()) || [];

  const formatFileSize = (size: string | number | undefined): string => {
    if (!size) return 'Unknown';
    const bytes = typeof size === 'string' ? parseInt(size, 10) : size;
    if (isNaN(bytes)) return 'Unknown';

    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = bytes;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-slate-900 truncate">
                {document.title}
              </h2>
              {document.status && (
                <Badge
                  variant={
                    document.status.toLowerCase() === 'signed'
                      ? 'success'
                      : document.status.toLowerCase() === 'draft'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {document.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">{document.type}</p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="flex items-center justify-center h-full p-8">
            {document.content ? (
              <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-sm">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-slate-600 mb-4">Preview not available</p>
                {onOpenFullView && (
                  <Button
                    onClick={() => onOpenFullView(document)}
                    icon={ExternalLink}
                    variant="secondary"
                  >
                    Open in Viewer
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Metadata and Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">File Size</p>
              <p className="text-sm text-slate-900">{formatFileSize(document.fileSize)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Modified</p>
              <p className="text-sm text-slate-900">
                {formatDate(document.lastModified || document.uploadDate || document.createdAt)}
              </p>
            </div>
            {document.uploadedBy && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Uploaded By</p>
                <p className="text-sm text-slate-900">{document.uploadedBy}</p>
              </div>
            )}
            {document.version && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Version</p>
                <p className="text-sm text-slate-900">{document.version}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {document.description && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
              <p className="text-sm text-slate-700">{document.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onOpenFullView && (
              <Button onClick={() => onOpenFullView(document)} icon={Maximize2} variant="primary">
                Open in Viewer
              </Button>
            )}
            {onDownload && (
              <Button
                onClick={() => onDownload(document)}
                icon={Download}
                variant="secondary"
              >
                Download
              </Button>
            )}
            {onShare && (
              <Button onClick={() => onShare(document)} icon={Share2} variant="secondary">
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
