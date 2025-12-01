// Redis Messaging-Specific Operations
import { Injectable } from '@nestjs/common';
import { RedisBasicOperations } from './redis-basic.operations';
import { RedisListOperations } from './redis-list.operations';
import { RedisHashOperations } from './redis-hash.operations';
import { RedisSetOperations } from './redis-set.operations';

@Injectable()
export class RedisMessagingOperations {
  constructor(
    private basicOps: RedisBasicOperations,
    private listOps: RedisListOperations,
    private hashOps: RedisHashOperations,
    private setOps: RedisSetOperations,
  ) {}

  async addMessageToConversation(conversationId: string, messageData: any): Promise<void> {
    const messageKey = `conversation:${conversationId}:messages`;
    const messageJson = JSON.stringify(messageData);
    
    await this.listOps.lpush(messageKey, messageJson);
    await this.listOps.ltrim(messageKey, 0, 999);
    await this.basicOps.expire(messageKey, 604800);
    
    const statsKey = `conversation:${conversationId}:stats`;
    await this.hashOps.hset(statsKey, 'lastMessageAt', new Date().toISOString());
  }

  async getConversationMessages(conversationId: string, limit: number = 100): Promise<any[]> {
    const messageKey = `conversation:${conversationId}:messages`;
    const messages = await this.listOps.lrange(messageKey, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg));
  }

  async setUserOnline(userId: string): Promise<void> {
    const userKey = `user:${userId}:presence`;
    await this.setOps.sadd('users:online', userId);
    await this.basicOps.setJson(userKey, { status: 'online', lastSeen: new Date().toISOString() }, 300);
    await this.basicOps.expire('users:online', 300);
  }

  async setUserOffline(userId: string): Promise<void> {
    const userKey = `user:${userId}:presence`;
    await this.setOps.srem('users:online', userId);
    await this.basicOps.setJson(userKey, { status: 'offline', lastSeen: new Date().toISOString() }, 86400);
  }

  async getOnlineUsers(): Promise<string[]> {
    return this.setOps.smembers('users:online');
  }

  async isUserOnline(userId: string): Promise<boolean> {
    return (await this.setOps.sismember('users:online', userId)) === 1;
  }

  async setTypingIndicator(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    const typingKey = `conversation:${conversationId}:typing`;
    if (isTyping) {
      await this.hashOps.hset(typingKey, userId, Date.now().toString());
      await this.basicOps.expire(typingKey, 10);
    } else {
      await this.hashOps.hdel(typingKey, userId);
    }
  }

  async getTypingUsers(conversationId: string): Promise<string[]> {
    const typingKey = `conversation:${conversationId}:typing`;
    const typingData = await this.hashOps.hgetall(typingKey);
    const now = Date.now();
    
    return Object.entries(typingData)
      .filter(([_, typingTime]) => (now - parseInt(typingTime)) < 5000)
      .map(([userId]) => userId);
  }

  async cacheUserPresence(userId: string, presenceData: any): Promise<void> {
    const presenceKey = `user:${userId}:presence:cache`;
    await this.basicOps.setJson(presenceKey, presenceData, 300);
  }

  async getUserPresence(userId: string): Promise<any | null> {
    const presenceKey = `user:${userId}:presence:cache`;
    return this.basicOps.getJson(presenceKey);
  }
}
