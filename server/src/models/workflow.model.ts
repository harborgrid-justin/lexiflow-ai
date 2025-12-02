import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Case } from './case.model';
import { User } from './user.model';
import { Organization } from './organization.model';

@Table({
  tableName: 'workflow_stages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class WorkflowStage extends Model {
  @ApiProperty({ example: 'wfs-123', description: 'Unique workflow stage ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id: string;

  @ApiProperty({ example: 'Discovery', description: 'Stage name' })
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ example: 'Document discovery and depositions', description: 'Stage description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'in-progress', description: 'Stage status' })
  @Default('pending')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 1, description: 'Stage order' })
  @Column(DataType.INTEGER)
  order: number;

  @ApiProperty({ example: '2024-01-15T00:00:00Z', description: 'Stage start date' })
  @Column(DataType.DATE)
  start_date?: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00Z', description: 'Stage due date' })
  @Column(DataType.DATE)
  due_date?: Date;

  @ApiProperty({ example: '2024-03-10T00:00:00Z', description: 'Stage completion date' })
  @Column(DataType.DATE)
  completed_date?: Date;

  @ApiProperty({ example: 'user-123', description: 'Assigned user ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  assigned_to?: string;

  @ApiProperty({ example: 85, description: 'Completion percentage' })
  @Default(0)
  @Column(DataType.INTEGER)
  progress: number;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case)
  case?: Case;

  @BelongsTo(() => User, 'assigned_to')
  assignee?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;

  // Forward reference - WorkflowTask is defined below
  @HasMany(() => WorkflowTask, 'stage_id')
  tasks?: WorkflowTask[];
}

@Table({
  tableName: 'workflow_tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class WorkflowTask extends Model {
  @ApiProperty({ example: 'task-123', description: 'Unique task ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'wfs-123', description: 'Workflow stage ID' })
  @ForeignKey(() => WorkflowStage)
  @Column(DataType.UUID)
  stage_id?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'Review discovery documents', description: 'Task title' })
  @Column(DataType.STRING)
  title: string;

  @ApiProperty({ example: 'Review all discovery documents from opposing counsel', description: 'Task description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'pending', description: 'Task status' })
  @Default('pending')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'high', description: 'Task priority' })
  @Default('medium')
  @Column(DataType.STRING)
  priority: string;

  @ApiProperty({ example: 'user-123', description: 'Assigned user ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  assigned_to?: string;

  @ApiProperty({ example: '2024-01-20T00:00:00Z', description: 'Task due date' })
  @Column(DataType.DATE)
  due_date?: Date;

  @ApiProperty({ example: '2024-01-19T00:00:00Z', description: 'Task completion date' })
  @Column(DataType.DATE)
  completed_date?: Date;

  @ApiProperty({ example: 4.5, description: 'Estimated hours' })
  @Column(DataType.FLOAT)
  estimated_hours?: number;

  @ApiProperty({ example: 3.8, description: 'Actual hours spent' })
  @Column(DataType.FLOAT)
  actual_hours?: number;

  @ApiProperty({ example: false, description: 'Whether this task has SLA warning' })
  @Default(false)
  @Column(DataType.BOOLEAN)
  sla_warning: boolean;

  @ApiProperty({ example: 'deadline_trigger', description: 'Automated trigger that created this task' })
  @Column(DataType.STRING)
  automated_trigger?: string;

  @ApiProperty({ example: 'Documents', description: 'Related module' })
  @Column(DataType.STRING)
  related_module?: string;

  @ApiProperty({ example: 'Review', description: 'Action button label' })
  @Column(DataType.STRING)
  action_label?: string;

  @ApiProperty({ example: 'user-789', description: 'User who created this task' })
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => WorkflowStage, 'stage_id')
  stage?: WorkflowStage;

  @BelongsTo(() => Case)
  case?: Case;

  @BelongsTo(() => User, 'assigned_to')
  assignee?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}