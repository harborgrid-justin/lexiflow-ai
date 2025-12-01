// Analytics Service
// Workflow performance metrics and insights

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { WorkflowStage, WorkflowTask } from '../../../models/workflow.model';
import { WorkflowMetrics, StageProgress, TimelineDataPoint } from './types';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(WorkflowStage)
    private stageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
  ) {}

  async getMetrics(caseId?: string): Promise<WorkflowMetrics> {
    const whereClause: any = {};
    if (caseId) {
      whereClause.case_id = caseId;
    }

    const [tasks, stages] = await Promise.all([
      this.taskModel.findAll({ where: whereClause }),
      this.stageModel.findAll({ where: whereClause }),
    ]);

    const now = new Date();
    const completedTasks = tasks.filter(t => t.status === 'done');
    const overdueTasks = tasks.filter(
      t => t.status !== 'done' && t.due_date && new Date(t.due_date) < now,
    );

    // Average completion time
    const avgTime = this.calculateAverageCompletionTime(completedTasks);

    // Task distributions
    const tasksByPriority = this.groupBy(tasks, t => t.priority || 'medium');
    const tasksByStatus = this.groupBy(tasks, t => t.status || 'pending');
    const tasksByAssignee = this.groupBy(tasks, t => t.assigned_to || 'unassigned');

    // Stage progress
    const stageProgress = this.calculateStageProgress(stages, tasks);

    // Timeline data
    const timelineData = this.generateTimelineData(tasks, 30);

    return {
      caseId,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      averageCompletionTime: avgTime,
      slaBreaches: tasks.filter(t => t.sla_warning).length,
      tasksByPriority,
      tasksByStatus,
      tasksByAssignee,
      stageProgress,
      timelineData,
    };
  }

  async getVelocity(caseId?: string, days = 7): Promise<number> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const whereClause: any = {
      status: 'done',
      completed_date: { [Op.gte]: since },
    };
    if (caseId) {
      whereClause.case_id = caseId;
    }

    const completed = await this.taskModel.count({ where: whereClause });
    return Math.round((completed / days) * 10) / 10;
  }

  async getBottlenecks(caseId?: string): Promise<{
    slowestStages: Array<{ stageId: string; name: string; avgDays: number }>;
    overloadedUsers: Array<{ userId: string; taskCount: number }>;
  }> {
    const whereClause: any = {};
    if (caseId) {
      whereClause.case_id = caseId;
    }

    const [stages, tasks] = await Promise.all([
      this.stageModel.findAll({ where: whereClause }),
      this.taskModel.findAll({ where: whereClause }),
    ]);

    // Calculate average time per stage
    const slowestStages = stages
      .map(stage => {
        const stageTasks = tasks.filter(
          t => t.stage_id === stage.id && t.status === 'done' && t.completed_date,
        );
        const avgDays =
          stageTasks.length > 0
            ? stageTasks.reduce((sum, t) => {
                const duration =
                  new Date(t.completed_date!).getTime() -
                  new Date(t.created_at).getTime();
                return sum + duration;
              }, 0) /
              stageTasks.length /
              (1000 * 60 * 60 * 24)
            : 0;

        return {
          stageId: stage.id,
          name: stage.name,
          avgDays: Math.round(avgDays * 10) / 10,
        };
      })
      .sort((a, b) => b.avgDays - a.avgDays)
      .slice(0, 5);

    // Find overloaded users
    const userTaskCount: Record<string, number> = {};
    tasks
      .filter(t => t.status !== 'done' && t.assigned_to)
      .forEach(t => {
        userTaskCount[t.assigned_to!] = (userTaskCount[t.assigned_to!] || 0) + 1;
      });

    const overloadedUsers = Object.entries(userTaskCount)
      .map(([userId, taskCount]) => ({ userId, taskCount }))
      .filter(u => u.taskCount > 5)
      .sort((a, b) => b.taskCount - a.taskCount);

    return { slowestStages, overloadedUsers };
  }

  private calculateAverageCompletionTime(tasks: WorkflowTask[]): number {
    const withTime = tasks.filter(t => t.completed_date && t.created_at);
    if (withTime.length === 0) {return 0;}

    const totalHours = withTime.reduce((sum, t) => {
      const duration =
        new Date(t.completed_date!).getTime() - new Date(t.created_at).getTime();
      return sum + duration / (1000 * 60 * 60);
    }, 0);

    return Math.round((totalHours / withTime.length) * 10) / 10;
  }

  private calculateStageProgress(
    stages: WorkflowStage[],
    tasks: WorkflowTask[],
  ): StageProgress[] {
    return stages.map(stage => {
      const stageTasks = tasks.filter(t => t.stage_id === stage.id);
      const completed = stageTasks.filter(t => t.status === 'done').length;
      const progress =
        stageTasks.length > 0
          ? Math.round((completed / stageTasks.length) * 100)
          : 0;

      return {
        stageId: stage.id,
        stageName: stage.name,
        progress,
      };
    });
  }

  private generateTimelineData(
    tasks: WorkflowTask[],
    days: number,
  ): TimelineDataPoint[] {
    const data: TimelineDataPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completed = tasks.filter(
        t => t.completed_date?.toISOString().startsWith(dateStr),
      ).length;
      const created = tasks.filter(
        t => t.created_at?.toISOString().startsWith(dateStr),
      ).length;

      data.push({ date: dateStr, completed, created });
    }

    return data;
  }

  private groupBy<T>(
    items: T[],
    keyFn: (item: T) => string,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    items.forEach(item => {
      const key = keyFn(item);
      result[key] = (result[key] || 0) + 1;
    });
    return result;
  }
}
