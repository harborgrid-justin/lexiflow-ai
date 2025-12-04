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
import { CasesPrismaService } from './cases.prisma.service';
import { PacerParserService } from '../../services/pacer-parser.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Case,
      Party,
      CaseMember,
      Document,
      DocketEntry,
      Motion,
      ConsolidatedCase,
      Organization,
    ]),
    PrismaModule,
  ],
  controllers: [CasesController],
  providers: [CasesService, CasesPrismaService, PacerParserService],
  exports: [CasesService, CasesPrismaService],
})
export class CasesModule {}