
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CaseManagement } from './components/CaseManagement';
import { ResearchTool } from './components/ResearchTool';
import { DocumentManager } from './components/DocumentManager';
import { CalendarView } from './components/CalendarView';
import { ClauseLibrary } from './components/ClauseLibrary';
import { BillingDashboard } from './components/BillingDashboard';
import { ClientCRM } from './components/ClientCRM';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ComplianceDashboard } from './components/ComplianceDashboard';
import { AdminPanel } from './components/AdminPanel';
import { DiscoveryPlatform } from './components/DiscoveryPlatform';
import { EvidenceVault } from './components/EvidenceVault';
import { SecureMessenger } from './components/SecureMessenger';
import { JurisdictionManager } from './components/JurisdictionManager';
import { MasterWorkflow } from './components/MasterWorkflow';
import { EnzymeDemo } from './components/EnzymeDemo';
import { HydrationDemo, EditCaseDemo } from './components/enzyme';
import { UserProfile } from './components/UserProfile';
import { Case, User } from './types';
import { ApiService } from './services/apiService';
import { Bell, User as UserIcon, Menu, ShieldAlert } from 'lucide-react';
import { PacerImportPage } from './pages/cases/PacerImportPage';

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
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="relative block w-full px-3 py-2 border border-slate-300 rounded-t-md placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email address"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="relative block w-full px-3 py-2 border border-slate-300 rounded-b-md placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
};

const UserProfileDropdown: React.FC<{ user: User }> = ({ user }) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
      >
        <UserIcon className="w-5 h-5" />
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated, impersonateUser: _impersonateUser, isImpersonating, stopImpersonating } = useAuth();
  const [activeView, setActiveView] = useState(() => {
    // Initialize from URL hash
    const hash = window.location.hash.slice(1);
    return hash || 'dashboard';
  });
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);

  // Sync activeView with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveView(hash);
        setSelectedCase(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
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
  }

  const handleSelectCaseById = (caseId: string) => {
    const found = cases.find(c => c.id === caseId);
    if (found) {
      setSelectedCase(found);
    }
  };

  const renderContent = () => {
    if (!user) return null;
    
    switch (activeView) {
      case 'dashboard': return <Dashboard onSelectCase={handleSelectCaseById} />;
      case 'cases': return (
        <CaseManagement 
          selectedCase={selectedCase}
          onSelectCase={setSelectedCase}
          onBackToList={() => setSelectedCase(null)}
          currentUser={user}
          navigateTo={setActiveView}
        />
      );
      case 'pacer-import': return <PacerImportPage onBack={() => setActiveView('cases')} onImportComplete={handleSelectCaseById} />;
      case 'messages': return <SecureMessenger currentUserId={user.id} />;
      case 'discovery': return <DiscoveryPlatform />;
      case 'evidence': return <EvidenceVault onNavigateToCase={handleSelectCaseById} currentUser={user} />;
      case 'calendar': return <CalendarView onNavigateToCase={handleSelectCaseById} />;
      case 'billing': return <BillingDashboard navigateTo={setActiveView} />;
      case 'crm': return <ClientCRM />;
      case 'research': return <ResearchTool currentUser={user} />;
      case 'documents': return <DocumentManager currentUserRole={user.role} />;
      case 'library': return <KnowledgeBase />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'compliance': return <ComplianceDashboard />;
      case 'admin': return <AdminPanel />;
      case 'jurisdiction': return <JurisdictionManager />;
      case 'workflows': return <MasterWorkflow />;
      case 'clauses': return <ClauseLibrary />;
      case 'enzyme-demo': return <EnzymeDemo />;
      case 'hydration-demo': return <HydrationDemo />;
      case 'profile': return <UserProfile userId={user.id} />;
      default: {
        // Check for dynamic routes like edit-case/:id
        if (activeView.startsWith('edit-case/')) {
          const caseId = activeView.replace('edit-case/', '');
          return <EditCaseDemo caseId={caseId} onBack={() => setActiveView('enzyme-demo')} />;
        }
        return <div className="flex justify-center items-center h-full text-slate-400">Under Construction</div>;
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-2 px-4 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
              <span className="font-semibold text-sm">
                🎭 Developer Mode: Viewing as {user?.name} ({user?.role})
              </span>
            </div>
            <button
              onClick={stopImpersonating}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
            >
              Exit Impersonation
            </button>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur" onClick={() => setIsSidebarOpen(false)} />}
      {user && (
        <Sidebar
          activeView={selectedCase ? 'cases' : activeView}
          setActiveView={(v) => { setActiveView(v); setSelectedCase(null); setIsSidebarOpen(false); }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentUser={user}
        />
      )}
      <div className={`flex-1 flex flex-col md:ml-64 h-full transition-all w-full ${isImpersonating ? 'mt-10' : ''}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-30 shrink-0">
          <div className="flex items-center flex-1 gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
              {selectedCase ? `${selectedCase.title}` : activeView === 'dashboard' ? 'Dashboard' : activeView}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* User Impersonator - Disabled for now
            <UserImpersonator onImpersonate={impersonateUser} currentUser={user} />
            */}

            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-slate-600">Welcome,</span>
              <span className="font-medium">{user?.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{user?.role}</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <UserProfileDropdown user={user!} />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8 relative">
          <div className="w-full h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Create React Query client for Enzyme hooks
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default App;
