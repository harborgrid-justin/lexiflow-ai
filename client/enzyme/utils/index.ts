// Enzyme utility functions
export const getEnzymeVersion = () => '1.1.0';

export const isEnzymeEnabled = () => {
  return typeof window !== 'undefined' && window.__ENZYME_ENABLED__;
};

// Network utilities
export const getConnectionType = (): string => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  const conn = (navigator as any).connection;
  return conn?.effectiveType || 'unknown';
};

export const isFastConnection = (): boolean => {
  const type = getConnectionType();
  return type === '4g' || type === 'unknown';
};

declare global {
  interface Window {
    __ENZYME_ENABLED__?: boolean;
  }
}
