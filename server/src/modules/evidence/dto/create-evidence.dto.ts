import { IsString, IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvidenceDto {
  @ApiProperty({ example: 'Email Communication Thread', description: 'Evidence title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Email',
    description: 'Evidence type',
    enum: ['Physical', 'Digital', 'Document', 'Testimony', 'Forensic', 'Email']
  })
  @IsString()
  @IsIn(['Physical', 'Digital', 'Document', 'Testimony', 'Forensic', 'Email'])
  type: string;

  @ApiPropertyOptional({ example: 'Chain of emails between parties', description: 'Evidence description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'case-123', description: 'Associated case ID' })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiPropertyOptional({ example: 'active', description: 'Evidence status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Admissible', description: 'Admissibility status' })
  @IsOptional()
  @IsString()
  admissibility_status?: string;

  @ApiPropertyOptional({ example: '/storage/evidence/ev-123/', description: 'Storage location path' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'John Smith - Paralegal', description: 'Who collected the evidence' })
  @IsOptional()
  @IsString()
  collected_by?: string;

  @ApiPropertyOptional({ example: 'user-123', description: 'User ID who collected the evidence' })
  @IsOptional()
  @IsUUID()
  collected_by_user_id?: string;

  @ApiPropertyOptional({ example: '2024-01-15T09:30:00Z', description: 'Collection date' })
  @IsOptional()
  @IsDateString()
  collected_date?: Date;

  @ApiPropertyOptional({ example: 'communication,email,negotiation', description: 'Comma-separated tags' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: 'Confidential', description: 'Security classification' })
  @IsOptional()
  @IsString()
  classification?: string;
}
