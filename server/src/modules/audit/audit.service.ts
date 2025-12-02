import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLogEntry } from '../../models/audit-log-entry.model';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLogEntry)
    private auditModel: typeof AuditLogEntry,
  ) {}

  async findAll(entityId?: string, userId?: string): Promise<AuditLogEntry[]> {
    const whereClause: any = {};
    if (entityId) whereClause.resource_id = entityId;
    if (userId) whereClause.user_id = userId;

    return this.auditModel.findAll({
      where: whereClause,
      include: ['user'],
      order: [['timestamp', 'DESC']],
      limit: 1000,
    });
  }

  async log(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    details?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLogEntry> {
    return this.auditModel.create({
      timestamp: new Date(),
      user_id: userId,
      action,
      resource: entityType,
      resource_id: entityId,
      details,
      ip_address: ipAddress || '0.0.0.0',
      user_agent: userAgent,
    });
  }

  async getByEntity(entityType: string, entityId: string): Promise<AuditLogEntry[]> {
    return this.auditModel.findAll({
      where: {
        resource: entityType,
        resource_id: entityId,
      },
      include: ['user'],
      order: [['timestamp', 'DESC']],
    });
  }

  async getByUser(userId: string): Promise<AuditLogEntry[]> {
    return this.auditModel.findAll({
      where: { user_id: userId },
      include: ['user'],
      order: [['timestamp', 'DESC']],
      limit: 500,
    });
  }
}
