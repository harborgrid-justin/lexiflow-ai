/**
 * Data Display Components - Usage Examples
 *
 * This file provides examples for using the custom data display components.
 * These examples can be copied and adapted for your specific use cases.
 */

import { ColumnDef } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader, createColumn } from "./data-table"
import { StatCard, CaseCard, UserCard } from "./card-variants"
import { Badge } from "./badge"
import { Button } from "./button"
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react"

// ========================================
// DataTable Example
// ========================================

// Example: Case Management Table
interface Case {
  id: string
  caseNumber: string
  client: string
  status: string
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo: string
  createdAt: string
}

// Define columns with sorting support
const caseColumns: ColumnDef<Case>[] = [
  {
    accessorKey: "caseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case #" />
    ),
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      const priorityColors: Record<string, string> = {
        low: "bg-blue-100 text-blue-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        urgent: "bg-red-100 text-red-800",
      }
      return (
        <Badge className={priorityColors[priority]}>
          {priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
  },
]

// Usage in component
export function CasesTableExample() {
  const cases: Case[] = [
    {
      id: "1",
      caseNumber: "CASE-001",
      client: "John Doe",
      status: "Active",
      priority: "high",
      assignedTo: "Jane Smith",
      createdAt: "2024-01-15",
    },
    // ... more cases
  ]

  return (
    <DataTable
      columns={caseColumns}
      data={cases}
      searchKey="client"
      searchPlaceholder="Search by client name..."
      showPagination={true}
      pageSize={10}
    />
  )
}

// ========================================
// StatCard Examples
// ========================================

export function DashboardStatsExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Cases"
        value="2,350"
        description="Active legal cases"
        icon={Briefcase}
        trend={{ value: 12.5, label: "from last month", isPositive: true }}
        variant="primary"
      />

      <StatCard
        title="Active Clients"
        value="1,234"
        description="Currently engaged"
        icon={Users}
        trend={{ value: 8.2, label: "from last month", isPositive: true }}
        variant="success"
      />

      <StatCard
        title="Revenue"
        value="$125,430"
        description="This month"
        icon={DollarSign}
        trend={{ value: 5.3, label: "from last month", isPositive: true }}
        variant="default"
      />

      <StatCard
        title="Growth Rate"
        value="23.5%"
        description="Year over year"
        icon={TrendingUp}
        trend={{ value: 3.1, label: "from last quarter", isPositive: true }}
        variant="warning"
      />
    </div>
  )
}

// ========================================
// CaseCard Examples
// ========================================

export function CaseListExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CaseCard
        caseNumber="CASE-2024-001"
        title="Contract Dispute Resolution"
        client="Acme Corporation"
        status="In Progress"
        priority="high"
        assignedTo="John Attorney"
        lastUpdated="2 hours ago"
        description="Review and resolve contractual obligations between parties regarding service delivery terms."
        tags={["Contract Law", "Commercial", "Mediation"]}
        onClick={() => console.log("Case clicked")}
      />

      <CaseCard
        caseNumber="CASE-2024-002"
        title="Employment Agreement Review"
        client="Tech Startup Inc."
        status="Pending Review"
        priority="medium"
        assignedTo="Jane Counsel"
        lastUpdated="1 day ago"
        description="Draft and review employment agreements for key executive positions."
        tags={["Employment", "Corporate"]}
        onClick={() => console.log("Case clicked")}
      />

      <CaseCard
        caseNumber="CASE-2024-003"
        title="Real Estate Transaction"
        client="Property Investments LLC"
        status="Closing Soon"
        priority="urgent"
        assignedTo="Mike Lawyer"
        lastUpdated="3 hours ago"
        description="Finalize commercial real estate transaction and title transfer."
        tags={["Real Estate", "Transaction"]}
        onClick={() => console.log("Case clicked")}
      />
    </div>
  )
}

// ========================================
// UserCard Examples
// ========================================

export function ClientListExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UserCard
        name="John Doe"
        email="john.doe@example.com"
        role="Corporate Client"
        avatarUrl="https://i.pravatar.cc/150?img=1"
        status="active"
        phone="+1 (555) 123-4567"
        location="New York, NY"
        metadata={[
          { label: "Cases", value: "12" },
          { label: "Since", value: "Jan 2020" },
        ]}
        actions={
          <>
            <Button size="sm" variant="outline">View Profile</Button>
            <Button size="sm">Contact</Button>
          </>
        }
        onClick={() => console.log("User clicked")}
      />

      <UserCard
        name="Jane Smith"
        email="jane.smith@lawfirm.com"
        role="Senior Attorney"
        avatarFallback="JS"
        status="active"
        phone="+1 (555) 987-6543"
        location="Los Angeles, CA"
        metadata={[
          { label: "Active Cases", value: "8" },
          { label: "Win Rate", value: "94%" },
        ]}
        actions={
          <>
            <Button size="sm" variant="outline">Schedule</Button>
            <Button size="sm">Message</Button>
          </>
        }
      />

      <UserCard
        name="Mike Johnson"
        email="mike.j@clients.com"
        role="Individual Client"
        status="pending"
        phone="+1 (555) 246-8135"
        location="Chicago, IL"
        metadata={[
          { label: "Status", value: "Onboarding" },
          { label: "Referred By", value: "John Doe" },
        ]}
        actions={
          <Button size="sm" variant="outline" className="w-full">
            Complete Onboarding
          </Button>
        }
      />
    </div>
  )
}

// ========================================
// Combined Dashboard Example
// ========================================

export function DashboardExample() {
  const recentCases: Case[] = [
    {
      id: "1",
      caseNumber: "CASE-001",
      client: "John Doe",
      status: "Active",
      priority: "high",
      assignedTo: "Jane Smith",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      caseNumber: "CASE-002",
      client: "Acme Corp",
      status: "Pending",
      priority: "medium",
      assignedTo: "Mike Johnson",
      createdAt: "2024-01-14",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <DashboardStatsExample />
      </section>

      {/* Recent Cases Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Cases</h2>
        <DataTable
          columns={caseColumns}
          data={recentCases}
          searchKey="client"
          searchPlaceholder="Search cases..."
        />
      </section>

      {/* Featured Cases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Cases</h2>
        <CaseListExample />
      </section>

      {/* Team Members */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Team</h2>
        <ClientListExample />
      </section>
    </div>
  )
}

/**
 * INTEGRATION NOTES FOR FE-005:
 *
 * 1. DataTable Component:
 *    - Fully integrated with @tanstack/react-table v8
 *    - Built-in sorting, filtering, and pagination
 *    - Use DataTableColumnHeader for sortable columns
 *    - Customize with searchKey prop for global filtering
 *
 * 2. Card Variants:
 *    - StatCard: Perfect for dashboard KPIs and metrics
 *    - CaseCard: Optimized for case/project listings
 *    - UserCard: Ideal for client/team member profiles
 *
 * 3. All components are fully typed with TypeScript
 *
 * 4. Components use shadcn/ui primitives:
 *    - Consistent styling with Tailwind
 *    - Dark mode support built-in
 *    - Accessible by default (Radix UI)
 *
 * 5. Customization:
 *    - All components accept className prop
 *    - Can be extended with additional variants
 *    - Use cn() utility for conditional styling
 *
 * 6. Best Practices:
 *    - Always define column types for DataTable
 *    - Use proper TypeScript interfaces
 *    - Leverage the variant props for semantic styling
 *    - Add onClick handlers for interactive cards
 */
