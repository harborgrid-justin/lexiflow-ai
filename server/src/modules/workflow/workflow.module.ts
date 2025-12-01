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

// Helper services
import { TaskLifecycleService } from './engine/helpers/task-lifecycle.service';
import { StageManagementService } from './engine/helpers/stage-management.service';
import { ConditionalHandlerService } from './engine/helpers/conditional-handler.service';
import { ValidationService } from './engine/helpers/validation.service';
import { PostCompletionService } from './engine/helpers/post-completion.service';
import { RecoveryService } from './engine/helpers/recovery.service';
import { MonitoringService } from './engine/helpers/monitoring.service';

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
  // Helper services
  TaskLifecycleService,
  StageManagementService,
  ConditionalHandlerService,
  ValidationService,
  PostCompletionService,
  RecoveryService,
  MonitoringService,
];

@Module({
  imports: [SequelizeModule.forFeature([WorkflowStage, WorkflowTask])],
  controllers: [WorkflowController, WorkflowEngineController],
  providers: [WorkflowService, ...engineServices],
  exports: [WorkflowService, WorkflowOrchestratorService],
})
export class WorkflowModule {}