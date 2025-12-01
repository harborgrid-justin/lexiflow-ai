export interface ParallelGroup {
  id: string;
  name: string;
  taskIds: string[];
  completionStrategy: 'all' | 'any' | 'majority';
  nextTaskId?: string;
}
