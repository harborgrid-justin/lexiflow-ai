import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Acme Corporation', description: 'Client name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'corporation', description: 'Client type' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'contact@acmecorp.com', description: 'Primary email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-0100', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Business Ave, Suite 100, NY 10001', description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Client status',
    enum: ['active', 'inactive', 'archived']
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'archived'])
  status?: string;

  @ApiPropertyOptional({ example: 'John Smith', description: 'Primary contact person' })
  @IsOptional()
  @IsString()
  primary_contact?: string;

  @ApiPropertyOptional({ example: 'Technology services company', description: 'Industry/description' })
  @IsOptional()
  @IsString()
  industry?: string;
}
