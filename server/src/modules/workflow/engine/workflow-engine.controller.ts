// Workflow Engine Controller
// REST API endpoints for all workflow engine capabilities

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkflowOrchestratorService } from './workflow-orchestrator.service';

@ApiTags('Workflow Engine')
@Controller('workflow/engine')
export class WorkflowEngineController {
  constructor(private orchestrator: WorkflowOrchestratorService) {}

  // ==================== TASK OPERATIONS ====================

  @Post('tasks/:taskId/complete')
  @ApiOperation({ summary: 'Complete a task' })
  completeTask(
    @Param('taskId') taskId: string,
    @Body() body: { userId: string; comments?: string },
  ) {
    return this.orchestrator.completeTask(taskId, body.userId, body);
  }

  @Post('tasks/:taskId/assign')
  @ApiOperation({ summary: 'Assign a task' })
  assignTask(
    @Param('taskId') taskId: string,
    @Body() body: { assigneeId: string; assignedBy: string; reason?: string },
  ) {
    return this.orchestrator.assignTask(
      taskId,
      body.assigneeId,
      body.assignedBy,
      body.reason,
    );
  }

  // ==================== DEPENDENCIES ====================

  @Get('dependencies/:taskId')
  @ApiOperation({ summary: 'Get task dependencies' })
  getDependencies(@Param('taskId') taskId: string) {
    return this.orchestrator.getDependencyService().getDependencies(taskId);
  }

  @Post('dependencies')
  @ApiOperation({ summary: 'Set task dependencies' })
  setDependencies(
    @Body() body: { taskId: string; dependsOn: string[]; type?: string },
  ) {
    return this.orchestrator.getDependencyService().setDependencies(
      body.taskId,
      body.dependsOn,
      body.type as 'blocking' | 'informational',
    );
  }

  // ==================== SLA ====================

  @Get('sla/:taskId/status')
  @ApiOperation({ summary: 'Get SLA status for a task' })
  getSLAStatus(@Param('taskId') taskId: string) {
    return this.orchestrator.getSLAService().getTaskSLAStatus(taskId);
  }

  @Post('sla/rules')
  @ApiOperation({ summary: 'Create an SLA rule' })
  createSLARule(@Body() rule: any) {
    return this.orchestrator.getSLAService().setRule(rule);
  }

  @Get('sla/breaches')
  @ApiOperation({ summary: 'Get all SLA breaches' })
  async getSLABreaches(@Query('caseId') _caseId?: string) {
    // Return empty breach report for now - will be populated as tasks are created
    return { 
      warnings: [], 
      breaches: [], 
      total: 0, 
    };
  }

  // ==================== APPROVALS ====================

  @Get('approvals/:taskId')
  @ApiOperation({ summary: 'Get approval chain for a task' })
  getApprovalChain(@Param('taskId') taskId: string) {
    return this.orchestrator.getApprovalService().getChain(taskId);
  }

  @Post('approvals')
  @ApiOperation({ summary: 'Create approval chain' })
  createApprovalChain(
    @Body() body: { taskId: string; approverIds: string[] },
  ) {
    return this.orchestrator.getApprovalService().createChain(
      body.taskId,
      body.approverIds,
    );
  }

  @Post('approvals/:taskId/process')
  @ApiOperation({ summary: 'Process an approval' })
  processApproval(
    @Param('taskId') taskId: string,
    @Body() body: { approverId: string; approved: boolean; comments?: string },
  ) {
    return this.orchestrator.getApprovalService().processApproval(
      taskId,
      body.approverId,
      body.approved ? 'approve' : 'reject',
      body.comments,
    );
  }

  // ==================== NOTIFICATIONS ====================

  @Get('notifications/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  getNotifications(
    @Param('userId') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.orchestrator.getNotificationService().getForUser(
      userId,
      unreadOnly === 'true',
    );
  }

  @Put('notifications/:notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markNotificationRead(
    @Param('notificationId') notificationId: string,
    @Body() body: { userId: string },
  ) {
    return this.orchestrator.getNotificationService().markAsRead(
      notificationId,
      body.userId,
    );
  }

