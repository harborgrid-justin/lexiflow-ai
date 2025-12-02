/**
 * DocumentRow Component
 * List view row for documents
 */

import React from 'react';
import { FileText, Download, Share2, MoreVertical, Star, Tag, Folder, History } from 'lucide-react';
import type { LegalDocument } from '../../../types';
import { Badge } from '../../../components/common';

interface DocumentRowProps {
  document: LegalDocument;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (document: LegalDocument) => void;
  onDownload?: (document: LegalDocument) => void;
  onShare?: (document: LegalDocument) => void;
  onMove?: (document: LegalDocument) => void;
  onTag?: (document: LegalDocument) => void;
  onVersions?: (document: LegalDocument) => void;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({
  document,
  selected = false,
  onSelect,
  onClick,
  onDownload,
  onShare,
  onMove,
  onTag,
  onVersions,
}) => {
  const tags = Array.isArray(document.tags) ? document.tags : document.tags?.split(',').map(t => t.trim()) || [];

  const formatFileSize = (size: string | number | undefined): string => {
    if (!size) return '-';
    const bytes = typeof size === 'string' ? parseInt(size, 10) : size;
    if (isNaN(bytes)) return '-';

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
    if (!date) return '-';
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (lowerType.includes('doc')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (lowerType.includes('xls') || lowerType.includes('sheet')) return <FileText className="h-5 w-5 text-green-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
        selected ? 'bg-blue-50 hover:bg-blue-100' : ''
      }`}
      onClick={() => onClick?.(document)}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="flex-shrink-0">
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

      {/* File Icon */}
      <div className="flex-shrink-0">{getFileIcon(document.type)}</div>

      {/* Document Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-slate-900 truncate" title={document.title}>
            {document.title}
          </h3>
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
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-600">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Type */}
      <div className="hidden md:block flex-shrink-0 w-32">
        <span className="text-sm text-slate-600">{document.type}</span>
      </div>

      {/* Size */}
      <div className="hidden lg:block flex-shrink-0 w-24 text-right">
        <span className="text-sm text-slate-600">{formatFileSize(document.fileSize)}</span>
      </div>

      {/* Modified Date */}
      <div className="hidden xl:block flex-shrink-0 w-32 text-right">
        <span className="text-sm text-slate-600">{formatDate(document.lastModified || document.uploadDate || document.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onVersions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVersions(document);
            }}
            className="p-2 hover:bg-slate-200 rounded transition-colors"
            title="Version history"
          >
            <History className="h-4 w-4 text-slate-600" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(document);
            }}
            className="p-2 hover:bg-slate-200 rounded transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4 text-slate-600" />
          </button>
        )}
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(document);
            }}
            className="p-2 hover:bg-slate-200 rounded transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4 text-slate-600" />
          </button>
        )}
        {onMove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(document);
            }}
            className="p-2 hover:bg-slate-200 rounded transition-colors"
            title="Move to folder"
          >
            <Folder className="h-4 w-4 text-slate-600" />
          </button>
        )}
        {onTag && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTag(document);
            }}
            className="p-2 hover:bg-slate-200 rounded transition-colors"
            title="Manage tags"
          >
            <Tag className="h-4 w-4 text-slate-600" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Context menu logic
          }}
          className="p-2 hover:bg-slate-200 rounded transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
};
