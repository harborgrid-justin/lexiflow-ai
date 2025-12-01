import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Client extends Model {
  @ApiProperty({ example: 'client-123', description: 'Unique client ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Acme Corporation', description: 'Client name' })
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ example: 'corporation', description: 'Client type' })
  @Column(DataType.STRING)
  type: string;

  @ApiProperty({ example: 'contact@acmecorp.com', description: 'Primary email' })
  @Column(DataType.STRING)
  email?: string;

  @ApiProperty({ example: '+1-555-0100', description: 'Phone number' })
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty({ example: '123 Business Ave, Suite 100, NY 10001', description: 'Address' })
  @Column(DataType.TEXT)
  address?: string;

  @ApiProperty({ example: 'active', description: 'Client status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'John Smith', description: 'Primary contact person' })
  @Column(DataType.STRING)
  primary_contact?: string;

  @ApiProperty({ example: 'Technology services company', description: 'Industry/description' })
  @Column(DataType.TEXT)
  industry?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;
}