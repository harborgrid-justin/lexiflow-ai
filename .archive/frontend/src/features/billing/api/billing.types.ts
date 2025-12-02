// Billing & Time Tracking Types for LexiFlow AI

export interface TimeEntry {
  id: string;
  caseId: string;
  caseName?: string;
  userId: string;
  userName?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number; // in minutes
  activityType: ActivityType;
  description: string;
  isBillable: boolean;
  rate: number; // hourly rate in dollars
  amount: number; // calculated: (duration/60) * rate
  status: 'draft' | 'submitted' | 'approved' | 'billed' | 'written-off';
  invoiceId?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'research'
  | 'drafting'
  | 'review'
  | 'correspondence'
  | 'phone_call'
  | 'meeting'
  | 'court_appearance'
  | 'travel'
  | 'admin'
  | 'consultation'
  | 'negotiation'
  | 'filing'
  | 'discovery'
  | 'deposition'
  | 'trial_prep'
  | 'other';

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  research: 'Legal Research',
  drafting: 'Document Drafting',
  review: 'Document Review',
  correspondence: 'Correspondence',
  phone_call: 'Phone Call',
  meeting: 'Meeting',
  court_appearance: 'Court Appearance',
  travel: 'Travel',
  admin: 'Administrative',
  consultation: 'Client Consultation',
  negotiation: 'Negotiation',
  filing: 'Filing',
  discovery: 'Discovery',
  deposition: 'Deposition',
  trial_prep: 'Trial Preparation',
  other: 'Other',
};

export interface TimeEntryFilters {
  caseId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: TimeEntry['status'];
  isBillable?: boolean;
  activityType?: ActivityType;
  search?: string;
}

export interface TimeEntrySummary {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  totalAmount: number;
  entriesCount: number;
  byActivityType: Record<ActivityType, {
    hours: number;
    amount: number;
    count: number;
  }>;
}

export interface RunningTimer {
  id?: string;
  caseId: string;
  caseName?: string;
  activityType: ActivityType;
  description: string;
  startTime: string;
  elapsedSeconds: number;
  rate: number;
  isBillable: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  caseId: string;
  caseName?: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  sentDate?: string;
  paidDate?: string;
  viewedDate?: string;

  // Line items
  timeEntries: TimeEntry[];
  expenses: ExpenseLineItem[];
  discounts: DiscountLineItem[];

  // Calculations
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balance: number;

  // Customization
  header?: string;
  footer?: string;
  notes?: string;
  terms?: string;
  groupBy?: 'date' | 'activity' | 'attorney' | 'none';
  showDetailedDescriptions?: boolean;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'void'
  | 'written-off';

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  partial: 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  void: 'Void',
  'written-off': 'Written Off',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'gray',
  sent: 'blue',
  viewed: 'cyan',
  partial: 'yellow',
  paid: 'green',
  overdue: 'red',
  void: 'gray',
  'written-off': 'gray',
};

export interface ExpenseLineItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  quantity: number;
  isBillable: boolean;
}

export interface DiscountLineItem {
  id: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type PaymentMethod =
  | 'cash'
  | 'check'
  | 'credit_card'
  | 'bank_transfer'
  | 'ach'
  | 'wire'
  | 'other';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  check: 'Check',
  credit_card: 'Credit Card',
  bank_transfer: 'Bank Transfer',
  ach: 'ACH',
  wire: 'Wire Transfer',
  other: 'Other',
};

export interface InvoiceFilters {
  caseId?: string;
  clientId?: string;
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface BillingRate {
  id: string;
  userId?: string;
  userRole?: string;
  caseId?: string;
  clientId?: string;
  activityType?: ActivityType;
  rate: number;
  effectiveDate: string;
  endDate?: string;
  isDefault?: boolean;
}

export interface BillingMetrics {
  totalBillableHours: number;
  totalRevenue: number;
  outstandingReceivables: number;
  averageRealizationRate: number;
  billableVsNonBillable: {
    billable: number;
    nonBillable: number;
  };
  revenueByPracticeArea: {
    practiceArea: string;
    revenue: number;
    hours: number;
  }[];
  topMattersByRevenue: {
    caseId: string;
    caseName: string;
    revenue: number;
    hours: number;
  }[];
  agingReceivables: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    days90Plus: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
    hours: number;
  }[];
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  header?: string;
  footer?: string;
  terms?: string;
  groupBy: Invoice['groupBy'];
  showDetailedDescriptions: boolean;
  taxRate: number;
  isDefault?: boolean;
}

// API Request/Response types
export interface CreateTimeEntryRequest {
  caseId: string;
  date: string;
  duration: number;
  activityType: ActivityType;
  description: string;
  isBillable?: boolean;
  rate?: number;
  notes?: string;
}

export interface UpdateTimeEntryRequest extends Partial<CreateTimeEntryRequest> {
  status?: TimeEntry['status'];
}

export interface StartTimerRequest {
  caseId: string;
  activityType: ActivityType;
  description: string;
  rate: number;
  isBillable?: boolean;
}

export interface CreateInvoiceRequest {
  caseId: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  timeEntryIds: string[];
  expenseIds?: string[];
  discounts?: Omit<DiscountLineItem, 'id'>[];
  header?: string;
  footer?: string;
  notes?: string;
  terms?: string;
  taxRate?: number;
  groupBy?: Invoice['groupBy'];
  showDetailedDescriptions?: boolean;
}

export interface SendInvoiceRequest {
  emailTo?: string;
  subject?: string;
  message?: string;
  sendCopy?: boolean;
}

export interface RecordPaymentRequest {
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

// Export formats
export type ExportFormat = 'csv' | 'ledes' | 'pdf' | 'excel';

export interface LEDESFormat {
  version: '1998B' | '1998BI';
  // LEDES billing format specifications
}
