import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JudgeProfileController } from './judge-profile.controller';
import { JudgeProfileService } from './judge-profile.service';
import { JudgeProfile } from '../../models/judge-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([JudgeProfile])],
  controllers: [JudgeProfileController],
  providers: [JudgeProfileService],
  exports: [JudgeProfileService],
})
export class JudgeProfileModule {}