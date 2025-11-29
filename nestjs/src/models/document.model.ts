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
import { Organization } from './organization.model';
import { User } from './user.model';
import { Case } from './case.model';

@Table({
  tableName: 'documents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_documents_case_id'
    },
    {
      fields: ['owner_org_id'],
      name: 'idx_documents_owner_org_id'
    },
    {
      fields: ['type'],
      name: 'idx_documents_type'
    },
    {
      fields: ['status'],
      name: 'idx_documents_status'
    },
    {
      fields: ['created_by'],
      name: 'idx_documents_created_by'
    },
    {
      fields: ['created_at'],
      name: 'idx_documents_created_at'
    }
  ]
})
export class Document extends Model {
  @ApiProperty({ example: 'doc-123', description: 'Unique document ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Contract Agreement V1.pdf', description: 'Document filename' })
  @Column({ type: DataType.STRING, allowNull: false })
  filename: string;

  @ApiProperty({ example: 'Software License Agreement', description: 'Document title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'Contract', description: 'Document type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Draft', description: 'Document status' })
  @Default('draft')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: '/storage/documents/doc-123.pdf', description: 'File path' })
  @Column({ type: DataType.STRING, allowNull: false })
  file_path: string;

  @ApiProperty({ example: 'application/pdf', description: 'File MIME type' })
  @Column(DataType.STRING)
  mime_type?: string;

  @ApiProperty({ example: 1048576, description: 'File size in bytes' })
  @Column(DataType.INTEGER)
  file_size?: number;

  @ApiProperty({ example: 1, description: 'Document version number' })
  @Default(1)
  @Column(DataType.INTEGER)
  version: number;

  @ApiProperty({ example: 'Initial draft of license agreement', description: 'Version notes' })
  @Column(DataType.TEXT)
  version_notes?: string;

  @ApiProperty({ example: 'Case filing document', description: 'Document description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'contract, license, agreement', description: 'Document tags' })
  @Column(DataType.STRING)
  tags?: string;

  @ApiProperty({ example: 'Confidential', description: 'Security classification' })
  @Column(DataType.STRING)
  classification?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Document creator ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: 'user-456', description: 'Last modified by user ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  modified_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @BelongsTo(() => User, 'modified_by')
  modifier?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}