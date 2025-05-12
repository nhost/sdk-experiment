/**
 * @fileoverview Storage implementations for session persistence in different environments.
 *
 * This module provides different storage adapters for persisting authentication sessions
 * across page reloads and browser sessions.
 */

import { type Session } from "./auth";

/**
 * Session storage interface for session persistence.
 * This interface can be implemented to provide custom storage solutions.
 */
export interface SessionStorageInterface {
  /**
   * Get the current session from storage
   * @returns The stored session or null if not found
   */
  get(): Session | null;

  /**
   * Set the session in storage
   * @param value - The session to store
   */
  set(value: Session): void;

  /**
   * Remove the session from storage
   */
  remove(): void;
}

/**
 * Default storage key used for storing the Nhost session
 */
export const DEFAULT_SESSION_KEY = "nhostSession";

/**
 * Browser localStorage implementation of StorageInterface.
 * Persists the session across page reloads and browser restarts.
 */
export class LocalStorage implements SessionStorageInterface {
  private readonly storageKey: string;

  /**
   * Creates a new LocalStorage instance
   * @param storageKey - The key to use in localStorage (defaults to "nhostSession")
   */
  constructor(storageKey = DEFAULT_SESSION_KEY) {
    this.storageKey = storageKey;
  }

  /**
   * Gets the session from localStorage
   * @returns The stored session or null if not found
   */
  get(): Session | null {
    try {
      const value = window.localStorage.getItem(this.storageKey);
      return value ? (JSON.parse(value) as Session) : null;
    } catch (e) {
      this.remove();
      return null;
    }
  }

  /**
   * Sets the session in localStorage
   * @param value - The session to store
   */
  set(value: Session): void {
    window.localStorage.setItem(this.storageKey, JSON.stringify(value));
  }

  /**
   * Removes the session from localStorage
   */
  remove(): void {
    window.localStorage.removeItem(this.storageKey);
  }
}

/**
 * In-memory storage implementation for non-browser environments or when
 * persistent storage is not available or desirable.
 */
export class MemoryStorage implements SessionStorageInterface {
  private session: Session | null = null;

  /**
   * Gets the session from memory
   * @returns The stored session or null if not set
   */
  get(): Session | null {
    return this.session;
  }

  /**
   * Sets the session in memory
   * @param value - The session to store
   */
  set(value: Session): void {
    this.session = value;
  }

  /**
   * Clears the session from memory
   */
  remove(): void {
    this.session = null;
  }
}

/**
 * Cookie-based storage implementation.
 * This storage uses web browser cookies to store the session so it's not
 * available in server-side environments. It is useful though for sinchronizing
 * sessions between client and server environments.
 */
export class CookieStorage implements SessionStorageInterface {
  private readonly cookieName: string;
  private readonly expirationDays: number;
  private readonly secure: boolean;
  private readonly sameSite: "strict" | "lax" | "none";

  /**
   * Creates a new CookieStorage instance
   * @param cookieName - Name of the cookie to use (defaults to "nhostSession")
   * @param expirationDays - Number of days until the cookie expires (defaults to 30)
   * @param secure - Whether to set the Secure flag on the cookie (defaults to true)
   * @param sameSite - SameSite policy for the cookie (defaults to "lax")
   */
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

  /**
   * Gets the session from cookies
   * @returns The stored session or null if not found
   */
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

  /**
   * Sets the session in a cookie
   * @param value - The session to store
   */
  set(value: Session): void {
    const expires = new Date();
    expires.setTime(
      expires.getTime() + this.expirationDays * 24 * 60 * 60 * 1000,
    );

    const cookieValue = encodeURIComponent(JSON.stringify(value));
    const cookieString = `${this.cookieName}=${cookieValue}; expires=${expires.toUTCString()}; path=/; ${this.secure ? "secure; " : ""}SameSite=${this.sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Removes the session cookie
   */
  remove(): void {
    document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${this.secure ? "secure; " : ""}SameSite=${this.sameSite}`;
  }
}

/**
 * Detects the best available storage implementation for the current environment.
 *
 * The detection process follows this order:
 * 1. Try to use localStorage if we're in a browser environment
 * 2. Fall back to in-memory storage if localStorage isn't available
 *
 * @returns The best available storage implementation for the current environment
 */
export const detectStorage = (): SessionStorageInterface => {
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
