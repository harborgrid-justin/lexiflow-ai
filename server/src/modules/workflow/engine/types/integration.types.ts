export type IntegrationEventType = 'task.created' | 'task.completed' | 'task.updated' | 'stage.completed' | 'workflow.completed';

export interface ExternalIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'email' | 'slack';
  enabled: boolean;
  config: {
    url?: string;
    apiKey?: string;
    email?: string;
    channel?: string;
  };
  events: IntegrationEventType[];
}
