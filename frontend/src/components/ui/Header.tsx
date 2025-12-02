import { useUIStore } from '@stores/ui.store';
import { useAuthStore } from '@stores/auth.store';
import { useLogout } from '@api/hooks';
import { Search, Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '@lib/utils';
import { useState } from 'react';

export default function Header() {
  const { sidebarState, toggleCommandPalette, toggleTheme, theme, unreadNotificationCount } =
    useUIStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isExpanded = sidebarState === 'expanded';

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-dark-surface border-b border-dark-border z-30 transition-all duration-300',
        isExpanded ? 'left-60' : 'left-16'
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <button
          onClick={() => toggleCommandPalette()}
          className="flex items-center space-x-3 px-4 py-2 bg-dark-elevated border border-dark-border rounded-enterprise text-dark-text-muted hover:text-dark-text hover:border-primary-500 transition-colors group max-w-md w-full"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search or press Cmd+K...</span>
          <kbd className="ml-auto px-2 py-1 bg-dark-surface border border-dark-border rounded text-xs font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={() => toggleTheme()}
            className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated rounded-enterprise transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated rounded-enterprise transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-dark-text hover:bg-dark-elevated rounded-enterprise transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-dark-text">{user?.name || 'User'}</p>
                <p className="text-xs text-dark-text-muted">{user?.role || 'Attorney'}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-dark-elevated border border-dark-border rounded-enterprise shadow-enterprise-lg z-20">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center w-full px-3 py-2 text-sm text-dark-text hover:bg-dark-surface rounded-enterprise transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
