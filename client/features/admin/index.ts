/**
 * Admin Feature Module
 */

// API Hooks
export {
  adminKeys,
  useUsers,
  useUser,
  useOrganizations,
  useOrganization,
  useGroups,
  useAuditLogs,
  useUpdateUser,
  useDeleteUser,
  useCreateOrganization,
  useUpdateOrganization,
  useCreateGroup,
} from './api/admin.api';

// Feature Hooks (Enzyme-based)
export * from './hooks';

// Types
export type {
  AdminFilters,
  UserFormData,
  OrganizationFormData,
  GroupFormData,
  Permission,
  RoleTemplate,
  AdminViewMode,
} from './api/admin.types';

// Store
export { useAdminStore } from './store/admin.store';

// Pages
export { AdminPanelPage } from './pages/AdminPanelPage';
