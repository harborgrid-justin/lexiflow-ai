import { create } from 'zustand';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppState {
  breadcrumbs: BreadcrumbItem[];
  pageTitle: string;
  isGlobalLoading: boolean;
  searchQuery: string;

  // Actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  setPageTitle: (title: string) => void;
  setGlobalLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

const initialState = {
  breadcrumbs: [],
  pageTitle: 'Dashboard',
  isGlobalLoading: false,
  searchQuery: '',
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setBreadcrumbs: (breadcrumbs) =>
    set({ breadcrumbs }),

  setPageTitle: (pageTitle) =>
    set({ pageTitle }),

  setGlobalLoading: (isGlobalLoading) =>
    set({ isGlobalLoading }),

  setSearchQuery: (searchQuery) =>
    set({ searchQuery }),

  reset: () =>
    set(initialState),
}));
