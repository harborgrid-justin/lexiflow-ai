/**
 * Integration Example
 *
 * This file demonstrates how to integrate the Settings and Admin features
 * into the main LexiFlow application.
 */

import React, { useEffect } from 'react';
import { SettingsPage, AdminPage, IntegrationsPage } from './index';
import { useUserSettings, settingsActions } from './index';

// ============================================================================
// Example 1: Adding Settings to App.tsx routing
// ============================================================================

/**
 * Update your App.tsx renderContent() function to include these cases:
 */

/*
const renderContent = () => {
  switch (activeView) {
    // ... existing cases

    case 'settings':
      return <SettingsPage currentUser={user} />;

    case 'admin':
      // Only show admin panel to admins
      if (user?.role !== 'admin') {
        return <div>Unauthorized</div>;
      }
      return <AdminPage />;

    case 'integrations':
      return <IntegrationsPage />;

    // ... other cases
  }
};
*/

// ============================================================================
// Example 2: Adding Settings to Sidebar
// ============================================================================

/**
 * Update your Sidebar.tsx to include settings links:
 */

/*
const menuItems = [
  // ... existing menu items

  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug,
  },

  // Admin section (only for admins)
  ...(currentUser.role === 'admin' ? [
    {
      id: 'admin',
      label: 'Administration',
      icon: Shield,
    }
  ] : [])
];
*/

// ============================================================================
// Example 3: Syncing Settings with Store
// ============================================================================

/**
 * Component to sync API settings with the local store
 * Add this to your App.tsx or a layout component
 */
export const SettingsSync: React.FC = () => {
  const { data: settings } = useUserSettings();

  useEffect(() => {
    if (settings) {
      settingsActions.setUserSettings(settings);
    }
  }, [settings]);

  return null;
};

// Usage in App.tsx:
/*
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsSync />  {/* Add this */}
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
*/

// ============================================================================
// Example 4: Theme Toggle in Header
// ============================================================================

/**
 * Simple theme toggle button for the header
 */
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, settingsActions } from './index';

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    settingsActions.setTheme(nextTheme);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={`Current theme: ${theme}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

// Add to header in App.tsx:
/*
<header className="...">
  <div className="flex items-center gap-3">
    <ThemeToggle />  {/* Add this */}
    <button className="p-2 ...">
      <Bell className="w-5 h-5" />
    </button>
    <UserProfileDropdown user={user} />
  </div>
</header>
*/

// ============================================================================
// Example 5: Protected Route Component
// ============================================================================

/**
 * HOC to protect admin routes
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'associate' | 'paralegal';
  currentUser: any;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  currentUser,
}) => {
  const roleHierarchy = ['admin', 'partner', 'associate', 'paralegal', 'clerk', 'client'];

  const hasAccess = () => {
    if (!requiredRole) return true;

    const requiredIndex = roleHierarchy.indexOf(requiredRole);
    const userIndex = roleHierarchy.indexOf(currentUser.role);

    return userIndex <= requiredIndex;
  };

  if (!hasAccess()) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Usage:
/*
case 'admin':
  return (
    <ProtectedRoute requiredRole="admin" currentUser={user}>
      <AdminPage />
    </ProtectedRoute>
  );
*/

// ============================================================================
// Example 6: Settings Button in User Dropdown
// ============================================================================

/**
 * Update UserProfileDropdown to include settings link
 */

/*
const UserProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        // ... avatar
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <div className="px-4 py-2 border-b">
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>

          <button
            onClick={() => {
              setActiveView('settings');  // Add this
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-100"
          >
            <Settings className="inline w-4 h-4 mr-2" />
            Settings
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => {
                setActiveView('admin');  // Add this
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-100"
            >
              <Shield className="inline w-4 h-4 mr-2" />
              Admin Panel
            </button>
          )}

          <button onClick={logout}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
*/

// ============================================================================
// Example 7: Using Auth Pages
// ============================================================================

/**
 * Replace the inline LoginForm in App.tsx with the new LoginPage
 */

import { LoginPage } from '../auth';

/*
if (!isAuthenticated) {
  return (
    <LoginPage
      onLogin={async (email, password) => {
        return await login(email, password);
      }}
      onSSOLogin={(provider) => {
        console.log('SSO login with', provider);
        // Implement SSO login
      }}
    />
  );
}
*/

// ============================================================================
// Example 8: Complete Integration Code Snippet
// ============================================================================

/**
 * Here's a complete example of how to integrate everything:
 */

/*
// In App.tsx

import { SettingsPage, AdminPage, IntegrationsPage, settingsActions } from './features/settings';
import { LoginPage } from './features/auth';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Sync settings on mount
  const { data: settings } = useUserSettings();
  useEffect(() => {
    if (settings) {
      settingsActions.setUserSettings(settings);
    }
  }, [settings]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <SettingsPage currentUser={user} />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPage /> : <AccessDenied />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
*/

// ============================================================================
// Example 9: Permission-Based UI Components
// ============================================================================

/**
 * Show/hide UI based on user permissions
 */
import type { Permission } from './index';

interface RequirePermissionProps {
  children: React.ReactNode;
  permissions: Permission[];
  userPermissions: Permission[];
  fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permissions,
  userPermissions,
  fallback = null,
}) => {
  const hasPermission = permissions.every((p) => userPermissions.includes(p));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Usage:
/*
<RequirePermission
  permissions={['admin:users', 'users:create']}
  userPermissions={currentUser.permissions}
>
  <button>Invite User</button>
</RequirePermission>
*/

// ============================================================================
// Example 10: Settings Initialization Hook
// ============================================================================

/**
 * Custom hook to initialize settings on app load
 */
export const useInitializeSettings = () => {
  const { data: settings, isLoading } = useUserSettings();
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    if (settings && !initialized) {
      settingsActions.setUserSettings(settings);
      setInitialized(true);
    }
  }, [settings, initialized]);

  return { initialized, isLoading };
};

// Usage in App.tsx:
/*
function AppContent() {
  const { initialized, isLoading } = useInitializeSettings();

  if (isLoading || !initialized) {
    return <LoadingScreen />;
  }

  return <MainApp />;
}
*/
