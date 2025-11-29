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
import { User } from './user.model';
import { Group } from './group.model';

@Table({
  tableName: 'user_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id'],
      name: 'idx_user_groups_user_id',
    },
    {
      fields: ['group_id'],
      name: 'idx_user_groups_group_id',
    },
    {
      fields: ['user_id', 'group_id'],
      unique: true,
      name: 'idx_user_groups_user_group_unique',
    },
  ],
})
export class UserGroup extends Model {
  @ApiProperty({ example: 'ug-123', description: 'Unique user-group relation ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'user-123', description: 'User ID' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id: string;

  @ApiProperty({ example: 'group-456', description: 'Group ID' })
  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, allowNull: false })
  group_id: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'When user joined the group' })
  @Column({ type: DataType.DATE, allowNull: false })
  joined_at: Date;

  @ApiProperty({ example: 'Member', description: 'Role in the group' })
  @Default('Member')
  @Column(DataType.STRING)
  role: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user?: User;

  @BelongsTo(() => Group, 'group_id')
  group?: Group;
}