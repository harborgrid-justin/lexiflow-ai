/**
 * FileAttachment Component
 *
 * Displays file attachments in messages with preview and download
 */

import React from 'react';
import { FileText, Download, Image, FileVideo, File, Paperclip } from 'lucide-react';
import { MessageAttachment } from '../api/communication.types';

interface FileAttachmentProps {
  attachment: MessageAttachment;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
  showDownload?: boolean;
  onClick?: () => void;
  className?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return FileVideo;
  if (type.includes('pdf')) return FileText;
  if (type.includes('document') || type.includes('word')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachment,
  variant = 'light',
  size = 'md',
  showDownload = true,
  onClick,
  className = '',
}) => {
  const Icon = getFileIcon(attachment.type);
  const isImage = attachment.type.startsWith('image/');

  const variantClasses = variant === 'dark'
    ? 'bg-white/10 hover:bg-white/20 text-white'
    : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200';

  const sizeClasses = size === 'sm' ? 'p-2 text-xs' : 'p-3 text-sm';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(attachment.url, '_blank');
  };

  return (
    <div
      className={`
        flex items-center gap-3 rounded-lg cursor-pointer transition-colors
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Thumbnail or Icon */}
      {isImage && attachment.thumbnailUrl ? (
        <img
          src={attachment.thumbnailUrl}
          alt={attachment.name}
          className="w-12 h-12 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div className={`
          flex items-center justify-center w-10 h-10 rounded flex-shrink-0
          ${variant === 'dark' ? 'bg-white/10' : 'bg-slate-100'}
        `}>
          <Icon className={`w-5 h-5 ${variant === 'dark' ? 'text-white/80' : 'text-slate-600'}`} />
        </div>
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {attachment.name}
        </div>
        <div className={`text-xs ${variant === 'dark' ? 'text-white/70' : 'text-slate-500'}`}>
          {formatFileSize(attachment.size)}
        </div>
      </div>

      {/* Download Button */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className={`
            p-2 rounded-lg transition-colors flex-shrink-0
            ${variant === 'dark'
              ? 'hover:bg-white/10 text-white/80 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }
          `}
          title="Download"
          aria-label="Download file"
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface FileAttachmentListProps {
  attachments: MessageAttachment[];
  variant?: 'light' | 'dark';
  onAttachmentClick?: (attachment: MessageAttachment) => void;
  className?: string;
}

/**
 * List of file attachments
 */
export const FileAttachmentList: React.FC<FileAttachmentListProps> = ({
  attachments,
  variant = 'light',
  onAttachmentClick,
  className = '',
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {attachments.map((attachment) => (
        <FileAttachment
          key={attachment.id}
          attachment={attachment}
          variant={variant}
          onClick={() => onAttachmentClick?.(attachment)}
        />
      ))}
    </div>
  );
};

interface CompactFileAttachmentProps {
  count: number;
  className?: string;
}

/**
 * Compact attachment indicator showing count only
 */
export const CompactFileAttachment: React.FC<CompactFileAttachmentProps> = ({ count, className = '' }) => {
  if (count === 0) return null;

  return (
    <div className={`inline-flex items-center gap-1 text-xs text-slate-500 ${className}`}>
      <Paperclip className="w-3 h-3" />
      <span>{count}</span>
    </div>
  );
};
