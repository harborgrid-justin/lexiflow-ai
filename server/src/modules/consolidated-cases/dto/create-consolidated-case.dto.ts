import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateConsolidatedCaseDto {
  @ApiProperty({ description: 'ID of the lead case in consolidation', required: false })
  @IsString()
  @IsOptional()
  lead_case_id?: string;

  @ApiProperty({ description: 'ID of the member case in consolidation', required: false })
  @IsString()
  @IsOptional()
  member_case_id?: string;

  @ApiProperty({ description: 'Docket number of the lead case' })
  @IsString()
  @IsNotEmpty()
  lead_case_number: string;

  @ApiProperty({ description: 'Docket number of the member case' })
  @IsString()
  @IsNotEmpty()
  member_case_number: string;

  @ApiProperty({ description: 'Type of association (Consolidated, Related, etc.)' })
  @IsString()
  @IsNotEmpty()
  association_type: string;

  @ApiProperty({ description: 'Date the consolidation started' })
  @IsDateString()
  @IsNotEmpty()
  date_start: string;

  @ApiProperty({ description: 'Date the consolidation ended', required: false })
  @IsDateString()
  @IsOptional()
  date_end?: string;
}
