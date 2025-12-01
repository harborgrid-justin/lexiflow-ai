import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message, Conversation } from '../../models/message.model';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, Conversation]),
    RedisModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}