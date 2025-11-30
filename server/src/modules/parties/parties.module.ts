import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PartiesService } from './parties.service';
import { PartiesController } from './parties.controller';
import { Party } from '../../models/party.model';

@Module({
  imports: [SequelizeModule.forFeature([Party])],
  controllers: [PartiesController],
  providers: [PartiesService],
  exports: [PartiesService],
})
export class PartiesModule {}