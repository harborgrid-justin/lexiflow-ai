/**
 * DOM Safety Utilities
 * Helpers for safe DOM manipulation and element access
 */

/**
 * Safely access a DOM element
 */
export function safeGetElement<T extends HTMLElement = HTMLElement>(
  selector: string
): T | null {
  try {
    if (typeof document === 'undefined') return null;
    return document.querySelector<T>(selector);
  } catch (error) {
    console.error('Error accessing DOM element:', error);
    return null;
  }
}

/**
 * Safely access multiple DOM elements
 */
export function safeGetElements<T extends HTMLElement = HTMLElement>(
  selector: string
): NodeListOf<T> | null {
  try {
    if (typeof document === 'undefined') return null;
    return document.querySelectorAll<T>(selector);
  } catch (error) {
    console.error('Error accessing DOM elements:', error);
    return null;
  }
}

/**
 * Safely set innerHTML with sanitization
 */
export function safeSetten<T extends HTMLElement>(
  element: T | null,
  html: string
): void {
  if (!element) return;
  
  try {
    // Basic XSS protection - remove script tags
    const sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    element.innerHTML = sanitized;
  } catch (error) {
    console.error('Error setting innerHTML:', error);
  }
}

/**
 * Safely add event listener with cleanup
 */
export function safeAddEventListener<K extends keyof WindowEventMap>(
  element: HTMLElement | Window | null,
  type: K,
  listener: (this: HTMLElement, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void {
  if (!element) return () => {};

  try {
    element.addEventListener(type, listener as any, options);
    return () => {
      try {
        element.removeEventListener(type, listener as any, options);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  } catch (error) {
    console.error('Error adding event listener:', error);
    return () => {};
  }
}

/**
 * Check if element exists and is visible
 */
export function isElementVisible(element: HTMLElement | null): boolean {
  if (!element) return false;
  
  try {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  } catch (error) {
    console.error('Error checking element visibility:', error);
    return false;
  }
}

/**
 * Safely scroll element into view
 */
export function safeScrollIntoView(
  element: HTMLElement | null,
  options?: ScrollIntoViewOptions
): void {
  if (!element) return;
  
  try {
    element.scrollIntoView(options);
  } catch (error) {
    console.error('Error scrolling into view:', error);
  }
}

/**
 * Safely get computed style
 */
export function safeGetComputedStyle(
  element: HTMLElement | null
): CSSStyleDeclaration | null {
  if (!element || typeof window === 'undefined') return null;
  
  try {
    return window.getComputedStyle(element);
  } catch (error) {
    console.error('Error getting computed style:', error);
    return null;
  }
}

/**
 * Safely focus element
 */
export function safeFocus(element: HTMLElement | null): void {
  if (!element) return;
  
  try {
    element.focus();
  } catch (error) {
    console.error('Error focusing element:', error);
  }
}

/**
 * Safely blur element
 */
export function safeBlur(element: HTMLElement | null): void {
  if (!element) return;
  
  try {
    element.blur();
  } catch (error) {
    console.error('Error blurring element:', error);
  }
}
