import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'opposing_counsel_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['name'],
      name: 'idx_opposing_counsel_profiles_name',
    },
    {
      fields: ['firm'],
      name: 'idx_opposing_counsel_profiles_firm',
    },
  ],
})
export class OpposingCounselProfile extends Model {
  @ApiProperty({ example: 'counsel-123', description: 'Unique opposing counsel profile ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Robert Johnson', description: 'Opposing counsel name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Johnson & Associates', description: 'Law firm name' })
  @Column({ type: DataType.STRING, allowNull: false })
  firm: string;

  @ApiProperty({ example: 65, description: 'Settlement rate (percentage)' })
  @Column(DataType.DECIMAL(5, 2))
  settlement_rate?: number;

  @ApiProperty({ example: 15, description: 'Trial rate (percentage)' })
  @Column(DataType.DECIMAL(5, 2))
  trial_rate?: number;

  @ApiProperty({ example: 5, description: 'Average settlement variance vs expected (percentage)' })
  @Column(DataType.DECIMAL(5, 2))
  avg_settlement_variance?: number;

  @ApiProperty({ example: 'Aggressive in discovery,Prefers early settlement', description: 'Practice patterns (comma-separated)' })
  @Column(DataType.TEXT)
  practice_patterns?: string;

  @ApiProperty({ example: 'Additional notes about opposing counsel', description: 'General notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;
}