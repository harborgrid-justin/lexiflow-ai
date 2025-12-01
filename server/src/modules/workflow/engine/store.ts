// In-Memory Store for Workflow Engine
// Thread-safe storage with TTL support

import { v4 as uuidv4 } from 'uuid';

export class InMemoryStore<T> {
  private store = new Map<string, { value: T; expiresAt?: number }>();
  private readonly defaultTTL?: number;

  constructor(defaultTTL?: number) {
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiresAt = ttl || this.defaultTTL
      ? Date.now() + (ttl || this.defaultTTL!)
      : undefined;
    this.store.set(key, { value, expiresAt });
  }

  get(key: string): T | undefined {
    const item = this.store.get(key);
    if (!item) {return undefined;}

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  values(): T[] {
    this.cleanup();
    return Array.from(this.store.values()).map(item => item.value);
  }

  keys(): string[] {
    this.cleanup();
    return Array.from(this.store.keys());
  }

  entries(): Array<[string, T]> {
    this.cleanup();
    return Array.from(this.store.entries()).map(([k, v]) => [k, v.value]);
  }

  size(): number {
    this.cleanup();
    return this.store.size;
  }

  filter(predicate: (value: T, key: string) => boolean): T[] {
    return this.entries()
      .filter(([k, v]) => predicate(v, k))
      .map(([_, v]) => v);
  }

  find(predicate: (value: T, key: string) => boolean): T | undefined {
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.store.delete(key);
        continue;
      }
      if (predicate(item.value, key)) {
        return item.value;
      }
    }
    return undefined;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Specialized store for arrays
export class ArrayStore<T> {
  private store = new Map<string, T[]>();

  push(key: string, value: T): void {
    const arr = this.store.get(key) || [];
    arr.push(value);
    this.store.set(key, arr);
  }

  get(key: string): T[] {
    return this.store.get(key) || [];
  }

  getAll(): T[] {
    const all: T[] = [];
    this.store.forEach(arr => all.push(...arr));
    return all;
  }

  filter(key: string, predicate: (value: T) => boolean): T[] {
    return this.get(key).filter(predicate);
  }

  remove(key: string, predicate: (value: T) => boolean): void {
    const arr = this.store.get(key);
    if (arr) {
      this.store.set(key, arr.filter(item => !predicate(item)));
    }
  }

  clear(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  size(key?: string): number {
    if (key) {
      return this.get(key).length;
    }
    let total = 0;
    this.store.forEach(arr => total += arr.length);
    return total;
  }
}

// Generate unique IDs
export function generateId(prefix = ''): string {
  return prefix ? `${prefix}-${uuidv4()}` : uuidv4();
}
