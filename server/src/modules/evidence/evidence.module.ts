import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Evidence } from '../../models/evidence.model';
import { ChainOfCustodyEvent } from '../../models/chain-of-custody-event.model';
import { EvidenceController } from './evidence.controller';
import { EvidenceService } from './evidence.service';

@Module({
  imports: [SequelizeModule.forFeature([Evidence, ChainOfCustodyEvent])],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}