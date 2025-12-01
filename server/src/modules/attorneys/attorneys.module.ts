import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttorneysService } from './attorneys.service';
import { AttorneysController } from './attorneys.controller';
import { Attorney } from '../../models/attorney.model';

@Module({
  imports: [SequelizeModule.forFeature([Attorney])],
  controllers: [AttorneysController],
  providers: [AttorneysService],
  exports: [AttorneysService],
})
export class AttorneysModule {}
