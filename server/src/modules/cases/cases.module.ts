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
import { PacerParserService } from '../../services/pacer-parser.service';

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
  providers: [CasesService, PacerParserService],
  exports: [CasesService],
})
export class CasesModule {}