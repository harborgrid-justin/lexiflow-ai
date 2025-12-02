import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Case,
  Party,
  CaseMember,
  Document,
  DocketEntry,
  Motion,
  ConsolidatedCase,
  Organization,
} from '../../models';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { PacerParserService } from '../../services/pacer-parser.service';

@Module({
  imports: [SequelizeModule.forFeature([
    Case,
    Party,
    CaseMember,
    Document,
    DocketEntry,
    Motion,
    ConsolidatedCase,
    Organization,
  ])],
  controllers: [CasesController],
  providers: [CasesService, PacerParserService],
  exports: [CasesService],
})
export class CasesModule {}