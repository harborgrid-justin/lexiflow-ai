import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { 
  User,
  Organization,
  TimeEntry,
  WorkflowTask,
  Task,
  KnowledgeArticle,
  Clause,
} from '../../models';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Organization, TimeEntry, WorkflowTask, Task, KnowledgeArticle, Clause])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}