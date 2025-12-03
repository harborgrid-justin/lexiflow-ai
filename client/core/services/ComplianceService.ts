/**
 * Compliance Service Implementation
 * 
 * Domain service for compliance management that implements IComplianceService contract.
 * Handles conflict checks, ethical walls, and compliance monitoring.
 */

import { BaseService } from './BaseService';
import { IComplianceService, QueryOptions, ServiceResponse } from '../contracts';
import { ApiService } from '../../services/apiService';
import type { ComplianceRecord, ConflictCheck, EthicalWall } from '../../types';

export class ComplianceService extends BaseService<ComplianceRecord> implements IComplianceService {
  constructor() {
    super('ComplianceService');
  }

  async getAll(options?: QueryOptions): Promise<ServiceResponse<ComplianceRecord[]>> {
    return this.executeWithErrorHandling(async () => {
      const records = await ApiService.compliance.getAll(options?.filter?.orgId);
      return records || [];
    }, 'Failed to retrieve compliance records');
  }

  async getById(id: string): Promise<ServiceResponse<ComplianceRecord>> {
    return this.executeWithErrorHandling(async () => {
      const record = await ApiService.compliance.getById(id);
      if (!record) {
        throw new Error(`Compliance record with ID ${id} not found`);
      }
      return record;
    }, `Failed to retrieve compliance record ${id}`);
  }

  async create(entity: Partial<ComplianceRecord>): Promise<ServiceResponse<ComplianceRecord>> {
    const validation = this.validate(entity);
    if (!validation.isValid) {
      return {
        data: null as ComplianceRecord,
        success: false,
        message: 'Validation failed',
        errors: validation.errors.map(e => e.message)
      };
    }

    return this.executeWithErrorHandling(async () => {
      const newRecord = await ApiService.compliance.create?.(entity);
      return newRecord;
    }, 'Failed to create compliance record');
  }

  async update(id: string, entity: Partial<ComplianceRecord>): Promise<ServiceResponse<ComplianceRecord>> {
    return this.executeWithErrorHandling(async () => {
      const updatedRecord = await ApiService.compliance.update?.(id, entity);
      return updatedRecord;
    }, `Failed to update compliance record ${id}`);
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.compliance.delete?.(id);
    }, `Failed to delete compliance record ${id}`);
  }

  // IComplianceService specific methods
  async runConflictCheck(entityName: string): Promise<ServiceResponse<ConflictCheck>> {
    return this.executeWithErrorHandling(async () => {
      const conflict = await ApiService.compliance.createConflictCheck({
        entityName,
        date: new Date().toISOString(),
        status: 'Review' as const,
        foundIn: [],
        checkedBy: ''
      });
      return conflict;
    }, `Failed to run conflict check for ${entityName}`);
  }

  async getConflictChecks(): Promise<ServiceResponse<ConflictCheck[]>> {
    return this.executeWithErrorHandling(async () => {
      const conflicts = await ApiService.compliance.getConflicts();
      return conflicts || [];
    }, 'Failed to retrieve conflict checks');
  }

  async createEthicalWall(data: Partial<EthicalWall>): Promise<ServiceResponse<EthicalWall>> {
    return this.executeWithErrorHandling(async () => {
      const wall = await ApiService.compliance.createEthicalWall(data);
      return wall;
    }, 'Failed to create ethical wall');
  }

  async getEthicalWalls(): Promise<ServiceResponse<EthicalWall[]>> {
    return this.executeWithErrorHandling(async () => {
      const walls = await ApiService.compliance.getWalls();
      return walls || [];
    }, 'Failed to retrieve ethical walls');
  }

  async getComplianceRisk(entityId: string): Promise<ServiceResponse<number>> {
    return this.executeWithErrorHandling(async () => {
      // Calculate risk score based on compliance records
      const records = await ApiService.compliance.getAll();
      const entityRecords = records?.filter(r => r.caseId === entityId) || [];
      
      // Simple risk calculation - can be enhanced
      const riskScore = entityRecords.reduce((score, record) => {
        return score + (record.status === 'non_compliant' ? 25 : 0);
      }, 0);
      
      return Math.min(riskScore, 100);
    }, `Failed to calculate compliance risk for ${entityId}`);
  }

  async generateComplianceReport(): Promise<ServiceResponse<any>> {
    return this.executeWithErrorHandling(async () => {
      const [records, conflicts, walls] = await Promise.all([
        ApiService.compliance.getAll(),
        ApiService.compliance.getConflicts(),
        ApiService.compliance.getWalls()
      ]);

      return {
        summary: {
          totalRecords: records?.length || 0,
          pendingConflicts: conflicts?.filter(c => c.status === 'Review').length || 0,
          activeWalls: walls?.filter(w => w.status === 'Active').length || 0
        },
        records: records || [],
        conflicts: conflicts || [],
        walls: walls || []
      };
    }, 'Failed to generate compliance report');
  }

  validate(entity: Partial<ComplianceRecord>): import('../contracts').ValidationResult {
    const errors: import('../contracts').ValidationError[] = [];

    if (!entity.type?.trim()) {
      errors.push({
        field: 'type',
        message: 'Compliance type is required',
        code: 'REQUIRED'
      });
    }

    if (!entity.caseId?.trim()) {
      errors.push({
        field: 'caseId',
        message: 'Case ID is required',
        code: 'REQUIRED'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}