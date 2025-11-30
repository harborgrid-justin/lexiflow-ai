import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConflictCheckController } from './conflict-check.controller';
import { ConflictCheckService } from './conflict-check.service';
import { ConflictCheck } from '../../models/conflict-check.model';

@Module({
  imports: [SequelizeModule.forFeature([ConflictCheck])],
  controllers: [ConflictCheckController],
  providers: [ConflictCheckService],
  exports: [ConflictCheckService],
})
export class ConflictCheckModule {}