# Workflow Engine Module

## Overview
Enterprise-grade workflow management system for LexiFlow AI legal case management.

## Quick Start

### Create a Workflow Stage
```bash
POST /api/v1/workflow/stages
{
  "case_id": "case-uuid",
  "name": "Discovery",
  "status": "Active",
  "order_index": 1
}
```

### Create a Workflow Task
```bash
POST /api/v1/workflow/tasks
{
  "stage_id": "stage-uuid",
  "title": "Review documents",
  "type": "document_review",
  "status": "Pending",
  "priority": "High"
}
```

### Complete a Task
```bash
POST /api/v1/workflow/engine/tasks/{taskId}/complete
{
  "userId": "user-uuid",
  "comments": "Task completed successfully"
}
```

## Architecture

- **23 Specialized Services** - Modular, single-responsibility design
- **2 Controllers** - Basic CRUD + Advanced engine operations
- **4 DTOs** - Validated data transfer objects
- **13 Type Definitions** - Comprehensive TypeScript types
- **55 Total Files** - Production-ready implementation

## Key Services

1. **WorkflowOrchestratorService** - Main coordination engine
2. **StageManagementService** - Stage lifecycle operations
3. **TaskLifecycleService** - Task state management
4. **DependencyService** - Task dependency resolution
5. **SLAService** - SLA monitoring & enforcement
6. **ApprovalService** - Multi-level approval chains
7. **TimeTrackingService** - Automatic time tracking
8. **NotificationService** - User notifications
9. **AnalyticsService** - Performance metrics
10. **AuditService** - Complete audit trail
... and 13 more!

## API Endpoints

### Basic Operations
- `GET /workflow/stages` - List stages
- `POST /workflow/stages` - Create stage
- `GET /workflow/tasks` - List tasks
- `POST /workflow/tasks` - Create task

### Advanced Operations
- `POST /workflow/engine/tasks/:id/complete` - Complete task
- `GET /workflow/engine/analytics/metrics` - Get metrics
- `POST /workflow/engine/dependencies` - Set dependencies
- `GET /workflow/engine/sla/:taskId/status` - Check SLA

See full API documentation at: `/api/docs`

## Features

- Task Dependencies & Blocking
- Conditional Workflow Routing
- Parallel Task Execution
- SLA Monitoring & Escalation
- Approval Chains
- Time Tracking
- Custom Fields
- External Integrations
- Recurring Tasks
- Template Versioning
- Full Audit Trail
- Error Recovery

## Documentation

Full implementation report: `/tmp/workflow_implementation_report.md`

## Status

✅ **PRODUCTION READY**
