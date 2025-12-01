import { useState } from 'react';
import { LegalDocument } from '../types';
import { useDocumentManager } from './useDocumentManager';

export const useTagManagement = () => {
  const [taggingDoc, setTaggingDoc] = useState<LegalDocument | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  const { addTag, removeTag, allTags } = useDocumentManager();

  const handleAddTag = (docId: string, tag: string) => {
    addTag(docId, tag);
    setNewTagInput('');
  };

  const handleRemoveTag = (docId: string, tag: string) => {
    removeTag(docId, tag);
  };

  return {
    taggingDoc,
    setTaggingDoc,
    newTagInput,
    setNewTagInput,
    allTags,
    handleAddTag,
    handleRemoveTag
  };
};