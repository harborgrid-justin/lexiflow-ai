
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ApiService, ApiError } from '../services/apiService';
import { EvidenceItem, ChainOfCustodyEvent } from '../types';

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
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const items = await ApiService.evidence.getAll();
      setEvidenceItems(items);
    } catch (err) {
      console.error('Failed to fetch evidence:', err);

      if (err instanceof ApiError) {
        setError(`Failed to load evidence: ${err.statusText}`);
      } else {
        setError('Failed to load evidence. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

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

  const handleItemClick = (item: EvidenceItem) => {
    setSelectedItem(item);
    setView('detail');
    setActiveTab('overview');
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView('inventory');
  };

  const handleIntakeComplete = async (newItem: EvidenceItem) => {
    try {
      setError(null);
      const createdItem = await ApiService.evidence.create(newItem);
      setEvidenceItems([createdItem, ...evidenceItems]);
      alert("Item logged successfully.");
      setView('inventory');
    } catch (err) {
      console.error('Failed to create evidence item:', err);

      if (err instanceof ApiError) {
        setError(`Failed to log item: ${err.statusText}`);
        alert(`Failed to log item: ${err.statusText}`);
      } else {
        setError('Failed to log item. Please try again.');
        alert('Failed to log item.');
      }
      throw err;
    }
  };

  const handleCustodyUpdate = async (newEvent: ChainOfCustodyEvent) => {
    if (!selectedItem) return;

    try {
      setError(null);
      const updatedChain = [newEvent, ...selectedItem.chainOfCustody];
      const updatedItem = {
        ...selectedItem,
        chainOfCustody: updatedChain
      };

      await ApiService.evidence.update(selectedItem.id, { chainOfCustody: updatedChain });

      setEvidenceItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
    } catch (err) {
      console.error('Failed to update custody:', err);

      if (err instanceof ApiError) {
        setError(`Failed to update custody: ${err.statusText}`);
      } else {
        setError('Failed to update custody. Please try again.');
      }
      throw err;
    }
  };

  const filteredItems = useMemo(() => {
    return evidenceItems.filter(e => {
      const matchesSearch = !filters.search || e.title.toLowerCase().includes(filters.search.toLowerCase()) || e.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = !filters.type || e.type === filters.type;
      const matchesAdmissibility = !filters.admissibility || e.admissibility === filters.admissibility;
      const matchesCaseId = !filters.caseId || e.caseId.toLowerCase().includes(filters.caseId.toLowerCase());
      const matchesCustodian = !filters.custodian || e.custodian.toLowerCase().includes(filters.custodian.toLowerCase());
      const matchesDateFrom = !filters.dateFrom || e.collectionDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || e.collectionDate <= filters.dateTo;
      const matchesLocation = !filters.location || e.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesTags = !filters.tags || e.tags.some(t => t.toLowerCase().includes(filters.tags.toLowerCase()));
      const matchesCollectedBy = !filters.collectedBy || e.collectedBy.toLowerCase().includes(filters.collectedBy.toLowerCase());
      const matchesBlockchain = !filters.hasBlockchain || !!e.blockchainHash;

      return matchesSearch && matchesType && matchesAdmissibility && matchesCaseId && matchesCustodian && 
             matchesDateFrom && matchesDateTo && matchesLocation && matchesTags && matchesCollectedBy && matchesBlockchain;
    });
  }, [filters, evidenceItems]);

  const refresh = useCallback(() => {
    return fetchEvidence();
  }, [fetchEvidence]);

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
    refresh
  };
};
