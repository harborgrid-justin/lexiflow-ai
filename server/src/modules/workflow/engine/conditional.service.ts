// Conditional Branching Service
// Handles rule-based workflow routing

import { Injectable } from '@nestjs/common';
import { ConditionalRule, ConditionOperator } from './types';
import { InMemoryStore } from './store';

@Injectable()
export class ConditionalService {
  private rules = new InMemoryStore<ConditionalRule>();

  createRule(rule: Omit<ConditionalRule, 'id'>): ConditionalRule {
    this.validateRule(rule);
    const fullRule: ConditionalRule = {
      ...rule,
      id: this.generateId(),
    };
    this.rules.set(fullRule.id, fullRule);
    return fullRule;
  }

  getRule(ruleId: string): ConditionalRule | undefined {
    return this.rules.get(ruleId);
  }

  getRulesForStage(stageId: string): ConditionalRule[] {
    return this.rules.filter(r => r.stageId === stageId);
  }

  evaluateRule(
    stageId: string,
    context: Record<string, unknown>,
  ): { action: string; value: unknown } | null {
    const stageRules = this.getRulesForStage(stageId);
    if (stageRules.length === 0) {
      return null;
    }

    for (const rule of stageRules) {
      if (this.evaluateCondition(rule.condition, context)) {
        return {
          action: rule.thenAction,
          value: rule.thenValue,
        };
      }
    }

    return null;
  }

  deleteRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  updateRule(
    ruleId: string,
    updates: Partial<Omit<ConditionalRule, 'id'>>,
  ): ConditionalRule | null {
    const existing = this.rules.get(ruleId);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates };
    this.rules.set(ruleId, updated);
    return updated;
  }

  private evaluateCondition(
    condition: { field: string; operator: ConditionOperator; value: unknown },
    context: Record<string, unknown>,
  ): boolean {
    const actualValue = this.getNestedValue(context, condition.field);
    const expectedValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return actualValue === expectedValue;
      case 'greaterThan':
        return Number(actualValue) > Number(expectedValue);
      case 'lessThan':
        return Number(actualValue) < Number(expectedValue);
      case 'contains':
        return String(actualValue).includes(String(expectedValue));
      case 'isEmpty':
        return !actualValue || actualValue === '' || actualValue === null;
      case 'isNotEmpty':
        return actualValue !== null && actualValue !== '' && actualValue !== undefined;
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((curr, key) => {
      if (curr && typeof curr === 'object' && key in curr) {
        return (curr as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  private validateRule(rule: Omit<ConditionalRule, 'id'>): void {
    if (!rule.stageId) {
      throw new Error('stageId is required');
    }
    if (!rule.condition) {
      throw new Error('condition is required');
    }
    if (!rule.thenAction) {
      throw new Error('thenAction is required');
    }
  }

  private generateId(): string {
    return `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
