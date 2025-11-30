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
import { Jurisdiction } from './jurisdiction.model';

@Table({
  tableName: 'playbooks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['jurisdiction_id'],
      name: 'idx_playbooks_jurisdiction_id',
    },
    {
      fields: ['matter_type'],
      name: 'idx_playbooks_matter_type',
    },
    {
      fields: ['name'],
      name: 'idx_playbooks_name',
    },
  ],
})
export class Playbook extends Model {
  @ApiProperty({ example: 'playbook-123', description: 'Unique playbook ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Commercial Litigation Playbook', description: 'Playbook name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'jurisdiction-456', description: 'Associated jurisdiction ID' })
  @ForeignKey(() => Jurisdiction)
  @Column({ type: DataType.UUID, allowNull: false })
  jurisdiction_id: string;

  @ApiProperty({ example: 'Litigation', description: 'Matter type this playbook applies to' })
  @Column({ type: DataType.STRING, allowNull: false })
  matter_type: string;

  @ApiProperty({ example: 'Standard workflow for commercial litigation cases', description: 'Playbook description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'Active', description: 'Playbook status' })
  @Default('Active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Jurisdiction, 'jurisdiction_id')
  jurisdiction?: Jurisdiction;

  // Has Many relationship to WorkflowStages will be handled by junction table
}