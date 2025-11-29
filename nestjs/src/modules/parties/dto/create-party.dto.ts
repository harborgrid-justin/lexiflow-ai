import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartyDto {
  @ApiProperty({ example: 'John Doe', description: 'Party name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Plaintiff', description: 'Party role in case' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Contact information' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({ example: 'Individual', description: 'Type of party' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Smith & Associates', description: 'Counsel representing this party', required: false })
  @IsString()
  @IsOptional()
  counsel?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @IsUUID()
  @IsNotEmpty()
  case_id: string;

  @ApiProperty({ example: 'org-456', description: 'Linked organization ID', required: false })
  @IsUUID()
  @IsOptional()
  linked_org_id?: string;
}