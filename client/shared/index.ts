/**
 * Shared Module
 * Common utilities, components, and hooks used across feature modules
 */

// UI Components
export * from './ui';

// Shared Hooks
export * from './hooks';

// Types
export type { 
  Case,
  User,
  UserRole,
  LegalDocument,
  WorkflowTask,
  WorkflowStage,
  TimeEntry,
  EvidenceItem,
  Motion,
  DiscoveryRequest,
  Party,
  Organization,
  Client,
} from '@/types';
