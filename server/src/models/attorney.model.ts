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

  @ApiProperty({ example: '703-837-5000', description: 'Office phone number' })
  @Column(DataType.STRING)
  office_phone?: string;

  @ApiProperty({ example: '703-555-0100', description: 'Mobile phone' })
  @Column(DataType.STRING)
  mobile_phone?: string;

  @ApiProperty({ example: 'VA123456', description: 'Bar number' })
  @Column(DataType.STRING)
  bar_number?: string;

  @ApiProperty({ example: 'VA', description: 'Bar state' })
  @Column(DataType.STRING)
  bar_state?: string;

  @ApiProperty({ example: true, description: 'Is lead attorney' })
  @Column(DataType.BOOLEAN)
  is_lead?: boolean;

  @ApiProperty({ example: true, description: 'Pro hac vice status' })
  @Column(DataType.BOOLEAN)
  pro_hac_vice?: boolean;

  @ApiProperty({ example: 'MERCERTRIGIANI', description: 'Law firm name' })
  @Column(DataType.STRING)
  firm?: string;

  @ApiProperty({ example: '112 South Alfred Street', description: 'Address line 1' })
  @Column(DataType.STRING)
  address_line1?: string;

  @ApiProperty({ example: 'Suite 100', description: 'Address line 2' })
  @Column(DataType.STRING)
  address_line2?: string;

  @ApiProperty({ example: 'Alexandria', description: 'City' })
  @Column(DataType.STRING)
  city?: string;

  @ApiProperty({ example: 'VA', description: 'State' })
  @Column(DataType.STRING)
  state?: string;

  @ApiProperty({ example: '22314', description: 'Zip code' })
  @Column(DataType.STRING)
  zip?: string;

  @ApiProperty({ example: 'US', description: 'Country' })
  @Column(DataType.STRING)
  country?: string;

  @ApiProperty({ example: '2025-12-31T00:00:00Z', description: 'Termination date' })
  @Column(DataType.DATE)
  termination_date?: Date;

  @ApiProperty({ example: '2025-03-17T10:00:00Z', description: 'Termination notice date' })
  @Column(DataType.DATE)
  termination_notice_date?: Date;

  @ApiProperty({ example: 'John Doe', description: 'Notice to name' })
  @Column(DataType.STRING)
  notice_to_name?: string;

  @ApiProperty({ example: '123 Main St', description: 'Notice to address' })
  @Column(DataType.STRING)
  notice_to_address?: string;

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
