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
import { Case } from './case.model';
import { User } from './user.model';

@Table({
  tableName: 'motions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Motion extends Model {
  @ApiProperty({ example: 'motion-123', description: 'Unique motion ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id: string;

  @ApiProperty({ example: 'Motion for Summary Judgment', description: 'Motion title' })
  @Column(DataType.STRING)
  title: string;

  @ApiProperty({ example: 'summary_judgment', description: 'Motion type' })
  @Column(DataType.STRING)
  motion_type: string;

  @ApiProperty({ example: 'Summary Judgment', description: 'Motion type for frontend' })
  @Column(DataType.STRING)
  type: string;

  @ApiProperty({ example: '2024-02-01', description: 'Filing date string' })
  @Column(DataType.STRING)
  filing_date?: string;

  @ApiProperty({ example: 'doc-123,doc-456', description: 'Linked document IDs (comma-separated)' })
  @Column(DataType.TEXT)
  documents?: string;

  @ApiProperty({ example: 'John Smith', description: 'Assigned attorney name' })
  @Column(DataType.STRING)
  assigned_attorney?: string;

  @ApiProperty({ example: '2024-02-15', description: 'Opposition due date string' })
  @Column(DataType.STRING)
  opposition_due_date?: string;

  @ApiProperty({ example: '2024-02-25', description: 'Reply due date string' })
  @Column(DataType.STRING)
  reply_due_date?: string;

  @ApiProperty({ example: 'user-789', description: 'User who created this motion' })
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: 'Motion seeking summary judgment on all claims', description: 'Motion description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'draft', description: 'Motion status' })
  @Default('draft')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'user-123', description: 'Filed by user ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  filed_by: string;

  @ApiProperty({ example: '2024-02-01T00:00:00Z', description: 'Filing date' })
  @Column(DataType.DATE)
  filed_date?: Date;

  @ApiProperty({ example: '2024-02-15T00:00:00Z', description: 'Response due date' })
  @Column(DataType.DATE)
  response_due?: Date;

  @ApiProperty({ example: '2024-03-01T10:00:00Z', description: 'Hearing date' })
  @Column(DataType.DATE)
  hearing_date?: Date;

  @ApiProperty({ example: 'Judge Smith', description: 'Assigned judge' })
  @Column(DataType.STRING)
  judge?: string;

  @ApiProperty({ example: 'granted', description: 'Motion outcome' })
  @Column(DataType.STRING)
  outcome?: string;

  @ApiProperty({ example: '/documents/motion-summary-judgment.pdf', description: 'Motion document path' })
  @Column(DataType.STRING)
  document_path?: string;

  @ApiProperty({ example: 'Motion granted with prejudice', description: 'Court notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case)
  case?: Case;

  @BelongsTo(() => User, 'filed_by')
  filer?: User;
}