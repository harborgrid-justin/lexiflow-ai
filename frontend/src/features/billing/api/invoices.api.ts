// Invoices API Hooks for LexiFlow AI
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Invoice,
  InvoiceFilters,
  Payment,
  BillingMetrics,
  CreateInvoiceRequest,
  SendInvoiceRequest,
  RecordPaymentRequest,
} from './billing.types';
import { timeEntriesKeys } from './timeEntries.api';

const API_BASE = '/api/billing';

// Query Keys
export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (filters: InvoiceFilters) => [...invoicesKeys.lists(), filters] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
  payments: (invoiceId: string) => [...invoicesKeys.detail(invoiceId), 'payments'] as const,
  metrics: () => ['billingMetrics'] as const,
};

// API Functions
const fetchInvoices = async (filters: InvoiceFilters): Promise<Invoice[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });

  const { data } = await axios.get<Invoice[]>(`${API_BASE}/invoices?${params}`);
  return data;
};

const fetchInvoice = async (id: string): Promise<Invoice> => {
  const { data } = await axios.get<Invoice>(`${API_BASE}/invoices/${id}`);
  return data;
};

const createInvoice = async (request: CreateInvoiceRequest): Promise<Invoice> => {
  const { data } = await axios.post<Invoice>(`${API_BASE}/invoices`, request);
  return data;
};

const updateInvoice = async ({
  id,
  ...request
}: Partial<CreateInvoiceRequest> & { id: string }): Promise<Invoice> => {
  const { data } = await axios.put<Invoice>(`${API_BASE}/invoices/${id}`, request);
  return data;
};

const deleteInvoice = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/invoices/${id}`);
};

const sendInvoice = async ({
  id,
  ...request
}: SendInvoiceRequest & { id: string }): Promise<Invoice> => {
  const { data } = await axios.post<Invoice>(`${API_BASE}/invoices/${id}/send`, request);
  return data;
};

const voidInvoice = async (id: string): Promise<Invoice> => {
  const { data } = await axios.post<Invoice>(`${API_BASE}/invoices/${id}/void`);
  return data;
};

const recordPayment = async ({
  invoiceId,
  ...request
}: RecordPaymentRequest & { invoiceId: string }): Promise<Payment> => {
  const { data } = await axios.post<Payment>(
    `${API_BASE}/invoices/${invoiceId}/payments`,
    request
  );
  return data;
};

const fetchPayments = async (invoiceId: string): Promise<Payment[]> => {
  const { data } = await axios.get<Payment[]>(`${API_BASE}/invoices/${invoiceId}/payments`);
  return data;
};

const fetchBillingMetrics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<BillingMetrics> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const { data } = await axios.get<BillingMetrics>(
    `${API_BASE}/metrics?${queryParams}`
  );
  return data;
};

const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  const { data } = await axios.get(`${API_BASE}/invoices/${id}/pdf`, {
    responseType: 'blob',
  });
  return data;
};

const sendReminder = async (id: string): Promise<void> => {
  await axios.post(`${API_BASE}/invoices/${id}/remind`);
};

// React Query Hooks

/**
 * Fetch invoices with optional filters
 */
export const useInvoices = (filters: InvoiceFilters = {}) => {
  return useQuery({
    queryKey: invoicesKeys.list(filters),
    queryFn: () => fetchInvoices(filters),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Fetch a single invoice by ID
 */
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: invoicesKeys.detail(id),
    queryFn: () => fetchInvoice(id),
    enabled: !!id,
  });
};

/**
 * Create a new invoice
 */
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      // Invalidate invoice lists
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });

      // Set the new invoice in cache
      queryClient.setQueryData(invoicesKeys.detail(newInvoice.id), newInvoice);

      // Invalidate time entries since they're now billed
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Update an existing invoice
 */
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: (updatedInvoice) => {
      // Update the specific invoice in cache
      queryClient.setQueryData(invoicesKeys.detail(updatedInvoice.id), updatedInvoice);

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Delete an invoice
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: invoicesKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Send an invoice to client
 */
export const useSendInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendInvoice,
    onSuccess: (sentInvoice) => {
      // Update the invoice in cache
      queryClient.setQueryData(invoicesKeys.detail(sentInvoice.id), sentInvoice);

      // Invalidate lists to update status
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Void an invoice
 */
export const useVoidInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voidInvoice,
    onSuccess: (voidedInvoice) => {
      queryClient.setQueryData(invoicesKeys.detail(voidedInvoice.id), voidedInvoice);
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Record a payment for an invoice
 */
export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordPayment,
    onSuccess: (_, { invoiceId }) => {
      // Invalidate the invoice to refresh balance
      queryClient.invalidateQueries({ queryKey: invoicesKeys.detail(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.payments(invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.metrics() });
    },
  });
};

/**
 * Fetch payments for an invoice
 */
export const useInvoicePayments = (invoiceId: string) => {
  return useQuery({
    queryKey: invoicesKeys.payments(invoiceId),
    queryFn: () => fetchPayments(invoiceId),
    enabled: !!invoiceId,
  });
};

/**
 * Fetch billing metrics/dashboard data
 */
export const useBillingMetrics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: [...invoicesKeys.metrics(), params],
    queryFn: () => fetchBillingMetrics(params),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Download invoice as PDF
 */
export const useDownloadInvoicePDF = () => {
  return useMutation({
    mutationFn: downloadInvoicePDF,
    onSuccess: (blob, invoiceId) => {
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Send payment reminder
 */
export const useSendReminder = () => {
  return useMutation({
    mutationFn: sendReminder,
  });
};

/**
 * Get unbilled time entries for invoice creation
 */
export const useUnbilledTimeEntries = (caseId?: string) => {
  return useQuery({
    queryKey: [...timeEntriesKeys.lists(), { status: 'approved', invoiceId: null, caseId }],
    queryFn: () =>
      axios
        .get<any[]>(`${API_BASE}/time-entries/unbilled`, {
          params: { caseId },
        })
        .then((res) => res.data),
    enabled: !!caseId,
  });
};
