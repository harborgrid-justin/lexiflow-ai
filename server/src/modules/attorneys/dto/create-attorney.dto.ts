import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEmail } from 'class-validator';

export class CreateAttorneyDto {
  @ApiProperty({ description: 'ID of the party this attorney represents' })
  @IsString()
  @IsNotEmpty()
  party_id: string;

  @ApiProperty({ description: 'Attorney first name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'Attorney middle name', required: false })
  @IsString()
  @IsOptional()
  middle_name?: string;

  @ApiProperty({ description: 'Attorney last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Generation (Jr., Sr., III, etc.)', required: false })
  @IsString()
  @IsOptional()
  generation?: string;

  @ApiProperty({ description: 'Professional suffix (Esq., etc.)', required: false })
  @IsString()
  @IsOptional()
  suffix?: string;

  @ApiProperty({ description: 'Professional title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Primary phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Personal phone number', required: false })
  @IsString()
  @IsOptional()
  personal_phone?: string;

  @ApiProperty({ description: 'Business phone number', required: false })
  @IsString()
  @IsOptional()
  business_phone?: string;

  @ApiProperty({ description: 'Fax number', required: false })
  @IsString()
  @IsOptional()
  fax?: string;

  @ApiProperty({ description: 'Law firm name', required: false })
  @IsString()
  @IsOptional()
  firm?: string;

  @ApiProperty({ description: 'Address line 1', required: false })
  @IsString()
  @IsOptional()
  address1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty({ description: 'Address line 3', required: false })
  @IsString()
  @IsOptional()
  address3?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'ZIP code', required: false })
  @IsString()
  @IsOptional()
  zip?: string;

  @ApiProperty({ description: 'Office identifier', required: false })
  @IsString()
  @IsOptional()
  office?: string;

  @ApiProperty({ description: 'Unit number', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Room number', required: false })
  @IsString()
  @IsOptional()
  room?: string;

  @ApiProperty({ description: 'Date attorney representation terminated', required: false })
  @IsDateString()
  @IsOptional()
  termination_date?: string;

  @ApiProperty({ description: 'Notice information for the attorney', required: false })
  @IsString()
  @IsOptional()
  notice_info?: string;

  @ApiProperty({ description: 'Attorney status (Active, Terminated, etc.)', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
