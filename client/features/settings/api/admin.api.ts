// Admin API with TanStack Query hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  AuditLogEntry,
  AuditLogFilters,
  AuditLogResponse,
} from './settings.types';

// API base URL
const API_BASE = '/api';

// Helper function for API calls
const apiCall = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  roles: () => [...adminKeys.all, 'roles'] as const,
  role: (id: string) => [...adminKeys.roles(), id] as const,
  auditLog: (filters?: AuditLogFilters) => [...adminKeys.all, 'audit', filters] as const,
};

// ============================================================================
// User Management Hooks
// ============================================================================

/**
 * Fetch all users (Admin only)
 */
export const useUsers = () => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => apiCall<User[]>('/admin/users'),
  });
};

/**
 * Fetch single user (Admin only)
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => apiCall<User>(`/admin/users/${id}`),
    enabled: !!id,
  });
};

/**
 * Create/Invite new user (Admin only)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      apiCall<User>('/admin/users/invite', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

/**
 * Update user (Admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      apiCall<User>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(adminKeys.user(data.id), data);
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

/**
 * Delete/Deactivate user (Admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiCall<{ message: string }>(`/admin/users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

/**
 * Resend invitation (Admin only)
 */
export const useResendInvitation = () => {
  return useMutation({
    mutationFn: (userId: string) =>
      apiCall<{ message: string }>(`/admin/users/${userId}/resend-invitation`, {
        method: 'POST',
      }),
  });
};

/**
 * Reset user password (Admin only)
 */
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (userId: string) =>
      apiCall<{ temporaryPassword: string }>(`/admin/users/${userId}/reset-password`, {
        method: 'POST',
      }),
  });
};

// ============================================================================
// Role Management Hooks
// ============================================================================

/**
 * Fetch all roles (Admin only)
 */
export const useRoles = () => {
  return useQuery({
    queryKey: adminKeys.roles(),
    queryFn: () => apiCall<Role[]>('/admin/roles'),
  });
};

/**
 * Fetch single role (Admin only)
 */
export const useRole = (id: string) => {
  return useQuery({
    queryKey: adminKeys.role(id),
    queryFn: () => apiCall<Role>(`/admin/roles/${id}`),
    enabled: !!id,
  });
};

/**
 * Create role (Admin only)
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleInput) =>
      apiCall<Role>('/admin/roles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
    },
  });
};

/**
 * Update role (Admin only)
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      apiCall<Role>(`/admin/roles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(adminKeys.role(data.id), data);
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
    },
  });
};

/**
 * Delete role (Admin only)
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiCall<{ message: string }>(`/admin/roles/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
    },
  });
};

// ============================================================================
// Audit Log Hooks
// ============================================================================

/**
 * Fetch audit log (Admin only)
 */
export const useAuditLog = (filters?: AuditLogFilters) => {
  return useQuery({
    queryKey: adminKeys.auditLog(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.resource) params.append('resource', filters.resource);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      return apiCall<AuditLogResponse>(
        `/admin/audit-log${queryString ? `?${queryString}` : ''}`
      );
    },
  });
};

/**
 * Export audit log (Admin only)
 */
export const useExportAuditLog = () => {
  return useMutation({
    mutationFn: async (filters?: AuditLogFilters) => {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.resource) params.append('resource', filters.resource);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const response = await fetch(
        `${API_BASE}/admin/audit-log/export${queryString ? `?${queryString}` : ''}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    },
  });
};

/**
 * Get organization statistics (Admin only)
 */
export const useOrganizationStats = () => {
  return useQuery({
    queryKey: [...adminKeys.all, 'stats'],
    queryFn: () =>
      apiCall<{
        totalUsers: number;
        activeUsers: number;
        totalCases: number;
        activeCases: number;
        totalDocuments: number;
        storageUsed: number;
        storageLimit: number;
      }>('/admin/stats'),
  });
};
