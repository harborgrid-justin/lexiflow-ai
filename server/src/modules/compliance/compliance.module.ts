import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ComplianceRecord } from '../../models/compliance.model';
import { ConflictCheck } from '../../models/conflict-check.model';
import { EthicalWall } from '../../models/ethical-wall.model';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';

@Module({
  imports: [SequelizeModule.forFeature([ComplianceRecord, ConflictCheck, EthicalWall])],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}