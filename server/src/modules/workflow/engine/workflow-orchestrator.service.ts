// Workflow Engine Orchestrator
// Main service coordinating all workflow capabilities with error handling

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../../models/workflow.model';

// Import all modular services
import { DependencyService } from './dependency.service';
import { SLAService } from './sla.service';
import { ApprovalService } from './approval.service';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';
import { AnalyticsService } from './analytics.service';
import { TimeTrackingService } from './time-tracking.service';
import { ParallelService } from './parallel.service';
import { EscalationService } from './escalation.service';
import { ExternalIntegrationService } from './external-integration.service';
import { CustomFieldsService } from './custom-fields.service';
import { VersioningService } from './versioning.service';

// Import helper services
import { TaskLifecycleService } from './helpers/task-lifecycle.service';
import { StageManagementService } from './helpers/stage-management.service';
import { ConditionalHandlerService } from './helpers/conditional-handler.service';
import { ValidationService } from './helpers/validation.service';
import { PostCompletionService } from './helpers/post-completion.service';
import { RecoveryService } from './helpers/recovery.service';
import { MonitoringService } from './helpers/monitoring.service';

@Injectable()
export class WorkflowOrchestratorService {
  private readonly logger = new Logger(WorkflowOrchestratorService.name);

  constructor(
    @InjectModel(WorkflowStage)
    private stageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,

    // Core services
    private dependencyService: DependencyService,
    private slaService: SLAService,
    private approvalService: ApprovalService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private analyticsService: AnalyticsService,
    private timeTrackingService: TimeTrackingService,
    private parallelService: ParallelService,
    private escalationService: EscalationService,
    private externalIntegrationService: ExternalIntegrationService,
    private customFieldsService: CustomFieldsService,
    private versioningService: VersioningService,

    // Helper services
    private taskLifecycleService: TaskLifecycleService,
    private stageManagementService: StageManagementService,
    private conditionalHandlerService: ConditionalHandlerService,
    private validationService: ValidationService,
    private postCompletionService: PostCompletionService,
    private recoveryService: RecoveryService,
    private monitoringService: MonitoringService,
  ) {}

  // ==================== ENHANCED WORKFLOW ORCHESTRATION ====================

  async orchestrateWorkflow(
    stageId: string,
    context: Record<string, unknown> = {},
  ): Promise<{
    activeTasks: string[];
    completedTasks: string[];
    blockedTasks: string[];
    parallelGroups: any[];
    slaViolations: any[];
    escalations: any[];
    nextStage?: string;
  }> {
    try {
      const _stage = await this.stageManagementService.getStageOrThrow(stageId);
      const tasks = await this.stageManagementService.getTasksForStage(stageId);

      const result = {
        activeTasks: [],
        completedTasks: [],
        blockedTasks: [],
        parallelGroups: [],
        slaViolations: [],
        escalations: [],
        nextStage: undefined,
      };

      // Process all tasks
      for (const task of tasks) {
        await this.processTaskThroughEngine(task, context, result);
      }

      // Handle stage-level conditional routing
      const conditionalResult = await this.conditionalHandlerService.evaluateStageConditions(stageId, context);
      if (conditionalResult.triggered && conditionalResult.action === 'next_stage') {
        result.nextStage = conditionalResult.value as string;
        await this.stageManagementService.initiateStageTransition(stageId, result.nextStage, context);
      }

      this.logger.debug(`Workflow orchestration completed for stage ${stageId}`, result);

      return result;
    } catch (error) {
      this.logger.error(`Workflow orchestration failed for stage ${stageId}:`, error);
      throw error;
    }
  }

  private async processTaskThroughEngine(
    task: any,
    context: Record<string, unknown>,
    result: any,
  ): Promise<void> {
    const dependencyResult = await this.dependencyService.canStartTask(task.id);
    if (!dependencyResult.canStart) {
      result.blockedTasks.push(task.id);
      return;
    }

    const slaStatus = await this.slaService.getTaskSLAStatus(task.id);
    if (slaStatus.status === 'breached' || slaStatus.status === 'warning') {
      result.slaViolations.push({ taskId: task.id, ...slaStatus });
      
      const escalations = this.escalationService.getTaskEscalations(task.id);
      if (escalations.length > 0) {
        result.escalations.push(...escalations);
      }
    }

    if (task.status === 'done') {
      result.completedTasks.push(task.id);
    } else if (task.status === 'in_progress' || task.status === 'pending') {
      result.activeTasks.push(task.id);
    }
  }

  async initializeStage(
    stageId: string,
    context: Record<string, unknown> = {},
    config: {
      enableSLA?: boolean;
      enableApprovals?: boolean;
      enableParallel?: boolean;
      enableConditional?: boolean;
      enableRecurring?: boolean;
      enableIntegrations?: boolean;
    } = {},
  ): Promise<void> {
    return this.stageManagementService.initializeStage(stageId, context, config);
  }

