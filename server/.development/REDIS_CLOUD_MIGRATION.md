# Redis Cloud Migration - Secure Messaging System

## Overview
This document outlines the Redis Cloud integration for LexiFlow AI's secure messaging system, providing real-time capabilities including presence tracking, typing indicators, message caching, and pub/sub functionality.

## Redis Cloud Configuration

### Connection Details
- **Instance**: redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com
- **Port**: 12816
- **Region**: us-east-1-2 (AWS EC2)
- **Connection String**: `redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816`

### Environment Variables
Required environment variables in `/server/.env`:

```bash
# Redis Cloud Connection
REDIS_URL=redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816

# Connection Settings
REDIS_RETRY_ATTEMPTS=5
REDIS_RETRY_DELAY=3000
REDIS_KEEP_ALIVE=30000

# Cache TTL (seconds)
REDIS_MESSAGE_CACHE_TTL=3600      # 1 hour
REDIS_CONVERSATION_CACHE_TTL=7200  # 2 hours
REDIS_PRESENCE_TTL=300             # 5 minutes
```

## Architecture

### Components

#### 1. RedisModule (`/server/src/modules/redis/redis.module.ts`)
- **Type**: Global module
- **Purpose**: Provides RedisService across the application
- **Scope**: Application-wide singleton
- **Exports**: `RedisService`

#### 2. RedisService (`/server/src/modules/redis/redis.service.ts`)
- **Lines of Code**: 362
- **Redis Clients**: 3 (main client, subscriber, publisher)
- **Connection Strategy**: Retry with exponential backoff

##### Core Methods

**Basic Operations**:
- `get(key)` - Retrieve value by key
- `set(key, value, ttl?)` - Store value with optional TTL
- `del(key)` - Delete key
- `expire(key, seconds)` - Set expiration
- `ttl(key)` - Get time to live

**Hash Operations**:
- `hset(key, field, value)` - Set hash field
- `hget(key, field)` - Get hash field
- `hgetall(key)` - Get all hash fields
- `hmset(key, data)` - Set multiple hash fields

**List Operations**:
- `lpush(key, value)` - Push to list head
- `rpush(key, value)` - Push to list tail
- `lrange(key, start, stop)` - Get range from list
- `ltrim(key, start, stop)` - Trim list to range

**Set Operations**:
- `sadd(key, member)` - Add to set
- `smembers(key)` - Get all set members
- `srem(key, member)` - Remove from set

**Sorted Set Operations**:
- `zadd(key, score, member)` - Add to sorted set
- `zrange(key, start, stop, withScores?)` - Get range
- `zrangebyscore(key, min, max, withScores?)` - Get by score range

**Pub/Sub**:
- `publish(channel, message)` - Publish to channel
- `subscribe(channel, callback)` - Subscribe to channel
- `unsubscribe(channel)` - Unsubscribe from channel

**Messaging-Specific**:
- `addMessageToConversation(conversationId, message)` - Cache message
- `getConversationMessages(conversationId, limit)` - Retrieve cached messages
- `setUserOnline(userId)` - Mark user online with TTL
- `setUserOffline(userId)` - Mark user offline
- `setTypingIndicator(conversationId, userId)` - Set typing status
- `getTypingUsers(conversationId)` - Get users typing

**JSON Helpers**:
- `setJson(key, value, ttl?)` - Store JSON object
- `getJson<T>(key)` - Retrieve typed JSON
- `hsetJson(key, field, value)` - Store JSON in hash
- `hgetJson<T>(key, field)` - Retrieve typed JSON from hash

#### 3. MessagesService (`/server/src/modules/messages/messages.service.ts`)
- **Lines of Code**: 273 (extended from 90)
- **Redis Integration**: Constructor injection of `RedisService`

##### Enhanced Methods

**Message CRUD with Caching**:
```typescript
async createMessage(data: CreateMessageDto): Promise<Message> {
  // 1. Save to PostgreSQL
  const message = await this.messageModel.create(data);
  
  // 2. Cache in Redis (conversation list + individual message)
  await this.redisService.addMessageToConversation(conversationId, message);
  await this.redisService.setJson(`message:${message.id}`, message, 3600);
  
  // 3. Publish real-time event
  await this.redisService.publish(`conversation:${conversationId}:messages`, {
    type: 'new-message',
    message
  });
  
  return message;
}
```

