import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisBasicOperations } from './helpers/redis-basic.operations';
import { RedisHashOperations } from './helpers/redis-hash.operations';
import { RedisListOperations } from './helpers/redis-list.operations';
import { RedisSetOperations } from './helpers/redis-set.operations';
import { RedisPubSubOperations } from './helpers/redis-pubsub.operations';
import { RedisMessagingOperations } from './helpers/redis-messaging.operations';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;
  
  private basicOps: RedisBasicOperations;
  private hashOps: RedisHashOperations;
  private listOps: RedisListOperations;
  private setOps: RedisSetOperations;
  private pubSubOps: RedisPubSubOperations;
  private messagingOps: RedisMessagingOperations;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 
      'redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816';

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      this.subscriber = new Redis(redisUrl);
      this.publisher = new Redis(redisUrl);

      this.client.on('connect', () => this.logger.log('✅ Redis client connected'));
      this.client.on('error', (err) => this.logger.error('❌ Redis error:', err));

      await this.client.ping();
      this.logger.log('🚀 Redis Cloud connected');

      // Initialize operation helpers
      this.basicOps = new RedisBasicOperations(this.client);
      this.hashOps = new RedisHashOperations(this.client);
      this.listOps = new RedisListOperations(this.client);
      this.setOps = new RedisSetOperations(this.client);
      this.pubSubOps = new RedisPubSubOperations(this.publisher, this.subscriber);
      this.messagingOps = new RedisMessagingOperations(this.basicOps, this.listOps, this.hashOps, this.setOps);
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await Promise.all([
      this.client?.quit(),
      this.subscriber?.quit(),
      this.publisher?.quit(),
    ]);
    this.logger.log('Redis connections closed');
  }

  // Delegate to operation helpers
  get(key: string) { return this.basicOps.get(key); }
  set(key: string, value: string, ttl?: number) { return this.basicOps.set(key, value, ttl); }
  del(key: string) { return this.basicOps.del(key); }
  exists(key: string) { return this.basicOps.exists(key); }
  expire(key: string, seconds: number) { return this.basicOps.expire(key, seconds); }
  ttl(key: string) { return this.basicOps.ttl(key); }
  keys(pattern: string) { return this.basicOps.keys(pattern); }
  scan(cursor: string, pattern?: string, count?: number) { return this.basicOps.scan(cursor, pattern, count); }
  setJson<T>(key: string, value: T, ttl?: number) { return this.basicOps.setJson(key, value, ttl); }
  getJson<T>(key: string) { return this.basicOps.getJson<T>(key); }

  hset(key: string, field: string, value: string) { return this.hashOps.hset(key, field, value); }
  hget(key: string, field: string) { return this.hashOps.hget(key, field); }
  hgetall(key: string) { return this.hashOps.hgetall(key); }
  hdel(key: string, ...fields: string[]) { return this.hashOps.hdel(key, ...fields); }
  hmset(key: string, data: Record<string, string | number>) { return this.hashOps.hmset(key, data); }
  hsetJson<T>(key: string, field: string, value: T) { return this.hashOps.hsetJson(key, field, value); }
  hgetJson<T>(key: string, field: string) { return this.hashOps.hgetJson<T>(key, field); }

  lpush(key: string, ...values: string[]) { return this.listOps.lpush(key, ...values); }
  rpush(key: string, ...values: string[]) { return this.listOps.rpush(key, ...values); }
  lrange(key: string, start: number, stop: number) { return this.listOps.lrange(key, start, stop); }
  llen(key: string) { return this.listOps.llen(key); }
  ltrim(key: string, start: number, stop: number) { return this.listOps.ltrim(key, start, stop); }

  sadd(key: string, ...members: string[]) { return this.setOps.sadd(key, ...members); }
  smembers(key: string) { return this.setOps.smembers(key); }
  srem(key: string, ...members: string[]) { return this.setOps.srem(key, ...members); }
  sismember(key: string, member: string) { return this.setOps.sismember(key, member); }
  zadd(key: string, score: number, member: string) { return this.setOps.zadd(key, score, member); }
  zrange(key: string, start: number, stop: number) { return this.setOps.zrange(key, start, stop); }
  zrangebyscore(key: string, min: number, max: number) { return this.setOps.zrangebyscore(key, min, max); }
  zrem(key: string, ...members: string[]) { return this.setOps.zrem(key, ...members); }
  zcard(key: string) { return this.setOps.zcard(key); }

  publish(channel: string, message: string) { return this.pubSubOps.publish(channel, message); }
  subscribe(channel: string, callback: (message: string) => void) { return this.pubSubOps.subscribe(channel, callback); }
  unsubscribe(channel: string) { return this.pubSubOps.unsubscribe(channel); }

  addMessageToConversation(conversationId: string, messageData: any) { 
    return this.messagingOps.addMessageToConversation(conversationId, messageData); 
  }
  getConversationMessages(conversationId: string, limit?: number) { 
    return this.messagingOps.getConversationMessages(conversationId, limit); 
  }
  setUserOnline(userId: string) { return this.messagingOps.setUserOnline(userId); }
  setUserOffline(userId: string) { return this.messagingOps.setUserOffline(userId); }
  getOnlineUsers() { return this.messagingOps.getOnlineUsers(); }
  isUserOnline(userId: string) { return this.messagingOps.isUserOnline(userId); }
  setTypingIndicator(conversationId: string, userId: string, isTyping: boolean) { 
    return this.messagingOps.setTypingIndicator(conversationId, userId, isTyping); 
  }
  getTypingUsers(conversationId: string) { return this.messagingOps.getTypingUsers(conversationId); }
  cacheUserPresence(userId: string, presenceData: any) { 
    return this.messagingOps.cacheUserPresence(userId, presenceData); 
  }
  getUserPresence(userId: string) { return this.messagingOps.getUserPresence(userId); }
}
