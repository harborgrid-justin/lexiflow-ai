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
import { Organization } from './organization.model';

@Table({
  tableName: 'parties',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_parties_case_id',
    },
    {
      fields: ['type'],
      name: 'idx_parties_type',
    },
    {
      fields: ['role'],
      name: 'idx_parties_role',
    },
    {
      fields: ['linked_org_id'],
      name: 'idx_parties_linked_org_id',
    },
  ],
})
export class Party extends Model {
  @ApiProperty({ example: 'party-123', description: 'Unique party ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Party name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'Plaintiff', description: 'Party role in case' })
  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Contact information' })
  @Column({ type: DataType.STRING, allowNull: false })
  contact: string;

  @ApiProperty({ example: 'Individual', description: 'Type of party' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Smith & Associates', description: 'Counsel representing this party' })
  @Column(DataType.STRING)
  counsel?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  case_id: string;

  @ApiProperty({ example: 'org-456', description: 'Linked organization ID if party is a client/entity in system' })
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  linked_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;

  @BelongsTo(() => Organization, 'linked_org_id')
  linkedOrganization?: Organization;
}