import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { WorkflowMetrics } from '../../../types/workflow-engine';
import { Button } from '../../common/Button';

interface SLABreachAlertProps {
  metrics: WorkflowMetrics | null;
  onViewDetails: () => void;
}

export const SLABreachAlert: React.FC<SLABreachAlertProps> = ({ metrics, onViewDetails }) => {
  if (!metrics || metrics.slaBreaches <= 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
      <div className="p-3 bg-red-100 rounded-full">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-red-900">SLA Breaches Detected</h4>
        <p className="text-sm text-red-700">
          {metrics.slaBreaches} task(s) have exceeded their SLA deadlines
        </p>
      </div>
      <Button variant="danger" size="sm" onClick={onViewDetails}>
        View Details
      </Button>
    </div>
  );
};
