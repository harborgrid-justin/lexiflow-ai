# Workflow & Task Management Feature

Enterprise-grade workflow and task management system for LexiFlow AI that exceeds legal practice management tools.

## Overview

This feature provides comprehensive task and workflow management capabilities designed specifically for legal practice management. It includes task tracking, workflow automation, time tracking, and collaborative features.

## Architecture

```
workflow/
├── api/                    # TanStack Query API hooks
│   ├── tasks.api.ts       # Task management API
│   └── workflows.api.ts   # Workflow management API
├── components/            # Reusable UI components
│   ├── PriorityBadge.tsx
│   ├── TaskCard.tsx       # Card view component
│   ├── TaskRow.tsx        # List view row
│   ├── TaskKanbanBoard.tsx # Kanban board
│   ├── TaskFilters.tsx    # Filter panel
│   ├── QuickAddTask.tsx   # Quick task creation
│   ├── TaskComments.tsx   # Comment thread
│   ├── TaskChecklist.tsx  # Subtasks checklist
│   ├── TaskDetail.tsx     # Detail slide-out panel
│   ├── WorkflowStage.tsx  # Workflow stage node
│   └── WorkflowCanvas.tsx # Visual workflow builder
├── pages/                 # Main page components
│   ├── TasksPage.tsx      # Main task management
│   ├── MyWorkPage.tsx     # Personal dashboard
│   └── WorkflowBuilderPage.tsx # Workflow builder
├── store/                 # Zustand state management
│   └── workflow.store.ts  # State management
├── types/                 # TypeScript definitions
│   └── index.ts          # All type definitions
└── index.ts              # Main exports

## Features

### Task Management

#### Multiple View Modes
- **List View**: Sortable table with bulk actions
- **Board View**: Kanban-style drag-and-drop
- **Calendar View**: Tasks on calendar (placeholder)
- **Timeline View**: Gantt-style timeline (placeholder)

#### Task Features
- Priority levels (Critical, High, Medium, Low)
- Status tracking (Not Started, In Progress, Blocked, On Hold, Completed)
- Assignee management with avatars
- Due dates with time
- Case relationships
- Tags and categories
- Checklists/subtasks
- File attachments
- Comments with mentions
- Activity log
- Time tracking (estimated vs actual)
- Task dependencies

#### Advanced Filtering
- Search by title/description
- Filter by status, priority, assignee
- Date range filtering
- Quick filters (overdue, has attachments, etc.)
- Tag filtering
- Multiple filter combinations

#### Bulk Actions
- Complete multiple tasks
- Delete multiple tasks
- Assign to user
- Update priority
- Update status
- Add tags

### Workflow Management

#### Visual Workflow Builder
- Drag-and-drop stage creation
- Visual connections between stages
- Zoom and pan controls
- Stage library with templates
- Real-time canvas updates

#### Workflow Stages
- Assignee rules:
  - Specific user
  - Role-based
  - Round robin
  - Case attorney
  - Manual assignment
- Due date rules:
  - Fixed date
  - Days from workflow start
  - Days from previous stage
  - Business days only
- Approval gates
- Conditional branching
- Required fields validation

#### Workflow Templates
- Pre-built templates for common workflows
- Template categories (Litigation, Corporate, etc.)
- Save and reuse workflows
- Clone existing workflows

### Personal Dashboard (My Work)

#### Task Organization
- Today's tasks
- Overdue tasks (with urgent highlighting)
- Upcoming this week
- Recently completed
- No deadline tasks

#### Quick Stats
- Total tasks count
- Due today count
- Overdue count
- Completed this week

#### Quick Actions
- One-click task creation
- Quick task completion
- Direct task access

## API Integration

### Task API Endpoints

```typescript
// Queries
GET /api/tasks                    # List tasks with filters
GET /api/tasks/:id                # Get task detail
GET /api/tasks/my-tasks           # Current user's tasks
GET /api/tasks/:id/comments       # Task comments
GET /api/tasks/:id/activities     # Activity log
GET /api/tasks/statistics         # Task statistics

// Mutations
POST   /api/tasks                 # Create task
PATCH  /api/tasks/:id             # Update task
POST   /api/tasks/:id/complete    # Complete task
DELETE /api/tasks/:id             # Delete task
POST   /api/tasks/:id/comments    # Add comment
POST   /api/tasks/:id/time-entries # Add time entry
POST   /api/tasks/bulk            # Bulk actions
```

### Workflow API Endpoints

```typescript
// Template Endpoints
GET  /api/workflows               # List templates
GET  /api/workflows/:id           # Get template
POST /api/workflows               # Create template
PATCH /api/workflows/:id          # Update template
DELETE /api/workflows/:id         # Delete template

// Instance Endpoints
GET  /api/workflow-engine/instances           # List instances
GET  /api/workflow-engine/instances/:id       # Get instance
POST /api/workflow-engine/instances           # Start workflow
POST /api/workflow-engine/instances/:id/pause  # Pause
POST /api/workflow-engine/instances/:id/resume # Resume
POST /api/workflow-engine/instances/:id/cancel # Cancel
```

## State Management

### Task Store (useTaskStore)

```typescript
// View mode
viewMode: TaskViewMode;
setViewMode(mode: TaskViewMode): void;

// Filters
filters: TaskFilters;
setFilters(filters: Partial<TaskFilters>): void;
resetFilters(): void;

// Sort
sort: TaskSortOptions;
setSort(sort: TaskSortOptions): void;

// Selection
selectedTaskIds: string[];
toggleTaskSelection(taskId: string): void;
selectAllTasks(taskIds: string[]): void;
clearSelection(): void;

// Detail panel
detailTaskId: string | null;
openTaskDetail(taskId: string): void;
closeTaskDetail(): void;

