import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { User } from './user.model';
import { Case } from './case.model';

@Table({
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_tasks_case_id'
    },
    {
      fields: ['assignee_id'],
      name: 'idx_tasks_assignee_id'
    },
    {
      fields: ['status'],
      name: 'idx_tasks_status'
    },
    {
      fields: ['priority'],
      name: 'idx_tasks_priority'
    },
    {
      fields: ['due_date'],
      name: 'idx_tasks_due_date'
    },
    {
      fields: ['created_by'],
      name: 'idx_tasks_created_by'
    }
  ]
})
export class Task extends Model {
  @ApiProperty({ example: 'task-123', description: 'Unique task ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Review contract provisions', description: 'Task title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'document_review', description: 'Task type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Review all licensing clauses in the software agreement', description: 'Task description' })
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

  @ApiProperty({ example: '2024-02-15T17:00:00Z', description: 'Task due date' })
  @Column(DataType.DATE)
  due_date?: Date;

  @ApiProperty({ example: '2024-02-10T09:00:00Z', description: 'Task start date' })
  @Column(DataType.DATE)
  start_date?: Date;

  @ApiProperty({ example: '2024-02-12T15:30:00Z', description: 'Task completion date' })
  @Column(DataType.DATE)
  completed_date?: Date;

  @ApiProperty({ example: 4, description: 'Estimated hours to complete' })
  @Column(DataType.DECIMAL(5, 2))
  estimated_hours?: number;

  @ApiProperty({ example: 3.5, description: 'Actual hours spent' })
  @Column(DataType.DECIMAL(5, 2))
  actual_hours?: number;

  @ApiProperty({ example: 75, description: 'Task progress percentage' })
  @Default(0)
  @Column(DataType.INTEGER)
  progress: number;

  @ApiProperty({ example: 'Completed review of sections 1-5', description: 'Task completion notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Task assignee ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  assignee_id?: string;

  @ApiProperty({ example: 'user-456', description: 'Task creator ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;

  @BelongsTo(() => User, 'assignee_id')
  assignee?: User;

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}