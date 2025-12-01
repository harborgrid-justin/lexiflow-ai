export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select';

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  defaultValue?: any;
}
