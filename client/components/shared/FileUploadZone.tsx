import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  acceptedTypes?: string;
  placeholder?: string;
  supportedFormats?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  acceptedTypes = ".txt,.html,.pdf",
  placeholder = "Drag and drop a file here, or browse to upload",
  supportedFormats = "Supports .txt, .html files (PDF coming soon)"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-slate-300 hover:border-slate-400'
      }`}
    >
      <div className="text-center">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 mb-2">
          {placeholder.split(', or ')[0]}, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse to upload
          </button>
        </p>
        <p className="text-xs text-slate-500">
          {supportedFormats}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};