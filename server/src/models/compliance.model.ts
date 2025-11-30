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
  tableName: 'compliance_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ComplianceRecord extends Model {
  @ApiProperty({ example: 'compliance-123', description: 'Unique compliance record ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Document Review Compliance', description: 'Compliance title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'document_review', description: 'Compliance type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Compliant', description: 'Compliance status' })
  @Default('pending')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'Federal Rule 26(f) compliance check', description: 'Compliance description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'Federal Rules of Civil Procedure', description: 'Regulation source' })
  @Column(DataType.STRING)
  regulation?: string;

  @ApiProperty({ example: 'Rule 26(f)', description: 'Specific rule reference' })
  @Column(DataType.STRING)
  rule_reference?: string;

  @ApiProperty({ example: '2024-02-15T00:00:00Z', description: 'Compliance deadline' })
  @Column(DataType.DATE)
  deadline?: Date;

  @ApiProperty({ example: '2024-02-10T14:30:00Z', description: 'Compliance check date' })
  @Column(DataType.DATE)
  check_date?: Date;

  @ApiProperty({ example: 'All discovery documents properly reviewed and logged', description: 'Check results' })
  @Column(DataType.TEXT)
  check_results?: string;

  @ApiProperty({ example: 'high', description: 'Risk level assessment' })
  @Column(DataType.STRING)
  risk_level?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Compliance officer ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  officer_id?: string;

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

  @BelongsTo(() => User, 'officer_id')
  officer?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}