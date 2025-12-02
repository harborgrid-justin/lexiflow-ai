import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogEntry } from '../../models/audit-log-entry.model';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  imports: [SequelizeModule.forFeature([AuditLogEntry])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
