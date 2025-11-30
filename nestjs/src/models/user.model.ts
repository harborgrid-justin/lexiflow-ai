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
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['email'],
      unique: true,
      name: 'idx_users_email_unique',
    },
    {
      fields: ['organization_id'],
      name: 'idx_users_organization_id',
    },
    {
      fields: ['role'],
      name: 'idx_users_role',
    },
    {
      fields: ['status'],
      name: 'idx_users_status',
    },
  ],
})
export class User extends Model {
  @ApiProperty({ example: 'user-123', description: 'Unique user ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column({ type: DataType.STRING, allowNull: false })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column({ type: DataType.STRING, allowNull: false })
  last_name: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'john.doe@lawfirm.com', description: 'Email address' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @ApiProperty({ example: 'hashed_password', description: 'Hashed password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password_hash: string;

  @ApiProperty({ example: 'Attorney', description: 'User role in the organization' })
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @ApiProperty({ example: 'Partner', description: 'Position or title' })
  @Column(DataType.STRING)
  position?: string;

  @ApiProperty({ example: 'California', description: 'Bar admission state' })
  @Column(DataType.STRING)
  bar_admission?: string;

  @ApiProperty({ example: '123456', description: 'Bar number' })
  @Column(DataType.STRING)
  bar_number?: string;

  @ApiProperty({ example: '+1-555-0123', description: 'Phone number' })
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty({ example: 'Corporate law, M&A', description: 'Areas of expertise' })
  @Column(DataType.TEXT)
  expertise?: string;

  @ApiProperty({ example: 'New York Office', description: 'Office location' })
  @Column(DataType.STRING)
  office?: string;

  @ApiProperty({ example: 'Internal', description: 'User type' })
  @Column(DataType.STRING)
  user_type?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'User avatar URL' })
  @Column(DataType.STRING)
  avatar?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last activity timestamp' })
  @Column(DataType.DATE)
  last_active?: Date;

  @ApiProperty({ example: 'Active', description: 'Account status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'org-123', description: 'Organization ID' })
  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID, allowNull: false })
  organization_id: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Organization, 'organization_id')
  organization?: Organization;
}