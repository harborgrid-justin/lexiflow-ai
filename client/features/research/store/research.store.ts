/**
 * Research Store
 * State management for research feature
 *
 * Note: This is a custom store implementation. The unused `create` import from
 * 'react' has been removed. Consider migrating to Zustand for better performance
 * and dev tools support.
 *
 * @see /config/app.config.ts for centralized configuration
 */

import type { SearchFilters } from '../api/research.types';

interface ResearchState {
  // Current search state
  currentQuery: string;
  setCurrentQuery: (query: string) => void;

  // Filter state
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;

  // Saved results
  savedResultIds: Set<string>;
  addSavedResult: (id: string) => void;
  removeSavedResult: (id: string) => void;
  clearSavedResults: () => void;

  // Selected folder
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;

  // View preferences
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;

  showFilters: boolean;
  toggleFilters: () => void;
}

/**
 * Simple store implementation using a global object and subscriptions
 * This mimics Zustand's API but without the dependency
 */
class SimpleStore<T> {
  private state: T;
  private listeners = new Set<() => void>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = (): T => {
    return this.state;
  };

  setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? partial(this.state) : partial;
    this.state = { ...this.state, ...nextState };
    this.listeners.forEach(listener => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}

const initialState: Omit<ResearchState, keyof typeof actions> = {
  currentQuery: '',
  filters: {},
  savedResultIds: new Set<string>(),
  selectedFolderId: null,
  viewMode: 'list',
  showFilters: true,
};

const actions = {
  setCurrentQuery: (query: string) => {
    researchStore.setState({ currentQuery: query });
  },

  setFilters: (filters: SearchFilters) => {
    researchStore.setState({ filters });
  },

  resetFilters: () => {
    researchStore.setState({ filters: {} });
  },

  addSavedResult: (id: string) => {
    const { savedResultIds } = researchStore.getState();
    const newSet = new Set(savedResultIds);
    newSet.add(id);
    researchStore.setState({ savedResultIds: newSet });
  },

  removeSavedResult: (id: string) => {
    const { savedResultIds } = researchStore.getState();
    const newSet = new Set(savedResultIds);
    newSet.delete(id);
    researchStore.setState({ savedResultIds: newSet });
  },

  clearSavedResults: () => {
    researchStore.setState({ savedResultIds: new Set<string>() });
  },

  setSelectedFolderId: (id: string | null) => {
    researchStore.setState({ selectedFolderId: id });
  },

  setViewMode: (mode: 'list' | 'grid') => {
    researchStore.setState({ viewMode: mode });
  },

  toggleFilters: () => {
    researchStore.setState(state => ({ showFilters: !state.showFilters }));
  },
};

const researchStore = new SimpleStore<ResearchState>({
  ...initialState,
  ...actions,
});

/**
 * React hook to use the research store
 */
export function useResearchStore(): ResearchState;
export function useResearchStore<T>(selector: (state: ResearchState) => T): T;
export function useResearchStore<T>(selector?: (state: ResearchState) => T) {
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    const unsubscribe = researchStore.subscribe(forceUpdate);
    return unsubscribe;
  }, []);

  const state = researchStore.getState();
  return selector ? selector(state) : state;
}

/**
 * Get store state outside of React components
 */
export const getResearchState = () => researchStore.getState();

/**
 * Alternative: If Zustand is installed, use this implementation instead:
 *
 * import { create } from 'zustand';
 * import { persist } from 'zustand/middleware';
 *
 * export const useResearchStore = create<ResearchState>()(
 *   persist(
 *     (set) => ({
 *       currentQuery: '',
 *       filters: {},
 *       savedResultIds: new Set<string>(),
 *       selectedFolderId: null,
 *       viewMode: 'list',
 *       showFilters: true,
 *
 *       setCurrentQuery: (query) => set({ currentQuery: query }),
 *       setFilters: (filters) => set({ filters }),
 *       resetFilters: () => set({ filters: {} }),
 *
 *       addSavedResult: (id) => set((state) => ({
 *         savedResultIds: new Set(state.savedResultIds).add(id)
 *       })),
 *
 *       removeSavedResult: (id) => set((state) => {
 *         const newSet = new Set(state.savedResultIds);
 *         newSet.delete(id);
 *         return { savedResultIds: newSet };
 *       }),
 *
 *       clearSavedResults: () => set({ savedResultIds: new Set() }),
 *       setSelectedFolderId: (id) => set({ selectedFolderId: id }),
 *       setViewMode: (mode) => set({ viewMode: mode }),
 *       toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
 *     }),
 *     {
 *       name: 'research-store',
 *       partialize: (state) => ({
 *         savedResultIds: Array.from(state.savedResultIds),
 *         viewMode: state.viewMode,
 *         showFilters: state.showFilters,
 *       }),
 *     }
 *   )
 * );
 */

// Import React for the hook
import * as React from 'react';
