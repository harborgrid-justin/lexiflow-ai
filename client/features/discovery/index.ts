/**
 * Discovery Feature Module
 *
 * Provides discovery request management, legal holds, and FRCP compliance.
 *
 * @module features/discovery
 */

// API
export * from './api';

// Hooks
export * from './hooks';

// Pages
export * from './pages';

// Store
export * from './store';

// Re-export components from legacy location
export {
  DiscoveryDashboard,
  DiscoveryRequests,
  PrivilegeLog,
  LegalHolds,
  DiscoveryDocumentViewer,
  DiscoveryResponse,
  DiscoveryProduction
} from '@/components/discovery';