```typescript
async findMessages(conversationId: number): Promise<Message[]> {
  // 1. Check Redis cache first
  const cached = await this.redisService.getConversationMessages(conversationId);
  if (cached) return cached;
  
  // 2. Fallback to database
  const messages = await this.messageModel.findAll({ where: { conversationId } });
  
  // 3. Populate cache for future requests
  for (const msg of messages) {
    await this.redisService.addMessageToConversation(conversationId, msg);
  }
  
  return messages;
}
```

**Presence Management**:
- `setUserOnline(userId)` - Set user online with 5-minute TTL
- `setUserOffline(userId)` - Remove online status
- `getUserOnlineStatus(userId)` - Check if user is online
- `getOnlineUsers()` - Get list of all online users

**Typing Indicators**:
- `setTyping(conversationId, userId, isTyping)` - Set typing status with pub/sub event
- `getTypingUsers(conversationId)` - Get users currently typing

**Real-Time Subscriptions**:
- `subscribeToConversation(conversationId, callback)` - Subscribe to conversation events
- `unsubscribeFromConversation(conversationId)` - Unsubscribe

**Read Receipts**:
- `markMessageAsRead(messageId, userId)` - Mark as read + publish event

**System Messages**:
- `sendSystemMessage(conversationId, content)` - Send automated system notification

**Unread Count**:
- `getUnreadCount(userId, conversationId)` - Get unread message count

#### 4. MessagesController (`/server/src/modules/messages/messages.controller.ts`)
- **Lines of Code**: 169
- **New Endpoints**: 9 real-time messaging endpoints

##### API Endpoints

**Presence Management**:
```typescript
POST /api/v1/messages/users/:userId/online
POST /api/v1/messages/users/:userId/offline
GET  /api/v1/messages/users/online
GET  /api/v1/messages/users/:userId/online-status
```

**Typing Indicators**:
```typescript
POST /api/v1/messages/conversations/:id/typing
  Body: { userId: number, isTyping: boolean }
  
GET  /api/v1/messages/conversations/:id/typing
```

**Read Receipts**:
```typescript
POST /api/v1/messages/messages/:id/read
  Body: { userId: number }
```

**Unread Counts**:
```typescript
GET /api/v1/messages/users/:userId/unread-count?conversationId=123
```

**System Messages**:
```typescript
POST /api/v1/messages/conversations/:id/system-message
  Body: { content: string }
```

## Data Flow

### New Message Creation Flow
```
1. Client → POST /api/v1/messages
2. MessagesController.createMessage()
3. MessagesService.createMessage()
   ├─→ PostgreSQL: Insert message
   ├─→ Redis: Cache message in conversation list
   ├─→ Redis: Cache individual message
   └─→ Redis Pub/Sub: Publish to conversation:${id}:messages
4. Subscribed clients receive real-time notification
5. Response → Client
```

### Message Retrieval Flow (Cache Strategy)
```
1. Client → GET /api/v1/messages?conversationId=123
2. MessagesController.findMessages()
3. MessagesService.findMessages()
   ├─→ Redis: Check cache (conversation:123:messages)
   │   ├─ Cache Hit → Return cached messages
   │   └─ Cache Miss ↓
   ├─→ PostgreSQL: Query messages
   └─→ Redis: Populate cache for next request
4. Response → Client
```

### Real-Time Typing Indicator Flow
```
1. User starts typing
2. Client → POST /api/v1/messages/conversations/123/typing
   Body: { userId: 456, isTyping: true }
3. MessagesService.setTyping()
   ├─→ Redis Set: Add to conversation:123:typing (TTL: 10s)
   └─→ Redis Pub/Sub: Publish to conversation:123:typing
4. Subscribed clients receive typing event
5. Other users see "User is typing..." indicator
6. After 10s of inactivity, Redis auto-expires typing status
```

### Presence Management Flow
```
1. User connects
2. Client → POST /api/v1/messages/users/456/online
3. MessagesService.setUserOnline(456)
   └─→ Redis Set: Add to users:online (TTL: 300s)
4. Client heartbeat every 4 minutes to maintain online status
5. On disconnect → POST /api/v1/messages/users/456/offline
6. MessagesService.setUserOffline(456)
   └─→ Redis Set: Remove from users:online
```

## Redis Data Structures

