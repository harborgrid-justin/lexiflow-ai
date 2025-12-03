/**
 * useKnowledgeBase Hook - Knowledge Management
 *
 * Manages knowledge base items with debounced search.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState, useMemo } from 'react';
import { useApiRequest } from '../services/hooks';
import { useDebouncedValue } from '../index';
import type { KnowledgeItem } from '../../types';

export const useKnowledgeBase = (tab: string) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to prevent excessive filtering
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Map tab to category
  const categoryMap: Record<string, string> = {
    wiki: 'Playbook',
    precedents: 'Precedent',
    qa: 'Q&A',
  };
  const category = categoryMap[tab];

  // Fetch knowledge items with Enzyme - automatic caching
  const { data: items = [], isLoading: loading } = useApiRequest<KnowledgeItem[]>({
    endpoint: '/knowledge',
    options: {
      staleTime: 5 * 60 * 1000,
      enabled: !!category,
      params: category ? { category } : undefined,
    },
  });

  // Filter with debounced search term to optimize performance
  const filteredItems = useMemo(
    () =>
      items.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (i.summary || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [items, debouncedSearch]
  );

  return {
    items,
    loading,
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
};

export default useKnowledgeBase;
