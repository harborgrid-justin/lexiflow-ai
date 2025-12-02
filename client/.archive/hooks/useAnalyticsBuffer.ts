import { useBuffer } from '@missionfabric-js/enzyme/hooks';
import { useRef, useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// ✅ ENZYME: Buffered analytics to reduce API calls
export const useAnalyticsBuffer = () => {
  const hasInitialized = useRef(false);

  const analyticsBuffer = useBuffer<AnalyticsEvent>({
    maxSize: 10,           // Flush when 10 events accumulated
    flushInterval: 5000,   // Flush every 5 seconds
    onFlush: async (events) => {
      if (events.length === 0) return;
      
      console.log(`📊 Flushing ${events.length} analytics events:`, events);
      
      try {
        // In production, send to analytics service
        await fetch('/api/v1/analytics/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events })
        });
      } catch (err) {
        console.error('Failed to send analytics batch:', err);
      }
    }
  });

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      console.log('✅ Analytics buffer initialized');
    }
  }, []);

  const trackEvent = (event: string, metadata?: Record<string, any>) => {
    analyticsBuffer.add({
      event,
      timestamp: Date.now(),
      metadata
    });
  };

  return {
    trackEvent,
    buffer: analyticsBuffer
  };
};
