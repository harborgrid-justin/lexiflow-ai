import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../models/workflow.model';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';

// Engine services (modular architecture)
import {
  DependencyService,
  SLAService,
  ApprovalService,
  NotificationService,
  AuditService,
  AnalyticsService,
  ConditionalService,
  TimeTrackingService,
  ParallelService,
  ReassignmentService,
  EscalationService,
  ExternalIntegrationService,
  CustomFieldsService,
  RecurringService,
  VersioningService,
  WorkflowOrchestratorService,
  WorkflowEngineController,
} from './engine';

// All engine services
const engineServices = [
  DependencyService,
  SLAService,
  ApprovalService,
  NotificationService,
  AuditService,
  AnalyticsService,
  ConditionalService,
  TimeTrackingService,
  ParallelService,
  ReassignmentService,
  EscalationService,
  ExternalIntegrationService,
  CustomFieldsService,
  RecurringService,
  VersioningService,
  WorkflowOrchestratorService,
];

@Module({
  imports: [SequelizeModule.forFeature([WorkflowStage, WorkflowTask])],
  controllers: [WorkflowController, WorkflowEngineController],
  providers: [WorkflowService, ...engineServices],
  exports: [WorkflowService, WorkflowOrchestratorService],
})
export class WorkflowModule {}