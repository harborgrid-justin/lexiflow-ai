
import { WorkflowStage, WorkflowTask } from '../types';

export const MOCK_STAGES: WorkflowStage[] = [
    { id: 'stage-1', title: 'Case Intake', status: 'Completed', tasks: [{ id: 't1', title: 'Conflict Check', status: 'Done', assignee: 'Admin', dueDate: '2023-11-16', priority: 'High' }] },
    { id: 'stage-2', title: 'Discovery', status: 'Active', tasks: [
        { id: 't2', title: 'Review Plaintiff Docs', status: 'In Progress', assignee: 'Assoc. Doe', dueDate: '2024-04-01', priority: 'High' },
        { id: 't3', title: 'Schedule Depositions', status: 'Pending', assignee: 'Para. Jenkins', dueDate: '2024-04-15', priority: 'Medium' }
    ]}
];

// Tasks for calendar view (aggregated)
export const MOCK_TASKS: WorkflowTask[] = [
    { id: 't1', title: 'File Motion to Dismiss', status: 'Pending', assignee: 'Assoc. Doe', dueDate: '2024-03-15', priority: 'High', caseId: 'C-2024-001' },
    { id: 't2', title: 'Client Intake Meeting', status: 'Done', assignee: 'Partner Alex', dueDate: '2024-03-10', priority: 'Medium', caseId: 'C-2024-004' },
    { id: 't3', title: 'Discovery Deadline', status: 'In Progress', assignee: 'Para. Jenkins', dueDate: '2024-03-22', priority: 'High', caseId: 'C-2024-001' },
    { id: 't4', title: 'Settlement Conference', status: 'Pending', assignee: 'Partner Alex', dueDate: '2024-03-28', priority: 'High', caseId: 'C-2023-892' },
];
