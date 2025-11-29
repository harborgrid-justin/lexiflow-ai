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

@Table({
  tableName: 'jurisdictions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Jurisdiction extends Model {
  @ApiProperty({ example: 'jur-123', description: 'Unique jurisdiction ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'California', description: 'Jurisdiction name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'state', description: 'Jurisdiction type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'CA', description: 'Jurisdiction code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @ApiProperty({ example: 'State of California jurisdiction', description: 'Jurisdiction description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @ApiProperty({ example: 'jur-usa', description: 'Parent jurisdiction ID' })
  @ForeignKey(() => Jurisdiction)
  @Column(DataType.UUID)
  parent_id?: string;

  @ApiProperty({ example: { 'statute_of_limitations': '2 years' }, description: 'Jurisdiction-specific rules' })
  @Column(DataType.JSONB)
  rules?: any;

  @ApiProperty({ example: 'https://courts.ca.gov', description: 'Court system website' })
  @Column(DataType.STRING)
  court_website?: string;

  @ApiProperty({ example: 'active', description: 'Jurisdiction status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

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

  @BelongsTo(() => Jurisdiction, 'parent_id')
  parent?: Jurisdiction;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}