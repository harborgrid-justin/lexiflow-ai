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

@Table({
  tableName: 'user_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id'],
      unique: true,
      name: 'idx_user_profiles_user_id_unique',
    },
  ],
})
export class UserProfile extends Model {
  @ApiProperty({ example: 'profile-123', description: 'Unique profile ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'user-123', description: 'Associated user ID' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  user_id: string;

  @ApiProperty({ example: 'Experienced corporate attorney with 10+ years...', description: 'User bio' })
  @Column(DataType.TEXT)
  bio?: string;

  @ApiProperty({ example: '+1-555-0123', description: 'Phone number' })
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty({ example: 'Contract Law,M&A,Corporate Governance', description: 'Skills (comma-separated)' })
  @Column(DataType.TEXT)
  skills?: string;

  @ApiProperty({ example: true, description: 'Email notifications enabled' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  notifications_email: boolean;

  @ApiProperty({ example: true, description: 'Push notifications enabled' })
  @Default(true)
  @Column(DataType.BOOLEAN)
  notifications_push: boolean;

  @ApiProperty({ example: 'daily', description: 'Digest frequency' })
  @Default('daily')
  @Column(DataType.STRING)
  notifications_digest: string;

  @ApiProperty({ example: 'system', description: 'Theme preference' })
  @Default('system')
  @Column(DataType.STRING)
  theme_preference: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last activity timestamp' })
  @Column(DataType.DATE)
  last_active?: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user?: User;
}