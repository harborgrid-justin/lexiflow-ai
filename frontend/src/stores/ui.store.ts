import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, SidebarState, Notification } from '@types/index';

interface UIState {
  theme: Theme;
  sidebarState: SidebarState;
  commandPaletteOpen: boolean;
  notifications: Notification[];
  unreadNotificationCount: number;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarState: 'expanded',
      commandPaletteOpen: false,
      notifications: [],
      unreadNotificationCount: 0,

      setTheme: (theme) => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        set({ theme });
      },

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(newTheme);
          return { theme: newTheme };
        }),

      setSidebarState: (sidebarState) =>
        set({ sidebarState }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarState: state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),

      setCommandPaletteOpen: (open) =>
        set({ commandPaletteOpen: open }),

      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

      addNotification: (notification) =>
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [newNotification, ...state.notifications],
            unreadNotificationCount: state.unreadNotificationCount + 1,
          };
        }),

      markNotificationRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
          };
        }),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadNotificationCount: 0,
        })),

      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadNotificationCount:
              notification && !notification.read
                ? Math.max(0, state.unreadNotificationCount - 1)
                : state.unreadNotificationCount,
          };
        }),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadNotificationCount: 0,
        }),
    }),
    {
      name: 'lexiflow-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
      }),
    }
  )
);
