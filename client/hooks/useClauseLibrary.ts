import { useState, useEffect, useMemo } from 'react';
import { Clause } from '../types';
import { ApiService } from '../services/apiService';

export const useClauseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clauses, setClauses] = useState<Clause[]>([]);

  useEffect(() => {
    const fetchClauses = async () => {
        try {
            const data = await ApiService.getClauses();
            setClauses(data);
        } catch (e) {
            console.error("Failed to fetch clauses", e);
        }
    };
    fetchClauses();
  }, []);

  const filtered = useMemo(() => clauses.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())), [clauses, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    clauses,
    filtered
  };
};