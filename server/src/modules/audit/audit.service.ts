import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLogEntry } from '../../models/audit-log-entry.model';
import { CreateAuditLogEntryDto } from './dto/create-audit-log-entry.dto';
import { Op } from 'sequelize';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLogEntry)
    private auditLogEntryModel: typeof AuditLogEntry,
  ) {}

  async logAction(createAuditLogEntryDto: CreateAuditLogEntryDto): Promise<AuditLogEntry> {
    const auditData = {
      ...createAuditLogEntryDto,
      timestamp: new Date(createAuditLogEntryDto.timestamp),
    };
    return this.auditLogEntryModel.create(auditData as unknown as Partial<AuditLogEntry>);
  }

  async findAll(
    userId?: string,
    resource?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ entries: AuditLogEntry[]; total: number }> {
    const whereClause: Record<string, any> = {};

    if (userId) {
      whereClause.user_id = userId;
    }

    if (resource) {
      whereClause.resource = resource;
    }

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.timestamp[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await this.auditLogEntryModel.findAndCountAll({
      where: whereClause,
      include: ['user'],
      order: [['timestamp', 'DESC']],
      limit,
      offset,
    });

    return {
      entries: rows,
      total: count,
    };
  }

  async findOne(id: string): Promise<AuditLogEntry> {
    const entry = await this.auditLogEntryModel.findByPk(id, {
      include: ['user'],
    });

    if (!entry) {
      throw new Error(`Audit log entry with ID ${id} not found`);
    }

    return entry;
  }

  async findByUser(userId: string, limit: number = 50): Promise<AuditLogEntry[]> {
    return this.auditLogEntryModel.findAll({
      where: { user_id: userId },
      include: ['user'],
      order: [['timestamp', 'DESC']],
      limit,
    });
  }

  async findByResource(resource: string, resourceId?: string, limit: number = 50): Promise<AuditLogEntry[]> {
    const whereClause: Record<string, any> = { resource };
    if (resourceId) {
      whereClause.resource_id = resourceId;
    }

    return this.auditLogEntryModel.findAll({
      where: whereClause,
      include: ['user'],
      order: [['timestamp', 'DESC']],
      limit,
    });
  }

  // Helper method to quickly log common actions
  async logCaseAction(
    userId: string,
    action: string,
    caseId: string,
    ipAddress: string,
    details?: string,
    userAgent?: string,
  ): Promise<AuditLogEntry> {
    return this.logAction({
      timestamp: new Date().toISOString(),
      user_id: userId,
      action,
      resource: 'case',
      resource_id: caseId,
      ip_address: ipAddress,
      user_agent: userAgent,
      details,
    });
  }

  async logDocumentAction(
    userId: string,
    action: string,
    documentId: string,
    ipAddress: string,
    details?: string,
    userAgent?: string,
  ): Promise<AuditLogEntry> {
    return this.logAction({
      timestamp: new Date().toISOString(),
      user_id: userId,
      action,
      resource: 'document',
      resource_id: documentId,
      ip_address: ipAddress,
      user_agent: userAgent,
      details,
    });
  }
}