import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocketEntriesService } from './docket-entries.service';
import { DocketEntriesController } from './docket-entries.controller';
import { DocketEntry } from '../../models/docket-entry.model';

@Module({
  imports: [SequelizeModule.forFeature([DocketEntry])],
  controllers: [DocketEntriesController],
  providers: [DocketEntriesService],
  exports: [DocketEntriesService],
})
export class DocketEntriesModule {}
