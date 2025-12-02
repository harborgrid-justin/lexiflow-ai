/**
 * Evidence Vault Hook - ENZYME MIGRATION ENHANCED
 *
 * This hook manages the Evidence Vault feature with full Enzyme integration.
 *
 * ENZYME FEATURES:
 * - useLatestCallback: Stable callback references for event handlers
 * - useIsMounted: Safe async state updates after component unmounts
 * - useOptimisticUpdate: Instant UI feedback for create/update operations
 * - useErrorToast: User-friendly error notifications
 * - useSafeState: Memory-leak-safe state management
 * - TanStack Query: Advanced caching and query invalidation
 *
 * PATTERNS:
 * 1. Optimistic UI updates for evidence creation and custody updates
 * 2. Automatic rollback on mutation failures
 * 3. Toast notifications for errors instead of alert()
 * 4. Safe state updates with isMounted guards
 * 5. Query cache management with proper invalidation
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService, ApiError } from '../services/apiService';
import { EvidenceItem, ChainOfCustodyEvent } from '../types';
import { ensureTagsArray } from '../utils/type-transformers';
import {
  useLatestCallback,
  useIsMounted,
  useOptimisticUpdate,
  useErrorToast,
  useSafeState
} from '../enzyme';

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
  // Safe state management to prevent memory leaks
  const [view, setView] = useSafeState<ViewMode>('inventory'); // Changed from 'dashboard' to 'inventory'
  const [activeTab, setActiveTab] = useSafeState<DetailTab>('overview');
  const [selectedItem, setSelectedItem] = useSafeState<EvidenceItem | null>(null);

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();
  const showErrorToast = useErrorToast();

  // Fetch evidence with TanStack Query - automatic caching
  const { data: evidenceItems = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['evidence'],
    queryFn: () => ApiService.evidence.getAll(),
    staleTime: 3 * 60 * 1000, // 3 min cache
    retry: 2
  });

  const [filters, setFilters] = useSafeState<EvidenceFilters>({
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

  // Create evidence mutation with optimistic updates
  const createOptimistic = useOptimisticUpdate<EvidenceItem, EvidenceItem>({
    mutationFn: async (newItem: EvidenceItem) => {
      return ApiService.evidence.create(newItem);
    },
    onMutate: (newItem) => {
      // Optimistically add the new item to the cache
      const previousData = queryClient.getQueryData<EvidenceItem[]>(['evidence']);

      // Optimistically update the UI by adding the new item
      queryClient.setQueryData<EvidenceItem[]>(['evidence'], (old = []) => {
        return [...old, { ...newItem, id: `temp-${Date.now()}` }];
      });

      return { previousData };
    },
    onSuccess: (_createdItem) => {
      // Replace temp item with real item from server
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      if (isMounted()) {
        setView('inventory');
      }
    },
    onError: (err: any, newItem, context) => {
      console.error('Failed to create evidence item:', err);

      // Rollback optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(['evidence'], context.previousData);
      }

      // Show user-friendly error toast
      const message = err instanceof ApiError ? err.statusText : 'Failed to log item';
      showErrorToast(`Failed to log item: ${message}`);
    }
  });

  const createMutation = {
    mutateAsync: createOptimistic.mutateAsync,
    isPending: createOptimistic.isPending,
    isError: createOptimistic.isError,
    error: createOptimistic.error
  };

  // Update evidence mutation with optimistic updates
  const updateOptimistic = useOptimisticUpdate<
    { id: string; data: Partial<EvidenceItem> },
    EvidenceItem
  >({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EvidenceItem> }) => {
      return ApiService.evidence.update(id, data);
    },
    onMutate: ({ id, data }) => {
      // Store previous data for rollback
      const previousData = queryClient.getQueryData<EvidenceItem[]>(['evidence']);

      // Optimistically update the cache
      queryClient.setQueryData<EvidenceItem[]>(['evidence'], (old = []) => {
        return old.map(item =>
          item.id === id ? { ...item, ...data } : item
        );
      });

      // Also optimistically update selectedItem if it matches
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, ...data } as EvidenceItem);
      }

      return { previousData, previousSelectedItem: selectedItem };
    },
    onSuccess: () => {
      // Refresh data from server
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
    onError: (err: any, variables, context) => {
      console.error('Failed to update evidence:', err);

      // Rollback optimistic updates on error
      if (context?.previousData) {
        queryClient.setQueryData(['evidence'], context.previousData);
      }
      if (context?.previousSelectedItem) {
        setSelectedItem(context.previousSelectedItem);
      }

      // Show user-friendly error toast
      const message = err instanceof ApiError ? err.statusText : 'Failed to update';
      showErrorToast(`Failed to update: ${message}`);
    }
  });

  const updateMutation = {
    mutateAsync: updateOptimistic.mutateAsync,
    isPending: updateOptimistic.isPending,
    isError: updateOptimistic.isError,
    error: updateOptimistic.error
  };

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
    // Success feedback handled by optimistic update
    // UI automatically switches to 'inventory' view in onSuccess
  });

  const handleCustodyUpdate = useLatestCallback(async (newEvent: ChainOfCustodyEvent) => {
    if (!selectedItem) return;

    try {
      const updatedChain = [newEvent, ...(selectedItem.chainOfCustody || [])];

      await updateMutation.mutateAsync({
        id: selectedItem.id,
        data: { chainOfCustody: updatedChain }
      });

      // Optimistic update automatically handles UI updates
      // If error occurs, rollback is automatic via useOptimisticUpdate
    } catch (err) {
      // Error feedback handled by useErrorToast in mutation
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
    handleItemClick,
    handleBack,
    handleIntakeComplete,
    handleCustodyUpdate,
    refresh: refetch,
    // Expose mutation states for loading indicators
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};
