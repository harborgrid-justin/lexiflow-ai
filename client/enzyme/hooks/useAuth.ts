/**
 * useAuth Hook - ENZYME MIGRATION COMPLETE
 *
 * Authentication hook with user state management using Enzyme patterns.
 */

import { useEffect } from 'react';
import { User } from '../../types';
import {
  useIsMounted,
  useLatestCallback,
  useSafeState,
} from '../index';
import { enzymeClient } from '../services/client';

export function useAuth() {
  const isMounted = useIsMounted();
  const [user, setUser] = useSafeState<User | null>(null);
  const [loading, setLoading] = useSafeState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // We use enzymeClient to fetch current user
        // It automatically attaches the token from localStorage
        const currentUser = await enzymeClient.get<User>('/auth/me');
        if (!isMounted()) return;
        setUser(currentUser.data);
      } catch (_err) {
        // User not authenticated
        if (!isMounted()) return;
        setUser(null);
      }

      // Always set loading to false, regardless of success/failure
      if (isMounted()) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isMounted, setUser, setLoading]);

  const login = useLatestCallback(async (email: string, password: string) => {
    try {
      const response = await enzymeClient.post<{ access_token: string; user: User }>('/auth/login', {
        body: { email, password }
      });
      
      if (!isMounted()) return false;

      const { access_token, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('authToken', access_token);
      
      setUser(userData);
      return true;
    } catch (_err) {
      return false;
    }
  });

  const logout = useLatestCallback(async () => {
    try {
      await enzymeClient.post('/auth/logout');
    } catch (_err) {
      // Ignore logout errors
    }
    
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    if (!isMounted()) return;
    setUser(null);
  });

  return { user, loading, login, logout };
}
