/**
 * Storage interface for session persistence
 */
export interface StorageInterface {
  /**
   * Get an item from storage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null;

  /**
   * Set an item in storage
   * @param key - The key to store
   * @param value - The value to store
   */
  setItem(key: string, value: string): void;

  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  removeItem(key: string): void;
}

// Default storage key for session data
export const DEFAULT_SESSION_KEY = 'nhostSession';

/**
 * Browser localStorage implementation of StorageInterface
 */
export class LocalStorage implements StorageInterface {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

/**
 * In-memory storage implementation for non-browser environments
 */
export class MemoryStorage implements StorageInterface {
  private storage: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.storage[key] || null;
  }

  setItem(key: string, value: string): void {
    this.storage[key] = value;
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }
}

export class CookieStorage implements StorageInterface {
    /**
     * Get an item from the cookie storage
     */
    getItem(key: string): string | null {
      const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    }

    /**
     * Set an item in cookie storage
     */
    setItem(key: string, value: string): void {
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Lax;`;
    }

    /**
     * Remove an item from cookie storage
     */
    removeItem(key: string): void {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
    }
  }

/**
 * Detects the best available storage implementation for the current environment
 * @returns A storage implementation
 */
export const detectStorage = (): StorageInterface => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      // Test if localStorage is actually available (could be disabled)
      localStorage.setItem('__test', '__test');
      localStorage.removeItem('__test');
      return new CookieStorage();
    } catch (e) {
      console.warn('localStorage is not available, using in-memory storage instead');
    }
  }
  return new MemoryStorage();
};
