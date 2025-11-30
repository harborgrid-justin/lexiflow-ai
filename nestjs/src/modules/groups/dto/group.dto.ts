import { IsString, IsOptional, IsNumber, IsArray, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Name of the group', minLength: 1, maxLength: 100 })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Description of the group', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  organizationId?: number;

  @ApiProperty({ description: 'Parent group ID', required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ description: 'Group permissions', required: false })
  @IsOptional()
  @IsArray()
  permissions?: string[];

  @ApiProperty({ description: 'Group settings as JSON', required: false })
  @IsOptional()
  settings?: any;

  @ApiProperty({ description: 'Whether the group is active', required: false })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}