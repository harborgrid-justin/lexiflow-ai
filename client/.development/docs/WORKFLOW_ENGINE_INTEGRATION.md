# Master Workflow Engine - Frontend Integration Guide

## Overview

The Master Workflow Engine has been fully integrated into the LexiFlow frontend with all 10 enterprise capabilities:

1. **Task Dependencies** - Define blocking and informational dependencies between tasks
2. **SLA Management** - Monitor service level agreements with warnings and breach alerts
3. **Approval Workflows** - Multi-level approval chains with step-by-step processing
4. **Conditional Branching** - If/then logic for task routing and stage transitions
5. **Time Tracking Integration** - Automatic time logging from task completion
6. **Notification System** - Real-time email/push notifications for task events
7. **Audit Trail** - Complete history of all workflow changes
8. **Parallel Tasks** - Support concurrent task execution with flexible completion rules
9. **Task Reassignment** - Bulk and individual task reassignment capabilities
10. **Workflow Analytics** - Performance metrics, velocity, and bottleneck analysis

## Components Created

### Core Workflow Components

#### 1. `TaskDependencyManager.tsx`
Manages task dependencies with visual dependency tracking.

**Features:**
- Add/edit blocking or informational dependencies
- Check if tasks can be started based on dependencies
- Visual representation of dependency chains
- Circular dependency detection

**Props:**
```typescript
{
  taskId: string;
  taskTitle: string;
  availableTasks: Array<{ id: string; title: string; status: string }>;
  onUpdate?: () => void;
}
```

#### 2. `SLAMonitor.tsx`
Monitors and displays SLA status for tasks and cases.

**Features:**
- Real-time SLA status tracking (OK, Warning, Breached)
- Hours remaining/overdue calculations
- Case-wide breach reporting
- Priority-based SLA rules

**Props:**
```typescript
{
  taskId?: string;
  caseId?: string;
  showBreachReport?: boolean;
}
```

#### 3. `ApprovalWorkflow.tsx`
Handles multi-level approval chains for tasks.

**Features:**
- Create sequential approval chains
- Approve/reject with comments
- Visual progress through approval steps
- Notifications to next approver

**Props:**
```typescript
{
  taskId: string;
  taskTitle: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  onUpdate?: () => void;
}
```

#### 4. `TimeTrackingPanel.tsx`
Time tracking with automatic logging.

**Features:**
- Start/stop timer for tasks
- Live elapsed time display
- Auto-log on task completion
- Time entry history

**Props:**
```typescript
{
  taskId: string;
  taskTitle: string;
  userId: string;
  onUpdate?: () => void;
}
```

#### 5. `ParallelTasksManager.tsx`
Manages parallel task execution groups.

**Features:**
- Create parallel task groups
- Configurable completion rules (all, any, percentage)
- Progress tracking for groups
- Visual group status

**Props:**
```typescript
{
  stageId: string;
  tasks: Array<{ id: string; title: string; status: string }>;
  onUpdate?: () => void;
}
```

#### 6. `TaskReassignmentPanel.tsx`
Comprehensive task reassignment interface.

**Features:**
- Single task reassignment
- Bulk reassignment
- User-to-user reassignment
- Assignment history tracking

**Props:**
```typescript
{
  caseId?: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  tasks: Array<{ id: string; title: string; assignedTo?: string; status: string }>;
  onUpdate?: () => void;
}
```

#### 7. `NotificationCenter.tsx`
Real-time notification management.

**Features:**
- Unread notification badges
- Auto-refresh every 30 seconds
- Mark as read functionality
- Categorized notification types

**Props:**
```typescript
{
  userId: string;
  compact?: boolean;
}
```

#### 8. `AuditTrailViewer.tsx`
Complete audit log visualization.

**Features:**
- Filterable by entity type
- Detailed change tracking
- User attribution
- Metadata expansion

**Props:**
```typescript
{
  caseId?: string;
  entityType?: 'task' | 'stage' | 'workflow';
  entityId?: string;
  limit?: number;
}
```

#### 9. `WorkflowAnalyticsDashboard.tsx`
Enhanced with real-time metrics.

**Features:**
- Task velocity tracking
- Bottleneck analysis
- SLA breach monitoring
- Stage progress visualization

#### 10. `EnhancedWorkflowPanel.tsx`
Main orchestration component combining all features.

**Features:**
- Tabbed interface for all workflow capabilities
- Context-aware feature display
- Integrated analytics
- Real-time updates

## Hook Integration

### `useWorkflowEngine.ts`

The custom React hook provides all workflow engine capabilities:

