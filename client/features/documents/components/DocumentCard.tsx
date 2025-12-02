/**
 * DocumentCard Component
 * Grid view card with preview thumbnail for documents
 */

import React from 'react';
import { FileText, Download, Share2, MoreVertical, Star, Tag, Folder } from 'lucide-react';
import type { LegalDocument } from '../../../types';
import { Badge } from '../../../components/common';

interface DocumentCardProps {
  document: LegalDocument;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (document: LegalDocument) => void;
  onDownload?: (document: LegalDocument) => void;
  onShare?: (document: LegalDocument) => void;
  onMove?: (document: LegalDocument) => void;
  onTag?: (document: LegalDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  selected = false,
  onSelect,
  onClick,
  onDownload,
  onShare,
  onMove,
  onTag,
}) => {
  const tags = Array.isArray(document.tags) ? document.tags : document.tags?.split(',').map(t => t.trim()) || [];

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
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return '📄';
    if (lowerType.includes('doc')) return '📝';
    if (lowerType.includes('xls') || lowerType.includes('sheet')) return '📊';
    if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg')) return '🖼️';
    return '📎';
  };

  return (
    <div
      className={`group relative bg-white border rounded-lg overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        selected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200'
      }`}
      onClick={() => onClick?.(document)}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(document.id);
            }}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Status Badge */}
      {document.status && (
        <div className="absolute top-2 right-2 z-10">
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
        </div>
      )}

      {/* Document Preview/Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-slate-200">
        <div className="text-6xl">{getFileIcon(document.type)}</div>

        {/* Overlay Actions (visible on hover) */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(document);
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4 text-slate-700" />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(document);
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4 text-slate-700" />
            </button>
          )}
          {onMove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(document);
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              title="Move to folder"
            >
              <Folder className="h-4 w-4 text-slate-700" />
            </button>
          )}
        </div>
      </div>

      {/* Document Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 truncate mb-1" title={document.title}>
          {document.title}
        </h3>

        {/* Type */}
        <p className="text-xs text-slate-500 mb-2">{document.type}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-600">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
          <span>{formatDate(document.uploadDate || document.createdAt)}</span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>

        {/* Description (if available) */}
        {document.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{document.description}</p>
        )}
      </div>

      {/* Context Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Context menu logic
        }}
        className="absolute bottom-2 right-2 p-1 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreVertical className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
};
