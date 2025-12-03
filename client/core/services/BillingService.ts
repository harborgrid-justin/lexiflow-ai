/**
 * Billing Service Implementation
 * 
 * Handles time tracking, billing operations, invoice generation,
 * and financial reporting.
 */

import { BaseService } from './BaseService';
import { IBillingService, QueryOptions, ServiceResponse } from '../contracts';
import { ApiService } from '../../services/apiService';
import { TimeEntry } from '../../types';

export class BillingService extends BaseService<TimeEntry> implements IBillingService {
  constructor() {
    super('BillingService');
  }

  async getAll(options?: QueryOptions): Promise<ServiceResponse<TimeEntry[]>> {
    return this.executeWithErrorHandling(async () => {
      const timeEntries = await ApiService.billing.timeEntries.getAll(
        options?.filter?.caseId, 
        options?.filter?.userId
      );
      return timeEntries || [];
    }, 'Failed to retrieve time entries');
  }

  async getById(id: string): Promise<ServiceResponse<TimeEntry>> {
    return this.executeWithErrorHandling(async () => {
      const timeEntry = await ApiService.billing.timeEntries.getById(id);
      if (!timeEntry) {
        throw new Error(`Time entry with ID ${id} not found`);
      }
      return timeEntry;
    }, `Failed to retrieve time entry ${id}`);
  }

  async create(entity: Partial<TimeEntry>): Promise<ServiceResponse<TimeEntry>> {
    const validation = this.validate(entity);
    if (!validation.isValid) {
      return {
        data: null as TimeEntry,
        success: false,
        message: 'Validation failed',
        errors: validation.errors.map(e => e.message)
      };
    }

    return this.executeWithErrorHandling(async () => {
      const timeEntry = await ApiService.billing.timeEntries.create(entity);
      return timeEntry;
    }, 'Failed to create time entry');
  }

  async update(id: string, entity: Partial<TimeEntry>): Promise<ServiceResponse<TimeEntry>> {
    return this.executeWithErrorHandling(async () => {
      const updatedEntry = await ApiService.billing.timeEntries.update(id, entity);
      return updatedEntry;
    }, `Failed to update time entry ${id}`);
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.billing.timeEntries.delete(id);
    }, `Failed to delete time entry ${id}`);
  }

  // IBillingService specific methods
  async createTimeEntry(entry: Partial<TimeEntry>): Promise<ServiceResponse<TimeEntry>> {
    return this.create(entry);
  }

  async getBillingByCase(caseId: string): Promise<ServiceResponse<TimeEntry[]>> {
    return this.executeWithErrorHandling(async () => {
      const timeEntries = await ApiService.billing.timeEntries.getAll(caseId);
      return timeEntries || [];
    }, 'Failed to retrieve case billing');
  }

  async getBillingByClient(clientId: string): Promise<ServiceResponse<TimeEntry[]>> {
    return this.executeWithErrorHandling(async () => {
      // Get all time entries and filter by cases that belong to the client
      // TODO: Add server-side filtering by client via case relationships
      const timeEntries = await ApiService.billing.timeEntries.getAll();
      const cases = await ApiService.cases.getAll();
      
      const clientCases = cases.filter(caseItem => 
        caseItem.client === clientId || caseItem.clientName === clientId
      );
      const clientCaseIds = clientCases.map(caseItem => caseItem.id);
      
      return (timeEntries || []).filter(entry => 
        clientCaseIds.includes(entry.caseId)
      );
    }, 'Failed to retrieve client billing');
  }

  async generateInvoice(clientId: string, entries: string[]): Promise<ServiceResponse<any>> {
    return this.executeWithErrorHandling(async () => {
      const invoiceData = {
        clientId,
        timeEntryIds: entries,
        generatedAt: new Date().toISOString()
      };
      
      // For now, return a placeholder invoice
      // TODO: Implement actual invoice generation API
      const invoice = {
        id: `inv-${Date.now()}`,
        ...invoiceData,
        totalAmount: 0,
        status: 'draft'
      };
      
      return invoice;
    }, 'Failed to generate invoice');
  }

  async getBillingStats(): Promise<ServiceResponse<any>> {
    return this.executeWithErrorHandling(async () => {
      const stats = await ApiService.billing.getStats();
      return stats || {
        totalRevenue: 0,
        totalHours: 0,
        averageRate: 0,
        topClients: []
      };
    }, 'Failed to retrieve billing statistics');
  }
}