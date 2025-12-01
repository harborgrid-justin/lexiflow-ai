// Approval Workflow Service
// Multi-level approval chains with sequential flow

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { ApprovalChain, ApprovalStep } from './types';
import { InMemoryStore, generateId } from './store';
import { TaskNotFoundError, ApprovalError } from './errors';

@Injectable()
export class ApprovalService {
  private chains = new InMemoryStore<ApprovalChain>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
  ) {}

  async createChain(
    taskId: string,
    approverIds: string[],
  ): Promise<ApprovalChain> {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    if (approverIds.length === 0) {
      throw new ApprovalError('At least one approver is required', taskId);
    }

    const steps: ApprovalStep[] = approverIds.map((approverId, index) => ({
      id: generateId('step'),
      order: index + 1,
      approverId,
      status: 'pending',
    }));

    const chain: ApprovalChain = {
      taskId,
      steps,
      currentStep: 0,
      status: 'pending',
    };

    this.chains.set(taskId, chain);
    return chain;
  }

  async processApproval(
    taskId: string,
    approverId: string,
    action: 'approve' | 'reject',
    comments?: string,
  ): Promise<ApprovalChain> {
    const chain = this.chains.get(taskId);
    if (!chain) {
      throw new ApprovalError('No approval chain found', taskId);
    }

    const currentStep = chain.steps[chain.currentStep];
    if (!currentStep) {
      throw new ApprovalError('Invalid approval step', taskId);
    }

    if (currentStep.approverId !== approverId) {
      throw new ApprovalError(
        'You are not authorized to approve this step',
        taskId,
        approverId,
      );
    }

    if (currentStep.status !== 'pending') {
      throw new ApprovalError('Step already processed', taskId, approverId);
    }

    // Update the step
    currentStep.status = action === 'approve' ? 'approved' : 'rejected';
    currentStep.approvedAt = new Date();
    currentStep.comments = comments;

    if (action === 'reject') {
      chain.status = 'rejected';
    } else if (chain.currentStep < chain.steps.length - 1) {
      // Move to next step
      chain.currentStep++;
    } else {
      // All steps approved
      chain.status = 'approved';
      await this.taskModel.update(
        { status: 'done', completed_date: new Date() },
        { where: { id: taskId } },
      );
    }

    this.chains.set(taskId, chain);
    return chain;
  }

  getChain(taskId: string): ApprovalChain | undefined {
    return this.chains.get(taskId);
  }

  getCurrentApprover(taskId: string): string | undefined {
    const chain = this.chains.get(taskId);
    if (!chain || chain.status !== 'pending') {
      return undefined;
    }
    return chain.steps[chain.currentStep]?.approverId;
  }

  async getPendingApprovals(approverId: string): Promise<ApprovalChain[]> {
    return this.chains.filter(chain => {
      if (chain.status !== 'pending') {return false;}
      const currentStep = chain.steps[chain.currentStep];
      return currentStep?.approverId === approverId;
    });
  }

  deleteChain(taskId: string): boolean {
    return this.chains.delete(taskId);
  }

  async resetChain(taskId: string): Promise<ApprovalChain | undefined> {
    const chain = this.chains.get(taskId);
    if (!chain) {return undefined;}

    chain.currentStep = 0;
    chain.status = 'pending';
    chain.steps.forEach(step => {
      step.status = 'pending';
      step.approvedAt = undefined;
      step.comments = undefined;
    });

    this.chains.set(taskId, chain);
    return chain;
  }
}
