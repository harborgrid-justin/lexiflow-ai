/**
 * LexiFlow AI - Main Application Component (Refactored)
 * 
 * Enterprise-grade SOA architecture with:
 * - Lazy-loaded feature modules
 * - Centralized routing with role-based access
 * - Modular state management
 * - Clean separation of concerns
 * 
 * ROUTING:
 * Uses Enzyme's hash-based router (useHashRouter) for client-side navigation.
 * Routes are defined in core/router/routes.ts with lazy loading.
 * 
 * @see /client/core/router for router implementation
 * @see /client/features for feature modules
 */

import React, { useState, useEffect, Suspense } from 'react';
import { AppProviders } from './core/providers/AppProviders';
import { AppRouter } from './core/router';
import { useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TokenRefreshButton } from './components/common';
import { Case, User } from './types';
import { ApiService } from './services/apiService';
import { useHashRouter } from './enzyme';
import { Bell, User as UserIcon, Menu, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ============================================================================
// Login Form Component
// ============================================================================
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
          />
        </div>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
};

// ============================================================================
// Login Page Component
// ============================================================================
const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to LexiFlow AI
        </h2>
      </div>
      <LoginForm />
    </div>
  </div>
);

// ============================================================================
// Loading Screen Component
// ============================================================================
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// ============================================================================
// User Profile Dropdown Component
// ============================================================================
const UserProfileDropdown: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <UserIcon className="w-5 h-5" />
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full justify-start"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Impersonation Banner Component
// ============================================================================
const ImpersonationBanner: React.FC<{ user: User; onStop: () => void }> = ({ user, onStop }) => (
  <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-2 px-4 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 animate-pulse" />
        <span className="font-semibold text-sm">
          🎭 Developer Mode: Viewing as {user.name} ({user.role})
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onStop}
        className="bg-white/20 hover:bg-white/30 text-xs font-medium"
      >
        Exit Impersonation
      </Button>
    </div>
  </div>
);

// ============================================================================
// App Header Component
// ============================================================================
interface AppHeaderProps {
  title: string;
  user: User;
  onToggleSidebar: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, user, onToggleSidebar }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-30 shrink-0">
    <div className="flex items-center flex-1 gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <h1 className="text-xl font-semibold text-slate-800 capitalize">{title}</h1>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 text-sm">
        <span className="text-slate-600">Welcome,</span>
        <span className="font-medium">{user.name}</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-500">{user.role}</span>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Button>
      <UserProfileDropdown user={user} />
    </div>
  </header>
);

// ============================================================================
// Main App Content Component
// ============================================================================
const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated, isImpersonating, stopImpersonating } = useAuth();
  const { currentRoute, navigate } = useHashRouter();
  
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);

  // Sync with old activeView for backward compatibility
  const activeView = currentRoute;

  // Fetch cases on auth
  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesData = await ApiService.getCases();
        setCases(casesData || []);
      } catch (e) {
        console.error("Failed to fetch cases", e);
        setCases([]);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Auth guard
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handlers
  const handleSelectCaseById = (caseId: string) => {
    const found = cases.find(c => c.id === caseId);
    if (found) {
      setSelectedCase(found);
    }
  };

  const handleNavigate = (view: string) => {
    navigate(view);
    setSelectedCase(null);
    setIsSidebarOpen(false);
  };

  // Page title
  const pageTitle = selectedCase 
    ? selectedCase.title 
    : activeView === 'dashboard' 
      ? 'Dashboard' 
      : activeView;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Impersonation Banner */}
      {isImpersonating && user && (
        <ImpersonationBanner user={user} onStop={stopImpersonating} />
      )}

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      {user && (
        <Sidebar
          activeView={selectedCase ? 'cases' : activeView}
          setActiveView={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentUser={user}
          onSwitchUser={() => handleNavigate('profile')}
        />
      )}

      {/* Main content area */}
      <div className={`flex-1 flex flex-col md:ml-64 h-full transition-all w-full ${isImpersonating ? 'mt-10' : ''}`}>
        {/* Header */}
        {user && (
          <AppHeader
            title={pageTitle}
            user={user}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Main content with router */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 relative">
          <div className="w-full h-full">
            <Suspense fallback={<LoadingScreen />}>
              <AppRouter
                onSelectCase={handleSelectCaseById}
                currentUser={user}
              />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Token Refresh Button - visible when SHOW_TOKEN_REFRESH_BUTTON feature flag is enabled */}
      <TokenRefreshButton position="bottom-right" />
    </div>
  );
};

// ============================================================================
// App Root Component
// ============================================================================
const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