// Quick add
showQuickAdd: boolean;
openQuickAdd(caseId?: string): void;
closeQuickAdd(): void;
```

### Workflow Builder Store (useWorkflowBuilderStore)

```typescript
// Canvas state
stages: WorkflowStage[];
selectedStageId: string | null;
isDragging: boolean;
zoom: number;
canvasOffset: { x: number; y: number };

// Stage actions
addStage(stage: Omit<WorkflowStage, 'id'>): void;
updateStage(id: string, updates: Partial<WorkflowStage>): void;
removeStage(id: string): void;
selectStage(id: string | null): void;
connectStages(fromId: string, toId: string): void;
disconnectStages(fromId: string, toId: string): void;
setStagePosition(id: string, position: { x: number; y: number }): void;

// Template management
loadTemplate(stages: WorkflowStage[]): void;
clearCanvas(): void;
setTemplateMetadata(metadata: Partial<TemplateMetadata>): void;
```

### Board Store (useBoardStore)

```typescript
// Column management
columnOrder: string[];
hiddenColumns: string[];
setColumnOrder(order: string[]): void;
toggleColumnVisibility(columnId: string): void;

// Drag & drop
draggingTaskId: string | null;
setDraggingTask(taskId: string | null): void;
```

## Usage Examples

### Basic Task List

```tsx
import { TasksPage } from '@/features/workflow';

function App() {
  return <TasksPage />;
}
```

### Personal Dashboard

```tsx
import { MyWorkPage } from '@/features/workflow';

function Dashboard() {
  return <MyWorkPage />;
}
```

### Workflow Builder

```tsx
import { WorkflowBuilderPage } from '@/features/workflow';

function Builder() {
  return <WorkflowBuilderPage />;
}
```

### Using API Hooks

```tsx
import { useTasks, useCreateTask } from '@/features/workflow';

function TaskList() {
  const { data: tasks, isLoading } = useTasks({
    status: ['In Progress'],
    priority: ['High', 'Critical'],
  });

  const createTask = useCreateTask();

  const handleCreate = async () => {
    await createTask.mutateAsync({
      title: 'New Task',
      priority: 'High',
      assigneeId: 'user-123',
      dueDate: '2025-12-31',
    });
  };

  return (
    <div>
      {tasks?.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
      <button onClick={handleCreate}>Create Task</button>
    </div>
  );
}
```

### Using Store

```tsx
import { useTaskStore } from '@/features/workflow';

function TaskFiltersPanel() {
  const { filters, setFilters, resetFilters } = useTaskStore();

  return (
    <div>
      <input
        value={filters.search || ''}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Search tasks..."
      />
      <button onClick={resetFilters}>Clear Filters</button>
    </div>
  );
}
```

## Components API

### TaskCard

```tsx
interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
  selected?: boolean;
  className?: string;
}
```

### TaskKanbanBoard

```tsx
interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}
```

### TaskDetail

```tsx
interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
}
```

## Styling

All components use Tailwind CSS for styling. The design follows a professional, modern aesthetic suitable for legal practice management.

### Color Scheme

- **Primary**: Blue (#3B82F6) - Actions, links
- **Success**: Green (#10B981) - Completed, success states
- **Warning**: Orange/Yellow (#F59E0B) - Warnings, medium priority
- **Error**: Red (#EF4444) - Errors, critical priority, overdue
- **Neutral**: Gray scale - Text, borders, backgrounds

### Priority Colors

- **Critical**: Red (#EF4444)
- **High**: Orange (#F97316)
- **Medium**: Yellow (#F59E0B)
- **Low**: Green (#10B981)

## Dependencies

- **@tanstack/react-query**: Data fetching and caching
- **zustand**: State management
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## Backend Requirements

The backend must implement the following endpoints:

### Required Models

```typescript
// Task model (snake_case for backend)
{
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: string;
  created_by_id: string;
  due_date?: string;
  due_time?: string;
  case_id?: string;
  workflow_id?: string;
  tags?: string[];
  // ... other fields
}

// Workflow model
{
  id: string;
  name: string;
  description?: string;
  category?: string;
  stages: Stage[];
  is_active: boolean;
  is_public: boolean;
  created_by: string;
  // ... other fields
}
```

### Authentication

All API requests require authentication. Include the auth token in headers:
```
Authorization: Bearer <token>
```

## Performance Considerations

- TanStack Query provides automatic caching and background refetching
- Zustand stores are persisted to localStorage for faster load times
- Components use React.memo and useMemo for optimization
- Lazy loading for large task lists
- Virtual scrolling for timeline/calendar views (when implemented)

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management for modals and panels
- Screen reader friendly
- Color contrast compliance

## Future Enhancements

### Planned Features
- [ ] Calendar view implementation
- [ ] Timeline/Gantt view implementation
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Task automation rules
- [ ] Email notifications
- [ ] Mobile responsive optimization
- [ ] Export to Excel/PDF
- [ ] Advanced analytics dashboard
- [ ] Custom fields support
- [ ] Integration with calendar apps
- [ ] Slack/Teams integration

### Calendar View
- Monthly/weekly/daily views
- Drag-and-drop task scheduling
- Multi-day tasks
- Color-coded by priority/status

### Timeline View
- Gantt chart visualization
- Task dependencies display
- Critical path highlighting
- Resource allocation view

## Contributing

When adding new features:
1. Add types to `/types/index.ts`
2. Create API hooks in `/api/` directory
3. Add components to `/components/` directory
4. Update store if needed in `/store/workflow.store.ts`
5. Update this README with new features

## License

Copyright (c) 2025 LexiFlow AI. All rights reserved.
