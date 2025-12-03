import { useState } from 'react';
import { LegalDocument } from '../../types';
import { useDocumentManager } from './useDocumentManager';
import {
  useLatestCallback,
  useTrackEvent
} from '@missionfabric-js/enzyme/hooks';

export const useTagManagement = () => {
  const [taggingDoc, setTaggingDoc] = useState<LegalDocument | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const trackEvent = useTrackEvent();

  const { addTag, removeTag, allTags } = useDocumentManager();

  const handleAddTag = useLatestCallback((docId: string, tag: string) => {
    trackEvent('document_tag_added', { docId, tag });
    addTag(docId, tag);
    setNewTagInput('');
  });

  const handleRemoveTag = useLatestCallback((docId: string, tag: string) => {
    trackEvent('document_tag_removed', { docId, tag });
    removeTag(docId, tag);
  });

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
