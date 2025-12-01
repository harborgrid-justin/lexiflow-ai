import { useState, useEffect, useMemo } from 'react';
import { ApiService } from '../services/apiService';
import { KnowledgeItem } from '../types';

export const useKnowledgeBase = (tab: string) => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryMap: Record<string, string> = {
            'wiki': 'Playbook',
            'precedents': 'Precedent',
            'qa': 'Q&A'
        };
        const data = await ApiService.getKnowledgeBase(categoryMap[tab]);
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

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