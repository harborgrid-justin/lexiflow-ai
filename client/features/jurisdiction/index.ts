/**
 * Jurisdiction Feature Module
 *
 * Provides jurisdiction and venue management functionality.
 *
 * @module features/jurisdiction
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
  JurisdictionFederal,
  JurisdictionState,
  JurisdictionRegulatory,
  JurisdictionInternational,
  JurisdictionArbitration,
  JurisdictionLocalRules,
  JurisdictionGeoMap
} from '@/components/jurisdiction';
