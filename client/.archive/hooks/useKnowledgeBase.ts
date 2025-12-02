/**
 * ENZYME MIGRATION - useKnowledgeBase Hook
 *
 * Enhanced with Enzyme features for optimized search performance and stable callbacks.
 *
 * Enzyme Features:
 * - useDebouncedValue: Debounces search term to prevent excessive filtering (300ms delay)
 * - useLatestCallback: Provides stable reference for setSearchTerm (if needed in future)
 * - useIsMounted: Available for future async enhancements
 *
 * @migration Agent 38 - December 2, 2025
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';
import {
  useDebouncedValue
} from '../enzyme';

export const useKnowledgeBase = (tab: string) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to prevent excessive filtering
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Map tab to category
  const categoryMap: Record<string, string> = {
    'wiki': 'Playbook',
    'precedents': 'Precedent',
    'qa': 'Q&A'
  };
  const category = categoryMap[tab];

  // Fetch knowledge items with TanStack Query - dynamic query based on category
  const { data: items = [], isLoading: loading } = useQuery({
    queryKey: ['/api/v1/knowledge', category],
    queryFn: () => ApiService.getKnowledgeBase(category),
    staleTime: 5 * 60 * 1000, // 5 min cache
    enabled: !!category // Only fetch if category exists
  });

  // Filter with debounced search term to optimize performance
  const filteredItems = useMemo(() => items.filter(i =>
    (i.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (i.summary || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  ), [items, debouncedSearch]);

  return {
    items,
    loading,
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};