import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConflictCheck } from '../../models/conflict-check.model';
import { ConflictCheckController } from './conflict-check.controller';
import { ConflictCheckService } from './conflict-check.service';

@Module({
  imports: [SequelizeModule.forFeature([ConflictCheck])],
  controllers: [ConflictCheckController],
  providers: [ConflictCheckService],
  exports: [ConflictCheckService],
})
export class ConflictCheckModule {}
