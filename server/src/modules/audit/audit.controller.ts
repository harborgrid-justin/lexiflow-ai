import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditLogEntry } from '../../models/audit-log-entry.model';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit log entries' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully', type: [AuditLogEntry] })
  findAll(
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
  ): Promise<AuditLogEntry[]> {
    return this.auditService.findAll(entityId, userId);
  }
}
