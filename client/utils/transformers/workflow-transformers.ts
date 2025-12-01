// Workflow and Task Transformers
// Transform ApiTask, ApiWorkflowStage

import { ApiTask, ApiWorkflowStage } from '../../shared-types';
import { WorkflowTask, WorkflowStage } from '../../types';

function mapWorkflowStatus(status: string): 'Pending' | 'Active' | 'Completed' {
  const lowerStatus = status?.toLowerCase() || 'pending';
  if (lowerStatus === 'completed') return 'Completed';
  if (lowerStatus === 'in_progress' || lowerStatus === 'active') return 'Active';
  return 'Pending';
}

export function transformApiTask(apiTask: ApiTask): WorkflowTask {
  const assigneeName = apiTask.assignee 
    ? `${apiTask.assignee.first_name || ''} ${apiTask.assignee.last_name || ''}`.trim()
    : '';
  
  const statusMap: Record<string, 'Pending' | 'In Progress' | 'Done'> = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'in_progress': 'In Progress',
    'done': 'Done',
    'completed': 'Done',
  };
  
  return {
    id: apiTask.id,
    title: apiTask.title,
    status: statusMap[apiTask.status?.toLowerCase()] || 'Pending',
    assignee: assigneeName,
    dueDate: typeof apiTask.due_date === 'string' ? apiTask.due_date : apiTask.due_date?.toISOString() || '',
    priority: apiTask.priority as any,
    caseId: apiTask.case_id,
    description: apiTask.description,
    createdBy: apiTask.created_by,
  };
}

export function transformApiWorkflowStage(apiStage: ApiWorkflowStage): WorkflowStage {
  return {
    id: apiStage.id,
    title: apiStage.name || `Stage ${apiStage.order || 0}`,
    status: mapWorkflowStatus(apiStage.status),
    tasks: (apiStage.tasks || []).map(transformApiTask),
  };
}
