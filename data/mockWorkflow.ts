
import { WorkflowStage, WorkflowTask } from '../types';

export const MOCK_STAGES: WorkflowStage[] = [
    { 
        id: 'stage-1', 
        title: 'Case Intake & Conflicts', 
        status: 'Completed', 
        tasks: [
            { 
                id: 't1', title: 'Global Conflict Check', status: 'Done', assignee: 'System', dueDate: '2023-11-16', priority: 'High',
                description: 'Run automated conflict search against new parties.', automatedTrigger: 'New Party Added',
                relatedModule: 'Documents', actionLabel: 'View Report' 
            },
            {
                id: 't1-2', title: 'Engagement Letter Execution', status: 'Done', assignee: 'Partner Alex', dueDate: '2023-11-20', priority: 'High',
                relatedModule: 'Documents', actionLabel: 'View Signed Doc'
            }
        ] 
    },
    { 
        id: 'stage-2', 
        title: 'Discovery Phase', 
        status: 'Active', 
        tasks: [
            { 
                id: 't2', title: 'Review Plaintiff Production', status: 'In Progress', assignee: 'Assoc. Doe', dueDate: '2024-04-01', priority: 'High',
                description: 'Analyze incoming production set for "smoking gun" documents.',
                relatedModule: 'Discovery', actionLabel: 'Open Review Platform'
            },
            { 
                id: 't3', title: 'Schedule CEO Deposition', status: 'Pending', assignee: 'Para. Jenkins', dueDate: '2024-04-15', priority: 'Medium',
                description: 'Coordinate with opposing counsel for dates.',
                relatedModule: 'Motions', actionLabel: 'Draft Notice'
            },
            {
                id: 't4', title: 'Privilege Log Review', status: 'Pending', assignee: 'Assoc. Doe', dueDate: '2024-03-25', priority: 'High',
                description: 'Review withheld documents for proper privilege assertion.',
                relatedModule: 'Discovery', actionLabel: 'Go to Log'
            }
        ]
    },
    {
        id: 'stage-3',
        title: 'Motion Practice',
        status: 'Pending',
        tasks: [
            {
                id: 't5', title: 'Draft Motion for Summary Judgment', status: 'Pending', assignee: 'Senior Partner', dueDate: '2024-05-10', priority: 'High',
                description: 'Prepare MSJ based on lack of causation evidence.',
                relatedModule: 'Motions', actionLabel: 'Start Draft'
            }
        ]
    }
];

// Tasks for calendar view (aggregated)
export const MOCK_TASKS: WorkflowTask[] = [
    { id: 't1', title: 'File Motion to Dismiss', status: 'Pending', assignee: 'Assoc. Doe', dueDate: '2024-03-15', priority: 'High', caseId: 'C-2024-001' },
    { id: 't2', title: 'Client Intake Meeting', status: 'Done', assignee: 'Partner Alex', dueDate: '2024-03-10', priority: 'Medium', caseId: 'C-2024-004' },
    { id: 't3', title: 'Discovery Deadline', status: 'In Progress', assignee: 'Para. Jenkins', dueDate: '2024-03-22', priority: 'High', caseId: 'C-2024-001' },
    { id: 't4', title: 'Settlement Conference', status: 'Pending', assignee: 'Partner Alex', dueDate: '2024-03-28', priority: 'High', caseId: 'C-2023-892' },
];
