import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConsolidatedCasesService } from './consolidated-cases.service';
import { ConsolidatedCasesController } from './consolidated-cases.controller';
import { ConsolidatedCase } from '../../models/consolidated-case.model';

@Module({
  imports: [SequelizeModule.forFeature([ConsolidatedCase])],
  controllers: [ConsolidatedCasesController],
  providers: [ConsolidatedCasesService],
  exports: [ConsolidatedCasesService],
})
export class ConsolidatedCasesModule {}
