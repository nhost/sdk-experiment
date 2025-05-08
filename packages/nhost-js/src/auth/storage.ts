import { type Session } from "./client";

/**
 * Storage interface for session persistence
 */
export interface StorageInterface {
  /**
   * Get an item from storage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  get(): Session | null;

  /**
   * Set an item in storage
   * @param key - The key to store
   * @param value - The value to store
   */
  set(value: Session): void;

  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  remove(): void;
}

// Default storage key for session data
export const DEFAULT_SESSION_KEY = "nhostSession";

/**
 * Browser localStorage implementation of StorageInterface
 */
export class LocalStorage implements StorageInterface {
  private readonly storageKey: string;

  constructor(storageKey = DEFAULT_SESSION_KEY) {
    this.storageKey = storageKey;
  }

  get(): Session | null {
    try {
      const value = window.localStorage.getItem(this.storageKey);
      return value ? (JSON.parse(value) as Session) : null;
    } catch (e) {
      this.remove();
      return null;
    }
  }

  set(value: Session): void {
    window.localStorage.setItem(this.storageKey, JSON.stringify(value));
  }

  remove(): void {
    window.localStorage.removeItem(this.storageKey);
  }
}

/**
 * In-memory storage implementation for non-browser environments
 */
export class MemoryStorage implements StorageInterface {
  private session: Session | null = null;

  get(): Session | null {
    return this.session;
  }

  set(value: Session): void {
    this.session = value;
  }

  remove(): void {
    this.session = null;
  }
}

export class CookieStorage implements StorageInterface {
  private readonly cookieName: string;
  private readonly expirationDays: number;
  private readonly secure: boolean;
  private readonly sameSite: "strict" | "lax" | "none";

  constructor(
    cookieName = DEFAULT_SESSION_KEY,
    expirationDays = 30,
    secure = true,
    sameSite: "strict" | "lax" | "none" = "lax",
  ) {
    this.cookieName = cookieName;
    this.expirationDays = expirationDays;
    this.secure = secure;
    this.sameSite = sameSite;
  }

  get(): Session | null {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === this.cookieName) {
        try {
          return JSON.parse(decodeURIComponent(value || "")) as Session;
        } catch (e) {
          this.remove();
          return null;
        }
      }
    }
    return null;
  }

  set(value: Session): void {
    const expires = new Date();
    expires.setTime(
      expires.getTime() + this.expirationDays * 24 * 60 * 60 * 1000,
    );

    const cookieValue = encodeURIComponent(JSON.stringify(value));
    const cookieString = `${this.cookieName}=${cookieValue}; expires=${expires.toUTCString()}; path=/; ${this.secure ? "secure; " : ""}SameSite=${this.sameSite}`;

    document.cookie = cookieString;
  }

  remove(): void {
    document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${this.secure ? "secure; " : ""}SameSite=${this.sameSite}`;
  }
}

/**
 * Detects the best available storage implementation for the current environment
 * @returns A storage implementation
 */
export const detectStorage = (): StorageInterface => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      // Test if localStorage is actually available (could be disabled)
      localStorage.setItem("__test", "__test");
      localStorage.removeItem("__test");
      return new LocalStorage();
    } catch (e) {
      console.warn(
        "localStorage is not available, using in-memory storage instead",
      );
    }
  }
  return new MemoryStorage();
};
