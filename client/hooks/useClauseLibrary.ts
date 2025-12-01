import { useState, useMemo } from 'react';
import { Clause } from '../types';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useClauseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch clauses with TanStack Query - automatic caching
  const { data: clauses = [] } = useQuery({
    queryKey: ['/api/v1/clauses'],
    queryFn: () => ApiService.getClauses(),
    staleTime: 10 * 60 * 1000 // 10 min cache - clauses rarely change
  });

  const filtered = useMemo(() => clauses.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())), [clauses, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    clauses,
    filtered
  };
};