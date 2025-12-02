export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LexiFlow AI';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'lexiflow_auth_token';
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'lexiflow_refresh_token';

export const SIDEBAR_WIDTH = {
  EXPANDED: 240,
  COLLAPSED: 64,
} as const;

export const QUERY_KEYS = {
  AUTH_USER: ['auth', 'user'],
  CASES: ['cases'],
  CASE_DETAIL: (id: string) => ['cases', id],
  DOCUMENTS: ['documents'],
  DOCUMENT_DETAIL: (id: string) => ['documents', id],
  RESEARCH: ['research'],
  BILLING: ['billing'],
  SETTINGS: ['settings'],
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CASES: '/cases',
  CASE_DETAIL: (id: string) => `/cases/${id}`,
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
  RESEARCH: '/research',
  BILLING: '/billing',
  SETTINGS: '/settings',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;
