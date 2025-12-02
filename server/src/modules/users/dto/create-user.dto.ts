import { IsString, IsEmail, IsOptional, IsUUID, MinLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@lawfirm.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'User password (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'Attorney', description: 'User role in the organization' })
  @IsString()
  @IsIn(['Attorney', 'Partner', 'Associate', 'Paralegal', 'Administrator', 'Client'])
  role: string;

  @ApiPropertyOptional({ example: 'Partner', description: 'Position or title' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'California', description: 'Bar admission state' })
  @IsOptional()
  @IsString()
  bar_admission?: string;

  @ApiPropertyOptional({ example: '123456', description: 'Bar number' })
  @IsOptional()
  @IsString()
  bar_number?: string;

  @ApiPropertyOptional({ example: '+1-555-0123', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Corporate law, M&A', description: 'Areas of expertise' })
  @IsOptional()
  @IsString()
  expertise?: string;

  @ApiPropertyOptional({ example: 'New York Office', description: 'Office location' })
  @IsOptional()
  @IsString()
  office?: string;

  @ApiPropertyOptional({ example: 'Internal', description: 'User type' })
  @IsOptional()
  @IsString()
  user_type?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: 'active', description: 'Account status' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiProperty({ example: 'org-123', description: 'Organization ID' })
  @IsUUID()
  organization_id: string;
}
