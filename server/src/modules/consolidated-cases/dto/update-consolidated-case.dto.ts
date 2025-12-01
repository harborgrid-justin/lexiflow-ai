import { PartialType } from '@nestjs/swagger';
import { CreateConsolidatedCaseDto } from './create-consolidated-case.dto';

export class UpdateConsolidatedCaseDto extends PartialType(CreateConsolidatedCaseDto) {}
