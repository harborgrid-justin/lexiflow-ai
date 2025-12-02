/**
 * Application Router Configuration
 * Centralized route definitions with lazy loading and role-based access
 * 
 * All routes now use feature module pages for SOA architecture.
 */

import React, { lazy } from 'react';
import type { UserRole } from '@/types';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Search,
  BarChart3,
  Shield,
  Settings,
  MessageSquare,
  Microscope,
  Archive,
  Scale,
  GitBranch,
  BookOpen,
  Gavel,
} from 'lucide-react';

// Feature module pages (SOA architecture)
const DashboardPage = lazy(() => import('@/features/dashboard').then(m => ({ default: m.DashboardPage })));
const BillingPage = lazy(() => import('@/features/billing').then(m => ({ default: m.BillingDashboardPage })));
const CalendarPage = lazy(() => import('@/features/calendar').then(m => ({ default: m.CalendarPage })));
const ClientsPage = lazy(() => import('@/features/clients').then(m => ({ default: m.ClientCRMPage })));
const KnowledgeBasePage = lazy(() => import('@/features/knowledge').then(m => ({ default: m.KnowledgeBasePage })));
const ClauseLibraryPage = lazy(() => import('@/features/knowledge').then(m => ({ default: m.ClauseLibraryPage })));
const EvidencePage = lazy(() => import('@/features/evidence').then(m => ({ default: m.EvidenceVaultPage })));
const DiscoveryPage = lazy(() => import('@/features/discovery').then(m => ({ default: m.DiscoveryPlatformPage })));
const JurisdictionPage = lazy(() => import('@/features/jurisdiction').then(m => ({ default: m.JurisdictionManagerPage })));
const CasesPage = lazy(() => import('@/features/cases').then(m => ({ default: m.CaseListPage })));
const DocumentsPage = lazy(() => import('@/features/documents').then(m => ({ default: m.DocumentsPage })));
const ResearchPage = lazy(() => import('@/features/research').then(m => ({ default: m.ResearchPage })));

// Migrated feature module pages
const MessagesPage = lazy(() => import('@/features/communication').then(m => ({ default: m.MessagesPage })));
const WorkflowPage = lazy(() => import('@/features/workflow').then(m => ({ default: m.WorkflowPage })));
const AnalyticsDashboardPage = lazy(() => import('@/features/analytics').then(m => ({ default: m.AnalyticsDashboardPage })));
const ComplianceDashboardPage = lazy(() => import('@/features/compliance').then(m => ({ default: m.ComplianceDashboardPage })));
const AdminPanelPage = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminPanelPage })));
const ProfilePage = lazy(() => import('@/features/settings').then(m => ({ default: m.ProfilePage })));

// Route configuration interface
export interface RouteDefinition {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<unknown>>;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  showInSidebar?: boolean;
  category?: 'main' | 'legal' | 'operations' | 'admin';
}

// All application routes
export const routes: RouteDefinition[] = [
  // Main
  {
    path: 'dashboard',
    component: DashboardPage,
    title: 'Dashboard',
    icon: LayoutDashboard,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: 'cases',
    component: CasesPage,
    title: 'Cases',
    icon: Briefcase,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: 'documents',
    component: DocumentsPage,
    title: 'Documents',
    icon: FileText,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: 'calendar',
    component: CalendarPage,
    title: 'Calendar',
    icon: Calendar,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: 'messages',
    component: MessagesPage,
    title: 'Messages',
    icon: MessageSquare,
    showInSidebar: true,
    category: 'main',
  },

  // Legal
  {
    path: 'discovery',
    component: DiscoveryPage,
    title: 'Discovery',
    icon: Microscope,
    showInSidebar: true,
    category: 'legal',
  },
  {
    path: 'evidence',
    component: EvidencePage,
    title: 'Evidence',
    icon: Archive,
    showInSidebar: true,
    category: 'legal',
  },
  {
    path: 'research',
    component: ResearchPage,
    title: 'Research',
    icon: Search,
    showInSidebar: true,
    category: 'legal',
  },
  {
    path: 'clauses',
    component: ClauseLibraryPage,
    title: 'Clauses',
    icon: Gavel,
    showInSidebar: true,
    category: 'legal',
  },
  {
    path: 'jurisdiction',
    component: JurisdictionPage,
    title: 'Jurisdictions',
    icon: Scale,
    showInSidebar: true,
    category: 'legal',
  },

  // Operations
  {
    path: 'billing',
    component: BillingPage,
    title: 'Billing',
    icon: DollarSign,
    showInSidebar: true,
    category: 'operations',
  },
  {
    path: 'crm',
    component: ClientsPage,
    title: 'Clients',
    icon: Users,
    showInSidebar: true,
    category: 'operations',
  },
  {
    path: 'workflows',
    component: WorkflowPage,
    title: 'Workflows',
    icon: GitBranch,
    showInSidebar: true,
    category: 'operations',
  },
  {
    path: 'library',
    component: KnowledgeBasePage,
    title: 'Knowledge',
    icon: BookOpen,
    showInSidebar: true,
    category: 'operations',
  },

  // Admin
  {
    path: 'analytics',
    component: AnalyticsDashboardPage,
    title: 'Analytics',
    icon: BarChart3,
    roles: ['Administrator', 'Senior Partner', 'Partner'],
    showInSidebar: true,
    category: 'admin',
  },
  {
    path: 'compliance',
    component: ComplianceDashboardPage,
    title: 'Compliance',
    icon: Shield,
    roles: ['Administrator', 'Senior Partner', 'Partner'],
    showInSidebar: true,
    category: 'admin',
  },
  {
    path: 'admin',
    component: AdminPanelPage,
    title: 'Admin',
    icon: Settings,
    roles: ['Administrator'],
    showInSidebar: true,
    category: 'admin',
  },

  // Hidden routes
  {
    path: 'profile',
    component: ProfilePage,
    title: 'Profile',
    showInSidebar: false,
  },
];

// Helper to get routes by category
export const getRoutesByCategory = (category: RouteDefinition['category']) => 
  routes.filter(r => r.category === category && r.showInSidebar);

// Helper to check if user has access to route
export const hasRouteAccess = (route: RouteDefinition, userRole?: string): boolean => {
  if (!route.roles) return true;
  if (!userRole) return false;
  return route.roles.includes(userRole as UserRole);
};

// Get route by path
export const getRoute = (path: string): RouteDefinition | undefined =>
  routes.find(r => r.path === path);
