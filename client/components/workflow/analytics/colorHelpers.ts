export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'done':
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
    case 'active':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-slate-400';
    case 'review':
      return 'bg-amber-500';
    default:
      return 'bg-slate-300';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-slate-300';
  }
};
