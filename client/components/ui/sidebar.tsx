import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarContextType {
  isCollapsed: boolean
  toggleCollapsed: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const toggleCollapsed = React.useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const value = React.useMemo(
    () => ({ isCollapsed, toggleCollapsed }),
    [isCollapsed, toggleCollapsed]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, collapsible = true, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div
        ref={ref}
        data-collapsed={isCollapsed}
        className={cn(
          "relative flex h-full flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center border-b px-4 py-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-y-auto p-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t px-4 py-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { isCollapsed, toggleCollapsed } = useSidebar()

    return (
      <button
        ref={ref}
        onClick={toggleCollapsed}
        className={cn(
          "absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-accent",
          className
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        {...props}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    )
  }
)
SidebarToggle.displayName = "SidebarToggle"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
      </nav>
    )
  }
)
SidebarNav.displayName = "SidebarNav"

interface SidebarNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
}

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({ className, children, icon: Icon, active, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center",
          className
        )}
        {...props}
      >
        {Icon && <Icon className={cn("h-5 w-5 shrink-0")} />}
        {!isCollapsed && <span className="truncate">{children}</span>}
      </button>
    )
  }
)
SidebarNavItem.displayName = "SidebarNavItem"

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar()

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && !isCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
        )}
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  SidebarNav,
  SidebarNavItem,
  SidebarGroup,
  useSidebar,
}
