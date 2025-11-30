import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { User } from './user.model';
import { Case } from './case.model';
import { ChainOfCustodyEvent } from './chain-of-custody-event.model';
import { FileChunk } from './file-chunk.model';

@Table({
  tableName: 'evidence',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_evidence_case_id',
    },
    {
      fields: ['owner_org_id'],
      name: 'idx_evidence_owner_org_id',
    },
    {
      fields: ['type'],
      name: 'idx_evidence_type',
    },
    {
      fields: ['status'],
      name: 'idx_evidence_status',
    },
    {
      fields: ['custodian_id'],
      name: 'idx_evidence_custodian_id',
    },
    {
      fields: ['collected_date'],
      name: 'idx_evidence_collected_date',
    },
  ],
})
export class Evidence extends Model {
  @ApiProperty({ example: 'ev-123', description: 'Unique evidence ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique tracking UUID for lifecycle management' })
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  tracking_uuid: string;

  @ApiProperty({ example: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', description: 'Blockchain hash for immutable record' })
  @Column(DataType.STRING)
  blockchain_hash?: string;

  @ApiProperty({ example: 'Email Communication Thread', description: 'Evidence title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'Email', description: 'Evidence type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Active', description: 'Evidence status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'Chain of emails between plaintiff and defendant', description: 'Evidence description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'pdf', description: 'File type extension' })
  @Column(DataType.STRING)
  file_type?: string;

  @ApiProperty({ example: '2.5 MB', description: 'File size' })
  @Column(DataType.STRING)
  file_size?: string;

  @ApiProperty({ example: 'Admissible', description: 'Admissibility status' })
  @Column(DataType.STRING)
  admissibility_status?: string;

  @ApiProperty({ example: '/storage/evidence/ev-123/', description: 'Storage location path' })
  @Column(DataType.STRING)
  location?: string;

  @ApiProperty({ example: 'John Smith - Paralegal', description: 'Who collected the evidence' })
  @Column(DataType.STRING)
  collected_by?: string;

  @ApiProperty({ example: 'user-123', description: 'ID of user who collected the evidence' })
  @Column(DataType.UUID)
  collected_by_user_id?: string;

  @ApiProperty({ example: '2024-01-15T09:30:00Z', description: 'When evidence was collected' })
  @Column(DataType.DATE)
  collected_date?: Date;

  @ApiProperty({ example: 'Chain of custody form completed', description: 'Collection notes' })
  @Column(DataType.TEXT)
  collection_notes?: string;

  @ApiProperty({ example: 'communication, email, negotiation', description: 'Evidence tags' })
  @Column(DataType.STRING)
  tags?: string;

  @ApiProperty({ example: 'Confidential', description: 'Security classification' })
  @Column(DataType.STRING)
  classification?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Evidence custodian ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  custodian_id?: string;

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

  @BelongsTo(() => User, 'custodian_id')
  custodian?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;

  @HasMany(() => ChainOfCustodyEvent, 'evidence_id')
  chainOfCustody?: ChainOfCustodyEvent[];

  @HasMany(() => FileChunk, 'evidence_id')
  chunks?: FileChunk[];
}