/**
 * Compliance Feature Module
 */

// API Hooks
export {
  complianceKeys,
  useComplianceDashboard,
  useConflictChecks,
  useEthicalWalls,
  useEthicalWall,
  useRunConflictCheck,
  useCreateEthicalWall,
  useUpdateEthicalWall,
} from './api/compliance.api';

// Feature Hooks (Enzyme-based)
export * from './hooks';

// Types
export type {
  ComplianceDashboard,
  ComplianceActivity,
  ComplianceAlert,
  ConflictCheckResult,
  ConflictDetail,
  EthicalWallFormData,
  RiskAssessment,
  RiskFactor,
  ComplianceViewMode,
} from './api/compliance.types';

// Store
export { useComplianceStore } from './store/compliance.store';

// Pages
export { ComplianceDashboardPage } from './pages/ComplianceDashboardPage';
