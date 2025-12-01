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
import { Party } from './party.model';

@Table({
  tableName: 'attorneys',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['party_id'],
      name: 'idx_attorneys_party_id',
    },
    {
      fields: ['email'],
      name: 'idx_attorneys_email',
    },
    {
      fields: ['firm'],
      name: 'idx_attorneys_firm',
    },
  ],
})
export class Attorney extends Model {
  @ApiProperty({ example: 'attorney-123', description: 'Unique attorney ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'party-123', description: 'Associated party ID' })
  @ForeignKey(() => Party)
  @Column({ type: DataType.UUID, allowNull: false })
  party_id: string;

  @ApiProperty({ example: 'Thomas', description: 'First name' })
  @Column({ type: DataType.STRING, allowNull: false })
  first_name: string;

  @ApiProperty({ example: 'Charles', description: 'Middle name' })
  @Column(DataType.STRING)
  middle_name?: string;

  @ApiProperty({ example: 'Junker', description: 'Last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  last_name: string;

  @ApiProperty({ example: 'Jr.', description: 'Generation suffix' })
  @Column(DataType.STRING)
  generation?: string;

  @ApiProperty({ example: 'Esq.', description: 'Professional suffix' })
  @Column(DataType.STRING)
  suffix?: string;

  @ApiProperty({ example: 'Attorney', description: 'Professional title' })
  @Column(DataType.STRING)
  title?: string;

  @ApiProperty({ example: 'thomas.junker@mercertrigiani.com', description: 'Email address' })
  @Column(DataType.STRING)
  email?: string;

  @ApiProperty({ example: '703-837-5000', description: 'Phone number' })
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty({ example: '703-555-0100', description: 'Personal phone' })
  @Column(DataType.STRING)
  personal_phone?: string;

  @ApiProperty({ example: '703-555-0101', description: 'Business phone' })
  @Column(DataType.STRING)
  business_phone?: string;

  @ApiProperty({ example: '703-555-0102', description: 'Fax number' })
  @Column(DataType.STRING)
  fax?: string;

  @ApiProperty({ example: 'MERCERTRIGIANI', description: 'Law firm name' })
  @Column(DataType.STRING)
  firm?: string;

  @ApiProperty({ example: '112 South Alfred Street', description: 'Address line 1' })
  @Column(DataType.STRING)
  address1?: string;

  @ApiProperty({ example: 'Suite 100', description: 'Address line 2' })
  @Column(DataType.STRING)
  address2?: string;

  @ApiProperty({ example: '', description: 'Address line 3' })
  @Column(DataType.STRING)
  address3?: string;

  @ApiProperty({ example: 'Alexandria', description: 'City' })
  @Column(DataType.STRING)
  city?: string;

  @ApiProperty({ example: 'VA', description: 'State' })
  @Column(DataType.STRING)
  state?: string;

  @ApiProperty({ example: '22314', description: 'Zip code' })
  @Column(DataType.STRING)
  zip?: string;

  @ApiProperty({ example: 'Main Office', description: 'Office name' })
  @Column(DataType.STRING)
  office?: string;

  @ApiProperty({ example: '101', description: 'Unit number' })
  @Column(DataType.STRING)
  unit?: string;

  @ApiProperty({ example: '5B', description: 'Room number' })
  @Column(DataType.STRING)
  room?: string;

  @ApiProperty({ example: '2025-12-31T00:00:00Z', description: 'Termination date' })
  @Column(DataType.DATE)
  termination_date?: Date;

  @ApiProperty({ example: '[COR NTC Retained]', description: 'Notice information' })
  @Column(DataType.STRING)
  notice_info?: string;

  @ApiProperty({ example: 'Retained', description: 'Status (Retained, Pro Se, etc.)' })
  @Column(DataType.STRING)
  status?: string;

  @ApiProperty({ example: '2025-03-17T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2025-03-17T10:00:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Party, 'party_id')
  party?: Party;
}
