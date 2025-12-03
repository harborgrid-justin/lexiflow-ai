/**
 * Cache Service Implementation
 * 
 * Client-side caching service that implements ICacheService contract.
 * Uses browser storage APIs with TTL support and memory fallback.
 */

import { ICacheService } from '../contracts';

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
  createdAt: number;
}

export class CacheService implements ICacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private defaultTtl = 5 * 60 * 1000; // 5 minutes
  private useLocalStorage = true;

  constructor(options?: { defaultTtl?: number; useLocalStorage?: boolean }) {
    this.defaultTtl = options?.defaultTtl ?? this.defaultTtl;
    this.useLocalStorage = options?.useLocalStorage ?? this.isLocalStorageAvailable();
    
    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      if (!this.isExpired(memoryEntry)) {
        return memoryEntry.value;
      }
      this.memoryCache.delete(key);
    }

    // Check localStorage if available
    if (this.useLocalStorage) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (!this.isExpired(entry)) {
            // Restore to memory cache
            this.memoryCache.set(key, entry);
            return entry.value;
          }
          localStorage.removeItem(`cache_${key}`);
        }
      } catch (error) {
        console.warn('Failed to read from localStorage cache:', error);
      }
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + ttl : Date.now() + this.defaultTtl;
    const entry: CacheEntry<T> = {
      value,
      expiresAt,
      createdAt: Date.now()
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in localStorage if available and value is serializable
    if (this.useLocalStorage) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to write to localStorage cache:', error);
      }
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    
    if (this.useLocalStorage) {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to delete from localStorage cache:', error);
      }
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.useLocalStorage) {
      try {
        // Remove all cache entries from localStorage
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('cache_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear localStorage cache:', error);
      }
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async getKeys(pattern?: string): Promise<string[]> {
    const allKeys = new Set<string>();
    
    // Get keys from memory cache
    for (const key of this.memoryCache.keys()) {
      if (!pattern || key.includes(pattern)) {
        allKeys.add(key);
      }
    }

    // Get keys from localStorage
    if (this.useLocalStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey?.startsWith('cache_')) {
            const key = storageKey.substring(6); // Remove 'cache_' prefix
            if (!pattern || key.includes(pattern)) {
              allKeys.add(key);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to get keys from localStorage cache:', error);
      }
    }

    return Array.from(allKeys);
  }

  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return entry.expiresAt !== undefined && Date.now() > entry.expiresAt;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private cleanup(): void {
    // Clean up expired entries from memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean up expired entries from localStorage
    if (this.useLocalStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey?.startsWith('cache_')) {
            try {
              const entry = JSON.parse(localStorage.getItem(storageKey)!);
              if (this.isExpired(entry)) {
                keysToRemove.push(storageKey);
              }
            } catch {
              // Remove corrupted entries
              keysToRemove.push(storageKey);
            }
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to cleanup localStorage cache:', error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memorySize: number;
    localStorageSize: number;
    totalEntries: number;
  } {
    let localStorageSize = 0;
    
    if (this.useLocalStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('cache_')) {
            localStorageSize++;
          }
        }
      } catch {
        // Ignore errors
      }
    }

    return {
      memorySize: this.memoryCache.size,
      localStorageSize,
      totalEntries: this.memoryCache.size + localStorageSize
    };
  }
}