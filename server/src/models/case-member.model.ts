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
import { Case } from './case.model';
import { User } from './user.model';
import { Organization } from './organization.model';

@Table({
  tableName: 'case_members',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_case_members_case_id',
    },
    {
      fields: ['user_id'],
      name: 'idx_case_members_user_id',
    },
    {
      fields: ['role'],
      name: 'idx_case_members_role',
    },
  ],
})
export class CaseMember extends Model {
  @ApiProperty({ example: 'cm-123', description: 'Unique case member ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  case_id: string;

  @ApiProperty({ example: 'user-456', description: 'Associated user ID' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id: string;

  @ApiProperty({ example: 'Lead', description: 'Role in case team' })
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'When user joined the case' })
  @Column({ type: DataType.DATE, allowNull: false })
  joined_at: Date;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
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

  @BelongsTo(() => User, 'user_id')
  user?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}