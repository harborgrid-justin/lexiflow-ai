import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';

// Generic hook for API data fetching
export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Specific hooks for common operations
export function useCases() {
  return useApi(() => ApiService.getCases());
}

export function useCase(id: string) {
  return useApi(() => ApiService.getCase(id), [id]);
}

export function useUsers() {
  return useApi(() => ApiService.getUsers());
}

export function useDocuments() {
  return useApi(() => ApiService.getDocuments());
}

export function useEvidence() {
  return useApi(() => ApiService.getEvidence());
}

export function useMotions() {
  return useApi(() => ApiService.getMotions());
}

export function useTasks() {
  return useApi(() => ApiService.getTasks());
}

export function useDiscovery() {
  return useApi(() => ApiService.getDiscovery());
}

export function useClients() {
  return useApi(() => ApiService.getClients());
}

export function useOrganizations() {
  return useApi(() => ApiService.getOrganizations());
}

export function useCaseDocuments(caseId: string) {
  return useApi(() => ApiService.getCaseDocuments(caseId), [caseId]);
}

export function useCaseTeam(caseId: string) {
  return useApi(() => ApiService.getCaseTeam(caseId), [caseId]);
}

export function useCaseEvidence(caseId: string) {
  return useApi(() => ApiService.getCaseEvidence(caseId), [caseId]);
}

export function useCaseMotions(caseId: string) {
  return useApi(() => ApiService.getCaseMotions(caseId), [caseId]);
}

export function useCaseBilling(caseId: string) {
  return useApi(() => ApiService.getCaseBilling(caseId), [caseId]);
}

// Hook for mutations with loading state
export function useMutation<T, P>(mutationFn: (params: P) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await ApiService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // User not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      ApiService.setAuthToken(response.access_token);
      setUser(response.user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    ApiService.clearAuthToken();
    setUser(null);
  };

  return { user, loading, login, logout };
}