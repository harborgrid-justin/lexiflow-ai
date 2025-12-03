/**
 * Case Service Implementation
 * 
 * Domain service for case management that implements ICaseService contract.
 * Wraps the existing API service with standardized SOA interfaces.
 */

import { BaseService } from './BaseService';
import { ICaseService, QueryOptions, ServiceResponse } from '../contracts';
import { ApiService } from '../../services/apiService';
import type { Case, Document, Evidence, Task } from '../../types';

export class CaseService extends BaseService<Case> implements ICaseService {
  constructor() {
    super('CaseService');
  }

  async getAll(options?: QueryOptions): Promise<ServiceResponse<Case[]>> {
    return this.executeWithErrorHandling(async () => {
      const cases = await ApiService.cases.getAll(options?.filter?.orgId);
      return cases || [];
    }, 'Failed to retrieve cases');
  }

  async getById(id: string): Promise<ServiceResponse<Case>> {
    return this.executeWithErrorHandling(async () => {
      const caseData = await ApiService.cases.getById(id);
      if (!caseData) {
        throw new Error(`Case with ID ${id} not found`);
      }
      return caseData;
    }, `Failed to retrieve case ${id}`);
  }

  async create(entity: Partial<Case>): Promise<ServiceResponse<Case>> {
    const validation = this.validate(entity);
    if (!validation.isValid) {
      return {
        data: null as Case,
        success: false,
        message: 'Validation failed',
        errors: validation.errors.map(e => e.message)
      };
    }

    return this.executeWithErrorHandling(async () => {
      const newCase = await ApiService.cases.create(entity);
      return newCase;
    }, 'Failed to create case');
  }

  async update(id: string, entity: Partial<Case>): Promise<ServiceResponse<Case>> {
    return this.executeWithErrorHandling(async () => {
      const updatedCase = await ApiService.cases.update(id, entity);
      return updatedCase;
    }, `Failed to update case ${id}`);
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.cases.delete(id);
    }, `Failed to delete case ${id}`);
  }

  // ICaseService specific methods
  async getCasesByClient(clientId: string): Promise<ServiceResponse<Case[]>> {
    return this.executeWithErrorHandling(async () => {
      const cases = await ApiService.cases.getAll(); // Filter by clientId
      return cases?.filter(c => c.clientId === clientId) || [];
    }, `Failed to retrieve cases for client ${clientId}`);
  }

  async getCasesByStatus(status: string): Promise<ServiceResponse<Case[]>> {
    return this.executeWithErrorHandling(async () => {
      const cases = await ApiService.cases.getAll();
      return cases?.filter(c => c.status === status) || [];
    }, `Failed to retrieve cases with status ${status}`);
  }

  async updateCaseStatus(caseId: string, status: string): Promise<ServiceResponse<Case>> {
    return this.executeWithErrorHandling(async () => {
      const updatedCase = await ApiService.cases.update(caseId, { status });
      return updatedCase;
    }, `Failed to update case status for ${caseId}`);
  }

  async assignCounsel(caseId: string, userId: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.cases.update(caseId, { assignedCounsel: [userId] });
    }, `Failed to assign counsel to case ${caseId}`);
  }

  async getCaseDocuments(caseId: string): Promise<ServiceResponse<Document[]>> {
    return this.executeWithErrorHandling(async () => {
      const documents = await ApiService.documents.getByCaseId(caseId);
      return documents || [];
    }, `Failed to retrieve documents for case ${caseId}`);
  }

  async getCaseEvidence(caseId: string): Promise<ServiceResponse<Evidence[]>> {
    return this.executeWithErrorHandling(async () => {
      const evidence = await ApiService.evidence.getByCaseId(caseId);
      return evidence || [];
    }, `Failed to retrieve evidence for case ${caseId}`);
  }

  async getCaseTasks(caseId: string): Promise<ServiceResponse<Task[]>> {
    return this.executeWithErrorHandling(async () => {
      const tasks = await ApiService.tasks.getByCaseId(caseId);
      return tasks || [];
    }, `Failed to retrieve tasks for case ${caseId}`);
  }

  validate(entity: Partial<Case>): import('../contracts').ValidationResult {
    const errors: import('../contracts').ValidationError[] = [];

    if (!entity.title?.trim()) {
      errors.push({
        field: 'title',
        message: 'Case title is required',
        code: 'REQUIRED'
      });
    }

    if (!entity.clientId?.trim()) {
      errors.push({
        field: 'clientId',
        message: 'Client ID is required',
        code: 'REQUIRED'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}