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
import { Organization } from './organization.model';
import { User } from './user.model';
import { Document } from './document.model';

@Table({
  tableName: 'document_analysis',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class DocumentAnalysis extends Model {
  @ApiProperty({ example: 'analysis-123', description: 'Unique analysis ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'doc-123', description: 'Associated document ID' })
  @ForeignKey(() => Document)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  document_id: string;

  @ApiProperty({ example: 'contract_analysis', description: 'Type of analysis performed' })
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  analysis_type: string;

  @ApiProperty({ example: 'completed', description: 'Status of the analysis' })
  @Default('pending')
  @Index
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: { 'key_terms': ['liability', 'indemnification'], 'risk_score': 7.5 }, description: 'Analysis results' })
  @Column(DataType.JSONB)
  results?: Record<string, unknown>;

  @ApiProperty({ example: 0.95, description: 'Confidence score of the analysis' })
  @Column(DataType.DECIMAL(5, 4))
  confidence_score?: number;

  @ApiProperty({ example: 'gpt-4', description: 'AI model used for analysis' })
  @Column({ type: DataType.STRING, allowNull: false })
  model_used: string;

  @ApiProperty({ example: '1.2.3', description: 'Version of the analysis model' })
  @Column(DataType.STRING)
  model_version?: string;

  @ApiProperty({ example: 'High risk clauses identified in sections 5 and 12', description: 'Summary of findings' })
  @Column(DataType.TEXT)
  summary?: string;

  @ApiProperty({ example: 'contract, risk_assessment, clause_extraction', description: 'Analysis tags' })
  @Column(DataType.STRING)
  tags?: string;

  @ApiProperty({ example: 'user-123', description: 'User who initiated the analysis' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  initiated_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'When analysis started' })
  @Column(DataType.DATE)
  started_at?: Date;

  @ApiProperty({ example: '2024-01-15T10:05:00Z', description: 'When analysis completed' })
  @Column(DataType.DATE)
  completed_at?: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Document, 'document_id')
  document?: Document;

  @BelongsTo(() => User, 'initiated_by')
  initiator?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}