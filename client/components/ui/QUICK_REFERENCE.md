# Data Display Components - Quick Reference

## DataTable Component

### Basic Usage
```typescript
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface MyData {
  id: string
  name: string
  email: string
  status: string
}

const columns: ColumnDef<MyData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
  },
]

function MyTable() {
  const data: MyData[] = [/* your data */]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search by name..."
      showPagination={true}
      pageSize={10}
    />
  )
}
```

## Card Variants

### StatCard
```typescript
import { StatCard } from "@/components/ui/card-variants"
import { Users } from "lucide-react"

<StatCard
  title="Total Users"
  value="1,234"
  description="Active users"
  icon={Users}
  trend={{ value: 12.5, label: "from last month", isPositive: true }}
  variant="primary"
/>
```

### CaseCard
```typescript
import { CaseCard } from "@/components/ui/card-variants"

<CaseCard
  caseNumber="CASE-001"
  title="Contract Dispute"
  client="Acme Corp"
  status="Active"
  priority="high"
  assignedTo="John Doe"
  lastUpdated="2 hours ago"
  description="Review and resolve..."
  tags={["Contract", "Commercial"]}
  onClick={() => navigate(`/cases/CASE-001`)}
/>
```

### UserCard
```typescript
import { UserCard } from "@/components/ui/card-variants"
import { Button } from "@/components/ui/button"

<UserCard
  name="John Doe"
  email="john@example.com"
  role="Senior Attorney"
  avatarUrl="https://..."
  status="active"
  phone="+1 555-0123"
  location="New York, NY"
  metadata={[
    { label: "Cases", value: "12" },
    { label: "Win Rate", value: "94%" },
  ]}
  actions={
    <>
      <Button size="sm" variant="outline">View</Button>
      <Button size="sm">Contact</Button>
    </>
  }
  onClick={() => navigate(`/users/${userId}`)}
/>
```

## All Installed Components

### Data Display
- `table` - Base table components
- `card` - Card containers
- `badge` - Status badges
- `avatar` - User avatars
- `data-table` - Advanced table with TanStack (custom)
- `card-variants` - Specialized cards (custom)

### Overlays & Dialogs
- `dialog` - Modal dialogs
- `alert-dialog` - Confirmation dialogs
- `sheet` - Slide-out panels
- `popover` - Floating content
- `hover-card` - Hover tooltips

### Layout
- `separator` - Dividers
- `scroll-area` - Custom scrollbars
- `aspect-ratio` - Aspect ratio containers

### Feedback
- `alert` - Alert messages

## Common Patterns

### Sortable Table Column
```typescript
{
  accessorKey: "createdAt",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Created" />
  ),
  cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
}
```

### Custom Cell Rendering
```typescript
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.getValue("status") as string
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status}
      </Badge>
    )
  },
}
```

### Dashboard Stats Grid
```typescript
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatCard title="..." value="..." variant="primary" />
  <StatCard title="..." value="..." variant="success" />
  <StatCard title="..." value="..." variant="warning" />
  <StatCard title="..." value="..." variant="danger" />
</div>
```

### Card Grid Layout
```typescript
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <CaseCard {...caseProps1} />
  <CaseCard {...caseProps2} />
  <CaseCard {...caseProps3} />
</div>
```

## File Locations

```
/home/user/lexiflow-ai/client/components/ui/
├── data-table.tsx              # Custom DataTable component
├── card-variants.tsx           # Custom Card variants
├── data-display-examples.tsx   # Usage examples
├── INSTALLATION_SUMMARY.md     # Complete documentation
└── QUICK_REFERENCE.md          # This file
```

## Import Paths

```typescript
// Custom components
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { StatCard, CaseCard, UserCard } from "@/components/ui/card-variants"

// Base components
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

// Types
import { ColumnDef } from "@tanstack/react-table"
```

## Tips

1. **Always define TypeScript interfaces** for your table data
2. **Use DataTableColumnHeader** for sortable columns
3. **Customize with className prop** for specific styling needs
4. **Use variant props** for semantic coloring
5. **Add onClick handlers** to make cards interactive
6. **Leverage metadata array** in UserCard for flexible data display
7. **Use the cn() utility** for conditional classes

## Need More Help?

See `data-display-examples.tsx` for complete, working examples.
