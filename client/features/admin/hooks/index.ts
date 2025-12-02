/**
 * Admin Hooks Index
 * 
 * Re-exports admin hooks from the feature module.
 * 
 * @module features/admin/hooks
 */

// New SOA hooks
export { useAdminPanel, type AdminTab } from './useAdminPanel';

// Re-export legacy for backward compatibility  
export { useUserProfile } from '@/.archive/hooks/useUserProfile';
