/**
 * Settings Store
 *
 * Manages user preferences and settings state for the application.
 * This store provides a centralized way to access and update user settings
 * across the application without needing to fetch from the API each time.
 */

import type { Theme, UserSettings } from '../api/settings.types';

// Store state type
interface SettingsStore {
  // Cached user settings
  userSettings: UserSettings | null;

  // UI preferences
  theme: Theme;
  sidebarCollapsed: boolean;

  // Actions
  setUserSettings: (settings: UserSettings) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  clearSettings: () => void;
}

// Create a simple store using a class-based approach
class SettingsStoreClass {
  private listeners: Set<() => void> = new Set();
  private state: Omit<SettingsStore, 'setUserSettings' | 'setTheme' | 'toggleSidebar' | 'clearSettings'> = {
    userSettings: null,
    theme: this.getInitialTheme(),
    sidebarCollapsed: this.getInitialSidebarState(),
  };

  constructor() {
    // Initialize theme from localStorage or system preference
    this.applyTheme(this.state.theme);
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const stored = localStorage.getItem('lexiflow-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }

    // Default to system
    return 'system';
  }

  private getInitialSidebarState(): boolean {
    const stored = localStorage.getItem('lexiflow-sidebar-collapsed');
    return stored === 'true';
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.state;
  }

  setUserSettings(settings: UserSettings) {
    this.state.userSettings = settings;

    // Sync theme with user settings
    if (settings.theme && settings.theme !== this.state.theme) {
      this.setTheme(settings.theme);
    }

    this.notifyListeners();
  }

  setTheme(theme: Theme) {
    this.state.theme = theme;
    localStorage.setItem('lexiflow-theme', theme);
    this.applyTheme(theme);
    this.notifyListeners();
  }

  toggleSidebar() {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    localStorage.setItem('lexiflow-sidebar-collapsed', String(this.state.sidebarCollapsed));
    this.notifyListeners();
  }

  clearSettings() {
    this.state.userSettings = null;
    this.state.theme = 'system';
    this.state.sidebarCollapsed = false;
    localStorage.removeItem('lexiflow-theme');
    localStorage.removeItem('lexiflow-sidebar-collapsed');
    this.applyTheme('system');
    this.notifyListeners();
  }
}

// Create singleton instance
export const settingsStore = new SettingsStoreClass();

// React hook for using the store
import { useEffect, useState } from 'react';

export const useSettingsStore = <T,>(
  selector: (state: ReturnType<typeof settingsStore.getState>) => T
): T => {
  const [state, setState] = useState(() => selector(settingsStore.getState()));

  useEffect(() => {
    const unsubscribe = settingsStore.subscribe(() => {
      setState(selector(settingsStore.getState()));
    });
    return unsubscribe;
  }, [selector]);

  return state;
};

// Convenience hooks for common use cases
export const useTheme = () => useSettingsStore((state) => state.theme);
export const useSidebarCollapsed = () => useSettingsStore((state) => state.sidebarCollapsed);
export const useUserSettingsStore = () => useSettingsStore((state) => state.userSettings);

// Actions
export const settingsActions = {
  setUserSettings: (settings: UserSettings) => settingsStore.setUserSettings(settings),
  setTheme: (theme: Theme) => settingsStore.setTheme(theme),
  toggleSidebar: () => settingsStore.toggleSidebar(),
  clearSettings: () => settingsStore.clearSettings(),
};

// Listen to system theme changes when theme is set to 'system'
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = settingsStore.getState().theme;
    if (currentTheme === 'system') {
      settingsStore.setTheme('system'); // Re-apply to trigger theme update
    }
  });
}
