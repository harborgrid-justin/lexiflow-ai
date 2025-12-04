import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ========================================
// StatCard - For Dashboard Statistics
// ========================================

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: "default" | "primary" | "success" | "warning" | "danger"
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      description,
      icon: Icon,
      trend,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "border-border",
      primary: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50",
      success: "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50",
      warning: "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50",
      danger: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50",
    }

    return (
      <Card ref={ref} className={cn(variantStyles[variant], className)} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive !== false
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive !== false ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

// ========================================
// CaseCard - For Case Listings
// ========================================

interface CaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  caseNumber: string
  title: string
  client: string
  status: string
  priority?: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  lastUpdated?: string
  description?: string
  tags?: string[]
  onClick?: () => void
}

export const CaseCard = React.forwardRef<HTMLDivElement, CaseCardProps>(
  (
    {
      caseNumber,
      title,
      client,
      status,
      priority = "medium",
      assignedTo,
      lastUpdated,
      description,
      tags,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const priorityColors = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "hover:shadow-md transition-shadow",
          onClick && "cursor-pointer hover:border-primary",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {priority && (
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", priorityColors[priority])}
                  >
                    {priority}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {caseNumber} • {client}
              </CardDescription>
            </div>
            <Badge variant="outline">{status}</Badge>
          </div>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
        {(assignedTo || lastUpdated) && (
          <CardFooter className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between w-full">
              {assignedTo && <span>Assigned to: {assignedTo}</span>}
              {lastUpdated && <span>Updated: {lastUpdated}</span>}
            </div>
          </CardFooter>
        )}
      </Card>
    )
  }
)
CaseCard.displayName = "CaseCard"

// ========================================
// UserCard - For User/Client Info
// ========================================

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  email?: string
  role?: string
  avatarUrl?: string
  avatarFallback?: string
  status?: "active" | "inactive" | "pending"
  phone?: string
  location?: string
  metadata?: Array<{ label: string; value: string }>
  actions?: React.ReactNode
  onClick?: () => void
}

export const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(
  (
    {
      name,
      email,
      role,
      avatarUrl,
      avatarFallback,
      status,
      phone,
      location,
      metadata,
      actions,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const statusColors = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }

    // Generate fallback from name if not provided
    const fallback =
      avatarFallback ||
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
      <Card
        ref={ref}
        className={cn(
          "hover:shadow-md transition-shadow",
          onClick && "cursor-pointer hover:border-primary",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{name}</CardTitle>
                {status && (
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", statusColors[status])}
                  >
                    {status}
                  </Badge>
                )}
              </div>
              {role && <CardDescription>{role}</CardDescription>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {email && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span>{phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span>{location}</span>
            </div>
          )}
          {metadata && metadata.length > 0 && (
            <div className="pt-2 space-y-1 border-t">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {actions && (
          <CardFooter className="flex gap-2">
            {actions}
          </CardFooter>
        )}
      </Card>
    )
  }
)
UserCard.displayName = "UserCard"

// Export all card variants
export { StatCardProps, CaseCardProps, UserCardProps }
