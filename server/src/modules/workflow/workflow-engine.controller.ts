import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { WorkflowEngineService, SLARule, ConditionalRule } from './workflow-engine.service';

@ApiTags('workflow-engine')
@Controller('workflow/engine')
export class WorkflowEngineController {
  constructor(private readonly workflowEngine: WorkflowEngineService) {}

  // ==================== TASK DEPENDENCIES ====================

  @Post('dependencies/:taskId')
  @ApiOperation({ summary: 'Set task dependencies' })
  @ApiResponse({ status: 200, description: 'Dependencies set successfully' })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      dependsOn: { type: 'array', items: { type: 'string' } },
      type: { type: 'string', enum: ['blocking', 'informational'] },
    },
  }})
  async setDependencies(
    @Param('taskId') taskId: string,
    @Body() body: { dependsOn: string[]; type?: 'blocking' | 'informational' },
  ) {
    return this.workflowEngine.setTaskDependencies(taskId, body.dependsOn, body.type);
  }

  @Get('dependencies/:taskId')
  @ApiOperation({ summary: 'Get task dependencies' })
  @ApiResponse({ status: 200, description: 'Dependencies retrieved' })
  getDependencies(@Param('taskId') taskId: string) {
    return this.workflowEngine.getTaskDependencies(taskId);
  }

  @Get('dependencies/:taskId/can-start')
  @ApiOperation({ summary: 'Check if task can start (dependencies satisfied)' })
  @ApiResponse({ status: 200, description: 'Dependency check result' })
  async canStartTask(@Param('taskId') taskId: string) {
    return this.workflowEngine.canStartTask(taskId);
  }

  // ==================== SLA MANAGEMENT ====================

  @Post('sla/rules')
  @ApiOperation({ summary: 'Create or update SLA rule' })
  @ApiResponse({ status: 200, description: 'SLA rule saved' })
  setSLARule(@Body() rule: SLARule) {
    return this.workflowEngine.setSLARule(rule);
  }

  @Get('sla/status/:taskId')
  @ApiOperation({ summary: 'Get SLA status for a task' })
  @ApiResponse({ status: 200, description: 'SLA status retrieved' })
  async getTaskSLAStatus(@Param('taskId') taskId: string) {
    return this.workflowEngine.getTaskSLAStatus(taskId);
  }

  @Get('sla/breaches')
  @ApiOperation({ summary: 'Check all SLA breaches' })
  @ApiQuery({ name: 'caseId', required: false })
  @ApiResponse({ status: 200, description: 'SLA breach report' })
  async checkSLABreaches(@Query('caseId') caseId?: string) {
    return this.workflowEngine.checkSLABreaches(caseId);
  }

  // ==================== APPROVAL WORKFLOWS ====================

  @Post('approvals/:taskId')
  @ApiOperation({ summary: 'Create approval chain for a task' })
  @ApiResponse({ status: 201, description: 'Approval chain created' })
  @ApiBody({ schema: { type: 'object', properties: { approverIds: { type: 'array', items: { type: 'string' } } } } })
  async createApprovalChain(
    @Param('taskId') taskId: string,
    @Body() body: { approverIds: string[] },
  ) {
    return this.workflowEngine.createApprovalChain(taskId, body.approverIds);
  }

  @Post('approvals/:taskId/process')
  @ApiOperation({ summary: 'Process approval action' })
  @ApiResponse({ status: 200, description: 'Approval processed' })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      approverId: { type: 'string' },
      action: { type: 'string', enum: ['approve', 'reject'] },
      comments: { type: 'string' },
    },
  }})
  @HttpCode(HttpStatus.OK)
  async processApproval(
    @Param('taskId') taskId: string,
    @Body() body: { approverId: string; action: 'approve' | 'reject'; comments?: string },
  ) {
    return this.workflowEngine.processApproval(taskId, body.approverId, body.action, body.comments);
  }

  @Get('approvals/:taskId')
  @ApiOperation({ summary: 'Get approval chain status' })
  @ApiResponse({ status: 200, description: 'Approval chain retrieved' })
  getApprovalChain(@Param('taskId') taskId: string) {
    return this.workflowEngine.getApprovalChain(taskId);
  }

  // ==================== CONDITIONAL BRANCHING ====================

  @Post('conditions')
  @ApiOperation({ summary: 'Add conditional rule to a stage' })
  @ApiResponse({ status: 201, description: 'Conditional rule added' })
  addConditionalRule(@Body() rule: ConditionalRule) {
    return this.workflowEngine.addConditionalRule(rule);
  }

  @Post('conditions/:stageId/evaluate')
  @ApiOperation({ summary: 'Evaluate conditional rules for a stage' })
  @ApiResponse({ status: 200, description: 'Conditions evaluated' })
  @HttpCode(HttpStatus.OK)
  async evaluateConditions(
    @Param('stageId') stageId: string,
    @Body() context: Record<string, any>,
  ) {
    return this.workflowEngine.evaluateConditions(stageId, context);
  }

  // ==================== TIME TRACKING ====================

  @Post('time/:taskId/start')
  @ApiOperation({ summary: 'Start time tracking for a task' })
  @ApiResponse({ status: 200, description: 'Time tracking started' })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string' } } } })
  @HttpCode(HttpStatus.OK)
  async startTimeTracking(
    @Param('taskId') taskId: string,
    @Body() body: { userId: string },
  ) {
    return this.workflowEngine.startTimeTracking(taskId, body.userId);
  }

  @Post('time/:taskId/stop')
  @ApiOperation({ summary: 'Stop time tracking for a task' })
  @ApiResponse({ status: 200, description: 'Time tracking stopped' })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string' }, description: { type: 'string' } } } })
  @HttpCode(HttpStatus.OK)
  async stopTimeTracking(
    @Param('taskId') taskId: string,
    @Body() body: { userId: string; description?: string },
  ) {
    return this.workflowEngine.stopTimeTracking(taskId, body.userId, body.description);
  }

  @Get('time/:taskId')
  @ApiOperation({ summary: 'Get time entries for a task' })
  @ApiResponse({ status: 200, description: 'Time entries retrieved' })
  getTimeEntries(@Param('taskId') taskId: string) {
    return this.workflowEngine.getTimeEntries(taskId);
  }

  // ==================== NOTIFICATIONS ====================

  @Get('notifications/:userId')
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Notifications retrieved' })
  getNotifications(
    @Param('userId') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.workflowEngine.getNotifications(userId, unreadOnly === 'true');
  }

  @Patch('notifications/:notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markNotificationRead(@Param('notificationId') notificationId: string) {
    return { success: this.workflowEngine.markNotificationRead(notificationId) };
  }

  // ==================== AUDIT TRAIL ====================

  @Get('audit')
  @ApiOperation({ summary: 'Get audit log' })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Audit log retrieved' })
  getAuditLog(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.workflowEngine.getAuditLog(entityType, entityId, limit ? parseInt(limit) : undefined);
  }

  @Get('audit/case/:caseId')
  @ApiOperation({ summary: 'Get audit log for a case' })
  @ApiResponse({ status: 200, description: 'Case audit log retrieved' })
  async getCaseAuditLog(@Param('caseId') caseId: string) {
    return this.workflowEngine.getCaseAuditLog(caseId);
  }

  // ==================== PARALLEL TASKS ====================

  @Post('parallel')
  @ApiOperation({ summary: 'Create parallel task group' })
  @ApiResponse({ status: 201, description: 'Parallel group created' })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      stageId: { type: 'string' },
      taskIds: { type: 'array', items: { type: 'string' } },
      completionRule: { type: 'string', enum: ['all', 'any', 'percentage'] },
      completionThreshold: { type: 'number' },
    },
  }})
  async createParallelGroup(
    @Body() body: { 
      stageId: string; 
      taskIds: string[]; 
      completionRule?: 'all' | 'any' | 'percentage';
      completionThreshold?: number;
    },
  ) {
    return this.workflowEngine.createParallelGroup(
      body.stageId, 
      body.taskIds, 
      body.completionRule, 
      body.completionThreshold,
    );
  }

  @Get('parallel/:groupId/status')
  @ApiOperation({ summary: 'Check parallel group completion status' })
  @ApiResponse({ status: 200, description: 'Parallel group status' })
  async checkParallelGroupCompletion(@Param('groupId') groupId: string) {
    return this.workflowEngine.checkParallelGroupCompletion(groupId);
  }

  @Get('parallel/stage/:stageId')
  @ApiOperation({ summary: 'Get parallel groups for a stage' })
  @ApiResponse({ status: 200, description: 'Parallel groups retrieved' })
  getParallelGroups(@Param('stageId') stageId: string) {
    return this.workflowEngine.getParallelGroups(stageId);
  }

  // ==================== TASK REASSIGNMENT ====================

  @Post('reassign/:taskId')
  @ApiOperation({ summary: 'Reassign a task' })
  @ApiResponse({ status: 200, description: 'Task reassigned' })
  @ApiBody({ schema: { type: 'object', properties: { newAssigneeId: { type: 'string' }, reassignedBy: { type: 'string' } } } })
  @HttpCode(HttpStatus.OK)
  async reassignTask(
    @Param('taskId') taskId: string,
    @Body() body: { newAssigneeId: string; reassignedBy: string },
  ) {
    return this.workflowEngine.reassignTask(taskId, body.newAssigneeId, body.reassignedBy);
  }

  @Post('reassign/bulk')
  @ApiOperation({ summary: 'Bulk reassign tasks' })
  @ApiResponse({ status: 200, description: 'Tasks reassigned' })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      taskIds: { type: 'array', items: { type: 'string' } },
      newAssigneeId: { type: 'string' },
      reassignedBy: { type: 'string' },
    },
  }})
  @HttpCode(HttpStatus.OK)
  async bulkReassignTasks(
    @Body() body: { taskIds: string[]; newAssigneeId: string; reassignedBy: string },
  ) {
    return this.workflowEngine.bulkReassignTasks(body.taskIds, body.newAssigneeId, body.reassignedBy);
  }

  @Post('reassign/user')
  @ApiOperation({ summary: 'Reassign all tasks from one user to another' })
  @ApiResponse({ status: 200, description: 'All tasks reassigned' })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      fromUserId: { type: 'string' },
      toUserId: { type: 'string' },
      caseId: { type: 'string' },
      reassignedBy: { type: 'string' },
    },
  }})
  @HttpCode(HttpStatus.OK)
  async reassignAllFromUser(
    @Body() body: { fromUserId: string; toUserId: string; caseId?: string; reassignedBy?: string },
  ) {
    const count = await this.workflowEngine.reassignAllFromUser(
      body.fromUserId, body.toUserId, body.caseId, body.reassignedBy,
    );
    return { reassignedCount: count };
  }

  // ==================== WORKFLOW ANALYTICS ====================

  @Get('analytics/metrics')
  @ApiOperation({ summary: 'Get comprehensive workflow metrics' })
  @ApiQuery({ name: 'caseId', required: false })
  @ApiResponse({ status: 200, description: 'Workflow metrics' })
  async getWorkflowMetrics(@Query('caseId') caseId?: string) {
    return this.workflowEngine.getWorkflowMetrics(caseId);
  }

  @Get('analytics/velocity')
  @ApiOperation({ summary: 'Get task velocity (tasks completed per day)' })
  @ApiQuery({ name: 'caseId', required: false })
  @ApiQuery({ name: 'days', required: false })
  @ApiResponse({ status: 200, description: 'Task velocity' })
  async getTaskVelocity(
    @Query('caseId') caseId?: string,
    @Query('days') days?: string,
  ) {
    const velocity = await this.workflowEngine.getTaskVelocity(caseId, days ? parseInt(days) : undefined);
    return { velocity, unit: 'tasks/day' };
  }

  @Get('analytics/bottlenecks')
  @ApiOperation({ summary: 'Get bottleneck analysis' })
  @ApiQuery({ name: 'caseId', required: false })
  @ApiResponse({ status: 200, description: 'Bottleneck analysis' })
  async getBottlenecks(@Query('caseId') caseId?: string) {
    return this.workflowEngine.getBottlenecks(caseId);
  }
}
