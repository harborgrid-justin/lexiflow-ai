import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimeEntry } from '../../models/billing.model';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [SequelizeModule.forFeature([TimeEntry])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}