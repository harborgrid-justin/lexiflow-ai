/**
 * Admin Module Types
 */

export interface AdminFilters {
  role?: string;
  status?: 'active' | 'inactive' | 'all';
  organization?: string;
  search?: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizationId?: string;
  groupIds?: string[];
  status?: 'active' | 'inactive';
}

export interface OrganizationFormData {
  name: string;
  type: 'LawFirm' | 'Corporate' | 'Government' | 'Court' | 'Vendor';
  domain?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: 'Active' | 'Inactive';
}

export interface GroupFormData {
  name: string;
  description?: string;
  orgId: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'cases' | 'documents' | 'billing' | 'admin' | 'system';
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export type AdminViewMode = 'users' | 'organizations' | 'groups' | 'roles' | 'audit';
