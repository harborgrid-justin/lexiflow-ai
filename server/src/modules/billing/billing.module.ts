import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimeEntry } from '../../models/billing.model';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { BillingPrismaService } from './billing.prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TimeEntry]),
    PrismaModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, BillingPrismaService],
  exports: [BillingService, BillingPrismaService],
})
export class BillingModule {}