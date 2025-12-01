import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 
      'redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816';

    try {
      // Main client for general operations
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      // Separate clients for pub/sub
      this.subscriber = new Redis(redisUrl);
      this.publisher = new Redis(redisUrl);

      this.client.on('connect', () => {
        this.logger.log('✅ Redis client connected successfully');
      });

      this.client.on('error', (err) => {
        this.logger.error('❌ Redis client error:', err);
      });

      this.subscriber.on('connect', () => {
        this.logger.log('✅ Redis subscriber connected successfully');
      });

      this.publisher.on('connect', () => {
        this.logger.log('✅ Redis publisher connected successfully');
      });

      await this.client.ping();
      this.logger.log('🚀 Redis Cloud connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis Cloud:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client?.quit();
    await this.subscriber?.quit();
    await this.publisher?.quit();
    this.logger.log('Redis connections closed');
  }

  // ==================== BASIC OPERATIONS ====================

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.setex(key, ttlSeconds, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ==================== HASH OPERATIONS ====================

  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  async hmset(key: string, data: Record<string, string | number>): Promise<'OK'> {
    return this.client.hmset(key, data);
  }

  // ==================== LIST OPERATIONS ====================

  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.client.rpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  async ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    return this.client.ltrim(key, start, stop);
  }

  // ==================== SET OPERATIONS ====================

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.client.sismember(key, member);
  }

  // ==================== SORTED SET OPERATIONS ====================

  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.client.zadd(key, score, member);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zrange(key, start, stop);
  }

  async zrangebyscore(key: string, min: number, max: number): Promise<string[]> {
    return this.client.zrangebyscore(key, min, max);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.client.zrem(key, ...members);
  }

  async zcard(key: string): Promise<number> {
    return this.client.zcard(key);
  }

  // ==================== PUB/SUB OPERATIONS ====================

  async publish(channel: string, message: string): Promise<number> {
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  // ==================== PATTERN OPERATIONS ====================

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async scan(cursor: string, pattern?: string, count?: number): Promise<[string, string[]]> {
    const args: Array<string | number> = [cursor];
    if (pattern) {
      args.push('MATCH', pattern);
    }
    if (count) {
      args.push('COUNT', count);
    }
    return this.client.scan(cursor, ...(args.slice(1) as []));
  }

  // ==================== JSON HELPER METHODS ====================

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<'OK'> {
    return this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }

  async hsetJson<T>(key: string, field: string, value: T): Promise<number> {
    return this.hset(key, field, JSON.stringify(value));
  }

  async hgetJson<T>(key: string, field: string): Promise<T | null> {
    const value = await this.hget(key, field);
    return value ? JSON.parse(value) : null;
  }

  // ==================== MESSAGING SPECIFIC OPERATIONS ====================

  /**
   * Store a message in a conversation's message list
   */
  async addMessageToConversation(conversationId: string, messageData: any): Promise<void> {
    const messageKey = `conversation:${conversationId}:messages`;
    const messageJson = JSON.stringify({
      ...messageData,
      timestamp: new Date().toISOString(),
    });
    
    // Add to list
    await this.rpush(messageKey, messageJson);
    
    // Keep only last 1000 messages in Redis
    await this.ltrim(messageKey, -1000, -1);
    
    // Set expiry to 7 days
    await this.expire(messageKey, 7 * 24 * 60 * 60);
  }

  /**
   * Get recent messages from a conversation
   */
  async getConversationMessages(conversationId: string, limit: number = 100): Promise<any[]> {
    const messageKey = `conversation:${conversationId}:messages`;
    const messages = await this.lrange(messageKey, -limit, -1);
    return messages.map(msg => JSON.parse(msg));
  }

  /**
   * Mark user as online
   */
  async setUserOnline(userId: string): Promise<void> {
    const onlineKey = 'users:online';
    const userKey = `user:${userId}:status`;
    
    await this.sadd(onlineKey, userId);
    await this.setJson(userKey, { status: 'online', lastSeen: new Date().toISOString() }, 300); // 5 min TTL
  }

  /**
   * Mark user as offline
   */
  async setUserOffline(userId: string): Promise<void> {
    const onlineKey = 'users:online';
    const userKey = `user:${userId}:status`;
    
    await this.srem(onlineKey, userId);
    await this.setJson(userKey, { status: 'offline', lastSeen: new Date().toISOString() }, 86400); // 24 hour TTL
  }

  /**
   * Get online users
   */
  async getOnlineUsers(): Promise<string[]> {
    return this.smembers('users:online');
  }

  /**
   * Check if user is online
   */
  async isUserOnline(userId: string): Promise<boolean> {
    const result = await this.sismember('users:online', userId);
    return result === 1;
  }

  /**
   * Store typing indicator
   */
  async setTypingIndicator(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    const typingKey = `conversation:${conversationId}:typing`;
    
    if (isTyping) {
      await this.hset(typingKey, userId, new Date().toISOString());
      await this.expire(typingKey, 10); // Auto-expire after 10 seconds
    } else {
      await this.hdel(typingKey, userId);
    }
  }

  /**
   * Get users currently typing in a conversation
   */
  async getTypingUsers(conversationId: string): Promise<string[]> {
    const typingKey = `conversation:${conversationId}:typing`;
    const typingUsers = await this.hgetall(typingKey);
    
    // Filter out users whose typing indicator expired (>5 seconds old)
    const now = new Date().getTime();
    return Object.entries(typingUsers)
      .filter(([_, timestamp]) => {
        const typingTime = new Date(timestamp).getTime();
        return (now - typingTime) < 5000; // 5 seconds
      })
      .map(([userId]) => userId);
  }

  /**
   * Cache user presence data
   */
  async cacheUserPresence(userId: string, presenceData: any): Promise<void> {
    const presenceKey = `user:${userId}:presence`;
    await this.setJson(presenceKey, presenceData, 300); // 5 min cache
  }

  /**
   * Get cached user presence
   */
  async getUserPresence(userId: string): Promise<any | null> {
    const presenceKey = `user:${userId}:presence`;
    return this.getJson(presenceKey);
  }

  // ==================== UTILITY METHODS ====================

  getClient(): Redis {
    return this.client;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  getPublisher(): Redis {
    return this.publisher;
  }
}
