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
  tableName: 'judge_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['name'],
      name: 'idx_judge_profiles_name',
    },
    {
      fields: ['court'],
      name: 'idx_judge_profiles_court',
    },
  ],
})
export class JudgeProfile extends Model {
  @ApiProperty({ example: 'judge-123', description: 'Unique judge profile ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Hon. Jane Smith', description: 'Judge name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'US District Court', description: 'Court name' })
  @Column({ type: DataType.STRING, allowNull: false })
  court: string;

  @ApiProperty({ example: 25, description: 'Grant rate for dismiss motions (percentage)' })
  @Column(DataType.DECIMAL(5, 2))
  grant_rate_dismiss?: number;

  @ApiProperty({ example: 40, description: 'Grant rate for summary judgment motions (percentage)' })
  @Column(DataType.DECIMAL(5, 2))
  grant_rate_summary?: number;

  @ApiProperty({ example: 180, description: 'Average case duration in days' })
  @Column(DataType.INTEGER)
  avg_case_duration?: number;

  @ApiProperty({ example: 'Strict on procedural rules,Favors settlement conferences', description: 'Judge tendencies (comma-separated)' })
  @Column(DataType.TEXT)
  tendencies?: string;

  @ApiProperty({ example: 'Additional notes about the judge', description: 'General notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;
}