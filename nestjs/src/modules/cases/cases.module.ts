import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Case } from '../../models/case.model';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';

@Module({
  imports: [SequelizeModule.forFeature([Case])],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}