/**
 * UploadDropzone Component
 * Drag-and-drop file upload area with progress tracking
 */

import React, { useCallback, useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useUploadDocument } from '../api/documents.api';
import type { DocumentUploadMetadata } from '../api/documents.types';
import { ProgressBar } from '../../../components/common';

interface UploadDropzoneProps {
  onUploadComplete?: (documentId: string) => void;
  onUploadError?: (error: Error) => void;
  metadata?: Partial<DocumentUploadMetadata>;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
}

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  documentId?: string;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onUploadComplete,
  onUploadError,
  metadata,
  accept,
  maxSize = 100 * 1024 * 1024, // 100MB default
  multiple = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument();

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`;
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        return fileMimeType === type || fileMimeType.startsWith(type.replace('*', ''));
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    const { file, id } = fileWithProgress;

    try {
      setFiles(prev =>
        prev.map(f => (f.id === id ? { ...f, status: 'uploading', progress: 0 } : f))
      );

      // Simulate progress (replace with actual progress tracking if API supports it)
      const progressInterval = setInterval(() => {
        setFiles(prev =>
          prev.map(f =>
            f.id === id && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      const result = await uploadMutation.mutateAsync({
        file,
        metadata: {
          ...metadata,
          title: metadata?.title || file.name,
        },
      });

      clearInterval(progressInterval);

      setFiles(prev =>
        prev.map(f =>
          f.id === id
            ? { ...f, status: 'completed', progress: 100, documentId: result.id }
            : f
        )
      );

      onUploadComplete?.(result.id);
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === id
            ? {
                ...f,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );

      onUploadError?.(error instanceof Error ? error : new Error('Upload failed'));
    }
  };

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const filesArray = Array.from(fileList);
      const newFiles: FileWithProgress[] = [];

      filesArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newFiles.push({
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0,
            status: 'error',
            error,
          });
        } else {
          const fileWithProgress: FileWithProgress = {
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0,
            status: 'pending',
          };
          newFiles.push(fileWithProgress);
        }
      });

      setFiles(prev => [...prev, ...newFiles]);

      // Start uploading valid files
      newFiles
        .filter(f => f.status === 'pending')
        .forEach(fileWithProgress => {
          uploadFile(fileWithProgress);
        });
    },
    [metadata, maxSize, accept]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = bytes;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`h-12 w-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-slate-500 mb-4">or click to browse</p>
          {accept && (
            <p className="text-xs text-slate-400">
              Accepted: {accept.split(',').join(', ')}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-slate-400">
              Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Uploads</h4>
          {files.map(fileWithProgress => (
            <div
              key={fileWithProgress.id}
              className="bg-white border border-slate-200 rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {fileWithProgress.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {fileWithProgress.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {(fileWithProgress.status === 'pending' ||
                    fileWithProgress.status === 'uploading') && (
                    <File className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {fileWithProgress.file.name}
                    </p>
                    <button
                      onClick={() => removeFile(fileWithProgress.id)}
                      className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">
                    {formatFileSize(fileWithProgress.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileWithProgress.status === 'uploading' && (
                    <ProgressBar
                      progress={fileWithProgress.progress}
                      className="h-1"
                    />
                  )}

                  {/* Error Message */}
                  {fileWithProgress.status === 'error' && (
                    <p className="text-xs text-red-600">{fileWithProgress.error}</p>
                  )}

                  {/* Success Message */}
                  {fileWithProgress.status === 'completed' && (
                    <p className="text-xs text-green-600">Upload complete</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
