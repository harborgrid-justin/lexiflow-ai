import { PartialType } from '@nestjs/swagger';
import { CreateAttorneyDto } from './create-attorney.dto';

export class UpdateAttorneyDto extends PartialType(CreateAttorneyDto) {}
