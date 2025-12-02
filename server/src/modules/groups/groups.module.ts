import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from '../../models/group.model';
import { UserGroup } from '../../models/user-group.model';
import { User } from '../../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Group, UserGroup, User])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}