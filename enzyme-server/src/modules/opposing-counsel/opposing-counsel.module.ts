import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OpposingCounselController } from './opposing-counsel.controller';
import { OpposingCounselProfileService } from './opposing-counsel.service';
import { OpposingCounselProfile } from '../../models/opposing-counsel-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([OpposingCounselProfile])],
  controllers: [OpposingCounselController],
  providers: [OpposingCounselProfileService],
  exports: [OpposingCounselProfileService],
})
export class OpposingCounselModule {}