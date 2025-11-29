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

@Table({
  tableName: 'cases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['owner_org_id'],
      name: 'idx_cases_owner_org_id'
    },
    {
      fields: ['status'],
      name: 'idx_cases_status'
    },
    {
      fields: ['client_name'],
      name: 'idx_cases_client_name'
    },
    {
      fields: ['matter_type'],
      name: 'idx_cases_matter_type'
    },
    {
      fields: ['filing_date'],
      name: 'idx_cases_filing_date'
    },
    {
      fields: ['jurisdiction'],
      name: 'idx_cases_jurisdiction'
    }
  ]
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

  @ApiProperty({ example: 'Hourly', description: 'Billing model for the case' })
  @Column(DataType.STRING)
  billing_model?: string;

  @ApiProperty({ example: 'Hon. Jane Smith', description: 'Presiding judge' })
  @Column(DataType.STRING)
  judge?: string;

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

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}