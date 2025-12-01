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
  tableName: 'legal_citations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class LegalCitation extends Model {
  @ApiProperty({ example: 'cite-123', description: 'Unique citation ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Brown v. Board of Education', description: 'Case name' })
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  case_name: string;

  @ApiProperty({ example: '347 U.S. 483', description: 'Legal citation' })
  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  citation: string;

  @ApiProperty({ example: '1954', description: 'Year of decision' })
  @Index
  @Column(DataType.INTEGER)
  year?: number;

  @ApiProperty({ example: 'Supreme Court', description: 'Court that decided the case' })
  @Index
  @Column(DataType.STRING)
  court?: string;

  @ApiProperty({ example: 'Federal', description: 'Jurisdiction of the case' })
  @Index
  @Column(DataType.STRING)
  jurisdiction?: string;

  @ApiProperty({ example: 'Constitutional Law', description: 'Area of law' })
  @Index
  @Column(DataType.STRING)
  area_of_law?: string;

  @ApiProperty({ example: 'Landmark case establishing equal protection in education', description: 'Case summary' })
  @Column(DataType.TEXT)
  summary?: string;

  @ApiProperty({ example: 'The Supreme Court held that separate educational facilities are inherently unequal', description: 'Key holding' })
  @Column(DataType.TEXT)
  holding?: string;

  @ApiProperty({ example: 'civil rights, education, equal protection', description: 'Relevant topics' })
  @Column(DataType.STRING)
  topics?: string;

  @ApiProperty({ example: 'https://supreme.justia.com/cases/federal/us/347/483/', description: 'URL to full text' })
  @Column(DataType.STRING)
  url?: string;

  @ApiProperty({ example: 'doc-123', description: 'Document that referenced this citation' })
  @ForeignKey(() => Document)
  @Index
  @Column(DataType.UUID)
  document_id?: string;

  @ApiProperty({ example: 1250, description: 'Position in document where cited' })
  @Column(DataType.INTEGER)
  position_in_document?: number;

  @ApiProperty({ example: 'user-123', description: 'User who added the citation' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  added_by?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Index
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: true, description: 'Whether citation is verified as accurate' })
  @Default(false)
  @Column(DataType.BOOLEAN)
  verified: boolean;

  @ApiProperty({ example: 'Strong precedent for current case', description: 'Relevance notes' })
  @Column(DataType.TEXT)
  relevance_notes?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Document, 'document_id')
  document?: Document;

  @BelongsTo(() => User, 'added_by')
  addedBy?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}