  // ==================== TASK LIFECYCLE ====================

  async completeTask(
    taskId: string,
    userId: string,
    data?: { comments?: string; context?: Record<string, unknown> },
  ): Promise<{ success: boolean; nextTasks?: string[]; actions?: string[] }> {
    return this.recoveryService.executeWithRecovery(taskId, 'complete', async () => {
      const task = await this.taskModel.findByPk(taskId);
      if (!task) {throw new Error(`Task ${taskId} not found`);}

      await this.validationService.validateTaskCompletion(task, userId);
      await this.taskLifecycleService.completeTask(taskId, userId, data);

      const results = await this.postCompletionService.processPostCompletion(task, data?.context);

      this.triggerIntegrationsSafe('task.completed', {
        taskId,
        userId,
        caseId: task.case_id,
        stageId: task.stage_id,
      });

      return {
        success: true,
        nextTasks: results.nextTasks,
        actions: results.actions,
      };
    });
  }

  async startTask(
    taskId: string,
    userId: string,
  ): Promise<{ success: boolean; blockedBy?: string[] }> {
    return this.recoveryService.executeWithRecovery(taskId, 'start', async () => {
      return this.taskLifecycleService.startTask(taskId, userId);
    });
  }

  async assignTask(
    taskId: string,
    assigneeId: string,
    assignedBy: string,
    reason?: string,
  ): Promise<{ success: boolean; reassigned: boolean }> {
    return this.recoveryService.executeWithRecovery(taskId, 'assign', async () => {
      return this.taskLifecycleService.assignTask(taskId, assigneeId, assignedBy, reason);
    });
  }

  // ==================== STAGE OPERATIONS ====================

  async pauseStage(stageId: string, reason?: string): Promise<void> {
    return this.stageManagementService.pauseStage(stageId, reason);
  }

  async resumeStage(stageId: string): Promise<void> {
    return this.stageManagementService.resumeStage(stageId);
  }

  async bulkAssignStage(stageId: string, assignments: Array<{taskId: string, userId: string}>): Promise<void> {
    return this.stageManagementService.bulkAssignStage(stageId, assignments);
  }

  // ==================== ERROR HANDLING & RECOVERY ====================

  async retryFailedOperation(taskId: string, operation: string): Promise<boolean> {
    return this.recoveryService.retryFailedOperation(taskId, operation);
  }

  getRecoveryStates() {
    return this.recoveryService.getRecoveryStates();
  }

  getCircuitBreakerStatus() {
    return this.recoveryService.getCircuitBreakerStatus();
  }

  // ==================== MONITORING & ANALYTICS ====================

  async runScheduledChecks() {
    return this.monitoringService.runScheduledChecks();
  }

  async getCaseWorkflowStatus(caseId: string) {
    return this.monitoringService.getCaseWorkflowStatus(caseId);
  }

  // ==================== INTEGRATION HELPERS ====================

  private triggerIntegrationsSafe(
    event: string,
    data: Record<string, unknown>,
  ): void {
    this.externalIntegrationService.triggerEvent(event, data).catch(error => {
      this.logger.error(`Integration trigger failed for ${event}`, error);
    });
  }

  // ==================== SERVICE ACCESS ====================

  getDependencyService() { return this.dependencyService; }
  getSLAService() { return this.slaService; }
  getApprovalService() { return this.approvalService; }
  getAnalyticsService() { return this.analyticsService; }
  getTimeTrackingService() { return this.timeTrackingService; }
  getParallelService() { return this.parallelService; }
  getEscalationService() { return this.escalationService; }
  getExternalIntegrationService() { return this.externalIntegrationService; }
  getCustomFieldsService() { return this.customFieldsService; }
  getVersioningService() { return this.versioningService; }
  getNotificationService() { return this.notificationService; }
  getAuditService() { return this.auditService; }

  // ==================== COMPREHENSIVE STATUS ====================

  async getStageStatus(stageId: string): Promise<{
    stage: WorkflowStage;
    tasks: Array<{
      task: WorkflowTask;
      dependencies: any;
      slaStatus: any;
      timeTracking: any;
      approvals: any;
      customFields: any;
    }>;
    parallelGroups: any[];
    overallProgress: number;
  }> {
    const stage = await this.stageManagementService.getStageOrThrow(stageId);
    const tasks = await this.stageManagementService.getTasksForStage(stageId);
    
    const enhancedTasks = await Promise.all(tasks.map(async (task) => ({
      task,
      dependencies: await this.dependencyService.canStartTask(task.id),
      slaStatus: await this.slaService.getTaskSLAStatus(task.id),
      timeTracking: this.timeTrackingService.getTaskTimeEntries(task.id),
      approvals: this.approvalService.getChain(task.id),
      customFields: { message: 'Custom fields would be loaded here' },
    })));

    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const overallProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      stage,
      tasks: enhancedTasks,
      parallelGroups: [],
      overallProgress,
    };
  }
}
