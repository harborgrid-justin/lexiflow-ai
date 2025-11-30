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
  tableName: 'audit_log_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id'],
      name: 'idx_audit_log_entries_user_id',
    },
    {
      fields: ['action'],
      name: 'idx_audit_log_entries_action',
    },
    {
      fields: ['resource'],
      name: 'idx_audit_log_entries_resource',
    },
    {
      fields: ['timestamp'],
      name: 'idx_audit_log_entries_timestamp',
    },
    {
      fields: ['ip_address'],
      name: 'idx_audit_log_entries_ip_address',
    },
  ],
})
export class AuditLogEntry extends Model {
  @ApiProperty({ example: 'audit-123', description: 'Unique audit log entry ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Action timestamp' })
  @Column({ type: DataType.DATE, allowNull: false })
  timestamp: Date;

  @ApiProperty({ example: 'user-123', description: 'User who performed the action' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id: string;

  @ApiProperty({ example: 'CREATE', description: 'Action performed' })
  @Column({ type: DataType.STRING, allowNull: false })
  action: string;

  @ApiProperty({ example: 'case', description: 'Resource type affected' })
  @Column({ type: DataType.STRING, allowNull: false })
  resource: string;

  @ApiProperty({ example: 'case-456', description: 'Specific resource ID' })
  @Column(DataType.STRING)
  resource_id?: string;

  @ApiProperty({ example: '192.168.1.100', description: 'IP address of user' })
  @Column({ type: DataType.STRING, allowNull: false })
  ip_address: string;

  @ApiProperty({ example: 'Mozilla/5.0...', description: 'User agent string' })
  @Column(DataType.TEXT)
  user_agent?: string;

  @ApiProperty({ example: 'Created new case: Smith vs Jones', description: 'Action details' })
  @Column(DataType.TEXT)
  details?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user?: User;
}