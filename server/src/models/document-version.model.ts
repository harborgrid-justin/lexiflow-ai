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
import { Document } from './document.model';
import { User } from './user.model';

@Table({
  tableName: 'document_versions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['document_id'],
      name: 'idx_document_versions_document_id',
    },
    {
      fields: ['version_number'],
      name: 'idx_document_versions_version_number',
    },
    {
      fields: ['uploaded_by'],
      name: 'idx_document_versions_uploaded_by',
    },
  ],
})
export class DocumentVersion extends Model {
  @ApiProperty({ example: 'version-123', description: 'Unique document version ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'doc-456', description: 'Parent document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  document_id: string;

  @ApiProperty({ example: 1, description: 'Version number' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  version_number: number;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Upload date' })
  @Column({ type: DataType.DATE, allowNull: false })
  upload_date: Date;

  @ApiProperty({ example: 'user-123', description: 'User who uploaded this version' })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  uploaded_by: string;

  @ApiProperty({ example: 'Added new clauses section', description: 'Version summary' })
  @Column(DataType.TEXT)
  summary?: string;

  @ApiProperty({ example: 'This version contains...', description: 'Content snapshot of this version' })
  @Column(DataType.TEXT)
  content_snapshot?: string;

  @ApiProperty({ example: '/storage/versions/doc-456-v1.pdf', description: 'File path for this version' })
  @Column(DataType.STRING)
  file_path?: string;

  @ApiProperty({ example: 1024000, description: 'File size in bytes' })
  @Column(DataType.INTEGER)
  file_size?: number;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Document, 'document_id')
  document?: Document;

  @BelongsTo(() => User, 'uploaded_by')
  uploader?: User;
}