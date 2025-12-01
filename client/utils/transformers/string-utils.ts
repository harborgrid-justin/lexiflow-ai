// String Conversion Utilities
// Functions for converting between snake_case and camelCase

/**
 * Convert snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Deep convert object keys from snake_case to camelCase
 */
export function objectSnakeToCamel<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(objectSnakeToCamel) as any;

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = objectSnakeToCamel(obj[key]);
    }
  }
  return result;
}

/**
 * Deep convert object keys from camelCase to snake_case
 */
export function objectCamelToSnake<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(objectCamelToSnake) as any;

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = objectCamelToSnake(obj[key]);
    }
  }
  return result;
}

/**
 * Safely convert tags to array format
 * Handles: undefined, null, string, array
 */
export function ensureTagsArray(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(t => typeof t === 'string');
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

/**
 * Safely convert a value to a number
 * Handles: undefined, null, string (DECIMAL from PostgreSQL), number
 */
export function toNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return 0;
}
