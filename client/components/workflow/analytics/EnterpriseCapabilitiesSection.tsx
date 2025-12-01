import React from 'react';
import {
  Zap,
  GitBranch,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Bell,
  History,
  Layers,
  Users,
  BarChart3,
} from 'lucide-react';
import type { WorkflowMetrics } from '../../../types/workflow-engine';
import { Badge } from '../../common/Badge';
import { CollapsibleSection } from './CollapsibleSection';

interface EnterpriseCapabilitiesSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  metrics: WorkflowMetrics | null;
}

const CAPABILITIES = [
  { icon: <GitBranch />, title: 'Dependencies' },
  { icon: <Shield />, title: 'SLA Management' },
  { icon: <CheckCircle />, title: 'Approvals' },
  { icon: <ArrowRight />, title: 'Conditions' },
  { icon: <Clock />, title: 'Time Tracking' },
  { icon: <Bell />, title: 'Notifications' },
  { icon: <History />, title: 'Audit Trail' },
  { icon: <Layers />, title: 'Parallel Tasks' },
  { icon: <Users />, title: 'Reassignment' },
  { icon: <BarChart3 />, title: 'Analytics' },
];

export const EnterpriseCapabilitiesSection: React.FC<EnterpriseCapabilitiesSectionProps> = ({
  isExpanded,
  onToggle,
  metrics,
}) => (
  <CollapsibleSection
    title="Enterprise Capabilities"
    icon={<Zap className="h-5 w-5 text-amber-500" />}
    isExpanded={isExpanded}
    onToggle={onToggle}
    badge={<Badge variant="success">10 Active</Badge>}
  >
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4">
      {CAPABILITIES.map(({ icon, title }) => (
        <CapabilityCard
          key={title}
          icon={icon}
          title={title}
          status="active"
          count={title === 'SLA Management' ? metrics?.slaBreaches : undefined}
        />
      ))}
    </div>
  </CollapsibleSection>
);

interface CapabilityCardProps {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'inactive';
  count?: number;
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({ icon, title, status, count }) => (
  <div
    className={`p-3 rounded-lg border text-center ${
      status === 'active' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
    }`}
  >
    <div className={`mb-1 ${status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>{icon}</div>
    <p className="text-xs font-medium text-slate-700">{title}</p>
    {count !== undefined && count > 0 && (
      <Badge variant="error" className="mt-1 text-[10px]">
        {count}
      </Badge>
    )}
  </div>
);
