/**
 * Document Management Store
 * Global state for document browser
 *
 * Note: This is a custom store implementation. The unused `create` import from
 * 'react' has been removed. Consider migrating to Zustand for better dev tools
 * support and persistence middleware.
 */

export interface DocumentStoreState {
  // Current folder path
  currentFolderId: string | null;
  folderPath: string[];

  // Selected documents
  selectedDocumentIds: string[];

  // Upload queue
  uploadQueue: string[];

  // View preferences
  viewMode: 'list' | 'grid' | 'preview';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  showHiddenFiles: boolean;

  // Filter state
  filterTags: string[];
  filterTypes: string[];
  filterDateRange: { from?: string; to?: string };

  // UI state
  isSidebarCollapsed: boolean;
  previewDocumentId: string | null;
}

export interface DocumentStoreActions {
  // Folder navigation
  setCurrentFolder: (folderId: string | null) => void;
  navigateToFolder: (folderId: string) => void;
  goBack: () => void;

  // Selection
  selectDocument: (id: string) => void;
  deselectDocument: (id: string) => void;
  toggleDocumentSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Upload queue
  addToUploadQueue: (id: string) => void;
  removeFromUploadQueue: (id: string) => void;
  clearUploadQueue: () => void;

  // View preferences
  setViewMode: (mode: 'list' | 'grid' | 'preview') => void;
  setSortBy: (sortBy: 'name' | 'date' | 'size' | 'type') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleSortOrder: () => void;
  setShowHiddenFiles: (show: boolean) => void;

  // Filters
  setFilterTags: (tags: string[]) => void;
  addFilterTag: (tag: string) => void;
  removeFilterTag: (tag: string) => void;
  setFilterTypes: (types: string[]) => void;
  addFilterType: (type: string) => void;
  removeFilterType: (type: string) => void;
  setFilterDateRange: (range: { from?: string; to?: string }) => void;
  clearFilters: () => void;

  // UI
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setPreviewDocument: (id: string | null) => void;

  // Reset
  reset: () => void;
}

export type DocumentStore = DocumentStoreState & DocumentStoreActions;

const initialState: DocumentStoreState = {
  currentFolderId: null,
  folderPath: [],
  selectedDocumentIds: [],
  uploadQueue: [],
  viewMode: 'list',
  sortBy: 'date',
  sortOrder: 'desc',
  showHiddenFiles: false,
  filterTags: [],
  filterTypes: [],
  filterDateRange: {},
  isSidebarCollapsed: false,
  previewDocumentId: null,
};

// Note: Since the project doesn't use Zustand, we'll use a simple React Context pattern
// This is a placeholder that follows Zustand-like API for easy migration if needed
export const createDocumentStore = () => {
  let state = { ...initialState };
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (partial: Partial<DocumentStoreState>) => {
    state = { ...state, ...partial };
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const actions: DocumentStoreActions = {
    // Folder navigation
    setCurrentFolder: (folderId) => setState({ currentFolderId: folderId }),

    navigateToFolder: (folderId) => {
      const currentPath = state.folderPath;
      const index = currentPath.indexOf(folderId);

      if (index >= 0) {
        // Navigating back in path
        setState({
          currentFolderId: folderId,
          folderPath: currentPath.slice(0, index + 1),
        });
      } else {
        // Navigating forward
        setState({
          currentFolderId: folderId,
          folderPath: [...currentPath, folderId],
        });
      }
    },

    goBack: () => {
      const path = state.folderPath;
      if (path.length > 1) {
        const newPath = path.slice(0, -1);
        setState({
          currentFolderId: newPath[newPath.length - 1] || null,
          folderPath: newPath,
        });
      } else {
        setState({
          currentFolderId: null,
          folderPath: [],
        });
      }
    },

    // Selection
    selectDocument: (id) => {
      if (!state.selectedDocumentIds.includes(id)) {
        setState({
          selectedDocumentIds: [...state.selectedDocumentIds, id],
        });
      }
    },

    deselectDocument: (id) => {
      setState({
        selectedDocumentIds: state.selectedDocumentIds.filter(docId => docId !== id),
      });
    },

    toggleDocumentSelection: (id) => {
      if (state.selectedDocumentIds.includes(id)) {
        actions.deselectDocument(id);
      } else {
        actions.selectDocument(id);
      }
    },

    selectAll: (ids) => setState({ selectedDocumentIds: ids }),

    clearSelection: () => setState({ selectedDocumentIds: [] }),

    // Upload queue
    addToUploadQueue: (id) => {
      if (!state.uploadQueue.includes(id)) {
        setState({ uploadQueue: [...state.uploadQueue, id] });
      }
    },

    removeFromUploadQueue: (id) => {
      setState({ uploadQueue: state.uploadQueue.filter(queueId => queueId !== id) });
    },

    clearUploadQueue: () => setState({ uploadQueue: [] }),

    // View preferences
    setViewMode: (mode) => setState({ viewMode: mode }),

    setSortBy: (sortBy) => setState({ sortBy }),

    setSortOrder: (order) => setState({ sortOrder: order }),

    toggleSortOrder: () => {
      setState({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' });
    },

    setShowHiddenFiles: (show) => setState({ showHiddenFiles: show }),

    // Filters
    setFilterTags: (tags) => setState({ filterTags: tags }),

    addFilterTag: (tag) => {
      if (!state.filterTags.includes(tag)) {
        setState({ filterTags: [...state.filterTags, tag] });
      }
    },

    removeFilterTag: (tag) => {
      setState({ filterTags: state.filterTags.filter(t => t !== tag) });
    },

    setFilterTypes: (types) => setState({ filterTypes: types }),

    addFilterType: (type) => {
      if (!state.filterTypes.includes(type)) {
        setState({ filterTypes: [...state.filterTypes, type] });
      }
    },

    removeFilterType: (type) => {
      setState({ filterTypes: state.filterTypes.filter(t => t !== type) });
    },

    setFilterDateRange: (range) => setState({ filterDateRange: range }),

    clearFilters: () =>
      setState({
        filterTags: [],
        filterTypes: [],
        filterDateRange: {},
      }),

    // UI
    toggleSidebar: () => setState({ isSidebarCollapsed: !state.isSidebarCollapsed }),

    setSidebarCollapsed: (collapsed) => setState({ isSidebarCollapsed: collapsed }),

    setPreviewDocument: (id) => setState({ previewDocumentId: id }),

    // Reset
    reset: () => setState(initialState),
  };

  return {
    getState,
    setState,
    subscribe,
    ...actions,
  };
};

export type DocumentStoreInstance = ReturnType<typeof createDocumentStore>;
