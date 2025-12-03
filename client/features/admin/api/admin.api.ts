/**
 * Admin API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  enzymeUsersService, 
  enzymeOrganizationsService, 
  enzymeGroupsService, 
  enzymeAuditService 
} from '../../../enzyme/services/misc.service';
import type { User, Organization, Group } from '@/types';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  organizations: () => [...adminKeys.all, 'organizations'] as const,
  organization: (id: string) => [...adminKeys.organizations(), id] as const,
  groups: () => [...adminKeys.all, 'groups'] as const,
  group: (id: string) => [...adminKeys.groups(), id] as const,
  audit: () => [...adminKeys.all, 'audit'] as const,
  permissions: () => [...adminKeys.all, 'permissions'] as const,
};

// User queries
export function useUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => enzymeUsersService.getAll() as Promise<User[]>,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => enzymeUsersService.getById(id) as Promise<User>,
    enabled: !!id,
  });
}

// Organization queries
export function useOrganizations() {
  return useQuery({
    queryKey: adminKeys.organizations(),
    queryFn: () => enzymeOrganizationsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: adminKeys.organization(id),
    queryFn: () => enzymeOrganizationsService.getById(id),
    enabled: !!id,
  });
}

// Group queries
export function useGroups() {
  return useQuery({
    queryKey: adminKeys.groups(),
    queryFn: () => enzymeGroupsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

// Audit queries
export function useAuditLogs(filters?: { userId?: string; action?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: [...adminKeys.audit(), filters],
    queryFn: () => enzymeAuditService.getLogs(),
    staleTime: 1 * 60 * 1000, // 1 minute for audit logs
  });
}

// Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      enzymeUsersService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enzymeUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Organization>) => enzymeOrganizationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations() });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) =>
      enzymeOrganizationsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organization(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations() });
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Group>) => enzymeGroupsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.groups() });
    },
  });
}
