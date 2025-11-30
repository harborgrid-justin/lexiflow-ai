import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Jurisdiction } from '../../models/jurisdiction.model';
import { JurisdictionsController } from './jurisdictions.controller';
import { JurisdictionsService } from './jurisdictions.service';

@Module({
  imports: [SequelizeModule.forFeature([Jurisdiction])],
  controllers: [JurisdictionsController],
  providers: [JurisdictionsService],
  exports: [JurisdictionsService],
})
export class JurisdictionsModule {}