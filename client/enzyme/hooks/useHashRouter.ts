/**
 * Enzyme Hash-Based Router Hook
 * 
 * Provides Enzyme-compatible routing using hash-based navigation.
 * This integrates with Enzyme's prefetching and analytics capabilities.
 * 
 * Features:
 * - Type-safe route navigation
 * - Route parameter extraction
 * - Hash change event handling
 * - Integration with Enzyme analytics (usePageView, useTrackEvent)
 * - Stable callback references with useLatestCallback
 * 
 * @example
 * ```tsx
 * const { currentRoute, navigate, params } = useHashRouter();
 * 
 * // Navigate to a route
 * navigate('workflows');
 * 
 * // Navigate with params (e.g., edit-case/123)
 * navigate('edit-case/123');
 * ```
 */

import { useState, useEffect } from 'react';
import { useLatestCallback, useTrackEvent } from '@missionfabric-js/enzyme/hooks';

export interface RouteParams {
  [key: string]: string;
}

export interface HashRouterState {
  currentRoute: string;
  params: RouteParams;
  navigate: (route: string, options?: NavigateOptions) => void;
  back: () => void;
  replace: (route: string) => void;
}

export interface NavigateOptions {
  replace?: boolean;
  trackEvent?: boolean;
  eventName?: string;
}

/**
 * Parse route and extract parameters
 * Supports patterns like:
 * - simple: "workflows"
 * - with-param: "edit-case/123" -> { route: "edit-case", params: { id: "123" } }
 */
const parseRoute = (hash: string): { route: string; params: RouteParams } => {
  if (!hash) {
    return { route: 'dashboard', params: {} };
  }

  const parts = hash.split('/');
  const route = parts[0];
  const params: RouteParams = {};

  // Handle dynamic routes like edit-case/:id
  if (parts.length > 1) {
    // For now, simple pattern: route/id
    params.id = parts.slice(1).join('/');
  }

  return { route, params };
};

/**
 * Enzyme Hash Router Hook
 * 
 * Manages hash-based routing with Enzyme integration for analytics and prefetching.
 */
export const useHashRouter = (): HashRouterState => {
  const trackEvent = useTrackEvent();

  // Parse initial route from URL hash
  const [routeState, setRouteState] = useState(() => {
    const hash = window.location.hash.slice(1);
    return parseRoute(hash);
  });

  // Stable navigate function with analytics tracking
  const navigate = useLatestCallback((
    route: string, 
    options: NavigateOptions = {}
  ) => {
    const { 
      replace = false, 
      trackEvent: shouldTrack = true,
      eventName 
    } = options;

    // Update URL hash
    if (replace) {
      window.location.replace(`#${route}`);
    } else {
      window.location.hash = route;
    }

    // Update state
    const parsed = parseRoute(route);
    setRouteState(parsed);

    // Track navigation event
    if (shouldTrack) {
      trackEvent(eventName || 'route_navigated', {
        route: parsed.route,
        params: parsed.params,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Navigate back in history
  const back = useLatestCallback(() => {
    window.history.back();
  });

  // Replace current route without adding to history
  const replace = useLatestCallback((route: string) => {
    navigate(route, { replace: true });
  });

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const parsed = parseRoute(hash);
      setRouteState(parsed);

      // Track hash change event
      trackEvent('route_changed', {
        route: parsed.route,
        params: parsed.params,
        source: 'hashchange',
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [trackEvent]);

  return {
    currentRoute: routeState.route,
    params: routeState.params,
    navigate,
    back,
    replace,
  };
};

/**
 * Hook to get specific route parameter
 * 
 * @example
 * ```tsx
 * const caseId = useRouteParam('id');
 * ```
 */
export const useRouteParam = (paramName: string): string | undefined => {
  const { params } = useHashRouter();
  return params[paramName];
};

/**
 * Hook to check if currently on a specific route
 * 
 * @example
 * ```tsx
 * const isOnWorkflows = useIsRoute('workflows');
 * ```
 */
export const useIsRoute = (route: string): boolean => {
  const { currentRoute } = useHashRouter();
  return currentRoute === route;
};
