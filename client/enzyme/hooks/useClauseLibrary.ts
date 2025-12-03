import { useState, useMemo } from 'react';
import { Clause } from '../../types';
import { useApiRequest } from '../services/hooks';

export const useClauseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ ENZYME: Fetch clauses - automatic caching and refetching
  const { data: clauses = [] } = useApiRequest<Clause[]>({
    endpoint: '/api/v1/clauses',
    options: {
      staleTime: 10 * 60 * 1000 // 10 min cache - clauses rarely change
    }
  });

  const filtered = useMemo(() => 
    clauses.filter(c => 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [clauses, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    clauses,
    filtered
  };
};
