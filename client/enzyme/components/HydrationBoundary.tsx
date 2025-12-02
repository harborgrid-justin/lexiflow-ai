/**
 * HydrationBoundary - Progressive Hydration Wrapper Component
 *
 * This is a convenience wrapper around Enzyme's native hydration system.
 * It provides a simplified API for common use cases while leveraging
 * the full power of Enzyme's hydration scheduler.
 *
 * @see https://github.com/harborgrid-justin/enzyme/docs/HYDRATION.md
 *
 * For advanced use cases, consider using the native Enzyme components:
 * - EnzymeHydrationBoundary from '@missionfabric-js/enzyme/hydration'
 * - HydrationProvider for app-wide hydration configuration
 * - useHydrationMetrics for performance monitoring
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useIsMounted, useOnlineStatus } from '@missionfabric-js/enzyme/hooks';

/**
 * Priority levels for hydration (1 = highest priority)
 * - critical: Interactive buttons, forms, navigation (immediate)
 * - high: Above-the-fold content, primary CTAs (visible)
 * - normal: Content sections, cards, standard media (interaction)
 * - low: Below-the-fold, analytics, secondary features (idle)
 * - manual: Modals, hidden tabs, on-demand content (manual trigger)
 */
export type HydrationPriority = 'critical' | 'high' | 'normal' | 'low' | 'manual';

/**
 * Trigger types for when hydration should occur
 */
export type HydrationTrigger = 'immediate' | 'visible' | 'interaction' | 'idle' | 'manual';

export interface HydrationBoundaryProps {
  /** Unique identifier for this hydration boundary */
  id?: string;
  /** Children to render */
  children: React.ReactNode;
  /** Priority level (affects order of hydration) */
  priority?: HydrationPriority;
  /** When to trigger hydration */
  trigger?: HydrationTrigger;
  /** Intersection observer threshold for visibility trigger */
  threshold?: number;
  /** Events that trigger hydration (for interaction trigger) */
  events?: Array<'mouseenter' | 'focus' | 'touchstart' | 'click'>;
  /** Timeout for idle trigger (ms) */
  timeout?: number;
  /** Fallback component while not hydrated */
  fallback?: React.ReactNode;
  /** Callback when hydration completes */
  onHydrated?: () => void;
  /** Skip hydration on slow connections */
  respectConnectionSpeed?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Hook to manually trigger hydration
 */
export function useHydrationTrigger(id: string): {
  triggerHydration: () => void;
  isHydrated: boolean;
} {
  const [isHydrated, setIsHydrated] = useState(false);

  const triggerHydration = () => {
    setIsHydrated(true);
    // Dispatch custom event for HydrationBoundary to listen to
    window.dispatchEvent(new CustomEvent(`enzyme:hydrate:${id}`));
  };

  return { triggerHydration, isHydrated };
}

/**
 * HydrationBoundary Component
 *
 * Wraps components to enable progressive hydration based on various triggers.
 *
 * @example
 * // Immediate hydration for critical interactive elements
 * <HydrationBoundary trigger="immediate">
 *   <CriticalButton onClick={handleClick}>Submit</CriticalButton>
 * </HydrationBoundary>
 *
 * @example
 * // Visibility-based hydration for viewport content
 * <HydrationBoundary trigger="visible" threshold={0.1}>
 *   <ProductCard product={product} />
 * </HydrationBoundary>
 *
 * @example
 * // Idle-time hydration for non-critical features
 * <HydrationBoundary trigger="idle" timeout={2000}>
 *   <AnalyticsDashboard />
 * </HydrationBoundary>
 */
export const HydrationBoundary: React.FC<HydrationBoundaryProps> = ({
  id,
  children,
  priority = 'normal',
  trigger = 'visible',
  threshold = 0.1,
  events = ['mouseenter', 'focus', 'touchstart'],
  timeout = 2000,
  fallback,
  onHydrated,
  respectConnectionSpeed = false,
  className,
}) => {
  const [isHydrated, setIsHydrated] = useState(trigger === 'immediate');
  const [_isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();
  const isOnline = useOnlineStatus();

  // Handle manual trigger via custom event
  useEffect(() => {
    if (!id || trigger !== 'manual') return;

    const handleManualTrigger = () => {
      if (isMounted()) {
        setIsHydrated(true);
      }
    };

    window.addEventListener(`enzyme:hydrate:${id}`, handleManualTrigger);
    return () => {
      window.removeEventListener(`enzyme:hydrate:${id}`, handleManualTrigger);
    };
  }, [id, trigger, isMounted]);

  // Intersection Observer for visibility-based hydration
  useEffect(() => {
    if (trigger !== 'visible' || isHydrated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMounted()) {
            setIsVisible(true);
            setIsHydrated(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [trigger, threshold, isHydrated, isMounted]);

  // Interaction-based hydration
  useEffect(() => {
    if (trigger !== 'interaction' || isHydrated || !containerRef.current) return;

    const handleInteraction = () => {
      if (isMounted()) {
        setIsHydrated(true);
      }
    };

    const element = containerRef.current;
    events.forEach((event) => {
      element.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        element.removeEventListener(event, handleInteraction);
      });
    };
  }, [trigger, events, isHydrated, isMounted]);

  // Idle-based hydration using requestIdleCallback
  useEffect(() => {
    if (trigger !== 'idle' || isHydrated) return;

    let idleCallbackId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(
        () => {
          if (isMounted()) {
            setIsHydrated(true);
          }
        },
        { timeout }
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      timeoutId = setTimeout(() => {
        if (isMounted()) {
          setIsHydrated(true);
        }
      }, timeout);
    }

    return () => {
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [trigger, timeout, isHydrated, isMounted]);

  // Notify when hydration completes
  useEffect(() => {
    if (isHydrated && onHydrated) {
      onHydrated();
    }
  }, [isHydrated, onHydrated]);

  // Respect connection speed if enabled
  const shouldDefer = respectConnectionSpeed && !isOnline;

  // Priority-based delay mapping
  const getPriorityDelay = (): number => {
    switch (priority) {
      case 'critical': return 0;
      case 'high': return 50;
      case 'normal': return 150;
      case 'low': return 300;
      case 'manual': return 0;
      default: return 150;
    }
  };

  // Apply priority-based delay
  useEffect(() => {
    if (trigger === 'immediate' && priority !== 'critical') {
      const delay = getPriorityDelay();
      const timeoutId = setTimeout(() => {
        if (isMounted()) {
          setIsHydrated(true);
        }
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [trigger, priority, isMounted]);

  const defaultFallback = (
    <div
      className={`animate-pulse bg-slate-100 rounded ${className || ''}`}
      style={{ minHeight: '100px' }}
      aria-hidden="true"
    />
  );

  return (
    <div
      ref={containerRef}
      className={className}
      data-hydration-id={id}
      data-hydration-priority={priority}
      data-hydration-trigger={trigger}
      data-hydrated={isHydrated}
    >
      {isHydrated && !shouldDefer ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

/**
 * LazyHydration - Convenience wrapper for common use cases
 *
 * @example
 * <LazyHydration priority="low" trigger="idle">
 *   <HeavyComponent />
 * </LazyHydration>
 */
export const LazyHydration: React.FC<Omit<HydrationBoundaryProps, 'id'>> = (props) => {
  const [id] = useState(() => `lazy-${Math.random().toString(36).substr(2, 9)}`);
  return <HydrationBoundary id={id} {...props} />;
};

export default HydrationBoundary;
