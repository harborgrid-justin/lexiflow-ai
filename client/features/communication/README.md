# Communication & Collaboration Feature

Comprehensive secure communication and collaboration system for LexiFlow AI, enabling seamless team coordination while maintaining attorney-client privilege.

## Overview

This feature provides enterprise-grade messaging, notifications, activity tracking, and secure document sharing designed specifically for legal practice management.

## Architecture

```
communication/
├── api/                          # API hooks and types
│   ├── communication.types.ts   # TypeScript type definitions
│   ├── messages.api.ts          # Message & conversation queries/mutations
│   └── notifications.api.ts     # Notification & activity queries/mutations
├── components/                   # React components
│   ├── SecureLabel.tsx          # Security level indicators
│   ├── UserPresence.tsx         # Online/offline status
│   ├── TypingIndicator.tsx      # "User is typing..." indicator
│   ├── ReadReceipts.tsx         # Message read status
│   ├── NotificationBadge.tsx    # Unread count badges
│   ├── MessageBubble.tsx        # Individual message display
│   ├── FileAttachment.tsx       # File preview/download
│   ├── ParticipantList.tsx      # Conversation participants
│   ├── ConversationItem.tsx     # Conversation preview
│   ├── ConversationList.tsx     # Conversation sidebar
│   ├── MessageComposer.tsx      # Rich text composer
│   ├── NotificationItem.tsx     # Notification display
│   ├── NotificationCenter.tsx   # Notification dropdown
│   ├── ActivityItem.tsx         # Activity feed item
│   ├── ActivityFeed.tsx         # Global activity stream
│   └── ShareDialog.tsx          # Secure sharing modal
├── pages/
│   └── MessagesPage.tsx         # Main messages page
├── store/
│   └── communication.store.ts   # React Context state management
└── index.ts                      # Public exports

## Features

### 1. Secure Messaging

**Three-Column Layout:**
- **Left:** Conversation list with search and filters
- **Center:** Active conversation with message history
- **Right:** Conversation details (participants, files, case links)

**Message Types:**
- Direct messages (1-on-1)
- Group conversations
- Case-linked discussions
- System messages

**Security Levels:**
- Standard
- Privileged (attorney work product)
- Confidential
- Attorney-Client (highest protection)

**Rich Messaging:**
- Text formatting
- @mentions with autocomplete
- File attachments with preview
- Message threading (replies)
- Read receipts
- Typing indicators
- Message editing and deletion

### 2. Notification Center

**Notification Types:**
- Task assignments
- @mentions
- Deadline reminders
- Case updates
- Document shares
- Approval requests
- Comments
- Direct messages
- System alerts

**Features:**
- Real-time updates
- Filter by type
- Unread/read status
- Quick actions
- Mark all as read
- Customizable preferences
- Email/push integration

### 3. Activity Feed

**Activity Tracking:**
- Case creation/updates
- Document uploads/edits
- Task completions
- Time entries
- Comments
- User joins/leaves

**Filtering:**
- By case
- By team member
- By activity type
- By date range

**Real-time Updates:**
- Live activity indicator
- Auto-refresh
- Event streaming

### 4. Secure Sharing

**Share Targets:**
- Cases
- Documents
- Folders

**Permission Levels:**
- View only
- Comment
- Edit

**Recipient Types:**
- Internal team members
- External counsel
- Clients (limited access)

**Security Controls:**
- Expiration dates
- Access logging
- Password protection
- Login requirements
- Download restrictions
- Print/copy restrictions
- Watermarking
- Access count limits

## Usage

### Basic Setup

```tsx
import { CommunicationProvider } from '@/features/communication';

function App() {
  return (
    <CommunicationProvider>
      <YourApp />
    </CommunicationProvider>
  );
}
```

### Messages Page

```tsx
import { MessagesPage } from '@/features/communication';

function Messages() {
  return <MessagesPage />;
}
```

### Notification Center

```tsx
import { NotificationCenter, NotificationIcon } from '@/features/communication';
import { useNotifications, useUnreadCount } from '@/features/communication';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();

  return (
    <NotificationCenter
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onToggle={() => setIsOpen(!isOpen)}
      triggerElement={
        <NotificationIcon
          unreadCount={unreadData?.count || 0}
          onClick={() => setIsOpen(!isOpen)}
        />
      }
    />
  );
}
```

### Activity Feed

```tsx
import { ActivityFeed } from '@/features/communication';

function Dashboard() {
  return (
    <ActivityFeed
      showFilters
      maxHeight="600px"
      onActivityClick={(id, type, resourceId) => {
        // Navigate to resource
      }}
    />
  );
}
```

### Secure Sharing

```tsx
import { ShareDialog } from '@/features/communication';

function DocumentActions({ documentId, documentName }) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShare = async (input) => {
    // API call to create share
    await createShare(input);
  };

  return (
    <>
      <button onClick={() => setShowShareDialog(true)}>
        Share Document
      </button>

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        resourceType="document"
        resourceId={documentId}
        resourceName={documentName}
        onShare={handleShare}
      />
    </>
  );
}
```

## API Hooks

### Messages

```tsx
import {
  useConversations,
  useConversation,
  useConversationMessages,
  useSendMessage,
  useMarkAsRead,
  useSearchMessages,
  useUnreadCount,
} from '@/features/communication';

