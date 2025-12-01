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
  tableName: 'discovery_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class DiscoveryRequest extends Model {
  @ApiProperty({ example: 'disc-123', description: 'Unique discovery request ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id: string;

  @ApiProperty({ example: 'Document Request #1', description: 'Request title' })
  @Column(DataType.STRING)
  title: string;

  @ApiProperty({ example: 'document_request', description: 'Request type' })
  @Column(DataType.STRING)
  request_type: string;

  @ApiProperty({ example: 'Request for production of documents', description: 'Request description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'served', description: 'Request status' })
  @Default('draft')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'user-123', description: 'Request creator ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z', description: 'Date served' })
  @Column(DataType.DATE)
  served_date?: Date;

  @ApiProperty({ example: '2024-02-15T00:00:00Z', description: 'Response due date' })
  @Column(DataType.DATE)
  due_date?: Date;

  @ApiProperty({ example: '2024-02-10T00:00:00Z', description: 'Response received date' })
  @Column(DataType.DATE)
  response_date?: Date;

  @ApiProperty({ example: 'opposing_counsel', description: 'Recipient party' })
  @Column(DataType.STRING)
  recipient: string;

  @ApiProperty({ example: 'high', description: 'Request priority' })
  @Default('medium')
  @Column(DataType.STRING)
  priority: string;

  @ApiProperty({ example: 'Complete response received', description: 'Response notes' })
  @Column(DataType.TEXT)
  response_notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case)
  case?: Case;

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @BelongsTo(() => User, { foreignKey: 'created_by', as: 'requested_by' })
  requested_by?: User;
}