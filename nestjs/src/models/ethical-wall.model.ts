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
import { Case } from './case.model';

@Table({
  tableName: 'ethical_walls',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_ethical_walls_case_id',
    },
    {
      fields: ['status'],
      name: 'idx_ethical_walls_status',
    },
  ],
})
export class EthicalWall extends Model {
  @ApiProperty({ example: 'wall-123', description: 'Unique ethical wall ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-456', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  case_id: string;

  @ApiProperty({ example: 'Conflict Wall - ABC Corp Matter', description: 'Ethical wall title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'group-123,group-456', description: 'Restricted groups (comma-separated UUIDs)' })
  @Column(DataType.TEXT)
  restricted_groups?: string;

  @ApiProperty({ example: 'user-789,user-101', description: 'Authorized users (comma-separated UUIDs)' })
  @Column(DataType.TEXT)
  authorized_users?: string;

  @ApiProperty({ example: 'Active', description: 'Wall status' })
  @Default('Active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'Wall established due to potential conflict', description: 'Additional notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;
}