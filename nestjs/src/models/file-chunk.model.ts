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
  tableName: 'file_chunks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['evidence_id'],
      name: 'idx_file_chunks_evidence_id',
    },
    {
      fields: ['page_number'],
      name: 'idx_file_chunks_page_number',
    },
    {
      fields: ['hash'],
      name: 'idx_file_chunks_hash',
    },
  ],
})
export class FileChunk extends Model {
  @ApiProperty({ example: 'chunk-123', description: 'Unique file chunk ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'evidence-456', description: 'Associated evidence ID' })
  @ForeignKey(() => Evidence)
  @Column({ type: DataType.UUID, allowNull: false })
  evidence_id: string;

  @ApiProperty({ example: 1, description: 'Page number in document' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  page_number: number;

  @ApiProperty({ example: 'Dear Mr. Martinez, This letter serves as formal notice of...', description: 'Preview of chunk content' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content_preview: string;

  @ApiProperty({ example: '0xa1b2c3d4e5f6...', description: 'Hash of the chunk content' })
  @Column({ type: DataType.STRING, allowNull: false })
  hash: string;

  @ApiProperty({ example: 1024, description: 'Size of chunk in bytes' })
  @Column(DataType.INTEGER)
  size_bytes?: number;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Evidence, 'evidence_id')
  evidence?: Evidence;
}