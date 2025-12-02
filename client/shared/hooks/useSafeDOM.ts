/**
 * ENZYME MIGRATION: Safe DOM Utility Hooks
 *
 * Enhanced with Enzyme patterns for better stability and performance:
 * - useLatestCallback: Prevents unnecessary re-renders from callback changes
 * - useEventListener: Enzyme's built-in event handling with automatic cleanup
 * - useSafeState: Memory-leak-safe state management
 * - useIsMounted: Guards for async operations
 *
 * @see /workspaces/lexiflow-ai/client/enzyme/MIGRATION_PLAN.md
 */

import { useEffect, useRef, RefObject } from 'react';
import { safeFocus, safeScrollIntoView } from '../utils/dom-safety';
import {
  useLatestCallback,
  useIsMounted,
  useEventListener,
  useSafeState
} from '../enzyme';

/**
 * Safely focus an element on mount
 */
export function useAutoFocus<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      safeFocus(ref.current);
    }
  }, []);

  return ref;
}

/**
 * Safely handle click outside
 * Enhanced with useLatestCallback to prevent re-renders and useEventListener for better cleanup
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): RefObject<T> {
  const ref = useRef<T>(null);
  const stableCallback = useLatestCallback(callback);

  useEventListener('mousedown', (event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      stableCallback();
    }
  }, { target: document });

  return ref;
}

/**
 * Safely handle escape key
 * Enhanced with useLatestCallback and useEventListener
 */
export function useEscapeKey(callback: () => void): void {
  const stableCallback = useLatestCallback(callback);

  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      stableCallback();
    }
  }, { target: document });
}

/**
 * Safely scroll into view
 */
export function useScrollIntoView<T extends HTMLElement>(
  deps: any[] = []
): RefObject<T> {
  const ref = useRef<T>(null);

   
  useEffect(() => {
    if (ref.current) {
      safeScrollIntoView(ref.current, { behavior: 'smooth', block: 'nearest' });
    }
  }, deps);

  return ref;
}

/**
 * Safely handle window resize
 * Enhanced with useLatestCallback and useEventListener
 */
export function useWindowResize(callback: (width: number, height: number) => void): void {
  const stableCallback = useLatestCallback(callback);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Call once on mount
    stableCallback(window.innerWidth, window.innerHeight);
  }, [stableCallback]);

  useEventListener('resize', () => {
    if (typeof window !== 'undefined') {
      stableCallback(window.innerWidth, window.innerHeight);
    }
  }, { target: typeof window !== 'undefined' ? window : undefined });
}

/**
 * Safely handle intersection observer
 * Enhanced with useLatestCallback and useIsMounted for async safety
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
): RefObject<T> {
  const ref = useRef<T>(null);
  const stableCallback = useLatestCallback(callback);
  const isMounted = useIsMounted();

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (isMounted()) {
            stableCallback(entry.isIntersecting);
          }
        },
        options
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up IntersectionObserver:', error);
    }
  }, [stableCallback, options, isMounted]);

  return ref;
}

/**
 * Safely handle local storage
 * Enhanced with useSafeState and useLatestCallback
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useSafeState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useLatestCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  });

  return [storedValue, setValue];
}
