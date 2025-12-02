/**
 * useEvidenceVault Hook
 *
 * Manages evidence vault state, filtering, and CRUD operations.
 *
 * Features:
 * - TanStack Query for data fetching with optimistic updates
 * - Enzyme hooks for stable callbacks and safe state management
 * - Comprehensive filtering support
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService, ApiError } from '@/services/apiService';
import { EvidenceItem, ChainOfCustodyEvent } from '@/types';
import { ensureTagsArray } from '@/utils/type-transformers';
import {
  useLatestCallback,
  useIsMounted,
  useErrorToast,
  useSafeState
} from '@/enzyme';
import type { ViewMode, DetailTab, EvidenceFilters } from '../api/evidence.types';

export type { ViewMode, DetailTab, EvidenceFilters };

const DEFAULT_FILTERS: EvidenceFilters = {
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
};

export const useEvidenceVault = () => {
  // Safe state management
  const [view, setView] = useSafeState<ViewMode>('inventory');
  const [activeTab, setActiveTab] = useSafeState<DetailTab>('overview');
  const [selectedItem, setSelectedItem] = useSafeState<EvidenceItem | null>(null);
  const [filters, setFilters] = useSafeState<EvidenceFilters>(DEFAULT_FILTERS);

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();
  const showErrorToast = useErrorToast();

  // Fetch evidence with TanStack Query
  const { 
    data: evidenceItems = [], 
    isLoading: loading, 
    refetch 
  } = useQuery({
    queryKey: ['evidence'],
    queryFn: () => ApiService.evidence.getAll(),
    staleTime: 3 * 60 * 1000,
    retry: 2
  });

  // Create mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: (newItem: Partial<EvidenceItem>) => ApiService.evidence.create(newItem),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['evidence'] });
      const previousData = queryClient.getQueryData<EvidenceItem[]>(['evidence']);

      queryClient.setQueryData<EvidenceItem[]>(['evidence'], (old = []) => [
        ...old,
        { ...newItem, id: `temp-${Date.now()}` } as EvidenceItem
      ]);

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      if (isMounted()) {
        setView('inventory');
      }
    },
    onError: (err: unknown, _newItem, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['evidence'], context.previousData);
      }
      const message = err instanceof ApiError ? err.statusText : 'Failed to log item';
      showErrorToast(`Failed to log item: ${message}`);
    }
  });

  // Update mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EvidenceItem> }) =>
      ApiService.evidence.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['evidence'] });
      const previousData = queryClient.getQueryData<EvidenceItem[]>(['evidence']);

      queryClient.setQueryData<EvidenceItem[]>(['evidence'], (old = []) =>
        old.map(item => (item.id === id ? { ...item, ...data } : item))
      );

      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, ...data } as EvidenceItem);
      }

      return { previousData, previousSelectedItem: selectedItem };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['evidence'], context.previousData);
      }
      if (context?.previousSelectedItem) {
        setSelectedItem(context.previousSelectedItem);
      }
      const message = err instanceof ApiError ? err.statusText : 'Failed to update';
      showErrorToast(`Failed to update: ${message}`);
    }
  });

  // Event handlers with stable callbacks
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
    await createMutation.mutateAsync(newItem);
  });

  const handleCustodyUpdate = useLatestCallback(async (newEvent: ChainOfCustodyEvent) => {
    if (!selectedItem) return;

    const updatedChain = [newEvent, ...(selectedItem.chainOfCustody || [])];
    await updateMutation.mutateAsync({
      id: selectedItem.id,
      data: { chainOfCustody: updatedChain }
    });
  });

  // Filtered items
  const filteredItems = useMemo(() => {
    return evidenceItems.filter(e => {
      const matchesSearch = !filters.search ||
        (e.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (e.description || '').toLowerCase().includes(filters.search.toLowerCase());
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

      return matchesSearch && matchesType && matchesAdmissibility && matchesCaseId &&
        matchesCustodian && matchesDateFrom && matchesDateTo && matchesLocation &&
        matchesTags && matchesCollectedBy && matchesBlockchain;
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
    handleItemClick,
    handleBack,
    handleIntakeComplete,
    handleCustodyUpdate,
    refresh: refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};

export default useEvidenceVault;
