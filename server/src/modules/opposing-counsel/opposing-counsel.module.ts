import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OpposingCounselProfile } from '../../models/opposing-counsel-profile.model';
import { OpposingCounselController } from './opposing-counsel.controller';
import { OpposingCounselService } from './opposing-counsel.service';

@Module({
  imports: [SequelizeModule.forFeature([OpposingCounselProfile])],
  controllers: [OpposingCounselController],
  providers: [OpposingCounselService],
  exports: [OpposingCounselService],
})
export class OpposingCounselModule {}
