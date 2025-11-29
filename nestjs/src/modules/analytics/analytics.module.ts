import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Analytics } from '../../models/analytics.model';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [SequelizeModule.forFeature([Analytics])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}