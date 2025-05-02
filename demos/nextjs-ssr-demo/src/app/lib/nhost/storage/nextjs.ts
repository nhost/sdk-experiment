import { type StorageInterface } from 'nhost-js';
import { type NextRequest, NextResponse } from 'next/server';


/**
 * Server-side cookie storage for Nhost client in Next.js middleware
 */
export class ServerMiddlewareCookieStorage implements StorageInterface {
    private req: NextRequest | null = null;
    private res: NextResponse | null = null;

    /**
     * Set the request and response objects for the middleware context
     */
    setContext(req: NextRequest, res: NextResponse) {
      this.req = req;
      this.res = res;
    }

    /**
     * Get an item from the cookie storage
     */
    getItem(key: string): string | null {
      if (!this.req) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      return this.req.cookies.get(key)?.value || null;
    }

    /**
     * Set an item in cookie storage
     */
    setItem(key: string, value: string): void {
      if (!this.res) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      // Set cookie with appropriate options to ensure it persists
      this.res.cookies.set({
        name: key,
        value: value,
        path: '/',
        httpOnly: false, //if set to true we can't access it in the client
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // Use a long max-age to ensure the cookie persists
        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      });
    }

    /**
     * Remove an item from cookie storage
     */
    removeItem(key: string): void {
      if (!this.res) {
        throw new Error('ServerCookieStorage is not initialized with middleware context');
      }

      this.res.cookies.delete(key);
    }
  }

  /**
   * Create a storage instance for the Nhost client to use in middleware
   */
  export function createServerMiddlewareCookieStorage(req: NextRequest, res: NextResponse): ServerMiddlewareCookieStorage {
    const storage = new ServerMiddlewareCookieStorage();
    storage.setContext(req, res);
    return storage;
  }
