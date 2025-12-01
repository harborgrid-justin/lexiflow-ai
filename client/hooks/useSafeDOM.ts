import { useEffect, useRef, RefObject } from 'react';
import { safeFocus, safeScrollIntoView, safeAddEventListener } from '../utils/dom-safety';

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
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const cleanup = safeAddEventListener(document as any, 'mousedown', handleClickOutside as any);
    return cleanup;
  }, [callback]);

  return ref;
}

/**
 * Safely handle escape key
 */
export function useEscapeKey(callback: () => void): void {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    const cleanup = safeAddEventListener(document as any, 'keydown', handleEscape as any);
    return cleanup;
  }, [callback]);
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
 */
export function useWindowResize(callback: (width: number, height: number) => void): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      callback(window.innerWidth, window.innerHeight);
    };

    handleResize(); // Call once on mount

    const cleanup = safeAddEventListener(window, 'resize', handleResize as any);
    return cleanup;
  }, [callback]);
}

/**
 * Safely handle intersection observer
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    try {
      const observer = new IntersectionObserver(
        ([entry]) => callback(entry.isIntersecting),
        options
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up IntersectionObserver:', error);
    }
  }, [callback, options]);

  return ref;
}

/**
 * Safely handle local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

import React from 'react';
