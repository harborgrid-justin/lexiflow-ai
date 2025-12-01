// Redis Pub/Sub Operations
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubOperations {
  constructor(
    private publisher: Redis,
    private subscriber: Redis,
  ) {}

  async publish(channel: string, message: string): Promise<number> {
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }
}
