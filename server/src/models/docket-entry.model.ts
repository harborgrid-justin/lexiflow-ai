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
  tableName: 'docket_entries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_docket_entries_case_id',
    },
    {
      fields: ['date_filed'],
      name: 'idx_docket_entries_date_filed',
    },
    {
      fields: ['entry_number'],
      name: 'idx_docket_entries_entry_number',
    },
  ],
})
export class DocketEntry extends Model {
  @ApiProperty({ example: 'docket-entry-123', description: 'Unique docket entry ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  case_id: string;

  @ApiProperty({ example: 1, description: 'Docket entry number' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  entry_number: number;

  @ApiProperty({ example: '2025-03-12T00:00:00Z', description: 'Date filed' })
  @Column({ type: DataType.DATE, allowNull: false })
  date_filed: Date;

  @ApiProperty({ example: 'Case docketed. Originating case number: 1:24-cv-01442-LMB-IDD', description: 'Docket text/description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @ApiProperty({ example: 'https://ecf.ca4.uscourts.gov/docs1/004010166501', description: 'Document link' })
  @Column(DataType.STRING)
  doc_link?: string;

  @ApiProperty({ example: 10, description: 'Number of pages' })
  @Column(DataType.INTEGER)
  pages?: number;

  @ApiProperty({ example: '1.2 MB', description: 'File size' })
  @Column(DataType.STRING)
  file_size?: string;

  @ApiProperty({ example: 'MOTION', description: 'Document type/category' })
  @Column(DataType.STRING)
  document_type?: string;

  @ApiProperty({ example: '[1001734848]', description: 'CM/ECF document ID' })
  @Column(DataType.STRING)
  cmecf_id?: string;

  @ApiProperty({ example: 'AW', description: 'Clerk initials' })
  @Column(DataType.STRING)
  clerk_initials?: string;

  @ApiProperty({ example: '2025-03-12T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2025-03-12T10:00:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;
}
