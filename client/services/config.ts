// API Configuration Module
// Handles base URL configuration for different environments

const trimTrailingSlash = (value?: string | null): string | null => {
  if (!value || typeof value !== 'string') return null;
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const getCodespacesApiOrigin = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const { protocol, hostname } = window.location;
  if (!hostname || typeof hostname !== 'string') {
    return null;
  }
  
  const isCodespaceHost = hostname.endsWith('.app.github.dev') || hostname.endsWith('.github.dev');
  if (!isCodespaceHost) {
    return null;
  }

  // Match patterns like: ideal-space-system-9r7q47w4xjf7rwx-3000.app.github.dev
  const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
  if (!match) {
    return null;
  }

  const [, base, port] = match;
  const apiPort = '3001';

  // If we're already on the API port, reuse the current origin.
  if (port === apiPort) {
    return `${protocol}//${hostname}`;
  }

  return `${protocol}//${base}-${apiPort}.app.github.dev`;
};

const getApiBaseUrl = (): string => {
  const envApiUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_URL : undefined;
  const normalizedEnvUrl = trimTrailingSlash(envApiUrl);
  const isEnvLocalhost = normalizedEnvUrl ? /localhost|127\.0\.0\.1/i.test(normalizedEnvUrl) : false;

  // In development mode (with Vite dev server), always use the proxy
  // This works both locally and in Codespaces
  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    return '/api/v1';
  }

  const codespacesOrigin = getCodespacesApiOrigin();
  if (codespacesOrigin && (!normalizedEnvUrl || isEnvLocalhost)) {
    return `${codespacesOrigin}/api/v1`;
  }

  if (normalizedEnvUrl) {
    return `${normalizedEnvUrl}/api/v1`;
  }

  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      return '/api/v1';
    }

    const codespaceFallback = getCodespacesApiOrigin();
    if (codespaceFallback) {
      return `${codespaceFallback}/api/v1`;
    }
  }

  return 'http://localhost:3001/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Get auth token from localStorage or session storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

/**
 * Get auth headers with Content-Type
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Get auth headers without Content-Type (for file uploads)
 */
export const getAuthHeadersWithoutContentType = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
