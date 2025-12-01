import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../models/workflow.model';
import { User } from '../../models/user.model';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enterprise Workflow Engine Service
 * 
 * Implements 10 enterprise capabilities:
 * 1. Task Dependencies - Tasks can depend on other tasks
 * 2. SLA Management - Configurable SLA rules with breach alerts
 * 3. Approval Workflows - Multi-level approval chains
 * 4. Conditional Branching - If/then logic for task routing
 * 5. Time Tracking Integration - Auto-log time from task completion
 * 6. Notification System - Email/push notifications for task events
 * 7. Audit Trail - Complete history of all workflow changes
 * 8. Parallel Tasks - Support concurrent task execution
 * 9. Task Reassignment - Bulk and individual task reassignment
 * 10. Workflow Analytics - Performance metrics and insights
 */

// ==================== TYPE DEFINITIONS ====================

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  type: 'blocking' | 'informational';
}

export interface SLARule {
  id: string;
  name: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  warningHours: number;
  breachHours: number;
  escalateTo?: string;
  autoNotify: boolean;
}

export interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverRole?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  comments?: string;
}

export interface ApprovalChain {
  taskId: string;
  steps: ApprovalStep[];
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ConditionalRule {
  id: string;
  stageId: string;
  condition: {
    field: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: any;
  };
  thenAction: 'skipStage' | 'addTask' | 'assignTo' | 'setPriority' | 'notify';
  thenValue: any;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  entityType: 'task' | 'stage' | 'workflow';
  entityId: string;
  action: string;
  previousValue?: any;
  newValue?: any;
  userId: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface TaskTimeEntry {
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  description?: string;
  billable: boolean;
}

export interface NotificationEvent {
  id: string;
  type: 'task_assigned' | 'task_due_soon' | 'task_overdue' | 'sla_warning' | 'sla_breach' | 'approval_required' | 'stage_completed';
  recipientId: string;
  recipientEmail?: string;
  title: string;
  message: string;
  caseId?: string;
  taskId?: string;
  read: boolean;
  createdAt: Date;
}

export interface WorkflowMetrics {
  caseId?: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageCompletionTime: number; // hours
  slaBreaches: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Record<string, number>;
  stageProgress: Array<{ stageId: string; stageName: string; progress: number }>;
  timelineData: Array<{ date: string; completed: number; created: number }>;
}

export interface ParallelTaskGroup {
  id: string;
  stageId: string;
  tasks: string[];
  completionRule: 'all' | 'any' | 'percentage';
  completionThreshold?: number;
  status: 'pending' | 'in-progress' | 'completed';
}

// ==================== SERVICE IMPLEMENTATION ====================

@Injectable()
export class WorkflowEngineService {
  // In-memory stores (would be DB tables in production)
  private dependencies: Map<string, TaskDependency> = new Map();
  private slaRules: Map<string, SLARule> = new Map();
  private approvalChains: Map<string, ApprovalChain> = new Map();
  private conditionalRules: Map<string, ConditionalRule[]> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private timeEntries: Map<string, TaskTimeEntry[]> = new Map();
  private notifications: NotificationEvent[] = [];
  private parallelGroups: Map<string, ParallelTaskGroup> = new Map();

  constructor(
    @InjectModel(WorkflowStage)
    private workflowStageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private workflowTaskModel: typeof WorkflowTask,
  ) {
    this.initializeDefaultSLARules();
  }

  // ==================== 1. TASK DEPENDENCIES ====================

  /**
   * Set dependencies for a task
   */
  async setTaskDependencies(
    taskId: string, 
    dependsOn: string[], 
    type: 'blocking' | 'informational' = 'blocking',
  ): Promise<TaskDependency> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    // Validate all dependency tasks exist
    for (const depId of dependsOn) {
      const depTask = await this.workflowTaskModel.findByPk(depId);
      if (!depTask) {
        throw new BadRequestException(`Dependency task ${depId} not found`);
      }
    }

    // Check for circular dependencies
    if (await this.hasCircularDependency(taskId, dependsOn)) {
      throw new BadRequestException('Circular dependency detected');
    }

    const dependency: TaskDependency = { taskId, dependsOn, type };
    this.dependencies.set(taskId, dependency);

    this.logAudit('task', taskId, 'dependencies_set', null, dependency, 'system');
    
    return dependency;
  }

  /**
   * Check if task dependencies are satisfied
   */
  async canStartTask(taskId: string): Promise<{ canStart: boolean; blockedBy: string[] }> {
    const dependency = this.dependencies.get(taskId);
    if (!dependency || dependency.type === 'informational') {
      return { canStart: true, blockedBy: [] };
    }

    const blockedBy: string[] = [];
    for (const depId of dependency.dependsOn) {
      const depTask = await this.workflowTaskModel.findByPk(depId);
      if (depTask && depTask.status !== 'done') {
        blockedBy.push(depId);
      }
    }

    return { canStart: blockedBy.length === 0, blockedBy };
  }

  /**
   * Get all dependencies for a task
   */
  getTaskDependencies(taskId: string): TaskDependency | undefined {
    return this.dependencies.get(taskId);
  }

  private async hasCircularDependency(taskId: string, dependsOn: string[], visited: Set<string> = new Set()): Promise<boolean> {
    if (visited.has(taskId)) {return true;}
    visited.add(taskId);

    for (const depId of dependsOn) {
      if (depId === taskId) {return true;}
      const dep = this.dependencies.get(depId);
      if (dep && await this.hasCircularDependency(depId, dep.dependsOn, new Set(visited))) {
        return true;
      }
    }
    return false;
  }

  // ==================== 2. SLA MANAGEMENT ====================

  private initializeDefaultSLARules() {
    const defaultRules: SLARule[] = [
      { id: 'sla-critical', name: 'Critical Priority', priority: 'Critical', warningHours: 4, breachHours: 8, autoNotify: true },
      { id: 'sla-high', name: 'High Priority', priority: 'High', warningHours: 24, breachHours: 48, autoNotify: true },
      { id: 'sla-medium', name: 'Medium Priority', priority: 'Medium', warningHours: 72, breachHours: 120, autoNotify: true },
      { id: 'sla-low', name: 'Low Priority', priority: 'Low', warningHours: 168, breachHours: 336, autoNotify: false },
    ];
    defaultRules.forEach(rule => this.slaRules.set(rule.id, rule));
  }

  /**
   * Create or update SLA rule
   */
  setSLARule(rule: SLARule): SLARule {
    this.slaRules.set(rule.id, rule);
    this.logAudit('workflow', rule.id, 'sla_rule_updated', null, rule, 'system');
    return rule;
  }

  /**
   * Get SLA status for a task
   */
  async getTaskSLAStatus(taskId: string): Promise<{
    status: 'ok' | 'warning' | 'breached';
    rule?: SLARule;
    hoursRemaining?: number;
    hoursOverdue?: number;
  }> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task || task.status === 'done') {
      return { status: 'ok' };
    }

