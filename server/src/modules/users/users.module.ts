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
import { UsersPrismaService } from './users.prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Organization, TimeEntry, WorkflowTask, Task, KnowledgeArticle, Clause]),
    PrismaModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersPrismaService],
  exports: [UsersService, UsersPrismaService],
})
export class UsersModule {}