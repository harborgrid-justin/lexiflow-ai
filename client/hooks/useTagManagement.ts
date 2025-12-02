/**
 * ENZYME MIGRATION: useTagManagement
 *
 * Enhanced wrapper hook for document tag operations using Enzyme patterns.
 *
 * Enzyme Features Applied:
 * - useSafeState: Prevents state updates after unmount for taggingDoc and newTagInput
 * - useLatestCallback: Ensures handlers always use current values without re-renders
 * - useTrackEvent: Analytics tracking for tag additions and removals
 *
 * Migration Benefits:
 * - Memory leak prevention via useSafeState
 * - Stable callback references for child components
 * - Comprehensive analytics for tag operations
 * - Type-safe event tracking with metadata
 *
 * @migrated Agent 42, Wave 6
 */

import { LegalDocument } from '../types';
import { useDocumentManager } from './useDocumentManager';
import {
  useSafeState,
  useLatestCallback,
  useTrackEvent
} from '../enzyme';

export const useTagManagement = () => {
  const [taggingDoc, setTaggingDoc] = useSafeState<LegalDocument | null>(null);
  const [newTagInput, setNewTagInput] = useSafeState('');
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