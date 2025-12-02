/**
 * Evidence Feature Module
 *
 * Provides evidence vault, chain of custody, and forensic asset management.
 *
 * @module features/evidence
 */

// API
export * from './api';

// Hooks
export * from './hooks';

// Pages
export * from './pages';

// Store
export * from './store';

// Re-export components from legacy location (to be migrated)
export {
  EvidenceInventory,
  EvidenceDetail,
  EvidenceIntake,
  EvidenceDashboard,
  EvidenceCustodyLog,
  EvidenceOverview,
  EvidenceChainOfCustody,
  EvidenceAdmissibility,
  EvidenceForensics,
  EvidenceStructure
} from '@/components/evidence';
