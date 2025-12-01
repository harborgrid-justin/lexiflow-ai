export interface SLARule {
  id: string;
  name: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  warningHours: number;
  breachHours: number;
  escalateTo?: string;
  autoNotify: boolean;
}

export interface SLAStatus {
  status: 'ok' | 'warning' | 'breached';
  rule?: SLARule;
  hoursRemaining?: number;
  hoursOverdue?: number;
}
