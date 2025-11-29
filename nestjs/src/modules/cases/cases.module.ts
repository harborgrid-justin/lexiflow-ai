import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { 
  Case,
  Document,
  Evidence,
  Motion,
  TimeEntry,
  DiscoveryRequest,
  Analytics,
  ComplianceRecord,
  WorkflowStage,
  WorkflowTask,
  CalendarEvent,
  Task,
} from '../../models';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';

@Module({
  imports: [SequelizeModule.forFeature([
    Case,
    Document,
    Evidence,
    Motion,
    TimeEntry,
    DiscoveryRequest,
    Analytics,
    ComplianceRecord,
    WorkflowStage,
    WorkflowTask,
    CalendarEvent,
    Task,
  ])],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}