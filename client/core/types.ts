/**
 * Core Types
 */

import type { ComponentType, LazyExoticComponent } from 'react';
import type { UserRole } from '@/types';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'cases' | 'documents' | 'billing' | 'admin' | 'analytics' | 'compliance' | 'system';
}

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  roles?: UserRole[];
  description?: string;
}

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType<any>>;
  title: string;
  icon?: ComponentType<any>;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  featureFlag?: string;
  children?: RouteConfig[];
}

export interface NavigationItem {
  path: string;
  label: string;
  icon: ComponentType<any>;
  roles?: UserRole[];
  badge?: number | string;
  children?: NavigationItem[];
}

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: Record<string, boolean>;
  theme: {
    primaryColor: string;
    mode: 'light' | 'dark' | 'system';
  };
}
