/**
 * App Router Component
 * Handles routing with lazy loading and suspense
 */

import React, { Suspense } from 'react';
import { useHashRouter } from '@/enzyme';
import { useAuth } from '@/contexts/AuthContext';
import { hasRouteAccess, getRoute } from './routes';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

// Loading fallback component
const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
  </div>
);

// Access denied component
const AccessDenied: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-8">
    <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
    <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h2>
    <p className="text-slate-600 mb-4">You don't have permission to access this page.</p>
    <button
      onClick={() => onNavigate('dashboard')}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Back to Dashboard
    </button>
  </div>
);

// Not found component
const NotFound: React.FC<{ route: string; onNavigate: (path: string) => void }> = ({ route, onNavigate }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-8">
    <div className="text-6xl mb-4">🔍</div>
    <h2 className="text-xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
    <p className="text-slate-600 mb-4">
      The page "{route}" could not be found.
    </p>
    <button
      onClick={() => onNavigate('dashboard')}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Back to Dashboard
    </button>
  </div>
);

interface AppRouterProps {
  // Optional props that some routes might need
  onSelectCase?: (caseId: string) => void;
  currentUser?: any;
}

export const AppRouter: React.FC<AppRouterProps> = ({ onSelectCase, currentUser }) => {
  const { currentRoute, navigate, params } = useHashRouter();
  const { user } = useAuth();

  // Find matching route
  const route = getRoute(currentRoute);

  // Handle unknown routes
  if (!route) {
    // Check for dynamic routes like edit-case/:id
    if (currentRoute.startsWith('edit-case')) {
      const EditCaseDemo = React.lazy(() => 
        import('@/components/enzyme').then(m => ({ default: m.EditCaseDemo }))
      );
      const caseId = params.id || currentRoute.replace('edit-case/', '');
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <EditCaseDemo caseId={caseId} onBack={() => navigate('cases')} />
        </Suspense>
      );
    }

    // Check for pacer-import
    if (currentRoute === 'pacer-import') {
      const PacerImportPage = React.lazy(() => 
        import('@/pages/cases/PacerImportPage').then(m => ({ default: m.PacerImportPage }))
      );
      return (
        <Suspense fallback={<RouteLoadingFallback />}>
          <PacerImportPage 
            onBack={() => navigate('cases')} 
            onImportComplete={onSelectCase || (() => {})} 
          />
        </Suspense>
      );
    }

    return <NotFound route={currentRoute} onNavigate={navigate} />;
  }

  // Check access
  if (!hasRouteAccess(route, user?.role)) {
    return <AccessDenied onNavigate={navigate} />;
  }

  // Render route component
  const Component = route.component;

  // Build props based on route
  const routeProps: Record<string, any> = {};

  switch (route.path) {
    case 'dashboard':
      routeProps.onSelectCase = onSelectCase;
      break;
    case 'cases':
      routeProps.currentUser = currentUser || user;
      routeProps.navigateTo = navigate;
      break;
    case 'messages':
      routeProps.currentUserId = user?.id;
      break;
    case 'evidence':
      routeProps.onNavigateToCase = onSelectCase;
      routeProps.currentUser = currentUser || user;
      break;
    case 'calendar':
      routeProps.onNavigateToCase = onSelectCase;
      break;
    case 'billing':
      routeProps.navigateTo = navigate;
      break;
    case 'research':
      routeProps.currentUser = currentUser || user;
      break;
    case 'documents':
      routeProps.currentUserRole = user?.role;
      break;
    case 'workflows':
      routeProps.onSelectCase = onSelectCase;
      break;
    case 'profile':
      routeProps.userId = user?.id;
      break;
  }

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Component {...routeProps} />
    </Suspense>
  );
};
