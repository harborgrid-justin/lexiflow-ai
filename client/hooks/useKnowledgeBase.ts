import { useState, useMemo } from 'react';
import { KnowledgeItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useKnowledgeBase = (tab: string) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredItems = useMemo(() => items.filter(i =>
    (i.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.summary || '').toLowerCase().includes(searchTerm.toLowerCase())
  ), [items, searchTerm]);

  return {
    items,
    loading,
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};