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
  tableName: 'groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['org_id'],
      name: 'idx_groups_org_id',
    },
    {
      fields: ['name'],
      name: 'idx_groups_name',
    },
  ],
})
export class Group extends Model {
  @ApiProperty({ example: 'group-123', description: 'Unique group ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'org-456', description: 'Organization ID this group belongs to' })
  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID, allowNull: false })
  org_id: string;

  @ApiProperty({ example: 'Litigation Team', description: 'Group name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Handles all litigation matters', description: 'Group description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'case:read,case:write,document:read', description: 'Permissions (comma-separated)' })
  @Column(DataType.TEXT)
  permissions?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Organization, 'org_id')
  organization?: Organization;
}