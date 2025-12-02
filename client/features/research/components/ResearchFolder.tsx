/**
 * Research Folder Component
 * Organize and manage research collections
 */

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Download,
  MoreVertical,
  FileText,
  Tag,
} from 'lucide-react';
import type { ResearchFolder as ResearchFolderType } from '../api/research.types';

interface ResearchFolderProps {
  folder: ResearchFolderType;
  onEdit?: (folder: ResearchFolderType) => void;
  onDelete?: (folderId: string) => void;
  onOpen?: (folderId: string) => void;
  onExport?: (folderId: string, format: 'pdf' | 'docx') => void;
  isOpen?: boolean;
}

export const ResearchFolder: React.FC<ResearchFolderProps> = ({
  folder,
  onEdit,
  onDelete,
  onOpen,
  onExport,
  isOpen = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer group
      ${isOpen
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }
    `}>
      <div className="flex items-start gap-3">
        {/* Folder Icon */}
        <div className="flex-shrink-0">
          {isOpen ? (
            <FolderOpen className="w-8 h-8 text-blue-500" />
          ) : (
            <Folder className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => onOpen?.(folder.id)}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">
              {folder.name}
            </h3>
            {folder.shared && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <Share2 className="w-3 h-3" />
                <span>Shared</span>
              </div>
            )}
          </div>

          {folder.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {folder.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{folder.cases.length} cases</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{folder.savedSearches.length} searches</span>
            </div>
            <span>Updated {formatDate(folder.updatedAt)}</span>
          </div>

          {/* Tags */}
          {folder.tags && folder.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {folder.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {folder.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{folder.tags.length - 3} more</span>
              )}
            </div>
          )}

          {/* Collaborators */}
          {folder.collaborators && folder.collaborators.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {folder.collaborators.length} collaborator{folder.collaborators.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(folder);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-left text-sm"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                    <span>Edit Folder</span>
                  </button>
                )}
                {onExport && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport(folder.id, 'pdf');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-left text-sm"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                      <span>Export as PDF</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport(folder.id, 'docx');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-left text-sm"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                      <span>Export as Word</span>
                    </button>
                  </>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folder.name}"?`)) {
                        onDelete(folder.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-50 text-left text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Folder</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Research Folder List Component
 */
export const ResearchFolderList: React.FC<{
  folders: ResearchFolderType[];
  onCreateFolder?: () => void;
  onEdit?: (folder: ResearchFolderType) => void;
  onDelete?: (folderId: string) => void;
  onOpen?: (folderId: string) => void;
  onExport?: (folderId: string, format: 'pdf' | 'docx') => void;
  selectedFolderId?: string;
}> = ({ folders, onCreateFolder, onEdit, onDelete, onOpen, onExport, selectedFolderId }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Research Folders</h2>
        {onCreateFolder && (
          <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        )}
      </div>

      {/* Folder Grid */}
      {folders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No folders yet</h3>
          <p className="text-gray-600 mb-4">Create a folder to organize your research</p>
          {onCreateFolder && (
            <button
              onClick={onCreateFolder}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Folder</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map(folder => (
            <ResearchFolder
              key={folder.id}
              folder={folder}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpen={onOpen}
              onExport={onExport}
              isOpen={selectedFolderId === folder.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
