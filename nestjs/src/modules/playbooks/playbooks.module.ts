import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaybooksController } from './playbooks.controller';
import { PlaybooksService } from './playbooks.service';
import { Playbook } from '../../models/playbook.model';

@Module({
  imports: [SequelizeModule.forFeature([Playbook])],
  controllers: [PlaybooksController],
  providers: [PlaybooksService],
  exports: [PlaybooksService],
})
export class PlaybooksModule {}