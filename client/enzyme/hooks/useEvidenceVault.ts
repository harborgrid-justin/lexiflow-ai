/**
 * useEvidenceVault Hook - Evidence Management System
 *
 * Manages evidence items, chain of custody, and inventory with optimistic updates.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState } from 'react';
import { enzymeClient } from '../services/client';
import { useApiRequest } from '../services/hooks';
import { useIsMounted, useLatestCallback } from '../index';
import type { EvidenceItem, ChainOfCustodyEvent } from '../../types';

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
  const isMounted = useIsMounted();

  // UI State
  const [view, setView] = useState<ViewMode>('inventory');
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
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
    hasBlockchain: false,
  });

  // Data State
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);

  // Fetch Evidence
  const {
    isLoading,
    error,
    refetch,
  } = useApiRequest<EvidenceItem[]>({
    endpoint: '/evidence',
    options: {
      staleTime: 3 * 60 * 1000,
      onSuccess: (data) => {
        if (isMounted()) setEvidenceItems(data);
      },
    },
  });

  // Derived State
  const filteredItems = evidenceItems.filter((item) => {
    const matchesSearch =
      !filters.search ||
      item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesType = !filters.type || item.type === filters.type;
    const matchesAdmissibility = !filters.admissibility || item.admissibility === filters.admissibility;
    const matchesCase = !filters.caseId || item.caseId === filters.caseId;
    const matchesLocation = !filters.location || item.location.includes(filters.location);
    const matchesBlockchain = !filters.hasBlockchain || !!item.blockchainHash;

    return (
      matchesSearch &&
      matchesType &&
      matchesAdmissibility &&
      matchesCase &&
      matchesLocation &&
      matchesBlockchain
    );
  });

  // Actions
  const createEvidence = useLatestCallback(async (newItem: Omit<EvidenceItem, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: EvidenceItem = { ...newItem, id: tempId };

    // Optimistic Update
    setEvidenceItems((prev) => [...prev, optimisticItem]);
    setView('inventory');

    try {
      const response = await enzymeClient.post<EvidenceItem>('/evidence', newItem);

      if (isMounted() && response.data) {
        // Replace temp item with real one
        setEvidenceItems((prev) =>
          prev.map((item) => (item.id === tempId ? response.data! : item))
        );
      }
    } catch (err) {
      console.error('Failed to create evidence:', err);
      if (isMounted()) {
        // Revert
        setEvidenceItems((prev) => prev.filter((item) => item.id !== tempId));
      }
    }
  });

  const updateCustody = useLatestCallback(async (
    evidenceId: string,
    event: Omit<ChainOfCustodyEvent, 'id'>
  ) => {
    const tempEventId = `temp-evt-${Date.now()}`;
    const optimisticEvent: ChainOfCustodyEvent = { ...event, id: tempEventId };

    // Optimistic Update
    setEvidenceItems((prev) =>
      prev.map((item) =>
        item.id === evidenceId
          ? { ...item, chainOfCustody: [...item.chainOfCustody, optimisticEvent] }
          : item
      )
    );

    try {
      const response = await enzymeClient.post<ChainOfCustodyEvent>(
        `/evidence/${evidenceId}/custody`,
        event
      );

      if (isMounted() && response.data) {
        // Replace temp event with real one
        setEvidenceItems((prev) =>
          prev.map((item) =>
            item.id === evidenceId
              ? {
                  ...item,
                  chainOfCustody: item.chainOfCustody.map((e) =>
                    e.id === tempEventId ? response.data! : e
                  ),
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update custody:', err);
      if (isMounted()) {
        // Revert
        setEvidenceItems((prev) =>
          prev.map((item) =>
            item.id === evidenceId
              ? {
                  ...item,
                  chainOfCustody: item.chainOfCustody.filter((e) => e.id !== tempEventId),
                }
              : item
          )
        );
      }
    }
  });

  const generateBlockchainHash = useLatestCallback(async (evidenceId: string) => {
    try {
      const response = await enzymeClient.post<{ hash: string }>(
        `/evidence/${evidenceId}/blockchain-hash`
      );

      if (isMounted() && response.data) {
        setEvidenceItems((prev) =>
          prev.map((item) =>
            item.id === evidenceId ? { ...item, blockchainHash: response.data!.hash } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to generate blockchain hash:', err);
    }
  });

  return {
    // State
    view,
    setView,
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    filters,
    setFilters,

    // Data
    evidenceItems: filteredItems,
    allItems: evidenceItems,
    loading: isLoading,
    error,

    // Actions
    createEvidence,
    updateCustody,
    generateBlockchainHash,
    refetch,
  };
};

export default useEvidenceVault;
