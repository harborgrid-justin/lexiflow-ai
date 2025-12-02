import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EthicalWall } from '../../models/ethical-wall.model';
import { EthicalWallController } from './ethical-wall.controller';
import { EthicalWallService } from './ethical-wall.service';

@Module({
  imports: [SequelizeModule.forFeature([EthicalWall])],
  controllers: [EthicalWallController],
  providers: [EthicalWallService],
  exports: [EthicalWallService],
})
export class EthicalWallModule {}
