import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { User } from './user.model';
import { Document } from './document.model';

@Table({
  tableName: 'document_embeddings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class DocumentEmbedding extends Model {
  @ApiProperty({ example: 'emb-123', description: 'Unique embedding ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'doc-123', description: 'Associated document ID' })
  @ForeignKey(() => Document)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  document_id: string;

  @ApiProperty({ example: 'This is a sample text chunk from the document...', description: 'Text chunk content' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @ApiProperty({ example: '[0.1, 0.2, 0.3, ...]', description: 'Vector embedding representation' })
  @Column(DataType.ARRAY(DataType.FLOAT))
  embedding: number[];

  @ApiProperty({ example: 'openai-text-embedding-ada-002', description: 'Embedding model used' })
  @Column({ type: DataType.STRING, allowNull: false })
  model: string;

  @ApiProperty({ example: 1536, description: 'Dimension of the embedding vector' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  dimension: number;

  @ApiProperty({ example: 1, description: 'Chunk index in document' })
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  chunk_index: number;

  @ApiProperty({ example: 0, description: 'Start position of chunk in document' })
  @Column(DataType.INTEGER)
  start_position?: number;

  @ApiProperty({ example: 500, description: 'End position of chunk in document' })
  @Column(DataType.INTEGER)
  end_position?: number;

  @ApiProperty({ example: { 'page': 1, 'section': 'Introduction' }, description: 'Additional metadata' })
  @Column(DataType.JSONB)
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: 'user-123', description: 'User who created the embedding' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Document, 'document_id')
  document?: Document;

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}