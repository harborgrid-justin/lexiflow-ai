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

@Table({
  tableName: 'search_queries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SearchQuery extends Model {
  @ApiProperty({ example: 'query-123', description: 'Unique query ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'contract liability clauses', description: 'Search query text' })
  @Index
  @Column({ type: DataType.TEXT, allowNull: false })
  query_text: string;

  @ApiProperty({ example: 'semantic', description: 'Type of search performed' })
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  search_type: string;

  @ApiProperty({ example: '[0.1, 0.2, 0.3, ...]', description: 'Query embedding vector' })
  @Column(DataType.ARRAY(DataType.FLOAT))
  query_embedding?: number[];

  @ApiProperty({ example: { 'document_types': ['contract', 'agreement'], 'date_range': '2023-2024' }, description: 'Search filters' })
  @Column(DataType.JSONB)
  filters?: any;

  @ApiProperty({ example: 15, description: 'Number of results returned' })
  @Column(DataType.INTEGER)
  result_count?: number;

  @ApiProperty({ example: ['doc-123', 'doc-456'], description: 'IDs of documents found' })
  @Column(DataType.ARRAY(DataType.UUID))
  result_document_ids?: string[];

  @ApiProperty({ example: 'user-123', description: 'User who performed the search' })
  @ForeignKey(() => User)
  @Index
  @Column(DataType.UUID)
  user_id?: string;

  @ApiProperty({ example: 'org-123', description: 'Organization of the searcher' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  organization_id?: string;

  @ApiProperty({ example: 'case-123', description: 'Case context for the search' })
  @Column(DataType.UUID)
  case_context?: string;

  @ApiProperty({ example: 250, description: 'Search execution time in milliseconds' })
  @Column(DataType.INTEGER)
  execution_time_ms?: number;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => User, 'user_id')
  user?: User;

  @BelongsTo(() => Organization, 'organization_id')
  organization?: Organization;
}