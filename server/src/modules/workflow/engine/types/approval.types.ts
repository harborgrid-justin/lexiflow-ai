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
