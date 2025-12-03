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
import { useApiRequest, useApiMutation, useLatestCallback, useIsMounted, useErrorToast, useSafeState } from '@/enzyme';
import { enzymeEvidenceService } from '@/enzyme/services/evidence.service';
import { EvidenceItem, ChainOfCustodyEvent } from '@/types';
import { ensureTagsArray } from '@/utils/type-transformers';
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

  const isMounted = useIsMounted();
  const showErrorToast = useErrorToast();

  // Fetch evidence with Enzyme
  const { 
    data: evidenceItems = [], 
    isLoading: loading, 
    refetch 
  } = useApiRequest<EvidenceItem[]>({
    endpoint: '/evidence',
    options: {
      staleTime: 3 * 60 * 1000,
      retry: 2
    }
  });

  // Create mutation
  const { mutateAsync: createMutation } = useApiMutation<EvidenceItem, Partial<EvidenceItem>>({
    mutationFn: (newItem) => enzymeEvidenceService.create(newItem),
    onSuccess: () => {
      refetch();
      if (isMounted()) {
        setView('inventory');
      }
    },
    onError: (err) => {
      const message = err.message || 'Failed to log item';
      showErrorToast(`Failed to log item: ${message}`);
    }
  });

  // Update mutation
  const { mutateAsync: updateMutation } = useApiMutation<EvidenceItem, { id: string; data: Partial<EvidenceItem> }>({
    mutationFn: ({ id, data }) => enzymeEvidenceService.update(id, data),
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      const message = err.message || 'Failed to update';
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
    await createMutation(newItem);
  });

  const handleCustodyUpdate = useLatestCallback(async (newEvent: ChainOfCustodyEvent) => {
    if (!selectedItem) return;

    const updatedChain = [newEvent, ...(selectedItem.chainOfCustody || [])];
    await updateMutation({
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
