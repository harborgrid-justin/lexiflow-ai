/**
 * useCommonData Hook - Common Data Access
 *
 * Provides simple hooks for fetching common entities like Users, Tasks, Clients, etc.
 * Replaces the legacy useApi specific hooks.
 */

import { useApiRequest } from '../services/hooks';
import type { 
  User, 
  Task, 
  Client, 
  Organization, 
  DiscoveryRequest, 
  Motion,
  EvidenceItem
} from '../../types';

/**
 * Fetch all users
 */
export function useUsers() {
  return useApiRequest<User[]>({
    endpoint: '/users',
    options: { staleTime: 5 * 60 * 1000 }
  });
}

/**
 * Fetch all tasks
 */
export function useTasks() {
  return useApiRequest<Task[]>({
    endpoint: '/tasks',
    options: { staleTime: 60 * 1000 }
  });
}

/**
 * Fetch all clients
 */
export function useClients() {
  return useApiRequest<Client[]>({
    endpoint: '/clients',
    options: { staleTime: 5 * 60 * 1000 }
  });
}

/**
 * Fetch all organizations
 */
export function useOrganizations() {
  return useApiRequest<Organization[]>({
    endpoint: '/organizations',
    options: { staleTime: 60 * 60 * 1000 }
  });
}

/**
 * Fetch discovery items
 */
export function useDiscovery() {
  return useApiRequest<DiscoveryRequest[]>({
    endpoint: '/discovery',
    options: { staleTime: 2 * 60 * 1000 }
  });
}

/**
 * Fetch motions
 */
export function useMotions() {
  return useApiRequest<Motion[]>({
    endpoint: '/motions',
    options: { staleTime: 5 * 60 * 1000 }
  });
}

/**
 * Fetch evidence
 */
export function useEvidence() {
  return useApiRequest<EvidenceItem[]>({
    endpoint: '/evidence',
    options: { staleTime: 5 * 60 * 1000 }
  });
}
