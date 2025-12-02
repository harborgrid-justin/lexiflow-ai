import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Case } from './case.model';
import { User } from './user.model';
import { Organization } from './organization.model';

@Table({
  tableName: 'time_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class TimeEntry extends Model {
  @ApiProperty({ example: 'time-123', description: 'Unique time entry ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id: string;

  @ApiProperty({ example: 'user-123', description: 'User who logged time' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @ApiProperty({ example: '2024-01-15', description: 'Date of work' })
  @Column(DataType.DATEONLY)
  work_date: Date;

  @ApiProperty({ example: '2024-01-15', description: 'Date string for frontend compatibility' })
  @Column(DataType.STRING)
  date: string;

  @ApiProperty({ example: 210, description: 'Duration in minutes' })
  @Column(DataType.INTEGER)
  duration: number;

  @ApiProperty({ example: 3.5, description: 'Hours worked' })
  @Column(DataType.FLOAT)
  hours: number;

  @ApiProperty({ example: 'Document review and analysis', description: 'Description of work performed' })
  @Column(DataType.TEXT)
  description: string;

  @ApiProperty({ example: 'billable', description: 'Entry type' })
  @Default('billable')
  @Column(DataType.STRING)
  entry_type: string;

  @ApiProperty({ example: 350.00, description: 'Billable rate per hour' })
  @Column(DataType.DECIMAL(10, 2))
  rate: number;

  @ApiProperty({ example: 1225.00, description: 'Total amount' })
  @Column(DataType.DECIMAL(10, 2))
  total: number;

  @ApiProperty({ example: 'draft', description: 'Entry status' })
  @Default('draft')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z', description: 'Start time' })
  @Column(DataType.DATE)
  start_time?: Date;

  @ApiProperty({ example: '2024-01-15T12:30:00Z', description: 'End time' })
  @Column(DataType.DATE)
  end_time?: Date;

  @ApiProperty({ example: 'INV-001', description: 'Invoice ID if billed' })
  @Column(DataType.STRING)
  invoice_id?: string;

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

  @BelongsTo(() => User, 'user_id')
  user?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}