    const rule = this.getSLARuleForPriority(task.priority);
    if (!rule || !task.due_date) {
      return { status: 'ok', rule };
    }

    const now = new Date();
    const dueDate = new Date(task.due_date);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) {
      return { 
        status: 'breached', 
        rule, 
        hoursOverdue: Math.abs(hoursUntilDue), 
      };
    } else if (hoursUntilDue <= rule.warningHours) {
      return { 
        status: 'warning', 
        rule, 
        hoursRemaining: hoursUntilDue, 
      };
    }

    return { status: 'ok', rule, hoursRemaining: hoursUntilDue };
  }

  /**
   * Check all tasks for SLA breaches
   */
  async checkSLABreaches(caseId?: string): Promise<{
    warnings: WorkflowTask[];
    breaches: WorkflowTask[];
  }> {
    const whereClause: any = { status: { [Op.ne]: 'done' } };
    if (caseId) {whereClause.case_id = caseId;}

    const tasks = await this.workflowTaskModel.findAll({ where: whereClause });
    const warnings: WorkflowTask[] = [];
    const breaches: WorkflowTask[] = [];

    for (const task of tasks) {
      const slaStatus = await this.getTaskSLAStatus(task.id);
      if (slaStatus.status === 'warning') {
        warnings.push(task);
        if (slaStatus.rule?.autoNotify) {
          await this.createNotification('sla_warning', task.assigned_to || 'unassigned', 
            `SLA Warning: ${task.title}`, 
            `Task is due in ${Math.round(slaStatus.hoursRemaining || 0)} hours`,
            task.case_id, task.id,
          );
        }
      } else if (slaStatus.status === 'breached') {
        breaches.push(task);
        task.sla_warning = true;
        await task.save();
        if (slaStatus.rule?.autoNotify) {
          await this.createNotification('sla_breach', task.assigned_to || 'unassigned',
            `SLA Breach: ${task.title}`,
            `Task is ${Math.round(slaStatus.hoursOverdue || 0)} hours overdue`,
            task.case_id, task.id,
          );
        }
      }
    }

    return { warnings, breaches };
  }

  private getSLARuleForPriority(priority: string): SLARule | undefined {
    const priorityMap: Record<string, string> = {
      'critical': 'sla-critical',
      'high': 'sla-high',
      'medium': 'sla-medium',
      'low': 'sla-low',
    };
    return this.slaRules.get(priorityMap[priority.toLowerCase()] || 'sla-medium');
  }

  // ==================== 3. APPROVAL WORKFLOWS ====================

  /**
   * Create approval chain for a task
   */
  async createApprovalChain(taskId: string, approverIds: string[]): Promise<ApprovalChain> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const steps: ApprovalStep[] = approverIds.map((approverId, index) => ({
      id: uuidv4(),
      order: index + 1,
      approverId,
      status: index === 0 ? 'pending' : 'pending',
    }));

    const chain: ApprovalChain = {
      taskId,
      steps,
      currentStep: 0,
      status: 'pending',
    };

    this.approvalChains.set(taskId, chain);
    this.logAudit('task', taskId, 'approval_chain_created', null, chain, 'system');

    // Notify first approver
    if (steps.length > 0) {
      await this.createNotification('approval_required', steps[0].approverId,
        `Approval Required: ${task.title}`,
        'You have been assigned to approve this task',
        task.case_id, taskId,
      );
    }

    return chain;
  }

  /**
   * Process approval action
   */
  async processApproval(
    taskId: string, 
    approverId: string, 
    action: 'approve' | 'reject',
    comments?: string,
  ): Promise<ApprovalChain> {
    const chain = this.approvalChains.get(taskId);
    if (!chain) {
      throw new NotFoundException(`No approval chain found for task ${taskId}`);
    }

    const currentStep = chain.steps[chain.currentStep];
    if (!currentStep || currentStep.approverId !== approverId) {
      throw new BadRequestException('You are not authorized to approve this step');
    }

    currentStep.status = action === 'approve' ? 'approved' : 'rejected';
    currentStep.approvedAt = new Date();
    currentStep.comments = comments;

    if (action === 'reject') {
      chain.status = 'rejected';
      this.logAudit('task', taskId, 'approval_rejected', null, { step: currentStep, comments }, approverId);
    } else if (chain.currentStep < chain.steps.length - 1) {
      chain.currentStep++;
      // Notify next approver
      const nextStep = chain.steps[chain.currentStep];
      const task = await this.workflowTaskModel.findByPk(taskId);
      if (task) {
        await this.createNotification('approval_required', nextStep.approverId,
          `Approval Required: ${task.title}`,
          'Previous approver has approved. Your approval is needed.',
          task.case_id, taskId,
        );
      }
      this.logAudit('task', taskId, 'approval_step_completed', null, currentStep, approverId);
    } else {
      chain.status = 'approved';
      // Update task status
      await this.workflowTaskModel.update({ status: 'done' }, { where: { id: taskId } });
      this.logAudit('task', taskId, 'approval_chain_completed', null, chain, approverId);
    }

    this.approvalChains.set(taskId, chain);
    return chain;
  }

  /**
   * Get approval chain status
   */
  getApprovalChain(taskId: string): ApprovalChain | undefined {
    return this.approvalChains.get(taskId);
  }

  // ==================== 4. CONDITIONAL BRANCHING ====================

  /**
   * Add conditional rule to a stage
   */
  addConditionalRule(rule: ConditionalRule): ConditionalRule {
    const stageRules = this.conditionalRules.get(rule.stageId) || [];
    stageRules.push(rule);
    this.conditionalRules.set(rule.stageId, stageRules);
    this.logAudit('stage', rule.stageId, 'conditional_rule_added', null, rule, 'system');
    return rule;
  }

  /**
   * Evaluate conditional rules for a stage
   */
  async evaluateConditions(stageId: string, context: Record<string, any>): Promise<{
    actionsTriggered: Array<{ rule: ConditionalRule; executed: boolean }>;
  }> {
    const rules = this.conditionalRules.get(stageId) || [];
    const actionsTriggered: Array<{ rule: ConditionalRule; executed: boolean }> = [];

    for (const rule of rules) {
      const conditionMet = this.evaluateCondition(rule.condition, context);
      if (conditionMet) {
        await this.executeAction(rule, context);
        actionsTriggered.push({ rule, executed: true });
        this.logAudit('stage', stageId, 'conditional_rule_triggered', null, rule, 'system');
      } else {
        actionsTriggered.push({ rule, executed: false });
      }
    }

    return { actionsTriggered };
  }

  private evaluateCondition(condition: ConditionalRule['condition'], context: Record<string, any>): boolean {
    const value = context[condition.field];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'greaterThan':
        return Number(value) > Number(condition.value);
      case 'lessThan':
        return Number(value) < Number(condition.value);
      case 'isEmpty':
        return value === null || value === undefined || value === '';
      case 'isNotEmpty':
        return value !== null && value !== undefined && value !== '';
      default:
        return false;
    }
  }

  private async executeAction(rule: ConditionalRule, context: Record<string, any>): Promise<void> {
    switch (rule.thenAction) {
      case 'skipStage':
        await this.workflowStageModel.update(
          { status: 'completed' },
          { where: { id: rule.stageId } },
        );
        break;
      case 'addTask':
        await this.workflowTaskModel.create({
          id: uuidv4(),
          stage_id: rule.stageId,
          case_id: context.caseId,
          title: rule.thenValue.title,
          description: rule.thenValue.description,
          priority: rule.thenValue.priority || 'medium',
          status: 'pending',
        });
        break;
      case 'assignTo':
        // Update all tasks in stage to be assigned to specified user
        await this.workflowTaskModel.update(
          { assigned_to: rule.thenValue },
          { where: { stage_id: rule.stageId } },
        );
        break;
      case 'setPriority':
        await this.workflowTaskModel.update(
          { priority: rule.thenValue },
          { where: { stage_id: rule.stageId } },
        );
        break;
      case 'notify':
        await this.createNotification('task_assigned', rule.thenValue.userId,
          rule.thenValue.title,
          rule.thenValue.message,
          context.caseId,
        );
        break;
    }
  }

  // ==================== 5. TIME TRACKING INTEGRATION ====================

  /**
   * Start time tracking for a task
   */
  async startTimeTracking(taskId: string, userId: string): Promise<TaskTimeEntry> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const entry: TaskTimeEntry = {
      taskId,
      userId,
      startTime: new Date(),
      billable: true,
    };

    const entries = this.timeEntries.get(taskId) || [];
    entries.push(entry);
    this.timeEntries.set(taskId, entries);

    this.logAudit('task', taskId, 'time_tracking_started', null, entry, userId);
    return entry;
  }

  /**
   * Stop time tracking for a task
   */
  async stopTimeTracking(taskId: string, userId: string, description?: string): Promise<TaskTimeEntry | null> {
    const entries = this.timeEntries.get(taskId) || [];
    const activeEntry = entries.find(e => e.userId === userId && !e.endTime);

    if (!activeEntry) {
      return null;
    }

    activeEntry.endTime = new Date();
    activeEntry.duration = Math.round((activeEntry.endTime.getTime() - activeEntry.startTime.getTime()) / 60000);
    activeEntry.description = description;

    // Update task actual hours
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (task) {
      const totalMinutes = entries.filter(e => e.endTime).reduce((sum, e) => sum + (e.duration || 0), 0);
      task.actual_hours = totalMinutes / 60;
      await task.save();
    }

    this.logAudit('task', taskId, 'time_tracking_stopped', null, activeEntry, userId);
    return activeEntry;
  }

  /**
   * Get time entries for a task
   */
  getTimeEntries(taskId: string): TaskTimeEntry[] {
    return this.timeEntries.get(taskId) || [];
  }

  /**
   * Auto-log time on task completion
   */
  async autoLogTimeOnCompletion(taskId: string, userId: string): Promise<TaskTimeEntry | null> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task || !task.estimated_hours) {return null;}

    const entry: TaskTimeEntry = {
      taskId,
      userId,
      startTime: new Date(Date.now() - task.estimated_hours * 60 * 60 * 1000),
      endTime: new Date(),
      duration: task.estimated_hours * 60,
      description: `Completed task: ${task.title}`,
      billable: true,
    };

    const entries = this.timeEntries.get(taskId) || [];
    entries.push(entry);
    this.timeEntries.set(taskId, entries);

    return entry;
  }

  // ==================== 6. NOTIFICATION SYSTEM ====================

  /**
   * Create a notification
   */
  async createNotification(
    type: NotificationEvent['type'],
    recipientId: string,
    title: string,
    message: string,
    caseId?: string,
    taskId?: string,
  ): Promise<NotificationEvent> {
    const notification: NotificationEvent = {
      id: uuidv4(),
      type,
      recipientId,
      title,
      message,
      caseId,
      taskId,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    
    // In production, this would trigger email/push notification
    console.log(`[NOTIFICATION] ${type}: ${title} -> ${recipientId}`);
    
    return notification;
  }

  /**
   * Get notifications for a user
   */
  getNotifications(userId: string, unreadOnly = false): NotificationEvent[] {
    return this.notifications
      .filter(n => n.recipientId === userId && (!unreadOnly || !n.read))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  /**
   * Notify on task events
   */
  async notifyTaskEvent(taskId: string, event: 'assigned' | 'completed' | 'overdue'): Promise<void> {
    const task = await this.workflowTaskModel.findByPk(taskId, {
      include: [{ model: User, as: 'assignee' }],
    });
    
    if (!task || !task.assigned_to) {return;}

    const eventConfig = {
      assigned: { type: 'task_assigned' as const, title: `Task Assigned: ${task.title}`, message: 'A new task has been assigned to you' },
      completed: { type: 'stage_completed' as const, title: `Task Completed: ${task.title}`, message: 'Task has been marked as complete' },
      overdue: { type: 'task_overdue' as const, title: `Task Overdue: ${task.title}`, message: 'This task is now overdue' },
    };

    const config = eventConfig[event];
    await this.createNotification(config.type, task.assigned_to, config.title, config.message, task.case_id, taskId);
  }

  // ==================== 7. AUDIT TRAIL ====================

  /**
   * Log an audit entry
   */
  logAudit(
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    action: string,
    previousValue: any,
    newValue: any,
    userId: string,
    metadata?: Record<string, any>,
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      entityType,
      entityId,
      action,
      previousValue,
      newValue,
      userId,
      metadata,
    };

    this.auditLog.push(entry);
    return entry;
  }

  /**
   * Get audit log for an entity
   */
  getAuditLog(entityType?: string, entityId?: string, limit = 100): AuditLogEntry[] {
    return this.auditLog
      .filter(e => 
        (!entityType || e.entityType === entityType) &&
        (!entityId || e.entityId === entityId),
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get audit log for a case (all related entities)
   */
  async getCaseAuditLog(caseId: string): Promise<AuditLogEntry[]> {
    const stages = await this.workflowStageModel.findAll({ where: { case_id: caseId } });
    const stageIds = stages.map(s => s.id);
    
    const tasks = await this.workflowTaskModel.findAll({ 
      where: { [Op.or]: [{ case_id: caseId }, { stage_id: stageIds }] },
    });
    const taskIds = tasks.map(t => t.id);

    return this.auditLog
      .filter(e => 
        (e.entityType === 'workflow' && e.entityId === caseId) ||
        (e.entityType === 'stage' && stageIds.includes(e.entityId)) ||
        (e.entityType === 'task' && taskIds.includes(e.entityId)),
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ==================== 8. PARALLEL TASKS ====================

  /**
   * Create a parallel task group
   */
  async createParallelGroup(
    stageId: string,
    taskIds: string[],
    completionRule: 'all' | 'any' | 'percentage' = 'all',
    completionThreshold?: number,
  ): Promise<ParallelTaskGroup> {
    const group: ParallelTaskGroup = {
      id: uuidv4(),
      stageId,
      tasks: taskIds,
      completionRule,
      completionThreshold,
      status: 'pending',
    };

    this.parallelGroups.set(group.id, group);
    this.logAudit('stage', stageId, 'parallel_group_created', null, group, 'system');
    
    return group;
  }

  /**
   * Check if parallel group is complete
   */
  async checkParallelGroupCompletion(groupId: string): Promise<{
    isComplete: boolean;
    completedCount: number;
    totalCount: number;
  }> {
    const group = this.parallelGroups.get(groupId);
    if (!group) {
      throw new NotFoundException(`Parallel group ${groupId} not found`);
    }

    const tasks = await this.workflowTaskModel.findAll({
      where: { id: group.tasks },
    });

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const totalCount = group.tasks.length;
    let isComplete = false;

    switch (group.completionRule) {
      case 'all':
        isComplete = completedCount === totalCount;
        break;
      case 'any':
        isComplete = completedCount > 0;
        break;
      case 'percentage':
        isComplete = (completedCount / totalCount) * 100 >= (group.completionThreshold || 100);
        break;
    }

    if (isComplete && group.status !== 'completed') {
      group.status = 'completed';
      this.parallelGroups.set(groupId, group);
      this.logAudit('stage', group.stageId, 'parallel_group_completed', null, group, 'system');
    }

    return { isComplete, completedCount, totalCount };
  }

  /**
   * Get parallel groups for a stage
   */
  getParallelGroups(stageId: string): ParallelTaskGroup[] {
    return Array.from(this.parallelGroups.values()).filter(g => g.stageId === stageId);
  }

  // ==================== 9. TASK REASSIGNMENT ====================

  /**
   * Reassign a single task
   */
  async reassignTask(taskId: string, newAssigneeId: string, reassignedBy: string): Promise<WorkflowTask> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const previousAssignee = task.assigned_to;
    task.assigned_to = newAssigneeId;
    await task.save();

    this.logAudit('task', taskId, 'task_reassigned', 
      { assigned_to: previousAssignee }, 
      { assigned_to: newAssigneeId }, 
      reassignedBy,
    );

    // Notify new assignee
    await this.createNotification('task_assigned', newAssigneeId,
      `Task Reassigned: ${task.title}`,
      'This task has been reassigned to you',
      task.case_id, taskId,
    );

    return task;
  }

  /**
   * Bulk reassign tasks
   */
  async bulkReassignTasks(
    taskIds: string[],
    newAssigneeId: string,
    reassignedBy: string,
  ): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const taskId of taskIds) {
      try {
        await this.reassignTask(taskId, newAssigneeId, reassignedBy);
        success.push(taskId);
      } catch {
        failed.push(taskId);
      }
    }

    return { success, failed };
  }

  /**
   * Reassign all tasks from one user to another
   */
  async reassignAllFromUser(
    fromUserId: string,
    toUserId: string,
    caseId?: string,
    reassignedBy?: string,
  ): Promise<number> {
    const whereClause: any = { assigned_to: fromUserId };
    if (caseId) {whereClause.case_id = caseId;}

    const tasks = await this.workflowTaskModel.findAll({ where: whereClause });
    
    for (const task of tasks) {
      await this.reassignTask(task.id, toUserId, reassignedBy || 'system');
    }

    return tasks.length;
  }

  // ==================== 10. WORKFLOW ANALYTICS ====================

  /**
   * Get comprehensive workflow metrics
   */
  async getWorkflowMetrics(caseId?: string): Promise<WorkflowMetrics> {
    const whereClause: any = {};
    if (caseId) {whereClause.case_id = caseId;}

    const tasks = await this.workflowTaskModel.findAll({ where: whereClause });
    const stages = await this.workflowStageModel.findAll({ where: whereClause });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const now = new Date();
    const overdueTasks = tasks.filter(t => 
      t.status !== 'done' && t.due_date && new Date(t.due_date) < now,
    ).length;

    // Calculate average completion time
    const completedWithTime = tasks.filter(t => t.status === 'done' && t.completed_date && t.created_at);
    const avgTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, t) => 
          sum + (new Date(t.completed_date!).getTime() - new Date(t.created_at).getTime()), 0,
        ) / completedWithTime.length / (1000 * 60 * 60)
      : 0;

    // Count SLA breaches
    const slaBreaches = tasks.filter(t => t.sla_warning).length;

    // Group by priority
    const tasksByPriority: Record<string, number> = {};
    tasks.forEach(t => {
      const priority = t.priority || 'medium';
      tasksByPriority[priority] = (tasksByPriority[priority] || 0) + 1;
    });

    // Group by status
    const tasksByStatus: Record<string, number> = {};
    tasks.forEach(t => {
      const status = t.status || 'pending';
      tasksByStatus[status] = (tasksByStatus[status] || 0) + 1;
    });

    // Group by assignee
    const tasksByAssignee: Record<string, number> = {};
    tasks.forEach(t => {
      const assignee = t.assigned_to || 'unassigned';
      tasksByAssignee[assignee] = (tasksByAssignee[assignee] || 0) + 1;
    });

    // Stage progress
    const stageProgress = stages.map(stage => {
      const stageTasks = tasks.filter(t => t.stage_id === stage.id);
      const completed = stageTasks.filter(t => t.status === 'done').length;
      return {
        stageId: stage.id,
        stageName: stage.name,
        progress: stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0,
      };
    });

    // Timeline data (last 30 days)
    const timelineData: Array<{ date: string; completed: number; created: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = tasks.filter(t => 
        t.completed_date && t.completed_date.toISOString().startsWith(dateStr),
      ).length;
      const created = tasks.filter(t => 
        t.created_at && t.created_at.toISOString().startsWith(dateStr),
      ).length;
      
      timelineData.push({ date: dateStr, completed, created });
    }

    return {
      caseId,
      totalTasks,
      completedTasks,
      overdueTasks,
      averageCompletionTime: Math.round(avgTime * 10) / 10,
      slaBreaches,
      tasksByPriority,
      tasksByStatus,
      tasksByAssignee,
      stageProgress,
      timelineData,
    };
  }

  /**
   * Get task velocity (tasks completed per day)
   */
  async getTaskVelocity(caseId?: string, days = 7): Promise<number> {
    const whereClause: any = { status: 'done' };
    if (caseId) {whereClause.case_id = caseId;}

    const since = new Date();
    since.setDate(since.getDate() - days);
    whereClause.completed_date = { [Op.gte]: since };

    const completed = await this.workflowTaskModel.count({ where: whereClause });
    return Math.round((completed / days) * 10) / 10;
  }

  /**
   * Get bottleneck analysis
   */
  async getBottlenecks(caseId?: string): Promise<{
    slowestStages: Array<{ stageId: string; name: string; avgDays: number }>;
    blockedTasks: Array<{ taskId: string; title: string; blockedBy: string[] }>;
    overloadedUsers: Array<{ userId: string; taskCount: number }>;
  }> {
    const whereClause: any = {};
    if (caseId) {whereClause.case_id = caseId;}

    const stages = await this.workflowStageModel.findAll({ where: whereClause });
    const tasks = await this.workflowTaskModel.findAll({ where: whereClause });

    // Slowest stages (by average task completion time)
    const stageStats = stages.map(stage => {
      const stageTasks = tasks.filter(t => t.stage_id === stage.id && t.status === 'done' && t.completed_date);
      const avgDays = stageTasks.length > 0
        ? stageTasks.reduce((sum, t) => 
            sum + (new Date(t.completed_date!).getTime() - new Date(t.created_at).getTime()), 0,
          ) / stageTasks.length / (1000 * 60 * 60 * 24)
        : 0;
      return { stageId: stage.id, name: stage.name, avgDays: Math.round(avgDays * 10) / 10 };
    });
    const slowestStages = stageStats.sort((a, b) => b.avgDays - a.avgDays).slice(0, 5);

    // Blocked tasks
    const blockedTasks: Array<{ taskId: string; title: string; blockedBy: string[] }> = [];
    for (const task of tasks.filter(t => t.status !== 'done')) {
      const canStart = await this.canStartTask(task.id);
      if (!canStart.canStart) {
        blockedTasks.push({ taskId: task.id, title: task.title, blockedBy: canStart.blockedBy });
      }
    }

    // Overloaded users
    const userTaskCount: Record<string, number> = {};
    tasks.filter(t => t.status !== 'done' && t.assigned_to).forEach(t => {
      userTaskCount[t.assigned_to!] = (userTaskCount[t.assigned_to!] || 0) + 1;
    });
    const overloadedUsers = Object.entries(userTaskCount)
      .map(([userId, taskCount]) => ({ userId, taskCount }))
      .filter(u => u.taskCount > 5)
      .sort((a, b) => b.taskCount - a.taskCount);

    return { slowestStages, blockedTasks, overloadedUsers };
  }

  // ==================== BACKWARD COMPATIBILITY ====================

  /**
   * Legacy method - get stages with tasks (maintains original API shape)
   */
  async findStages(caseId?: string): Promise<WorkflowStage[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.workflowStageModel.findAll({
      where: whereClause,
      order: [['order', 'ASC']],
      include: [
        {
          model: WorkflowTask,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'assignee',
              attributes: ['id', 'first_name', 'last_name', 'email'],
            },
          ],
        },
      ],
    });
  }

  /**
   * Legacy method - update task with business rules
   */
  async updateTask(taskId: string, updateData: Partial<WorkflowTask>, userId = 'system'): Promise<WorkflowTask> {
    const task = await this.workflowTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const previousData = task.toJSON();

    // Check dependencies before starting
    if (updateData.status === 'in-progress') {
      const canStart = await this.canStartTask(taskId);
      if (!canStart.canStart) {
        throw new BadRequestException(`Task is blocked by: ${canStart.blockedBy.join(', ')}`);
      }
    }

    // Update the task
    await task.update(updateData);
    await task.reload();

    // Log audit
    this.logAudit('task', taskId, 'task_updated', previousData, task.toJSON(), userId);

    // Handle completion
    if (updateData.status === 'done' && previousData.status !== 'done') {
      task.completed_date = new Date();
      await task.save();

      // Auto-log time if enabled
      await this.autoLogTimeOnCompletion(taskId, userId);

      // Check parallel group completion
      const groups = Array.from(this.parallelGroups.values()).filter(g => g.tasks.includes(taskId));
      for (const group of groups) {
        await this.checkParallelGroupCompletion(group.id);
      }
    }

    return task;
  }
}
