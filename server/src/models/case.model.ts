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
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { Party } from './party.model';
import { CaseMember } from './case-member.model';
import { DocketEntry } from './docket-entry.model';

@Table({
  tableName: 'cases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['owner_org_id'],
      name: 'idx_cases_owner_org_id',
    },
    {
      fields: ['status'],
      name: 'idx_cases_status',
    },
    {
      fields: ['client_name'],
      name: 'idx_cases_client_name',
    },
    {
      fields: ['matter_type'],
      name: 'idx_cases_matter_type',
    },
    {
      fields: ['filing_date'],
      name: 'idx_cases_filing_date',
    },
    {
      fields: ['jurisdiction'],
      name: 'idx_cases_jurisdiction',
    },
  ],
})
export class Case extends Model {
  @ApiProperty({ example: 'case-123', description: 'Unique case ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Smith vs. Jones Corporation', description: 'Case title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'ABC Corporation', description: 'Client name' })
  @Column({ type: DataType.STRING, allowNull: false })
  client_name: string;

  @ApiProperty({ example: 'Johnson & Associates', description: 'Opposing counsel' })
  @Column(DataType.STRING)
  opposing_counsel?: string;

  @ApiProperty({ example: 'Active', description: 'Case status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z', description: 'Case filing date' })
  @Column(DataType.DATE)
  filing_date?: Date;

  @ApiProperty({ example: 'Contract dispute regarding software licensing', description: 'Case description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 500000, description: 'Case monetary value' })
  @Column(DataType.DECIMAL(15, 2))
  value?: number;

  @ApiProperty({ example: 'Commercial Litigation', description: 'Type of legal matter' })
  @Column(DataType.STRING)
  matter_type?: string;

  @ApiProperty({ example: 'Federal', description: 'Legal jurisdiction' })
  @Column(DataType.STRING)
  jurisdiction?: string;

  @ApiProperty({ example: 'US District Court', description: 'Court name' })
  @Column(DataType.STRING)
  court?: string;

  @ApiProperty({ example: '25-1229', description: 'Docket number' })
  @Column(DataType.STRING)
  docket_number?: string;

  @ApiProperty({ example: '1:24-cv-01442-LMB-IDD', description: 'Originating case number' })
  @Column(DataType.STRING)
  originating_case_number?: string;

  @ApiProperty({ example: '3422 Bankruptcy Appeals Rule', description: 'Nature of suit' })
  @Column(DataType.STRING)
  nature_of_suit?: string;

  @ApiProperty({ example: 'Bankruptcy-District Court', description: 'Case type' })
  @Column(DataType.STRING)
  case_type?: string;

  @ApiProperty({ example: '2025-02-26T00:00:00Z', description: 'Date order judgment' })
  @Column(DataType.DATE)
  date_order_judgment?: Date;

  @ApiProperty({ example: '2025-03-07T00:00:00Z', description: 'Date NOA filed' })
  @Column(DataType.DATE)
  date_noa_filed?: Date;

  @ApiProperty({ example: '2025-03-11T00:00:00Z', description: 'Date received COA' })
  @Column(DataType.DATE)
  date_recv_coa?: Date;

  @ApiProperty({ example: 'fee paid', description: 'Fee status' })
  @Column(DataType.STRING)
  fee_status?: string;

  @ApiProperty({ example: 'Hourly', description: 'Billing model for the case' })
  @Column(DataType.STRING)
  billing_model?: string;

  @ApiProperty({ example: 'Hon. Jane Smith', description: 'Presiding judge' })
  @Column(DataType.STRING)
  judge?: string;

  @ApiProperty({ example: 'Leonie M. Brinkema', description: 'Presiding judge name' })
  @Column(DataType.STRING)
  presiding_judge?: string;

  @ApiProperty({ example: 'Ivan Darnell Davis', description: 'Ordering judge name' })
  @Column(DataType.STRING)
  ordering_judge?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: 'user-123', description: 'User who created the case' })
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;

  // HasMany relationships - these will be loaded when including related models
  @HasMany(() => Party, 'case_id')
  parties?: Party[];

  @HasMany(() => CaseMember, 'case_id')
  caseMembers?: CaseMember[];

  // HasMany relationship for docket entries
  @HasMany(() => DocketEntry, 'case_id')
  docketEntries?: DocketEntry[];

  // HasMany relationship for consolidated cases (as lead)
  consolidatedCases?: any[]; // Will be properly typed when ConsolidatedCase model is imported

  // HasMany relationship for consolidated cases (as member)
  memberOfCases?: any[]; // Will be properly typed when ConsolidatedCase model is imported
}