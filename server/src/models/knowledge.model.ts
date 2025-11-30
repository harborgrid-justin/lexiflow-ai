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

@Table({
  tableName: 'knowledge_articles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class KnowledgeArticle extends Model {
  @ApiProperty({ example: 'kb-123', description: 'Unique knowledge article ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Contract Negotiation Best Practices', description: 'Article title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'best_practices', description: 'Article type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'published', description: 'Article status' })
  @Default('draft')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'Contract Law', description: 'Article category' })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: 'Best practices for negotiating software license agreements...', description: 'Article content' })
  @Column(DataType.TEXT)
  content?: string;

  @ApiProperty({ example: 'A comprehensive guide to contract negotiation', description: 'Article summary' })
  @Column(DataType.TEXT)
  summary?: string;

  @ApiProperty({ example: 'contract, negotiation, best-practices, licensing', description: 'Article tags' })
  @Column(DataType.STRING)
  tags?: string;

  @ApiProperty({ example: 'internal', description: 'Visibility level' })
  @Default('internal')
  @Column(DataType.STRING)
  visibility: string;

  @ApiProperty({ example: 150, description: 'Article view count' })
  @Default(0)
  @Column(DataType.INTEGER)
  view_count: number;

  @ApiProperty({ example: 4.5, description: 'Article rating' })
  @Column(DataType.DECIMAL(3, 2))
  rating?: number;

  @ApiProperty({ example: 'user-123', description: 'Article author ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  author_id?: string;

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

  @BelongsTo(() => User, 'author_id')
  author?: User;

  @BelongsTo(() => User, 'modified_by')
  modifier?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}