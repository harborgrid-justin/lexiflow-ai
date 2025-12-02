import { Link, useRouterState } from '@tanstack/react-router';
import { useUIStore } from '@stores/ui.store';
import { cn } from '@lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Search,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cases', href: '/cases', icon: Briefcase },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarState, toggleSidebar } = useUIStore();
  const router = useRouterState();
  const isExpanded = sidebarState === 'expanded';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-dark-surface border-r border-dark-border transition-all duration-300 z-40',
        isExpanded ? 'w-60' : 'w-16'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-border">
          {isExpanded ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-dark-text">LexiFlow</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = router.location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-enterprise text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-text-muted hover:bg-dark-elevated hover:text-dark-text'
                )}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0',
                    isExpanded ? 'w-5 h-5 mr-3' : 'w-5 h-5 mx-auto'
                  )}
                />
                {isExpanded && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full px-3 py-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated rounded-enterprise transition-colors"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <>
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