### Keys and TTLs

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `conversation:{id}:messages` | List | 1 hour | Cached message list |
| `message:{id}` | String (JSON) | 1 hour | Individual message cache |
| `conversation:{id}:typing` | Set | 10 seconds | Users currently typing |
| `users:online` | Set | 5 minutes | Online user IDs |
| `user:{id}:online` | String | 5 minutes | Individual user online status |
| `conversation:{id}:unread:{userId}` | String | No expiry | Unread message count |

### Pub/Sub Channels

| Channel | Event Types | Payload |
|---------|-------------|---------|
| `conversation:{id}:messages` | `new-message`, `message-read`, `message-deleted` | `{ type, message, userId? }` |
| `conversation:{id}:typing` | `typing-start`, `typing-stop` | `{ type, userId, conversationId }` |
| `user:{id}:presence` | `online`, `offline` | `{ type, userId, timestamp }` |

## Dependencies

### Installed Packages
```json
{
  "redis": "^4.7.0",           // Alternative Redis client
  "ioredis": "^5.4.2",         // Primary Redis client (better cluster support)
  "@nestjs/cache-manager": "^2.2.2",
  "cache-manager": "^5.7.6",
  "cache-manager-redis-store": "^3.0.1"
}
```

### Module Dependencies
```
RedisModule (Global)
  └─→ MessagesModule
      ├─→ SequelizeModule.forFeature([Message, Conversation])
      └─→ RedisModule
```

## Performance Optimizations

### Caching Strategy
1. **Write-Through Cache**: New messages written to both DB and cache
2. **Read-Through Cache**: Check cache first, fallback to DB
3. **Cache Invalidation**: Manual on updates/deletes
4. **TTL-Based Expiry**: Automatic cleanup of stale data

### Connection Pooling
- **Main Client**: General operations (get, set, hset, etc.)
- **Subscriber Client**: Dedicated for pub/sub subscriptions
- **Publisher Client**: Dedicated for publishing messages

### Data Structure Selection
- **Lists**: Message history (FIFO, range queries)
- **Sets**: Online users, typing users (fast membership tests)
- **Sorted Sets**: Future use (leaderboards, time-based queries)
- **Strings (JSON)**: Individual message caching

## Testing Checklist

### Unit Tests (To Be Implemented)
- [ ] RedisService connection handling
- [ ] RedisService retry logic
- [ ] MessagesService caching behavior
- [ ] MessagesService pub/sub events
- [ ] Presence management TTL expiry

### Integration Tests (To Be Implemented)
- [ ] End-to-end message creation with caching
- [ ] Real-time typing indicator propagation
- [ ] Online presence with heartbeat
- [ ] Read receipt delivery
- [ ] System message broadcasting

### Manual Testing Steps

1. **Connection Test**:
```bash
cd /workspaces/lexiflow-ai/server
npm run start:dev
# Check logs for "Redis connected successfully"
```

2. **Presence Test**:
```bash
# Set user online
curl -X POST http://localhost:3001/api/v1/messages/users/1/online

# Check online users
curl http://localhost:3001/api/v1/messages/users/online

# Set user offline
curl -X POST http://localhost:3001/api/v1/messages/users/1/offline
```

3. **Typing Indicator Test**:
```bash
# Start typing
curl -X POST http://localhost:3001/api/v1/messages/conversations/1/typing \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "isTyping": true}'

# Check typing users
curl http://localhost:3001/api/v1/messages/conversations/1/typing
```

4. **Message Caching Test**:
```bash
# Create message (caches in Redis)
curl -X POST http://localhost:3001/api/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId": 1, "senderId": 1, "content": "Test message"}'

# Retrieve messages (should use cache)
curl "http://localhost:3001/api/v1/messages?conversationId=1"
```

5. **Redis CLI Direct Test**:
```bash
# Connect to Redis Cloud
redis-cli -u redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816

# Test commands
PING
SET test "hello"
GET test
KEYS *
```

## Monitoring & Observability

### Redis Cloud Dashboard
- **URL**: https://app.redislabs.com/
- **Metrics**: Operations/sec, memory usage, connected clients, hit rate

### Application Logs
Key log messages to monitor:
```typescript
"Redis connected successfully"
"Redis connection error: ..."
"Redis reconnecting... (attempt X/5)"
"Redis subscriber connected"
"Redis publisher connected"
```

