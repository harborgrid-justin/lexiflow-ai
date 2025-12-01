import { PartialType } from '@nestjs/swagger';
import { CreateDocketEntryDto } from './create-docket-entry.dto';

export class UpdateDocketEntryDto extends PartialType(CreateDocketEntryDto) {}
