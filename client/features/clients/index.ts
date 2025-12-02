/**
 * Clients Feature Module
 * Public API exports for the clients feature
 */

// API Hooks
export {
  clientKeys,
  useClients,
  useClient,
  useClientSummary,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from './api/clients.api';

// Types
export type {
  ClientFilters,
  ClientSummary,
  ClientMatter,
  ClientContact,
  ClientNote,
  ClientViewMode,
} from './api/clients.types';

// Store
export { useClientsStore } from './store/clients.store';

// Hooks
export { useClientCRM } from './hooks';

// Components
export { ClientIntakeModal, ClientPortalModal } from './components';

// Pages
export { ClientCRMPage } from './pages/ClientCRMPage';
