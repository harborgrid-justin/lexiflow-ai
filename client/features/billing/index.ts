/**
 * Billing Feature Module
 * Public API exports for the billing feature
 */

// API Hooks
export {
  billingKeys,
  useTimeEntries,
  useTimeEntry,
  useBillingSummary,
  useCreateTimeEntry,
  useUpdateTimeEntry,
  useDeleteTimeEntry,
} from './api/billing.api';

// Types
export type {
  BillingFilters,
  BillingSummary,
  MonthlyRevenue,
  ClientRevenue,
  Invoice,
  InvoiceLineItem,
  BillingRate,
  BillingViewMode,
} from './api/billing.types';

// Store
export { useBillingStore } from './store/billing.store';

// Hooks
export { useBillingDashboard, useTimeEntryModal } from './hooks';

// Components
export { TimeEntryModal } from './components';

// Pages
export { BillingDashboardPage } from './pages/BillingDashboardPage';

