export interface WorkflowTaskTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  priority: 'Low' | 'Medium' | 'High';
  automated: boolean;
  estimatedDays?: number;
  dependencies?: string[];
}

export interface WorkflowStageTemplate {
  id: string;
  title: string;
  description?: string;
  tasks: WorkflowTaskTemplate[];
  color?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Case' | 'Administrative' | 'Custom';
  category: string;
  stages: WorkflowStageTemplate[];
  isPublished: boolean;
  createdBy?: string;
  updatedAt?: string;
}
