import { PartialType } from '@nestjs/swagger';
import { CreateDiscoveryDto } from './create-discovery.dto';

export class UpdateDiscoveryDto extends PartialType(CreateDiscoveryDto) {}