// Fetch conversations
const { data, isLoading } = useConversations({ unreadOnly: true });

// Send message
const sendMessage = useSendMessage();
await sendMessage.mutateAsync({
  conversationId: 'conv-123',
  content: 'Hello!',
  securityLevel: 'attorney-client',
});

// Mark as read
const markRead = useMarkAsRead();
await markRead.mutateAsync({
  conversationId: 'conv-123',
  readAll: true,
});
```

### Notifications

```tsx
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useClearNotifications,
} from '@/features/communication';

// Fetch notifications
const { data } = useNotifications({
  type: ['task_assigned', 'mention'],
  unreadOnly: true,
});

// Mark as read
const markRead = useMarkNotificationRead();
await markRead.mutateAsync('notif-123');
```

### Activity

```tsx
import {
  useActivityFeed,
  useCaseActivity,
  useUserActivity,
} from '@/features/communication';

// Global activity
const { data } = useActivityFeed({
  type: ['case_updated', 'document_uploaded'],
  dateFrom: '2025-01-01',
});

// Case-specific activity
const { data } = useCaseActivity('case-123');
```

## State Management

### Communication Store

```tsx
import { useCommunicationStore } from '@/features/communication';

function MessageComponent() {
  const {
    activeConversationId,
    setActiveConversationId,
    totalUnreadMessages,
    isNotificationPanelOpen,
    toggleNotificationPanel,
    saveDraft,
    getDraft,
  } = useCommunicationStore();

  // Use store values and actions
}
```

## Security Features

### Attorney-Client Privilege Protection

1. **Visual Indicators:**
   - Security labels on all messages
   - Color-coded security levels
   - Prominent warnings for privileged content

2. **Access Control:**
   - Role-based permissions
   - Secure sharing with expiration
   - Access logging and audit trails

3. **Data Protection:**
   - End-to-end encryption
   - Secure file storage
   - Watermarking support

### Compliance

- GDPR compliant
- HIPAA compliant
- SOC 2 Type II certified
- Attorney-client privilege maintained

## Backend Integration

### Required Endpoints

```typescript
// Messages
GET    /api/messages/conversations
GET    /api/messages/conversations/:id
GET    /api/messages/conversations/:id/messages
POST   /api/messages
PUT    /api/messages/:id
DELETE /api/messages/:id
POST   /api/messages/mark-read
GET    /api/messages/search
GET    /api/messages/unread-count

// Notifications
GET    /api/notifications
GET    /api/notifications/unread-count
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
PUT    /api/notifications/:id/read
POST   /api/notifications/mark-all-read
DELETE /api/notifications/:id
DELETE /api/notifications

// Activity
GET    /api/activity
GET    /api/activity/global
GET    /api/activity/case/:caseId
GET    /api/activity/user/:userId
POST   /api/activity
DELETE /api/activity/:id

// Sharing
POST   /api/shares
GET    /api/shares/:id
PUT    /api/shares/:id
DELETE /api/shares/:id
GET    /api/shares/:id/access-logs
```

### WebSocket Events (Optional)

For real-time updates:

```typescript
// Client subscribes to:
conversation.message.new
conversation.typing
notification.new
activity.new
user.presence.update

// Client emits:
conversation.typing.start
conversation.typing.stop
```

## Performance Considerations

### Optimizations

1. **TanStack Query:**
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - Stale-while-revalidate

2. **Lazy Loading:**
   - Paginated messages
   - Virtual scrolling (if needed)
   - On-demand component loading

3. **Debouncing:**
   - Typing indicators (3s)
   - Search queries (300ms)
   - Auto-save drafts (1s)

### Caching Strategy

```typescript
// Messages: 2 minutes
staleTime: 1000 * 60 * 2

// Notifications: 30 seconds
staleTime: 1000 * 30
refetchInterval: 1000 * 30

// Activity: 1 minute
staleTime: 1000 * 60
```

## Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '@/features/communication';

test('renders message bubble', () => {
  render(
    <MessageBubble
      message={mockMessage}
      isOwn={false}
    />
  );
  expect(screen.getByText(mockMessage.content)).toBeInTheDocument();
});
```

### API Testing

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useSendMessage } from '@/features/communication';

test('sends message', async () => {
  const { result } = renderHook(() => useSendMessage());

  result.current.mutate({
    conversationId: 'test',
    content: 'Hello',
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

## Accessibility

### ARIA Labels

- All interactive elements have proper labels
- Keyboard navigation support
- Screen reader friendly
- Focus management

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift+Enter`: New line
- `Esc`: Close modals/panels
- `Tab`: Navigate through elements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new features:

1. Follow existing patterns
2. Add TypeScript types
3. Include security considerations
4. Write tests
5. Update documentation

## License

Proprietary - LexiFlow AI

## Support

For issues or questions:
- Email: support@lexiflow.ai
- Docs: https://docs.lexiflow.ai
- Slack: #communication-feature
