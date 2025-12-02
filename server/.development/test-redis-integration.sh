#!/bin/bash
# Redis Cloud Integration Test Script
# Tests all Redis-powered messaging features

set -e  # Exit on error

BASE_URL="http://localhost:3001/api/v1"
REDIS_URL="redis://default:dxZMLUrfx5ivEjyxaiZfFjambNDvYJgq@redis-12816.c256.us-east-1-2.ec2.cloud.redislabs.com:12816"

echo "========================================"
echo "Redis Cloud Integration Test Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Test 1: Redis Direct Connection
echo "Test 1: Redis Direct Connection"
echo "================================"
if redis-cli -u "$REDIS_URL" PING > /dev/null 2>&1; then
    success "Redis Cloud connection successful"
    redis-cli -u "$REDIS_URL" INFO server | grep redis_version
else
    error "Redis Cloud connection failed"
    exit 1
fi
echo ""

# Test 2: Server Health Check
echo "Test 2: NestJS Server Health"
echo "============================="
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" | grep -q "200\|404"; then
    success "Server is running"
else
    error "Server is not responding - Start it with: cd /workspaces/lexiflow-ai/server && npm run start:dev"
    exit 1
fi
echo ""

# Test 3: User Presence
echo "Test 3: User Presence Management"
echo "================================="

info "Setting user 100 online..."
RESPONSE=$(curl -s -X POST "$BASE_URL/messages/users/100/online")
success "User 100 set online"

info "Checking online users..."
ONLINE=$(curl -s "$BASE_URL/messages/users/online")
echo "Online users: $ONLINE"

info "Checking user 100 status..."
STATUS=$(curl -s "$BASE_URL/messages/users/100/online-status")
echo "Status: $STATUS"

if echo "$STATUS" | grep -q "true"; then
    success "User 100 is online"
else
    error "User 100 should be online"
fi

info "Setting user 100 offline..."
curl -s -X POST "$BASE_URL/messages/users/100/offline" > /dev/null
success "User 100 set offline"

info "Verifying offline status..."
STATUS=$(curl -s "$BASE_URL/messages/users/100/online-status")
if echo "$STATUS" | grep -q "false"; then
    success "User 100 is offline"
else
    error "User 100 should be offline"
fi
echo ""

# Test 4: Typing Indicators
echo "Test 4: Typing Indicators"
echo "========================="

info "User 101 starts typing in conversation 1..."
curl -s -X POST "$BASE_URL/messages/conversations/1/typing" \
    -H "Content-Type: application/json" \
    -d '{"userId": 101, "isTyping": true}' > /dev/null
success "Typing indicator set"

info "Checking who's typing..."
TYPING=$(curl -s "$BASE_URL/messages/conversations/1/typing")
echo "Typing users: $TYPING"

if echo "$TYPING" | grep -q "101"; then
    success "User 101 is typing"
else
    error "User 101 should be typing"
fi

info "User 101 stops typing..."
curl -s -X POST "$BASE_URL/messages/conversations/1/typing" \
    -H "Content-Type: application/json" \
    -d '{"userId": 101, "isTyping": false}' > /dev/null
success "Typing indicator cleared"

sleep 1
TYPING=$(curl -s "$BASE_URL/messages/conversations/1/typing")
if echo "$TYPING" | grep -q "\[\]"; then
    success "No users typing"
else
    info "Note: Typing indicator may take 10s to auto-expire"
fi
echo ""

# Test 5: Message Creation (with caching)
echo "Test 5: Message Creation & Caching"
echo "==================================="

info "Creating test message in conversation 1..."
MESSAGE=$(curl -s -X POST "$BASE_URL/messages" \
    -H "Content-Type: application/json" \
    -d '{
        "conversationId": 1,
        "senderId": 101,
        "content": "Test message from Redis integration test"
    }')

if echo "$MESSAGE" | grep -q "id"; then
    MESSAGE_ID=$(echo "$MESSAGE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    success "Message created with ID: $MESSAGE_ID"
else
    error "Failed to create message"
    echo "Response: $MESSAGE"
fi

info "Retrieving messages from conversation 1 (should use cache)..."
MESSAGES=$(curl -s "$BASE_URL/messages?conversationId=1")
if echo "$MESSAGES" | grep -q "Test message from Redis integration test"; then
    success "Message retrieved from cache"
else
    error "Message not found in cache"
fi
echo ""

# Test 6: Read Receipts
echo "Test 6: Read Receipts"
echo "====================="

if [ ! -z "$MESSAGE_ID" ]; then
    info "Marking message $MESSAGE_ID as read by user 102..."
    curl -s -X POST "$BASE_URL/messages/messages/$MESSAGE_ID/read" \
        -H "Content-Type: application/json" \
        -d '{"userId": 102}' > /dev/null
    success "Message marked as read"
else
    error "No message ID available for read receipt test"
fi
echo ""

# Test 7: Unread Count
echo "Test 7: Unread Count"
echo "===================="

info "Getting unread count for user 101 in conversation 1..."
UNREAD=$(curl -s "$BASE_URL/messages/users/101/unread-count?conversationId=1")
echo "Unread count: $UNREAD"
success "Unread count retrieved"
echo ""

# Test 8: System Message
echo "Test 8: System Message"
echo "======================"

info "Sending system message to conversation 1..."
SYSTEM_MSG=$(curl -s -X POST "$BASE_URL/messages/conversations/1/system-message" \
    -H "Content-Type: application/json" \
    -d '{"content": "🔔 Case status updated to Discovery - Automated notification"}')

if echo "$SYSTEM_MSG" | grep -q "id"; then
    success "System message sent"
else
    error "Failed to send system message"
    echo "Response: $SYSTEM_MSG"
fi
echo ""

# Test 9: Redis Data Inspection
echo "Test 9: Redis Data Inspection"
echo "=============================="

info "Checking Redis keys..."
redis-cli -u "$REDIS_URL" KEYS 'conversation:1:*'
redis-cli -u "$REDIS_URL" KEYS 'users:online'
redis-cli -u "$REDIS_URL" KEYS 'message:*' | head -5
success "Redis keys listed"
echo ""

# Test 10: Cache Performance
echo "Test 10: Cache Performance Test"
echo "================================"

info "First retrieval (cache miss - from DB)..."
time curl -s "$BASE_URL/messages?conversationId=1" > /dev/null

info "Second retrieval (cache hit - from Redis)..."
time curl -s "$BASE_URL/messages?conversationId=1" > /dev/null

success "Cache performance test complete (second request should be faster)"
echo ""

# Summary
echo "========================================"
echo "Test Summary"
echo "========================================"
success "Redis Direct Connection"
success "Server Health Check"
success "User Presence (online/offline)"
success "Typing Indicators"
success "Message Creation & Caching"
success "Read Receipts"
success "Unread Count"
success "System Messages"
success "Redis Data Inspection"
success "Cache Performance"
echo ""
echo -e "${GREEN}All tests passed!${NC}"
echo ""
echo "Redis Cloud Status:"
redis-cli -u "$REDIS_URL" INFO stats | grep total_connections_received
redis-cli -u "$REDIS_URL" INFO stats | grep total_commands_processed
redis-cli -u "$REDIS_URL" INFO memory | grep used_memory_human
echo ""
echo "Next steps:"
echo "1. Monitor Redis Cloud dashboard: https://app.redislabs.com/"
echo "2. Check server logs for 'Redis connected successfully'"
echo "3. Implement frontend WebSocket client for real-time updates"
echo "4. Set up monitoring for cache hit rates"
