import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function PageLoader({
  className,
  size = "md",
  text = "Loading...",
  ...props
}: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      <Spinner className={sizeClasses[size]} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
  showHeader?: boolean
}

export function TableSkeleton({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
  ...props
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {showHeader && (
        <div className="flex gap-4 border-b pb-3">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 flex-1" />
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-12 flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact" | "detailed"
  count?: number
}

export function CardSkeleton({
  className,
  variant = "default",
  count = 1,
  ...props
}: CardSkeletonProps) {
  const renderCard = (index: number) => {
    switch (variant) {
      case "compact":
        return (
          <div
            key={`card-${index}`}
            className="rounded-lg border bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        )
      case "detailed":
        return (
          <div
            key={`card-${index}`}
            className="rounded-lg border bg-card p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        )
      default:
        return (
          <div
            key={`card-${index}`}
            className="rounded-lg border bg-card p-6 space-y-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => renderCard(i))}
    </div>
  )
}

interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: number
  showSubmit?: boolean
}

export function FormSkeleton({
  className,
  fields = 4,
  showSubmit = true,
  ...props
}: FormSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`field-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {showSubmit && (
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  )
}

interface ListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number
  showAvatar?: boolean
}

export function ListSkeleton({
  className,
  items = 6,
  showAvatar = true,
  ...props
}: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={`item-${i}`} className="flex items-center gap-4 p-3 rounded-lg border">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

interface ContentSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export function ContentSkeleton({
  className,
  lines = 8,
  ...props
}: ContentSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton className="h-8 w-2/3 mb-6" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={`line-${i}`}
          className="h-4"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  )
}

interface DashboardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  cards?: number
}

export function DashboardSkeleton({
  className,
  cards = 4,
  ...props
}: DashboardSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="rounded-lg border bg-card p-6 space-y-2"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`content-1-${i}`} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`content-2-${i}`} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
