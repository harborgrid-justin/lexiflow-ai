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
  tableName: 'conflict_checks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['entity_name'],
      name: 'idx_conflict_checks_entity_name',
    },
    {
      fields: ['status'],
      name: 'idx_conflict_checks_status',
    },
    {
      fields: ['checked_by'],
      name: 'idx_conflict_checks_checked_by',
    },
    {
      fields: ['check_date'],
      name: 'idx_conflict_checks_check_date',
    },
  ],
})
export class ConflictCheck extends Model {
  @ApiProperty({ example: 'conflict-123', description: 'Unique conflict check ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'ABC Corporation', description: 'Entity name being checked' })
  @Column({ type: DataType.STRING, allowNull: false })
  entity_name: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Date of the check' })
  @Column({ type: DataType.DATE, allowNull: false })
  check_date: Date;

  @ApiProperty({ example: 'Cleared', description: 'Check result status' })
  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @ApiProperty({ example: 'Client Database,Former Cases', description: 'Where potential conflicts were found (comma-separated)' })
  @Column(DataType.TEXT)
  found_in?: string;

  @ApiProperty({ example: 'user-123', description: 'User who performed the check' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  checked_by: string;

  @ApiProperty({ example: 'No conflicts found in client database', description: 'Additional notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, 'checked_by')
  checker?: User;
}