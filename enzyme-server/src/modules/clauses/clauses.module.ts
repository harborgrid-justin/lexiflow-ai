import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Clause } from '../../models/clause.model';
import { ClausesController } from './clauses.controller';
import { ClausesService } from './clauses.service';

@Module({
  imports: [SequelizeModule.forFeature([Clause])],
  controllers: [ClausesController],
  providers: [ClausesService],
  exports: [ClausesService],
})
export class ClausesModule {}