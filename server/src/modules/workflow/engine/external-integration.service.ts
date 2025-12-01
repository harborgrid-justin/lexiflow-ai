// External Integration Service
// Connect workflows with external systems (webhooks, Slack, etc.)

import { Injectable, Logger } from '@nestjs/common';
import { ExternalIntegration, IntegrationPayload } from './types';
import { InMemoryStore } from './store';
import { CircuitBreaker } from './circuit-breaker';

// Use global fetch in Node 18+ or fall back to http module
const httpFetch = globalThis.fetch || (async () => ({ ok: false, status: 500 }));

@Injectable()
export class ExternalIntegrationService {
  private readonly logger = new Logger(ExternalIntegrationService.name);
  private integrations = new InMemoryStore<ExternalIntegration>();
  private breakers = new Map<string, CircuitBreaker>();

  createIntegration(
    data: Omit<ExternalIntegration, 'id' | 'lastTriggered' | 'errorCount'>,
  ): ExternalIntegration {
    const integration: ExternalIntegration = {
      ...data,
      id: this.generateId(),
      errorCount: 0,
    };
    this.integrations.set(integration.id, integration);
    this.breakers.set(integration.id, new CircuitBreaker());
    return integration;
  }

  getIntegration(id: string): ExternalIntegration | undefined {
    return this.integrations.get(id);
  }

  getAllIntegrations(): ExternalIntegration[] {
    return this.integrations.values();
  }

  updateIntegration(
    id: string,
    updates: Partial<ExternalIntegration>,
  ): ExternalIntegration | null {
    const existing = this.integrations.get(id);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates, id: existing.id };
    this.integrations.set(id, updated);
    return updated;
  }

  deleteIntegration(id: string): boolean {
    this.breakers.delete(id);
    return this.integrations.delete(id);
  }

  async triggerEvent(
    event: string,
    data: Record<string, unknown>,
  ): Promise<{ success: string[]; failed: string[] }> {
    const applicable = this.integrations.filter(
      i => i.enabled && i.triggers.includes(event),
    );

    const results = { success: [] as string[], failed: [] as string[] };

    await Promise.all(
      applicable.map(async integration => {
        const breaker = this.breakers.get(integration.id);
        if (!breaker) {
          return;
        }

        try {
          await breaker.execute(() =>
            this.sendToIntegration(integration, event, data),
          );

          integration.lastTriggered = new Date();
          integration.errorCount = 0;
          this.integrations.set(integration.id, integration);
          results.success.push(integration.id);
        } catch (error) {
          integration.errorCount++;
          this.integrations.set(integration.id, integration);
          results.failed.push(integration.id);
          this.logger.error(`Integration ${integration.id} failed`, error);
        }
      }),
    );

    return results;
  }

  private async sendToIntegration(
    integration: ExternalIntegration,
    event: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const payload: IntegrationPayload = {
      event,
      timestamp: new Date(),
      data,
      source: 'lexiflow-workflow',
    };

    switch (integration.type) {
      case 'webhook':
        await this.sendWebhook(integration.config, payload);
        break;
      case 'slack':
        await this.sendSlack(integration.config, payload);
        break;
      case 'teams':
        await this.sendTeams(integration.config, payload);
        break;
      case 'email':
        await this.sendEmail(integration.config, payload);
        break;
      case 'zapier':
        await this.sendZapier(integration.config, payload);
        break;
      default:
        this.logger.warn(`Unknown integration type: ${integration.type}`);
    }
  }

  private async sendWebhook(
    config: Record<string, unknown>,
    payload: IntegrationPayload,
  ): Promise<void> {
    const url = config.url as string;
    const headers = (config.headers as Record<string, string>) || {};

    const response = await httpFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  }

  private async sendSlack(
    config: Record<string, unknown>,
    payload: IntegrationPayload,
  ): Promise<void> {
    const webhookUrl = config.webhookUrl as string;
    const channel = config.channel as string;

    await httpFetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        text: `Workflow Event: ${payload.event}`,
        attachments: [{ text: JSON.stringify(payload.data, null, 2) }],
      }),
    });
  }

  private async sendTeams(
    config: Record<string, unknown>,
    payload: IntegrationPayload,
  ): Promise<void> {
    const webhookUrl = config.webhookUrl as string;

    await httpFetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '@type': 'MessageCard',
        summary: `Workflow: ${payload.event}`,
        sections: [{ text: JSON.stringify(payload.data, null, 2) }],
      }),
    });
  }

  private async sendEmail(
    config: Record<string, unknown>,
    payload: IntegrationPayload,
  ): Promise<void> {
    // Email sending would integrate with email service
    this.logger.log(`Email integration: ${payload.event}`, config);
  }

  private async sendZapier(
    config: Record<string, unknown>,
    payload: IntegrationPayload,
  ): Promise<void> {
    const webhookUrl = config.webhookUrl as string;

    await httpFetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  private generateId(): string {
    return `integ_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
