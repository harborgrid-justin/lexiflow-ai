export type ConditionOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
export type ConditionalAction = 'skipStage' | 'addTask' | 'assignTo' | 'setPriority' | 'notify';

export interface ConditionalRule {
  id: string;
  stageId: string;
  condition: {
    field: string;
    operator: ConditionOperator;
    value: any;
  };
  thenAction: ConditionalAction;
  thenValue: any;
}
