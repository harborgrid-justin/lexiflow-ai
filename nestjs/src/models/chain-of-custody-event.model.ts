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
import { Evidence } from './evidence.model';

@Table({
  tableName: 'chain_of_custody_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['evidence_id'],
      name: 'idx_chain_of_custody_events_evidence_id',
    },
    {
      fields: ['event_date'],
      name: 'idx_chain_of_custody_events_event_date',
    },
    {
      fields: ['action'],
      name: 'idx_chain_of_custody_events_action',
    },
  ],
})
export class ChainOfCustodyEvent extends Model {
  @ApiProperty({ example: 'custody-123', description: 'Unique chain of custody event ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'evidence-456', description: 'Associated evidence ID' })
  @ForeignKey(() => Evidence)
  @Column({ type: DataType.UUID, allowNull: false })
  evidence_id: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Event date and time' })
  @Column({ type: DataType.DATE, allowNull: false })
  event_date: Date;

  @ApiProperty({ example: 'Collected from Client', description: 'Action performed' })
  @Column({ type: DataType.STRING, allowNull: false })
  action: string;

  @ApiProperty({ example: 'Alexandra H.', description: 'Person who performed the action' })
  @Column({ type: DataType.STRING, allowNull: false })
  actor: string;

  @ApiProperty({ example: 'Evidence sealed and tagged', description: 'Additional notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: 'Office location', description: 'Where the action took place' })
  @Column(DataType.STRING)
  location?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Evidence, 'evidence_id')
  evidence?: Evidence;
}