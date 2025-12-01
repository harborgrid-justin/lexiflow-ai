import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateDocketEntryDto {
  @ApiProperty({ description: 'ID of the case this docket entry belongs to' })
  @IsString()
  @IsNotEmpty()
  case_id: string;

  @ApiProperty({ description: 'Sequential entry number from docket' })
  @IsNumber()
  @IsNotEmpty()
  entry_number: number;

  @ApiProperty({ description: 'Date the entry was filed' })
  @IsDateString()
  @IsNotEmpty()
  date_filed: string;

  @ApiProperty({ description: 'Full text description of the docket entry' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Link to document in PACER/CM-ECF', required: false })
  @IsString()
  @IsOptional()
  doc_link?: string;

  @ApiProperty({ description: 'Number of pages in the document', required: false })
  @IsNumber()
  @IsOptional()
  pages?: number;

  @ApiProperty({ description: 'File size of the document', required: false })
  @IsString()
  @IsOptional()
  file_size?: string;

  @ApiProperty({ description: 'Type of document (Motion, Order, Notice, etc.)', required: false })
  @IsString()
  @IsOptional()
  document_type?: string;

  @ApiProperty({ description: 'CM/ECF document ID', required: false })
  @IsString()
  @IsOptional()
  cmecf_id?: string;

  @ApiProperty({ description: 'Initials of clerk who entered the docket entry', required: false })
  @IsString()
  @IsOptional()
  clerk_initials?: string;
}
