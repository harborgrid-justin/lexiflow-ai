/**
 * Calendar Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarFilters, CalendarViewMode } from '../api/calendar.types';

interface CalendarState {
  // View state
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;

  // Current date
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;

  // Filters
  filters: CalendarFilters;
  setFilters: (filters: CalendarFilters) => void;
  updateFilter: <K extends keyof CalendarFilters>(key: K, value: CalendarFilters[K]) => void;
  clearFilters: () => void;

  // Selection
  selectedEventId: string | null;
  selectEvent: (id: string | null) => void;

  // Event modal
  isEventModalOpen: boolean;
  editingEventId: string | null;
  openEventModal: (eventId?: string) => void;
  closeEventModal: () => void;
}

const defaultFilters: CalendarFilters = {
  status: 'all',
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      // View state
      viewMode: 'month',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Current date
      currentDate: new Date(),
      setCurrentDate: (date) => set({ currentDate: date }),
      goToToday: () => set({ currentDate: new Date() }),
      goToPrevious: () => {
        const { viewMode, currentDate } = get();
        const newDate = new Date(currentDate);
        
        switch (viewMode) {
          case 'day':
            newDate.setDate(newDate.getDate() - 1);
            break;
          case 'week':
            newDate.setDate(newDate.getDate() - 7);
            break;
          case 'month':
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        }
        
        set({ currentDate: newDate });
      },
      goToNext: () => {
        const { viewMode, currentDate } = get();
        const newDate = new Date(currentDate);
        
        switch (viewMode) {
          case 'day':
            newDate.setDate(newDate.getDate() + 1);
            break;
          case 'week':
            newDate.setDate(newDate.getDate() + 7);
            break;
          case 'month':
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        }
        
        set({ currentDate: newDate });
      },

      // Filters
      filters: defaultFilters,
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilters: () => set({ filters: defaultFilters }),

      // Selection
      selectedEventId: null,
      selectEvent: (id) => set({ selectedEventId: id }),

      // Event modal
      isEventModalOpen: false,
      editingEventId: null,
      openEventModal: (eventId) =>
        set({ isEventModalOpen: true, editingEventId: eventId ?? null }),
      closeEventModal: () =>
        set({ isEventModalOpen: false, editingEventId: null }),
    }),
    {
      name: 'lexiflow-calendar-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
      }),
    }
  )
);
