import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogEntry } from '../../models/audit-log-entry.model';

@Module({
  imports: [SequelizeModule.forFeature([AuditLogEntry])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}