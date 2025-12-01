// Custom Fields Service
// User-defined fields for tasks and stages

import { Injectable } from '@nestjs/common';
import { CustomFieldDefinition, CustomFieldValue } from './types';
import { InMemoryStore } from './store';

@Injectable()
export class CustomFieldsService {
  private definitions = new InMemoryStore<CustomFieldDefinition>();
  private values = new InMemoryStore<CustomFieldValue>();

  createFieldDefinition(
    data: Omit<CustomFieldDefinition, 'id'>,
  ): CustomFieldDefinition {
    this.validateDefinition(data);

    const definition: CustomFieldDefinition = {
      ...data,
      id: this.generateId('field'),
    };
    this.definitions.set(definition.id, definition);
    return definition;
  }

  getFieldDefinition(id: string): CustomFieldDefinition | undefined {
    return this.definitions.get(id);
  }

  getAllFieldDefinitions(): CustomFieldDefinition[] {
    return this.definitions.values();
  }

  getFieldsForEntityType(
    entityType: 'task' | 'stage',
  ): CustomFieldDefinition[] {
    return this.definitions.filter(
      d => d.appliesTo === entityType || d.appliesTo === 'both',
    );
  }

  updateFieldDefinition(
    id: string,
    updates: Partial<CustomFieldDefinition>,
  ): CustomFieldDefinition | null {
    const existing = this.definitions.get(id);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates, id: existing.id };
    this.definitions.set(id, updated);
    return updated;
  }

  deleteFieldDefinition(id: string): boolean {
    // Also delete all values for this field
    const valuesToDelete = this.values.filter(v => v.fieldId === id);
    valuesToDelete.forEach(v => this.values.delete(`${v.entityType}_${v.entityId}_${v.fieldId}`));
    return this.definitions.delete(id);
  }

  setFieldValue(
    fieldId: string,
    entityType: 'task' | 'stage',
    entityId: string,
    value: unknown,
    updatedBy: string,
  ): CustomFieldValue {
    const definition = this.definitions.get(fieldId);
    if (!definition) {
      throw new Error(`Field definition not found: ${fieldId}`);
    }

    // Validate value against definition
    this.validateValue(definition, value);

    const key = `${entityType}_${entityId}_${fieldId}`;
    const fieldValue: CustomFieldValue = {
      fieldId,
      entityType,
      entityId,
      value,
      updatedAt: new Date(),
      updatedBy,
    };

    this.values.set(key, fieldValue);
    return fieldValue;
  }

  getFieldValue(
    fieldId: string,
    entityType: 'task' | 'stage',
    entityId: string,
  ): CustomFieldValue | undefined {
    const key = `${entityType}_${entityId}_${fieldId}`;
    return this.values.get(key);
  }

  getEntityFields(
    entityType: 'task' | 'stage',
    entityId: string,
  ): Array<{ definition: CustomFieldDefinition; value?: CustomFieldValue }> {
    const applicableFields = this.getFieldsForEntityType(entityType);

    return applicableFields.map(definition => ({
      definition,
      value: this.getFieldValue(definition.id, entityType, entityId),
    }));
  }

  deleteFieldValue(
    fieldId: string,
    entityType: 'task' | 'stage',
    entityId: string,
  ): boolean {
    const key = `${entityType}_${entityId}_${fieldId}`;
    return this.values.delete(key);
  }

  private validateDefinition(data: Omit<CustomFieldDefinition, 'id'>): void {
    if (!data.name?.trim()) {
      throw new Error('Field name is required');
    }
    if (!data.type) {
      throw new Error('Field type is required');
    }
    if (
      (data.type === 'select' || data.type === 'multiselect') &&
      (!data.options || data.options.length === 0)
    ) {
      throw new Error('Options required for select/multiselect fields');
    }
  }

  private validateValue(
    definition: CustomFieldDefinition,
    value: unknown,
  ): void {
    if (definition.required && (value === null || value === undefined)) {
      throw new Error(`Field ${definition.name} is required`);
    }

    if (value === null || value === undefined) {
      return;
    }

    switch (definition.type) {
      case 'number':
        if (typeof value !== 'number') {
          throw new Error(`Field ${definition.name} must be a number`);
        }
        break;
      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(String(value)))) {
          throw new Error(`Field ${definition.name} must be a valid date`);
        }
        break;
      case 'checkbox':
        if (typeof value !== 'boolean') {
          throw new Error(`Field ${definition.name} must be boolean`);
        }
        break;
      case 'select':
        if (!definition.options?.includes(String(value))) {
          throw new Error(`Invalid option for field ${definition.name}`);
        }
        break;
      case 'multiselect':
        if (!Array.isArray(value)) {
          throw new Error(`Field ${definition.name} must be an array`);
        }
        break;
      case 'url':
        try {
          new URL(String(value));
        } catch {
          throw new Error(`Field ${definition.name} must be a valid URL`);
        }
        break;
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