  // ==================== AUDIT ====================

  @Get('audit/:entityType/:entityId')
  @ApiOperation({ summary: 'Get audit trail' })
  getAuditTrail(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.orchestrator.getAuditService().getByEntity(
      entityType as any,
      entityId,
    );
  }

  // ==================== ANALYTICS ====================

  @Get('analytics/metrics')
  @ApiOperation({ summary: 'Get workflow metrics' })
  getMetrics(@Query('caseId') caseId?: string) {
    return this.orchestrator.getAnalyticsService().getMetrics(caseId);
  }

  @Get('analytics/velocity')
  @ApiOperation({ summary: 'Get task velocity' })
  getVelocity(
    @Query('caseId') caseId?: string,
    @Query('days') days?: string,
  ) {
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.orchestrator.getAnalyticsService().getVelocity(caseId, daysNum);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get workflow metrics (legacy)' })
  getMetricsLegacy(@Query('caseId') caseId?: string) {
    return this.orchestrator.getAnalyticsService().getMetrics(caseId);
  }

  @Get('analytics/bottlenecks')
  @ApiOperation({ summary: 'Get workflow bottlenecks' })
  getBottlenecks(@Query('caseId') caseId?: string) {
    return this.orchestrator.getAnalyticsService().getBottlenecks(caseId);
  }

  @Get('analytics/case/:caseId')
  @ApiOperation({ summary: 'Get complete case workflow status' })
  getCaseStatus(@Param('caseId') caseId: string) {
    return this.orchestrator.getCaseWorkflowStatus(caseId);
  }

  // ==================== TIME TRACKING ====================

  @Post('time-tracking/:taskId/start')
  @ApiOperation({ summary: 'Start time tracking' })
  startTimer(
    @Param('taskId') taskId: string,
    @Body() body: { userId: string },
  ) {
    return this.orchestrator.getTimeTrackingService().startTimer(
      taskId,
      body.userId,
    );
  }

  @Post('time-tracking/:taskId/stop')
  @ApiOperation({ summary: 'Stop time tracking' })
  stopTimer(
    @Param('taskId') taskId: string,
    @Body() body: { userId: string; description?: string },
  ) {
    return this.orchestrator.getTimeTrackingService().stopTimer(
      taskId,
      body.userId,
      body.description,
    );
  }

  // ==================== CUSTOM FIELDS ====================

  @Get('custom-fields')
  @ApiOperation({ summary: 'Get all custom field definitions' })
  getFieldDefinitions() {
    return this.orchestrator.getCustomFieldsService().getAllFieldDefinitions();
  }

  @Post('custom-fields')
  @ApiOperation({ summary: 'Create custom field definition' })
  createFieldDefinition(@Body() definition: any) {
    return this.orchestrator.getCustomFieldsService().createFieldDefinition(
      definition,
    );
  }

  // ==================== INTEGRATIONS ====================

  @Get('integrations')
  @ApiOperation({ summary: 'Get all external integrations' })
  getIntegrations() {
    return this.orchestrator.getExternalIntegrationService().getAllIntegrations();
  }

  @Post('integrations')
  @ApiOperation({ summary: 'Create external integration' })
  createIntegration(@Body() integration: any) {
    return this.orchestrator.getExternalIntegrationService().createIntegration(
      integration,
    );
  }

  // ==================== VERSIONING ====================

  @Get('versions/:templateId')
  @ApiOperation({ summary: 'Get all versions for a template' })
  getVersions(@Param('templateId') templateId: string) {
    return this.orchestrator.getVersioningService().getAllVersions(templateId);
  }

  @Get('versions/:templateId/active')
  @ApiOperation({ summary: 'Get active version for a template' })
  getActiveVersion(@Param('templateId') templateId: string) {
    return this.orchestrator.getVersioningService().getActiveVersion(templateId);
  }

  // ==================== SCHEDULED TASKS ====================

  @Post('scheduled-checks')
  @ApiOperation({ summary: 'Run scheduled workflow checks' })
  runScheduledChecks() {
    return this.orchestrator.runScheduledChecks();
  }
}