```typescript
const {
  // Dependencies
  setTaskDependencies,
  getTaskDependencies,
  canStartTask,
  
  // SLA
  setSLARule,
  getTaskSLAStatus,
  checkSLABreaches,
  
  // Approvals
  createApprovalChain,
  processApproval,
  getApprovalChain,
  
  // Conditional
  addConditionalRule,
  evaluateConditions,
  
  // Time Tracking
  startTimeTracking,
  stopTimeTracking,
  getTimeEntries,
  
  // Notifications
  getNotifications,
  markNotificationRead,
  
  // Audit
  getAuditLog,
  getCaseAuditLog,
  
  // Parallel
  createParallelGroup,
  checkParallelGroupCompletion,
  getParallelGroups,
  
  // Reassignment
  reassignTask,
  bulkReassignTasks,
  reassignAllFromUser,
  
  // Analytics
  getWorkflowMetrics,
  getTaskVelocity,
  getBottlenecks,
  
  loading,
  error
} = useWorkflowEngine();
```

## Updated Components

### `MasterWorkflow.tsx`
- Added "Analytics" tab with global metrics
- Added "Notifications" tab with notification center
- Unread notification badge in header
- SLA breach reporting

### `CaseWorkflow.tsx`
- New "Workflow Engine" tab
- Integration with `EnhancedWorkflowPanel`
- Task selection for engine features
- Real-time workflow status

## Usage Examples

### 1. Adding Task Dependencies

```typescript
import { TaskDependencyManager } from './workflow';

<TaskDependencyManager
  taskId="task-123"
  taskTitle="Review Contract"
  availableTasks={allTasks}
  onUpdate={() => refreshWorkflow()}
/>
```

### 2. Monitoring SLA

```typescript
import { SLAMonitor } from './workflow';

// Single task
<SLAMonitor taskId="task-123" />

// Case-wide breach report
<SLAMonitor caseId="case-456" showBreachReport />
```

### 3. Creating Approval Chain

```typescript
import { ApprovalWorkflow } from './workflow';

<ApprovalWorkflow
  taskId="task-789"
  taskTitle="Sign Settlement Agreement"
  currentUserId={user.id}
  users={teamMembers}
  onUpdate={() => refreshWorkflow()}
/>
```

### 4. Time Tracking

```typescript
import { TimeTrackingPanel } from './workflow';

<TimeTrackingPanel
  taskId="task-101"
  taskTitle="Research Case Law"
  userId={currentUser.id}
  onUpdate={() => updateBilling()}
/>
```

### 5. Parallel Tasks

```typescript
import { ParallelTasksManager } from './workflow';

<ParallelTasksManager
  stageId="stage-202"
  tasks={stageTasks}
  onUpdate={() => refreshStage()}
/>
```

## API Integration

All components connect to the backend via the workflow engine endpoints:

```
POST   /api/v1/workflow/engine/dependencies/:taskId
GET    /api/v1/workflow/engine/dependencies/:taskId/can-start
POST   /api/v1/workflow/engine/sla/rules
GET    /api/v1/workflow/engine/sla/breaches
POST   /api/v1/workflow/engine/approvals/:taskId
POST   /api/v1/workflow/engine/approvals/:taskId/process
POST   /api/v1/workflow/engine/time/:taskId/start
POST   /api/v1/workflow/engine/time/:taskId/stop
GET    /api/v1/workflow/engine/notifications/:userId
POST   /api/v1/workflow/engine/parallel
POST   /api/v1/workflow/engine/reassign/:taskId
GET    /api/v1/workflow/engine/analytics/metrics
GET    /api/v1/workflow/engine/analytics/bottlenecks
GET    /api/v1/workflow/engine/audit
```

## Styling

All components use:
- Tailwind CSS utility classes
- Consistent color scheme (blue for primary, amber for warnings, red for alerts)
- Lucide React icons
- Responsive design with mobile-first approach
- Smooth transitions and animations

## Error Handling

The `useWorkflowEngine` hook provides:
- Loading states
- Error messages
- Automatic error recovery
- Null-safe returns

```typescript
const { loading, error } = useWorkflowEngine();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

## Performance Considerations

- Notification center auto-refreshes every 30 seconds
- Analytics dashboard caches metrics
- Lazy loading for audit logs (limit parameter)
- Debounced search/filter operations

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live notifications
2. **Conditional Rules UI** - Visual rule builder for conditional branching
3. **Workflow Templates** - Pre-configured workflow patterns
4. **Custom Fields** - Dynamic field support in workflow tasks
5. **External Integrations** - Webhook configurations for third-party systems
6. **Recurring Workflows** - Scheduled recurring task automation
7. **Version Control** - Workflow versioning and rollback capabilities
8. **Mobile App** - React Native components for mobile workflow management

## Testing

To test the integration:

1. Navigate to any case detail page
2. Click the "Workflow" tab
3. Select "Workflow Engine" sub-tab
4. Explore all 10 capabilities through the tabbed interface
5. Test notifications by triggering workflow events
6. Monitor analytics in the Master Workflow page

## Support

For issues or questions:
- Check the backend API documentation at `/api/docs`
- Review component props in TypeScript definitions
- See workflow engine types in `types/workflow-engine.ts`
