import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'organizations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['name'],
      name: 'idx_organizations_name'
    },
    {
      fields: ['status'],
      name: 'idx_organizations_status'
    },
    {
      fields: ['type'],
      name: 'idx_organizations_type'
    }
  ]
})
export class Organization extends Model {
  @ApiProperty({ example: 'org-123', description: 'Unique organization ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Smith & Associates Law Firm', description: 'Organization name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Law Firm', description: 'Type of organization' })
  @Column(DataType.STRING)
  type?: string;

  @ApiProperty({ example: '123 Main Street, Suite 100, New York, NY 10001', description: 'Organization address' })
  @Column(DataType.TEXT)
  address?: string;

  @ApiProperty({ example: '+1-555-0100', description: 'Phone number' })
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty({ example: 'contact@smithlawfirm.com', description: 'Email address' })
  @Column(DataType.STRING)
  email?: string;

  @ApiProperty({ example: 'www.smithlawfirm.com', description: 'Website URL' })
  @Column(DataType.STRING)
  website?: string;

  @ApiProperty({ example: 'Premium', description: 'Subscription tier' })
  @Column(DataType.STRING)
  subscription_tier?: string;

  @ApiProperty({ example: 'Active', description: 'Organization status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'Corporate law, Litigation, Real Estate', description: 'Practice areas' })
  @Column(DataType.TEXT)
  practice_areas?: string;

  @ApiProperty({ example: '12-3456789', description: 'Tax ID number' })
  @Column(DataType.STRING)
  tax_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;
}