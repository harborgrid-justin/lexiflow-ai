import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Smith & Associates Law Firm', description: 'Organization name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Law Firm',
    description: 'Type of organization',
    enum: ['Law Firm', 'Corporate', 'Government', 'Court', 'Vendor']
  })
  @IsOptional()
  @IsString()
  @IsIn(['Law Firm', 'Corporate', 'Government', 'Court', 'Vendor'])
  type?: string;

  @ApiPropertyOptional({ example: 'smithlaw.com', description: 'Organization domain' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'Organization logo URL' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: '123 Main Street, Suite 100, New York, NY 10001', description: 'Organization address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+1-555-0100', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@smithlawfirm.com', description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'www.smithlawfirm.com', description: 'Website URL' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Premium', description: 'Subscription tier' })
  @IsOptional()
  @IsString()
  subscription_tier?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Organization status',
    enum: ['active', 'inactive', 'suspended']
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiPropertyOptional({ example: 'Corporate law, Litigation, Real Estate', description: 'Practice areas' })
  @IsOptional()
  @IsString()
  practice_areas?: string;

  @ApiPropertyOptional({ example: '12-3456789', description: 'Tax ID number' })
  @IsOptional()
  @IsString()
  tax_id?: string;
}
