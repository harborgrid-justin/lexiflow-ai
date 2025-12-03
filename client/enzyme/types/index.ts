// Enzyme types
export interface EnzymeConfig {
  enableHydration?: boolean;
  enablePrefetch?: boolean;
  minConnectionQuality?: 'slow-2g' | '2g' | '3g' | '4g';
  analyticsBufferSize?: number;
  analyticsFlushInterval?: number;
}

export interface NetworkInfo {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export * from './services';

