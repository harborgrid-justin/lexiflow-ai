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
  tableName: 'consolidated_cases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['lead_case_id'],
      name: 'idx_consolidated_cases_lead_case_id',
    },
    {
      fields: ['member_case_id'],
      name: 'idx_consolidated_cases_member_case_id',
    },
  ],
})
export class ConsolidatedCase extends Model {
  @ApiProperty({ example: 'consolidated-123', description: 'Unique consolidated case relationship ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Lead case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  lead_case_id?: string;

  @ApiProperty({ example: 'case-456', description: 'Member case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  member_case_id?: string;

  @ApiProperty({ example: '24-2160', description: 'Lead case number' })
  @Column({ type: DataType.STRING, allowNull: false })
  lead_case_number: string;

  @ApiProperty({ example: '25-1229', description: 'Member case number' })
  @Column({ type: DataType.STRING, allowNull: false })
  member_case_number: string;

  @ApiProperty({ example: 'Consolidated', description: 'Type of association' })
  @Column({ type: DataType.STRING, allowNull: false })
  association_type: string;

  @ApiProperty({ example: '2025-04-25T00:00:00Z', description: 'Start date of consolidation' })
  @Column({ type: DataType.DATE, allowNull: false })
  date_start: Date;

  @ApiProperty({ example: '2025-09-29T00:00:00Z', description: 'End date of consolidation' })
  @Column(DataType.DATE)
  date_end?: Date;

  @ApiProperty({ example: '2025-04-25T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2025-04-25T10:00:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'lead_case_id')
  leadCase?: Case;

  @BelongsTo(() => Case, 'member_case_id')
  memberCase?: Case;
}
