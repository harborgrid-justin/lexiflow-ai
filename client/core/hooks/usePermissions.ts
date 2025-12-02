/**
 * Permissions Hook
 * Centralized permission checking
 */

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

// Role-based permission matrix
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Administrator': [
    'cases.view', 'cases.create', 'cases.edit', 'cases.delete',
    'documents.view', 'documents.create', 'documents.edit', 'documents.delete',
    'billing.view', 'billing.create', 'billing.edit', 'billing.approve',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'admin.access', 'admin.settings', 'admin.audit',
    'analytics.view', 'analytics.export',
    'compliance.view', 'compliance.manage',
  ],
  'Senior Partner': [
    'cases.view', 'cases.create', 'cases.edit', 'cases.delete',
    'documents.view', 'documents.create', 'documents.edit', 'documents.delete',
    'billing.view', 'billing.create', 'billing.edit', 'billing.approve',
    'users.view',
    'analytics.view', 'analytics.export',
    'compliance.view', 'compliance.manage',
  ],
  'Partner': [
    'cases.view', 'cases.create', 'cases.edit',
    'documents.view', 'documents.create', 'documents.edit',
    'billing.view', 'billing.create', 'billing.edit',
    'analytics.view',
    'compliance.view',
  ],
  'Associate': [
    'cases.view', 'cases.create', 'cases.edit',
    'documents.view', 'documents.create', 'documents.edit',
    'billing.view', 'billing.create',
  ],
  'Attorney': [
    'cases.view', 'cases.create', 'cases.edit',
    'documents.view', 'documents.create', 'documents.edit',
    'billing.view', 'billing.create',
  ],
  'Paralegal': [
    'cases.view',
    'documents.view', 'documents.create', 'documents.edit',
    'billing.view',
  ],
  'Client User': [
    'cases.view',
    'documents.view',
    'billing.view',
  ],
  'Guest': [
    'cases.view',
    'documents.view',
  ],
};

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      return permissions.includes(permission);
    };
  }, [permissions]);

  const hasAnyPermission = useMemo(() => {
    return (requiredPermissions: string[]): boolean => {
      return requiredPermissions.some((p) => permissions.includes(p));
    };
  }, [permissions]);

  const hasAllPermissions = useMemo(() => {
    return (requiredPermissions: string[]): boolean => {
      return requiredPermissions.every((p) => permissions.includes(p));
    };
  }, [permissions]);

  const hasRole = useMemo(() => {
    return (roles: UserRole[]): boolean => {
      return user ? roles.includes(user.role as UserRole) : false;
    };
  }, [user]);

  const isAdmin = useMemo(() => {
    return user?.role === 'Administrator';
  }, [user?.role]);

  const canManageCases = useMemo(() => {
    return hasAnyPermission(['cases.create', 'cases.edit', 'cases.delete']);
  }, [hasAnyPermission]);

  const canManageDocuments = useMemo(() => {
    return hasAnyPermission(['documents.create', 'documents.edit', 'documents.delete']);
  }, [hasAnyPermission]);

  const canManageBilling = useMemo(() => {
    return hasAnyPermission(['billing.create', 'billing.edit', 'billing.approve']);
  }, [hasAnyPermission]);

  const canAccessAdmin = useMemo(() => {
    return hasPermission('admin.access');
  }, [hasPermission]);

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    canManageCases,
    canManageDocuments,
    canManageBilling,
    canAccessAdmin,
  };
}
