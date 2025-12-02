// Billing Store - Global state management for billing features
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  TimeEntry,
  TimeEntryFilters,
  InvoiceFilters,
  CreateInvoiceRequest,
} from '../api/billing.types';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: string | null;
  elapsedSeconds: number;
  caseId: string | null;
  caseName: string | null;
}

interface InvoiceBuilderState {
  step: 'select-client' | 'select-entries' | 'customize' | 'preview';
  selectedClientId: string | null;
  selectedCaseId: string | null;
  selectedTimeEntryIds: string[];
  selectedExpenseIds: string[];
  discounts: CreateInvoiceRequest['discounts'];
  invoiceData: Partial<CreateInvoiceRequest>;
}

interface BillingStoreState {
  // Timer state
  timer: TimerState;
  setTimer: (timer: Partial<TimerState>) => void;
  resetTimer: () => void;

  // Time entry filters
  timeEntryFilters: TimeEntryFilters;
  setTimeEntryFilters: (filters: Partial<TimeEntryFilters>) => void;
  resetTimeEntryFilters: () => void;

  // Invoice filters
  invoiceFilters: InvoiceFilters;
  setInvoiceFilters: (filters: Partial<InvoiceFilters>) => void;
  resetInvoiceFilters: () => void;

  // Selected time entries (for bulk operations)
  selectedTimeEntries: string[];
  toggleTimeEntrySelection: (id: string) => void;
  selectAllTimeEntries: (ids: string[]) => void;
  clearTimeEntrySelection: () => void;

  // Invoice builder state
  invoiceBuilder: InvoiceBuilderState;
  setInvoiceBuilderStep: (step: InvoiceBuilderState['step']) => void;
  setInvoiceBuilderData: (data: Partial<InvoiceBuilderState>) => void;
  resetInvoiceBuilder: () => void;

  // Time entry templates/quick actions
  recentActivities: Array<{
    caseId: string;
    caseName: string;
    activityType: TimeEntry['activityType'];
    description: string;
  }>;
  addRecentActivity: (activity: {
    caseId: string;
    caseName: string;
    activityType: TimeEntry['activityType'];
    description: string;
  }) => void;

  // UI preferences
  preferences: {
    defaultBillableRate: number;
    defaultTimerCase: string | null;
    showTimerWidget: boolean;
    timeEntryGroupBy: 'date' | 'case' | 'activity' | 'none';
    invoiceDefaultGroupBy: 'date' | 'activity' | 'attorney' | 'none';
    autoStartTimer: boolean;
  };
  setPreferences: (prefs: Partial<BillingStoreState['preferences']>) => void;
}

const initialTimerState: TimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  elapsedSeconds: 0,
  caseId: null,
  caseName: null,
};

const initialInvoiceBuilderState: InvoiceBuilderState = {
  step: 'select-client',
  selectedClientId: null,
  selectedCaseId: null,
  selectedTimeEntryIds: [],
  selectedExpenseIds: [],
  discounts: [],
  invoiceData: {},
};

const initialPreferences = {
  defaultBillableRate: 250,
  defaultTimerCase: null,
  showTimerWidget: true,
  timeEntryGroupBy: 'date' as const,
  invoiceDefaultGroupBy: 'date' as const,
  autoStartTimer: false,
};

export const useBillingStore = create<BillingStoreState>()(
  persist(
    (set) => ({
      // Timer state
      timer: initialTimerState,
      setTimer: (timer) =>
        set((state) => ({
          timer: { ...state.timer, ...timer },
        })),
      resetTimer: () => set({ timer: initialTimerState }),

      // Time entry filters
      timeEntryFilters: {},
      setTimeEntryFilters: (filters) =>
        set((state) => ({
          timeEntryFilters: { ...state.timeEntryFilters, ...filters },
        })),
      resetTimeEntryFilters: () => set({ timeEntryFilters: {} }),

      // Invoice filters
      invoiceFilters: {},
      setInvoiceFilters: (filters) =>
        set((state) => ({
          invoiceFilters: { ...state.invoiceFilters, ...filters },
        })),
      resetInvoiceFilters: () => set({ invoiceFilters: {} }),

      // Selected time entries
      selectedTimeEntries: [],
      toggleTimeEntrySelection: (id) =>
        set((state) => ({
          selectedTimeEntries: state.selectedTimeEntries.includes(id)
            ? state.selectedTimeEntries.filter((entryId) => entryId !== id)
            : [...state.selectedTimeEntries, id],
        })),
      selectAllTimeEntries: (ids) => set({ selectedTimeEntries: ids }),
      clearTimeEntrySelection: () => set({ selectedTimeEntries: [] }),

      // Invoice builder
      invoiceBuilder: initialInvoiceBuilderState,
      setInvoiceBuilderStep: (step) =>
        set((state) => ({
          invoiceBuilder: { ...state.invoiceBuilder, step },
        })),
      setInvoiceBuilderData: (data) =>
        set((state) => ({
          invoiceBuilder: { ...state.invoiceBuilder, ...data },
        })),
      resetInvoiceBuilder: () => set({ invoiceBuilder: initialInvoiceBuilderState }),

      // Recent activities
      recentActivities: [],
      addRecentActivity: (activity) =>
        set((state) => {
          const filtered = state.recentActivities.filter(
            (a) =>
              !(
                a.caseId === activity.caseId &&
                a.activityType === activity.activityType &&
                a.description === activity.description
              )
          );
          return {
            recentActivities: [activity, ...filtered].slice(0, 10), // Keep last 10
          };
        }),

      // Preferences
      preferences: initialPreferences,
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
    }),
    {
      name: 'lexiflow-billing-store',
      partialize: (state) => ({
        preferences: state.preferences,
        recentActivities: state.recentActivities,
      }),
    }
  )
);

// Selectors
export const selectTimer = (state: BillingStoreState) => state.timer;
export const selectTimeEntryFilters = (state: BillingStoreState) => state.timeEntryFilters;
export const selectInvoiceFilters = (state: BillingStoreState) => state.invoiceFilters;
export const selectSelectedTimeEntries = (state: BillingStoreState) => state.selectedTimeEntries;
export const selectInvoiceBuilder = (state: BillingStoreState) => state.invoiceBuilder;
export const selectRecentActivities = (state: BillingStoreState) => state.recentActivities;
export const selectPreferences = (state: BillingStoreState) => state.preferences;
