// Redis Hash Operations
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisHashOperations {
  constructor(private client: Redis) {}

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

  async hsetJson<T>(key: string, field: string, value: T): Promise<number> {
    return this.hset(key, field, JSON.stringify(value));
  }

  async hgetJson<T>(key: string, field: string): Promise<T | null> {
    const value = await this.hget(key, field);
    return value ? JSON.parse(value) : null;
  }
}
