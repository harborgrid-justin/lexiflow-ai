/**
 * useKnowledgeBase Hook
 *
 * Manages knowledge base data fetching, search, and filtering with Enzyme enhancements.
 *
 * Features:
 * - TanStack Query for data fetching with caching
 * - Debounced search for optimized performance
 * - Tab-based category filtering
 */

import { useState, useMemo } from 'react';
import { useApiRequest, useDebouncedValue } from '@/enzyme';
import { KnowledgeApi } from '../api';
import type { KnowledgeItem, KnowledgeTab } from '../api/knowledge.types';

const CATEGORY_MAP: Record<KnowledgeTab, string> = {
  wiki: 'Playbook',
  precedents: 'Precedent',
  qa: 'Q&A'
};

interface UseKnowledgeBaseOptions {
  initialTab?: KnowledgeTab;
  debounceMs?: number;
  staleTime?: number;
}

interface UseKnowledgeBaseReturn {
  items: KnowledgeItem[];
  filteredItems: KnowledgeItem[];
  loading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tab: KnowledgeTab;
  setTab: (tab: KnowledgeTab) => void;
  refetch: () => void;
}

export const useKnowledgeBase = (
  tabOrOptions?: KnowledgeTab | UseKnowledgeBaseOptions
): UseKnowledgeBaseReturn => {
  // Handle both legacy (tab string) and new (options object) signatures
  const options = typeof tabOrOptions === 'string' 
    ? { initialTab: tabOrOptions } 
    : tabOrOptions ?? {};

  const { 
    initialTab = 'wiki', 
    debounceMs = 300, 
    staleTime = 5 * 60 * 1000 
  } = options;

  const [tab, setTab] = useState<KnowledgeTab>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to prevent excessive filtering
  const debouncedSearch = useDebouncedValue(searchTerm, debounceMs);

  const category = CATEGORY_MAP[tab];

  // Fetch knowledge items with TanStack Query
  const { 
    data: items = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['knowledge', category],
    queryFn: () => KnowledgeApi.getItems(category),
    staleTime,
    enabled: !!category
  });

  // Filter with debounced search term
  const filteredItems = useMemo(() => 
    items.filter(item =>
      (item.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    ), 
    [items, debouncedSearch]
  );

  return {
    items,
    filteredItems,
    loading,
    error: error as Error | null,
    searchTerm,
    setSearchTerm,
    tab,
    setTab,
    refetch
  };
};

export default useKnowledgeBase;
