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
  tableName: 'clauses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Clause extends Model {
  @ApiProperty({ example: 'clause-123', description: 'Unique clause ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Limitation of Liability', description: 'Clause title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'liability', description: 'Clause type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Software License Agreement', description: 'Clause category' })
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  @ApiProperty({ example: 'In no event shall either party be liable...', description: 'Clause content' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @ApiProperty({ example: 'Standard limitation clause for software licensing', description: 'Clause description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: 'active', description: 'Clause status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 1, description: 'Clause version number' })
  @Default(1)
  @Column(DataType.INTEGER)
  version: number;

  @ApiProperty({ example: 'Updated for new liability standards', description: 'Version notes' })
  @Column(DataType.TEXT)
  version_notes?: string;

  @ApiProperty({ example: 'liability, limitation, software, standard', description: 'Clause tags' })
  @Column(DataType.STRING)
  tags?: string;

  @ApiProperty({ example: 50, description: 'Usage count' })
  @Default(0)
  @Column(DataType.INTEGER)
  usage_count: number;

  @ApiProperty({ example: 'internal', description: 'Clause visibility' })
  @Default('internal')
  @Column(DataType.STRING)
  visibility: string;

  @ApiProperty({ example: 'user-123', description: 'Clause author ID' })
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