/**
 * MoveDialog Component
 * Dialog for moving documents to folders
 */

import React, { useState } from 'react';
import { Folder, ChevronRight, Home } from 'lucide-react';
import type { Folder as FolderType } from '../api/documents.types';
import { Modal, Button } from '../../../components/common';

interface MoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (folderId: string | null) => void;
  folders: FolderType[];
  documentCount: number;
}

export const MoveDialog: React.FC<MoveDialogProps> = ({
  isOpen,
  onClose,
  onMove,
  folders,
  documentCount,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleMove = () => {
    onMove(selectedFolderId);
    onClose();
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded transition-colors ${
            isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => setSelectedFolderId(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="flex-shrink-0 p-0.5"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <Folder className="h-4 w-4 flex-shrink-0" style={{ color: folder.color }} />
          <span className="text-sm font-medium flex-1 truncate">{folder.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build tree structure
  const buildTree = (folders: FolderType[]): FolderType[] => {
    const folderMap = new Map<string, FolderType>();
    const roots: FolderType[] = [];

    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

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
    <Modal isOpen={isOpen} onClose={onClose} title="Move Documents" size="sm">
      <div className="p-6">
        <p className="text-sm text-slate-600 mb-4">
          Moving {documentCount} document{documentCount !== 1 ? 's' : ''} to:
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
          {/* Root Option */}
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-slate-200 transition-colors ${
              selectedFolderId === null ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
            onClick={() => setSelectedFolderId(null)}
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Root / Documents</span>
          </div>

          {/* Folder Tree */}
          <div className="max-h-80 overflow-y-auto">
            {tree.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-slate-400">
                No folders available
              </div>
            ) : (
              tree.map((folder) => renderFolder(folder))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={handleMove} variant="primary" className="flex-1">
            Move Here
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
