import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'Litigation Team', description: 'Group name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Handles all litigation matters', description: 'Group description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'org-123', description: 'Organization ID this group belongs to' })
  @IsUUID()
  owner_org_id: string;

  @ApiPropertyOptional({
    example: ['case:read', 'case:write', 'document:read'],
    description: 'Group permissions',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

export class AddMemberDto {
  @ApiProperty({ example: 'user-123', description: 'User ID to add to group' })
  @IsUUID()
  user_id: string;

  @ApiPropertyOptional({ example: 'Member', description: 'Role in the group' })
  @IsOptional()
  @IsString()
  role?: string;
}