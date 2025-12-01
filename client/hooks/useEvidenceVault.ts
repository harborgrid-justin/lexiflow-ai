import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService, ApiError } from '../services/apiService';
import { EvidenceItem, ChainOfCustodyEvent } from '../types';
import { ensureTagsArray } from '../utils/type-transformers';
import { useLatestCallback, useIsMounted } from '../enzyme';

export type ViewMode = 'dashboard' | 'inventory' | 'custody' | 'intake' | 'detail';
export type DetailTab = 'overview' | 'custody' | 'admissibility' | 'forensics';

export interface EvidenceFilters {
  search: string;
  type: string;
  admissibility: string;
  caseId: string;
  custodian: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  tags: string;
  collectedBy: string;
  hasBlockchain: boolean;
}

export const useEvidenceVault = () => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  // Fetch evidence with TanStack Query - automatic caching
  const { data: evidenceItems = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['evidence'],
    queryFn: () => ApiService.evidence.getAll(),
    staleTime: 3 * 60 * 1000, // 3 min cache
    retry: 2
  });

  const [filters, setFilters] = useState<EvidenceFilters>({
    search: '',
    type: '',
    admissibility: '',
    caseId: '',
    custodian: '',
    dateFrom: '',
    dateTo: '',
    location: '',
    tags: '',
    collectedBy: '',
    hasBlockchain: false
  });

  // Create evidence mutation
  const createMutation = useMutation({
    mutationFn: (newItem: EvidenceItem) => ApiService.evidence.create(newItem),
    onSuccess: (createdItem) => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      if (isMounted()) {
        setView('inventory');
      }
    },
    onError: (err: any) => {
      console.error('Failed to create evidence item:', err);
      if (isMounted()) {
        const message = err instanceof ApiError ? err.statusText : 'Failed to log item';
        setError(`Failed to log item: ${message}`);
      }
    }
  });

  // Update evidence mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EvidenceItem> }) =>
      ApiService.evidence.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
    onError: (err: any) => {
      console.error('Failed to update evidence:', err);
      if (isMounted()) {
        const message = err instanceof ApiError ? err.statusText : 'Failed to update';
        setError(`Failed to update: ${message}`);
      }
    }
  });

  const handleItemClick = useLatestCallback((item: EvidenceItem) => {
    setSelectedItem(item);
    setView('detail');
    setActiveTab('overview');
  });

  const handleBack = useLatestCallback(() => {
    setSelectedItem(null);
    setView('inventory');
  });

  const handleIntakeComplete = useLatestCallback(async (newItem: EvidenceItem) => {
    try {
      setError(null);
      await createMutation.mutateAsync(newItem);
      alert("Item logged successfully.");
    } catch (err) {
      alert('Failed to log item.');
      throw err;
    }
  });

  const handleCustodyUpdate = useLatestCallback(async (newEvent: ChainOfCustodyEvent) => {
    if (!selectedItem) return;

    try {
      setError(null);
      const updatedChain = [newEvent, ...(selectedItem.chainOfCustody || [])];
      const updatedItem = {
        ...selectedItem,
        chainOfCustody: updatedChain
      };

      await updateMutation.mutateAsync({
        id: selectedItem.id,
        data: { chainOfCustody: updatedChain }
      });

      setSelectedItem(updatedItem);
    } catch (err) {
      throw err;
    }
  });

  const filteredItems = useMemo(() => {
    return evidenceItems.filter(e => {
      const matchesSearch = !filters.search || (e.title || '').toLowerCase().includes(filters.search.toLowerCase()) || (e.description || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = !filters.type || e.type === filters.type;
      const matchesAdmissibility = !filters.admissibility || e.admissibility === filters.admissibility;
      const matchesCaseId = !filters.caseId || (e.caseId || '').toLowerCase().includes(filters.caseId.toLowerCase());
      const matchesCustodian = !filters.custodian || (e.custodian || '').toLowerCase().includes(filters.custodian.toLowerCase());
      const matchesDateFrom = !filters.dateFrom || (e.collectionDate || '') >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || (e.collectionDate || '') <= filters.dateTo;
      const matchesLocation = !filters.location || (e.location || '').toLowerCase().includes(filters.location.toLowerCase());
      const matchesTags = !filters.tags || ensureTagsArray(e.tags).some(t => t.toLowerCase().includes(filters.tags.toLowerCase()));
      const matchesCollectedBy = !filters.collectedBy || (e.collectedBy || '').toLowerCase().includes(filters.collectedBy.toLowerCase());
      const matchesBlockchain = !filters.hasBlockchain || !!e.blockchainHash;

      return matchesSearch && matchesType && matchesAdmissibility && matchesCaseId && matchesCustodian &&
             matchesDateFrom && matchesDateTo && matchesLocation && matchesTags && matchesCollectedBy && matchesBlockchain;
    });
  }, [filters, evidenceItems]);

  return {
    view,
    setView,
    activeTab,
    setActiveTab,
    selectedItem,
    evidenceItems,
    filters,
    setFilters,
    filteredItems,
    loading,
    error,
    handleItemClick,
    handleBack,
    handleIntakeComplete,
    handleCustodyUpdate,
    refresh: refetch
  };
};
