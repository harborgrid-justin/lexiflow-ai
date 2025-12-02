/**
 * FolderTree Component
 * Hierarchical folder navigation tree
 */

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, MoreVertical, Star } from 'lucide-react';
import type { Folder as FolderType } from '../api/documents.types';

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId?: string | null;
  onFolderSelect?: (folder: FolderType) => void;
  onCreateFolder?: (parentId?: string) => void;
  onDeleteFolder?: (folder: FolderType) => void;
  onRenameFolder?: (folder: FolderType) => void;
}

interface FolderNodeProps {
  folder: FolderType;
  level: number;
  selectedFolderId?: string | null;
  onFolderSelect?: (folder: FolderType) => void;
  onCreateFolder?: (parentId?: string) => void;
  onDeleteFolder?: (folder: FolderType) => void;
  onRenameFolder?: (folder: FolderType) => void;
  children?: FolderType[];
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  level,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  children = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div>
      {/* Folder Item */}
      <div
        className={`group flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 cursor-pointer transition-colors rounded ${
          isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onFolderSelect?.(folder)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0 p-0.5 hover:bg-slate-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Empty space if no children */}
        {!hasChildren && <div className="w-5" />}

        {/* Folder Icon */}
        <div className="flex-shrink-0" style={{ color: folder.color }}>
          {isExpanded && hasChildren ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
        </div>

        {/* Folder Name */}
        <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>

        {/* Document Count */}
        {folder.documentCount !== undefined && folder.documentCount > 0 && (
          <span className="flex-shrink-0 text-xs text-slate-400">{folder.documentCount}</span>
        )}

        {/* Actions Menu */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
          >
            <MoreVertical className="h-3 w-3" />
          </button>

          {/* Context Menu */}
          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />

              {/* Menu Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {onCreateFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateFolder(folder.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Subfolder
                  </button>
                )}
                {onRenameFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRenameFolder(folder);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    Rename
                  </button>
                )}
                {onDeleteFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {children.map((childFolder) => (
            <FolderNode
              key={childFolder.id}
              folder={childFolder}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
              children={childFolder.children}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}) => {
  // Build tree structure
  const buildTree = (folders: FolderType[]): FolderType[] => {
    const folderMap = new Map<string, FolderType>();
    const roots: FolderType[] = [];

    // First pass: create map
    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Second pass: build tree
    folders.forEach((folder) => {
      const node = folderMap.get(folder.id)!;
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const tree = buildTree(folders);

  return (
    <div className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Folders</h3>
        {onCreateFolder && (
          <button
            onClick={() => onCreateFolder()}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title="New folder"
          >
            <Plus className="h-4 w-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* Tree */}
      <div className="space-y-0.5">
        {tree.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-slate-400">
            No folders yet
            {onCreateFolder && (
              <button
                onClick={() => onCreateFolder()}
                className="block mx-auto mt-2 text-blue-600 hover:text-blue-700"
              >
                Create your first folder
              </button>
            )}
          </div>
        ) : (
          tree.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              level={0}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
              children={folder.children}
            />
          ))
        )}
      </div>

      {/* Quick Access (Optional) */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 mb-2">
          Quick Access
        </h3>
        <div className="space-y-0.5">
          <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded text-sm text-slate-700 transition-colors">
            <Star className="h-4 w-4 text-amber-500" />
            Starred
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded text-sm text-slate-700 transition-colors">
            <Folder className="h-4 w-4 text-slate-500" />
            Recent
          </button>
        </div>
      </div>
    </div>
  );
};
