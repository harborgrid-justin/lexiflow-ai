import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Motion } from '../../models/motion.model';
import { MotionsController } from './motions.controller';
import { MotionsService } from './motions.service';

@Module({
  imports: [SequelizeModule.forFeature([Motion])],
  controllers: [MotionsController],
  providers: [MotionsService],
  exports: [MotionsService],
})
export class MotionsModule {}