/**
 * LexiFlow AI Component Library
 * Composite components and specialized UI elements
 * 
 * NOTE: Feature pages have been migrated to @/features/* modules.
 * Import from feature modules for the latest SOA architecture:
 * - @/features/dashboard
 * - @/features/billing
 * - @/features/calendar
 * - @/features/clients
 * - @/features/knowledge
 * - @/features/evidence
 * - @/features/discovery
 * - @/features/jurisdiction
 * 
 * For UI components, use @/shared/ui or @/components/common.
 * 
 * Legacy components (Dashboard.tsx, BillingDashboard.tsx, etc.) remain
 * for backward compatibility but will be deprecated in future versions.
 */

// Export common UI components
export * from './common';

// Export icons
export * from './icons';

// Composite Components
export { SearchInput } from './SearchInput';
export type { SearchInputProps, SearchSuggestion } from './SearchInput';

export { DataTable } from './DataTable';
export type { DataTableProps, DataTableColumn } from './DataTable';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps } from './ErrorBoundary';

export { LoadingScreen } from './LoadingScreen';
export type { LoadingScreenProps } from './LoadingScreen';

export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';

// Legacy component exports (prefer @/features/* imports for new code)
export { Dashboard } from './Dashboard';
export { BillingDashboard } from './BillingDashboard';
export { CalendarView } from './CalendarView'; // Note: Different from ui/Calendar component
export { ClientCRM } from './ClientCRM';
export { KnowledgeBase } from './KnowledgeBase';
export { ClauseLibrary } from './ClauseLibrary';
export { EvidenceVault } from './EvidenceVault';
export { DiscoveryPlatform } from './DiscoveryPlatform';
export { JurisdictionManager } from './JurisdictionManager';
export { MasterWorkflow } from './MasterWorkflow';
export { ComplianceDashboard } from './ComplianceDashboard';
export { AdminPanel } from './AdminPanel';
export { AnalyticsDashboard } from './AnalyticsDashboard';
export { ResearchTool } from './ResearchTool';
export { SecureMessenger } from './SecureMessenger';
export { UserProfile } from './UserProfile';
export { DocumentManager } from './DocumentManager';
export { CaseManagement } from './CaseManagement';
