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
  tableName: 'analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Analytics extends Model {
  @ApiProperty({ example: 'analytics-123', description: 'Unique analytics record ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case_outcome_prediction', description: 'Analytics metric type' })
  @Column({ type: DataType.STRING, allowNull: false })
  metric_type: string;

  @ApiProperty({ example: 'Case Outcome Analysis', description: 'Analytics title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: { prediction: 'favorable', confidence: 0.85 }, description: 'Analytics data' })
  @Column(DataType.JSONB)
  data?: Record<string, unknown>;

  @ApiProperty({ example: 'monthly', description: 'Aggregation period' })
  @Column(DataType.STRING)
  period?: string;

  @ApiProperty({ example: '2024-01', description: 'Period identifier' })
  @Column(DataType.STRING)
  period_value?: string;

  @ApiProperty({ example: 'Judge Smith has a 75% favorable ruling rate', description: 'Analytics insights' })
  @Column(DataType.TEXT)
  insights?: string;

  @ApiProperty({ example: 0.85, description: 'Confidence score for analytics' })
  @Column(DataType.DECIMAL(3, 2))
  confidence_score?: number;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Analytics creator ID' })
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

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}