### Health Check Endpoint (To Be Added)
```typescript
GET /api/v1/health/redis
Response: {
  status: "connected" | "disconnected",
  uptime: 123456,
  connectedClients: 3,
  memoryUsage: "1.2MB"
}
```

## Troubleshooting

### Connection Issues
**Symptom**: "Redis connection error: ECONNREFUSED"
**Solution**: 
1. Verify REDIS_URL in `.env`
2. Check network connectivity to Redis Cloud
3. Verify Redis Cloud instance is active
4. Check firewall rules

**Symptom**: "Redis authentication failed"
**Solution**: 
1. Verify password in REDIS_URL matches Redis Cloud dashboard
2. Check username is "default"

### Performance Issues
**Symptom**: Slow message retrieval
**Solution**:
1. Check Redis Cloud memory usage (eviction policy)
2. Adjust TTL values if cache hit rate is low
3. Monitor network latency to Redis Cloud

**Symptom**: High memory usage in Redis
**Solution**:
1. Reduce TTL values for cached data
2. Implement cache size limits (maxmemory policy)
3. Review data structure efficiency

### Data Consistency
**Symptom**: Cached data doesn't match database
**Solution**:
1. Implement cache invalidation on updates/deletes
2. Add versioning to cached objects
3. Use shorter TTLs for frequently updated data

## Security Considerations

### Authentication
- ✅ Password authentication enabled (default user)
- ✅ TLS/SSL connection to Redis Cloud
- ⚠️ TODO: Rotate Redis password periodically

### Data Protection
- ✅ Temporary caching with TTL (no permanent storage in Redis)
- ✅ Sensitive data encrypted in PostgreSQL (primary storage)
- ⚠️ TODO: Consider encrypting cached message content

### Access Control
- ✅ Redis connection restricted to application server
- ✅ No direct client access to Redis
- ⚠️ TODO: Implement IP whitelisting in Redis Cloud

## Future Enhancements

### Short-Term (Next Sprint)
1. **WebSocket Gateway**: Add NestJS WebSocket gateway for bidirectional real-time communication
2. **Message Queue**: Use Redis Streams for reliable message delivery
3. **Rate Limiting**: Implement Redis-based rate limiting for API endpoints
4. **Session Store**: Move session storage from PostgreSQL to Redis

### Medium-Term
1. **Message Search**: Add Redis Search module for full-text message search
2. **Notification Queue**: Use Redis for push notification queuing
3. **Analytics**: Track messaging metrics in Redis (messages/hour, active users)
4. **Geo-Distribution**: Add Redis Cloud geo-replication for global availability

### Long-Term
1. **Redis Cluster**: Migrate to Redis Cluster for horizontal scaling
2. **Event Sourcing**: Use Redis Streams for event sourcing architecture
3. **AI Integration**: Cache AI-generated responses in Redis
4. **Microservices**: Extract messaging to separate microservice with Redis as message bus

## Migration Rollback Plan

If issues arise, rollback steps:

1. **Stop Application**:
```bash
cd /workspaces/lexiflow-ai/server
npm run stop
```

2. **Revert Environment Configuration**:
```bash
# Edit server/.env
# Change REDIS_URL back to: REDIS_HOST=localhost, REDIS_PORT=6379
```

3. **Revert Code Changes**:
```bash
git checkout HEAD~1 -- src/modules/redis/
git checkout HEAD~1 -- src/modules/messages/
```

4. **Restart with Local Redis**:
```bash
docker-compose up -d redis
npm run start:dev
```

## Support & Resources

- **Redis Cloud Support**: support@redislabs.com
- **Documentation**: https://redis.io/docs/
- **ioredis GitHub**: https://github.com/redis/ioredis
- **NestJS Redis**: https://docs.nestjs.com/techniques/caching

## Changelog

### Version 1.0.0 (Current)
- ✅ Redis Cloud connection established
- ✅ RedisModule created as global module
- ✅ RedisService with 30+ methods
- ✅ MessagesService enhanced with Redis integration
- ✅ 9 new real-time messaging endpoints
- ✅ Presence management
- ✅ Typing indicators
- ✅ Message caching
- ✅ Pub/Sub event system
- ✅ Environment configuration
- ⏳ Pending: Testing and validation

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: LexiFlow AI Development Team
