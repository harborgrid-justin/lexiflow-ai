/**
 * Shared Hooks Module
 * 
 * Contains cross-cutting hooks that are used across multiple features.
 * These hooks are not specific to any single domain and provide
 * reusable functionality throughout the application.
 * 
 * Categories:
 * - API: Core data fetching primitives
 * - DOM: Safe DOM manipulation utilities
 * - UI: Confirmation, modals, and user interaction
 * 
 * @module shared/hooks
 */

// Core API Hooks
export {
  useApi,
  useMutation,
  useAuth,
  useCases,
  useCase,
  useUsers,
  useDocuments,
  useEvidence,
  useMotions,
  useTasks,
  useDiscovery,
  useClients,
  useOrganizations,
  useCaseDocuments,
  useCaseTeam,
  useCaseEvidence,
  useCaseMotions,
  useCaseBilling,
} from './useApi';
export type { ApiErrorState } from './useApi';

// Safe DOM Hooks
export {
  useAutoFocus,
  useClickOutside,
  useEscapeKey,
  useScrollIntoView,
  useWindowResize,
  useIntersectionObserver,
  useLocalStorage,
} from './useSafeDOM';

// UI Hooks
export { useConfirmation } from './useConfirmation';
