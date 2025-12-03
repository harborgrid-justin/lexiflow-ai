/**
 * ENZYME MIGRATION: Safe DOM Utility Hooks
 *
 * Enhanced with Enzyme patterns for better stability and performance.
 */

import { useEffect, useRef, RefObject } from 'react';
import { safeFocus, safeScrollIntoView } from '../../utils/dom-safety';
import { useLatestCallback } from '../index';

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
 * Enhanced with useLatestCallback to prevent re-renders
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): RefObject<T> {
  const ref = useRef<T>(null);
  const stableCallback = useLatestCallback(callback);

  useEffect(() => {
    const handler = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        stableCallback();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [stableCallback]);

  return ref;
}

/**
 * Safely handle escape key
 * Enhanced with useLatestCallback
 */
export function useEscapeKey(callback: () => void): void {
  const stableCallback = useLatestCallback(callback);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stableCallback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [stableCallback]);
}

/**
 * Safely scroll into view
 */
export function useScrollIntoView<T extends HTMLElement>(
  deps: unknown[] = []
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      safeScrollIntoView(ref.current, { behavior: 'smooth', block: 'nearest' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Safely handle window resize
 * Enhanced with useLatestCallback
 */
export function useWindowResize(callback: (width: number, height: number) => void): void {
  const stableCallback = useLatestCallback(callback);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => {
      stableCallback(window.innerWidth, window.innerHeight);
    };

    // Call once on mount
    handler();

    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [stableCallback]);
}
