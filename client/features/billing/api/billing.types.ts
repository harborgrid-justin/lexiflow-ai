/**
 * Billing Module Types
 * Domain-specific types for billing feature
 */

export interface BillingFilters {
  caseId?: string;
  userId?: string;
  status?: 'Unbilled' | 'Billed' | 'All';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface BillingSummary {
  totalBilled: number;
  totalUnbilled: number;
  totalHours: number;
  billableHours: number;
  averageRate: number;
  revenueByMonth: MonthlyRevenue[];
  revenueByClient: ClientRevenue[];
  outstandingInvoices: number;
  collectionRate: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  hours: number;
}

export interface ClientRevenue {
  clientId: string;
  clientName: string;
  totalBilled: number;
  totalHours: number;
  avgRate: number;
}

export interface Invoice {
  id: string;
  caseId: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  lineItems: InvoiceLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  timeEntryId?: string;
}

export interface BillingRate {
  id: string;
  userId: string;
  rateType: 'Hourly' | 'Fixed' | 'Blended';
  amount: number;
  effectiveDate: string;
  expirationDate?: string;
  clientId?: string;
  matterType?: string;
}

export type BillingViewMode = 'list' | 'summary' | 'invoices' | 'rates';
