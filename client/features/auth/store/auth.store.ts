/**
 * Auth Store
 * Zustand store for authentication state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import type { AuthStatus } from '../api/auth.types';

interface AuthState {
  // State
  user: User | null;
  status: AuthStatus;
  isImpersonating: boolean;
  originalUser: User | null;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  impersonateUser: (user: User) => void;
  stopImpersonating: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  status: 'idle' as AuthStatus,
  isImpersonating: false,
  originalUser: null,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ 
        user, 
        status: user ? 'authenticated' : 'unauthenticated',
        error: null,
      }),

      setStatus: (status) => set({ status }),

      setError: (error) => set({ error }),

      impersonateUser: (user) => {
        const { user: currentUser, isImpersonating } = get();
        
        if (!isImpersonating && currentUser) {
          set({
            user,
            isImpersonating: true,
            originalUser: currentUser,
          });
          console.log('🎭 Impersonating user:', user.name, `(${user.role})`);
        } else {
          set({ user });
        }
      },

      stopImpersonating: () => {
        const { originalUser } = get();
        if (originalUser) {
          set({
            user: originalUser,
            isImpersonating: false,
            originalUser: null,
          });
          console.log('✅ Stopped impersonating, returned to original user');
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential auth state, not impersonation
        user: state.isImpersonating ? state.originalUser : state.user,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.status === 'authenticated';
export const selectIsImpersonating = (state: AuthState) => state.isImpersonating;
export const selectAuthStatus = (state: AuthState) => state.status;
export const selectAuthError = (state: AuthState) => state.error;

// Actions export for easier access
export const authActions = {
  setUser: useAuthStore.getState().setUser,
  setStatus: useAuthStore.getState().setStatus,
  setError: useAuthStore.getState().setError,
  impersonateUser: useAuthStore.getState().impersonateUser,
  stopImpersonating: useAuthStore.getState().stopImpersonating,
  reset: useAuthStore.getState().reset,
};
