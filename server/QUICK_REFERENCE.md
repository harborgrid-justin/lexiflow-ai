# 🚀 Developer Quick Reference - Refactored Modules

## Where to Find Things Now

### Workflow Engine Operations

**Main Orchestrator** (103 lines)
```typescript
import { WorkflowOrchestratorService } from './modules/workflow/engine';
```

**Helper Services** (use when you need direct access)
```typescript
import {
  TaskLifecycleService,      // Task start/complete/assign
  StageManagementService,     // Stage init/pause/resume  
  ConditionalHandlerService,  // Conditional routing
  ValidationService,          // Task/stage validation
  PostCompletionService,      // Post-task actions
  RecoveryService,           // Error recovery/retry
  MonitoringService          // Analytics/scheduled checks
} from './modules/workflow/engine/helpers';
```

### Redis Operations

**Main Service** (127 lines - delegates to helpers)
```typescript
import { RedisService } from './modules/redis';

// Use as before - all methods available
await redisService.set(key, value);
await redisService.hset(hash, field, value);
```

**Direct Helper Access** (if needed)
```typescript
import {
  RedisBasicOperations,      // get/set/del/expire
  RedisHashOperations,        // hset/hget/hgetall
  RedisListOperations,        // lpush/rpush/lrange
  RedisSetOperations,         // sadd/zadd/smembers
  RedisPubSubOperations,      // publish/subscribe
  RedisMessagingOperations    // conversations/presence
} from './modules/redis/helpers';
```

### Workflow Types

**Import All Types**
```typescript
import {
  WorkflowTask,
  TaskDependency,
  SLARule,
  SLAStatus,
  ApprovalChain,
  ConditionalRule,
  AuditLogEntry,
  WorkflowNotification,
  WorkflowMetrics,
  ParallelGroup,
  EscalationRule,
  ExternalIntegration,
  RecurringWorkflow,
  CustomField
} from './modules/workflow/engine/types';
```

**Import Specific Domain**
```typescript
import { SLARule, SLAStatus } from './modules/workflow/engine/types/sla.types';
```

## Common Patterns

### Task Operations
```typescript
// Complete a task (with error recovery)
const result = await orchestrator.completeTask(taskId, userId, {
  comments: 'Finished review',
  context: { reviewScore: 95 }
});

// Start a task (with dependency check)
const { success, blockedBy } = await orchestrator.startTask(taskId, userId);

// Assign/reassign a task
await orchestrator.assignTask(taskId, newAssigneeId, assignedBy, 'Workload balancing');
```

### Stage Operations
```typescript
// Initialize stage with features
await orchestrator.initializeStage(stageId, context, {
  enableSLA: true,
  enableApprovals: true,
  enableParallel: true
});

// Pause/resume stage
await orchestrator.pauseStage(stageId, 'Emergency pause');
await orchestrator.resumeStage(stageId);

// Get comprehensive status
const status = await orchestrator.getStageStatus(stageId);
```

### Error Recovery
```typescript
// Automatic retry with circuit breaker
const result = await recoveryService.executeWithRecovery(
  taskId,
  'operation-name',
  async () => {
    // Your operation here
    return await someOperation();
  }
);

// Manual retry of failed operation
await recoveryService.retryFailedOperation(taskId, 'operation-name');

// Check recovery states
const states = recoveryService.getRecoveryStates();
```

### Redis Patterns
```typescript
// JSON storage
await redis.setJson('user:123', userData, 3600); // TTL in seconds
const user = await redis.getJson('user:123');

// Hash operations
await redis.hsetJson('workflow:stage:1', 'metadata', { status: 'active' });
const metadata = await redis.hgetJson('workflow:stage:1', 'metadata');

// Messaging
await redis.addMessageToConversation(conversationId, messageData);
const messages = await redis.getConversationMessages(conversationId, 50);

// Presence
await redis.setUserOnline(userId);
const isOnline = await redis.isUserOnline(userId);
const onlineUsers = await redis.getOnlineUsers();
```

### Monitoring & Analytics
```typescript
// Run scheduled checks (SLA, escalations, recurring)
const report = await orchestrator.runScheduledChecks();
// Returns: { slaBreaches, escalations, recurringProcessed, errors }

// Get case workflow status
const status = await orchestrator.getCaseWorkflowStatus(caseId);
// Returns: { metrics, bottlenecks, velocity }

// Get detailed stage status
const stageStatus = await orchestrator.getStageStatus(stageId);
// Returns: { stage, tasks, parallelGroups, overallProgress }
```

## File Structure Reference

```
server/src/
├── modules/
│   ├── workflow/
│   │   ├── engine/
│   │   │   ├── workflow-orchestrator.service.ts (103 lines) ⭐
│   │   │   ├── helpers/
│   │   │   │   ├── index.ts
│   │   │   │   ├── task-lifecycle.service.ts
│   │   │   │   ├── stage-management.service.ts
│   │   │   │   ├── conditional-handler.service.ts
│   │   │   │   ├── validation.service.ts
│   │   │   │   ├── post-completion.service.ts
│   │   │   │   ├── recovery.service.ts
│   │   │   │   └── monitoring.service.ts
│   │   │   └── types/
│   │   │       ├── index.ts
│   │   │       ├── task.types.ts
│   │   │       ├── sla.types.ts
│   │   │       └── ... (13 type files)
│   │   └── workflow.module.ts (includes all helpers)
│   └── redis/
│       ├── redis.service.ts (127 lines) ⭐
│       └── helpers/
│           ├── index.ts
│           ├── redis-basic.operations.ts
│           ├── redis-hash.operations.ts
│           ├── redis-list.operations.ts
│           ├── redis-set.operations.ts
│           ├── redis-pubsub.operations.ts
│           └── redis-messaging.operations.ts
└── services/
    └── ... (other services)
```

## Testing Helpers

```typescript
// Unit test example
describe('TaskLifecycleService', () => {
  let service: TaskLifecycleService;
  let mockTimeTracking: TimeTrackingService;

  beforeEach(() => {
    // Mock only what you need
    mockTimeTracking = mock<TimeTrackingService>();
    service = new TaskLifecycleService(
      mockTaskModel,
      mockDependencyService,
      mockTimeTracking,
      mockAuditService,
      mockNotificationService,
      mockReassignmentService
    );
  });

  it('should complete task and stop timer', async () => {
    // Focused test on single responsibility
  });
});
```

## Migration Notes

### No Changes Required For:
- ✅ Existing controller code
- ✅ API endpoints
- ✅ Database models
- ✅ Client applications
- ✅ Integration tests

### Optional Improvements:
```typescript
// Old (still works)
import { WorkflowOrchestratorService } from './modules/workflow/engine';

// New (more specific, better for testing)
import { WorkflowOrchestratorService } from './modules/workflow/engine';
import { TaskLifecycleService } from './modules/workflow/engine/helpers';
```

## Performance Notes

- ✅ No performance impact (same logic, better organized)
- ✅ Helper services injected once at startup
- ✅ No additional overhead in runtime
- ✅ Circuit breaker prevents cascade failures
- ✅ Recovery service handles retries efficiently

## Questions?

**"Where did feature X go?"**
- It's still in the same main service, just delegated to a helper

**"Can I use helpers directly?"**
- Yes! They're registered in the module and available for injection

**"Do I need to update imports?"**
- No, but you can use index exports for cleaner imports

**"Will this affect performance?"**
- No, it's the same code better organized

**"How do I test helpers?"**
- Unit test them independently with mocked dependencies

---

**Quick Tip:** Use your IDE's "Go to Definition" to navigate from the main service to the helper implementations!

